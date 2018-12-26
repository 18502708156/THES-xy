var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AStar = (function () {
    function AStar(map) {
        if (map === void 0) {
            map = null;
        }
        this.m_nMarkTag = 0; //寻路优化成员，免去循环初始化所有节点的开销
        if (map) {
            this.initFromMap(map);
        }
    }
    /**
     * 从地图中初始化
     * @param map
     *
     */
    AStar.prototype.initFromMap = function (map) {
        var nOldCount = 0;
        if (this.m_ASMapCells)
            nOldCount = this.m_ASMapCells.length;
        else
            this.m_ASMapCells = [];
        this.m_nWidth = map.numCols;
        this.m_nHeight = map.numRows;
        //如果现有数组的格子数量少于新数量则扩展数组
        var nNewCount = this.m_nWidth * this.m_nHeight;
        if (nNewCount > this.m_ASMapCells.length)
            this.m_ASMapCells.length = nNewCount;
        for (var i = nOldCount; i < nNewCount; ++i) {
            this.m_ASMapCells[i] = new ASMapCell;
        }
        //初始化每个坐标格子
        var x, y, idx;
        var cell;
        idx = 0;
        for (y = 0; y < this.m_nHeight; ++y) {
            for (x = 0; x < this.m_nWidth; ++x) {
                cell = this.m_ASMapCells[idx];
                cell.X = x;
                cell.Y = y;
                cell.CanNotMove = !map.isWalkableTile(x, y);
                idx++;
            }
        }
    };
    ;
    /**
     * 寻路
     * @param fromX 起始坐标X
     * @param fromY 起始坐标Y
     * @param targetX 目的地坐标X
     * @param targetY 目的地坐标Y
     * @return 路径点数组
     *
     */
    AStar.prototype.getPatch = function (fromX, fromY, targetX, targetY) {
        var size = MapGrid.CELL_SIZE;
        var fromX = Math.floor(fromX / size);
        var fromY = Math.floor(fromY / size);
        var targetX = Math.floor(targetX / size);
        var targetY = Math.floor(targetY / size);
        if (fromX == targetX && fromY == targetY)
            return null;
        if (fromX < 0 || fromX >= this.m_nWidth || fromY < 0 || fromY >= this.m_nHeight) {
            if (true) {
                console.log("寻路的起始位置参数无效：(" + fromX + ", " + fromY + ")");
            }
            return null;
        }
        if (targetX < 0 || targetX >= this.m_nWidth || targetY < 0 || targetY >= this.m_nHeight) {
            if (true) {
                console.log("寻路的目的位置参数无效：(" + targetX + ", " + targetY + ")");
            }
            return null;
        }
        var acell = this.m_ASMapCells[targetY * this.m_nWidth + targetX];
        if (!acell || acell.CanNotMove) {
            return null;
        }
        // let a = 
        var pos = new egret.Point;
        var line = true;
        MathUtils.Normalize((targetX - fromX), (targetY - fromY), pos);
        var sing1 = targetX > fromX ? 1 : -1;
        for (var index = 0, i_1 = 0, len = Math.abs(targetX - fromX); i_1 < len; i_1++) {
            var dx = sing1 + index;
            var dy = Math.floor(dx * pos.y / pos.x);
            if (!GameMap.checkWalkable(fromX + dx, fromY + dy)) {
                line = false;
                break;
            }
            index += sing1;
        }
        if (line) {
            var sing2 = targetY > fromY ? 1 : -1;
            for (var index = 0, i_2 = 0, len = Math.abs(targetY - fromY); i_2 < len; i_2++) {
                var dy = sing2 + index;
                var dx = Math.floor(dy * pos.x / pos.y);
                if (!GameMap.checkWalkable(fromX + dx, fromY + dy)) {
                    line = false;
                    break;
                }
                index += sing2;
            }
        }
        if (line) {
            return [new AStarNode(targetX, targetY)];
        }
        this.reset(fromX, fromY);
        var boPathFound = false;
        var nCurX = fromX;
        var nCurY = fromY;
        var curCell = this.m_ASMapCells[nCurY * this.m_nWidth + nCurX];
        curCell.GCost = 0;
        curCell.LastX = -1;
        curCell.LastY = -1;
        curCell.X = nCurX;
        curCell.Y = nCurY;
        curCell.MarkTag = this.m_nMarkTag;
        curCell.HCost = Math.abs(targetX - fromX) + Math.abs(targetY - fromY) * 10;
        var i;
        var nX, nY;
        var cell;
        while (true) {
            if (nCurX == targetX && nCurY == targetY) {
                boPathFound = true;
                break;
            }
            if (curCell.State != ASMapCell.CSCLOSE) {
                this.closeCell(curCell);
            }
            //遍历当前位置周围的8个格子
            for (i = 0; i < 8; ++i) {
                nX = nCurX + AStar.NEIGHBORPOS_X_VALUES[i];
                nY = nCurY + AStar.NEIGHBORPOS_Y_VALUES[i];
                if (nX < 0 || nX >= this.m_nWidth || nY < 0 || nY >= this.m_nHeight)
                    continue;
                cell = this.m_ASMapCells[nY * this.m_nWidth + nX];
                if (cell.CanNotMove)
                    continue;
                //cell.MarkTag与当前的m_nMarkTag不同，也视为是未开启状态
                if (cell.MarkTag != this.m_nMarkTag || cell.State == ASMapCell.CSNONE) {
                    cell.MarkTag = this.m_nMarkTag;
                    cell.LastX = nCurX;
                    cell.LastY = nCurY;
                    cell.btDir = i;
                    cell.GCost = curCell.GCost + AStar.AS_MOVECOST[i & 1];
                    cell.HCost = Math.abs(targetX - nX) + Math.abs(targetY - nY) * 10;
                    this.openCell(cell);
                }
                else if (cell.State == ASMapCell.CSOPEN) {
                    if (cell.GCost > curCell.GCost + AStar.AS_MOVECOST[i & 1]) {
                        cell.LastX = nCurX;
                        cell.LastY = nCurY;
                        cell.btDir = i;
                        cell.GCost = curCell.GCost + AStar.AS_MOVECOST[i & 1];
                        this.reopenCell(cell);
                    }
                }
            }
            //curCell = bestCell();
            curCell = this.m_LastOpenCell;
            if (curCell == null)
                break;
            nCurX = curCell.X;
            nCurY = curCell.Y;
        }
        if (boPathFound) {
            var Result = new Array();
            while (true) {
                Result.push(new AStarNode(curCell.X, curCell.Y)); //, curCell.btDir));
                curCell = this.m_ASMapCells[curCell.LastY * this.m_nWidth + curCell.LastX];
                if ((curCell.LastX <= 0 && curCell.LastY <= 0) || curCell.MarkTag != this.m_nMarkTag)
                    break;
            }
            return Result;
        }
        return null;
    };
    ;
    /**
     * 寻路开始的时候重置起点数据
     * @param cX
     * @param cY
     *
     */
    AStar.prototype.reset = function (cX, cY) {
        var cell = this.m_ASMapCells[cY * this.m_nWidth + cY];
        cell.LastX = 0;
        cell.LastY = 0;
        cell.HCost = 0;
        cell.GCost = 0;
        cell.FValue = 0;
        cell.State = 0;
        cell.Prev = null;
        cell.Next = null;
        cell.btDir = 0;
        this.m_LastOpenCell = null;
        this.m_nMarkTag = this.m_nMarkTag + 1;
        /**
         * 如果地图尺寸较大，会在此产生过多的时间开销，造成卡的显现。
         * 已经使用MarkTag优化，在寻路的期间进行检测和重新初始化。
         *
        //将每个格子的状态设为空闲
        for (let i: int = m_nWidth * m_nHeight - 1; i>-1; --i)
        {
            cell = m_ASMapCells[i];
            cell.LastX = -1;
            cell.State = public static CSNONE;
        }**/
    };
    ;
    /**
     * 关闭指定的格子
     * @param cell
     *
     */
    AStar.prototype.closeCell = function (cell) {
        //如果格子已经开启则进行路径链表的移除操作
        if (cell.State == ASMapCell.CSOPEN) {
            if (cell.Prev)
                cell.Prev.Next = cell.Next;
            if (cell.Next)
                cell.Next.Prev = cell.Prev;
            if (cell == this.m_LastOpenCell)
                this.m_LastOpenCell = cell.Prev;
        }
        cell.State = ASMapCell.CSCLOSE;
    };
    ;
    /**
     * 开启指定的格子
     * @param cell
     *
     */
    AStar.prototype.openCell = function (cell) {
        cell.State = ASMapCell.CSOPEN;
        var nFValue = cell.HCost + cell.GCost;
        cell.FValue = nFValue;
        var lastCell = this.m_LastOpenCell;
        if (!lastCell) {
            this.m_LastOpenCell = cell;
            cell.Prev = null;
            cell.Next = null;
        }
        else {
            //开启格子的时候在已开启的格子链表中按移动估价值进行排序
            while (lastCell.FValue < nFValue) {
                if (lastCell.Prev == null) {
                    lastCell.Prev = cell;
                    cell.Prev = null;
                    cell.Next = lastCell;
                    return;
                }
                lastCell = lastCell.Prev;
            }
            //添加到当前开启格子链表的末尾
            cell.Prev = lastCell;
            if (lastCell.Next) {
                cell.Next = lastCell.Next;
                lastCell.Next.Prev = cell;
                lastCell.Next = cell;
            }
            else {
                cell.Next = null;
                lastCell.Next = cell;
                this.m_LastOpenCell = cell;
            }
        }
    };
    ;
    /**
     * 重新开启指定的格子更新移动估价值并重新再已开启格子链表中排序
     * @param cell
     *
     */
    AStar.prototype.reopenCell = function (cell) {
        var nFValue = cell.HCost + cell.GCost;
        cell.FValue = nFValue;
        var nextCell = cell.Next;
        if (nextCell && nextCell.FValue > nFValue) {
            do {
                nextCell = nextCell.Next;
            } while (nextCell && nextCell.FValue > nFValue);
            if (cell.Prev)
                cell.Prev.Next = cell.Next;
            if (cell.Next)
                cell.Next.Prev = cell.Prev;
            if (nextCell) {
                cell.Next = nextCell;
                if (nextCell.Prev) {
                    cell.Prev = nextCell.Prev;
                    nextCell.Prev.Next = cell;
                }
                else
                    cell.Prev = null;
                nextCell.Prev = cell;
            }
            else {
                cell.Prev = this.m_LastOpenCell;
                cell.Next = null;
                this.m_LastOpenCell.Next = cell;
                this.m_LastOpenCell = cell;
            }
        }
    };
    ;
    /**
     * 寻路算法有关的常量定义
     *
     */
    AStar.RMOVECOST = 14; //倾斜方向的移动耗费
    AStar.DMOVECOST = 10; //直线方向的移动耗费
    AStar.AS_MOVECOST = [AStar.DMOVECOST, AStar.RMOVECOST];
    // 7	0   1
    // 6		2
    // 5	4   3
    AStar.NEIGHBORPOS_X_VALUES = [0, 1, 1, 1, 0, -1, -1, -1]; //用于快速计算临近坐标值的优化数据
    AStar.NEIGHBORPOS_Y_VALUES = [-1, -1, 0, 1, 1, 1, 0, -1]; //用于快速计算临近坐标值的优化数据
    return AStar;
}());
__reflect(AStar.prototype, "AStar");
var ASMapCell = (function () {
    function ASMapCell() {
    }
    ASMapCell.CSNONE = 0; //未处理的格子
    ASMapCell.CSOPEN = 1; //格子已经开启
    ASMapCell.CSCLOSE = 2; //格子已经关闭
    return ASMapCell;
}());
__reflect(ASMapCell.prototype, "ASMapCell");
//# sourceMappingURL=AStar.js.map