/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/5 18:21
 * @meaning: 传功界面
 * 
 **/

class TeacherSendWin extends BaseEuiView {

	//

	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // TeacherSendSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
	protected bar: eui.ProgressBar;
	protected roleShowPanelL: RoleShowPanel
	protected roleShowPanelR: RoleShowPanel

 	private m_EndTime = 400;
	private tLayerData; //界面数据
	private nType = 0; //0师傅,1学生
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TeacherSendSkin"

	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.tLayerData = param[0] //
		this.nType = param[1] //
		this.updateContent()
		this.AddTimer(10, 510, this.updateCloseBtnLabel);
		this.commonDialog.showReturnBtn(false)//隐藏返回按钮
		


		if(this.tLayerData.tShows)
		this.roleShowPanelL.SetShowImage(this.tLayerData.tShows);
		if(this.tLayerData.sShows)
		this.roleShowPanelR.SetShowImage(this.tLayerData.sShows);


		
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);
		
	}

	updateCloseBtnLabel() {
		this.m_EndTime--;
		let value = 100 - (this.m_EndTime/400 *100)
		this.bar.value = value


		if (this.m_EndTime <= 0)
		{
			this.nType ? GameGlobal.TeacherManage.teachExp(this.tLayerData.no) : GameGlobal.TeacherManage.getExp(this.tLayerData.no)
			ViewManager.ins().close(this);
		}
	};


	public close()
	{
		ViewManager.ins().close(AnswerLayer); 
		ViewManager.ins().close(this); 
	}

	private updateContent() {
	}
	
}
