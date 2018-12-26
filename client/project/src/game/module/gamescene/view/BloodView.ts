class BloodView extends egret.DisplayObjectContainer {

	private static BUFF_TYPE = {
		["6"]: "反伤",
		["8"]: "吸血",
		["10"]: "连击",
		["11"]: "回血",
		["12"]: "中毒",
		["17"]: "破防",
	}

	private static BUFF_TYPE2 = {
		["9"]: "",
		["13"]: "净化",
	}
	private static BUFF_TYPE3 = {
		["1"]: "昏迷",
		["2"]: "封印",
		["3"]: "冰冻",
		["4"]: "沉睡",
		["14"]: "复仇",
	}

	public static Type = {
		// 字体、字体背景、文本更新方法、字体间距
		NORMAL: ["font_pth_fnt", "", function (t, x) { return x }, -5],
		// buff加血
		BUFF_HP: ["font_ui_gongjizhe01_fnt", ""],
		// 暴击
		CRIT: ["font_ui_baoji_fnt", "", function (t, x) { return "暴击" + x }, -10],

		// 闪避
		EVADE: ["font_ui_gongjizhe02_fnt", "", function (t, x) { return "闪避" }],
		// 回血
		HUIXUE: ["font_ui_gongjizhe01_fnt", "", function (t, x) {
			return "回血+" + x
		}, -5],
		// 净化
		JINHUA: ["font_ui_gongjizhe01_fnt", "", function (t, x) {
			return "净化"
		}, -5],


		// 5反击 6反伤 8吸血 10连击 12中毒 17破防
		EFFE1: ["font_ui_gongjizhe02_fnt", "ui_zd_bm_hongseBG", function (type, x) {
			return BloodView.BUFF_TYPE[type] || ""
		}],
		// buff连击,反击
		LIAN_JI: ["font_ui_gongjizhe02_fnt", "", function (t, x) {
			if (t == DamageTypes.BUFF_TYPE_10) {
				return "连击" + x
			} else if (t == DamageTypes.BUFF_TYPE_5) {
				return "反击" + x
			}
			return x
		}],
		// 6反伤 8吸血
		EFFE2: ["font_ui_gongjizhe02_fnt", "", function (type, x) {
			let v = BloodView.BUFF_TYPE[type] || ""
			if (x > 0) {
				return v += "+" + x
			}
			return v += x
		}],


		// 9吸收伤害 13净化
		EFFE3: ["font_ui_gongjizhe01_fnt", "", function (type, x) {
			return BloodView.BUFF_TYPE2[type] || ""
		}, -5],

		// 1昏迷 2封印 3冰冻 4沉睡 14复仇
		EFFE4: ["font_ui_beigongjizhe_fnt", "", function (type, x) {
			return BloodView.BUFF_TYPE3[type] || ""
		}, -5],
		SKILL_NAME: ["font_ui_jinengmingcheng_fnt", "ui_zd_bm_jinengmingBG"],



		BUFF_TEXT: ["font_ui_putongshanghai_fnt", "", function (type, x) {
			return x
		}],

		OTHER_BUFF_TEXT: ["", "", function (type, x) {
			return x
		}],
	}

	private m_Cache: { [key: string]: BloodItem[] } = {}

	private _GetBitmapLabel(typeData: string[]) {
		let label: BloodItem = null

		let cacheList = this.m_Cache[typeData["__name__"]]
		if (cacheList) {
			label = cacheList.pop()
		}
		if (!label) {
			label = new BloodItem(typeData)
		}
		label.visible = true
		this.addChild(label)
		return label
	}

	private BuffBitmapLabel(typeData: string[], fnt: string) {
		let label: BloodItem = null
		typeData[0] = fnt
		let cacheList = this.m_Cache[typeData["__name__"]]
		if (cacheList) {
			label = cacheList.pop()
		}
		if (!label) {
			label = new BloodItem(typeData)
		}
		label.visible = true
		this.addChild(label)
		return label
	}


	private _CacheBitmapLabel(bloodItem: BloodItem) {
		if (!bloodItem) {
			return
		}
		let type = bloodItem.name
		let cacheList = this.m_Cache[type]
		if (!cacheList) {
			cacheList = this.m_Cache[type] = []
		}
		bloodItem.visible = false
		bloodItem.alpha = 1
		cacheList.push(bloodItem)
		if (bloodItem.parent == this) {
			this.removeChild(bloodItem)
		}
		// console.log("cache bitmap label type = ", type)
	}

	public Clear(): void {
		for (let i = this.numChildren - 1; i >= 0; --i) {
			let child = this.getChildAt(i)
			egret.Tween.removeTweens(child)
			if (egret.is(child, "BloodItem")) {
				this._CacheBitmapLabel(child as BloodItem)
			} else if (egret.is(child, "eui.Image")) {
				DisplayUtils.removeFromParent(child);
				this.m_ImgList.push(child as eui.Image)
			} else {
				console.log("not bloodview type")
			}
		}
		this.removeChildren()
	}

	private Show(tx: number, ty: number, typeData, type: number, text: any, tweenFunc: Function): void {
		text = typeData[2] ? typeData[2](type, text) : text
		if (!text) {
			return
		}
		let blood = this._GetBitmapLabel(typeData)
		if (!blood) {
			return
		}
		blood.text = text
		blood.x = tx
		blood.y = ty - 90
		var tween = egret.Tween.get(blood);
		tweenFunc(tween)
		tween.call(this._CacheBitmapLabel, this, [blood])
	}

	public ShowBuffEffText(tx: number, ty: number, type: string, value: string) {
		let typeData
		let blood
		if (type) {
			typeData = BloodView.Type.OTHER_BUFF_TEXT as any
			blood = this.BuffBitmapLabel(typeData, type + "_fnt")
		} else {
			typeData = BloodView.Type.BUFF_TEXT as any
			blood = this._GetBitmapLabel(typeData)
		}
		if (!blood) {
			return
		}
		blood.text = value
		blood.x = tx;
		blood.y = ty - 50;
		var tween = egret.Tween.get(blood);
		BloodView.TweenType1(tween)
		tween.call(this._CacheBitmapLabel, this, [blood])
	}

	public ShowWord(tx: number, ty: number, type: number): void {
		let typeData
		if (type == 0) {
			typeData = BloodView.Type.JINHUA
		} else {
			console.warn("not ShowWord type => " + type)
		}
		if (typeData) {
			this.Show(tx, ty, typeData, 0, "", BloodView.TweenType1)
		}
	}

	private static SHOW_BUFF_ACT = {
		["9"]: BloodView.Type.EFFE3,
		["13"]: BloodView.Type.EFFE3,

		["1"]: BloodView.Type.EFFE4,
		["2"]: BloodView.Type.EFFE4,
		["3"]: BloodView.Type.EFFE4,
		["4"]: BloodView.Type.EFFE4,
		["14"]: BloodView.Type.EFFE4,
	}

	public ShowBuffAct(tx: number, ty: number, type: number, value: number): void {
		let typeData = BloodView.SHOW_BUFF_ACT[type] || BloodView.Type.EFFE3// BloodView.Type.EFFE3
		this.Show(tx, ty, typeData, type, value, BloodView.TweenType1)
	}

	public ShowBuffHp(tx: number, ty: number, type: number, value: number): void {
		let typeData = BloodView.Type.NORMAL
		let str: any
		if (value < 0) {
			str = (-1 * value) + ""
		} else {
			str = value + ""
		}
		if (type) {
			if (type == BuffType.TYPE_11) {
				typeData = BloodView.Type.HUIXUE
			} else {
				typeData = (type == BuffType.TYPE_8 || type == BuffType.TYPE_6) ? BloodView.Type.EFFE2 : BloodView.Type.EFFE1
				str = value
			}
		} else {
			if (value < 0) {
				typeData = BloodView.Type.NORMAL
			} else {
				typeData = BloodView.Type.BUFF_HP
			}
		}

		this.Show(tx, ty, typeData, type, str, BloodView.TweenType1)
	}

	public ShowSkillName(tx: number, ty: number, text: string): void {
		let typeData = BloodView.Type.SKILL_NAME
		this.Show(tx, ty, typeData, 0, text, BloodView.TweenType2)
	}

	public ShowBlood(targetTeam: Team, tx: number, ty: number, type: DamageTypes, value: number) {
		if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GAME_BLOOD_VIEW)) {
			return
		}
		let sv = value < 0 ? (-1 * value) : value
		let typeData
		if (type == DamageTypes.HIT) {
			typeData = BloodView.Type.NORMAL
			if (!value) {
				return
			}
		} else if (type == DamageTypes.CRIT) {
			typeData = BloodView.Type.CRIT
			if (!value) {
				return
			}
		} else if (type == DamageTypes.Evade) {
			typeData = BloodView.Type.EVADE
		} else if (type == DamageTypes.BUFF_TYPE_10 || type == DamageTypes.BUFF_TYPE_5) {
			typeData = BloodView.Type.LIAN_JI
		} else {
			typeData = BloodView.Type.NORMAL
		}
		let blood = this._GetBitmapLabel(typeData)
		if (!blood) {
			return
		}
		blood.text = typeData[2] ? typeData[2](type, sv) : sv
		blood.x = tx
		blood.y = ty - 90;
		var tween = egret.Tween.get(blood);
		BloodView.TweenType1(tween)
		tween.call(this._CacheBitmapLabel, this, [blood])
	}

	private m_ImgList: eui.Image[] = []

	public ShowBuffImg(targetEff: string, args: number, x: number, y: number): void {
		var image = this.m_ImgList.pop() || new eui.Image
		image.scaleX = image.scaleY = 1
		image.x = x
		image.y = y
		image.alpha = 1
		image.source = targetEff
		this.addChild(image)
		var tween = egret.Tween.get(image);
		image.x = x - 23;
		if (args == 0) {
			tween.to({ y: y - 100 }, 1000)
		} else {
			BloodView.TweenType1(tween)
		}
		tween.call(() => {
			DisplayUtils.removeFromParent(image);
			this.m_ImgList.push(image)
		})
	}

	public repositionNumPic(container: egret.DisplayObjectContainer) {
		var index = 1;
		var temp;
		for (index; index < container.numChildren; index++) {
			temp = container.getChildAt(index);
			temp.y = 20;
		}
	};

	private static OFFSET = 60

	public static TweenType1(tween: egret.Tween) {
		let target = (tween as any)._target
		tween.to({
			y: target.y - 20,
			scaleX: 1.5,
			scaleY: 1.5,
			alpha: .9
		}, 100, egret.Ease.sineIn).wait(200).to({
			y: target.y - 20,
			scaleX: 1,
			scaleY: 1,
			alpha: 1
		}, 200, egret.Ease.sineIn).to({
			y: target.y - 60,
			alpha: .3
		}, 350, egret.Ease.sineIn);
	}

	public static TweenType2(tween: egret.Tween) {
		let target = (tween as any)._target
		target.scaleX = 1.5
		target.scaleY = 1.5
		target.y = target.y - 20
		target.alpha = 0.3
		tween.to({
			y: target.y + 20,
			scaleX: 1,
			scaleY: 1,
			alpha: 1
		}, 100, egret.Ease.sineIn).wait(350).to({
			y: target.y - 20,
			alpha: .3
		}, 300, egret.Ease.sineIn)
	}

	private static m_Load = false
	private static m_Data = {
		mTex: null,
		mJson: null,
		mFnt: {}
	}

	private static m_Callback: any[]

	public static SetFont(label: eui.BitmapLabel, fontName: string) {
		let font = this.GetFont(fontName)
		if (font) {
			label.font = font
		} else {
			if (this.m_Callback == null) {
				this.m_Callback = []
			}
			this.m_Callback.push([label, fontName])
		}
	}

	public static GetFont(fontName: string) {
		if (!fontName) {
			return
		}
		if (this.m_Load) {
			let data = this.m_Data
			if (!data.mTex || !data.mJson) {
				return null
			}
			if (!data.mFnt[fontName]) {
				data.mFnt[fontName] = new egret.BitmapFont(data.mTex, data.mJson[fontName]);
			}
			return data.mFnt[fontName]
		}
		this.m_Load = true
		RES.getResByUrl("resource/assets/image/font/shanghai.json", this._CreateByUrl, this, RES.ResourceItem.TYPE_JSON)
		RES.getResByUrl("resource/assets/image/font/shanghai.png", this._CreateByUrl, this, RES.ResourceItem.TYPE_IMAGE)
	}

	private static _CreateByUrl(data: any, url: string) {
		if (!data) {
			return
		}
		if (egret.is(data, "egret.Texture")) {
			this.m_Data.mTex = data
		} else {
			this.m_Data.mJson = data
		}
		if (!this.m_Data.mTex || !this.m_Data.mJson) {
			return null
		}
		let list = this.m_Callback
		this.m_Callback = null
		for (let data of list) {
			let font = this.GetFont(data[1])
			if (!font) {
				continue
			}
			data[0].font = font
		}
	}
}

{
	for (let k in BloodView.Type) {
		BloodView.Type[k]["__name__"] = k
	}
}

class BloodItem extends egret.DisplayObjectContainer {
	private image: eui.Image
	private label: eui.BitmapLabel

	private type: number = 0

	public constructor(typeFont: any[]) {
		super()

		this.width = 0
		this.height = 0

		let g = new eui.Group
		g.width = 0
		g.height = 0
		this.addChild(g)

		this.name = typeFont["__name__"]

		if (typeFont[1]) {
			this.image = new eui.Image
			g.addChild(this.image)
			this.image.verticalCenter = 0
			this.image.horizontalCenter = 0
			this.image.source = typeFont[1]
		}

		let label = new eui.BitmapLabel
		label.verticalCenter = 0
		label.horizontalCenter = 0
		// let font = BloodView.GetFont(typeFont[0])
		// if (font) {
		// 	label.font = font
		// } else {

		// }
		BloodView.SetFont(label, typeFont[0])
		if (typeFont[3]) {
			label.letterSpacing = typeFont[3]
		}
		this.label = label
		g.addChild(label)
	}

	public set text(value) {
		this.label.text = value
	}
}
