/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 14:51
 * @meaning: 标题
 * 
 **/


class ShopEqTitle extends eui.ItemRenderer {


    imgBg: eui.Image;
    lbNe: eui.Label;


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "ShopEquipTitleSkin";
    }
    
    public dataChanged():void{
        this.lbNe.text = this.data.strName
    }


}