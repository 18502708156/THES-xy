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
var LingtongRankPanel = (function (_super) {
    __extends(LingtongRankPanel, _super);
    function LingtongRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongRankSkin";
        _this.GainWay();
        _this._AddClick(_this.skillIcon, _this._OnItemClick);
        _this._AddClick(_this.btnAuto, _this._OnItemClick);
        _this._AddClick(_this.btnCulture, _this._OnItemClick);
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this.SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnAuto.label = "停止";
            }
            else {
                _this.btnAuto.label = "自动进阶";
            }
        }, 200);
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            GameGlobal.LingtongAttrModel.SendAddGift();
        }, function () {
            var model = GameGlobal.LingtongAttrModel;
            if (model.giftlv >= model.MAX_GIFT_LEVEL) {
                return [null];
            }
            var config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1];
            if (!config) {
                return;
            }
            return [null, null, config.cost[0].id, config.cost[0].count];
        }, function () {
            return false;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        return _this;
    }
    LingtongRankPanel.prototype.SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    LingtongRankPanel.prototype.childrenCreated = function () {
    };
    LingtongRankPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.LINGTONG_UPDATE_GIFT_INFO, this.UpdateRank);
        this.UpdateContent();
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.lbName.text = GameGlobal.LingtongAttrModel.mName;
        LingtongViewHelper.SetRole(this.petShowPanel0);
    };
    LingtongRankPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    LingtongRankPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnAuto, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK));
        UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK));
    };
    LingtongRankPanel.prototype.UpdateRank = function () {
        this.mRoleAutoSendData.Continue();
        this.UpdateContent();
    };
    LingtongRankPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.LingtongAttrModel;
        if (!model.IsActive()) {
            return;
        }
        var config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1];
        if (!config) {
            return;
        }
        this.SetSkillDes(this.leftComp, GameGlobal.LingtongAttrModel.GetSkillId());
        PetSkillIconItem.SetContent(this.skillIcon, GameGlobal.LingtongAttrModel.GetSkillId(), 0);
        var attrs = GameGlobal.LingtongAttrModel.getTianFuAllAttr();
        this.skinAttr.textFlow = AttributeData.GetAttrTabString(attrs);
        this.powerLabel.text = UserBag.getAttrPower(attrs);
        this.lbLev.text = PetZizhiPanel.TYPE[model.giftlv];
        if (model.giftlv >= model.MAX_GIFT_LEVEL) {
            this.infoGroup.visible = false;
            this.lbFull.visible = true;
            this.leftComp.x = 229;
            this.arrImg.visible = false;
            this.rightComp.visible = false;
            return;
        }
        this.leftComp.x = 34;
        this.arrImg.visible = true;
        this.rightComp.visible = true;
        this.SetSkillDes(this.rightComp, GameGlobal.LingtongAttrModel.GetNextSkillId());
        this.bar.maximum = config.proexp;
        this.bar.value = model.giftexp * config.exp;
        this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count);
    };
    LingtongRankPanel.prototype._OnItemClick = function (e) {
        switch (e.currentTarget) {
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId());
                break;
            case this.btnCulture:
                this.SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
        }
    };
    LingtongRankPanel.prototype.GainWay = function () {
        var model = GameGlobal.LingtongAttrModel;
        if (!model.IsActive()) {
            return;
        }
        var config = GameGlobal.Config.BabyTalentConfig[GameGlobal.LingtongAttrModel.mSex][model.giftlv - 1];
        if (!config) {
            return;
        }
        var id = config.cost[0].id;
        this.getwayLabel.SetId(id);
    };
    LingtongRankPanel.prototype.SetSkillDes = function (comp, skillId) {
        comp.iconImg.source = PetConst.GetSkillIcon(skillId);
        comp.skillName.text = PetConst.GetSkillName(skillId);
        var quality = PetConst.GetSkillQuality(skillId);
        comp.skillName.textColor = ItemBase.GetColorByQuality(quality);
        comp.skillDesc.text = PetConst.GetSkillDesc(skillId);
    };
    LingtongRankPanel.RedPointCheck = function () {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK);
    };
    LingtongRankPanel.NAME = "天赋";
    return LingtongRankPanel;
}(BaseView));
__reflect(LingtongRankPanel.prototype, "LingtongRankPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LingtongRankPanel.js.map