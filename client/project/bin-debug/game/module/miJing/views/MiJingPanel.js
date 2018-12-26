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
var MiJingPanel = (function (_super) {
    __extends(MiJingPanel, _super);
    function MiJingPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        // private show_mc:MovieClip
        _this.geziArr = [];
        _this.gezi2Arr = [];
        _this.floorAwardArr = [];
        _this.isAuto = false;
        _this.isPlayAnimi = false;
        // private randomTimes:number
        _this.startY = 340;
        _this.currentPace = 0;
        _this.currentFloor = 0;
        _this.mWindowHelpId = 37;
        _this.name = "秘境";
        _this.skinName = "MiJingMainWinSkin";
        var role = GameGlobal.SubRoles.GetRoleData();
        _this.roleIcon1.source = "ui_mj_head_" + role.job + role.sex;
        return _this;
    }
    MiJingPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.gzGroup.visible = true;
        var mjBaseCfg = GameGlobal.Config.MythBaseConfig;
        var MythFloorRwCfg = GameGlobal.Config.MythFloorRwConfig;
        var mjModel = GameGlobal.MiJingModel;
        var i;
        var len = MiJingModel.MaxPace;
        this.geziArr = this.gzGroup.$children.slice().reverse();
        this.gezi2Arr = this.gzGroup0.$children.slice().reverse();
        var lastFloor = 0;
        var index = 0;
        for (var key in MythFloorRwCfg) {
            var child = this.rewardGroup.$children[index];
            if (!child) {
                continue;
            }
            var element = MythFloorRwCfg[key];
            child.name = key;
            var awardItem = new MJFloorRwItem(child, this["rewardBg" + index]);
            awardItem.initData(parseInt(key), lastFloor, element.floor);
            this._AddClick(child, this._OnItemClick);
            lastFloor = element.floor;
            this.floorAwardArr.push(awardItem);
            ++index;
        }
        this.bar_2.slideDuration = 0;
        this.bar_2.labelDisplay.visible = true;
        // this.priceIcon.price = mjBaseCfg.autoCost;
        this.priceIcon.text = mjBaseCfg.autoCost.count + "/次";
        this.dicAinmi = new MovieClip();
        this.dicAinmi.x = this.dice_img.x;
        this.dicAinmi.y = this.dice_img.y;
        this.dicAinmi.touchEnabled = false;
        this.dicAinmi.scaleX = this.dicAinmi.scaleY = 1.5;
        this.dicAinmi.visible = false;
        // this.show_mc = new MovieClip();
        // this.show_mc.x = this.shop_btn.x + this.shop_btn.width/2;
        // this.show_mc.y = this.shop_btn.y + this.shop_btn.height/2;
        // this.show_mc.scaleX = this.show_mc.scaleY= 1.5
    };
    MiJingPanel.prototype._OnItemClick = function (e) {
        var name = e.currentTarget.name;
        ViewManager.ins().open(MJFloorAwardWin, Number(name));
    };
    MiJingPanel.prototype.onTweenGroupComplete = function () {
        if (!this.arrowImg.visible) {
            return;
        }
        this.play.play(0);
    };
    MiJingPanel.prototype.OnOpen = function () {
        var mjModel = GameGlobal.MiJingModel;
        this.AddLoopTimer(1000, this.updateTimes);
        this.UpdateContent();
        this.updateTimes();
        this.AddClick(this.btn, this.onTap);
        this.AddClick(this.auto_btn, this.onTap);
        this.AddClick(this.paceAward_btn, this.onTap);
        this.AddClick(this.check, this.onTap);
        this.AddClick(this.reStart, this.onTap);
        this.AddClick(this.shop_btn, this.onTap);
        this.observe(MessageDef.MIJING_CAST, this.onCastResult);
        this.observe(MessageDef.MIJING_INIT_INFO, this.UpdateContent);
        this.dice_img.alpha = 0;
        this.auto_btn.label = "自动掷骰";
        // this.show_mc.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_flui_001"), !0, -1),
        // this.addChild(this.show_mc)
        this.mCommonWindowBg.OnAdded(this);
        if (mjModel.posId == 1) {
            this.arrowImg.visible = true;
            this.play.play(0);
            this.play.addEventListener('complete', this.onTweenGroupComplete, this);
        }
        else {
            this.arrowImg.visible = false;
        }
    };
    MiJingPanel.prototype.OnClose = function () {
        this.isAuto = false;
        egret.Tween.removeTweens(this.gzGroup);
        // this.dice_img.alpha = 0
        // egret.Tween.removeTweens(this.dice_img);
        TimerManager.ins().remove(this.moveGezi, this);
        TimerManager.ins().removeAll(this);
        var mjModel = GameGlobal.MiJingModel;
        mjModel.diceNum = undefined;
        mjModel.onSendGetPosAward(mjModel.posId);
        if (this.dicAinmi) {
            this.dicAinmi.clearCache();
            DisplayUtils.removeFromParent(this.dicAinmi);
        }
        // if(this.show_mc)
        // {
        //     this.show_mc.clearCache();
        //     this.show_mc.stop();
        //     DisplayUtils.removeFromParent(this.show_mc);
        // }
        this.arrowImg.visible = false;
    };
    MiJingPanel.prototype.onCastResult = function () {
        var mjModel = GameGlobal.MiJingModel;
        if (this.check.selected) {
            this.showAndHide();
            this.isPlayAnimi = false;
            mjModel.onSendGetPosAward(mjModel.posId);
            this.UpdateContent();
            if (this.isAuto) {
                TimerManager.ins().doTimer(250, 1, this.onOkAuto, this);
            }
        }
        // else
        // {
        //     this.randomTimes = 3;
        // }
    };
    MiJingPanel.prototype.startCastDice = function () {
        this.isPlayAnimi = true;
        egret.Tween.removeTweens(this.dice_img);
        this.dice_img.alpha = 0;
        // this.dicAinmi.clearCache();
        // this.dicAinmi.loadUrl(ResDataPath.GetUIEffePath2("dicecast"), true, 1, this.showResult, this)
        this.dicAinmi.Play(ResDataPath.GetUIEffePath2("dicecast"), null, 1, true, this.showResult, this, true);
        this.addChild(this.dicAinmi);
    };
    MiJingPanel.prototype.showResult = function () {
        var mjModel = GameGlobal.MiJingModel;
        if (mjModel.diceNum) {
            this.showAndHide();
        }
        else {
            //如果收不到后端的返回，则再抛一次
            this.dicAinmi.gotoAndStop(1);
            egret.callLater(this.startCastDice, this);
            return;
        }
    };
    MiJingPanel.prototype.showAndHide = function () {
        this.dicAinmi.stop();
        var mjModel = GameGlobal.MiJingModel;
        this.dice_img.source = "ui_mj_p_sz" + mjModel.diceNum;
        mjModel.diceNum = undefined;
        this.dice_img.alpha = 1;
        egret.Tween.get(this.dice_img).wait(800).to({ "alpha": 0 }, 50).call(this.hideDiceIcon, this);
    };
    MiJingPanel.prototype.hideDiceIcon = function () {
        this.dice_img.alpha = 0;
        this.startMoveGeZi();
    };
    //开始移动格子
    MiJingPanel.prototype.startMoveGeZi = function (quick) {
        if (quick === void 0) { quick = false; }
        egret.Tween.removeTweens(this.dice_img);
        TimerManager.ins().remove(this.moveGezi, this);
        TimerManager.ins().doTimer(160, 0, this.moveGezi, this);
        if (quick)
            this.moveGezi();
    };
    MiJingPanel.prototype.moveGezi = function () {
        var mjModel = GameGlobal.MiJingModel;
        var next;
        if (mjModel.floor != this.currentFloor) {
            next = this.currentPace + 1;
            if (next > MiJingModel.MaxPace) {
                this.currentPace = 0;
                // next = 1;
                //需要转场景
                TimerManager.ins().remove(this.moveGezi, this);
                this.changeFloorAnimi();
                return;
            }
        }
        else {
            if (this.currentPace != mjModel.pace) {
                next = this.currentPace + 1;
            }
        }
        if (next != undefined)
            this.setEffectPoint(next);
        if (mjModel.pace == this.currentPace && mjModel.floor == this.currentFloor) {
            this.stopAllAnimi();
        }
    };
    MiJingPanel.prototype.changeFloorAnimi = function () {
        egret.Tween.get(this.moveGzGroup).to({ "y": 470 }, 300).call(this.updateFloorMap, this);
    };
    MiJingPanel.prototype.updateFloorMap = function () {
        egret.Tween.removeTweens(this.moveGzGroup);
        var mjModel = GameGlobal.MiJingModel;
        //转完场景后，判断需不需要再移动
        this.changeFloor(mjModel.floor);
        this.startMoveGeZi(true);
        this.moveGzGroup.y = 0;
    };
    MiJingPanel.prototype.stopAllAnimi = function () {
        var mjModel = GameGlobal.MiJingModel;
        TimerManager.ins().remove(this.moveGezi, this);
        egret.Tween.removeTweens(this.gzGroup);
        this.isPlayAnimi = false;
        mjModel.diceNum = undefined;
        mjModel.onSendGetPosAward(mjModel.posId);
        this.UpdateContent();
        if (this.isAuto) {
            this.onOkAuto();
        }
        // if(GameGlobal.PetModel.GetPetInfo(900010) == null)
        // {
        //     let view = ViewManager.ins().getView(MiJingMainWin)
        //     if(view){
        //         GuideUtils.ins().Show((<any>view).commonWindowBg.tabBar.getChildAt(1), GuideUtils.GUIDE_ACTIVE_PET, 3)
        //     }
        // }
    };
    MiJingPanel.prototype.changeFloor = function (floor) {
        var mjModel = GameGlobal.MiJingModel;
        var mjFloorCfg = GameGlobal.Config.MythFloorConfig;
        var i;
        var len = this.geziArr.length;
        for (i = 0; i < len; i++) {
            var item = this.geziArr[i];
            var cfg = MythFloorConfig.getFloorByFloorAndPace(floor, i + 1);
            item.setData(cfg);
        }
        this.currentFloor = floor;
        this.floor_txt.text = "第" + (floor) + "层";
        if (this.currentFloor != mjModel.maxFloor) {
            var len_1 = this.gezi2Arr.length;
            for (i = 0; i < len_1; i++) {
                var item = this.gezi2Arr[i];
                var cfg = MythFloorConfig.getFloorByFloorAndPace(floor + 1, i + 1);
                item.setData(cfg);
            }
        }
    };
    MiJingPanel.prototype.setEffectPoint = function (pace) {
        var item = this.geziArr[pace - 1];
        item.addChild(this.roleIcon);
        // let pos = egret.$TempPoint
        // DisplayUtils.GetGlobalPos(item, pos)
        // this.roleIcon.parent.globalToLocal(pos.x, pos.y, pos)
        this.roleIcon.x = (72 >> 1);
        this.roleIcon.y = (72 >> 1);
        this.currentPace = pace;
    };
    MiJingPanel.prototype.UpdateContent = function () {
        var mjModel = GameGlobal.MiJingModel;
        var mjBaseCfg = GameGlobal.Config.MythBaseConfig;
        this.key_txt.text = mjModel.key + "";
        this.score_txt.text = mjModel.score + "";
        var i;
        var len = this.floorAwardArr.length;
        var getIndex = -1;
        for (i = 0; i < len; i++) {
            var awardItem = this.floorAwardArr[i];
            awardItem.update();
            if (getIndex == -1 && awardItem.canHasAward()) {
                getIndex = i;
            }
        }
        // if(this.oldFloorAwardFlag != mjModel.floorAwardFlag)
        // {
        // this.scroller.viewport.scrollH = getIndex > 2 ?this.scroller.width:0
        //     this.oldFloorAwardFlag = mjModel.floorAwardFlag
        // }
        var freeTimes = mjModel.getFreeTimes();
        if (freeTimes > 0) {
            this.btn.label = "免费掷骰";
            this.free_txt.textFlow = TextFlowMaker.generateTextFlow("剩余免费次数：" + StringUtils.addColor(freeTimes + "", Color.l_green_1) + "次");
            UIHelper.ShowRedPoint(this.btn, true);
            this.priceIcon2.visible = false;
        }
        else {
            this.btn.label = "元宝掷骰";
            this.priceIcon2.visible = true;
            this.priceIcon2.type = MoneyConst.yuanbao;
            this.priceIcon2.text = mjBaseCfg.autoCost.count;
            UIHelper.ShowRedPoint(this.btn, false);
        }
        this.times_txt.text = (mjBaseCfg.maxTimes - mjModel.dailyResetTimes) + "/" + mjBaseCfg.maxTimes;
        if (this.isPlayAnimi) {
            return;
        }
        this.changeFloor(GameGlobal.MiJingModel.floor);
        this.setEffectPoint(GameGlobal.MiJingModel.pace);
        var paceRwCfg = mjModel.getCurrentPaceRWCfg();
        if (paceRwCfg == null) {
            this.bar_2.visible = false;
        }
        else {
            this.bar_2.visible = true;
            this.bar_2.maximum = paceRwCfg.pace;
            this.bar_2.value = mjModel.dailyPace;
        }
        this.paceAward_btn.visible = this.bar_2.visible;
        UIHelper.ShowRedPoint(this.paceAward_btn, mjModel.redPointPaceRw());
        this.reStart.visible = mjModel.floor == mjModel.maxFloor && mjModel.pace == MiJingModel.MaxPace ? true : false;
        if (this.reStart.visible) {
            this.priceIcon2.visible = !this.reStart.visible;
            this.free_txt.visible = !this.reStart.visible;
        }
        else {
            this.free_txt.visible = !this.priceIcon2.visible;
        }
        this.btn.visible = this.auto_btn.visible = this.priceIcon.visible = !this.reStart.visible;
    };
    MiJingPanel.prototype.updateTimes = function () {
        var mjModel = GameGlobal.MiJingModel;
        var t = mjModel.getEndTime() * 1000;
        if (t <= 0) {
            this.time_txt.visible = false;
        }
        else {
            var str = "";
            if (this.time_txt.visible == false)
                this.time_txt.visible = true;
            if (t < DateUtils.MS_PER_DAY) {
                str = DateUtils.format_5(t, 3);
            }
            else {
                str = DateUtils.format_12(t, 4);
            }
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("\u5269\u4F59\u65F6\u95F4\uFF1A\n  " + StringUtils.addColor(str, Color.l_green_1));
        }
    };
    MiJingPanel.prototype.onTap = function (e) {
        var mjModel = GameGlobal.MiJingModel;
        switch (e.currentTarget) {
            case this.btn:
                if (this.isPlayAnimi == true) {
                    return;
                }
                if (mjModel.checkCanCast() == false) {
                    return;
                }
                if (this.check.selected == false) {
                    this.startCastDice();
                }
                GameGlobal.MiJingModel.onSendCast();
                break;
            case this.auto_btn:
                if (this.isAuto) {
                    this.auto_btn.label = "自动掷骰";
                    this.isAuto = false;
                    TimerManager.ins().remove(this.onOkAuto, this);
                }
                else {
                    if (mjModel.checkCanCast() == false) {
                        return;
                    }
                    var mjBaseCfg_1 = GameGlobal.Config.MythBaseConfig;
                    var str = "是否使用自动掷骰功能，直到50层才停止\r\r（掷骰" + StringUtils.addColor(mjBaseCfg_1.autoCost.count + "", Color.l_green_1) + "元宝/次）";
                    WarnWin.show(TextFlowMaker.generateTextFlow(str), this.onOkAuto, this);
                }
                break;
            case this.paceAward_btn:
                ViewManager.ins().open(MJPaceAwardWin);
                break;
            case this.reStart:
                var mjBaseCfg = GameGlobal.Config.MythBaseConfig;
                if (mjModel.dailyResetTimes < mjBaseCfg.maxTimes) {
                    mjModel.onSendReset();
                }
                else {
                    UserTips.InfoTip("今天的重置次数已经用完");
                }
                break;
            case this.shop_btn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_MIJING, ShopController.EN_SHOP_MIJING_SCORE]);
                break;
        }
    };
    // private onClickGeZi(e): void {
    //     let itemConfig = GlobalConfig.ins().ItemConfig[e.currentTarget.getGoodsId()];
    //     if (itemConfig.type != undefined) {
    //         if (itemConfig.type == 1) {
    //             ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, 1);
    //         }
    //     }
    // }
    MiJingPanel.prototype.onOkAuto = function () {
        TimerManager.ins().remove(this.onOkAuto, this);
        var mjModel = GameGlobal.MiJingModel;
        if (mjModel.checkCanCast() == false) {
            this.auto_btn.label = "自动掷骰";
            this.isAuto = false;
            return;
        }
        this.auto_btn.label = "停止掷骰";
        this.isAuto = true;
        if (this.isPlayAnimi == true) {
            return;
        }
        // if(this.isPlayAnimi == false)
        // {
        if (this.check.selected == false) {
            this.startCastDice();
        }
        // }
        mjModel.onSendCast();
    };
    MiJingPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return MiJingPanel;
}(BaseEuiView));
__reflect(MiJingPanel.prototype, "MiJingPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=MiJingPanel.js.map