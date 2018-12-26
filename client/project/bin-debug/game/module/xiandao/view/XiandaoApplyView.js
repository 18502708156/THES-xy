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
var XiandaoApplyView = (function (_super) {
    __extends(XiandaoApplyView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XiandaoApplyView() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoApplySkin";
        UIHelper.SetLinkStyleLabel(_this.ruleLabel);
        UIHelper.SetLinkStyleLabel(_this.videoLabel);
        _this.list.itemRenderer = ItemBaseNotName;
        return _this;
    }
    XiandaoApplyView.prototype.childrenCreated = function () {
        this._AddClick(this.ruleLabel, this._OnClick);
        this._AddClick(this.videoLabel, this._OnClick);
        this._AddClick(this.goBtn, this._OnClick);
    };
    XiandaoApplyView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.ruleLabel:
                ViewManager.ins().open(ActivityDescPanel, 39);
                break;
            case this.videoLabel:
                // GameGlobal.XiandaoModel.SendVideo(2, 1, 1)	
                ViewManager.ins().open(XiandaoVideoPanel, 3, 0);
                break;
            case this.goBtn:
                if (GameGlobal.XiandaoModel.IsApply()) {
                    GameGlobal.XiandaoModel.SendApply();
                }
                else {
                    GameGlobal.XiandaoModel.EnterPreliminaries();
                }
                break;
        }
    };
    XiandaoApplyView.prototype.OnOpen = function () {
        this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent);
        this.UpdateContent();
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.XianDuMatchBaseConfig.showItem);
    };
    XiandaoApplyView.prototype.UpdateContent = function () {
        var model = GameGlobal.XiandaoModel;
        this.stateLabel.visible = false;
        this.goBtn.visible = false;
        if (model.mType == XiandaoState._2_FINAL_DONE) {
            this.closeLabel.visible = true;
            this.closeLabel.text = "仙道会已经结束";
        }
        else {
            if (model.IsClose()) {
                this.closeLabel.visible = true;
                this.closeLabel.text = "仙道会已经关闭";
            }
            else {
                this.closeLabel.visible = false;
                this.goBtn.visible = true;
                if (model.CanEnter()) {
                    if (model.mSign) {
                        this.goBtn.label = "进入";
                        this.stateLabel.visible = true;
                    }
                    else {
                        this.closeLabel.visible = true;
                        this.closeLabel.text = "未报名";
                        this.goBtn.visible = false;
                    }
                }
                else if (model.mSign) {
                    this.closeLabel.visible = true;
                    this.closeLabel.text = "已报名";
                    this.goBtn.visible = false;
                }
                else {
                    this.goBtn.label = "报名";
                }
            }
        }
        var turnData;
        var last = model.GetLast();
        if (last) {
            var turnDatas = model.GetKnockoutData().turnDatas[3];
            if (turnDatas) {
                turnData = turnDatas[0];
            }
        }
        if (turnData) {
            this.firstGroup.visible = true;
            var roleA = model.GetRoleData(turnData.noA);
            var roleB = model.GetRoleData(turnData.noB);
            var role = last == turnData.noA ? roleA : roleB;
            this.firstLabel.text = GameString.GetSerAndName(role.serverId, role.roleName);
            UIHelper.SetHead(this.head1, roleA.shows.job, roleA.shows.sex);
            UIHelper.SetHead(this.head2, roleB.shows.job, roleB.shows.sex);
            this.roleShowPanel.SetShowImage(role.shows);
        }
        else {
            this.firstGroup.visible = false;
            this.firstLabel.text = "暂无";
        }
    };
    return XiandaoApplyView;
}(BaseView));
__reflect(XiandaoApplyView.prototype, "XiandaoApplyView", ["ICommonWindowTitle"]);
//# sourceMappingURL=XiandaoApplyView.js.map