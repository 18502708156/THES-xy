class XiandaoResultPanel extends BaseEuiView {
	
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoResultSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected retImg: eui.Image;
    protected head1: eui.Component;
    protected head2: eui.Component;
    protected levelLabel1: eui.Label;
    protected nameLabel1: eui.Label;
    protected nameLabel2: eui.Label;
    protected levelLabel2: eui.Label;
    protected ret1: eui.Image;
    protected ret2: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "XiandaoResultSkin"
	}

	public OnOpen(...param: any[]) {
		this.AddTimer(4000, 1, this.CloseSelf)
		let isWin = param[0]
        let roleData = param[1] as Sproto.qualifyingMgr_role_data[]
		this.retImg.source = isWin ? "ui_xdh_bm_shengli" : "ui_xdh_bm_shibai"

        this.Set(this.head1, this.levelLabel1, this.nameLabel1, this.ret1, 1, 0, roleData[0])
        this.Set(this.head2, this.levelLabel2, this.nameLabel2, this.ret2, 1, 0, roleData[1])
	}	
    
    private Set(head: eui.Component, levelLabel: eui.Label, nameLabel: eui.Label, ret: eui.Image, job: number, sex: number, roleData: Sproto.qualifyingMgr_role_data) {
        UIHelper.SetHead(head, job, sex, false)
        let point = ""
        if (roleData.addpoint != null) {
            point = "\n积分：+" + roleData.addpoint 
        }
        nameLabel.text = GameString.GetSerAndName(roleData.serverid, roleData.name) + point
        levelLabel.text = "Lv." + roleData.level
        ret.source = roleData.win ? "ui_xdh_bm_sheng" : "ui_xdh_bm_bai"
    }
}