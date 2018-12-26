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
var ShouDaoPanel = (function (_super) {
    __extends(ShouDaoPanel, _super);
    function ShouDaoPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.skinName = "ShouDaoSkin";
        return _this;
    }
    ShouDaoPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.jieshou, this._OnClick);
        this._AddClick(this.jujue, this._OnClick);
        this._AddClick(this.next, this._OnClick);
        this.list0.itemRenderer = ItemBaseNotName;
        this.updateContent();
    };
    ShouDaoPanel.prototype.updateContent = function () {
        if (GameGlobal.YingYuanModel.askMarry.length == 0) {
            ViewManager.ins().close(this);
            return;
        }
        if (this.index == (GameGlobal.YingYuanModel.askMarry.length - 1)) {
            this.next.label = "取消";
        }
        var data = GameGlobal.YingYuanModel.askMarry[this.index];
        if (!data) {
            ViewManager.ins().close(this);
            return;
        }
        var Config = GameGlobal.Config.MarryConfig[data.grade];
        this.hunType.source = Config.marryicon;
        this.list0.dataProvider = new eui.ArrayCollection(Config.id);
        this.text.text = data.name + " " + data.level + "级   " + data.power + "战斗力";
        this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex);
        var ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency;
        this.DayTimes.text = "今日还可结婚：" + (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today) + "/" + ConfigModel;
    };
    ShouDaoPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.jieshou:
                var ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency;
                if (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today == 0) {
                    UserTips.InfoTip("今日没有结婚次数");
                    return;
                }
                GameGlobal.YingYuanModel.marryAnswer(1, GameGlobal.YingYuanModel.askMarry[this.index].fromid);
                break;
            case this.jujue:
                GameGlobal.YingYuanModel.marryAnswer(0, GameGlobal.YingYuanModel.askMarry[this.index].fromid);
                GameGlobal.YingYuanModel.removeAnswer(GameGlobal.YingYuanModel.askMarry[this.index].fromid);
                this.updateContent();
                break;
            case this.next:
                if (this.index == (GameGlobal.YingYuanModel.askMarry.length - 1)) {
                    ViewManager.ins().close(this);
                    return;
                }
                this.index++;
                this.updateContent();
                break;
        }
    };
    ShouDaoPanel.prototype.OnClose = function () {
    };
    ShouDaoPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ShouDaoPanel;
}(BaseEuiView));
__reflect(ShouDaoPanel.prototype, "ShouDaoPanel", ["ICommonWindow"]);
//# sourceMappingURL=ShouDaoPanel.js.map