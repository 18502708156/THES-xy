/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 法宝详情item
 * 
 **/


class TreasureShowItem extends eui.ItemRenderer {

    lbName: eui.Label;
    lbQuality: eui.Label;
    baseCricle: BaseCricleIcon;


	public static TREASURETYPE = {
		[0]: "普通",
		[1]: "精良",
		[2]: "稀有",
		[3]: "卓越",
		[4]: "完美",
		[5]: "传说",
		[6]: "传说",
	}

    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "TreasureRectIconSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)

    }
    
    public dataChanged():void{


        if(!this.data) return


        //圆形圆圈
        this.baseCricle.setData(this.data)

        if(this.data.name)
        {
            this.lbName.text = this.data.name
        }


        //级别
        
        if(this.data.quality!=null)
        {
            this.lbQuality.text = TreasureShowItem.TREASURETYPE[this.data.quality] 
            this.lbQuality.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
            this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
        }



 
        
    }

    private onClick()
    {
        ViewManager.ins().open(TreasureArrInfo,this.data,null,true)//隐藏按钮
    }


}