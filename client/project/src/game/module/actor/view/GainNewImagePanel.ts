class GainNewImagePanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // GainNewImageSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected showPanel: PetShowPanel;
    protected ridePanel: RideShowPanel;
    protected extraPanel: PetShowPanel;
    protected imgXianw: eui.Image;
    protected soulPanel: PetShowPanel;
    protected showTianx: PetShowPanel;
    protected roleShowPanel: RoleShowPanel;
    protected btnEnter: eui.Button;
    protected imgPoint: eui.Image;
    protected group: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private mCount : number
    private mModel: UserTemplate

	public constructor() {
		super()
		this.skinName = "GainNewImageSkin"
		this.mCount = 5
		this._AddClick(this, this.CloseSelf)
		this._AddClick(this.btnEnter, this._onClick)
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		let level = this.mModel.mLevel

		let dressId = this.mModel.BaseConfig.pictureid[level - 1]
        this.SetMainShow(dressId)
        this.SetExtraShow(dressId)
        let eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, 0);
        eff.x = this.imgPoint.x;
        eff.y = this.imgPoint.y;
        eff.scaleX = 2.3
        eff.scaleY = 2.3
        this.group.addChild(eff)

		this.AddTimer(1000, 5, this._DoUpdate)
	}

	public OnClose() {
		
	}

	private _DoUpdate() {
		this.mCount--
		this.btnEnter.label = "确定("+ this.mCount.toString() +"s)"
		if (this.mCount == 0)
		{
			ViewManager.ins().close(this)
		}
	}

	private _onClick(e: egret.TouchEvent)
	{
		switch (e.currentTarget) {
			case this.btnEnter:
			ViewManager.ins().close(this)
			break
		}
	}

	private SetMainShow(dressId) 
    {
        let model = this.mModel 
        if (model.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(model.SkinConfig[dressId].pid)
            return
        }
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW)
        {
            let xianlvModel = GameGlobal.XianlvModel
            let battledXianlvId = xianlvModel.getBattledXianlv()
            if (battledXianlvId != 0)
            {
                let xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId)
                this.showPanel.SetBody(xianlvInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH)
        {
            let petModel = GameGlobal.PetModel
            let battledPetId = petModel.GetShowId()
            if (battledPetId != 0)
            {
                let petInfo = petModel.GetPetInfo(battledPetId)
                this.showPanel.SetBody(petInfo.GetSkin())
            }
            
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_WING)
        {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTianx(null)
            this.roleShowPanel.SetTitle(null)
            this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid))
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_TIANX) 
        {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTianx(null)
            this.roleShowPanel.SetTitle(null)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_SHENGB)
        {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTianx(null)
            this.roleShowPanel.SetTitle(null)
            this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid, role.job, role.sex, false, true))
            return
        }

        this.showPanel.SetBody(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid))
    }

    private SetExtraShow(dressId)
    {
        let model = this.mModel 
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_FZ)
        {
            let xianlvModel = GameGlobal.XianlvModel
            let battledXianlvId = xianlvModel.getBattledXianlv()
            if (battledXianlvId != 0)
            {
                let xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId)
                this.extraPanel.SetBody(xianlvInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW || model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ)
        {
            let sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid)
            this.imgXianw.source = sourcePath.substring(sourcePath.lastIndexOf("/")+1)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_TONGL)
        {
            let petModel = GameGlobal.PetModel
            let battledPetId = petModel.GetShowId()
            if (battledPetId != 0)
            {
                let petInfo = petModel.GetPetInfo(battledPetId)
                this.extraPanel.SetBody(petInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH)
        {
            let sourcePath = AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid)
            this.soulPanel.SetBody(sourcePath)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_TIANX)
        {
            this.showTianx.SetBody(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid))
            return
        }
    }
}