interface IViewMangerImpl {
    OnOpenView(view: BaseEuiView)
    OnCloseOneView(view: BaseEuiView)
    OnClosePartView()
    OnCloseAll()
}

class ViewManager extends BaseClass {

    public static openCheckTip = false

    public _views: { [key: string]: BaseEuiView } = {}
    private _viewCode: { [key: number]: string } = {}
    public _opens: string[] = []

    public mViewImpl: IViewMangerImpl

    public constructor() {
        super();
    }

    public static ins(): ViewManager {
        return super.ins();
    }

	/**
     * 清空处理
     */
    public clear() {
        this.closeAll();
    }

    /**
     * 销毁一个面板
     * @param hCode
     */
    public destroy(hCode) {
        let keys
        if (this._viewCode[hCode]) {
            keys = this._viewCode[hCode]
            delete this._viewCode[hCode]
        }
        if (this._views[keys]) {
            delete this._views[keys]
        }
    }

    /**
    * 检测能否开启
    * @param cls 类名
    */
    public static viewOpenCheck(cls, param) {
        if (!cls) {
            return false
        }
        let func = cls["openCheck"]
        if (func) {
            return func.apply(null, param);
        }
        return true
    }

    /**
     * 打开窗口对应的标签页
     */
    public openIndex(cls: Function, index: number) {
        if (ViewManager.ins().isShow(cls)) {
            ViewManager.ins().getView(cls).SetTableIndex(index)
        } else {
            ViewManager.ins().open(cls, index)
        }
    }

    /**
    * 打开窗口
    * @param cls 类
    * @param param 参数
    *  */
    public open(cls: Function, ...param: any[]) {
        //检测能否开启
        if (!ViewManager.viewOpenCheck(cls, param)) {
            return null;
        }
        var view = this.openEasy(cls, param);
        if (view) {
            if (this.mViewImpl) {
                this.mViewImpl.OnOpenView(view)
            }
        }
        return view;
    }

    public openEasy(cls, param = null) {
        if (cls == null) {
            console.log("open nameorclass is null")
            return;
        }
        var clsName = egret.getQualifiedClassName(cls)
        var view: BaseEuiView = this._views[clsName];
        if (!view) {
            view = new cls()
            this._views[clsName] = view;
            this._viewCode[view.hashCode] = clsName;
        }
        if (view == null) {
            console.error("panel " + clsName + "不存在");
            return;
        }
        let layerLevel: egret.DisplayObjectContainer = cls["LAYER_LEVEL"]
        if (layerLevel == null) {
            layerLevel = view.GetLayerLevel()
            if (!layerLevel) {
                console.error("没有设置层级", clsName)
            }
        }
        if (this._IsShow(clsName) || view.isInit()) {
            this.AddTo(layerLevel, view)
            this._OpenView(view, param)
        } else {
            view.loadResource(() => {
                this.AddTo(layerLevel, view)
                view.setVisible(false);
            }, () => {
                view.DoInit();
                view.initData();
                this._OpenView(view, param)
                view.setVisible(true);
            });
        }
        if (this._opens.indexOf(clsName) == -1)
            this._opens.push(clsName);
        return view;
    };

    private AddTo(parent: egret.DisplayObjectContainer, view: BaseEuiView) {
        let selfViewLevel = Util.GetClass(view).VIEW_LAYER_LEVEL || ViewLayerLevel.MIDDLE
        let index = 0
        for (let i = parent.numChildren - 1; i >= 0; --i) {
            if (selfViewLevel >= (Util.GetClass(parent.getChildAt(i)).VIEW_LAYER_LEVEL || ViewLayerLevel.MIDDLE)) {
                index = i + 1
                break
            }
        }
        parent.addChildAt(view, index);
    }

    private _OpenView(view: BaseEuiView, param: any): void {
        view.DoOpen.call(view, param);
    }

    private _CloseVie(view: BaseEuiView): void {
        view.DoClose.apply(view);
    }

    /**
     * 关闭窗口
     * @param objOrCls 类、对象
     **/
    public close(objOrCls) {
        let clsName = egret.getQualifiedClassName(objOrCls)
        var view = this.closeEasy(clsName);
        if (view) {
            if (this.mViewImpl) {
                this.mViewImpl.OnCloseOneView(view)
            }
        } else {
            if (DEBUG) {
                console.log("not close view " + clsName)
            }
        }

    }

    // 关闭窗口
    public closeEasy(clsName: string) {
        if (!this._IsShow(clsName)) {
            return null;
        }
        var view = this._views[clsName];
        if (view) {
            var viewIndex = this._opens.indexOf(clsName);
            if (viewIndex >= 0) {
                this._opens.splice(viewIndex, 1);
                this._CloseVie(view)
            }
            DisplayUtils.removeFromParent(view)
            view.destoryView();
        }
        return view;
    }

    /**
     * 获取一个UI对象
     * @param cls  类
     */
    public getView(cls): BaseEuiView {
        return this._views[egret.getQualifiedClassName(cls)];
    }

    /**
     * 关闭所有开启中的UI
     */
    public closeAll() {
        for (let i = this._opens.length - 1; i >= 0; --i) {
            this.closeEasy(this._opens[i]);
        }
        if (this._opens.length > 0) {
            console.error(this._opens.length + " => close all error !!!")
        }

        if (this.mViewImpl) {
            this.mViewImpl.OnCloseAll()
        }
    };

    /**
     * 当前ui打开数量
     */
    public currOpenNum() {
        return this._opens.length;
    }

    /**
     * UI是否开启
     * @param cls 类
     */
    public isShow(cls: any): boolean {
        return this._IsShow(egret.getQualifiedClassName(cls))
    }

    private _IsShow(clsName: string): boolean {
        return this._opens.indexOf(clsName) >= 0
    }

    // 关闭部分界面
    closePartPanel() {
        let list = []
        for (let i = 0; i < this._opens.length; i++) {
            let viewName = this._opens[i];
            if (viewName != "MainTop2Panel" && viewName != "MainBottomPanel" && viewName != "MainTopPanel" && viewName != "BriberyBasePanel") {
                list.push(this._opens[i])
            }
        }
        for (var i = list.length - 1; i >= 0; i--) {
            let viewName = list[i]
            let view = this._views[viewName]
            if (!view) {
                continue
            }
            let parent = view.parent
            if (parent == LayerManager.UI_Popup || parent == LayerManager.UI_Main || parent == LayerManager.UI_Main_2) {
                this.closeEasy(viewName)
            }
        }
        if (this.mViewImpl) {
            this.mViewImpl.OnClosePartView()
        }
    }

    //===================================
    //=============任务指引===============
    //===================================
    public Guide(index: ViewIndexDef, param: any = null) {
        this._GotoView(index, param);
    }
    private static GUIDE_LIST: { [key: number]: Function };
    private static INVAILD_NAME = []
    // 矫正参数错误
    private static AdjustIndex(index: ViewIndexDef, param: any) {
        return [index, param]
    }

    private _GotoView(index: ViewIndexDef, param: any) {
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
                break

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
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DAYAN])
                break;
            case ViewIndexDef.TYPE_1001:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YUANBAO])
                break
            case ViewIndexDef.TYPE_1002:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BANGYUAN])
                break
            case ViewIndexDef.TYPE_1003:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_EQUIP])
                break
            case ViewIndexDef.TYPE_1004:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BLACK])
                break
            case ViewIndexDef.TYPE_1005:
                ViewManager.ins().open(FbLayer);
                break
            case ViewIndexDef.TYPE_1006:
                ViewManager.ins().open(FbLayer, 1);
                break
            case ViewIndexDef.TYPE_1007:
                ViewManager.ins().open(FbLayer, 2);
                break
            case ViewIndexDef.TYPE_1008:
                ViewManager.ins().open(FbLayer, 3);
                break
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
                break
            case ViewIndexDef.TYPE_1023:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANLV])
                break
            case ViewIndexDef.TYPE_1024:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CHONGWU])
                break
            case ViewIndexDef.TYPE_1025:
                ViewManager.ins().open(ExchangeMoneyWin)
                break
            case ViewIndexDef.TYPE_1026:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DATI])
                break
            case ViewIndexDef.TYPE_1027:
                break
            case ViewIndexDef.TYPE_1028:
                break
            case ViewIndexDef.TYPE_1029:
                ViewManager.ins().open(BossMainPanel, 0);
                break
            case ViewIndexDef.TYPE_1030:
                ViewManager.ins().open(BossMainPanel, 1);
                break
            case ViewIndexDef.TYPE_1031:
                ViewManager.ins().open(BossMainPanel, 2);
                break
            case ViewIndexDef.TYPE_1032:
                ViewManager.ins().open(BossMainPanel, 3);
                break
            case ViewIndexDef.TYPE_1033:
                ViewManager.ins().open(ArenaWin);
                break
            case ViewIndexDef.TYPE_1034:
                ViewManager.ins().open(CrossMainPanel);
                break
            case ViewIndexDef.TYPE_1035:
                ViewManager.ins().open(GangMainWin, 1);
                break
            case ViewIndexDef.TYPE_1036:
                ViewManager.ins().open(GangMainWin, 3);
                break
            case ViewIndexDef.TYPE_1037:
                ViewManager.ins().open(DailyMainWin);
                break
            case ViewIndexDef.TYPE_1038:
                ViewManager.ins().open(DailyMainWin, 2);
                break
            case ViewIndexDef.TYPE_1039:
                ViewManager.ins().open(DailyMainWin, 3);
                break
            case ViewIndexDef.TYPE_1040:
                ViewManager.ins().open(CrossMainPanel, 2);
                break
            case ViewIndexDef.TYPE_1043:
                ViewManager.ins().open(GangBossPanel);
                break
            case ViewIndexDef.TYPE_1045:
                ViewManager.ins().open(QujingMainWin)
                break
            case ViewIndexDef.TYPE_1047:
                ViewManager.ins().open(DailyMainWin, 1);
                break
            case ViewIndexDef.TYPE_1048:
                RechargeWin.Open();
                break
            case ViewIndexDef.TYPE_1049:
                ViewManager.ins().open(VipMainPanel);
                break
            case ViewIndexDef.TYPE_1050:
                ViewManager.ins().open(GrowUpWin);
                break
            case ViewIndexDef.TYPE_1051:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING])
                break
            case ViewIndexDef.TYPE_1052:
                ViewManager.ins().open(TreasureHuntMainPanel);
                break
            case ViewIndexDef.TYPE_1053:
                ViewManager.ins().open(ForgeWin);
                break
            case ViewIndexDef.TYPE_1054:
                ViewManager.ins().open(ForgeWin, 1);
                break
            case ViewIndexDef.TYPE_1055:
                ViewManager.ins().open(ForgeWin, 2);
                break
            case ViewIndexDef.TYPE_1056:
                ViewManager.ins().open(ForgeWin, 3);
                break
            case ViewIndexDef.TYPE_1057:
                ViewManager.ins().open(WorldMapPanel);
                break
            case ViewIndexDef.TYPE_1058:
                ViewManager.ins().open(RelationWin);
                break
            case ViewIndexDef.TYPE_1059:
                ViewManager.ins().open(YingYuanWin)
                break
            case ViewIndexDef.TYPE_1060:
                if (!UserFb.CheckFighting())
                    return

                if (!GameGlobal.actorModel.HasGuild()) {
                    UserTips.ins().showTips("您还没有加入帮会")
                    return
                }
                GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid)
                break
            case ViewIndexDef.TYPE_1061:
                let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9) as ActivityType19Data;
                if (data) {
                    let config = data.GetConfig();
                    if (!config[data.reachday]) {
                        return;
                    }
                    if (data.runday <= data.reachday) {
                        UserTips.ins().showTips("你已经购买了该礼包")
                        return;
                    }
                    if (data.isOpenActivity()) {
                        ViewManager.ins().open(RmbGiftPanel)
                    }
                }
                break
            case ViewIndexDef.TYPE_1062:
                ViewManager.ins().open(TsumKoBasePanel, param);
                break
            case ViewIndexDef.TYPE_1063:
                ViewManager.ins().open(QujingMainWin)
                break
            case ViewIndexDef.TYPE_1064:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANDU])
                break
            case ViewIndexDef.TYPE_1065:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CAILIAO])
                break
            case ViewIndexDef.TYPE_1066:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BANGPAI])
                break
            case ViewIndexDef.TYPE_1067:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_JINGJI])
                break
            case ViewIndexDef.TYPE_1068:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YOUQING])
                break
            case ViewIndexDef.TYPE_1069:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_WEIWANG])
                break
            case ViewIndexDef.TYPE_1070:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING])
                break
            case ViewIndexDef.TYPE_1071:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_PIFU])
                break
            case ViewIndexDef.TYPE_1072:
                KaiFuActivityWin.Show(5)
                break
            case ViewIndexDef.TYPE_1073:
                ViewManager.ins().open(AuctionMainPanel)
                break
            case ViewIndexDef.TYPE_1074:
                ViewManager.ins().open(GodPetActiveLotteryWin)
                break
            case ViewIndexDef.TYPE_1075:
                ShootUpIconRule.Open()
                break
            case ViewIndexDef.TYPE_1076:
                DiscountRule.Open()
                break
            case ViewIndexDef.TYPE_1077:
                FightPetFBIconRule.Open()
                break
            case ViewIndexDef.TYPE_2000:
                UserTips.ins().showTips("每日首充活动获得")
                break
            case ViewIndexDef.TYPE_2001:
                UserTips.ins().showTips("神兽降临活动获得")
                break
            case ViewIndexDef.TYPE_1078: // 宠物界面  
                ViewManager.ins().open(PetMainPanel)
                break
            case ViewIndexDef.TYPE_1079: // 仙侣界面  
                ViewManager.ins().open(XianlvMainPanel)
                break
            case ViewIndexDef.TYPE_1080: // 子女界面  
                ViewManager.ins().open(LingtongMainPanel)
                break
            case ViewIndexDef.TYPE_1081: // 房屋界面  
                ViewManager.ins().open(YingYuanWin, 1)
                break
            case ViewIndexDef.TYPE_1082: // 玄女界面  
                ViewManager.ins().open(HavingMainPanel)
                break
            case ViewIndexDef.TYPE_1083: // 经脉界面  
                ViewManager.ins().open(RoleJingMaiPanel)
                break
            case ViewIndexDef.TYPE_1084: // 丹药界面  
                ViewManager.ins().open(RoleElixirPanel)
                break
            case ViewIndexDef.TYPE_1085: // 图腾界面  
                ViewManager.ins().open(TotemsMainWin)
                break
            case ViewIndexDef.TYPE_1086: // 粉丝界面  
                ViewManager.ins().open(FriendMainPanel,1)
                break
            case ViewIndexDef.TYPE_1087: // 神装
                ViewManager.ins().open(DeityEquipWin)
                break
            case ViewIndexDef.TYPE_1088: // 法宝
                ViewManager.ins().open(TreasureWin)
                break
            case ViewIndexDef.TYPE_1089://神装转盘
                ViewManager.ins().open(TotemsGoodLuckMainWin,0)
                break
            case ViewIndexDef.TYPE_1090:
                OpenDayGifRule.Open()
                break
            case ViewIndexDef.TYPE_1092:
                ViewManager.ins().open(AuctionMainPanel, 1)
                break
            case ViewIndexDef.TYPE_1093: //図騰转盘
                ViewManager.ins().open(TotemsGoodLuckMainWin,1)
                break
                

            default:
                console.warn("not def goto index => " + index)
                return false;
        }
        return true
    }
}

enum ViewIndexDef {
    EquipWearCount = 10010,    // 穿戴装备 穿戴N件任意装备
    EquipWearAssign = 10011,  // 穿戴装备 穿戴一件指定装备

    EquipSmelt = 10020,   // 装备熔炼

    EquipEnhanceAll = 10030,  // 装备强化 装备强化总等级达N级
    EquipEnhanceAcc = 10031,  // 装备强化 装备精炼N次
    EquipRefineAll = 10040,  // 装备精炼 装备精炼总等级达N级
    EquipRefineAcc = 10041,  //装备精炼 装备精炼N次
    EquipAnneal = 10050,    // 装备锻炼 锻炼总等级达N级
    EquipAnnealAcc = 10051, //装备锻炼 装备锻炼N次
    EquipGemAll = 10060,    // 装备宝石 装备宝石总等级达N级
    EquipGemAcc = 10061, // 装备宝石 升级宝石N次

    SkillUpgrade = 20010,//技能升级到N级
    ChapterClear = 30010,//关卡通关第N关
    ChapterGoto = 30020, // 到达指定地图
    PetActive = 40010,   // 激活宠物
    Xianlv = 40120,         // 仙侣
    PetUpgrade = 40020,  // 升级宠物N次
    RideUpgrade = 50010, // 坐骑升级N次
    Tianx = 50020,      // 守护
    TeamFb = 60010,      //跨服组队副本
    MyBoss = 60020,      //挑战个人boss
    PublicBoss = 60030,  // 挑战全民boss
    Arane = 60040,       //战竞技场N次
    MaterialFb = 60050,  // 挑战材料副本
    Treasuremap = 60060, // 藏宝图
    HeavenFb = 60070,    //勇闯天庭
    LingLongTa = 60081,     // 玲珑塔
    Fomalhaut = 60090,      // 师门任务
    ChatWorld = 70010,   // 世界说话
    RoleLevelup = 70020, // 角色升级到N级
    AutoOpen = 70030,    //开启自动挑战
    HookKill = 70040,    //挂机遇怪N次
    DayLogin = 70050,    //每天登陆




    // 策划定义
    TYPE_1000 = 1000, //	大雁商店
    TYPE_1001 = 1001, //	元宝商店
    TYPE_1002 = 1002, //	绑元商店
    TYPE_1003 = 1003, //	装备商店
    TYPE_1004 = 1004, //	帮会商店
    TYPE_1005 = 1005, //	材料副本
    TYPE_1006 = 1006, //	藏宝图
    TYPE_1007 = 1007, //	玲珑宝塔
    TYPE_1008 = 1008, //	勇闯天庭
    TYPE_1009 = 1009, //	坐骑副本
    TYPE_1010 = 1010, //	宠物副本
    TYPE_1011 = 1011, //	精炼副本
    TYPE_1012 = 1012, //	仙侣副本
    TYPE_1013 = 1013, //	锻炼副本
    TYPE_1014 = 1014, //	宝石副本
    TYPE_1015 = 1015, //	守护副本
    TYPE_1016 = 1016, //	神兵副本
    TYPE_1017 = 1017, //	翅膀副本
    TYPE_1018 = 1018, //	法阵副本
    TYPE_1019 = 1019, //	仙位副本
    TYPE_1020 = 1020, //	通灵副本
    TYPE_1021 = 1021, //	兽魂副本
    TYPE_1022 = 1022, //	房屋副本
    TYPE_1023 = 1023, //	仙侣商城
    TYPE_1024 = 1024, //	宠物商城
    TYPE_1025 = 1025, //	银两兑换
    TYPE_1026 = 1026, //	科举商店
    TYPE_1027 = 1027, //	装扮商店
    TYPE_1028 = 1028, //	充值活动
    TYPE_1029 = 1029, //	个人BOSS
    TYPE_1030 = 1030, //	全民BOSS
    TYPE_1031 = 1031, //	野外BOSS
    TYPE_1032 = 1032, //	至尊BOSS
    TYPE_1033 = 1033, //	竞技场
    TYPE_1034 = 1034, //	跨服组队
    TYPE_1035 = 1035, //	帮会组队
    TYPE_1036 = 1036, //	蟠桃会
    TYPE_1037 = 1037, //	西游历练
    TYPE_1038 = 1038, //	平定安邦
    TYPE_1039 = 1039, //	组队历练
    TYPE_1040 = 1040, //	八十一
    TYPE_1043 = 1043, //    帮会boss
    TYPE_1045 = 1045, //	取经东归
    TYPE_1041 = 1041, //	 熔炼界面
    TYPE_1047 = 1047, //	师门任务
    TYPE_1048 = 1048, //    充值界面
    TYPE_1049 = 1049, //	vip界面
    TYPE_1050 = 1050, //	首充界面
    TYPE_1051 = 1051, //	护送商店
    TYPE_1052 = 1052, //	寻宝界面
    TYPE_1053 = 1053, //	强化界面
    TYPE_1054 = 1054, //	精炼界面
    TYPE_1055 = 1055, //	锻炼界面
    TYPE_1056 = 1056, //	宝石界面
    TYPE_1057 = 1057, //	世界地图
    TYPE_1058 = 1058, //	师徒界面
    TYPE_1059 = 1059, //	姻缘界面
    TYPE_1060 = 1060, //	帮会地图
    TYPE_1061 = 1061, //	10元礼包
    TYPE_1062 = 1062, //	八十一难组队
    TYPE_1063 = 1063, //	取经东归
    TYPE_1064 = 1064, //    仙道商店
    TYPE_1065 = 1065, //    材料商店
    TYPE_1066 = 1066, //    帮派福利
    TYPE_1067 = 1067, //    竞技福利
    TYPE_1068 = 1068, //    友情商店
    TYPE_1069 = 1069, //    威望商店
    TYPE_1070 = 1070, //    取经商店
    TYPE_1071 = 1071, //    皮肤商店
    TYPE_1072 = 1072, //    折扣商店
    TYPE_1073 = 1073, //    拍卖行 
    TYPE_1074 = 1074, //    降服神兽
    TYPE_1075 = 1075, //    直升丹界面
    TYPE_1076 = 1076, //    特惠充值界面
    TYPE_1077 = 1077, //    橙宠副本界面
    
    TYPE_2000 = 2000, //    每日首充
    TYPE_2001 = 2001, //    神兽降临

    TYPE_1078 = 1078, // 宠物界面  
    TYPE_1079 = 1079, // 仙侣界面  
    TYPE_1080 = 1080, // 子女界面  
    TYPE_1081 = 1081, // 房屋界面  
    TYPE_1082 = 1082, // 玄女界面  
    TYPE_1083 = 1083, // 经脉界面  
    TYPE_1084 = 1084, // 丹药界面  
    TYPE_1085 = 1085, // 图腾界面  
    TYPE_1086 = 1086, // 粉丝  
    TYPE_1087 = 1087, // 法宝
    TYPE_1088 = 1088, // 神装
    TYPE_1089 = 1089, // 神装转盘
    TYPE_1090 = 1090, // 八日登录
    TYPE_1092 = 1092, // 帮会拍卖标签界面
    TYPE_1093 = 1093, // 图腾转盘  
    
    
}