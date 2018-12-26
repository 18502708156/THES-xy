/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/5 18:51
 * @meaning: 灵童命格手动分解详情item
 * 
 **/


class DestinyEquipItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyEquipItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    public lbFight: eui.Label;
    public buy: eui.Button;
    public nameLabel: eui.Label;
    public itemIcon: ItemBaseNotName;
    public lbInfo0: eui.Label;
    public lbInfo1: eui.Label;
    /////////////////////////////////////////////////////////////////////////////






    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "DestinyEquipItemSkin";

        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);


    }

    public dataChanged(): void {


        if (this.data) {
            if (this.data.itemConfig.name) {
                this.nameLabel.text = this.data.itemConfig.name
                this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality]
            }
            this.itemIcon.setDataByConfig(this.data.itemConfig);
            this.itemIcon.isShowName(false)
            this.itemIcon.setItemCount(false)
            
            let arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID]
            if (arrCon.attars) {
                this.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(arrCon.attars)
                if (arrCon.attars[0]) {
                    this.lbInfo0.text = AttributeData.getAttStrByType(arrCon.attars[0], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo0.text = ""
                }
                if (arrCon.attars[1]) {
                    this.lbInfo1.text = AttributeData.getAttStrByType(arrCon.attars[1], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo1.text = ""
                }

            }
            else {
                this.lbFight.text = ""
                this.lbInfo0.text = arrCon.skillName || ""
                this.lbInfo1.text = arrCon.desc || ""
            }
        }



    }


    public onTap(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.buy:
                //装备命格
                GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_EQUIP_REWARD, this.data.configID)
                break;
        }
    }




}