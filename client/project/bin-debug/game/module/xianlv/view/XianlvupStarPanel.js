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
var XianlvupStarPanel = (function (_super) {
    __extends(XianlvupStarPanel, _super);
    function XianlvupStarPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mWindowHelpId = 5;
        return _this;
    }
    XianlvupStarPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.curSkill, this._OnClick);
        this._AddClick(this.nextSkill, this._OnClick);
        this._AddClick(this.baseView.btnZZ, this._OnClick);
    };
    XianlvupStarPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent);
    };
    XianlvupStarPanel.prototype.XianlvUpAttr = function () {
        var model = GameGlobal.XianlvModel;
        var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
        var xianlvId = selectConfig.id;
        var xianlvInfo = model.GetXianlvInfo(xianlvId);
        var quality = GameGlobal.Config.partnerBiographyConfig[xianlvId].quality;
        var Level = GameGlobal.Config.partnerLvproConfig[quality][xianlvInfo.mLevel];
        var Star = GameGlobal.Config.partnerAttrsConfig[xianlvId][xianlvInfo.mStar - 1];
        var NextStar = GameGlobal.Config.partnerAttrsConfig[xianlvId][xianlvInfo.mStar];
        var skill = GameGlobal.Config.SkillsConfig[Star.skillid];
        if (NextStar) {
            var Nextskill = GameGlobal.Config.SkillsConfig[NextStar.skillid];
            var attr0 = Star.attrs; //= this.XianlvupAttr.addAttrType(Star.attrs,Level.attrs)
            var attr1 = NextStar.attrs; // this.XianlvupAttr.addAttrType(NextStar.attrs,Level.attrs)
            this.XianlvupAttr.setAttrNol(attr0, attr1);
            this.XianlvupAttr.setStarNol(xianlvInfo.mStar, xianlvInfo.mStar + 1);
            this.XianlvupAttr.setSkillNol([skill[7], skill[8], skill[9]], [Nextskill[7], Nextskill[8], Nextskill[9]]);
        }
        else {
            var attr0 = Star.attrs; //this.XianlvupAttr.addAttrType(Star.attrs,Level.attrs)
            this.XianlvupAttr.setAttrFull(attr0);
            this.XianlvupAttr.setStarFull(xianlvInfo.mStar);
            this.XianlvupAttr.setSkillFull([skill[7], skill[8], skill[9]]);
        }
    };
    XianlvupStarPanel.prototype.UpdateInfo = function (id) {
        _super.prototype.UpdateInfo.call(this, id);
        this.m_XianlvId = id;
        var model = GameGlobal.XianlvModel;
        var info = GameGlobal.XianlvModel.GetXianlvInfo(id);
        if (info.mStar >= model.MAX_STAR) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        var config = GameGlobal.Config.partnerAttrsConfig[info.mXianlvId][info.mStar - 1];
        if (config) {
            this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count);
        }
        PetSkillIconItem.SetContent(this.curSkill, info.GetSkillId(), 0);
        var curStar = Math.max(info.mStar, 1);
        this.curStarNum.text = curStar.toString();
        PetSkillIconItem.SetContent(this.nextSkill, info.GetSkillId(1), 0);
        this.nextStarNum.text = (curStar + 1).toString();
        this.XianlvUpAttr();
    };
    XianlvupStarPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this._Send();
                break;
            case this.curSkill:
                {
                    var info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId);
                    ViewManager.ins().open(XianlvSkillTipPanel, info.GetSkillId(), info.GetSkillId(1), info.mStar);
                }
                break;
            case this.nextSkill:
                {
                    var info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId);
                    ViewManager.ins().open(XianlvSkillTipPanel, info.GetSkillId(1), info.GetSkillId(2), info.mStar + 1);
                }
                break;
            case this.baseView.btnZZ:
                if (GameGlobal.XianlvModel.HasBattle(this.m_XianlvId)) {
                    GameGlobal.XianlvModel.SendUnBattle(this.m_XianlvId);
                }
                else {
                    ViewManager.ins().open(XianlvBattlePanel, this.m_XianlvId);
                }
                break;
        }
    };
    XianlvupStarPanel.prototype._Send = function () {
        var info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId);
        var config = GameGlobal.Config.partnerAttrsConfig[info.mXianlvId][info.mStar - 1];
        if (config) {
            if (Checker.CheckDatas(config.cost, false)) {
                GameGlobal.XianlvModel.SendUpStar(info.mXianlvId);
            }
        }
    };
    XianlvupStarPanel.RedPointCheck = function () {
        return GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_STAR);
    };
    XianlvupStarPanel.NAME = "升星";
    return XianlvupStarPanel;
}(XianlvBaseInfoPanel));
__reflect(XianlvupStarPanel.prototype, "XianlvupStarPanel");
//# sourceMappingURL=XianlvupStarPanel.js.map