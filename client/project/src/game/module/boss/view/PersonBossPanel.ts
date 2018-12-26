class PersonBossPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "个人BOSS"

    /////////////////////////////////////////////////////////////////////////////
    // PersonBossSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	// 引导对象
	public GetGuideTarget() {
		this.list.validateNow()
		return {
			[1]: this.list.getElementAt(0) ? (this.list.getElementAt(0) as PersonBossItem).goBtn : null,
		}
	}

	public constructor() {
		super()
		this.skinName = "PersonBossSkin"
		this.list.itemRenderer = PersonBossItem
		this.list.dataProvider =  new eui.ArrayCollection([])
	}

	public OnOpen() {
		this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateContent)
		// GameGlobal.BossModel.sendCallPersonBossList();
		this.UpdateContent();
	}

	public OnClose() {
		this.removeObserve();
	}

	public UpdateContent() {
		let list = GameGlobal.UserFb.getPersonBoss();
		let arr = [];
		let i:number;
		let len:number = list.length;
		for( i = 0 ; i < len ;i ++ )
		{
			arr.push(list[i]);
			if (GameGlobal.actorModel.level < list[i].levelLimit)
			{
				break;
			}
		}
		SortTools.sortMap(arr,'personBossWeight',true);
		(this.list.dataProvider as eui.ArrayCollection).replaceAll(arr);
		
	}
}

class PersonBossItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // PersonBossItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bossName: eui.Label;
    protected times_txt: eui.Label;
    protected enterInfoLabel: eui.Label;
    public goBtn: eui.Button;
    protected dieImg: eui.Image;
    protected petShowPanel: PetShowPanel;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		// this.bar.labelFunction = function(cur, max) {
		// 	return Math.floor(cur * 100 / max) + "%"
		// }
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.list.itemRenderer = ItemBaseNotName
	}

	private _OnClick() {
		if (!UserFb.FinishAndCheckFighting()) {
			return
		}
		GameGlobal.UserFb.sendfbJoin(1,this.data.fbID)
	}

	public dataChanged() {
		let data:FbModel = <FbModel>this.data
		let config = GameGlobal.Config.DailyFubenConfig[data.fbID]

		if (config.bossid)
		{
			let monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
			this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" +  monsterCfg[GameGlobal.Config.MonstersConfig_keys.level]+"级)"
			this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));
		}	
		let mycount = config.freeCount + data.vipBuyCount - data.useCount;
		if (GameGlobal.actorModel.level >= data.levelLimit) {
			this.goBtn.visible = true
			this.enterInfoLabel.visible = false

			let isDie = false
			if (data.useCount > 0) isDie = true;
			this.dieImg.visible = isDie;
			this.goBtn.visible = !isDie;
			this.goBtn.label = data.totalCount < config.needsuccess ? "挑 战" : "免费扫荡";

		} else {
			this.goBtn.visible = false
			this.enterInfoLabel.visible = true
			this.enterInfoLabel.text = "主角" + config.levelLimit + "级可进入"
			this.dieImg.visible = false;
		}
		this.times_txt.text = "剩余挑战：" + mycount;
		this.list.dataProvider =new eui.ArrayCollection(config.showItem)
		UIHelper.ShowRedPoint(this.goBtn, mycount > 0)
	}
}