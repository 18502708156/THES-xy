class ItemIcon extends eui.Component {

	private static EFF_LIST = []

	private static AddEff(icon: ItemIcon, effectData: any) {
		let mc: MovieBaseObject = effectData.mc
		if (!mc) {
			mc = effectData.mc = this.EFF_LIST.pop() || new MovieBaseObject
			mc.touchEnabled = false
		}
		mc.scaleX = effectData.scaleX
		mc.scaleY = effectData.scaleY
		mc.x = effectData.x
		mc.y = effectData.y
		mc.Play(effectData.url, null, -1, true, null, null, 2)
		icon.addChild(mc)
	}

	private static CacheEff(effectData: any) {
		let mc = effectData.mc
		if (!mc) {
			return
		}
		this.EFF_LIST.push(mc)
		mc.stop()
		DisplayUtils.removeFromParent(mc)
		effectData.mc = null
	}

	public static CornerType = {
		[1]: "ui_jchd_bm_zhenxi",
		[2]: "ui_xb_bm_jiaobiao",
		[3]: "ui_jchd_bm_zhenping",
	}

	public constructor() {
		super();
		this.skinName = "ItemIconSkin";
	}

	private effectData: {
		scaleX: number,
		scaleY: number,
		x: number,
		y: number,
		url: string,
		mc: MovieBaseObject,
	}

	private imgIcon: eui.Image;
	private imgBg: eui.Image;
	// private imgLCorner: eui.Image;

	private m_ImgCorner: eui.Image

	private GetImgCorner(): eui.Image {
		if (!this.m_ImgCorner) {
			let img = this.m_ImgCorner = new eui.Image
			img.left = 2
			img.top = 2
			this.addChild(img)
		}
		return this.m_ImgCorner
	}

	public ResetScale() {
		if (this.imgIcon) {
			this.imgIcon.scaleX = this.imgIcon.scaleY = 1
		}
	}

	public setItemImg(imgName: string): void {
		this.imgIcon.source = imgName
	}

	public setGray(isGray: boolean) {
		let isGrayType = (filters) => {
			if (!filters)
				return false

			return true
		}
		
		if (isGray && isGrayType(this.imgIcon.filters))
			return

		this.imgIcon.filters = isGray ? Color.GetFilter() : null
	}

	public setItemBg(imgName: string): void {
		this.imgBg.source = imgName
	}

	public SetQuality(quality: number) {
		this.setItemBg(ResDataPath.GetItemQualityName(quality))
	}

	public SetCornerImg(imgName: string): void {
		if (imgName) {
			let imgCorner = this.GetImgCorner()
			imgCorner.source = imgName
			imgCorner.visible = true
		}
	}

	public SetCornerType(type: number): void {
		let img = ItemIcon.CornerType[type]
		if (img) {
			this.SetCornerImg(img)
		} else {
			if (this.m_ImgCorner) {
				this.m_ImgCorner.visible = false
			}
		}
	}

	public isShowLCorner(visible: boolean): void {
		if (this.m_ImgCorner) {
			this.m_ImgCorner.visible = visible
		}
	}

	public setData(config: any): void {
		if (config != null) {
			let imgName = ResDataPath.GetItemFullPath(config.icon);
			if (RES.hasRes(imgName)) {
				this.imgIcon.source = imgName
			} else {
				this.imgIcon.source = ResDataPath.GetItemFullPath(config.icon)
			}
			this.imgBg.source = ResDataPath.GetItemQualityName(config.quality)

			let addEff = null
			if (config.itemeff) {
				if (config.quality == 3) {
					addEff = "eff_ui_zb_001"
				} else if (config.quality == 4) {
					addEff = "eff_ui_zb_002"
				} else if (config.quality == 5) {
					addEff = "eff_ui_zb_003"
				}
			}
			if (addEff) {
				let data = this.effectData
				if (!data) {
					data = this.effectData = {} as any
				}
				data.scaleX = this.width / 96
				data.scaleY = this.height / 96
				data.x = this.width >> 1
				data.y = this.height >> 1
				data.url =  ResDataPath.GetUIEffePath(addEff)
				ItemIcon.AddEff(this, this.effectData)
			} else {
				if (this.effectData) {
					ItemIcon.CacheEff(this.effectData)
					this.effectData = null
				}
			}
		} else {
			this.imgIcon.source = ResDataPath.EMPTY_STR;
			this.imgBg.source = ResDataPath.DEFAULT_QUALITY;
			if (this.m_ImgCorner) {
				this.m_ImgCorner.source = ""
				this.m_ImgCorner.visible = false
			}
			if (this.effectData) {
				ItemIcon.CacheEff(this.effectData)
				this.effectData = null
			}
		}
	}

	public SetItemId(itemId: number) {
		this.setData(GameGlobal.Config.ItemConfig[itemId])
	}

	// private m_IsSetClick = false

	// public SetClickEvent() {
	// 	if (this.m_IsSetClick) {
	// 		return
	// 	}
	// 	this.m_IsSetClick = true
	// 	this.addEventListener(egret.TouchEvent.TOUCH_END, this._DoOnClick, this);
	// }
	
	// private _DoOnClick() {

	// }

	public static SetItemName(label: eui.Label, itemId: number) {
		let config = GameGlobal.Config.ItemConfig[itemId]
		if (!config || !label) {
			return
		}
		label.text = config.name
		if (config.type != 0) {
			label.textColor = ItemBase.QUALITY_COLOR[config.quality];
		}
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage,nestLevel);
		if (this.effectData) {
			ItemIcon.AddEff(this, this.effectData)
		}
	}

	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();
		if (this.effectData) {
			ItemIcon.CacheEff(this.effectData)
		}
	}	
}