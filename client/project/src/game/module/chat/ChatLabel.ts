class ChatLabel extends eui.Component implements eui.UIComponent{

    /////////////////////////////////////////////////////////////////////////////
    // ChatLabelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected label: eui.Label;
    protected group: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private imgList: eui.Image[] = []

	public set textColor(color: number) {
		this.label.textColor = color
	}

	public set maxWidth(val: number) {
		this.label.maxWidth = val
		egret.superSetter(ChatLabel, this, "maxWidth", val)
	}

	public set width(val: number) {
		this.label.width = val
		egret.superSetter(ChatLabel, this, "width", val)
	}

	public set text(value: string) {
		this.SetText(null, value)
	}

	public set textFlow(val: Array<egret.ITextElement>) {
		this.RemoveImg()
		this.label.textFlow = val
		// this.height = this.label.height
		this.validateNow()
	}

	public SetText(val: Array<egret.ITextElement>, str: string) {
		// if (!ChatLabel.EMPTY) {
		// 	this.label.text = " "
		// 	ChatLabel.EMPTY = this.label.width
		// 	this.label.text = ""
		// }
		let empty = 10
		this.label.text = " "
		empty = this.label.textWidth
		this.label.text = ""
		this.RemoveImg()
		let datas = this.ReplaceFace(this.label, val, str, empty)
		for (let data of datas) {
			this.GetImg(data.x, data.y, data.face)
		}
		// this.height = this.label.height
		this.validateNow()
	}

	private RemoveImg() {
		let len = this.group.numChildren
		if (!len) {
			return
		}
		for (let i = 0; i < len; i++) {
			this.imgList.push(this.group.getChildAt(i) as eui.Image)
		}
		this.group.removeChildren()
	}

	public constructor() {
		super()
		this.skinName = "ChatLabelSkin"
	}

	public childrenCreated() {
		this.label.addEventListener(egret.TextEvent.LINK, this.onLinkText, this)
	}
	
	private onLinkText(e: egret.TextEvent) {
		this.dispatchEvent(e)
	}

	public ReplaceFace(label: eui.Label, textEle: Array<egret.ITextElement>, str: string, empty: number): {x: number, y: number, face: number}[] {
		var reg = new RegExp("\\[\\d+?\\]", "g");
		let ret: RegExpMatchArray = str.match(reg)
		let retData = []
		if (ret != null) {
			label.text = ""
			let count = Math.ceil(40 / empty)
			let emptyStr = ""
			for (let i = 0; i < count; i++) {
				emptyStr += " "
			}
			let strArray = str.split(reg)
			let list = []
			if (textEle) {
				list = list.concat(textEle)
			}
			for (let i = 0; i < ret.length; i++) {
				let num = Number(ret[i].match("\\d+")[0])
				if (num >= 0 && num <= 25) {
					if (strArray[i]) {
						list.push({text: strArray[i], style:{}})
					}
					list.push({text: emptyStr, style:{faceId: num}})
				} else {
					list.push({text: strArray[i] + ret[i], style:{}})
				}
			}
			if (strArray[ret.length]) {
				list.push({text: strArray[ret.length], style:{}})
			}
			label.textFlow = list

			label.validateNow()
			let y = 0
			for (let data of label.$getLinesArr()) {
				y += data.height
				let x = 0
				for (let ele of data.elements) {
					if (ele.style && ele.style["faceId"]) {
						retData.push({x: x, y: y, face: ele.style["faceId"]})
					}
					x += ele.width
				}
			}
		} else {
			if (textEle) {
				let list = []
				list = list.concat(textEle)
				list.push({text: str, style:{}})
				label.textFlow = list
			} else {
				label.text = str
			}
		}
		return retData
	}

	private GetImg(x: number, y: number, index: number): eui.Image {
		let img = this.imgList.pop() || new eui.Image
		img.source = "ui_fc" + DateUtils.formatTimeNum(index)
		img.x = x
		img.y = y - 32
		this.group.addChild(img)
		return img

	}
}