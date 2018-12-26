class FieldBossPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "野外BOSS"
    /////////////////////////////////////////////////////////////////////////////
    // FieldBossSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "FieldBossSkin"
		this.list.itemRenderer = FieldBossItem
		this.list.dataProvider =  new eui.ArrayCollection([])
	}

	public OnOpen() {
		this.observe(MessageDef.FIELD_BOSS_UPDATE, this.UpdateContent)
		GameGlobal.BossModel.sendCallFieldBossList()
		this.UpdateContent();
	}

	public OnClose() {

	}

	public UpdateContent() {
		let list = GameGlobal.BossModel.GetBossInfos(Enum_BOSSTYPE.field_boss)
		let arr = [];
		let i:number;
		let len:number = list.length;
		for( i = 0 ; i < len ;i ++ )
		{
			arr.push(list[i]);
			if (GameGlobal.actorModel.level < list[i].level)
			{
				break;
			}
		}
		SortTools.sortMap(arr,'Weight',true);

		(this.list.dataProvider as eui.ArrayCollection).replaceAll(arr);
	}
}

class FieldBossItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // FieldBossItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bossName: eui.Label;
	protected runTime:eui.Label;
    protected nextTimeLabel: eui.Label;
    protected enterInfoLabel: eui.Label;
    protected goBtn: eui.Button;
    protected freshImg: eui.Image;
    protected petShowPanel: PetShowPanel;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.bar.labelFunction = function(cur, max) {
			return Math.floor(cur * 100 / max) + "%"
		}
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let data:FieldBossInfo = this.data
		let config = data.GetConfig()
		ViewManager.ins().open(FieldBossDetailPanel, config.id)
	}

	public dataChanged() {
		let data:FieldBossInfo = this.data
		let config = data.GetConfig()
		let monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid]
		this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));
		this.bar.maximum = monsterCfg[GameGlobal.Config.MonstersConfig_keys.hp]
		this.bar.value = data.hp;
		this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" +  monsterCfg[GameGlobal.Config.MonstersConfig_keys.level]+"级)"
		if (GameGlobal.actorModel.level >= config.level) {
			this.goBtn.visible = true
			this.enterInfoLabel.visible = false;
		} else {
			this.goBtn.visible = false
			this.enterInfoLabel.visible = true
			this.enterInfoLabel.text = "主角" + config.level + "级可进入"
		}
		this.freshImg.visible = !this.enterInfoLabel.visible;
		this.nextTimeLabel.text = GameGlobal.BossModel.GetNextRefreshTime()

		if (data.isDie) {
			this.runTime.text = "Boss刷新后25分钟";
			this.runTime.textColor = 0x019704;
			this.freshImg.source = "ui_boss_bm_beijisha"
		} else if (data.IsClose()) {
			this.runTime.text = "已逃跑";
			this.runTime.textColor = 0xff0000;
			this.freshImg.source = "ui_boss_bm_yitaopao"
		} else {
			this.runTime.text = GameGlobal.BossModel.GetRunTime();
			this.runTime.textColor = 0x019704;
			this.freshImg.source = "ui_boss_bm_yishuaxin"
		}
	}
}