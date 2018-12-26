/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 装备商店商品item2
 * 
 **/


class ShopEquipItem extends eui.ItemRenderer {


    imgXiyou: eui.Image;
    nameLabel;
    itemIcon;
    priceIcon: PriceIcon;
    lbInfo;
    imgSellOut;
    buy: eui.Button;
    bBuyAll = false
    LvTipsTxt:eui.Label
    lbLv: eui.Label;

    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "FeatsShopItem";

        // this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)


    }

    public onClick(e) {
        if(egret.is(e.target.parent, 'ItemIcon')) return; 
        if(this.data&&ShopController.ins().enoughBuy(this.data))
		{
			ViewManager.ins().open(BuyWin,this.data)
		}
    }

    public dataChanged(): void {

        //更新内容

        this.lbInfo.text = ""

        this.bBuyAll = false


        this.lbInfo.textColor = Color.l_green_1
        
        //icon
        var itemConfig;
        if (this.data.id) {
            itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
            this.nameLabel.text = itemConfig.name;
            this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
            // this.itemIcon.setData(itemConfig);
            this.itemIcon.setDataByConfig(itemConfig);
            this.itemIcon.isShowName(false)
            if (this.data.count) {
                this.itemIcon.setCount(this.data.count + "")
            }

            this.lbLv.text = "Lv." + (itemConfig.level || 1)
            this.LvTipsTxt.visible = GameGlobal.actorModel.level < itemConfig.level


            //EquipConfig 装备数据
            let itemPower = ItemConfig.CalculateScore(this.data.id)
            let role = SubRoles.ins().GetRoleData()
            let eq = role.getEquipByIndex(itemConfig.subType)
            let eqPower = 0
            if (eq) {
                eqPower = ItemConfig.CalculateScore(eq.item.configID)
            }

            if (itemPower > eqPower) {
                this.lbInfo.text = "战斗力+" + (itemPower - eqPower)
            }


        }



        //稀有图片
        if (this.data.make && this.data.make === 1) {
            this.imgXiyou.visible = true
        }

        //设置价格
        if (this.data.currency.type) {
            this.priceIcon.setType(this.data.currency.id)
            this.priceIcon.setPrice(this.data.currency.count)
        }
        else {
            //待添加
            this.priceIcon.setPrice(this.data.currency.count)
        }




        //限购
        if (this.data.daycount) {
            if (this.data.daycount > 0) {

                if (this.data.buyTime && this.data.buyTime > 0 && this.data.daycount && this.data.buyTime === this.data.daycount) {
                    this.bBuyAll = true
                }
                else {
                    this.lbInfo.text = "(限购" + this.data.buyTime + "/" + this.data.daycount + ")"
                }
            }
        }

        //等级限制
        if (!ShopController.ins().enoughBuy(this.data, 3)) {
            this.lbInfo.text = ShopController.ins().enoughBuy(this.data, 2)
            this.lbInfo.textColor = Color.RedColor
        }


        //售罄
        if (this.bBuyAll) {
            this.imgSellOut.visible = true
            this.buy.visible = false
            // this.filters = Color.GetFilter()//变灰
        }
        else {
            this.imgSellOut.visible = false
            this.buy.visible = true
            //  this.filters = null
        }



    }




}