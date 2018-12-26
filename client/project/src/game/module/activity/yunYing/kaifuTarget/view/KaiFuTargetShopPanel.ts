class KaiFuTargetShopPanel extends KaiFuTargetBasePanel {
    private value_txt: eui.Label
    protected roleShowPanel: RoleShowPanel;
    protected attrs_label: eui.Label;
    protected imageShow_img: eui.Image;

    public static curLookIndex: number = -1;
    private curLookAttrs = [];
    public constructor() {
        super()
        this.activityType = ActivityKaiFuFuncType.ACT_26_DisCountShop
        this.skinName = "KaiFuTargetShopSkin";
    }
    public childrenCreated() {
        this.list.itemRenderer = KaiFuTargetShopItem;
        this.roleShowPanel.scaleX = 0.7;
        this.roleShowPanel.scaleY = 0.7;
    }

    public OnOpen() {
        this.observe(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, this.upDataLook)
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
        super.OnOpen();
        KaiFuTargetShopPanel.curLookIndex = -1
    }

    private upDataLook(...args: any[]) {
        if (args) {
            let cfgObj = args[0]
            if (cfgObj.stype == 2) {
                let xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(cfgObj.pid)
                if (!xianlvInfo) {
                    return
                }
                this.attrs_label.text = "战力：\n" + xianlvInfo.GetPower(1)
                this.imageShow_img.source = ""
                this.roleShowPanel.ClearCache();
                this.roleShowPanel.y = 433
                this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(cfgObj.pid))
            } else {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index
                let skinId = cfgObj.pid
                let type = cfgObj.itemtype
                let config = this.getSkinConfig(type, skinId)
                if (config == null) return;
                //this.curLookAttrs = this.getPowerAttrs(type,pid);
                this.attrs_label.text = "战力：\n" + ItemConfig.CalcAttrScoreValue(config.attrpower);
                this.roleShowPanel.ClearCache();
                this.imageShow_img.source = ""
                if (type == RoleShowDataType.ROLE_TITLE) {
                    this.imageShow_img.source = config.icon + "";
                }
                else if (type == RoleShowDataType.ROLE_TIANXIAN) {
                    this.roleShowPanel.y = 370
                    this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(config.pid))
                }
                else {
                    this.roleShowPanel.y = 433
                    this.roleShowPanel.SetAll(this.getShowById(type, config.pid))
                }
                this.UpdateContent()
            }
        }
    }

    private getSkinConfig(type: number, skinId) {
        let config;
        if (type == RoleShowDataType.ROLE_TITLE) {
            config = GameGlobal.Config.TitleConf
        }
        else if (type == RoleShowDataType.ROLE_RIDE) {
            config = GameGlobal.Config.RideSkinConfig
        }
        else if (type == RoleShowDataType.ROLE_WING) {
            config = GameGlobal.Config.WingSkinConfig
        }
        else if (type == RoleShowDataType.ROLE_SWORD) {
            config = GameGlobal.Config.WeaponSkinConfig
        }
        else if (type == RoleShowDataType.ROLE_TIANXIAN) {
            config = GameGlobal.Config.FairySkinConfig
        }
        else if (type == RoleShowDataType.ROLE_SKIN) {
            config = GameGlobal.Config.FashionSkinConfig
            return config[skinId][GameGlobal.actorModel.sex]
        }
        return config[skinId];
    }

    public getShowById(type: number, pid: number) {
        var role = SubRoles.ins().GetRoleData()
        var roleShowData = role.GetSubRoleData();
        let subRole = new RoleShowData();
        subRole.job = roleShowData.job;
        subRole.sex = roleShowData.sex;
        subRole.rideId = roleShowData.rideId;
        subRole.wingId = roleShowData.wingId
        subRole.clothID = roleShowData.clothID
        subRole.swordID = roleShowData.swordID
        subRole.tianxId = 0;

        if (type == RoleShowDataType.ROLE_RIDE) {
            subRole.rideId = pid;
        }
        else if (type == RoleShowDataType.ROLE_WING) {
            subRole.wingId = pid;
        }
        else if (type == RoleShowDataType.ROLE_SWORD) {
            subRole.swordID = pid;
        }
        else if (type == RoleShowDataType.ROLE_SKIN) {
            subRole.clothID = pid;
        }
        return subRole;
    }
    public UpdateContent() {
        super.UpdateContent();

    }

}

class KaiFuTargetShopItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuTargetShopItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected name_txt: eui.Label;
    protected gainway_txt: eui.Label;
    protected priceIcon1: PriceIcon;
    protected priceIcon2: PriceIcon;

    protected imgBuyEnd: eui.Image;
    protected itemIcon: ItemBase;
    protected btn_buy: eui.Button;
    protected btn_look: eui.Button;
    protected limit_txt: eui.Label;
    protected look_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


    public constructor() {
        super()
    }
    public childrenCreated() {
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.btn_look.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.gainway_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
    protected onClick(e: egret.TouchEvent): void {
        if (e.currentTarget == this.btn_buy) {
            if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
                return;
            }
            GameGlobal.ActivityKaiFuModel.sendReward(this.data.cfg.Id, this.data.cfg.index)
        } else if (e.currentTarget == this.btn_look) {
            GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, this.data.cfg);
        } else if (e.currentTarget == this.gainway_txt) {
            let cfgObj = this.data.cfg

            GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0])

        }
    }

    dataChanged() {

        let type = this.data.type;
        let cfgObj = this.data.cfg

        let actType = this.data.actType

        let activityData: ActivityType26Data = <ActivityType26Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);

        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.isShowName(false)
        this.itemIcon.setCount(cfgObj.count);
        let goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;

        let buyNum = 0
        this.btn_look.visible = true;
        if (KaiFuTargetShopPanel.curLookIndex == cfgObj.index) {
            this.btn_look.visible = false;
        }
        if (cfgObj.type.type == 2) {
            //不限购
            this.limit_txt.text = "不限购"
        } else {

            if (activityData) {
                buyNum = activityData.buynums[cfgObj.index - 1]
            }
            this.limit_txt.text = "限购（" + buyNum + "/" + cfgObj.type.value + "）"
        }
        let value = cfgObj.value;
        this.imgBuyEnd.visible = false;

        //buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.Id);
        if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
            this.imgBuyEnd.visible = true;
        } else {
            if (KaiFuTargetShopPanel.curLookIndex == -1) {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index
                GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, cfgObj);
            }
        }

        this.btn_buy.visible = (this.imgBuyEnd.visible) ? false : true;
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
        if (cfgObj.gainway) {
            this.gainway_txt.text = cfgObj.gainway[0][0]
            UIHelper.SetLinkStyleLabel(this.gainway_txt, cfgObj.gainway[0][0])
        }
        this.gainway_txt.visible = cfgObj.gainway

    }


}
