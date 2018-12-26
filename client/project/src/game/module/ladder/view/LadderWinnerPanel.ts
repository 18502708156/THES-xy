class LadderWinnerPanel extends BaseView {

	public static NAME = "跨服王者"

    /////////////////////////////////////////////////////////////////////////////
    // LadderWinnerSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected noneLabel: CmLabel;
    protected nameLabel: CmLabel;
    protected list: eui.List;
    protected goBtn: eui.Button;
    protected infoLabel: eui.Label;
    protected roleShowPanel: RoleShowPanel;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "LadderWinnerSkin"
		this.list.itemRenderer = ItemBaseNotName
	}

	public OnOpen() {
		let date = new Date(GameServer.serverTime * 1000)
		date.setDate(date.getDate() - DateUtils.GetDay(date))

		this.infoLabel.textFlow = TextFlowMaker.generateTextFlow(DateUtils.GetFormatSecond(date.getTime() * 0.001, DateUtils.TIME_FORMAT_14) + "|C:0xcd3d0b&T:登上王者宝座|")

		this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.KingSportsBaseConfig.worshipreward)
		GameGlobal.Ladder.SendGetWinnerInfo()

		this.AddClick(this.goBtn, this._OnClick)

		this.observe(MessageDef.LADDER_WINNER, this.UpdateContent)
		this.UpdateContent()
	}

	private _OnClick() {
		GameGlobal.Ladder.SendWorship()
	}

	private UpdateContent() {
		this.UpdateBtnState()
		this.noneLabel.visible = true
		this.infoLabel.visible = false
		this.nameLabel.visible= false
		let data = GameGlobal.Ladder.mWinnerRecords
		if (!data) {
			return
		}
		if (!data.shows) {
			return
		}
		this.noneLabel.visible = false
		this.infoLabel.visible = true
		this.nameLabel.visible= true
		this.nameLabel.text = GameString.GetSerAndName(data.shows.serverid, data.shows.name)
		let show = data.shows
		if (show) {
			this.roleShowPanel.SetShowImage({shows: show.shows, job: show.job, sex: show.sex})
		}
	}

	private UpdateBtnState() {
		let worship = GameGlobal.Ladder.mWinnerRecords ? GameGlobal.Ladder.mWinnerRecords.worship : true
		if (worship) {
			this.goBtn.enabled = false
			this.goBtn.label = "已膜拜"
		} else {
			this.goBtn.enabled = true
			this.goBtn.label = "膜拜"
		}
	}
}