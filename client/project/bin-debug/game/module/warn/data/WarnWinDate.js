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
/**
 * 记录通过WarnWin.showCheckBox()函数，提示框的提示状态
*/
var WarnWinDate = (function (_super) {
    __extends(WarnWinDate, _super);
    function WarnWinDate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_record = {};
        return _this;
    }
    WarnWinDate.ins = function () {
        return _super.ins.call(this);
    };
    ;
    WarnWinDate.prototype.setRecord = function (name, hint, callFun) {
        for (var key in this.m_record) {
            if (key == name) {
                return;
            }
        }
        this.m_record[name] = { hint: hint, callFun: callFun };
    };
    WarnWinDate.prototype.changeHint = function (name, hint) {
        for (var key in this.m_record) {
            if (key == name)
                this.m_record[key].hint = hint;
        }
    };
    WarnWinDate.prototype.checkerHintByName = function (name) {
        for (var key in this.m_record) {
            if (key == name) {
                if (!this.m_record[key].hint) {
                    var tempCb1 = this.m_record[key].callFun;
                    if (tempCb1 && tempCb1.func != null)
                        tempCb1.func.call(tempCb1.thisObj);
                }
                return this.m_record[key].hint;
            }
        }
        return true;
    };
    return WarnWinDate;
}(BaseSystem));
__reflect(WarnWinDate.prototype, "WarnWinDate");
//# sourceMappingURL=WarnWinDate.js.map