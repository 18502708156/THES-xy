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
var CrossBattleResultWin = (function (_super) {
    __extends(CrossBattleResultWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CrossBattleResultWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "CrossBattleResultWinSkin";
        return _this;
    }
    CrossBattleResultWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("领取奖励");
        this.SetTitleLabel("获得奖励");
        this.SetCloseFunc(param[1]);
        _super.prototype.OnOpen.call(this);
        var rewards = param[0];
        this.jf.text = "积分：" + rewards;
        // if (rewards) {
        // 	rewards.sort(this.sortFunc);
        // }
        // this.list.dataProvider = new eui.ArrayCollection(rewards);
        // this.list.validateNow()
        var star = param[2];
        if (star != null) {
            if (star == 0) {
                this.bmStar0.visible = false;
                this.bmStar1.visible = false;
                this.bmStar2.visible = false;
            }
            else if (star == 1) {
                this.bmStar0.visible = false;
                this.bmStar2.visible = false;
            }
            else if (star == 2) {
                this.bmStar1.visible = false;
                this.bmStar0.x = 233;
                this.bmStar2.x = 400;
            }
        }
        else {
            this.bmStar0.visible = false;
            this.bmStar1.visible = false;
            this.bmStar2.visible = false;
        }
    };
    return CrossBattleResultWin;
}(ResultBasePanel));
__reflect(CrossBattleResultWin.prototype, "CrossBattleResultWin");
//# sourceMappingURL=CrossBattleResultWin.js.map