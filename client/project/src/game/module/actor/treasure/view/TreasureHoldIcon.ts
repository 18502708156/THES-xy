
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 法宝详情item
 * 
 **/


class TreasureHoldIcon extends eui.ItemRenderer {


    imgCover :eui.Image//覆盖为开启在状态
    imgLock :eui.Image//
    imgSelect :eui.Image
    lbLv: eui.Label;
    lbName: eui.Label;
    baseCricle: BaseCricleIcon;


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "TreasureHoldIconSkin";
        this.currentState = "have"
    }

    public childrenCreated() {
        // //点击响应
        this.baseCricle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnThisClick, this)
        this.imgLock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}	


    
    public dataChanged():void{


        if(!this.data) return

        //是否显示有锁
        if(typeof(this.data.lock) ==="number")
        {
            if(this.data.lock ===1)
            {
                this.imgLock.source  = "ui_bt_suo"
            }
            else
            {
                this.imgLock.source  = "ui_bt_weisuo"
            }
        }
        else
        {

        }


        //圆形圆圈
        this.baseCricle.setData(this.data)

        if(this.data.name)
        {
            this.lbName.text = this.data.name
        }

        if(this.data.quality)
        {
            this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality]
        }
        
        //等级
        if(typeof(this.data.level) ==="number")
        {
            this.lbLv.text  = this.data.level
        }
        else
        {

        }


        
    }

    public OnClick(e: egret.TouchEvent)
    {

		switch (e.target) {
				case this.imgLock:
                    let lock = 1
                    if(this.data.lock ===1)
                    {
                        lock = 0
                    }
                    GameGlobal.TreasureModel.sendSpellsResLock(lock,this.data.spellsId)
				break
				case this.baseCricle:
					// ViewManager.ins().open(TreasureShowWin)
				break

			}

    }
    public OnThisClick(e: egret.TouchEvent)
    {
        ViewManager.ins().open(TreasureArrInfo,this.data,this.data.nPos,false,GameLogic.ins().actorModel.name)
    }
    


}

