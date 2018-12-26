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
var WarnWinData = (function (_super) {
    __extends(WarnWinData, _super);
    function WarnWinData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_record = {};
        return _this;
    }
    WarnWinData.ins = function () {
        return _super.ins.call(this);
    };
    ;
    WarnWinData.prototype.setRecord = function (name, hint) {
        for (var key in this.m_record) {
            if (key == name) {
                return;
            }
        }
        this.m_record[name] = { notPopUp: hint };
    };
    WarnWinData.prototype.changeHint = function (name, hint) {
        for (var key in this.m_record) {
            if (key == name)
                this.m_record[key].notPopUp = hint;
        }
    };
    WarnWinData.prototype.checkerHintByName = function (name, callFun) {
        for (var key in this.m_record) {
            if (key == name) {
                if (!this.m_record[name].notPopUp) {
                    var tempCb1 = callFun;
                    if (tempCb1 && tempCb1.func != null)
                        tempCb1.func.call(tempCb1.thisObj);
                }
                return this.m_record[key].notPopUp;
            }
        }
        return true;
    };
    return WarnWinData;
}(BaseSystem));
__reflect(WarnWinData.prototype, "WarnWinData");
//# sourceMappingURL=WarnWinData.js.map