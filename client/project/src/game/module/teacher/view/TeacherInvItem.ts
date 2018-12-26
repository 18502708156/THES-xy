/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 21:51
 * @meaning: 师徒邀请列表详情item
 * 
 **/


class TeacherInvItem extends eui.ItemRenderer {


    imgBg :eui.Image
    lbNe: eui.Label;
    lbLv: eui.Label;
    lbInv: eui.Label;
    brnAg :eui.Button
    btnRefuse :eui.Button
    brnMo :eui.Button



    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "TeacherInvItemSkin";

        // //点击响应
        this.brnAg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        this.btnRefuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        this.brnMo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
    }
    
    public dataChanged():void{


        if(!this.data) return


        //用于背景图横条显示
        this.imgBg.visible = this.data.index%2 ? true :false


        //判断是否为 收徒 / 接受师傅
        if(this.data.type===1) //收徒模式
        {
           this.lbNe.text = this.data.name 
           this.lbLv.text = this.data.lv + "级"
           this.brnAg.visible = false
           this.btnRefuse.visible = false
           this.brnMo.visible = !this.data.tag
           this.lbInv.visible = this.data.tag
        }
        else
        {
             this.lbInv.visible = false
             this.brnAg.visible = true
             this.btnRefuse.visible = true
             this.lbNe.text = "【" + this.data.name  + "】"
             this.lbLv.text = "向您发出师徒邀请"
             this.brnMo.visible = false
        }
        
    }

    public OnClick(e: egret.TouchEvent)
    {
        if(this.data.dbid)
        {
            switch (e.target) {
                    case this.brnAg: //同意
                        GameGlobal.TeacherManage.applyConfirm(this.data.dbid,true)
                    break
                    case this.btnRefuse: //拒绝
                        GameGlobal.TeacherManage.applyConfirm(this.data.dbid,false)
                    break	
                    case this.brnMo://收徒
                        let cost = GlobalConfig.ins().MasterBaseConfig.cost //收徒花费
                        let lvlimit =  GlobalConfig.ins().MasterBaseConfig.lvlimit ||0 //大于等级限制
                        // 收徒判断
                        let myLv = GameGlobal.actorModel.level ||0
                        if(myLv -this.data.lv >= lvlimit)
                        {
                            if(cost&&Checker.CheckDatas(cost,false))
                            {
                                GameGlobal.TeacherManage.applyTeacher(this.data.dbid)
                            }
                        }
                        else
                        {
                            UserTips.ins().showTips("师傅必须比徒弟等级>=" + lvlimit +"级方可收徒")
                        }

                    break	
                }
                GameGlobal.TeacherManage.getMessage()//重新获取
        }
    }


}