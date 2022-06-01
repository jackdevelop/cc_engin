// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PositionExtension from "./PositionExtension";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BezierHelp {

    /**{*切割曲线的距离 像素}  */
    static ONE_STEP_LEN:number = 10

	public static Factorial(number) {
		let factorial = 1;
		let temp = number;
		for (let i = 0; i < number; ++i) {
			factorial *= temp;
			--temp;
		}
		return factorial;
	}

	public static Combination(count, r) {
		return (
			this.Factorial(count) / (this.Factorial(r) * this.Factorial(count - r))
		);
	}

    // 算出两点的距离 
	public static CalcDistance(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	}

	public static CalcAngle(x1, y1, x2, y2) {
		return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
	}

	// /**
	//  * 将贝塞尔曲线变成点
	//  * @param {*贝塞尔控制点X坐标数组} ctrlPosXArry
	//  * @param {*贝塞尔控制点Y坐标数组} ctrlPosYArry
	//  * @param {*贝塞尔控制点数量,二阶或者三阶} initCount
	//  * @param {*存放分割的点} traceVector
	//  * @param {*切割曲线的距离 像素} fdistance
	//  */
	// public static BuildBezier(
	// 	ctrlPosXArry,
	// 	ctrlPosYArry,
	// 	initCount,
	// 	TraceVector,
	// 	fdistance
	// ) {
	// 	var index = 0;
	// 	var t = 0;
	// 	var count = initCount - 1;
	// 	var tfDis = fdistance;
	// 	var tempValue = 0;
	// 	var tPos = cc.v2(0, 0);

	// 	while (t < 1) {
	// 		tPos = cc.v2(0, 0);
	// 		index = 0;

	// 		while (index <= count) {
	// 			tempValue =
	// 				Math.pow(t, index) *
	// 				Math.pow(1 - t, count - index) *
	// 				this.Combination(count, index);

    //             // 求出最后的点 
	// 			tPos.x += ctrlPosXArry[index] * tempValue;
	// 			tPos.y += ctrlPosYArry[index] * tempValue;
	// 			++index;
	// 		}


	// 		let fSpace = 0;// 算出两点的行走距离 
	// 		if (TraceVector.length > 0) {
	// 			var backPos = TraceVector[TraceVector.length - 1];
	// 			fSpace = this.CalcDistance(backPos.x, backPos.y, tPos.x, tPos.y);
	// 		}

	// 		if (fSpace >= tfDis || TraceVector.length == 0) {
	// 			TraceVector.push(tPos);
	// 		}
	// 		t += 0.001;
	// 	}
	// }

	/**
	 * 将贝塞尔曲线变成点,生成的结果中包含了角度
	 * @param {*贝塞尔控制点X坐标数组}  ctrlPosXArry
	 * @param {*贝塞尔控制点Y坐标数组}  ctrlPosYArry
     * @param {*} addSpeedArr 每个点的加速度  
	 * @param {*贝塞尔控制点数量,二阶或者三阶} initCount 
	 * @param {*存放分割的点} TraceVector  
	 * @param {*切割曲线的距离 像素,当前为10}  fdistance  
	 */
	public static BuildBezierWithAngle(
		ctrlPosXArry,
		ctrlPosYArry,
        addSpeedArr,
		initCount, 
		TraceVector,
		fdistance
	) {
		var index = 0;
		var t = 0;
		var count = initCount - 1;
		var tempValue = 0;
		var tPos = {
			x: 0,
			y: 0,
			angle: 0,
            addSpeed:0,
		};

        // 当 t 《 1 结束 
		while (t < 1) {
            // 初始化 tpos 
			tPos = {
				x: 0,
				y: 0,
				angle: 0,
                addSpeed:0,
			};
			index = 0;

			while (index <= count) {
				tempValue =
					Math.pow(t, index) *
					Math.pow(1 - t, count - index) *
					this.Combination(count, index);

				tPos.x += ctrlPosXArry[index] * tempValue;
				tPos.y += ctrlPosYArry[index] * tempValue;
				++index;
			}


			let fSpace = 0;
			if (TraceVector.length > 0) {
                //如果 TraceVector 有数据 ，找出当前点和之前点的距离 
				var backPos = TraceVector[TraceVector.length - 1];
				fSpace = this.CalcDistance(backPos.x, backPos.y, tPos.x, tPos.y);
			} else {
                  //如果 TraceVector 没有数据 ，找出贝塞尔第一个和第二个点的角度 
				tPos.angle = this.CalcAngle(
					ctrlPosXArry[0],
					ctrlPosYArry[0],
					ctrlPosXArry[1],
					ctrlPosYArry[1]
				);
                tPos.addSpeed = addSpeedArr[0]
				TraceVector.push(tPos);
				continue;
			}

            // 两点的距离 如果大于 当前的 10的标准距离，即先把当前点插入 
			if (fSpace >= fdistance) {
                var backPos = TraceVector[TraceVector.length - 1];
				tPos.angle = this.CalcAngle(backPos.x, backPos.y, tPos.x, tPos.y);
                tPos.addSpeed =backPos.addSpeed
				TraceVector.push(tPos);
			}
			t += 0.001;
		}
	}

	/**
	 *  贝塞尔最终得到 ResultPointArr
	 * @param CtrlPointArr   计算出来的点
	 * @param ResultPointArr  最终的点数组
	 */
	public static BuildBezierByPointArr(CtrlPointArr, ResultPointArr) {
		let marr = CtrlPointArr;
		let pointlength = marr.length; //总的点数
		let linenumber = Math.floor((pointlength - 3) / 2) + 1; //要画几次,计算几个贝塞尔曲线

		for (let i = 0; i < linenumber; ++i) {
			//三个点组成一个贝塞尔的曲线控制   
			let p0 = marr[i * 2];
			let p1 = marr[i * 2 + 1];
			let p2 = marr[i * 2 + 2];

			var xArr = [p0.x, p1.x, p2.x];
			var yArr = [p0.y, p1.y, p2.y];
            var addSpeedArr =  [p0.z, p1.z, p2.z];
			this.BuildBezierWithAngle(xArr, yArr,addSpeedArr, 3, ResultPointArr, BezierHelp.ONE_STEP_LEN);
		}
	}


    /**
	 *  普通曲线最终得到 ResultPointArr
	 * @param CtrlPointArr   计算出来的点
	 * @param ResultPointArr  最终的点数组
	 */
	public static BuildBezierByPointArr2(CtrlPointArr,points, ResultPointArr) {
		let marr = points;
		let pointlength = points.length; //总的点数

        // let one_point = CtrlPointArr[0]

        let begin_point = marr[0] //起始开始画点，以BezierHelp.ONE_STEP_LEN的长度 一段一段截取 

        // 遍历所有的点 
        for (let i = 1; i < pointlength; ++i) {
            let current_point = marr[i];
            let current_distance = current_point.distance
            let current_x = current_point.x
            let current_y = current_point.y
            let current_addSpeed = current_point.addSpeed
            let current_angle = current_point.angle
            let next_point = marr[i+1]

            // 当当前点距离下一个点的距离大于 这个距离  表示要拆分 
            let dis = PositionExtension.dist(begin_point.x,begin_point.y,current_point.x,current_point.y)
            if (dis > BezierHelp.ONE_STEP_LEN){

            }
        }

        //TODO 
        ResultPointArr = points 
        return points
	}
}
