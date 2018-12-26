/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/4 16:01
 * @meaning: 师徒师傅详情
 * 
 **/


//打造的信息框
class TeacherInfoItem extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // TeacherItemInfoSkin 
    /////////////////////////////////////////////////////////////////////////////


	private head: eui.Component;//头像
    private lbNe: eui.Label;
    private lbLv: eui.Label;
    private lbSt: eui.Label;
    private lbExp: eui.Label;
    private lbSw: eui.Label;//寻找仙缘
    private lbGo: eui.Label;
    private lbTime: eui.Label; //传功倒计时
    private imgExp: eui.Image;
	private btn: eui.Button;//传功
	private gTime: eui.Group;//出师倒计时文本组
	private gExp: eui.Group;//经验倒计时文本组
	private gNormal: eui.Group;//内容组
	private gLook: eui.Group;//没徒弟文本组
    protected lbType: eui.Label;
	



	
	
	private oData;//师徒数据
	private nType = 0; //0 师傅数据 1学生数据		


	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "TeacherItemInfoSkin";
        this._AddClick(this.lbSw, this.onClick)
		this._AddClick(this.lbGo, this.onClick)
        this._AddClick(this.btn, this.onClick)


		UIHelper.SetLinkStyleLabel(this.lbGo, "前往寻觅高徒") //下划线

	}


	public onUpdate(_type,_data): void {
		this.nType = _type ||0
		this.oData = _data 
		this.nType ?  this.updateSt() :this.updateTc()
	}

	private updateTc()//更新师傅数据
	{

		let data = this.oData
		//外观
		if(data.sShows&&data.sShows.shows)
		{
			UIHelper.SetHead(this.head, data.sShows.job,data.sShows.sex)
		}


		this.lbType.text = "师傅"

		this.gLook.visible = false
		this.btn.icon = "ui_st_bt_jieshouchuangong"
		this.lbNe.text = data.tName || ""
		this.lbLv.text = (data.tLv || "") + "级"
		if(data.tLogin)
		{
			this.lbSt.text = "在线" 
			this.lbSt.textColor = Color.l_green_1
		}
		else
		{
			this.lbSt.text = "离线" 
			this.lbSt.textColor = Color.RedColor
		}


		this.lbTime.text = "" //初始化天数

		//经验
		this.lbExp.text = this.getExp(1,GameGlobal.actorModel.level) + ""
		if(data.exp) //传功状态
		{
			this.btn.filters = null
			if(data.exp ===1)	//师傅已经传了,徒弟未领取
			{
				this.gTime.visible = false
				this.gExp.visible = true
				this.btn.visible = true
				
			}
			else //师傅已经传了,徒弟已领取
			{
				this.gTime.visible = true
				this.gExp.visible = false
				this.btn.visible = false
			}

			let day = GlobalConfig.ins().MasterBaseConfig.graduate -( data.day||1)
			if(day>0)
			{
				this.lbTime.text = day +  "天"
			}
			else
			{
				this.gTime.visible = false
			}
		}
		else //未传功
		{
			this.gExp.visible = true
			this.gTime.visible = false
			this.btn.visible = true
			this.btn.filters = Color.GetFilter();
		}
	


	}

	private updateSt() {
		if(this.oData)
		{
			if(this.oData.tShows&&this.oData.tShows.shows)
			{
				UIHelper.SetHead(this.head, this.oData.tShows.job,this.oData.tShows.sex)
			}
			this.gNormal.visible = true
			this.gLook.visible = false

			this.lbType.text = "徒弟"

			let data = this.oData
			this.lbNe.text = data.sName || ""
			this.lbLv.text = (data.sLv || "") + "级"
			if(data.sLogin)
			{
				this.lbSt.text = "在线" 
				this.lbSt.textColor = Color.l_green_1
			}
			else
			{
				this.lbSt.text = "离线" 
				this.lbSt.textColor = Color.RedColor
			}


			this.lbTime.text = "" //初始化天数

			//经验
			this.lbExp.text = this.getExp(2,GameGlobal.actorModel.level) + ""

			if(data.exp) //传功状态
			{
				if(data.exp ===1)	//师傅已经传了,徒弟未领取
				{
					this.gTime.visible = false
					this.gExp.visible = true
					this.btn.filters = Color.GetFilter();
				}
				else //师傅已经传了,徒弟已领取
				{
					this.gTime.visible = true
					this.gExp.visible = false
					this.btn.visible = false
				}

				let day = GlobalConfig.ins().MasterBaseConfig.graduate -( data.day||1)
				if(day>0)
				{
					this.lbTime.text = day +  "天"
				}
				else
				{
					this.gTime.visible = false
				}
			}
		}
		else
		{
			this.btn.visible = true
			this.gNormal.visible = false
			this.gLook.visible = true
			this.btn.filters = null
		}
	}
	

	private onClick(e: egret.TouchEvent)
	{
		switch (e.target) {
				case this.lbSw:
					 MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN,2);
				break
				case this.lbGo:
					 MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN,2);
				break
				case this.btn://传功/接受传功
					let bSend = false
					if(this.nType) //徒弟界面(第二个)
					{
						if(this.oData.exp)
						{
							UserTips.ins().showTips("已传功")
						}
						else
						{
							bSend = true
						}
					}
					else //师傅界面
					{
						if(this.oData.exp ===1)
						{
							bSend = true
						}
						else
						{
							UserTips.ins().showTips("等待传功")
						}
					}

					if(bSend)
					{
						ViewManager.ins().open(TeacherSendWin,this.oData,this.nType)
					}
				break
			}
	}
	//_type 师徒类型 1徒弟 ,2师傅
	private getExp(_type,_lv):number {
		let exp = 0
		if(_type&&_lv)
		{
			let list =  GlobalConfig.ins().ImpartExpConfig[_type]
			for (const item in list) {
				if(list[item].level)
				{
					let one = list[item].level[0] ||1
					let two = list[item].level[1] ||99999
					if(_lv>=one&&_lv<=two)
					{
						exp =  list[item].exp[0].count ||0
						break
					}
				}
			}
		}

		return exp;
	}



}

