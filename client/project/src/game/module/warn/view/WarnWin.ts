class WarnWin extends BaseEuiView {
	public constructor() {
		super()
	}

	/////////////////////////////////////////////////////////////////////////////
	// warnFrameSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected animGroup: eui.Group;
	protected commonDialog: CommonDialog;
	protected group: eui.Group;
	protected sureBtn: eui.Button;
	protected notBtn: eui.Button;
	protected bg: eui.Image;
	protected warnLabel: eui.Label;
	protected itemList: eui.List;
	protected checkBox: eui.CheckBox;
	/////////////////////////////////////////////////////////////////////////////

	callBack
	calback2
	_isShowWin
	name
	closeExecuteCallFun2 = true;

	// normal sure
	static show(str, func, thisObj, func2 = null, thisObj2 = null, statu = "normal", data = null) {
		UserWarn.ins().setWarnLabel(str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func": func2,
				"thisObj": thisObj2,
			}, statu, data);
	};

	public static ShowContent(str: string | eui.Component, func: Function, thisObj: any, func2 = null, thisObj2 = null, statu = "normal", data = null) {
		UserWarn.ins().setWarnContent(str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func": func2,
				"thisObj": thisObj2,
			}, statu, data);
	}


	// normal sure
	static showReward(str, func, thisObj, func2 = null, thisObj2 = null, statu = "reward", data = null) {
		UserWarn.ins().setshowReward(str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func": func2,
				"thisObj": thisObj2,
			}, statu, data);
	};

	// checkBox
	static showCheckBox(name, str, func, thisObj, func2 = null, thisObj2 = null, statu = "checkBox", data = null) {
		UserWarn.ins().setshowCheckBox(name, str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func": func2,
				"thisObj": thisObj2,
			}, statu, data);
	};

	initUI() {
		super.initUI()
		this.skinName = "warnFrameSkin";
		this.validateNow()
	}

	OnOpen() {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)//不显示返回按钮
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.notBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		this.animGroup.scaleX = this.animGroup.scaleY = 0.5
		this.animGroup.alpha = 0
		egret.Tween.get(this.animGroup).to({
			scaleX: 1,
			scaleY: 1,
			alpha: 1
		}, 200, egret.Ease.backOut)


	}

	OnClose() {
		this.commonDialog.OnRemoved()
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.notBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		this.callBack = null
		this.calback2 = null

		egret.Tween.removeTweens(this.animGroup)
	};

	onTap(e) {
		let tempCb1 = this.callBack
		let tempCb2 = this.calback2
		switch (e.currentTarget) {
			case this.sureBtn:
				WarnWinDate.ins().changeHint(this.name, !this.checkBox.selected)
				if (tempCb1 && tempCb1.func != null)
					tempCb1.func.call(tempCb1.thisObj);
				break;
			case this.notBtn:
				if (tempCb2 && tempCb2.func) {
					tempCb2.func.call(tempCb2.thisObj);
				}
				break;
		}
		this.CloseSelf()
	}

	get isShowWin() {
		return this._isShowWin;
	}

	set isShowWin(bool) {
		if (this._isShowWin == bool)
			return;
		this._isShowWin = bool;
	}

	// private _Adjust(height: number): void {

	// 	this.bg.height = Math.max(height + 30, this.tempH3)

	// 	this.commonDialog.height = this.bg.height + this.tempH
	// 	this.validateNow()

	// 	let pos = this.commonDialog.y + this.commonDialog.height - this.tempH2
	// 	this.sureBtn.y = pos
	// 	this.notBtn.y = pos
	// }

	private _Adjust(height: number): void {
		let h = Math.max(height + 40, 187)
		this.group.height = h + 143
		this.commonDialog.height = this.group.height + 30
	}

	// private _UpdateBtn() {
	// 	let str = this.sureBtn.label || ""
	// 	if (str.length > 4) {
	// 		this.sureBtn.width = str.length * 40
	// 	}
	// }

	setWarnLabel(str, callbackFunc, calbackFun2 = null, statu = "normal", data = null) {
		if (typeof (str) == "string") {
			this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
		} else {
			this.warnLabel.textFlow = str
		}
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;



		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
				// this._UpdateBtn()
			}
			if (data.btnName2) {
				this.notBtn.label = data.btnName2
			}

			if (data.title) {
				this.commonDialog.title = data.title
			}

			if (data.closeExecuteCallFun2 != null)
				this.closeExecuteCallFun2 = data.closeExecuteCallFun2
		}

		this.hideReturnBtn()//隐藏取消按钮
		this._Adjust(this.warnLabel.height)
		this.CommonDialogCloseCallFun();
	};

	setWarnContent(content: string | eui.Component, callbackFunc, calbackFun2 = null, statu = "normal", data = null) {
		this.warnLabel.visible = false
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;

		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
				// this._UpdateBtn()
			}
			if (data.title) {
				this.commonDialog.title = data.title
			}
		}

		let comp: eui.Component = null
		if (typeof (content) == "string") {
			comp = new eui.Component
			comp.skinName = content
		} else {
			comp = content
		}
		this.group.addChild(comp)


		this._Adjust(comp.height)

		comp.x = (StageUtils.WIDTH - comp.width) * 0.5
		comp.y = (this.group.height - comp.height) >> 1
		this.CommonDialogCloseCallFun();
		//取消按钮按需添加,根据后面需求
	}

	setshowReward(str, callbackFunc, calbackFun2 = null, statu = "reward", data = null) {
		if (typeof (str) == "string") {
			this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
		} else {
			this.warnLabel.textFlow = str
		}
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;




		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
				// this._UpdateBtn()
			}
			if (data.title) {
				this.commonDialog.title = data.title
			}

			//奖励内容
			if (data.reward) {
				this.itemList.itemRenderer = ItemBase
				this.itemList.dataProvider = new eui.ArrayCollection(data.reward)
			}

			if (data.bHideSureBtn) {
				this.sureBtn.visible = false
			}
		}
		this.CommonDialogCloseCallFun();
	};

	setshowCheckBox(name, str, callbackFunc, calbackFun2 = null, statu = "checkBox", data = null) {
		if (typeof (str) == "string") {
			this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
		} else {
			this.warnLabel.textFlow = str
		}
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;
		this.name = name;

		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
				// this._UpdateBtn()
			}
			if (data.title) {
				this.commonDialog.title = data.title
			}

			//奖励内容
			if (data.reward) {
				this.itemList.itemRenderer = ItemBase
				this.itemList.dataProvider = new eui.ArrayCollection(data.reward)
			}

			if (data.bHideSureBtn) {
				this.sureBtn.visible = false
			}
		}
		this.CommonDialogCloseCallFun();
	};

	CommonDialogCloseCallFun() {
		this.commonDialog.mCallback = () => {
			if (this.calback2 && this.calback2.func && this.closeExecuteCallFun2) {
				this.calback2.func.call(this.calback2.thisObj);
			}
			this.CloseSelf()
		}
	}

	public hideReturnBtn() {
		if (!this.calback2) {
			//只用一个按钮
			this.sureBtn.x = this.width / 2 - this.sureBtn.width / 2 //重置一下按钮的位置
			this.notBtn.visible = false
		}
	}
}

WarnWin.LAYER_LEVEL = LayerManager.UI_Popup;