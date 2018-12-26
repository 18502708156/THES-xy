/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 师徒获得奖励item
 * 
 **/


class TeacherGetReItem extends eui.ItemRenderer {

    lbNe: eui.Label;
    lbVl: eui.Label;
    item: ItemBaseNotName;
    brnGet :eui.Button;
    brnGo :eui.Button;
    imgGet :eui.Image;


    public constructor() {
        super();
        // 皮肤名称
        
        this.skinName = "TeacherGetReItemSkin";

        // //点击响应
        this.brnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        this.brnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)



    }
    
    public dataChanged():void{


        if(!this.data) return
        if(!this.data.pupilreward) return


        if(this.data.taskname)
        {
            this.lbNe.text = this.data.taskname
        }

        //icon
        this.item.setItemData(this.data.pupilreward[0])
        this.item.isShowName(false)

        this.lbVl.text = this.data.num+ "/" + this.data.condition
        if(this.data.condition - this.data.num >0)//不可领取
        {
            this.brnGo.visible = true
            this.brnGet.visible = false
            this.imgGet.visible = false
            this.lbVl.textColor = Color.l_normal
        }
        else //可以领取
        {
             this.lbVl.textColor = Color.l_green_1
            if(this.data.bGet) //已经领取
            {
                this.brnGo.visible = false
                this.brnGet.visible = false
                this.imgGet.visible = true
            }
            else //未领取
            {
                this.brnGo.visible = false
                this.brnGet.visible = true
                this.imgGet.visible = false
            }
        }
    }

    public OnClick(e: egret.TouchEvent)
    {
            switch (e.target) {
				case this.brnGo:
					//前往
                    if(this.data.jump)
                    ViewManager.ins().Guide(this.data.jump,null);
				break
                case this.brnGet:
                    if(GameGlobal.TeacherController.getTeacherIdInFirst())
                    {
                         GameGlobal.TeacherManage.forceGetReward(GameGlobal.TeacherController.getTeacherIdInFirst(),this.data.actNo)
                    }
				break			
			}
    }


}