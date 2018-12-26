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
var ArenaInfoPanel = (function (_super) {
    __extends(ArenaInfoPanel, _super);
    function ArenaInfoPanel() {
        var _this = _super.call(this) || this;
        _this.pkCount = 0;
        _this.remaintime = 0;
        _this.buyCount = 0;
        return _this;
    }
    // 引导对象
    ArenaInfoPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.m_roles[0],
            _a;
        var _a;
    };
    ArenaInfoPanel.prototype.childrenCreated = function () {
        this.m_roles = [];
        var i = 0;
        var role;
        for (i; i < 5; i++) {
            role = this['role' + i];
            role.touchEnabled = true;
            this.m_roles[i] = role;
        }
        this.itemList.itemRenderer = ItemBaseNotName;
    };
    ArenaInfoPanel.prototype._OnClick = function (e) {
        if (egret.is(e.currentTarget, 'ArenaRoleItem')) {
            if (this.pkCount > 0) {
                if (UserFb.FinishAndCheckFighting()) {
                    GameGlobal.Arena.sendArenaChallenge(e.currentTarget.getRank());
                }
            }
            else {
                UserTips.ins().showTips('挑战次数不足');
            }
            return;
        }
        switch (e.target) {
            case this.rankBtn:
                ViewManager.ins().open(RankWin, RankDataType.TYPE_ARENA);
                break;
            case this.mallBtn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_ARENA]);
                break;
            case this.buyBtn:
                var maxCount = GameGlobal.Arena.getVipBuyCount();
                if (maxCount == 0) {
                    maxCount = GameGlobal.Arena.getMaxBuyCount();
                }
                var vipLv = GameGlobal.actorModel.vipLv;
                this.reaminCount = maxCount - this.buyCount;
                WarnWin.show('是否消耗|C:0xfff01e&T:' + GameGlobal.Arena.getPKCountBuy() + '元宝|购买|C:0xd27701&T:' + GameGlobal.Arena.getAddPKCount() + '次|挑战机会\n\n'
                    + '剩余购买次数：' + this.reaminCount + '\n\n' + 'VIP' + GameGlobal.actorModel.vipLv + '每天可购买' + maxCount + '次', this.okBuyHandler, this, null, null, "normal", { title: '购买提示' });
                break;
        }
    };
    ArenaInfoPanel.prototype.okBuyHandler = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        GameGlobal.Arena.sendArenaBuyCount();
    };
    ArenaInfoPanel.prototype.OnOpen = function () {
        var i = 0;
        var role;
        for (i; i < 5; i++) {
            role = this.m_roles[i];
            this.AddClick(role, this._OnClick);
        }
        this.AddClick(this.rankBtn, this._OnClick);
        this.AddClick(this.mallBtn, this._OnClick);
        this.AddClick(this.buyBtn, this._OnClick);
        this.observe(MessageDef.ARENA_INFO_DATA, this.getArenaInfoData);
        this.observe(MessageDef.ARENA_BUY_RESULT, this.getArenaBuyResult);
        GameGlobal.Arena.sendArenaData();
    };
    ArenaInfoPanel.prototype.getArenaInfoData = function (data) {
        var i = 0;
        var role;
        for (i; i < 5; i++) {
            role = this.m_roles[i];
            role.updateData(data.targets[i]);
        }
        this.buyCount = data.buycount;
        this.pkCount = data.pkcount;
        this.rankTxt.text = data.rank + '';
        this.countTxt.text = data.pkcount + '';
        this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.Arena.getRankRewards(data.rank));
        TimerManager.ins().remove(this.updateTimes, this);
        this.remaintime = data.remaintime;
        this.timeTxt.visible = data.remaintime > 0;
        this.timeTxt.text = DateUtils.getFormatBySecond(data.remaintime); //处理倒计时
        if (data.remaintime > 0) {
            this.AddTimer(1000, 0, this.updateTimes);
        }
    };
    ArenaInfoPanel.prototype.updateTimes = function () {
        this.remaintime--;
        if (this.remaintime <= 0) {
            this.timeTxt.visible = false;
            TimerManager.ins().remove(this.updateTimes, this);
        }
        this.timeTxt.text = DateUtils.getFormatBySecond(this.remaintime);
    };
    ArenaInfoPanel.prototype.getArenaBuyResult = function (data) {
        if (!data.ret) {
            if (this.reaminCount <= 0) {
                UserTips.ins().showTips('购买剩余次数不足，购买失败！');
            }
            else
                UserTips.ins().showTips('元宝不足，购买失败！');
        }
        else {
            this.pkCount = data.pkcount;
            this.buyCount = data.buycount;
            this.countTxt.text = data.pkcount + '';
            this.timeTxt.visible = false;
            TimerManager.ins().remove(this.updateTimes, this);
        }
    };
    ArenaInfoPanel.prototype.UpdateContent = function () {
        this.cleanTxt.text = GameGlobal.Arena.getRankRewardTimes();
        this.myPower.text = GameGlobal.actorModel.power;
    };
    ArenaInfoPanel.NAME = "竞技场";
    return ArenaInfoPanel;
}(BaseView));
__reflect(ArenaInfoPanel.prototype, "ArenaInfoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=ArenaInfoPanel.js.map