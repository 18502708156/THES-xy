class TeamBasePanel extends BaseView implements ICommonWindowTitle {

	/////////////////////////////////////////////////////////////////////////////
    // TeamBaseSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    //protected petShowPanel: PetShowPanel;
    protected nameBg: eui.Image;
    //protected lbName: eui.Label;
    protected addPowerGroup: eui.Group;
    protected lbAlert: eui.Label;
    // protected btnPrev: eui.Button;
    // protected btnNext: eui.Button;
    protected title1Label: eui.Label;
    protected title2Label: eui.Label;
    // protected list1: eui.List;
    protected list2: eui.List;
    protected noneInfoLabel: eui.Label;
    protected teamBaseMemberView: TeamBaseMemberView;
    protected powerGroup: eui.Group;
    protected power_label: eui.Label;
    protected infoLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	protected teamCheckItemView:TeamCheckItemList;

    protected m_CurIndex: number = 0
    protected m_Model: CrossTeamBaseModel
	
    public constructor() {
        super()
		this.skinName = "TeamBaseSkin"
    }

    public childrenCreated() {
		this.teamBaseMemberView.mModel = this.m_Model
		this.teamCheckItemView.m_Model=this.m_Model;
		// this.teamBaseMemberView.mNotAutoJoint=true;

        // this._AddClick(this.btnPrev, this._OnClick)
        // this._AddClick(this.btnNext, this._OnClick)
		this._AddClick(this.teamCheckItemView,this._OnClick);
        
        // this.list1.itemRenderer = ItemBase;
        // this.list1.dataProvider = new eui.ArrayCollection([]);

        this.list2.itemRenderer = ItemBase;
        this.list2.dataProvider = new eui.ArrayCollection([]);
    }

    private mConfig: any

    public OnOpen(...param: any[]) {
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent)
		this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateList)
        this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateCurModel)
		this.InitInfo()

		
		this.teamBaseMemberView.DoOpen(null)
    }

	public OnClose() {
		this.teamBaseMemberView.DoClose()
	}

	public OnResume(...param: any[]) {
		this.teamBaseMemberView.OnResume()
		let curIndex = 0
		let selKey = param[0] || null
		if (!selKey) {
			if (this.m_Model.mTeamInfo.HasTeam()) {
				selKey = this.m_Model.mTeamInfo.level
			} else {
				if (this.m_Model.mSelectKey) {
					selKey = this.m_Model.mSelectKey
				}
				if (!selKey) {
					selKey = this.GetFirstShowKey()
				}
			}
		}
		if (selKey) {
			let i = 0
			for (let data of this.m_Model.GetConfig()) {
				let configData = this.m_Model.GetConfigData(data)	
				if (configData.GetKey() == selKey) {
					curIndex = i
					break
				}
				++i
			}
		}
		this.Listindex=curIndex;
		//if(this.m_Model.index!=-1)
			this.UpdateModel(curIndex)
	}

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            // case this.btnPrev:
            //     this.UpdateModel(this.m_CurIndex - 1)
            // break
            // case this.btnNext:
            //     this.UpdateModel(this.m_CurIndex + 1)
            // break 
			case this.teamCheckItemView:
				this.UpdateModel(this.m_Model.index);
				break;
        }
    }

	private UpdateCurModel() {
		this.UpdateModel(this.m_CurIndex)
	}
	private Listindex=0;
	private isShowList=true;
	private UpdateList():void
	{
		this.teamCheckItemView.showCheckItemList(this.Listindex)
	}

    private UpdateModel(index: number){
        let configList = this.m_Model.GetConfig()
		//
		this.teamCheckItemView.index=this.m_CurIndex;
		let configData = this.m_Model.GetConfigData(configList[index])
		
		if (!configData) {
			return
		}
        this.m_CurIndex = index
		// if(this.isShowList==true)
		// {
		// 	this.teamCheckItemView.showCheckItemList(this.m_Model,index)
		// 	this.isShowList=false;
		// }
		
		// if (this.m_Model.IsFirst(configData.GetKey())) {
		// 	this.title1Label.text = "首通奖励"
		// 	this.list1.dataProvider = new eui.ArrayCollection(configData.GetFirstDropShow())
		// } else {
		// 	this.title1Label.text = "通关奖励"
		// 	this.list1.dataProvider = new eui.ArrayCollection(configData.GetDropShow())
		// }
        this.list2.dataProvider = new eui.ArrayCollection(configData.GetShowItem())
		let suggest = configData.GetSuggest()
		if (suggest) {
			this.power_label.text = suggest + ""
		} else {
			this.powerGroup.visible = false
		}
		let bossId = configData.GetBossId()
		// this.petShowPanel.SetBodyId(MonstersConfig.GetAppId(bossId))
		
		// this.lbName.text = configData.GetUititle()//MonstersConfig.GetName(bossId)
		if(this.m_Model.mTeamInfo.HasTeam()==false)
		{
			this.lbAlert.text = configData.GetUititle();
		}
		
		let hasTeam = this.m_Model.mTeamInfo.HasTeam()
		let notEnter =this.m_Model.IsNotEnter(configData.GetKey());// this.IsNotEnter(configData.GetKey())
		let showTeam = hasTeam || !notEnter
		// this.teamInfoGroup.visible = showTeam
		this.teamBaseMemberView.visible = showTeam
		if (this.noneInfoLabel.visible = !showTeam) {
			this.noneInfoLabel.text = notEnter
		}
        // this.btnPrev.enabled = configList[index - 1] ? true : false
		// if (configList[index + 1])	{
		// 	this.btnNext.enabled = notEnter ? false : true
		// } else {
		// 	this.btnNext.enabled = false
		// }
		let data = this.m_Model.GetConfig()[this.m_CurIndex]
		this.teamBaseMemberView.UpdateKey(this.m_Model.GetConfigData(data).GetKey())
    }

	public UpdateContent() {
	}

	// protected IsNotEnter(id: number): string {
	// 	return ""
	// }

	protected InitInfo(): void {
	}

	protected GetFirstShowKey(): number {
		return null
	}
}
