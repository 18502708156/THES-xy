class WorldMapPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_FullScreen_Popup

	/////////////////////////////////////////////////////////////////////////////
    // WorldMapSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected list: eui.List;
	protected closeBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "WorldMapSkin"

		this._AddClick(this.closeBtn, this._onClick)
	}

    // 引导对象
    public GetGuideTarget() {
        return {
			[1]: (this.list.getChildAt(0) as any).getChildAt(1).getChildAt(1),
        }
    }

	public OnOpen(...param: any[]) {
		this.list.itemRenderer = WorldMapContent
		this.list.dataProvider = new eui.ArrayCollection([1])
		this.list.validateNow()

		this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateList)
		this.observe(MessageDef.WORLDMAP_LOCATETO, this.UpdateMapOffset)

		if (GameGlobal.GuideUtil.GuideId == 31)
		{
			GameGlobal.GuideUtil.OnTargetTap(31, 0)
		}
	}

	public UpdateMapOffset(idx) {
		let xoffset = (this.list.getChildAt(0) as any).getChildAt(1).getChildAt(idx).x - 280
		this.list.scrollH = Math.min(Math.max(xoffset, 0), 4000-StageUtils.WIDTH)
	}

	public OnClose() {
		
	}

	// public AddHand(index: number) {
		// let icon = ((this.list.getChildAt(0) as eui.Group).getChildAt(1) as eui.Group).getChildAt(index) as WorldMapIcon
		// let img = new eui.Image
	// }

	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}

	private _onClick(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(this)
				break
		}
	}
}



class WorldMapContent extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // WorldMapContentSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected itemGroup: eui.Group
	protected bgGroup: eui.Group
    /////////////////////////////////////////////////////////////////////////////
	private mCount : number

	public childrenCreated() {
		this.mCount = 6
		TimerManager.ins().doFrame(1, 6, this._DoUpdate, this)
		let iconArr = CommonUtils.GetArray(GameGlobal.Config.ChaptersMapConfig, "mapid")
		for (let i = 0; i < this.itemGroup.numChildren; i++) {
			let item = this.itemGroup.getChildAt(i) as WorldMapIcon
			if (iconArr[i])
				WorldMapIcon.bindClick(item, iconArr[i].mapid)
		}
	}

	public dataChanged() {
		let iconArr = CommonUtils.GetArray(GameGlobal.Config.ChaptersMapConfig, "mapid")
		for (let i = 0; i < this.itemGroup.numChildren; i++) {
			let item = this.itemGroup.getChildAt(i) as WorldMapIcon
			WorldMapIcon.setInfo(item, i, iconArr[i])
		}
	}

	private _DoUpdate()
	{
		if (this.mCount > 0 && this.$stage)
		{
			let imgBg = new CImage
			this.bgGroup.addChild(imgBg)
			let curIdx = (7 - this.mCount)
			imgBg.source = "map00" + curIdx.toString()
			imgBg.$setX((curIdx - 1) * StageUtils.WIDTH)
			imgBg.$setY(0)
		}	
		else
		{
			TimerManager.ins().remove(this._DoUpdate, this)
		}
		this.mCount--
	}
}

class WorldMapIcon extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
    // WorldMapIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected userGroup: eui.Group;
    protected nameGroup: eui.Group;
    protected iconName: eui.Label;
    protected clearanceTip: eui.Image;
    protected imgBox: eui.Image;
    protected redPoint: eui.Image;
	protected imgIcon: eui.Image;
	protected newGroup: eui.Group;
	protected imgArr: eui.Image;
	protected prize: eui.Group
    /////////////////////////////////////////////////////////////////////////////

	public static bindClick(comp, mapId)
	{
		comp.imgBox.name = mapId.toString()
		comp.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxClick, comp)

		comp.imgIcon.name = mapId.toString()
		comp.imgIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIconClick, comp)

		comp.addEventListener(egret.Event.REMOVED_FROM_STAGE, ()=>{
			egret.Tween.removeTweens(comp.prize)
			egret.Tween.removeTweens(comp.imgArr)
		}, this)
	}

	public static setInfo(comp: WorldMapIcon, index: number, config)
	{
		if (!config)
			return

		comp.iconName.text = config.name
		let curGuanqiaId = GameGlobal.UserFb.guanqiaID
		comp.clearanceTip.visible = config.cid < curGuanqiaId

		let curChapterId = GameGlobal.UserFb.chapterId
		let chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId]
		comp.userGroup.visible = chapterRewardConfig.mapid == config.mapid
		comp.imgIcon.source = config.icon
		comp.newGroup.visible = GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == config.mapid

		if (chapterRewardConfig.mapid == config.mapid)
		{
			GameGlobal.MessageCenter.dispatch(MessageDef.WORLDMAP_LOCATETO, index)
		}
		else if (GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == config.mapid)
		{
			let tw = egret.Tween.get(comp.imgArr, {loop:true})
			tw.to({y:32}, 500).to({y:52}, 500)
		}
        
		comp.imgBox.visible = WorldMapIcon.getChapterRewardId(config.mapid) != -1
		comp.redPoint.visible = comp.imgBox.visible
		if(comp.imgBox.visible){
	 		let tw = egret.Tween.get(comp.prize, {loop:true})
			tw.to({y:144}, 400, egret.Ease.sineIn).to({y:154}, 400, egret.Ease.sineIn)
		}
		else
		    egret.Tween.removeTweens(comp.prize);
	}

	public static getChapterRewardId(mapId)
	{
		let rewardList = GameGlobal.UserFb.chapterRewardList
		for (let rewardId of rewardList)
		{
			let chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[rewardId]
			if (chapterRewardConfig && chapterRewardConfig.mapid == mapId)
				return rewardId
		}

		return -1
	}

	public static onBoxClick(e: egret.TouchEvent)
	{
		let mapId = parseInt(e.currentTarget.name)
		let rewardId = WorldMapIcon.getChapterRewardId(mapId)
		if (rewardId == -1)
			return
		
		ViewManager.ins().open(ClearanceAwardPanel, mapId, rewardId)
	}

	public static onIconClick(e: egret.TouchEvent)
	{
		let mapId = parseInt(e.currentTarget.name)
		
		let curChapterId = GameGlobal.UserFb.chapterId
		let chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId]
		if (GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == mapId) {
			GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)
			ViewManager.ins().close(WorldMapPanel)
		} else {
			ViewManager.ins().open(WorldMapTipPanel, mapId)
		}
	}
}