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
/**
 81难-生死劫(小关卡选择界面)
 */
// TsumKoBaseSkin.exml
var TsumKoBasePanel = (function (_super) {
    __extends(TsumKoBasePanel, _super);
    function TsumKoBasePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TsumKoBaseSkin";
        _this.teamPanel.mModel = GameGlobal.TsumKoModel;
        _this._AddClick(_this.shopBtn, _this._OnClick);
        _this._AddClick(_this.recordLabel, _this._OnClick);
        _this._AddClick(_this.eliminatePanel.onceBtn, _this._OnClick);
        _this.teamPanel.checkBox0.addEventListener(egret.Event.CHANGE, _this._OnClick, _this);
        _this.teamPanel.checkBox1.addEventListener(egret.Event.CHANGE, _this._OnClick, _this);
        _this.observe(MessageDef.TEAM_UPDATE_LEAVE, _this.removeChatID);
        // this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.updateModelView);
        _this.observe(MessageDef.CHOICECHECKPOINT, _this.updateModelView);
        _this.observe(MessageDef.CHOICECHECKPOINT, _this.updateShow);
        return _this;
    }
    TsumKoBasePanel.prototype.childrenCreated = function () {
        this.teamPanel.mNotAutoJoint = true;
        this.teamPanel.SetTime(10, 60);
    };
    TsumKoBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("八十一难");
        this.teamPanel.DoOpen(null);
        this.teamPanel.checkBox1.selected = GameGlobal.TsumKoModel.btnSign1 ? true : false;
        this.teamPanel.checkBox0.selected = GameGlobal.TsumKoModel.btnSign0 ? true : false;
        if (this.isTeaming() == true) {
            this.teamPanel.checkBox1.selected = true;
            this.teamPanel.checkBox0.selected = true;
        }
        // let count1=GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
        // let helpCount=GameGlobal.TsumKoBaseModel.info_helpReward;
        // if(helpCount==undefined)helpCount=0;
        // let count=count1-helpCount;
        // this.countLabel.text="("+count+"/"+count1+")";
        this.updateModelView();
        var defaultID = GameGlobal.TsumKoBaseModel.recordId;
        this.setLabel(defaultID);
        this.setItemList(defaultID);
        this.updateLabel();
    };
    TsumKoBasePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BASHI]);
                break;
            case this.recordLabel:
                //ViewManager.ins().close(TsumKoBasePanel);
                ViewManager.ins().open(TsumKoBaseRecordPanel);
                // GameGlobal.TsumKoBaseModel2.Record(GameGlobal.TsumKoBaseModel2.recordId);
                break;
            case this.teamPanel.checkBox0:
                GameGlobal.TsumKoModel.btnSign0 = this.teamPanel.checkBox0.selected;
                break;
            case this.teamPanel.checkBox1:
                GameGlobal.TsumKoModel.btnSign1 = this.teamPanel.checkBox1.selected;
                break;
            case this.eliminatePanel.onceBtn:
                // this.updateModelView();
                var selectID = GameGlobal.TsumKoBaseModel.recordId; //選中ID
                this.isShowView(this.teamPanel);
                this.teamPanel.UpdateKey(GameGlobal.Config.DisasterFbConfig[selectID].id);
                this.setLabel(selectID);
                break;
        }
    };
    TsumKoBasePanel.prototype.updateLabel = function () {
        var count1 = GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
        var helpCount = GameGlobal.TsumKoBaseModel.info_helpReward;
        if (helpCount == undefined)
            helpCount = 0;
        var count = count1 - helpCount;
        this.countLabel.text = "(" + count + "/" + count1 + ")";
    };
    //更新顯示模塊
    TsumKoBasePanel.prototype.updateModelView = function () {
        var selectID = GameGlobal.TsumKoBaseModel.recordId; //選中ID
        var config = GameGlobal.Config.DisasterFbConfig[selectID];
        if (!config) {
            return;
        }
        var currentID = GameGlobal.TsumKoBaseModel.info_clear; //以前通關ID
        var selsectChapter = GameGlobal.TsumKoBaseModel.chapterid; //選中的章節
        if (this.isTeaming() == false) {
            if (GameGlobal.TsumKoBaseModel.chatXiD == 0) {
                if (selectID > currentID + 1) {
                    this.isShowView(this.baffleImg);
                }
                else {
                    if (selectID > currentID) {
                        this.isShowView(this.teamPanel);
                        this.teamPanel.UpdateKey(config.id);
                        this.setLabel(selectID);
                    }
                    else {
                        var id = config.sectionid;
                        if (GameGlobal.TsumKoBaseModel.IsClearance(selsectChapter, id) == true) {
                            this.isShowView(this.teamPanel);
                            this.teamPanel.UpdateKey(config.id);
                            this.setLabel(selectID);
                        }
                        else {
                            this.isShowView(this.eliminatePanel);
                        }
                    }
                }
            }
            else {
                this.isShowView(this.teamPanel);
                this.teamPanel.UpdateKey(config.id);
                this.setLabel(selectID);
            }
        }
        else {
            this.isShowView(this.teamPanel);
            this.teamPanel.UpdateKey(config.id);
            this.setLabel(selectID);
        }
    };
    TsumKoBasePanel.prototype.updateShow = function () {
        var newId = GameGlobal.TsumKoBaseModel.recordId;
        this.setLabel(newId);
        this.setItemList(newId);
        this.updateLabel();
    };
    TsumKoBasePanel.prototype.setLabel = function (id) {
        var chatXiD = GameGlobal.TsumKoBaseModel.chatXiD;
        this.title0.text = GameGlobal.Config.DisasterFbConfig[id].name;
        if (chatXiD != 0) {
            this.title0.text = GameGlobal.Config.DisasterFbConfig[chatXiD].name;
            this.title1.text = GameGlobal.Config.DisasterFbConfig[chatXiD].name;
            var chapterid = GameGlobal.TsumKoBaseModel.chapterid;
            if (chapterid != 0 && chapterid != Math.ceil(chatXiD / 9))
                this.title0.text = GameGlobal.Config.DisasterFbConfig[chapterid * 9 - 9 + 1].name;
            if (id != chatXiD)
                this.title0.text = GameGlobal.Config.DisasterFbConfig[id].name;
        }
        else {
            this.title1.text = GameGlobal.Config.DisasterFbConfig[id].name;
        }
    };
    //是否存在組隊
    TsumKoBasePanel.prototype.isTeaming = function () {
        return GameGlobal.TsumKoModel.mTeamInfo.HasTeam() ? true : false;
    };
    TsumKoBasePanel.prototype.setItemList = function (id) {
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.Config.DisasterFbConfig[id].showdrop);
    };
    //顯示其中一個介面
    TsumKoBasePanel.prototype.isShowView = function (view) {
        this.eliminatePanel.visible = false;
        this.teamPanel.visible = false;
        this.baffleImg.visible = false;
        view.visible = true;
    };
    //離開隊伍 chatX清0
    TsumKoBasePanel.prototype.removeChatID = function () {
        GameGlobal.TsumKoBaseModel.chatXiD = 0;
    };
    TsumKoBasePanel.prototype.OnClose = function () {
        this.commonWindowBg.OnAdded(this);
        if (GameGlobal.TsumKoModel.mTeamInfo.HasTeam() == false)
            GameGlobal.TsumKoBaseModel.chatXiD = 0;
        this.teamPanel.DoClose();
        // this.T1.DoClose()
    };
    TsumKoBasePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return TsumKoBasePanel;
}(BaseEuiView));
__reflect(TsumKoBasePanel.prototype, "TsumKoBasePanel", ["ICommonWindow"]);
var TsumKoBaseMemberPanel = (function (_super) {
    __extends(TsumKoBaseMemberPanel, _super);
    function TsumKoBaseMemberPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TsumKoBaseMemberSkin";
        return _this;
        //this.checkBox1.label = this.mTime.mAutoOpen + TeamBaseMemberView.LABEL.FULL_OPEN2
    }
    return TsumKoBaseMemberPanel;
}(TeamBaseMemberView));
__reflect(TsumKoBaseMemberPanel.prototype, "TsumKoBaseMemberPanel");
//# sourceMappingURL=TsumKoBasePanel.js.map