class MapGrid extends egret.Sprite {

    static CELL_SIZE: number = 64

    touchEnabled = false;
    _numCols: number;
    _numRows: number;
    _nodes: number[] = [];
    debugTrace: any;

    public constructor() {
        super();
    }

    public get numCols() {
        return this._numCols;
    }
    public get numRows() {
        return this._numRows;
    }
    ////////////////////
    //公有方法
    ////////////////////
    /**
     * 获取指定坐标的网格节点
     * @param x x坐标
     * @param y y坐标
     * @return 返回网格节点

     */
    public getNode(x: number, y: number): number {
        return this._nodes[this._numCols * y + x] || 0
    }
    /**
     * 判断指定的格子是否可移动
     * @param x 格子x坐标
     * @param y 格子y坐标
     * @return
     *
     */
    public isWalkableTile(x: number, y: number): boolean {
        return !((this.getNode(x, y) & (1 << 0)) > 0);
    }

    public IsHide(x: number, y: number): boolean {
		return (this.getNode(x, y) & (1 << 1)) > 0;
	}

    /**
     * 释构
     *
     */
    public destruct() {
        this.clearNodes();
    };
    /////////////////////////////////////
    //保护方法
    ////////////////////////////////////
    /**
     * 初始化网格
     * 这里可以使用对象池技术进行优化
     * @param rows 行数
     * @param cols 列数
     * @param data 节点数据字节流

     */
    public initGrid(rows: number, cols: number, data: number[]) {
        //清除现有数据并重设网格尺寸
        if (this._nodes)
            this.clearNodes();
        this._numRows = rows;
        this._numCols = cols;
        this._nodes = data || []
    };
    /**
     * 清除节点数据
     *
     */
    public clearNodes() {
        this._nodes.length = 0;
    };
}