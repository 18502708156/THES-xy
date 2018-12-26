class MainChapterInfoView extends BaseView implements eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
    // MainChapterInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected chapterInfo: eui.Group;
    protected imgMap: eui.Image;
    protected imgRed: eui.Image;
    protected lbMap: eui.Label;
    protected lbSeat: eui.Label;
    protected groupLine: eui.Group;
    protected labLinerNo: eui.Label;
    protected imgPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    public static readonly FIGHT_TYPE = 1
    public static readonly CITY_TYPE = 2

    private mType: number

	public constructor() {
		super()
	}

	public childrenCreated() {
        this.imgRed.visible = false

        this._AddClick(this.imgMap, this._Onclick)
        this._AddClick(this.groupLine, this._Onclick)
	}

    public OnOpen(...param) {
        this.mType = param[0]
        this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateContent)
        this.observe(MessageDef.MAIN_CITY_INFO, this.UpdateContent)
        this.UpdateContent()
    }

    public OnClose() {

    }

    public UpdateContent() {
        this.lbSeat.visible = this.mType != MainChapterInfoView.CITY_TYPE
        this.groupLine.visible = !this.lbSeat.visible

        let userFb = GameGlobal.UserFb
        this.lbMap.text = "第" + userFb.guanqiaID + "关"
        this.lbSeat.text = userFb.Desc

        this.imgRed.visible = GameGlobal.UserFb.chapterRewardList.length > 0

        if (this.mType == MainChapterInfoView.FIGHT_TYPE)
        {
            return
        }

        let info = GameGlobal.CommonRaidModel.mMainCityInfo
        if (!info) 
			return

        this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.people)
        this.labLinerNo.text = `${info.channelid || 0}线`
    }

    public _Onclick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
        case this.imgMap:
            ViewManager.ins().open(WorldMapPanel)
        break
        case this.groupLine:
            if (this.mType == MainChapterInfoView.FIGHT_TYPE)
                return

            ViewManager.ins().open(ChangeLinerWin)
        break
        }
    }
}