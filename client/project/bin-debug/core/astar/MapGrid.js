var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MapGrid = (function (_super) {
    __extends(MapGrid, _super);
    function MapGrid() {
        var _this = _super.call(this) || this;
        _this.touchEnabled = false;
        _this._nodes = [];
        return _this;
    }
    Object.defineProperty(MapGrid.prototype, "numCols", {
        get: function () {
            return this._numCols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapGrid.prototype, "numRows", {
        get: function () {
            return this._numRows;
        },
        enumerable: true,
        configurable: true
    });
    ////////////////////
    //公有方法
    ////////////////////
    /**
     * 获取指定坐标的网格节点
     * @param x x坐标
     * @param y y坐标
     * @return 返回网格节点

     */
    MapGrid.prototype.getNode = function (x, y) {
        return this._nodes[this._numCols * y + x] || 0;
    };
    /**
     * 判断指定的格子是否可移动
     * @param x 格子x坐标
     * @param y 格子y坐标
     * @return
     *
     */
    MapGrid.prototype.isWalkableTile = function (x, y) {
        return !((this.getNode(x, y) & (1 << 0)) > 0);
    };
    MapGrid.prototype.IsHide = function (x, y) {
        return (this.getNode(x, y) & (1 << 1)) > 0;
    };
    /**
     * 释构
     *
     */
    MapGrid.prototype.destruct = function () {
        this.clearNodes();
    };
    ;
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
    MapGrid.prototype.initGrid = function (rows, cols, data) {
        //清除现有数据并重设网格尺寸
        if (this._nodes)
            this.clearNodes();
        this._numRows = rows;
        this._numCols = cols;
        this._nodes = data || [];
    };
    ;
    /**
     * 清除节点数据
     *
     */
    MapGrid.prototype.clearNodes = function () {
        this._nodes.length = 0;
    };
    ;
    MapGrid.CELL_SIZE = 64;
    return MapGrid;
}(egret.Sprite));
__reflect(MapGrid.prototype, "MapGrid");
//# sourceMappingURL=MapGrid.js.map