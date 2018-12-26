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
var HouseUpgradePanel = (function (_super) {
    __extends(HouseUpgradePanel, _super);
    function HouseUpgradePanel() {
        var _this = _super.call(this) || this;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this._SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnCulture.label = "停止";
            }
            else {
                _this.btnCulture.label = "自动升阶";
            }
        });
        _this.mHouseSendCheckData = new HouseSendCheckData(function (type) {
            GameGlobal.YingYuanModel.SendAddHouseExp();
        }, function () {
            return GameGlobal.YingYuanModel.GetCostIntimacy();
        });
        return _this;
    }
    HouseUpgradePanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnBuild, this._OnClick);
        this._AddClick(this.btnAdd, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
    };
    HouseUpgradePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.DoSingle);
        this.UpdateContent();
    };
    HouseUpgradePanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    HouseUpgradePanel.prototype.UpdateContent = function () {
        this.groupMaxLv.visible = GameGlobal.YingYuanModel.IsMaxLevel();
        this.groupSingle.visible = !GameGlobal.YingYuanModel.iSMarry() && GameGlobal.YingYuanModel.GetHouseGrade() > 0 && !this.groupMaxLv.visible;
        this.groupUpgrade.visible = !this.groupMaxLv.visible && !this.groupSingle.visible;
        this.UpdateExp();
        var grade = GameGlobal.YingYuanModel.GetHouseGrade();
        var config = HouseConst.GetHouseShowConfig(grade);
        if (!config) {
            return;
        }
        this.cmLabName.text = config.name;
        this.imgIcon.source = config.image;
    };
    HouseUpgradePanel.prototype.UpdateExp = function () {
        this.powerLabel.text = GameGlobal.YingYuanModel.GetPower();
        if (!GameGlobal.YingYuanModel.iSMarry()) {
            return;
        }
        var _a = GameGlobal.YingYuanModel.GetHouseLv(), houseLv = _a[0], houseUpnum = _a[1];
        if (GameGlobal.YingYuanModel.IsMaxLevel()) 
        // if (houseLv > 1 && houseUpnum == 0) //升级
        {
            this.mRoleAutoSendData.Stop();
        }
        else {
            this.mRoleAutoSendData.Continue();
        }
        this.labLev.text = "" + houseLv;
        var grade = GameGlobal.YingYuanModel.GetHouseGrade();
        var houseConfig = HouseConst.GetHouseConfig(grade, houseLv);
        if (!houseConfig) {
            return;
        }
        this.bar.maximum = houseConfig.proexp;
        this.bar.value = houseUpnum;
        var curIntimacy = GameGlobal.YingYuanModel.GetIntimacy();
        this.labCount.text = curIntimacy + "/" + houseConfig.Intimacy;
        this.labCount.textColor = curIntimacy >= houseConfig.Intimacy ? 0x019704 : 0xdb0000;
    };
    HouseUpgradePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnBuild:
                if (!GameGlobal.YingYuanModel.iSMarry()) {
                    UserTips.ins().showTips("只有结婚才可以进行房屋装修升级");
                    return;
                }
                if (GameGlobal.YingYuanModel.IsMaxGrage()) {
                    UserTips.ins().showTips("您的房屋已是最高档，不需要再继续装修");
                    return;
                }
                ViewManager.ins().open(HouseBuildWin);
                break;
            case this.btnAdd:
                this._SendUp();
                break;
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.powerLabel:
                ViewManager.ins().open(HouseDetailWin);
                break;
        }
    };
    HouseUpgradePanel.prototype._SendUp = function () {
        return this.mHouseSendCheckData.SendUp();
    };
    HouseUpgradePanel.prototype.DoSingle = function () {
        UserTips.ins().showTips("您的伴侣已经离开了你");
        ViewManager.ins().close(YingYuanWin);
    };
    HouseUpgradePanel.NAME = "房屋";
    return HouseUpgradePanel;
}(BaseView));
__reflect(HouseUpgradePanel.prototype, "HouseUpgradePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=HouseUpgradePanel.js.map