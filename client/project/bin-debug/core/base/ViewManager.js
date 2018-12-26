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
var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this._views = {};
        _this._viewCode = {};
        _this._opens = [];
        return _this;
    }
    ViewManager.ins = function () {
        return _super.ins.call(this);
    };
    /**
     * 清空处理
     */
    ViewManager.prototype.clear = function () {
        this.closeAll();
    };
    /**
     * 销毁一个面板
     * @param hCode
     */
    ViewManager.prototype.destroy = function (hCode) {
        var keys;
        if (this._viewCode[hCode]) {
            keys = this._viewCode[hCode];
            delete this._viewCode[hCode];
        }
        if (this._views[keys]) {
            delete this._views[keys];
        }
    };
    /**
    * 检测能否开启
    * @param cls 类名
    */
    ViewManager.viewOpenCheck = function (cls, param) {
        if (!cls) {
            return false;
        }
        var func = cls["openCheck"];
        if (func) {
            return func.apply(null, param);
        }
        return true;
    };
    /**
     * 打开窗口对应的标签页
     */
    ViewManager.prototype.openIndex = function (cls, index) {
        if (ViewManager.ins().isShow(cls)) {
            ViewManager.ins().getView(cls).SetTableIndex(index);
        }
        else {
            ViewManager.ins().open(cls, index);
        }
    };
    /**
    * 打开窗口
    * @param cls 类
    * @param param 参数
    *  */
    ViewManager.prototype.open = function (cls) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        //检测能否开启
        if (!ViewManager.viewOpenCheck(cls, param)) {
            return null;
        }
        var view = this.openEasy(cls, param);
        if (view) {
            if (this.mViewImpl) {
                this.mViewImpl.OnOpenView(view);
            }
        }
        return view;
    };
    ViewManager.prototype.openEasy = function (cls, param) {
        var _this = this;
        if (param === void 0) { param = null; }
        if (cls == null) {
            console.log("open nameorclass is null");
            return;
        }
        var clsName = egret.getQualifiedClassName(cls);
        var view = this._views[clsName];
        if (!view) {
            view = new cls();
            this._views[clsName] = view;
            this._viewCode[view.hashCode] = clsName;
        }
        if (view == null) {
            console.error("panel " + clsName + "不存在");
            return;
        }
        var layerLevel = cls["LAYER_LEVEL"];
        if (layerLevel == null) {
            layerLevel = view.GetLayerLevel();
            if (!layerLevel) {
                console.error("没有设置层级", clsName);
            }
        }
        if (this._IsShow(clsName) || view.isInit()) {
            this.AddTo(layerLevel, view);
            this._OpenView(view, param);
        }
        else {
            view.loadResource(function () {
                _this.AddTo(layerLevel, view);
                view.setVisible(false);
            }, function () {
                view.DoInit();
                view.initData();
                _this._OpenView(view, param);
                view.setVisible(true);
            });
        }
        if (this._opens.indexOf(clsName) == -1)
            this._opens.push(clsName);
        return view;
    };
    ;
    ViewManager.prototype.AddTo = function (parent, view) {
        var selfViewLevel = Util.GetClass(view).VIEW_LAYER_LEVEL || ViewLayerLevel.MIDDLE;
        var index = 0;
        for (var i = parent.numChildren - 1; i >= 0; --i) {
            if (selfViewLevel >= (Util.GetClass(parent.getChildAt(i)).VIEW_LAYER_LEVEL || ViewLayerLevel.MIDDLE)) {
                index = i + 1;
                break;
            }
        }
        parent.addChildAt(view, index);
    };
    ViewManager.prototype._OpenView = function (view, param) {
        view.DoOpen.call(view, param);
    };
    ViewManager.prototype._CloseVie = function (view) {
        view.DoClose.apply(view);
    };
    /**
     * 关闭窗口
     * @param objOrCls 类、对象
     **/
    ViewManager.prototype.close = function (objOrCls) {
        var clsName = egret.getQualifiedClassName(objOrCls);
        var view = this.closeEasy(clsName);
        if (view) {
            if (this.mViewImpl) {
                this.mViewImpl.OnCloseOneView(view);
            }
        }
        else {
            if (true) {
                console.log("not close view " + clsName);
            }
        }
    };
    // 关闭窗口
    ViewManager.prototype.closeEasy = function (clsName) {
        if (!this._IsShow(clsName)) {
            return null;
        }
        var view = this._views[clsName];
        if (view) {
            var viewIndex = this._opens.indexOf(clsName);
            if (viewIndex >= 0) {
                this._opens.splice(viewIndex, 1);
                this._CloseVie(view);
            }
            DisplayUtils.removeFromParent(view);
            view.destoryView();
        }
        return view;
    };
    /**
     * 获取一个UI对象
     * @param cls  类
     */
    ViewManager.prototype.getView = function (cls) {
        return this._views[egret.getQualifiedClassName(cls)];
    };
    /**
     * 关闭所有开启中的UI
     */
    ViewManager.prototype.closeAll = function () {
        for (var i = this._opens.length - 1; i >= 0; --i) {
            this.closeEasy(this._opens[i]);
        }
        if (this._opens.length > 0) {
            console.error(this._opens.length + " => close all error !!!");
        }
        if (this.mViewImpl) {
            this.mViewImpl.OnCloseAll();
        }
    };
    ;
    /**
     * 当前ui打开数量
     */
    ViewManager.prototype.currOpenNum = function () {
        return this._opens.length;
    };
    /**
     * UI是否开启
     * @param cls 类
     */
    ViewManager.prototype.isShow = function (cls) {
        return this._IsShow(egret.getQualifiedClassName(cls));
    };
    ViewManager.prototype._IsShow = function (clsName) {
        return this._opens.indexOf(clsName) >= 0;
    };
    // 关闭部分界面
    ViewManager.prototype.closePartPanel = function () {
        var list = [];
        for (var i_1 = 0; i_1 < this._opens.length; i_1++) {
            var viewName = this._opens[i_1];
            if (viewName != "MainTop2Panel" && viewName != "MainBottomPanel" && viewName != "MainTopPanel" && viewName != "BriberyBasePanel") {
                list.push(this._opens[i_1]);
            }
        }
        for (var i = list.length - 1; i >= 0; i--) {
            var viewName = list[i];
            var view = this._views[viewName];
            if (!view) {
                continue;
            }
            var parent_1 = view.parent;
            if (parent_1 == LayerManager.UI_Popup || parent_1 == LayerManager.UI_Main || parent_1 == LayerManager.UI_Main_2) {
                this.closeEasy(viewName);
            }
        }
        if (this.mViewImpl) {
            this.mViewImpl.OnClosePartView();
        }
    };
    //===================================
    //=============任务指引===============
    //===================================
    ViewManager.prototype.Guide = function (index, param) {
        if (param === void 0) { param = null; }
        this._GotoView(index, param);
    };
    // 矫正参数错误
    ViewManager.AdjustIndex = function (index, param) {
        return [index, param];
    };
    ViewManager.prototype._GotoView = function (index, param) {
        switch (index) {
            case ViewIndexDef.EquipWearCount:
            case ViewIndexDef.EquipWearAssign:
                ViewManager.ins().open(RoleWin, 0);
                break;
            case ViewIndexDef.SkillUpgrade:
                ViewManager.ins().open(RoleWin, 1);
                break;
            case ViewIndexDef.RideUpgrade:
                ViewManager.ins().open(RoleWin, 2);
                break;
            case ViewIndexDef.Tianx:
                ViewManager.ins().open(TianxianMainPanel);
                break;
            case ViewIndexDef.EquipSmelt:
            case ViewIndexDef.TYPE_1041:
                ViewManager.ins().open(SmeltEquipTotalWin);
                break;
            case ViewIndexDef.EquipEnhanceAll:
            case ViewIndexDef.EquipEnhanceAcc:
                ViewManager.ins().open(ForgeWin, 0);
                break;
            case ViewIndexDef.EquipRefineAll:
            case ViewIndexDef.EquipRefineAcc:
                ViewManager.ins().open(ForgeWin, 1);
                break;
            case ViewIndexDef.EquipAnneal:
            case ViewIndexDef.EquipAnnealAcc:
                ViewManager.ins().open(ForgeWin, 2);
                break;
            case ViewIndexDef.EquipGemAll:
            case ViewIndexDef.EquipGemAcc:
                ViewManager.ins().open(ForgeWin, 3);
                break;
            case ViewIndexDef.ChapterClear:
                ViewManager.ins().open(GuanQiaRewardWin);
                break;
            case ViewIndexDef.ChapterGoto:
                ViewManager.ins().open(WorldMapPanel);
                break;
            case ViewIndexDef.PetActive:
            case ViewIndexDef.PetUpgrade:
                ViewManager.ins().open(PetMainPanel);
                break;
            case ViewIndexDef.Xianlv:
                ViewManager.ins().open(XianlvMainPanel);
                break;
            case ViewIndexDef.TeamFb:
                ViewManager.ins().open(CrossMainPanel);
                break;
            case ViewIndexDef.MyBoss:
                ViewManager.ins().open(BossMainPanel, 0);
                break;
            case ViewIndexDef.PublicBoss:
                ViewManager.ins().open(BossMainPanel, 1);
                break;
            case ViewIndexDef.Arane:
                ViewManager.ins().open(ArenaWin);
                break;
            case ViewIndexDef.MaterialFb:
                ViewManager.ins().open(FbLayer, 0);
                break;
            case ViewIndexDef.Treasuremap:
                ViewManager.ins().open(FbLayer, 1);
                break;
            case ViewIndexDef.HeavenFb:
                ViewManager.ins().open(FbLayer, 3);
                break;
            case ViewIndexDef.LingLongTa:
                ViewManager.ins().open(FbLayer, 2);
                break;
            case ViewIndexDef.Fomalhaut:
                ViewManager.ins().open(DailyMainWin, 1);
                break;
            case ViewIndexDef.ChatWorld:
                UserTips.ins().showTips('请在世界说句话');
                break;
            case ViewIndexDef.RoleLevelup:
                //UserTips.ins().showTips('角色升级到' + param + '级');
                ViewManager.ins().open(UpLvWayMainPanel);
                break;
            case ViewIndexDef.AutoOpen:
                UserTips.ins().showTips('开启自动挑战关卡BOSS');
                break;
            case ViewIndexDef.HookKill:
                UserTips.ins().showTips('挂机遇怪' + param + '次');
                break;
            case ViewIndexDef.RoleLevelup:
                UserTips.ins().showTips('每天登录奖励');
                break;
            case ViewIndexDef.TYPE_1000:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DAYAN]);
                break;
            case ViewIndexDef.TYPE_1001:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YUANBAO]);
                break;
            case ViewIndexDef.TYPE_1002:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BANGYUAN]);
                break;
            case ViewIndexDef.TYPE_1003:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_EQUIP]);
                break;
            case ViewIndexDef.TYPE_1004:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BLACK]);
                break;
            case ViewIndexDef.TYPE_1005:
                ViewManager.ins().open(FbLayer);
                break;
            case ViewIndexDef.TYPE_1006:
                ViewManager.ins().open(FbLayer, 1);
                break;
            case ViewIndexDef.TYPE_1007:
                ViewManager.ins().open(FbLayer, 2);
                break;
            case ViewIndexDef.TYPE_1008:
                ViewManager.ins().open(FbLayer, 3);
                break;
            case ViewIndexDef.TYPE_1010:
            case ViewIndexDef.TYPE_1009:
            case ViewIndexDef.TYPE_1010:
            case ViewIndexDef.TYPE_1011:
            case ViewIndexDef.TYPE_1012:
            case ViewIndexDef.TYPE_1013:
            case ViewIndexDef.TYPE_1014:
            case ViewIndexDef.TYPE_1015:
            case ViewIndexDef.TYPE_1016:
            case ViewIndexDef.TYPE_1017:
            case ViewIndexDef.TYPE_1018:
            case ViewIndexDef.TYPE_1019:
            case ViewIndexDef.TYPE_1020:
            case ViewIndexDef.TYPE_1021:
            case ViewIndexDef.TYPE_1022:
                ViewManager.ins().open(FbLayer);
                break;
            case ViewIndexDef.TYPE_1023:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANLV]);
                break;
            case ViewIndexDef.TYPE_1024:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CHONGWU]);
                break;
            case ViewIndexDef.TYPE_1025:
                ViewManager.ins().open(ExchangeMoneyWin);
                break;
            case ViewIndexDef.TYPE_1026:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DATI]);
                break;
            case ViewIndexDef.TYPE_1027:
                break;
            case ViewIndexDef.TYPE_1028:
                break;
            case ViewIndexDef.TYPE_1029:
                ViewManager.ins().open(BossMainPanel, 0);
                break;
            case ViewIndexDef.TYPE_1030:
                ViewManager.ins().open(BossMainPanel, 1);
                break;
            case ViewIndexDef.TYPE_1031:
                ViewManager.ins().open(BossMainPanel, 2);
                break;
            case ViewIndexDef.TYPE_1032:
                ViewManager.ins().open(BossMainPanel, 3);
                break;
            case ViewIndexDef.TYPE_1033:
                ViewManager.ins().open(ArenaWin);
                break;
            case ViewIndexDef.TYPE_1034:
                ViewManager.ins().open(CrossMainPanel);
                break;
            case ViewIndexDef.TYPE_1035:
                ViewManager.ins().open(GangMainWin, 1);
                break;
            case ViewIndexDef.TYPE_1036:
                ViewManager.ins().open(GangMainWin, 3);
                break;
            case ViewIndexDef.TYPE_1037:
                ViewManager.ins().open(DailyMainWin);
                break;
            case ViewIndexDef.TYPE_1038:
                ViewManager.ins().open(DailyMainWin, 2);
                break;
            case ViewIndexDef.TYPE_1039:
                ViewManager.ins().open(DailyMainWin, 3);
                break;
            case ViewIndexDef.TYPE_1040:
                ViewManager.ins().open(CrossMainPanel, 2);
                break;
            case ViewIndexDef.TYPE_1043:
                ViewManager.ins().open(GangBossPanel);
                break;
            case ViewIndexDef.TYPE_1045:
                ViewManager.ins().open(QujingMainWin);
                break;
            case ViewIndexDef.TYPE_1047:
                ViewManager.ins().open(DailyMainWin, 1);
                break;
            case ViewIndexDef.TYPE_1048:
                RechargeWin.Open();
                break;
            case ViewIndexDef.TYPE_1049:
                ViewManager.ins().open(VipMainPanel);
                break;
            case ViewIndexDef.TYPE_1050:
                ViewManager.ins().open(GrowUpWin);
                break;
            case ViewIndexDef.TYPE_1051:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING]);
                break;
            case ViewIndexDef.TYPE_1052:
                ViewManager.ins().open(TreasureHuntMainPanel);
                break;
            case ViewIndexDef.TYPE_1053:
                ViewManager.ins().open(ForgeWin);
                break;
            case ViewIndexDef.TYPE_1054:
                ViewManager.ins().open(ForgeWin, 1);
                break;
            case ViewIndexDef.TYPE_1055:
                ViewManager.ins().open(ForgeWin, 2);
                break;
            case ViewIndexDef.TYPE_1056:
                ViewManager.ins().open(ForgeWin, 3);
                break;
            case ViewIndexDef.TYPE_1057:
                ViewManager.ins().open(WorldMapPanel);
                break;
            case ViewIndexDef.TYPE_1058:
                ViewManager.ins().open(RelationWin);
                break;
            case ViewIndexDef.TYPE_1059:
                ViewManager.ins().open(YingYuanWin);
                break;
            case ViewIndexDef.TYPE_1060:
                if (!UserFb.CheckFighting())
                    return;
                if (!GameGlobal.actorModel.HasGuild()) {
                    UserTips.ins().showTips("您还没有加入帮会");
                    return;
                }
                GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid);
                break;
            case ViewIndexDef.TYPE_1061:
                var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9);
                if (data) {
                    var config = data.GetConfig();
                    if (!config[data.reachday]) {
                        return;
                    }
                    if (data.runday <= data.reachday) {
                        UserTips.ins().showTips("你已经购买了该礼包");
                        return;
                    }
                    if (data.isOpenActivity()) {
                        ViewManager.ins().open(RmbGiftPanel);
                    }
                }
                break;
            case ViewIndexDef.TYPE_1062:
                ViewManager.ins().open(TsumKoBasePanel, param);
                break;
            case ViewIndexDef.TYPE_1063:
                ViewManager.ins().open(QujingMainWin);
                break;
            case ViewIndexDef.TYPE_1064:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANDU]);
                break;
            case ViewIndexDef.TYPE_1065:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CAILIAO]);
                break;
            case ViewIndexDef.TYPE_1066:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BANGPAI]);
                break;
            case ViewIndexDef.TYPE_1067:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_JINGJI]);
                break;
            case ViewIndexDef.TYPE_1068:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YOUQING]);
                break;
            case ViewIndexDef.TYPE_1069:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_WEIWANG]);
                break;
            case ViewIndexDef.TYPE_1070:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING]);
                break;
            case ViewIndexDef.TYPE_1071:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_PIFU]);
                break;
            case ViewIndexDef.TYPE_1072:
                KaiFuActivityWin.Show(5);
                break;
            case ViewIndexDef.TYPE_1073:
                ViewManager.ins().open(AuctionMainPanel);
                break;
            case ViewIndexDef.TYPE_1074:
                ViewManager.ins().open(GodPetActiveLotteryWin);
                break;
            case ViewIndexDef.TYPE_1075:
                ShootUpIconRule.Open();
                break;
            case ViewIndexDef.TYPE_1076:
                DiscountRule.Open();
                break;
            case ViewIndexDef.TYPE_1077:
                FightPetFBIconRule.Open();
                break;
            case ViewIndexDef.TYPE_2000:
                UserTips.ins().showTips("每日首充活动获得");
                break;
            case ViewIndexDef.TYPE_2001:
                UserTips.ins().showTips("神兽降临活动获得");
                break;
            case ViewIndexDef.TYPE_1078:// 宠物界面  
                ViewManager.ins().open(PetMainPanel);
                break;
            case ViewIndexDef.TYPE_1079:// 仙侣界面  
                ViewManager.ins().open(XianlvMainPanel);
                break;
            case ViewIndexDef.TYPE_1080:// 子女界面  
                ViewManager.ins().open(LingtongMainPanel);
                break;
            case ViewIndexDef.TYPE_1081:// 房屋界面  
                ViewManager.ins().open(YingYuanWin, 1);
                break;
            case ViewIndexDef.TYPE_1082:// 玄女界面  
                ViewManager.ins().open(HavingMainPanel);
                break;
            case ViewIndexDef.TYPE_1083:// 经脉界面  
                ViewManager.ins().open(RoleJingMaiPanel);
                break;
            case ViewIndexDef.TYPE_1084:// 丹药界面  
                ViewManager.ins().open(RoleElixirPanel);
                break;
            case ViewIndexDef.TYPE_1085:// 图腾界面  
                ViewManager.ins().open(TotemsMainWin);
                break;
            case ViewIndexDef.TYPE_1086:// 粉丝界面  
                ViewManager.ins().open(FriendMainPanel, 1);
                break;
            case ViewIndexDef.TYPE_1087:// 神装
                ViewManager.ins().open(DeityEquipWin);
                break;
            case ViewIndexDef.TYPE_1088:// 法宝
                ViewManager.ins().open(TreasureWin);
                break;
            case ViewIndexDef.TYPE_1089://神装转盘
                ViewManager.ins().open(TotemsGoodLuckMainWin, 0);
                break;
            case ViewIndexDef.TYPE_1090:
                OpenDayGifRule.Open();
                break;
            case ViewIndexDef.TYPE_1092:
                ViewManager.ins().open(AuctionMainPanel, 1);
                break;
            case ViewIndexDef.TYPE_1093://図騰转盘
                ViewManager.ins().open(TotemsGoodLuckMainWin, 1);
                break;
            case ViewIndexDef.TYPE_1094://逆命
                ViewManager.ins().open(DestinyUpWin, 1);
                break;
            case ViewIndexDef.TYPE_1095:
                ViewManager.ins().open(ElfCallPanel);
                break;
            case ViewIndexDef.TYPE_1096:
                ViewManager.ins().open(PetExpeditionView);
                break;
            default:
                console.warn("not def goto index => " + index);
                return false;
        }
        return true;
    };
    ViewManager.openCheckTip = false;
    ViewManager.INVAILD_NAME = [];
    return ViewManager;
}(BaseClass));
__reflect(ViewManager.prototype, "ViewManager");
var ViewIndexDef;
(function (ViewIndexDef) {
    ViewIndexDef[ViewIndexDef["EquipWearCount"] = 10010] = "EquipWearCount";
    ViewIndexDef[ViewIndexDef["EquipWearAssign"] = 10011] = "EquipWearAssign";
    ViewIndexDef[ViewIndexDef["EquipSmelt"] = 10020] = "EquipSmelt";
    ViewIndexDef[ViewIndexDef["EquipEnhanceAll"] = 10030] = "EquipEnhanceAll";
    ViewIndexDef[ViewIndexDef["EquipEnhanceAcc"] = 10031] = "EquipEnhanceAcc";
    ViewIndexDef[ViewIndexDef["EquipRefineAll"] = 10040] = "EquipRefineAll";
    ViewIndexDef[ViewIndexDef["EquipRefineAcc"] = 10041] = "EquipRefineAcc";
    ViewIndexDef[ViewIndexDef["EquipAnneal"] = 10050] = "EquipAnneal";
    ViewIndexDef[ViewIndexDef["EquipAnnealAcc"] = 10051] = "EquipAnnealAcc";
    ViewIndexDef[ViewIndexDef["EquipGemAll"] = 10060] = "EquipGemAll";
    ViewIndexDef[ViewIndexDef["EquipGemAcc"] = 10061] = "EquipGemAcc";
    ViewIndexDef[ViewIndexDef["SkillUpgrade"] = 20010] = "SkillUpgrade";
    ViewIndexDef[ViewIndexDef["ChapterClear"] = 30010] = "ChapterClear";
    ViewIndexDef[ViewIndexDef["ChapterGoto"] = 30020] = "ChapterGoto";
    ViewIndexDef[ViewIndexDef["PetActive"] = 40010] = "PetActive";
    ViewIndexDef[ViewIndexDef["Xianlv"] = 40120] = "Xianlv";
    ViewIndexDef[ViewIndexDef["PetUpgrade"] = 40020] = "PetUpgrade";
    ViewIndexDef[ViewIndexDef["RideUpgrade"] = 50010] = "RideUpgrade";
    ViewIndexDef[ViewIndexDef["Tianx"] = 50020] = "Tianx";
    ViewIndexDef[ViewIndexDef["TeamFb"] = 60010] = "TeamFb";
    ViewIndexDef[ViewIndexDef["MyBoss"] = 60020] = "MyBoss";
    ViewIndexDef[ViewIndexDef["PublicBoss"] = 60030] = "PublicBoss";
    ViewIndexDef[ViewIndexDef["Arane"] = 60040] = "Arane";
    ViewIndexDef[ViewIndexDef["MaterialFb"] = 60050] = "MaterialFb";
    ViewIndexDef[ViewIndexDef["Treasuremap"] = 60060] = "Treasuremap";
    ViewIndexDef[ViewIndexDef["HeavenFb"] = 60070] = "HeavenFb";
    ViewIndexDef[ViewIndexDef["LingLongTa"] = 60081] = "LingLongTa";
    ViewIndexDef[ViewIndexDef["Fomalhaut"] = 60090] = "Fomalhaut";
    ViewIndexDef[ViewIndexDef["ChatWorld"] = 70010] = "ChatWorld";
    ViewIndexDef[ViewIndexDef["RoleLevelup"] = 70020] = "RoleLevelup";
    ViewIndexDef[ViewIndexDef["AutoOpen"] = 70030] = "AutoOpen";
    ViewIndexDef[ViewIndexDef["HookKill"] = 70040] = "HookKill";
    ViewIndexDef[ViewIndexDef["DayLogin"] = 70050] = "DayLogin";
    // 策划定义
    ViewIndexDef[ViewIndexDef["TYPE_1000"] = 1000] = "TYPE_1000";
    ViewIndexDef[ViewIndexDef["TYPE_1001"] = 1001] = "TYPE_1001";
    ViewIndexDef[ViewIndexDef["TYPE_1002"] = 1002] = "TYPE_1002";
    ViewIndexDef[ViewIndexDef["TYPE_1003"] = 1003] = "TYPE_1003";
    ViewIndexDef[ViewIndexDef["TYPE_1004"] = 1004] = "TYPE_1004";
    ViewIndexDef[ViewIndexDef["TYPE_1005"] = 1005] = "TYPE_1005";
    ViewIndexDef[ViewIndexDef["TYPE_1006"] = 1006] = "TYPE_1006";
    ViewIndexDef[ViewIndexDef["TYPE_1007"] = 1007] = "TYPE_1007";
    ViewIndexDef[ViewIndexDef["TYPE_1008"] = 1008] = "TYPE_1008";
    ViewIndexDef[ViewIndexDef["TYPE_1009"] = 1009] = "TYPE_1009";
    ViewIndexDef[ViewIndexDef["TYPE_1010"] = 1010] = "TYPE_1010";
    ViewIndexDef[ViewIndexDef["TYPE_1011"] = 1011] = "TYPE_1011";
    ViewIndexDef[ViewIndexDef["TYPE_1012"] = 1012] = "TYPE_1012";
    ViewIndexDef[ViewIndexDef["TYPE_1013"] = 1013] = "TYPE_1013";
    ViewIndexDef[ViewIndexDef["TYPE_1014"] = 1014] = "TYPE_1014";
    ViewIndexDef[ViewIndexDef["TYPE_1015"] = 1015] = "TYPE_1015";
    ViewIndexDef[ViewIndexDef["TYPE_1016"] = 1016] = "TYPE_1016";
    ViewIndexDef[ViewIndexDef["TYPE_1017"] = 1017] = "TYPE_1017";
    ViewIndexDef[ViewIndexDef["TYPE_1018"] = 1018] = "TYPE_1018";
    ViewIndexDef[ViewIndexDef["TYPE_1019"] = 1019] = "TYPE_1019";
    ViewIndexDef[ViewIndexDef["TYPE_1020"] = 1020] = "TYPE_1020";
    ViewIndexDef[ViewIndexDef["TYPE_1021"] = 1021] = "TYPE_1021";
    ViewIndexDef[ViewIndexDef["TYPE_1022"] = 1022] = "TYPE_1022";
    ViewIndexDef[ViewIndexDef["TYPE_1023"] = 1023] = "TYPE_1023";
    ViewIndexDef[ViewIndexDef["TYPE_1024"] = 1024] = "TYPE_1024";
    ViewIndexDef[ViewIndexDef["TYPE_1025"] = 1025] = "TYPE_1025";
    ViewIndexDef[ViewIndexDef["TYPE_1026"] = 1026] = "TYPE_1026";
    ViewIndexDef[ViewIndexDef["TYPE_1027"] = 1027] = "TYPE_1027";
    ViewIndexDef[ViewIndexDef["TYPE_1028"] = 1028] = "TYPE_1028";
    ViewIndexDef[ViewIndexDef["TYPE_1029"] = 1029] = "TYPE_1029";
    ViewIndexDef[ViewIndexDef["TYPE_1030"] = 1030] = "TYPE_1030";
    ViewIndexDef[ViewIndexDef["TYPE_1031"] = 1031] = "TYPE_1031";
    ViewIndexDef[ViewIndexDef["TYPE_1032"] = 1032] = "TYPE_1032";
    ViewIndexDef[ViewIndexDef["TYPE_1033"] = 1033] = "TYPE_1033";
    ViewIndexDef[ViewIndexDef["TYPE_1034"] = 1034] = "TYPE_1034";
    ViewIndexDef[ViewIndexDef["TYPE_1035"] = 1035] = "TYPE_1035";
    ViewIndexDef[ViewIndexDef["TYPE_1036"] = 1036] = "TYPE_1036";
    ViewIndexDef[ViewIndexDef["TYPE_1037"] = 1037] = "TYPE_1037";
    ViewIndexDef[ViewIndexDef["TYPE_1038"] = 1038] = "TYPE_1038";
    ViewIndexDef[ViewIndexDef["TYPE_1039"] = 1039] = "TYPE_1039";
    ViewIndexDef[ViewIndexDef["TYPE_1040"] = 1040] = "TYPE_1040";
    ViewIndexDef[ViewIndexDef["TYPE_1043"] = 1043] = "TYPE_1043";
    ViewIndexDef[ViewIndexDef["TYPE_1045"] = 1045] = "TYPE_1045";
    ViewIndexDef[ViewIndexDef["TYPE_1041"] = 1041] = "TYPE_1041";
    ViewIndexDef[ViewIndexDef["TYPE_1047"] = 1047] = "TYPE_1047";
    ViewIndexDef[ViewIndexDef["TYPE_1048"] = 1048] = "TYPE_1048";
    ViewIndexDef[ViewIndexDef["TYPE_1049"] = 1049] = "TYPE_1049";
    ViewIndexDef[ViewIndexDef["TYPE_1050"] = 1050] = "TYPE_1050";
    ViewIndexDef[ViewIndexDef["TYPE_1051"] = 1051] = "TYPE_1051";
    ViewIndexDef[ViewIndexDef["TYPE_1052"] = 1052] = "TYPE_1052";
    ViewIndexDef[ViewIndexDef["TYPE_1053"] = 1053] = "TYPE_1053";
    ViewIndexDef[ViewIndexDef["TYPE_1054"] = 1054] = "TYPE_1054";
    ViewIndexDef[ViewIndexDef["TYPE_1055"] = 1055] = "TYPE_1055";
    ViewIndexDef[ViewIndexDef["TYPE_1056"] = 1056] = "TYPE_1056";
    ViewIndexDef[ViewIndexDef["TYPE_1057"] = 1057] = "TYPE_1057";
    ViewIndexDef[ViewIndexDef["TYPE_1058"] = 1058] = "TYPE_1058";
    ViewIndexDef[ViewIndexDef["TYPE_1059"] = 1059] = "TYPE_1059";
    ViewIndexDef[ViewIndexDef["TYPE_1060"] = 1060] = "TYPE_1060";
    ViewIndexDef[ViewIndexDef["TYPE_1061"] = 1061] = "TYPE_1061";
    ViewIndexDef[ViewIndexDef["TYPE_1062"] = 1062] = "TYPE_1062";
    ViewIndexDef[ViewIndexDef["TYPE_1063"] = 1063] = "TYPE_1063";
    ViewIndexDef[ViewIndexDef["TYPE_1064"] = 1064] = "TYPE_1064";
    ViewIndexDef[ViewIndexDef["TYPE_1065"] = 1065] = "TYPE_1065";
    ViewIndexDef[ViewIndexDef["TYPE_1066"] = 1066] = "TYPE_1066";
    ViewIndexDef[ViewIndexDef["TYPE_1067"] = 1067] = "TYPE_1067";
    ViewIndexDef[ViewIndexDef["TYPE_1068"] = 1068] = "TYPE_1068";
    ViewIndexDef[ViewIndexDef["TYPE_1069"] = 1069] = "TYPE_1069";
    ViewIndexDef[ViewIndexDef["TYPE_1070"] = 1070] = "TYPE_1070";
    ViewIndexDef[ViewIndexDef["TYPE_1071"] = 1071] = "TYPE_1071";
    ViewIndexDef[ViewIndexDef["TYPE_1072"] = 1072] = "TYPE_1072";
    ViewIndexDef[ViewIndexDef["TYPE_1073"] = 1073] = "TYPE_1073";
    ViewIndexDef[ViewIndexDef["TYPE_1074"] = 1074] = "TYPE_1074";
    ViewIndexDef[ViewIndexDef["TYPE_1075"] = 1075] = "TYPE_1075";
    ViewIndexDef[ViewIndexDef["TYPE_1076"] = 1076] = "TYPE_1076";
    ViewIndexDef[ViewIndexDef["TYPE_1077"] = 1077] = "TYPE_1077";
    ViewIndexDef[ViewIndexDef["TYPE_2000"] = 2000] = "TYPE_2000";
    ViewIndexDef[ViewIndexDef["TYPE_2001"] = 2001] = "TYPE_2001";
    ViewIndexDef[ViewIndexDef["TYPE_1078"] = 1078] = "TYPE_1078";
    ViewIndexDef[ViewIndexDef["TYPE_1079"] = 1079] = "TYPE_1079";
    ViewIndexDef[ViewIndexDef["TYPE_1080"] = 1080] = "TYPE_1080";
    ViewIndexDef[ViewIndexDef["TYPE_1081"] = 1081] = "TYPE_1081";
    ViewIndexDef[ViewIndexDef["TYPE_1082"] = 1082] = "TYPE_1082";
    ViewIndexDef[ViewIndexDef["TYPE_1083"] = 1083] = "TYPE_1083";
    ViewIndexDef[ViewIndexDef["TYPE_1084"] = 1084] = "TYPE_1084";
    ViewIndexDef[ViewIndexDef["TYPE_1085"] = 1085] = "TYPE_1085";
    ViewIndexDef[ViewIndexDef["TYPE_1086"] = 1086] = "TYPE_1086";
    ViewIndexDef[ViewIndexDef["TYPE_1087"] = 1087] = "TYPE_1087";
    ViewIndexDef[ViewIndexDef["TYPE_1088"] = 1088] = "TYPE_1088";
    ViewIndexDef[ViewIndexDef["TYPE_1089"] = 1089] = "TYPE_1089";
    ViewIndexDef[ViewIndexDef["TYPE_1090"] = 1090] = "TYPE_1090";
    ViewIndexDef[ViewIndexDef["TYPE_1092"] = 1092] = "TYPE_1092";
    ViewIndexDef[ViewIndexDef["TYPE_1093"] = 1093] = "TYPE_1093";
    ViewIndexDef[ViewIndexDef["TYPE_1094"] = 1094] = "TYPE_1094";
    ViewIndexDef[ViewIndexDef["TYPE_1095"] = 1095] = "TYPE_1095";
    ViewIndexDef[ViewIndexDef["TYPE_1096"] = 1096] = "TYPE_1096";
})(ViewIndexDef || (ViewIndexDef = {}));
//# sourceMappingURL=ViewManager.js.map