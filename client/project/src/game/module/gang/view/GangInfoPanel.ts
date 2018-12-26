class GangInfoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "帮会大厅"

    /////////////////////////////////////////////////////////////////////////////
    // GangInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labAbbreviated: eui.Label;
    protected labGangName: eui.Label;
    protected btnRename: eui.Button;
    protected labRoleName: eui.Label;
    protected labMemberCount: eui.Label;
    protected imgRecruit: eui.Image;
    protected labCapital: eui.Label;
    protected labGangLevel: eui.Label;
    protected labRecord: eui.Label;
    protected btnMember: eui.Button;
    protected btnDonation: eui.Button;
    protected btnList: eui.Button;
    protected btnApplyList: eui.Button;
    protected iconList:eui.List
    protected labText: eui.Label;
    protected labModify: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    private iconBindList = [{"id":1,"icon":"ui_bh_bt_shouhu"},
                            {"id":2,"icon":"ui_bh_bt_shangdian"},
                            {"id":3,"icon":"ui_bh_bt_ditu"},
                            {"id":4,"icon":"ui_bh_bt_boss"},
                            {"id":5,"icon":"ui_bh_bt_bangzhan"}]
	public constructor() {
		super()

	}

    public childrenCreated() {
        this._AddClick(this.btnRename, this._OnClick)
        this._AddClick(this.imgRecruit, this._OnClick)
        this._AddClick(this.labRecord, this._OnClick)
        this._AddClick(this.btnMember, this._OnClick)
        this._AddClick(this.btnDonation, this._OnClick)
        this._AddClick(this.btnList, this._OnClick)
        this._AddClick(this.btnApplyList, this._OnClick)
        this._AddItemClick(this.iconList, this.itemClick)
        this._AddClick(this.labModify, this._OnClick)
        this.iconList.itemRenderer = GangButtonItem;
        this.iconList.dataProvider = new eui.ArrayCollection(this.iconBindList);
        
        GameGlobal.GangModel.SendGetGangBaseInfo()
        GameGlobal.GangModel.SendGetPlayerInfo()
        this.labRecord.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>"+ "帮会记录" +"</u></font>")
        this.labModify.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>"+ "修改公告" +"</u></font>")
        this.UpdateContent()
    }

	public UpdateContent() {
        let myGangInfo = GameGlobal.GangModel.myGangInfo
        this.labAbbreviated.text = myGangInfo.mGangName.substr(0, 1)
        this.labGangName.text = myGangInfo.mGangName
        this.labRoleName.text = myGangInfo.mGangMasterName
        this.labMemberCount.text = `${myGangInfo.mMemberCount}/${GangConst.GetMaxMemberCount(myGangInfo.mLevel)}`
        this.labCapital.text = `${myGangInfo.mCapital}/${GangConst.GetMaxCapital(myGangInfo.mLevel)}`
        this.labGangLevel.text = myGangInfo.mLevel.toString()
        this.labText.text = myGangInfo.mNotice
	}

	public OnOpen() {
        this.observe(MessageDef.GANG_UPDATE_BASE_INFO, this.UpdateContent)
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateRedPoint)
        this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, this.UpdateRedPoint)
        this.observe(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT, this.UpdateRedPoint)
        this.observe(MessageDef.GANGBATTLE_OPEN_GATEVIEW, this._DoOpenGBattleView)
        this.observe(MessageDef.GANG_ALL_NOTICE, this._UpdateList)
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this._UpdateList)
        this.observe(MessageDef.GANGBOSS_UPDATE_INFO, this._UpdateList)
        this.observe(MessageDef.ACTIVITY_LIST_INFO, this._UpdateList)
        this.UpdateRedPoint()
	}

	public OnClose() {
        
	}

    private _UpdateList() {
        UIHelper.ListRefresh(this.iconList)
    }

    private UpdateRedPoint() {
        UIHelper.ShowRedPoint(this.btnDonation, GameGlobal.GangModel.HasContributeAward())
        UIHelper.ShowRedPoint(this.btnApplyList, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.VIEW_APPILICANT))
    }

    private itemClick(e:eui.ItemTapEvent)
    {
        if(e.itemIndex == 0)
        {
            ViewManager.ins().open(GangProtectorMainWin)
        }else if(e.itemIndex == 1)
        {
            ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BLACK])
        }
        else if(e.itemIndex == 2)
        {
            if (!UserFb.CheckFighting())
                return
                
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid)
            ViewManager.ins().close(GangMainWin)
        }
        else if(e.itemIndex == 3)
        {
            ViewManager.ins().open(GangBossPanel)
        }
        else if(e.itemIndex == 4)
        {
            if (!Deblocking.Check(DeblockingType.TYPE_56))
					return
					
            GameGlobal.GangBattleModel.SendEnterBattle()
        }
    }

    private _DoOpenGBattleView() {
        ViewManager.ins().close(GangMainWin)
	}

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnRename:
                this.HandleRename()
            break
            case this.imgRecruit:
                this.HandleRecruit()
            break
            case this.labRecord:
                ViewManager.ins().open(GangRecordListWin)
            break
            case this.btnMember:
                ViewManager.ins().open(GangMemberListWin)
            break
            case this.btnDonation:
                ViewManager.ins().open(GangJuanXianListWin)
            break
            case this.btnList:
                ViewManager.ins().open(GangListWin)
            break
            case this.btnApplyList:
                this.HandleApplyList()
            break
            case this.labModify:
                this.HandleModify()
            break
        }
    }

    private HandleRecruit() {
        let myGangInfo = GameGlobal.GangModel.myGangInfo
        if (myGangInfo.mOffice != GangConst.MEMBER_OFFICE)
            GameGlobal.GangModel.SendRecruitMember()
        else
            UserTips.ins().showTips("你没有招收权限")
    }

    private HandleApplyList() {
        let myGangInfo = GameGlobal.GangModel.myGangInfo
        if (GangConst.GetAuditingRight(myGangInfo.mOffice))
            ViewManager.ins().open(GangApplyListWin)
        else
            UserTips.ins().showTips("你没有审核权限")
    }

    private HandleModify() {
        let myGangInfo = GameGlobal.GangModel.myGangInfo
        if (GangConst.GetModifyNoticeRight(myGangInfo.mOffice))
            ViewManager.ins().open(GangModifyNoticeView)
        else
            UserTips.ins().showTips("你没有修改公告权限")
    }

    private HandleRename() {
        let myGangInfo = GameGlobal.GangModel.myGangInfo
        if (myGangInfo.mOffice != GangConst.MASTER_OFFICE)
        {
            UserTips.ins().showTips("你没有这个权限")
            return
        }

        ViewManager.ins().open(GangChangeNameView)
    }
}

class GangButtonItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangIconBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labelDisplay: eui.Label;
    protected iconDisplay: eui.Image;
    protected redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
	public childrenCreated() {
	}

	public dataChanged() {
		this.iconDisplay.source = this.data.icon;
        this.UpdateRedPoint()
	}

    private UpdateRedPoint() {
        if (this.data.id == 1) //守护
        {
            this.redPoint.visible = GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE) 
                                    || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD)
        }
        else if (this.data.id == 2) //商店
        {
            
        }
        else if (this.data.id == 3) //地图
        {
            this.redPoint.visible = GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_MAP_ASSEMBLED) 
                                    || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_EXCHANGE)
        }
        else if (this.data.id == 4) //帮会BOSS
        {
            this.redPoint.visible = GameGlobal.GangBossModel.IsGangBossAct()
        }
        else if (this.data.id == 5) //帮战
        {
            this.redPoint.visible = GameGlobal.GangModel.IsGangBattleOpen()
        }
    }
}
