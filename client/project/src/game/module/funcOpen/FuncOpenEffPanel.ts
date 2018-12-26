class FuncOpenEffPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // FuncOpenEffSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected effGroup: eui.Group;
    protected effGroup2: eui.Group;
    protected tip1Img: eui.Image;
    protected tip2Img: eui.Image;
    protected tip3Img: eui.Image;
    protected goBtn: eui.Button;
    protected roleShowPanel: RoleShowPanel;
    /////////////////////////////////////////////////////////////////////////////
    
    
    private m_Type: number

    private static _NEED_OPEN_ID
    public static setOpenId(value):void
    {
        this._NEED_OPEN_ID = value;
        this.checkNeedOpen()
    }
    public static checkNeedOpen():void
    {
        // if(this._NEED_OPEN_ID)
        // {
        //     if (!GameMap.IsNoramlLevel()) {
        //         return
        //     }
        //     ViewManager.ins().open(FuncOpenEffPanel, this._NEED_OPEN_ID)
        //     this._NEED_OPEN_ID = null
        // }
    }

    public constructor() {
        super()
        this.skinName = "FuncOpenEffSkin"
        this._AddClick(this.goBtn, this._OnClick)
        let eff = new MovieObject
        eff.LoadByUrl(ResDataPath.GetUIEffePath("eff_ui_hyui_001"))
        this.effGroup.addChild(eff)
    }

    public OnOpen(...param: any[]): void {
        
    let RES_LIST = {
        // [1]: ["ui_xgnkq_pllll", "ui_xgnkq_ll", "ui_xgnkq_kqhy", 1/*ResDataPath.GetShinvShowPath(1)*/], // 侍女
        // [2]: ["ui_xgnkq_lssss", "ui_xgnkq_yjpf", "ui_xgnkq_kqpf", ResDataPath.GetRoleShowPath(GlobalConfig.ins().WingLevelConfig[0].appearance)], // 披风
        // //[3]: ["ui_xgnkq_szzzzz", "ui_xgnkq_sblx", "ui_xgnkq_kqsb", ResDataPath.GetUIEffePath2(ArtifactWin.ID_TO_EFFE[101])], // 神兵
        // [3]: ["ui_xgnkq_xsssss", "ui_xgnkq_qlyf", "ui_xgnkq_kqfb", ResDataPath.GetUIEffePath2(`eff_ui_rings_001}`)], // 法宝
        // [4]: ["ui_xgnkq_zhm", "ui_xgnkq_sj", "ui_xgnkq_kqsj", ResDataPath.GetRoleShowPath(GlobalConfig.ins().ShenJianLevelConfig[0].appearance) + "_0_c"], // 神剑
        // [5]: ["ui_xgnkq_zlyxxxxxx", "", "ui_xgnkq_kqcw", 900004], // 宠物
    }
        this.m_Type = param[0]
        let data = RES_LIST[param[0]]
        this.tip1Img.source = data[0]
        this.tip2Img.source = data[1]
        this.tip3Img.source = data[2]
        if(typeof(data[3]) == 'number')
        {
            // if(this.m_Type == 1)
            // {
            //     this.roleShowPanel.SetShinv(data[3])
            // }else if(this.m_Type == 5)
            // {
            //     this.roleShowPanel.SetPet(data[3])
            // }
        }else
        {
            let mv = new MovieObject
            mv.LoadByUrl(data[3])
            this.effGroup2.addChild(mv)
        }
        if (param[0] == 3) {
            this.effGroup2.y = 480
        }else if(param[0] == 4)
        {
            this.effGroup2.horizontalCenter = 100
            this.effGroup2.y = 540
        }
        this.AddTimer(5000, 1, this._OnClick)
    }

    public OnClose(): void {
        TimerManager.ins().removeAll(this)
        if (this.m_Type == 4) {
            ViewManager.ins().open(RoleWin,2);
        }else if(this.m_Type == 2)
        {
            ViewManager.ins().open(RoleWin,1);
        }

        egret.setTimeout(() => {
            let view = ViewManager.ins().getView(PlayFunView) as PlayFunView
            if (view && view.isShow()) {
                // view.upDateTaskGuild()
            }
        }, this, 500)
    }

    public _OnClick(): void {
        this.CloseSelf()
    }
}
