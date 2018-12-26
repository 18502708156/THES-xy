/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 16:21
 * @meaning: 答题结果界面
 * 
 **/

class AnswerResultLayer extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // AnswerResultSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected listView: eui.List;
    protected btnSure: eui.Button;
    protected lbSort: eui.BitmapLabel;//位图文本 名次
    protected lbScore: eui.Label;//

	
	tLayerData; //界面数据
	
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		
		this.skinName = "AnswerResultSkin"
		this.listView.itemRenderer = ItemBase;
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this._AddClick(this.btnSure,this.close)
		this.tLayerData = param[0] //
		this.updateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	public close()
	{
		ViewManager.ins().close(AnswerLayer); 
		ViewManager.ins().close(this); 
	}

	private updateContent() {
		if(!this.tLayerData) return

		this.lbSort.text = this.tLayerData.rankNo || 99
		let nScore = this.tLayerData.point || 0
        let strSkillLv =  `|C:0x682F00&T:今日成绩|C:0x369427&T:${nScore}|C:0x369427&T:分|`
        this.lbScore.textFlow =   TextFlowMaker.generateTextFlow(strSkillLv) //


		//奖励列表
		if(this.tLayerData.rewards &&this.tLayerData.rewards.length)
		{
			(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tLayerData.rewards);
		}

	}
	
}
