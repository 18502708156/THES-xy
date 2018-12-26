class UIHelper {

	public static readonly PANEL = "Panel"
	public static readonly PANEL_NO_TAB = "Panel2"

	public static STAE_IMG_NAME = "ui_bm_star022"
	public static STAE_NONE_IMG_NAME = "ui_bm_star021"

	public static DEFUALT_HEAD_ID = 10

	public static SetHead(comp: eui.Component, job: number, sex: number, isCircle: boolean = true) {
		if (comp == null) {
			return
		}
		let face = comp["face"] as eui.Image
		if (face == null) {
			console.log("UIHelper.SetHead face == null")
			return
		}
		if (job == null || sex == null) {
			face.source = ""
			return
		}
		// if (isCircle) face.source = ResDataPath.GetHeadCircleImgName(job, sex)
		// else 
		face.source = ResDataPath.GetHeadImgName(job, sex)
	}

	public static SetHeadByHeadId(comp: eui.Component, headId: number, isCircle: boolean = true) {
		if (comp == null) {
			return
		}
		let face = comp["face"] as eui.Image
		if (face == null) {
			console.log("UIHelper.SetHeadByHeadId face == null")
			return
		}
		if (isCircle) face.source = headId ? ResDataPath.GetHeadCircleImgNameById(headId) : ""
		else face.source = headId ? ResDataPath.GetHeadMiniImgNameById(headId) : ""
	}

	public static ShowRedPoint(comp: egret.DisplayObject, isShow: boolean): void {
		if (!comp) {
			return
		}
		let redPoint: eui.Component = comp["redPoint"]
		if (redPoint == null) {
			let group: eui.Group = comp as any
			if (group.getChildByName) {
				redPoint = group.getChildByName("redPoint") as any
			}
		}
		if (!redPoint) {
			console.log("没有设置提示图标", comp.name)
			return
		}
		redPoint.visible = isShow ? true : false
	}

	public static SetBtnNormalEffe(btn: eui.Button, isShow: boolean, width?: number, height?: number) {
		let scalex = 1
		let scaley = 1
		if (width) {
			scalex = width / 148
		}
		if (height) {
			scaley = height / 53
		}
		let effeName = "normalbtn"
		let eff = <MovieClip>btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1)
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff = new MovieClip;
				eff.name = effeName
				eff.x = btn.width >> 1
				eff.y = btn.height >> 1
				eff.scaleX = scalex
				eff.scaleY = scaley
				btn.addChild(eff)
				eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1)
			}
		}
	}

	public static SetBtnEffe(btn: eui.Button, effeName: string, isShow: boolean, scalex: number = null, scaley: number = null, posX: number = null, posY: number = null) {
		let eff = <MovieClip>btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1)
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff = new MovieClip;
				eff.name = effeName
				btn.addChild(eff)
				eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1)
			}
		}
		if (eff && eff.parent) {
			if (scalex || scaley) {
				eff.scaleX = scalex || scaley
				eff.scaleY = scaley || scalex
			}
			eff.x = posX || 30
			eff.y = posY || 0
		}

	}

	// public static SetIconMovie(target: egret.DisplayObject, startY: number = null) {
	// 	if (!target) {
	// 		return
	// 	}
	// 	startY = startY != null ? startY : target.y
	// 	egret.Tween.removeTweens(target)
	// 	var tween = egret.Tween.get(target, { loop: true });
	// 	target.y = startY
	// 	var y1 = startY + 20;
	// 	var y2 = startY
	// 	tween.to({ "y": y1 }, 1500).to({ "y": y2 }, 1500)
	// }

	public static RemoveIconMovie(target: egret.DisplayObject) {
		egret.Tween.removeTweens(target)
	}

	public static SetBtnEffeType8(target, isShow) {
		UIHelper.SetBtnEffe(target, "chargeff1", isShow, 1.1, 1.3)
	}

	public static SetCircleEffe(target, isShow, x = 33, y = 30) {
		UIHelper.SetBtnEffe(target, "actIconCircle", isShow, null, null, x, y)
	}

	public static SetScrollHIndex(group: eui.Group, index: number): void {
		if (group.parent == null) {
			console.warn("not scroll view")
			return
		}
		let scrollWidth = group.parent.width
		let gap = 0
		let left = 0
		let right = 0
		if (group.layout != null) {
			if (egret.is(group.layout, "eui.HorizontalLayout")) {
				gap = (group.layout as eui.HorizontalLayout).gap || 0
				left = (group.layout as eui.HorizontalLayout).paddingLeft || 0
				right = (group.layout as eui.HorizontalLayout).paddingRight || 0
			} else if (egret.is(group.layout, "eui.HorizontalLayout")) {
				gap = (group.layout as eui.TileLayout).horizontalGap || 0
				left = (group.layout as eui.TileLayout).paddingLeft || 0
				right = (group.layout as eui.TileLayout).paddingRight || 0
			}
		}
		let childWidth = group.getChildAt(0) ? group.getChildAt(0).width : 0
		let pos = -left + (childWidth + gap) * index
		group.scrollH = MathUtils.Clamp(pos, -left, left + (childWidth + gap) * (group.numElements) + right - gap - scrollWidth);
	}

	public static ScrollHIndex(list: eui.List, leftIndex: number, itemWidth: number, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.validateNow()
		let offsetWidth = list.numElements * itemWidth - listWidth
		list.scrollH = Math.min(leftIndex * itemWidth, offsetWidth)
	}

	public static ScrollHRight(list: eui.List, itemWidth: number, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.scrollH = Math.min(list.numElements * itemWidth - listWidth, list.scrollH + listWidth)
	}

	public static ScrollHLeft(list: eui.List, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.scrollH = Math.max(0, list.scrollH - listWidth)
	}

	// public static ShowItemListEff(list: eui.List): void {
	// 	if (list == null) {
	// 		return
	// 	}
	// 	list.validateNow()
	// 	for (let i = 0; i < list.numChildren; ++i) {
	// 		let item = list.getChildAt(i) as ItemBase
	// 		if (item && item.showItemEffect) {
	// 			item.showItemEffect()
	// 		}
	// 	}
	// }

	/** 设置链接样式文本 */
	public static SetLinkStyleLabel(label: eui.Label, text: string = null): void {
		if (!label) {
			return
		}
		label.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + (text == null ? label.text : text) + "</u></a>");
	}


	public static GetChildByName(obj: any, name: string): eui.Component {
		if (obj == null || obj.getChildByName == null) {
			return null
		}
		return obj.getChildByName(name) as any
	}

	public static ListRefresh(list: eui.ListBase): void {
		if (list == null) {
			return
		}
		let array = list.dataProvider as eui.ArrayCollection
		if (array == null) {
			return
		}
		array.replaceAll(array.source)
	}

	public static PlayBoomEff(obj: egret.DisplayObjectContainer): void {
		if (!obj) {
			return
		}
		let mc: MovieClip = ObjectPool.pop("MovieClip");
		mc.scaleX = mc.scaleY = 1;
		mc.rotation = 0;
		// mc.x = mc.y = 40;
		mc.x = obj.width >> 1
		mc.y = obj.height >> 1
		mc.loadFile(ResDataPath.GetUIEffePath("litboom"), true, 1, () => {
			ObjectPool.push(mc);
		});
		obj.addChild(mc);
	}

	public static PlayUpEff(obj: egret.DisplayObjectContainer, scale: number = 1): void {
		if (!obj) {
			return
		}
		let mc: MovieClip = ObjectPool.pop("MovieClip");
		mc.scaleX = mc.scaleY = scale
		mc.x = obj.width >> 1
		mc.y = obj.height >> 1
		mc.loadFile(ResDataPath.GetUIEffePath("ui_eff_skillf_001"), true, 1, () => {
		});
		obj.addChild(mc);
	}

	public static SetVisible(view: egret.DisplayObject, visible: boolean): void {
		if (!view) {
			return
		}
		view.visible = visible;
		(view as any).includeInLayout = visible
	}

	public RefreshList(list: eui.List): void {
		if (!list) {
			return
		}
		let dataProvider = list.dataProvider
		if (dataProvider && egret.is(dataProvider, "eui.ArrayCollection")) {
			let array = (dataProvider as eui.ArrayCollection)
			array.replaceAll(array.source)
		}
	}

	public static SetLabelText(label: eui.Label, preText: string, valText: string) {
		label.textFlow = TextFlowMaker.generateTextFlow(preText + `|C:0x38983d&T:${valText}|`)
	}

	public static SetInputMaxChar(textinput: eui.TextInput, maxLen: number) {
		let oldInput = textinput.text
		textinput.addEventListener(egret.Event.CHANGE, function () {
			var num = StringUtils.strByteLen(textinput.text);
			if (num > 12) {
				textinput.text = oldInput
			} else {
				oldInput = textinput.text
			}
		}, textinput);
	}

	public static SetRatio(img: eui.Image, width: number, height: number) {
		if (!img) {
			return
		}
		let tex = img.$Bitmap[0] as egret.Texture
		if (!tex) {
			return
		}
		if (tex) {
			let texWidth = tex.textureWidth	
			let texHeight = tex.textureHeight
			if (texHeight > height) {
				img.height = height
				img.width = height / texHeight * texWidth
			} else {
				img.width = width
				img.height = width / texWidth * texHeight
			}
		}	
	}

	public static PlayPanelTween(target: egret.DisplayObject) {
		egret.Tween.removeTweens(target)
		target.scaleX = target.scaleY = 0.5
		target.alpha = 0
		egret.Tween.get(target).to({
			scaleX: 1,
			scaleY: 1,
			alpha: 1
		}, 200, egret.Ease.backOut)
	}
}