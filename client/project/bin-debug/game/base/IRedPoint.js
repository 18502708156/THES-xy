var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var IRedPoint = (function () {
    function IRedPoint() {
        this.m_Value = 0;
        this.m_Check = 0;
        /** 当前所以检查索引和对应的方法 */
        this.m_CheckList = {};
        RedPointMgr.Add(this);
        this.m_CheckList = this.GetCheckFuncList();
        if (!this.m_CheckList) {
            console.error("not check list => ", this);
        }
    }
    IRedPoint.prototype.GetType = function () {
        return egret.getQualifiedClassName(this);
    };
    /**
     * 当前是否有红点状态
     */
    IRedPoint.prototype.IsRedPoint = function () {
        return this.m_Value > 0;
    };
    /**
     * 当前是否有红点状态，排除indexs
     */
    IRedPoint.prototype.IsRedPointWithout = function () {
        var indexs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indexs[_i] = arguments[_i];
        }
        var val = this.m_Value;
        if (val > 0) {
            for (var _a = 0, indexs_1 = indexs; _a < indexs_1.length; _a++) {
                var index = indexs_1[_a];
                val = BitUtil.Set(val, index, false);
            }
            return val > 0;
        }
        return false;
    };
    /**
     * 获取对应所以得状态
     */
    IRedPoint.prototype.Get = function (index) {
        if (BitUtil.Has(this.m_Check, index)) {
            return BitUtil.Has(this.m_Value, index);
        }
        var func = this.m_CheckList[index];
        if (!func) {
            return false;
        }
        var newVal = func.call(this) ? true : false;
        var oldValue = BitUtil.Has(this.m_Value, index);
        this.m_Value = BitUtil.Set(this.m_Value, index, newVal);
        this.m_Check = BitUtil.Set(this.m_Check, index, true);
        if (newVal != oldValue) {
            this.OnChange(index);
        }
        return newVal;
    };
    /**
     * 清理某个状态，能够重新计算
     */
    IRedPoint.prototype.ClearFlag = function (index) {
        this.m_Check = BitUtil.Set(this.m_Check, index, false);
    };
    /**
     * 初始化
     */
    IRedPoint.prototype.Init = function () {
        return true;
    };
    /**
     * 检查所有的状态
     */
    IRedPoint.prototype.CheckAll = function () {
        for (var k in this.m_CheckList) {
            this.Get(Number(k));
        }
    };
    IRedPoint.prototype.CheckArrayData = function (lhs, rhs) {
        if (!lhs || !rhs) {
            return;
        }
        for (var key in lhs) {
            if (lhs[key] != rhs[key]) {
                return false;
            }
        }
        return true;
    };
    /**
     * 如果某个索引状态发生变化，会回调这个方法，子类重写这个用来广播事件
     */
    IRedPoint.prototype.OnChange = function (index) {
    };
    /**
     *  收到消息，清空缓存数据
     * 	@return 是否有延时调用DoUpdate
     */
    IRedPoint.prototype.OnMessage = function (type) {
        this.m_Check = 0;
        return true;
    };
    return IRedPoint;
}());
__reflect(IRedPoint.prototype, "IRedPoint");
//# sourceMappingURL=IRedPoint.js.map