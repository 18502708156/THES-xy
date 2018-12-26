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
var YingYuanInfoPanel = (function (_super) {
    __extends(YingYuanInfoPanel, _super);
    function YingYuanInfoPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.grade = 1;
        _this.spouse = 1;
        return _this;
    }
    YingYuanInfoPanel.prototype.childrenCreated = function () {
        //this.list.itemRenderer = YingYuanHeadItem
        this.list1.itemRenderer = ItemBase;
        this.list0.itemRenderer = ItemBaseNotName;
    };
    YingYuanInfoPanel.prototype.OnOpen = function () {
        GameGlobal.YingYuanModel.sendMarryFriends();
        this.observe(MessageDef.YING_YUAN_HEAD, this.UpdataHead);
        this.observe(MessageDef.IS_MARRY_INFO, this.UpdateContent);
        this._AddClick(this.chage, this._OnClick);
        this._AddClick(this.girl, this._OnClick);
        this._AddClick(this.box, this._OnClick);
        this._AddClick(this.btnPrev0, this._OnClick);
        this._AddClick(this.btnNext0, this._OnClick);
        this._AddClick(this.jieHunBtn, this._OnClick);
        this._AddClick(this.Bnt, this._OnClick);
        this._AddClick(this.xianHuaBnt, this._OnClick);
        this._AddClick(this.jieHunBnt, this._OnClick);
        this._AddClick(this.liHunBnt, this._OnClick);
        this._AddClick(this.wenHao, this._OnClick);
        this._AddClick(this.helpBtn, this._OnClick);
        this.box.selected = true;
        this.girl.selected = false;
        this.touchEnabled = false;
    };
    YingYuanInfoPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.xianHuaBnt:
                ViewManager.ins().open(YingYuanXianHuaPanel);
                break;
            case this.jieHunBnt:
                ViewManager.ins().open(YingYuanZhengShuPanel);
                break;
            case this.liHunBnt:
                ViewManager.ins().open(YingYuanLiHunPanel);
                break;
            case this.chage:
                ViewManager.ins().open(YingYuanAddPanel);
                break;
            case this.girl:
                this.box.selected = !this.girl.selected;
                this.box.selected ? this.spouse = 1 : this.spouse = 2;
                break;
            case this.box:
                this.girl.selected = !this.box.selected;
                this.box.selected ? this.spouse = 1 : this.spouse = 2;
                break;
            case this.btnPrev0:
                this.grade--;
                if (this.grade == 0) {
                    this.grade = 1;
                    return;
                }
                this.MarryType(this.grade);
                break;
            case this.btnNext0:
                this.grade++;
                if (this.grade > GameGlobal.YingYuanModel.MarryConfigLen()) {
                    this.grade = GameGlobal.YingYuanModel.MarryConfigLen();
                    return;
                }
                this.MarryType(this.grade);
                break;
            case this.jieHunBtn:
                if (!GameGlobal.YingYuanModel.marryFRIend) {
                    return;
                }
                var ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency;
                if (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today == 0) {
                    UserTips.InfoTip("今日没有结婚次数");
                    return;
                }
                GameGlobal.YingYuanModel.marryPropose(GameGlobal.YingYuanModel.marryFRIend.friendInfo.dbid, this.grade, this.spouse);
                break;
            case this.Bnt:
                var Config = GameGlobal.Config.IntimateConfig[GameGlobal.YingYuanModel.marryInfo.level + 1];
                var Info = GameGlobal.YingYuanModel.marryInfo;
                if (Info.intimate < Config.intimate) {
                    return;
                }
                GameGlobal.YingYuanModel.marryLevelUp();
                break;
            case this.wenHao:
                ViewManager.ins().open(ActivityDescPanel, 45, "甜蜜值");
                break;
            case this.helpBtn:
                ViewManager.ins().open(ActivityDescPanel, 18, "规则说明");
                break;
        }
    };
    YingYuanInfoPanel.prototype.UpdateContent = function () {
        if (GameGlobal.YingYuanModel.iSMarry()) {
            this.currentState = "married";
            this.UpExp();
        }
        else {
            this.currentState = "unmarried";
            this.MarryType(this.grade);
            this.UpdataHead();
        }
    };
    YingYuanInfoPanel.prototype.UpExp = function () {
        var Config = GameGlobal.Config.IntimateConfig[GameGlobal.YingYuanModel.marryInfo.level + 1];
        var Info = GameGlobal.YingYuanModel.marryInfo;
        this.qingLv.text = Config.name + "(Lv." + Info.level + ")";
        this.bar.maximum = Config.intimate;
        this.bar.value = Info.intimate;
        this.pro.text = Info.intimate + "/" + Config.intimate;
        this.list1.dataProvider = new eui.ArrayCollection(Config.reward);
        var dataHusband = GameGlobal.YingYuanModel.marryInfo.husband;
        var dataWife = GameGlobal.YingYuanModel.marryInfo.wife;
        this.roleShowPanel0.SetShowMarry(dataHusband);
        this.roleShowPanel1.SetShowMarry(dataWife);
        var ConfigData = GameGlobal.Config.IntimateConfig;
        var pReData;
        for (var item in ConfigData) {
            if (ConfigData[item].level > Info.level && ConfigData[item].id) {
                pReData = ConfigData[item];
                break;
            }
        }
        if (pReData) {
            this.pGroupRewar.visible = true;
            this.itemBaee.data = pReData.id;
            this.lbPassLvReward.text = pReData.caption;
        }
        else {
            this.pGroupRewar.visible = false;
        }
    };
    YingYuanInfoPanel.prototype.UpdataHead = function () {
        var dataModel = GameGlobal.YingYuanModel;
        if (!dataModel.marryFRIend) {
            var data = null;
            //this.list.dataProvider = new eui.ArrayCollection([data]);
        }
        else {
            var data = {
                name: dataModel.marryFRIend.friendInfo.name,
                job: dataModel.marryFRIend.friendInfo.job,
                sex: dataModel.marryFRIend.friendInfo.sex,
            };
            this.head.data = data;
            //this.list.dataProvider = new eui.ArrayCollection([data]);
        }
        var ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency;
        this.DayTimes.text = "今日还可结婚：" + (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today) + "/" + ConfigModel;
    };
    YingYuanInfoPanel.prototype.MarryType = function (type) {
        var Config = GameGlobal.Config.MarryConfig[type];
        this.imgIcon0.source = Config.marryicon;
        // this.imgIcon1.source = Config.normalrewardicon
        // this.imgIcon2.source = Config.houseicon
        this.priceicon.setType(Config.price.id);
        this.priceicon.setPrice(Config.price.count);
        this.list0.dataProvider = new eui.ArrayCollection(Config.id);
    };
    YingYuanInfoPanel.NAME = "婚姻";
    return YingYuanInfoPanel;
}(BaseView));
__reflect(YingYuanInfoPanel.prototype, "YingYuanInfoPanel", ["ICommonWindowTitle"]);
var YingYuanHeadItem = (function (_super) {
    __extends(YingYuanHeadItem, _super);
    function YingYuanHeadItem() {
        return _super.call(this) || this;
    }
    YingYuanHeadItem.prototype.childrenCreated = function () {
    };
    YingYuanHeadItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            return;
        }
        this.username.text = data.name;
        this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex);
    };
    return YingYuanHeadItem;
}(eui.ItemRenderer));
__reflect(YingYuanHeadItem.prototype, "YingYuanHeadItem");
//# sourceMappingURL=YingYuanInfoPanel.js.map