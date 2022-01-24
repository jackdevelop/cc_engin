// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// var {astar,Graph} = require('astar');

/***
 * 
 *  Astar 寻路测试  
 *  参考  https://github.com/bgrins/javascript-astar
 * 
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.testAstar();
    }


    private testAstar(){


        // 第一种方式 
        var graph = new Graph([
            [1,1,1,1],
            [0,1,1,0],
            [0,0,1,1]
        ]);
        var start = graph.grid[0][0];
        var end = graph.grid[1][2];
        var result = astar.search(graph, start, end);
        console.log("普通查找：",result);


        // 第二种方式  结果包含出最短路径  
        // result is an array containing the shortest path
        var graphDiagonal = new Graph([
            [1,1,1,1],
            [0,1,1,0],
            [0,0,1,1]
        ], { diagonal: true });
        var start = graphDiagonal.grid[0][0];
        var end = graphDiagonal.grid[1][2];
        var resultWithDiagonals = astar.search(graphDiagonal, start, end, { heuristic: astar.heuristics.diagonal });
        console.log("最短路径查找：" + resultWithDiagonals)


        //第三种方式  自由添加权重查找 
        // Weight can easily be added by increasing the values within the graph, and where 0 is infinite (a wall)
        var graphWithWeight = new Graph([
            [1,1,2,30],
            [0,4,1.3,0],
            [0,0,5,1]
        ]);
        var startWithWeight = graphWithWeight.grid[0][0];
        var endWithWeight = graphWithWeight.grid[1][2];
        var resultWithWeight = astar.search(graphWithWeight, startWithWeight, endWithWeight);
        console.log("自由添加查找：" + resultWithWeight)

        
    }
    // update (dt) {}
}
