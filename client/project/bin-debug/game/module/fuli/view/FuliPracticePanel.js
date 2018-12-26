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
 * 福利_历练
 */
var FuliPracticePanel = (function (_super) {
    __extends(FuliPracticePanel, _super);
    function FuliPracticePanel() {
        var _this = _super.call(this) || this;
        //自己积分
        _this.myScore = 0;
        _this.lv = 0;
        _this.distanceLv = 0;
        _this.tabID = 1;
        //显示类型 1绑元奖励 2经验奖励
        _this.showType = 2;
        //选择宝箱的索引 1 2 3 
        _this.index = 1;
        _this.isOwn = false; //是否夠歷練分
        _this.skinName = "FuliPracticeSkin";
        return _this;
    }
    FuliPracticePanel.CheckRedPoint = function () {
        if (!Deblocking.Check(GameGlobal.Config.WelfareBaseConfig.opentype, true)) {
            return false;
        }
        return GameGlobal.FuliModel.mRedPoint.PracticeShowRedPoint();
    };
    FuliPracticePanel.prototype.childrenCreated = function () {
        this.welfareBaseConfigTab = GameGlobal.Config.WelfareBaseConfig;
        this.welfareConfigTab = GameGlobal.Config.WelfareConfig;
        this.data = GameGlobal.FuliModel.FuliData;
        this.lv = GameGlobal.actorModel.level;
        this.distanceLv = this.data.avgLv - this.lv;
        if (this.distanceLv <= 3)
            this.showType = 1;
        else
            this.showType = 2;
        for (var key in this.welfareConfigTab) {
            var lvArr = this.welfareConfigTab[key].level;
            if (lvArr.length == 2) {
                if (this.lv >= lvArr[0] && this.lv <= lvArr[1]) {
                    this.tabID = Number(key);
                    break;
                }
            }
            else {
                this.tabID = Number(key);
            }
        }
        this._AddClick(this.questionBtn, this._OnClick);
        this._AddClick(this.receiveBtn, this._OnClick);
        this._AddClick(this.gotoLab, this._OnClick);
        this._AddClick(this.boxImg0, this._OnClick);
        this._AddClick(this.boxImg1, this._OnClick);
        this._AddClick(this.boxImg2, this._OnClick);
    };
    FuliPracticePanel.prototype.OnOpen = function () {
        //this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.updateTop1Panel);
        this.observe(MessageDef.FULI_GET_RECEIVEITEMSIGN, this.updateItemSign);
        //GameGlobal.RankingModel.sendRank(2);
        var baseInfo = GameGlobal.DailyModel.baseInfo;
        this.myScore = baseInfo.mCurActive;
        this.score.text = this.myScore.toString();
        this.worldClassLab.text = (this.data.avgLv).toString();
        this.progressBar.value = this.myScore;
        var arr = this.welfareBaseConfigTab.score;
        this.progressBar.maximum = arr[arr.length - 1];
        this.itemGetImg.visible = false;
        if (this.showType == 1) {
            this.item.setItemData(this.welfareConfigTab[this.tabID].goldreward[0]);
            // this.item.isShowName(false);
        }
        else {
            this.item.setItemData(this.welfareConfigTab[this.tabID].expreward[0]);
            // this.item.isShowName(false);
        }
        if (this.myScore < arr[0])
            this.index = 1;
        for (var i = 0; i < arr.length; i++) {
            this["gainedImg" + i].visible = false;
            if (GameGlobal.FuliModel.isReceive(i + 1) == true) {
                this["gainedImg" + i].visible = true;
            }
            if (this.myScore >= arr[i]) {
                if (GameGlobal.FuliModel.isReceive(i + 1) == false)
                    this.index = i + 1;
                else {
                    if (i > 0) {
                        if (GameGlobal.FuliModel.isReceive(i) == false)
                            this.index = i;
                        else
                            this.index = i + 1;
                    }
                }
            }
        }
        this.isItemGetImg(this.index);
        this.isShowSelectBoxImg(this.index);
        this.showTop1Panel();
        this.isOwnTF(this.welfareBaseConfigTab.score[0]);
    };
    FuliPracticePanel.prototype.showTop1Panel = function () {
        for (var i = 0; i < this.data.rankData.length; i++) {
            var color = 0xFF5900;
            if (i == 0)
                color = 0xFF5900;
            if (i == 1)
                color = 0xAF2BB7;
            if (i == 2)
                color = 0x5A6EE7;
            if (i + 1 < 4) {
                RoleComponent.setlv(this["top" + (i + 1) + "Panel"], this.data.rankData[i].level, color);
                this["top" + (i + 1) + "Panel"].setName(this.data.rankData[i].name, color);
                RoleComponent.SetShowImage(this["top" + (i + 1) + "Panel"], this.data.rankData[i].job, this.data.rankData[i].sex, this.data.rankData[i].shows);
            }
        }
    };
    FuliPracticePanel.prototype.updateItemSign = function (msg) {
        if (msg.ret) {
            if (GameGlobal.FuliModel.isReceive(this.index)) {
                var num = this.index - 1;
                this["gainedImg" + num].visible = true;
                this.itemGetImg.visible = true;
            }
        }
    };
    FuliPracticePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.receiveBtn:
                if (this.isOwn == false)
                    UserTips.ins().showTips("活跃度不足");
                else
                    GameGlobal.FuliModel.ReceiveItem(this.index);
                break;
            case this.questionBtn:
                ViewManager.ins().open(ActivityDescPanel, this.welfareBaseConfigTab.welfarehelpinfo);
                break;
            case this.gotoLab:
                ViewManager.ins().close(FuliPracticePanel);
                ViewManager.ins().open(DailyMainWin);
                break;
            case this.boxImg0:
                this.isOwnTF(this.welfareBaseConfigTab.score[0]);
                this.index = 1;
                this.isItemGetImg(this.index);
                this.isShowSelectBoxImg(this.index);
                break;
            case this.boxImg1:
                this.isOwnTF(this.welfareBaseConfigTab.score[1]);
                this.index = 2;
                this.isItemGetImg(this.index);
                this.isShowSelectBoxImg(this.index);
                break;
            case this.boxImg2:
                this.isOwnTF(this.welfareBaseConfigTab.score[2]);
                this.index = 3;
                this.isItemGetImg(this.index);
                this.isShowSelectBoxImg(this.index);
                break;
        }
    };
    //判断分数 是否足够
    FuliPracticePanel.prototype.isOwnTF = function (score) {
        this.myScore = GameGlobal.DailyModel.baseInfo.mCurActive;
        if (this.myScore >= score)
            this.isOwn = true;
        else
            this.isOwn = false;
        return this.isOwn;
    };
    //item领取是否显示
    FuliPracticePanel.prototype.isItemGetImg = function (index) {
        if (GameGlobal.FuliModel.isReceive(index) == true) {
            this.itemGetImg.visible = true;
        }
        else {
            this.itemGetImg.visible = false;
        }
    };
    //小宝箱选中效果是否显示
    FuliPracticePanel.prototype.isShowSelectBoxImg = function (index) {
        this.selectBoxImg0.visible = false;
        this.selectBoxImg1.visible = false;
        this.selectBoxImg2.visible = false;
        var num = index - 1;
        this["selectBoxImg" + num].visible = true;
    };
    FuliPracticePanel.prototype.OnClose = function () {
    };
    //skinName
    //FuliPracticeSkin.exml
    FuliPracticePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliPracticePanel;
}(BaseEuiView));
__reflect(FuliPracticePanel.prototype, "FuliPracticePanel");
var RoleComponent = (function (_super) {
    __extends(RoleComponent, _super);
    function RoleComponent() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShowPanelSkin";
        return _this;
    }
    RoleComponent.prototype.setName = function (name, color) {
        this.nameTxt.text = name;
        this.nameTxt.textColor = color;
    };
    RoleComponent.setlv = function (comp, lv, color) {
        if (comp != undefined) {
            comp.lvTxt.text = "Lv." + lv;
            comp.lvTxt.textColor = color;
        }
    };
    RoleComponent.SetShowImage = function (comp, job, sex, shows) {
        var playerInfo = new Sproto.sc_show_other_player_request;
        playerInfo["job"] = job;
        playerInfo["sex"] = sex;
        playerInfo["shows"] = shows;
        if (comp != undefined) {
            comp.roleShowPanel.mScale = 1;
            comp.roleShowPanel.SetShowImage(playerInfo);
            comp.roleShowPanel.SetTianx("");
            comp.roleShowPanel.scaleX = comp.roleShowPanel.scaleY = 0.8;
        }
    };
    return RoleComponent;
}(eui.Component));
__reflect(RoleComponent.prototype, "RoleComponent");
//# sourceMappingURL=FuliPracticePanel.js.map