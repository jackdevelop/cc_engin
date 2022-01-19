






const {ccclass, property} = cc._decorator;




@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    

    

    start () {
        this.testAstar();
    }


    private testAstar(){


        
        var graph = new Graph([
            [1,1,1,1],
            [0,1,1,0],
            [0,0,1,1]
        ]);
        var start = graph.grid[0][0];
        var end = graph.grid[1][2];
        var result = astar.search(graph, start, end);
        console.log("普通查找：",result);


        
        
        var graphDiagonal = new Graph([
            [1,1,1,1],
            [0,1,1,0],
            [0,0,1,1]
        ], { diagonal: true });
        var start = graphDiagonal.grid[0][0];
        var end = graphDiagonal.grid[1][2];
        var resultWithDiagonals = astar.search(graphDiagonal, start, end, { heuristic: astar.heuristics.diagonal });
        console.log("最短路径查找：" + resultWithDiagonals)


        
        
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
    
}
