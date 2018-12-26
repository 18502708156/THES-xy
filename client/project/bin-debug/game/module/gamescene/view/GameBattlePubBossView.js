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
var GameBattlePubBossView = (function (_super) {
    __extends(GameBattlePubBossView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GameBattlePubBossView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GameGattlePubBossSkin";
        _this.percentWidth = 100;
        _this.bar.labelFunction = function (cur, max) {
            return "BOSS血量：" + cur + "/" + max;
        };
        _this._AddClick(_this.arrBtn, _this._OnClick);
        return _this;
    }
    GameBattlePubBossView.prototype.OnOpen = function () {
        this.observe(MessageDef.PUBLIC_BOSS_UPDATE_ATK, this._UpdateContent);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this._UpdateContent();
        this._UpdatePos();
    };
    GameBattlePubBossView.prototype.OnClose = function () {
        GameGlobal.BossModel.ClearPubBossAtkInfo();
    };
    GameBattlePubBossView.prototype._OnClick = function () {
        var show = this.infoGroup.visible = !this.infoGroup.visible;
        this.arrBtn.icon = show ? "ui_zd_bt_shousuo" : "ui_zd_bt_zhankai";
    };
    GameBattlePubBossView.prototype._UpdatePos = function () {
        this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint);
        this.group.y = egret.$TempPoint.y;
    };
    GameBattlePubBossView.prototype._UpdateContent = function () {
        var rsp = GameGlobal.BossModel.mPubBossAtkInfo;
        this.UpdateRank(rsp);
    };
    GameBattlePubBossView.prototype.UpdateHp = function (cur, max) {
        if (!cur && !max) {
            this.bar.visible = false;
        }
        else {
            this.bar.visible = true;
        }
        this.bar.maximum = max;
        this.bar.value = cur;
    };
    GameBattlePubBossView.prototype.UpdateRank = function (rsp) {
        if (!rsp) {
            return;
        }
        var list = [];
        var listValue = [];
        var attackInfo = rsp.attackinfos || [];
        for (var i = 0; i < 3; i++) {
            var data = attackInfo[i];
            var str = (i + 1) + " ";
            if (data) {
                str += data.name;
                listValue.push(data.injure);
            }
            else {
                str += "暂无";
                listValue.push(0);
            }
            list.push(str);
        }
        this.rankLabel.text = list.join("\n");
        this.rankValue.text = listValue.join("\n");
        // rsp.myattackinfo.injure
        this.myRank.text = "我的：" + (rsp.myattackinfo ? rsp.myattackinfo.injure : 0);
    };
    return GameBattlePubBossView;
}(BaseView));
__reflect(GameBattlePubBossView.prototype, "GameBattlePubBossView");
//# sourceMappingURL=GameBattlePubBossView.js.map