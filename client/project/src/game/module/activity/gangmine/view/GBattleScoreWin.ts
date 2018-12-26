class GBattleScoreWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GBattleScoreListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg:CommonWindowBg;
	protected list:eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GBattleScoreListSkin"
		this.commonWindowBg.SetTitle("积分奖励")
	}

	public childrenCreated() {
		this.list.itemRenderer = GBattleScoreItem
		this.UpdateContent()
	}

	public OnOpen(...args) {
		this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private UpdateContent() {
		let scoreList = GangBattleConst.GetScoreList()
		let getWeight = function (config) {
			let confId = config.id
			if (GameGlobal.GangBattleModel.HasScoreRewardGain(confId)) {
				return confId + 1000
			}

			if (GameGlobal.GangBattleModel.CanScoreRewardGain(confId)) {
				return confId - 1000
			}
	
			return confId
		}
		scoreList.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(scoreList)
	}

}

class GBattleScoreItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GBattleScoreItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labText: eui.Label;
	protected imgGained: eui.Image;
	protected btnGain: eui.Button;
	protected labScore: eui.Label;
	protected labUndone: eui.Label;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.list.itemRenderer = ItemBase
		this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let config = this.data

		this.list.dataProvider = new eui.ArrayCollection(config.showitem)

		this.imgGained.visible = GameGlobal.GangBattleModel.HasScoreRewardGain(config.id)
		this.labUndone.visible = !GameGlobal.GangBattleModel.CanScoreRewardGain(config.id)
		this.btnGain.visible = !this.imgGained.visible && !this.labUndone.visible
		let text = `|C:0x019704&T:【积分礼包】|C:0x6e330b&T:(积分达到${config.needpoints}可领取)|`
		this.labText.textFlow = TextFlowMaker.generateTextFlow(text)
		let gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo
        let curScore = gbPlayerGlobalInfo.mScore

		let scoreText = ""
		if (curScore >= config.needpoints)
		{
			scoreText = `|C:0x019704&T:${curScore}`
		}
		else
		{
			scoreText = `|C:0xdb0000&T:${curScore}`
		}
		this.labScore.textFlow = TextFlowMaker.generateTextFlow(`${scoreText}|C:0x6e330b&T:/${config.needpoints}|`)
	}

	private _OnBtnClick(e: egret.TouchEvent) {
		GameGlobal.GangBattleModel.SendGainScoreAward(this.data.id)
	}
}