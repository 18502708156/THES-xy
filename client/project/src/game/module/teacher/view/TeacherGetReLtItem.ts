/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 师徒获得奖励item (仅奖励)
 * 
 **/


class TeacherGetReLtItem extends eui.ItemRenderer {

    lbNe: eui.Label;
    lbVl: eui.Label;
    item: ItemBaseNotName;


    public constructor() {
        super();
        // 皮肤名称
        
        this.skinName = "TeacherShowReItemSkin";

    }
    
    public dataChanged():void{


        if(!this.data) return
        if(!this.data.masterreward) return


        if(this.data.taskname)
        {
            this.lbNe.text = this.data.taskname
        }

        //icon
        this.item.setItemData(this.data.masterreward[0])
        this.item.isShowName(false)

        this.lbVl.text = this.data.num+ "/" + this.data.condition
        if(this.data.condition - this.data.num >0)//不可领取
        {
            this.lbVl.textColor = Color.l_normal
        }
        else //可以领取
        {
             this.lbVl.textColor = Color.l_green_1
        }
    }



}