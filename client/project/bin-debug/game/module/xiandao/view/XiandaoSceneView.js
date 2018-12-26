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
var XiandaoSceneView = (function (_super) {
    __extends(XiandaoSceneView, _super);
    function XiandaoSceneView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_ExitTime = -1;
        _this.skinName = "XiandaoSceneSkin";
        UIHelper.SetLinkStyleLabel(_this.look);
        _this._AddClick(_this.arrBtn, _this._OnClick);
        _this._AddClick(_this.look, _this._OnClick);
        return _this;
    }
    XiandaoSceneView.prototype.OnOpen = function () {
        this.m_ExitTime = -1;
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdateChatPos);
        this.observe(MessageDef.XIANDAO_MAP_UPDATE, this._UpdateRank);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this._UpdateChatPos();
        this._UpdateRank();
        this.AddTimer(1000, 0, this._UpdateTime);
        if (GameGlobal.XiandaoModel.IsKnockout()) {
            this.titleLabel.text = XiandaoKnockoutView.RANK_PRO_STR[GameGlobal.XiandaoModel.GetKnockoutId()];
            this.rankGroup.visible = false;
        }
        else {
            this.titleLabel.text = "预选赛";
            this.rankGroup.visible = true;
        }
    };
    XiandaoSceneView.prototype.OnClose = function () {
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    };
    XiandaoSceneView.prototype._UpdateChatPos = function () {
        this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint);
        this.group.y = egret.$TempPoint.y;
    };
    XiandaoSceneView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.arrBtn:
                var show = this.infoGroup.visible = !this.infoGroup.visible;
                this.arrBtn.icon = show ? "ui_zd_bt_shousuo" : "ui_zd_bt_zhankai";
                break;
            case this.look:
                ViewManager.ins().open(XiandaoRankPanel);
                break;
        }
    };
    XiandaoSceneView.prototype._UpdateMyTime = function () {
        if (this.m_ExitTime < 0) {
            this.m_ExitTime = 3;
        }
        var exitTime = this.m_ExitTime--;
        if (exitTime <= 0) {
            GameGlobal.CommonRaidModel.MapLeave();
            TimerManager.ins().removeAll(this);
        }
        return exitTime;
    };
    XiandaoSceneView.prototype._UpdateTime = function () {
        var model = GameGlobal.XiandaoModel;
        if (model.IsKnockout()) {
            if (model.mMyTime && !model.mMyTime.ret) {
                var exitTime = this._UpdateMyTime();
                this.timeLabel.text = "\u6D3B\u52A8\u7ED3\u675F\uFF0C\u5C06\u5728" + exitTime + "\u79D2\u540E\u9000\u51FA\u573A\u666F";
            }
            else {
                this.timeLabel.text = "\u4E0B\u4E00\u573A\u9884\u8BA1\u5728" + Math.max(model.mMyTime.timeout - GameServer.serverTime, 0) + "\u79D2\u540E\u8FDB\u884C";
            }
        }
        else {
            if (model.IsExitGame() || model.IsCloseAct()) {
                var exitTime = this._UpdateMyTime();
                if (model.IsExitGame()) {
                    this.timeLabel.text = "\u60A8\u5DF2\u8D25\u4E863\u573A\u6BD4\u8D5B\uFF0C\u5C06\u5728" + exitTime + "\u79D2\u540E\u9000\u51FA\u573A\u666F";
                }
                else {
                    this.timeLabel.text = "\u6D3B\u52A8\u7ED3\u675F\uFF0C\u5C06\u5728" + exitTime + "\u79D2\u540E\u9000\u51FA\u573A\u666F";
                }
                return;
            }
            else {
                this.timeLabel.text = "\u4E0B\u4E00\u573A\u9884\u8BA1\u5728" + model.GetNextTime() + "\u79D2\u540E\u8FDB\u884C";
            }
        }
    };
    XiandaoSceneView.prototype._UpdateRank = function () {
        var rank = GameGlobal.XiandaoModel.GetSimpleRankData();
        var list = [];
        var listValue = [];
        for (var i = 0; i < 3; i++) {
            var data = rank[i];
            var str = (i + 1) + "     ";
            if (data) {
                str += data.roleName;
                listValue.push(data.score);
            }
            else {
                str += "暂无";
                listValue.push(0);
            }
            list.push(str);
        }
        this.rankLabel.text = list.join("\n");
        this.rankValue.text = listValue.join("\n");
        var myRank = GameGlobal.XiandaoModel.GetSimpleMyRank();
        if (!myRank) {
            myRank = "未上榜";
        }
        this.myRank.text = "\u6211\u7684\u6392\u540D\uFF1A" + myRank + "\t\u79EF\u5206\uFF1A" + GameGlobal.XiandaoModel.GetSimpleMyRankScore();
    };
    XiandaoSceneView.LAYER_LEVEL = LayerManager.UI_BATTLE;
    return XiandaoSceneView;
}(BaseView));
__reflect(XiandaoSceneView.prototype, "XiandaoSceneView");
//# sourceMappingURL=XiandaoSceneView.js.map