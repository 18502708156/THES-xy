/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/6 14:21
 * @meaning: 选择提示界面
 * 
 **/

class TipByBox extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // TipByboxSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected sureBtn: eui.Button;
    protected notBtn: eui.Button;
    protected bg: eui.Image;
    protected warnLabel: eui.Label;
    protected lbBoxTip: eui.Label;
    protected checkBox1: eui.CheckBox;
    
    /////////////////////////////////////////////////////////////////////////////


    bSelect ;//是否勾选当前框
    callback: Function
    sure: boolean = false

    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		
		this.skinName = "TipByboxSkin"
	}
    //0列表数据 1控制勾选框的布尔值  2标题
	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.AddClick(this.sureBtn,this.OnSure)
		this.AddClick(this.notBtn,this.CloseSelf)
		this.AddClick(this.checkBox1,this.OnCheckBox)
		this.warnLabel.text = param[0] || "您选择分解的命格中存在高品质命格，是否确认分解？"
        this.bSelect =  param[1]
        this.checkBox1.selected = !this.bSelect
        this.commonDialog.title = param[2] || "提 示" //标题
        this.lbBoxTip.text = param[3] || "本次登录不再提示" //标题

        this.callback = param[4]
		// this.updateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
        if (this.callback) {
            this.callback(this.sure)
        }
        this.callback = null
	}

    private OnSure() {
        this.sure = true
        this.CloseSelf()
    }

    private OnCheckBox() {
        this.bSelect = !this.checkBox1.selected
        //暂时无法通用
        GameGlobal.DestinyController.bShowResolveTip = this.bSelect
    }

	private updateContent() {
	}
	
}
