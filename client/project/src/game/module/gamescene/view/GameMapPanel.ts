class GameMapPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_GAME_MAP

    /////////////////////////////////////////////////////////////////////////////
    // GameMapSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected returnBtn: eui.Button;
    public helpBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    public mRaid: MapRaid

    private m_ChildView: {[key: number]: BaseView} = {}
    protected leaveDlgStr = "是要退出副本？";
    private mHelpId: number

	private m_IsUpdate = false
    private m_LastTime: number = 0

    private m_SelectView: GameMapEntitySelectView

    public mRebornView: CommonFuHuoWin

    private m_Pos: number

    public constructor() {
        super()
        this.skinName = "GameMapSkin"
        this.m_Pos = this.returnBtn.y
        this._AddClick(this.helpBtn, this._OnHelpClick)
    }

    public SetHelpId(helpId: number) {
        this.mHelpId = helpId
        if (!helpId) {
            this.helpBtn.visible = false
            return
        }
        this.helpBtn.visible = true
    }

    public OnOpen() {
        this.returnBtn.y = this.m_Pos
        this.AddClick(this.returnBtn, this._OnClick)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdateChatPos)
        this._UpdateChatPos()
    }

    public OnClose() {
        this.ClearSelect()
        this.StopUpdate()
        this.mRaid = null
        for (let key in this.m_ChildView) {
            let view = this.m_ChildView[key]
            DisplayUtils.removeFromParent(view)
            view.DoClose()
        }
        this.m_ChildView = {}
    }

    public ShowRebornView(time: number, yb: IRewardData, func: Function) {
        if (this.mRebornView) {
            this.mRebornView.SetData(time, yb, func)
            return
        }
        let index = this.getChildIndex(this.group)
        this.mRebornView = new CommonFuHuoWin
        this.addChildAt(this.mRebornView, index)
        this.mRebornView.SetData(time, yb, func)
    }

    public RemoveRebornView() {
        if (!this.mRebornView) {
            return
        }
        DisplayUtils.removeFromParent(this.mRebornView)
        this.mRebornView = null
    }
    
    public SetReturnBtn(y: number) {
        this.returnBtn.y = y
    }

    public _UpdateChatPos() {
        this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint)
        this.group.y = egret.$TempPoint.y
    }

    public AddChildBaseView(view: BaseView) {
        if (!view) {
            return
        }
        this.m_ChildView[view.hashCode] = view
        this.addChildAt(view, 0)
        view.percentWidth = 100
        view.percentHeight = 100
        view.DoOpen(null)
    }

    private _OnHelpClick() {
        if (this.mHelpId) {
            ViewManager.ins().open(ActivityDescPanel, this.mHelpId)
        }
    }

    private _OnClick() {
        this.OnClickExitRaid()
    }

    setOnLeaveDlgStr(str) {
        this.leaveDlgStr = str;
    }
    
    public OnClickExitRaid() {
        WarnWin.show(this.leaveDlgStr, function () {
            GameGlobal.CommonRaidModel.MapLeave()
        }, this);
    }

    public showReturnBtn(val: boolean) {
        this.group.visible = val
    }

    public SetSelect(handle: number): void {
        if (!handle) {
            this.ClearSelect()
            return
        }
        if (!this.m_SelectView) {
            this.m_SelectView = new GameMapEntitySelectView
            this.m_SelectView.addEventListener("ATK", this._OnAtk, this)
            this.m_SelectView.addEventListener("CANCEL", this._OnCancel, this)
        }
        this.addChildAt(this.m_SelectView, 0)
        this.m_SelectView.mHandle = handle
        this.StartUpdate()
    }

    public ClearSelectEntity(handle: number): void {
        if (this.m_SelectView && this.m_SelectView.mHandle == handle) {
            this.ClearSelect()
        }
    }

    public ClearSelect(): void {
        if (this.m_SelectView) {
            DisplayUtils.removeFromParent(this.m_SelectView)
            this.m_SelectView.mHandle = 0
        }
    }

    private _OnAtk() {
        if (!this.m_SelectView) {
            return
        }
        let handle = this.m_SelectView.mHandle
        if (!handle) {
            return
        }
        if (!this.mRaid) {
            return
        }
        this.mRaid.OnEntityClick(handle)
        this.ClearSelect()
    }

    private _OnCancel() {
        this.ClearSelect()
    }

	private StartUpdate() {
		if (this.m_IsUpdate) {
			return
		}
		this.m_IsUpdate = true
		this.m_LastTime = egret.getTimer()
		egret.startTick(this.Update, this)
	}

    private StopUpdate() {
        if (!this.m_IsUpdate) {
            return false
        }
        this.m_IsUpdate = false
        egret.stopTick(this.Update, this)
    }

	private Update(timeStamp: number): boolean {
        if (!this.mRaid) {
            return
        }
        if (!this.m_SelectView || !this.m_SelectView.mHandle) {
            this.StopUpdate()
        } else {
            let entity = this.mRaid.GetEntity(this.m_SelectView.mHandle)
            if (!entity) {
                this.ClearSelect()
                this.StopUpdate()
            } else {
                let pos = DisplayUtils.ConvertPos(entity, this) 
                this.m_SelectView.x = pos.x
                this.m_SelectView.y = pos.y
            }
        }
        return false
    }
}


class GameMapEntitySelectView extends egret.DisplayObjectContainer {

	public constructor() {
		super();
		this.Init()
	}

	private atk: eui.Image
	private quXiao: eui.Image
    
	public mHandle: number

	public Init() {
		this.atk = new eui.Image();
		this.atk.source = "ui_hddt_bt_tiaozhan";
		this.atk.x = -100;
		this.atk.y = -50;
		this.quXiao = new eui.Image();
		this.quXiao.source = "ui_hddt_bt_quxiao";
		this.quXiao.x = 0;
		this.quXiao.y = -50;
		this.addChild(this.atk);
		this.addChild(this.quXiao);
		this.atk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
		this.quXiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}

	OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.atk:
                this.dispatchEventWith("ATK")
				break
			case this.quXiao:
                this.dispatchEventWith("CANCEL")
				break 
		}
	}
}
