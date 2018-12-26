class ItemBase extends eui.ItemRenderer {
    public nameTxt: eui.Label;
    public num: number;
    public itemConfig: any;
    protected redPoint: eui.Image;
    public count: eui.Label;
    private equipEffect: MovieClip;
    protected itemIcon: ItemIcon;
    public imgChoose: eui.Image;

    public mCallback: Function

    public constructor() {
        super()
        this.touchEnabled = false
        this.touchChildren = true
        this.init();
    }

    childrenCreated() {
        super.childrenCreated()
        if (this.count) {
            this.count.scaleX = 1 / this.scaleX
            this.count.scaleY = 1 / this.scaleY
        }
    }

    private m_LTLabel: eui.Label

    private GetLTLabel(): eui.Label {
        if (!this.m_LTLabel) {
            let label = this.m_LTLabel = new eui.Label
            label.size = 18
            label.textColor = 0xfff01e
            label.left = label.top = 12
            label.stroke = 2
            label.strokeColor = Color.Black

            label.scaleX = 1 / this.scaleX
            label.scaleY = 1 / this.scaleY
        }
        if (!this.m_LTLabel.parent) {
            this.addChild(this.m_LTLabel)
        }
        return this.m_LTLabel
    }

    /**触摸事件 */
    public init() {
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
    }

    public setItemCount(visible: boolean): void {
        this.count.visible = visible
    }

    public setItemImg(itemName: string): void {
        this.itemIcon.setItemImg(itemName)
    }

    public setItemImgGray(gray: boolean) {
        this.itemIcon.setGray(gray)
    }

    public setItemBg(value: string): void {
        this.itemIcon.setItemBg(value)
    }

    public setDataByConfig(config) {
        this.itemIcon.setData(config);
        let nameStr = ""
        let colorStr = ""
        this.itemConfig = config
        if (config.type == ItemType.EQUIP) {
            nameStr =config.level + "级"
            this.nameTxt.textColor = 0x682F00;
        } else if (ItemConst.ITEM_SHOW_RANK_TYPE[config.type]) {
            nameStr = config.level + "阶"
            this.nameTxt.textColor = 0x682F00;

            let str = nameStr
            if (this.data.att && this.data.att.length) {
                str += StringUtils.addColor("+" + this.data.att.length, 0xd27701)
                this.GetLTLabel().textFlow = TextFlowMaker.generateTextFlow(str)
            } else {
                this.GetLTLabel().text = str
            }
        } else {
            nameStr = config.name;
        }
        if (nameStr) {
            this.nameTxt.text = nameStr
        }
        if (config.type != 0) {
            this.nameTxt.textColor = ItemBase.QUALITY_COLOR[config.quality];
        }
        if (this.num != undefined) {
            this.setCount(this.num + "");
        }
    }

    public dataChanged() {
        this.clear();
        if (!isNaN(this.data)) {
            let id = this.data as number
            this.itemConfig = GlobalConfig.ins().ItemConfig[id];
            this.setDataByConfig(this.itemConfig);
        } else if (egret.is(this.data, "ItemBaseData")) {
            let data = this.data as ItemBaseData
            this.UpdateItemData(data.itemConfig)
        } else {
            let data = this.data as IRewardData
            //奖励数据
            if (data.type == 0) {
                this.itemIcon.setItemImg(RewardData.getCurrencyRes(data.id))
                if (data.id == MoneyConst.yuanbao) {
                    this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(4))
                }
                this.nameTxt.text = RewardData.getCurrencyName(data.id);
                this.nameTxt.textColor = 0xaa6a31
                var count = data.count;
                (count != undefined && count > 1) ? this.setCount(count + "") : this.setCount("");
            } else if (data.type == 1) {
                this.UpdateItemData(GlobalConfig.ins().ItemConfig[data.id])
            }
        }
        //设置红点
        this._UpdateRedPoint()
    }

    private UpdateItemData(itemConfig: any) {
        this.itemConfig = itemConfig
        if (!this.itemConfig)
            return;
        this.setDataByConfig(this.itemConfig);
        let count = this.data ? this.data.count : 0
        if (count && count > 1) {
            this.setCount(this.data.count + "")
        } else {
            this.setCount("");
        }
        //如果是道具 而且存在角标字段
        if (this.data.lCorner) {
            this.itemIcon.SetCornerImg(this.data.lCorner)
        }
        if (this.data.corner != null) {
            this.itemIcon.SetCornerType(this.data.corner)
        }
    }
    
    public setItemAward(type, id, count) {
        let award: any = {};
        award.type = type;
        award.id = id;
        award.count = count;
        this.data = award;
    }

    //显示背包以及需要使用的数量
    public showCostNums() {
        if (this.data && this.data.id && this.data.count) {
            var nHave = GameGlobal.UserBag.GetCount(this.data.id)
            this.count.text = nHave + "/" + this.data.count;

            if (nHave >= this.data.count) {
                this.count.textColor = Color.Green
            }
            else {
                this.count.textColor = Color.Red
            }
        }
    }

    //_data 为配表数据  设置并刷新数据 
    public setItemData(_data) {
        if (_data && typeof (_data) === "object") {
            this.data = _data;
            this.dataChanged()//   
        }
    }

    protected _UpdateRedPoint() {
        //设置红点
        this.redPoint.visible = this.data.canbeUsed;
    }

    public IsShowRedPoint(isShow: boolean): void {
        this.redPoint.visible = isShow
    }

    /**
     * 清除格子数据
     */
    public clear() {
        if (this.m_LTLabel && this.m_LTLabel.parent) {
            this.m_LTLabel.parent.removeChild(this.m_LTLabel)
        }
        this.itemConfig = null;
        if (this.itemIcon.setData != null) {
            this.itemIcon.setData(null);
        } else {
            console.log("itemicon setdata data error")
        }
        this.count.text = "";
        this.nameTxt.text = "";
        this.nameTxt.textColor = 0xFFFFFF;
    }

    public destruct() {
        this.mCallback = null
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
    }

    public onClick() {
        if (this.mCallback) {
            this.mCallback(this)
            return
        }
        this.showDetail();
    }

    public showDetail() {
        let itemConfig = this.itemConfig
        if (itemConfig != undefined && itemConfig && itemConfig.type != undefined) {
            if (ItemConst.OPEN_EQUIPS_TIPS[this.itemConfig.type]) {
                this.openEquipsTips();
            } else {
                this.openItemTips(this.itemConfig.id, this.getCount())
            }
        } else {
            if (this.data) {
                let itemId = this.data.id
                let count = this.data.count || 0
                if (!ItemBase.MONEYCONST_TO_ITEMCOFIG) {
                    ItemBase.MONEYCONST_TO_ITEMCOFIG = {
                        [MoneyConst.exp]: 2000036,
                        [MoneyConst.gold]: 2000034,
                        [MoneyConst.yuanbao]: 2000033,
                        [MoneyConst.byb]: 2000032,
                    }
                }
                let id = ItemBase.MONEYCONST_TO_ITEMCOFIG[itemId]
                if (id) {
                    let itemConfig = GameGlobal.Config.ItemConfig[id]
                    if (itemConfig) {
                        this.openItemTips(itemConfig.id, count);
                    }
                }
            }
        }
    }

    private static MONEYCONST_TO_ITEMCOFIG = null

    private _count: number = 1

    public setCount(str) {
        this._count = Math.max(Number(str), 1)
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            // this._count = wNum
            str = wNum / 10 + "万";
        }
        this.count.text = str;
    }

    public getCount(): number {
        return this._count;
    }

    public openEquipsTips() {
        ViewManager.ins().open(EquipDetailedWin, this.itemConfig.id, this.data);
    }

    public openItemTips(id, count) {
        let config = GameGlobal.Config.ItemConfig[id]
        if (config.pid && config.pid > 0)
        {
            ViewManager.ins().open(TianshenDetailWin, config, count)
            return
        }

        ViewManager.ins().open(ItemDetailedWin, 0, id, count)
    }

    public isShowName(b) {
        if (this.nameTxt) {
            this.nameTxt.visible = b;
        }
    }

    public getText() {
        return this.nameTxt.text;
    }

    // public showEquipEffect() {
    //     if (this.itemConfig.quality <= 3 || this.itemConfig.type != 0)
    //         return;
    //     this.showEffect(this.itemConfig.quality)
    // }

    // public showEffect(e): void {
    //     this.equipEffect || (this.equipEffect = new MovieClip)
    //     this.equipEffect.blendMode = egret.BlendMode.ADD
    //     this.equipEffect.touchEnabled = false
    //     if (e >= 4) {
    //         if (e == 4) {
    //             this.equipEffect.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_005"), true)
    //         } else {
    //             this.equipEffect.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_006"), true)
    //         }
    //         this.equipEffect.x = 47
    //         this.equipEffect.y = 47
    //     }
    //     this.addChild(this.equipEffect)
    // }

    public getTextColor(): number {
        return this.nameTxt.textColor
    }

    // showItemEffect() {
    //     if (this.data && this.data.type == 0 && this.data.id == MoneyConst.yuanbao) {
    //         //元宝
    //         this.showEffect(4)
    //         return
    //     }
    //     return !this.itemConfig || this.itemConfig.quality <= 3 ? void (this.equipEffect && (this.equipEffect.clearCache(), DisplayUtils.removeFromParent(this.equipEffect))) : void this.showEffect(this.itemConfig.quality)
    // }

    public setnameTxtVisible(bool: boolean = false) {
        this.nameTxt.visible = bool;
    }

    public static GetColorByQuality(quality: number): number {
        let color = this.QUALITY_COLOR[quality]
        return color || this.QUALITY_COLOR[0]
    }


  //提示框专用
    public static QUALITY_TIP_COLOR = [
        0xfdf1d2, //普通 
        0x4eec73, //绿色
        0x3fd7f1, //蓝色
        0xd56dfb, //紫色
        0xff6c00, //橙色
        0xff4141,//红色
        0xEFCBFB];//弃用的


    public static QUALITY_COLOR = [
        0x682f00, // 0xf7f0f0, 
        0x019704,
        0x6183f3,
        0xc400fd,
        0xd27701,
        0xdb0000,
        0xEFCBFB];

    // 宠物技能颜色
    public static SKILL_NAME_COLOR = [
		"0xff0000",
		"0xff6e00",
		"0xaa00e9",
		"0x0095ff",
		"0x27a02a",
		"0xfdf1d2",
	]


    // //提示框专用
    // public static QUALITY_TIP_COLOR = [
    //     0xfdf1d2, //普通 
    //     0x00fc06, //绿色
    //     0x10ebff, //蓝色
    //     0xee78ff, //紫色
    //     0x682f00, //橙色
    //     0xff4141,//红色
    //     0xEFCBFB];//弃用的


    // public static QUALITY_COLOR = [
    //     0x682f00, // 0xf7f0f0, 
    //     0x019704,
    //     0x6183f3,
    //     0xc400fd,
    //     0xd27701,
    //     0xdb0000,
    //     0xEFCBFB];

    public static QUALITY_NAME_STR = [
        "白色",
        "绿色",
        "蓝色",
        "紫色",
        "橙色",
        "红色",
    ];
}
class ItemBaseNotName extends ItemBase {
    public constructor() {
        super()
    }

    childrenCreated() {
        super.childrenCreated()
        this.nameTxt.visible = false
    }
}

class ItemBaseShowCount extends ItemBase {
    public constructor() {
        super()
    }

    childrenCreated() {
        super.childrenCreated()
    }
    public dataChanged() 
    {
        super.dataChanged()
        if(this.data && this.data.count)
        {
            this.setCount(this.data.count)
        }
    }
}

//数量是1也显示
class ItemBaseShowCountNoName extends ItemBase {
    public constructor() {
        super()
    }

    childrenCreated() {
        super.childrenCreated()
         this.nameTxt.visible = false
    }
    public dataChanged() 
    {
        super.dataChanged()
        if(this.data && this.data.count)
        {
            this.setCount(this.data.count)
        }
    }
}

class ItemBaseCost extends ItemBase {

    public constructor() {
        super()

    }

    public dataChanged() {
        super.dataChanged()
        this.showCostNums()
    }
}

//右上角带角标
class ItemRightCorner extends ItemBase {

    public constructor() {
        super()

    }

    public dataChanged() {
        super.dataChanged()
        this.showCostNums()
    }
}


enum ITEM_QUALITY {
    WHITE_QUALITY = 0,
    GREEN_QUALITY = 1,
    BLUE_QUALITY = 2,
    VIOLET_QUALITY = 3,
    ORANGE_QUALITY = 4,
    RED_QUALITY = 5,
}