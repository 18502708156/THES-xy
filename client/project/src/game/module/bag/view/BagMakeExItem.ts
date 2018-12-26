/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:51
 * @meaning: 熔炼额外item
 * 
 **/


class BagMakeExItem extends eui.ItemRenderer {

    nameLabel: eui.Label;
    lbPower: eui.Label;
    itemIcon: ItemIcon
    private checkBox: eui.CheckBox;
    group: eui.Group;

    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "BagMakeExItemSkin";

        //点击响应
        this.group.touchChildren = false;
        this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)



    }

    public dataChanged(): void {
        if (!this.data) return
        if (this.data.itemConfig && this.data.itemConfig.name) {
            this.nameLabel.text = this.data.itemConfig.name
            this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality]
            this.itemIcon.setData(this.data.itemConfig)

            let equipConfig = GlobalConfig.ins().EquipConfig[this.data.itemConfig.id];
            this.lbPower.text = "战力: " + ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
        }
    }



    public OnClick(e: egret.TouchEvent) {
        this.checkBox.selected = !this.checkBox.selected
        this.data.select = this.checkBox.selected
    }


}