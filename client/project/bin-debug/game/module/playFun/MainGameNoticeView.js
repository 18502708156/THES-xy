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
var MainGameNoticeView = (function (_super) {
    __extends(MainGameNoticeView, _super);
    function MainGameNoticeView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mType = 0;
        _this.m_EndTime = 0;
        _this.m_ShowType = 0;
        _this.skinName = "MainGameNoticeSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._OnClick, _this);
        UIHelper.SetLinkStyleLabel(_this.gotoLabel);
        return _this;
    }
    MainGameNoticeView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (this.mType && this.m_EndTime > GameServer.serverTime) {
            this.StartTime();
        }
    };
    MainGameNoticeView.prototype.OnClose = function () {
        TimerManager.ins().removeAll(this);
    };
    MainGameNoticeView.prototype.SetData = function (type, time, showType) {
        this.mType = type;
        this.m_ShowType = showType;
        this.m_EndTime = time + GameServer.serverTime;
        if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
            this.lbAnswerInfo.visible = false;
            this.gotoLabel.visible = true;
        }
        else {
            this.lbAnswerInfo.visible = true;
            this.gotoLabel.visible = false;
        }
        this.UpdateContent();
        TimerManager.ins().removeAll(this);
    };
    MainGameNoticeView.prototype.StartTime = function () {
        TimerManager.ins().removeAll(this);
        var time = this.m_EndTime - GameServer.serverTime;
        this._UpdateTime();
        if (time <= 0) {
            return;
        }
        this.AddTimer(1000, this.m_EndTime - GameServer.serverTime, this._UpdateTime);
    };
    MainGameNoticeView.prototype.UpdateContent = function () {
        this.icon.scaleX = this.icon.scaleY = 1;
        if (this.mType == MainGameNoticeView.TYPE_XIANDAO) {
            this.UpdateXiandaohui();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_CROSSBATTER) {
            this.UpdateCrossBattle();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_GANG_BATTLE) {
            this.UpdateGangBattle();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_GANG_BOSS) {
            this.UpdateGangBoss();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_CROSS_BOSS) {
            this.UpdateCrossBoss();
            return;
        }
        console.error("not impl type => " + this.mType);
    };
    MainGameNoticeView.prototype._UpdateTime = function () {
        if (this.m_ShowType != MainGameNoticeView.SHOW_TYPE_GOTO) {
            this.lbAnswerInfo.textFlow = TextFlowMaker.generateTextFlow("\u5C06\u5728" + StringUtils.addColor(Math.max(this.m_EndTime - GameServer.serverTime, 0) + "s", Color.l_green_1) + "\u540E\u5F00\u59CB");
        }
        if (this.m_EndTime <= GameServer.serverTime) {
            this.Close();
        }
    };
    MainGameNoticeView.prototype.UpdateXiandaohui = function () {
        if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
            this.typeLabel.text = "仙道会预选赛正激烈进行";
        }
        else {
            this.typeLabel.text = "仙道会活动";
        }
        this.icon.source = "ui_xdh_bt_xiandaohui";
    };
    MainGameNoticeView.prototype.UpdateCrossBattle = function () {
        if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
            this.typeLabel.text = "跨服争霸正在进行";
        }
        else {
            this.typeLabel.text = "跨服争霸";
        }
        this.icon.source = "ui_bm_kuafuzhengba";
    };
    MainGameNoticeView.prototype.UpdateGangBattle = function () {
        this.typeLabel.text = "帮会战进行中";
        this.icon.source = "ui_bm_banghuizhan";
    };
    MainGameNoticeView.prototype.UpdateGangBoss = function () {
        this.typeLabel.text = "帮会BOSS出现";
        this.icon.source = "ui_bh_bt_boss";
        this.icon.scaleX = this.icon.scaleY = 0.8;
    };
    MainGameNoticeView.prototype.UpdateCrossBoss = function () {
        this.typeLabel.text = "跨服BOSS出现";
        this.icon.source = "ui_bm_kuafuBOSS";
    };
    MainGameNoticeView.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.imgAnswerClose:
                this.Close();
                break;
            default:
                if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
                    this.Goto();
                    this.Close();
                }
                break;
        }
    };
    MainGameNoticeView.prototype.Goto = function () {
        if (this.mType == MainGameNoticeView.TYPE_XIANDAO) {
            GameGlobal.XiandaoModel.EnterPreliminaries();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_CROSSBATTER) {
            GameGlobal.ActivityModel.sendActivityEnter(MainGameNoticeView.TYPE_CROSSBATTER);
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_GANG_BATTLE) {
            if (!GameGlobal.actorModel.HasGuild()) {
                UserTips.ins().showTips("加入帮会才可以参加帮会战");
                return;
            }
            GameGlobal.GangBattleModel.SendEnterBattle();
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_GANG_BOSS) {
            if (!GameGlobal.actorModel.HasGuild()) {
                UserTips.ins().showTips("您还没有帮会");
                return;
            }
            ViewManager.ins().open(GangBossPanel);
            return;
        }
        if (this.mType == MainGameNoticeView.TYPE_CROSS_BOSS) {
            if (!GameGlobal.actorModel.HasGuild()) {
                UserTips.ins().showTips("您还没有帮会");
                return;
            }
            ViewManager.ins().open(CrossMainPanel, 1);
            return;
        }
    };
    MainGameNoticeView.prototype.Close = function () {
        DisplayUtils.removeFromParent(this);
        this.DoClose();
    };
    MainGameNoticeView.TYPE_XIANDAO = 1; // 仙道会
    MainGameNoticeView.TYPE_GANG_BOSS = 3; //帮会BOSS
    MainGameNoticeView.TYPE_CROSSBATTER = 5; //跨服争霸
    MainGameNoticeView.TYPE_GANG_BATTLE = 6; //帮会战
    MainGameNoticeView.TYPE_CROSS_BOSS = 101; // 跨服BOSS
    MainGameNoticeView.SHOW_TYPE_TIME = 1; // 显示倒计时
    MainGameNoticeView.SHOW_TYPE_GOTO = 2; // 显示前往
    return MainGameNoticeView;
}(BaseView));
__reflect(MainGameNoticeView.prototype, "MainGameNoticeView");
//# sourceMappingURL=MainGameNoticeView.js.map