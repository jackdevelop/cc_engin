import { handler, gen_handler } from "../utils/handler"
import { extend } from "../utils/extend"

import {wxConsts} from "./wxconsts"
import {wxSession} from "./wxsession"
import {WxResponseType, WxTaskType, WxTaskPool, WxTask, WxLoginTask, WxUserInfoTask, WxRequestTask} from "./wxhttptask"
// import { pop_mgr } from "../ui/pop_mgr"
import { wxTip } from "./wxtips"


interface RequestHandler 
{
    cb:handler;
    ctx:cc.Component;
}

interface RequestParams
{
    data?:any;
    header?:object;
    method?:string;
    dataType?:string;
    responseType?:string;
}

const buildAuthHeader = () => {
    const header = {};
    const session = wxSession.get();
    if(session)
    {
        header[wxConsts.WX_HEADER_SKEY] = session;
    }
    return header;
}

const buildRequestHeader = () => {
    const header = {};
    header[wxConsts.CONTENT_TYPE] = "application/x-www-form-urlencoded";
    return header;
}

export const RequestAction = {
    Login:"login",
    User:"user",
    Pass:"pass",
    Share:"share",
    Hint:"hint",
    Friend:"friend",
    Rank:"rank",
    GetGift:"getgift",
}

const enum ResponseCode{
	ECodeSuccess       = 0,  // 成功
	ECodeError         = 1, // 通用错误
	ECodeServerError   = 2,  // 服务器内部数据错误
	ECodeNotLogin      = 10, // 未登录
	ECodeWrongParam    = 11, // 错误的参数
    ECodeNoEnoughMoney = 12, // 钱不够
    ECodeShareSameGroup = 13,   //分享到相同的群
}

class WxHttpClient
{
    private serverURL:string;
    private session:number;
    private errorHandler:handler;
    private requestHandlers:Map<string, RequestHandler[]>;
    private ctxRequests:Map<cc.Component, string[]>;
    private taskPool:WxTaskPool;
    private taskQueue:WxTask[];//TODO: use real queue

    constructor()
    {
        this.session = 0;
        this.requestHandlers = new Map();
        this.ctxRequests = new Map();
        this.taskPool = new WxTaskPool();
        this.taskQueue = [];
        this.errorHandler = gen_handler(this.defaultErrorHandler, this);
    }

    private createTask(taskType:WxTaskType)
    {
        let task = this.getFromPool(taskType);
        if(task)
        {
            return task;
        }
        if(taskType == WxTaskType.Login)
        {
            return new WxLoginTask(taskType);
        }
        else if(taskType == WxTaskType.UserInfo)
        {
            return new WxUserInfoTask(taskType);
        }
        else if(taskType == WxTaskType.Request)
        {
            return new WxRequestTask(taskType);
        }
        else
        {
            console.log("unknown task type");
            return null;
        }
    }

    private getFromPool(taskType:WxTaskType)
    {
        return this.taskPool.get(taskType);
    }
    
    private putToPool(taskType:WxTaskType, task:WxTask)
    {
        this.taskPool.put(taskType, task);
    }

    setServerURL(url:string)
    {
        this.serverURL = url;
    }

    login()
    {
        //wx.login
        const task:WxTask = this.createTask(WxTaskType.Login);
        task.init(
            {}, 
            gen_handler(this.handleWxLogin, this),
        );
        task.exec();
    }

    private handleWxLogin(taskType:WxTaskType, task:WxTask, responseType:WxResponseType, resp)
    {
        this.putToPool(taskType, task);

        if(responseType === WxResponseType.Fail)
        {
            console.log("WxLoginTask fail", resp);
            return;
        }

        if(responseType === WxResponseType.Complete)
        {
            console.log("WxLoginTask complete", resp);
            return;
        }
        console.log("WxLoginTask success", resp);

        //wx.login->wx.getUserInfo
        task = this.createTask(WxTaskType.UserInfo);
        task.init(
            {
                withCredentials:true,
                lang:"zh_CN",
            }, 
            gen_handler(this.handleWxGetUserInfo, this),
            resp.code,
        );
        task.exec();
    }

    private handleWxGetUserInfo(taskType:WxTaskType, task:WxTask, responseType:WxResponseType, resp, code:string)
    {
        this.putToPool(taskType, task);

        if(responseType === WxResponseType.Fail)
        {
            console.log("WxUserInfoTask fail", resp);
            return;
        }

        if(responseType === WxResponseType.Complete)
        {
            console.log("WxUserInfoTask complete", resp);
            return;
        }
        console.log("WxUserInfoTask success", resp);

        //wx.login->wx.getUserInfo->wx.request->应用程序登录
        this.request(RequestAction.Login, {
            header:{
                [wxConsts.WX_HEADER_CODE]:code,
                [wxConsts.WX_HEADER_ENCRYPTED_DATA]:resp.encryptedData,
                [wxConsts.WX_HEADER_IV]:resp.iv,
            }
        }, resp.userInfo);
    }

    request(action:string, params?:RequestParams, ...reqData)
    {
        if(!this.serverURL)
        {
            console.log("should call setServerURL before");
            return;
        }

        //需要登录才能调用其它接口
        if(action !== RequestAction.Login && !wxSession.get())
        {
            //todo 跳转到登录页
            return;
        }

        const task:WxTask = this.createTask(WxTaskType.Request);
        task.init(
            {
                url:`${this.serverURL}/${action}`,
                data:(params && params.data) || {},
                header:extend({}, (params && params.header) || {}, buildAuthHeader(), buildRequestHeader()),
                method:(params && params.method) || "POST",
                dataType:(params && params.dataType) || "json",
                responseType:(params && params.responseType) || "text",
            },
            gen_handler(this.handleResponse, this),
            action,
            ...reqData,
        );

        //避免超过最大并发数量
        // if(this.session > WxConsts.MaxRequests)
        // {
        //     this.taskQueue = this.taskQueue || [];
        //     this.taskQueue.push(task);
        //     TimerMgr.getInst().once(1/30, utils.gen_handler(() => {
        //         const req2 = this.taskQueue.shift()
        //     }, this));
        // }
        // else
        // {
            task.exec();
            this.session++;
        // }
    }

    private handleResponse(taskType:WxTaskType, task:WxTask, responseType:WxResponseType, resp, action:string, ...reqData)
    {
        //回收入池
        this.session--;
        this.putToPool(taskType, task);

        if(responseType === WxResponseType.Fail)
        {
            console.log(`WxTaskType${taskType} ${action} fail`, resp);
            return;
        }

        if(responseType === WxResponseType.Complete)
        {
            console.log(`WxTaskType${taskType} ${action} complete`, resp);
            return;
        }
        console.log(`WxTaskType${taskType} ${action} success`, resp);
        
        //msg是开发者服务器返回的数据, 结构{code, errmsg, data}
        const msg = resp.data;
        const isOK = msg.code === 0;
        if(!isOK)
        {
            this.errorHandler.exec(msg.code, msg.errmsg);
        }
        
        //执行请求监听函数
        const handlers = this.requestHandlers.get(action);
        if(!handlers)
        {
            return;
        }
        handlers.forEach(h => {
            if(!cc.isValid(h.ctx))
            {
                return;
            }
            h.cb.exec(isOK, msg.data, ...reqData);
        });
    }

    registerHandler(action:string, cb:handler, ctx:cc.Component)
    {
        //request -> handler
        let handlers = this.requestHandlers.get(action);
        if(!handlers)
        {
            handlers = [];
            this.requestHandlers.set(action, handlers);
        }
        handlers.push({cb, ctx});

        //context -> requests
        let requests = this.ctxRequests.get(ctx);
        if(!requests)
        {
            requests = [];
            this.ctxRequests.set(ctx, requests);
        }
        requests.push(action);
    }

    unregisterHandler(action:string, cb:handler, ctx:cc.Component)
    {
        //remove from requestHandlers
        const handlers = this.requestHandlers.get(action);
        if(handlers && handlers.length)
        {
            const index = handlers.findIndex(h => h.cb == cb && h.ctx == ctx);
            if(index !== -1)
            {
                handlers.splice(index, 1);
            }
        }

        //remove from ctxRequests
        const requests = this.ctxRequests.get(ctx);
        if(requests && requests.length)
        {
            const index = requests.findIndex(r => r === action);
            if(index !== -1)
            {
                requests.splice(index, 1);
            }
        }
    }

    unregisterCtxHandler(ctx:cc.Component)
    {
        const requests = this.ctxRequests.get(ctx);
        if(!requests)
        {
            return;
        }
        requests.forEach(r => {
            const handlers = this.requestHandlers.get(r);
            if(!handlers)
            {
                return;
            }
            for(let i = handlers.length - 1; i >= 0; i--)
            {
                if(handlers[i].ctx !== ctx)
                {
                    continue;
                }
                handlers.splice(i, 1);
            }
        });
        requests.length = 0;
    }

    registerErrorHandler(handler:handler)
    {
        this.errorHandler = handler;
    }

    private defaultErrorHandler(code:ResponseCode, errmsg:string)
    {
        console.log(`请求响应失败, code=${code}`, errmsg);
        //需要重新登录, 跳到登录页
        if(code == ResponseCode.ECodeNotLogin)
        {
            wxSession.clear();
            //跳到登录页
            wxTip.showToast("本次会话过期，请重新登录");
            // pop_mgr.get_inst().clear();
        }
        else if(code == ResponseCode.ECodeShareSameGroup)
        {
            wxTip.showToast("试试分享到不同的群吧");
        }
    }
}


export const wxHttpClient: WxHttpClient = new WxHttpClient();
