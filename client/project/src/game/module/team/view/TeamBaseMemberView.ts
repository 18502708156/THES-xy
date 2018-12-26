class TeamBaseMemberView extends BaseView {

	public static LABEL = {
		CREATE_ROOM: "创建房间",
		EXIT_ROOM: "退出房间",
		START_CHALLENGE: "开始挑战",
		QUICK_JOIN: "快速加入",
		FULL_OPEN1: "满员自动开启副本",
		FULL_OPEN2: "秒自动开启副本",
		FULL_OPEN3: "秒自动加入队伍",
	}

    /////////////////////////////////////////////////////////////////////////////
    // TeamBaseMemberSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected teamInfoGroup: eui.Group;
    protected noneLabel: eui.Label;
    protected myTeamList: eui.List;
    protected teamList: eui.List;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected checkBox1: eui.CheckBox;
    protected count_label: eui.Label;
    protected checkBox0: eui.CheckBox;
    protected noneInfoLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    
	// 是否显示自动快速加入
	public mNotAutoJoint: boolean = false

    public mModel: TeamBaseModel
    protected mTime: TeamTime = new TeamTime(10, 50)
    // protected m_ConfigData: any
	protected m_ConfigKey: number

	// 上次请求间隔时间
	private m_PreRepTime: number = 0

	public constructor() {
		super()
	}

    public SetTime(t1: number, t2: number) {
        this.mTime = new TeamTime(t1, t2)
        this.mTime.Reset()
    }

	public childrenCreated() {
		if (this.count_label) {
			this.count_label.text = ""
		}
        
		this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
        this._AddChange(this.checkBox0, this._OnClick)
        this._AddChange(this.checkBox1, this._OnClick)


        this.myTeamList.itemRenderer = TeamMemberItem
        this.myTeamList.dataProvider = new eui.ArrayCollection

        this.teamList.itemRenderer = TeamDataItem
        this.teamList.dataProvider = new eui.ArrayCollection
	}

    public OnOpen() {
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent)
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.UpdateContent)
		
        this.mModel.SendGetMyTeamInfos()
		this.AddLoopTimer(1000, this.UpdateTime)
		if (this.mNotAutoJoint) {
			this.checkBox1.selected = false
			this.checkBox1.visible = false
		} else {
			this.checkBox1.selected = true
			this.checkBox1.visible = true
		}
    }

	public OnResume() {
		if (this.mTime) {
			this.mTime.Reset()
		}
	}

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnCulture:
				if (!UserFb.CheckActMap()) {
					return
				}
				if (this.mModel.mTeamInfo.HasTeam()) {
					this.mModel.SendLeave(this.mModel.mTeamInfo.level)
				} else {
					// let data = this.m_ConfigData
					// let configData = this.mModel.GetConfigData(data)
					// this.mModel.SendCreateTeam(configData.GetKey())
					this.mModel.SendCreateTeam(this.m_ConfigKey)
				}
            break 
            case this.btnAuto:
				if (!UserFb.CheckActMap()) {
					return
				}
				let model = this.mModel
                if (model.mTeamInfo.HasTeam()) {
					if (model.mTeamInfo.IsMyTeam()) {
						this.SendBattle()
					} 
				} else {
					this.SendJoin()
				}
            break 
			case this.checkBox0:
				if (!this.checkBox0.selected) {
					this.mTime.ResetType(0)
					this.UpdateTime()
				}
			break
			case this.checkBox1:
				if (!this.checkBox1.selected) {
					// if (this.m_Model.mTeamInfo.HasTeam()) {

					// }
					this.mTime.ResetType(1)
					this.UpdateTime()
				}
			break
        }
    }

    public SetCountLabel(text: string) {
		if (!this.count_label) {
			return
		}
        this.count_label.text = text
    }

    public UpdateKey(data) {
        // this.m_ConfigData = data
		this.m_ConfigKey = data
		this.mModel.SendGetTeamList(this.m_ConfigKey);
		this.UpdateContent()
    }

    public UpdateContent() {
        this.noneLabel.visible = false
        this.myTeamList.visible = false
        this.teamList.visible = false
        let model = this.mModel
        if (model.mTeamInfo.HasTeam()) {
            this.myTeamList.visible = true
            let list = []
            let i = 0
            for (let data of model.mTeamInfo.members) {
                list.push({
                    mModel: model,
                    mInfo: model.mTeamInfo, 
                    mIndex: i++,
                })
            }
            this.myTeamList.dataProvider = new eui.ArrayCollection(list)

			//组队成功 去掉挂机战斗的自动挑战关卡BOSS
			GameGlobal.UserFb.mAuto = false
			GameGlobal.UserFb.sendSetAuto()
        } else {
            // let config = this.m_ConfigData
            // if (!config) {
            //     return
            // }
			if (egret.getTimer() - this.m_PreRepTime > 4000) {
				this.m_PreRepTime = egret.getTimer()
				this.mModel.SendGetTeamList(this.m_ConfigKey);
			}
			if (this.m_ConfigKey) {
				let teamList = model.mTeamList[this.m_ConfigKey]
				if (teamList && teamList.length) {
					this.teamList.visible = true
					let list = []
					for (let i = 0; i < 3; i++) {
						let data = teamList[i]
						if (!data) {
							break
						}
						list.push({
						mModel: model,
						mInfo: data, 
						config: this.m_ConfigKey
						})
					}
					this.teamList.dataProvider = new eui.ArrayCollection(list)
				} else {
					// this.mModel.SendGetTeamList(this.m_ConfigKey)
					this.noneLabel.visible = true
				}
			}
        }
		this.UpdateBtnState()
    }

    private UpdateBtnState() {
		let model = this.mModel
        if (model.mTeamInfo.HasTeam()) {
			this.btnCulture.label = TeamBaseMemberView.LABEL.EXIT_ROOM
            if (model.mTeamInfo.IsMyTeam()) {
				this.btnAuto.visible = true
				this.btnAuto.label = TeamBaseMemberView.LABEL.START_CHALLENGE
				if (!this.checkBox0.visible) {
					this.checkBox0.selected = true
                    this.checkBox1.selected = true	
					this.mTime.Reset()
				}
				this.checkBox0.visible = true
				this.checkBox1.visible = true
			} else {
				this.btnAuto.visible = false	
				this.checkBox0.visible = false
				this.checkBox1.visible = false
			}
        } else {
			this.btnCulture.label = TeamBaseMemberView.LABEL.CREATE_ROOM
			this.checkBox0.visible = false
			this.btnAuto.visible = true
			if (this.mNotAutoJoint) {
				this.checkBox1.visible = false
			} else {
				this.checkBox1.visible = true
			}
			this.btnAuto.label = TeamBaseMemberView.LABEL.QUICK_JOIN
            // let config = this.m_ConfigData
        }
		this.UpdateTime()
    }

	private UpdateTime() {
		if (!UserFb.CheckActMap(false)) {
			return
		}
		let model = this.mModel
        if (model.mTeamInfo.HasTeam()) {
            if (model.mTeamInfo.IsMyTeam()) {
				let isFull = model.mTeamInfo.IsFull()
				if (!isFull) {
					this.checkBox0.label = TeamBaseMemberView.LABEL.FULL_OPEN1
				} else {
					if (this.checkBox0.selected) {
						if (this.mTime.UpdateFull()) {
							this.SendBattle()
							this.checkBox0.selected = false
						}
						this.checkBox0.label = this.mTime.mFull + TeamBaseMemberView.LABEL.FULL_OPEN2
					} else {
						this.checkBox0.label = TeamBaseMemberView.LABEL.FULL_OPEN1
					}
				}
				if (this.checkBox1.selected && this.mTime.UpdateOpen()) {
					this.SendBattle()
					this.checkBox1.selected = false
				}
				this.checkBox1.label = this.mTime.mAutoOpen + TeamBaseMemberView.LABEL.FULL_OPEN2
			}
        } else {
            // 暂时注释进入检查
			// if (!this.IsNotEnter(this.m_Model.GetConfig()[this.m_CurIndex].id)) {
				if (this.checkBox1.visible && this.checkBox1.selected && this.mTime.UpdateJoin()) {
					this.SendJoin()
					this.checkBox1.selected = false
				}
				this.checkBox1.label = this.mTime.mJoin + TeamBaseMemberView.LABEL.FULL_OPEN3
			// }
		}
	}
    	
	private SendJoin() {
		if (!this.m_ConfigKey) {
			return
		}
		this.mModel.SendQuickJoin(this.m_ConfigKey)
		// let config = this.m_ConfigData
		// if (!config) {
		// 	return
		// }
		// let configData = this.mModel.GetConfigData(config)
		// this.mModel.SendQuickJoin(configData.GetKey())
	}

	public SendBattle() {
		this.mModel.SendFight(this.mModel.mTeamInfo.level)
	}
}


class TeamTime {
	public mFull: number = 0
	public mAutoOpen: number = 0
	public mJoin: number = 0

	private mJoinTime: number
	private mOpenTime: number

	private mGapTime: number = 0

	public constructor(joinTime: number, openTime: number) {
		this.mJoinTime = joinTime	
		this.mOpenTime = openTime
	}

	private GetGapTime(): number {
		if (!this.mGapTime)	{
			this.mGapTime = egret.getTimer()
			return 1
		}
		if (egret.getTimer() - this.mGapTime >= 500) {
			this.mGapTime = egret.getTimer()
			return 1
		}
		return 0
	}

	public UpdateFull(): boolean {
		this.mFull -= this.GetGapTime()
		if (this.mFull <= 0) {
			this.mFull = 5
			return true
		}
		return false
	}

	public UpdateJoin(): boolean {
		this.mJoin -= this.GetGapTime()
		if (this.mJoin <= 0) {
			this.mJoin = this.mJoinTime
			return true
		}
		return false
	}

	public UpdateOpen(): boolean {
		this.mAutoOpen -= this.GetGapTime()
		if (this.mAutoOpen <= 0) {
			this.mAutoOpen = this.mOpenTime
			return true
		}
		return false
	}

	public Reset() {
		this.mFull = 5
		this.mAutoOpen = this.mOpenTime
		this.mJoin = this.mJoinTime
	}

	public ResetType(type: number) {
		if (type == 0) {
			this.mFull = 5
		} else {
			this.mAutoOpen = this.mOpenTime
			this.mJoin = this.mJoinTime
		}
	}
}