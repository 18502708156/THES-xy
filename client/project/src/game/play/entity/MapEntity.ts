class MapEntity extends egret.DisplayObjectContainer {

	public mTeamHandle: number

	public mRaid: Raid
	public mAI: AIUnit

	// 效果组件
	public mPart: MapEntityPart

	// 当前是否是点击状态
	private mIsClick: boolean
	// 点击界面是否显示
	private mIsShowZdView: boolean
	// buff容器
	private mBattleBuff: egret.DisplayObjectContainer

	public GetHandle(): number {
		if (this.m_Info) {
			return this.m_Info.handle
		}
		return -1
	}

	public GetInfo(): EntityData {
		return this.m_Info
	}

	public GetTeam(): Team {
		if (this.m_Info) {
			return this.m_Info.team
		}
		return Team.WillEntity
	}

	public m_Model: BattleEntity
	public m_Info: EntityData
	private m_NameTxt: MapEntityTxt
	private m_Bar: eui.ProgressBar

	protected m_IsMyTeam: boolean = false

	public AddEff(): void {

	}

	public addBattleBuff(mc: MovieClip) {
		if (!this.mBattleBuff) {
			this.mBattleBuff = new egret.DisplayObjectContainer
			this.mBattleBuff.x = 2006
			this.mBattleBuff.y = 0
			this.addChild(this.mBattleBuff)
		}
		this.mBattleBuff.addChild(mc)
	}

	public removeBattleBuff(mcName: string) {
		if (!this.mBattleBuff) {
			return
		}
		let mc = this.mBattleBuff.getChildByName(mcName + "")
		if (!mc) {
			return
		}
		DisplayUtils.removeFromParent(mc)
		if (this.mBattleBuff.$children.length == 0) {
			DisplayUtils.removeFromParent(this.mBattleBuff)
			this.mBattleBuff = null
		}
	}

	public UpdateSetting(settingId: number) {
		let info = this.m_Info
		if (!info) {
			return
		}
		let model = this.m_Model
		if (!model) {
			return
		}
		if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CH) {
			if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)) {
				model.ClearTitle()
			} else {
				model.UpdateTitle(this.m_Info)
			}
		} else {
			if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CB
				|| settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TX) {
				if (info.type == EntityType.Role) {
					model.UpdateSetting(settingId)
				}
			} else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_XW
				|| settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_FZ) {
				if (info.type == EntityType.Xianlv) {
					model.UpdateSetting(settingId)
				}
			} else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TL
				|| settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_SH) {
				if (info.type == EntityType.Pet) {
					model.UpdateSetting(settingId)
				}
			}
		}
	}

	public SetFootRing(type: number): void {

	}

	private GetBar(): eui.ProgressBar {
		if (this.m_Bar == null) {
			let skin = new eui.Skin
			skin.skinParts = ["thumb"]
			skin.width = 54
			let bg = new eui.Image
			bg.percentWidth = 100
			bg.source = "ui_hpback"
			bg.scale9Grid = new egret.Rectangle(5, 5, 1, 1)
			let thumb = new eui.Image
			thumb.left = 2
			thumb.right = 2
			thumb.top = 1
			thumb.source = "ui_hpbar"
			thumb.scale9Grid = new egret.Rectangle(4, 5, 1, 1)
			skin["thumb"] = thumb
			skin.elementsContent = [bg, thumb]

			let bar = new eui.ProgressBar
			bar.skinName = skin
			bar.x = -27
			this.m_Bar = bar
		}
		return this.m_Bar
	}

	public constructor() {
		super()
		this.touchEnabled = false
		this.touchChildren = false
		
		this.mPart = new MapEntityPart(this)

		let img = new eui.Image
		img.source = "jiaodi"
		img.x = -36
		img.y = -22
		this.addChild(img)
	}

	public GetDir(): number {
		if (this.m_Model) {
			return this.m_Model.GetDir()
		}
		return 3
	}

	public Init(raid: Raid, entity: EntityData): void {
		this.mTeamHandle = null
		this.scaleX = 1
		this.alpha = 1
		this.mAI = null
		this.mRaid = raid
		this.visible = true
		this.touchEnabled = false
		this.touchChildren = false
		this.m_Info = entity
		this.m_IsMyTeam = entity.IsSide()

		if (entity.type == EntityType.Role || entity.type == EntityType.FriendlyRole) {
			this.m_Model = ObjectPool.pop("RoleBattleEntity")
		} else if (entity.type == EntityType.Pet) {
			this.m_Model = ObjectPool.pop("PetBattleEntity")
		} else if (entity.type == EntityType.Xianlv) {
			this.m_Model = ObjectPool.pop("XianlvBattleEntity")
		} else if (entity.type == EntityType.Tiannv) {
			this.m_Model = ObjectPool.pop("TiannvBattleEntity")
		} else {
			this.m_Model = ObjectPool.pop("BattleEntity")
		}
		if (this.m_Bar) {
			DisplayUtils.removeFromParent(this.m_Bar)
		}
		this.addChildAt(this.m_Model, 1)
		this.m_Model.Init(entity)
		this.UpateName()
		this.UpdateBloodPos(this.m_Model.GetTopPos())
	}

	public SetPlot(msg: string): void {
		this.mPart.SetPlot(msg)
	}

	public SetAI(ai: AIUnit) {
		this.mAI = ai
		this.mAI.Init(this)
	}

	public ShowBloodBar(): void {
		this.addChildAt(this.GetBar(), this.numChildren)
		this.SetBarValue(100, 100)
		this.UpdateBloodPos(this.m_Model.GetTopPos())
	}

	private UpdateBloodPos(pos: number) {
		if (this.m_Bar) {
			this.m_Bar.y = pos - 10
		}
	}

	public SetBarValue(value: number, max: number): void {
		if (!this.m_Bar) {
			return
		}
		this.m_Bar.maximum = max
		this.m_Bar.value = value
	}

	public Dispose(): void {
		this.alpha = 1
		if (this.m_Model) {
			this.m_Model.Dispose()
			ObjectPool.push(this.m_Model)
			DisplayUtils.removeFromParent(this.m_Model)
			this.m_Model = null
		}
		if (egret.is(this.mRaid, "MapRaid")) {
			let raid = this.mRaid as MapRaid
			raid.ClearSelectEntity(this.GetHandle())
		}
		this.mPart.Dispose()
		DisplayUtils.removeFromParent(this)
		if (this.m_NameTxt) {
			DisplayUtils.removeFromParent(this.m_NameTxt)
		}
		if (this.mIsClick) {
			this.touchEnabled = false
			this.touchChildren = false
			this.mIsClick = false
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
		}
		if (this.mBattleBuff) {
			DisplayUtils.removeFromParent(this.mBattleBuff)
			this.mBattleBuff = null
		}
		this.m_Info = null
		this.mAI = null
		this.mRaid = null
	}

	public LookPos(x: number, y: number): void {
		let x1 = this.x
		let y1 = this.y
		if (Math.abs(x1 - x) < 0.5 && Math.abs(y1 - y) < 0.5) {
			return
		}
		this.SetDir(DirUtil.GetDir(this.x, this.y, x, y))
	}

	public SetDir(dir: number): void {
		if (this.m_Model)
			this.m_Model.SetDir(dir)
	}

	public UpdateAction(animState: EntityClipType, once: boolean): void {
		if (this.m_Model)
			this.m_Model.UpdateAction(animState, once)
	}

	public ReplayAction(animState: EntityClipType, once: boolean): void {
		if (this.m_Model)
			this.m_Model.ReplayAction(animState, once)
	}

	public UpateName(): void {
		if (!this.mRaid) {
			return
		}
		let str = this.mRaid.GetEntityNameStyle(this.m_Info)
		let guildName = ""
		if (this.mRaid && this.mRaid.mIsShowGuild) {
			guildName = this.m_Info.guildName
		}

		if (this.m_Info)
			if (!str) {
				if (this.m_NameTxt) {
					this.m_NameTxt.visible = false
				}
				return
			}
		if (!this.m_NameTxt) {
			this.m_NameTxt = new MapEntityTxt
		} else {
			this.m_NameTxt.visible = true
		}
		this.addChild(this.m_NameTxt)
		// this.m_NameTxt.textFlow = TextFlowMaker.generateTextFlow(str)
		this.m_NameTxt.text = str
		this.m_NameTxt.SetNextText(guildName)

		let enemy = false
		if (guildName) {
			if (GameGlobal.actorModel.guildID) {
				if (this.m_Info.guildID != GameGlobal.actorModel.guildID) {
					enemy = true
				}
			}
		}
		this.m_NameTxt.SetNameColor(enemy)
	}

	public UpdateInfo(infoModel: EntityData = null): void {
		if (infoModel) {
			if (this.m_Info.handle != infoModel.handle) {
				console.error("update info error handle")
				return
			}
			this.m_Info = infoModel
		}
		this.m_Model.UpdateInfo(this.m_Info)
		this.UpateName()
		this.UpdateBloodPos(this.m_Model.GetTopPos())
	}

	public SetPos(x: number, y: number): void {
		this.x = x
		this.y = y
	}

	/**
	 * 添加点击事件
	 * @param showView 是否显示点击确认的界面 
	 **/
	public SetClick(showView = true) {
		if (GameGlobal.GameLogic.actorModel.actorID == this.m_Info.handle) {
			return   //本身角色不点击
		}
		this.mIsShowZdView = showView
		if (!this.mIsClick) {
			this.touchEnabled = true
			this.touchChildren = true
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
			this.mIsClick = true
		}
	}

	public ChageStatus(status: number) {
		this.mPart.ChageStatus(status)
	}

	public SetType(src: string) {
		this.mPart.SetType(src)
	}

	public $hitTest(stageX: number, stageY: number): egret.DisplayObject {
		if (!this.$visible) {
			return null;
		}
		let m = this.$getInvertedConcatenatedMatrix();
		let localX = m.a * stageX + m.c * stageY + m.tx;
		let localY = m.b * stageX + m.d * stageY + m.ty;
		if(localX > 80 || localX < - 80 || localY > 100 || localY < -100) {
			return
		}

		let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
		if (rect && !rect.contains(localX, localY)) {
			return null;
		}

		if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
			return null
		}
		let children = this.$children;
		let found = false;
		let target: egret.DisplayObject = null;
		for (let i = children.length - 1; i >= 0; i--) {
			let child = children[i];
			if (child.$maskedObject) {
				continue;
			}
			target = child.$hitTest(stageX, stageY);
			if (target) {
				found = true;
				if (target.$touchEnabled) {
					break;
				}
				else {
					target = null;
				}
			}
		}
		if (target) {
			if (this.$touchChildren) {
				return target;
			}
			return this;
		}
		if (found) {
			return this;
		}
		return super.$hitTest(stageX, stageY);
	}

	public OnClick(e: egret.TouchEvent) {
		if (e.localX > 80 || e.localX < - 80 || e.localY > 100 || e.localY < -100) {
			return
		}

		let mapRaid: MapRaid = null
		if (egret.is(this.mRaid, "MapRaid")) {
			mapRaid = this.mRaid as MapRaid
		}
		if (!mapRaid) {
			return
		}
		if (!mapRaid.OnPreEntityClick(this.GetHandle())) {
			return
		}
		if (!this.mIsShowZdView) {
			mapRaid.OnEntityClick(this.GetHandle())
			return
		}
		mapRaid.SetSelectEntity(this.GetHandle())
	}
}

class MapEntityTxt extends eui.Group {

	private img: eui.Image
	private txt: eui.Label

	private nextText: eui.Label

	public constructor() {
		super()
		this.y = 18
		this.width = 0
		this.height = 25
		this.touchEnabled = false
		this.touchChildren = false
		let img = this.img = new eui.Image
		img.source = "ui_cm_black"
		img.alpha = 0.5
		img.height = 25
		img.horizontalCenter = 0
		this.addChild(img)
		let nameTxt = this.txt = new eui.Label
		nameTxt.y = 3
		nameTxt.horizontalCenter = 0
		nameTxt.size = 18
		nameTxt.textColor = 0x00f01c
		nameTxt.bold = true
		// nameTxt.textAlign = egret.HorizontalAlign.CENTER
		// nameTxt.lineSpacing = 5
		this.addChild(nameTxt)
		this.cacheAsBitmap = true
	}

	public SetNameColor(enemy: boolean) {
		this.txt.textColor = enemy ? Color.Red : 0x00f01c
	}

	public set text(value: string) {
		this.txt.text = value
		this.img.width = this.txt.width + 12
		if (this.nextText) {
			DisplayUtils.removeFromParent(this.nextText)
		}
	}

	public set textFlow(value) {
		this.txt.textFlow = value
		this.img.width = this.txt.width + 12
		if (this.nextText) {
			DisplayUtils.removeFromParent(this.nextText)
		}
	}

	public SetNextText(value: string) {
		if (!value) {
			if (this.nextText) {
				DisplayUtils.removeFromParent(this.nextText)
			}
			return
		}
		let txt = this.nextText
		if (!txt) {
			txt = this.nextText = new eui.Label
			txt.y = 30
			txt.horizontalCenter = 0
			txt.size = 18
			txt.textColor = Color.White
			txt.bold = true
		}
		this.addChild(txt)
		txt.text = "帮：" + value
	}
}