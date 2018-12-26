class PlotPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Message

	private static LABEL_SPEED = 50
	private static IMG_SPEED = 200

	private m_LeftComp: IPlotMsgView
	private m_RightComp: IPlotMsgView

	private m_CurComp: IPlotMsgView

	private m_PlotConfig: any
	private m_Index: number
	private m_CurMsg: string = ""
	private m_FlagId: number = 0

	/**
	 * @param plotId 剧情id
	 * @param flagId 标记id，用于剧情结束的事件
	 */
	public static OpenPlot(plotId: number, flagId: number = 0) {
		if (!GameGlobal.Config.StoryDialogueConfig[plotId]) {
			return
		}
		let view = ViewManager.ins().getView(PlotPanel) as PlotPanel
		if (!view) {
			view = ViewManager.ins().open(PlotPanel) as PlotPanel
		}
		view.SetData(plotId, flagId)
	}

	public constructor() {
		super()
		this.skinName = "PlotSkin"
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private GetComp(skinName: string): IPlotMsgView {
		let comp = new eui.Component
		comp.skinName = skinName
		comp.visible = false
		this.addChild(comp)
		return comp as any
	}

	private GetRightComp(): IPlotMsgView {
		if (!this.m_RightComp) {
			this.m_RightComp = this.GetComp("PlotRightMsgSkin")
			this.m_RightComp.__out_x__ = StageUtils.WIDTH
			this.m_RightComp.__in_x__ = StageUtils.WIDTH - 356
			this.addChild(this.m_RightComp)
		}
		this.m_RightComp.visible = true
		this.m_RightComp.y = 650
		return this.m_RightComp
	}

	private GetLeftComp(): IPlotMsgView {
		if (!this.m_LeftComp) {
			this.m_LeftComp = this.GetComp("PlotLeftMsgSkin")
			this.m_LeftComp.__out_x__ = - 356
			this.m_LeftComp.__in_x__ = 0
			this.addChild(this.m_LeftComp)
		}
		this.m_LeftComp.visible = true
		this.m_LeftComp.y = 650
		return this.m_LeftComp
	}

	private _OnClick() {
		if (!this.m_CurComp) {
			return
		}
		if (this.m_CurComp.textLabel.text.length < this.m_CurMsg.length) {
			this.m_CurComp.textLabel.text = this.m_CurMsg
			TimerManager.ins().remove(this.UpdateDesc, this)
			this.WaitMsg()
		} else {
			TimerManager.ins().remove(this.UpdateMsg, this)
			this.UpdateMsg()
		}
	}

	public SetData(plotId: number, flagId: number) {
		this.m_Index = 0
		if (this.m_FlagId) {
			// 清理上一个剧情id
			GameGlobal.MessageCenter.dispatch(MessageDef.PLOT_PLAY_END, this.m_FlagId)
		}
		this.m_FlagId = flagId
		this.m_PlotConfig = GameGlobal.Config.StoryDialogueConfig[plotId]
		if (!this.m_PlotConfig) {
			UserTips.ErrorTip("剧情ID：" + plotId + "不存在")
			this.CloseSelf();
			return
		}
		this.UpdateMsg()
	}

	public UpdateMsg() {
		let data = this.m_PlotConfig[this.m_Index]
		if (!data) {
			this.CloseSelf()
			if (this.m_FlagId) {
				GameGlobal.MessageCenter.dispatch(MessageDef.PLOT_PLAY_END, this.m_FlagId)
			}
			return
		}
		let isNewImg = true
		let preData = this.m_PlotConfig[this.m_Index - 1]
		if (preData) {
			isNewImg = !(preData.pos == data.pos && preData.characterid == data.characterid)
			if (isNewImg && this.m_CurComp) {
				let img = this.m_CurComp
				egret.Tween.removeTweens(img)
				egret.Tween.get(img).to({ x: img.__out_x__ }, PlotPanel.IMG_SPEED).call(() => {
					img.visible = false
				})
			}
		}
		++this.m_Index
		if (isNewImg) {
			let img
			if (data.pos == 0) {
				img = this.GetLeftComp()
			} else if (data.pos == 1) {
				img = this.GetRightComp()
			}
			this.m_CurComp = img
			if (this.m_CurComp) {
				egret.Tween.removeTweens(this.m_CurComp)
				this.m_CurComp.x = this.m_CurComp.__out_x__
				egret.Tween.get(this.m_CurComp).to({ x: this.m_CurComp.__in_x__ }, PlotPanel.IMG_SPEED)
			}
		}
		if (data.name) {
			this.m_CurComp.nameLabel.text = data.name
		} else {
			this.m_CurComp.nameLabel.text = ""
		}
		if (data.icon) {
			this.m_CurComp.img.source = data.icon
		} else {
			this.m_CurComp.img.source = ""
		}
		this.m_CurMsg = data.des
		this.m_CurComp.textLabel.text = ""
		TimerManager.ins().doTimer(PlotPanel.LABEL_SPEED, data.des.length, this.UpdateDesc, this, this.WaitMsg, this)
	}

	private UpdateDesc() {
		this.m_CurComp.textLabel.text = this.m_CurMsg.substr(0, this.m_CurComp.textLabel.text.length + 1)
	}

	private WaitMsg() {
		TimerManager.ins().doTimer(2000, 1, this.UpdateMsg, this)
	}
}

interface IPlotMsgView extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // PlotLeftMsgSkin.exml
    /////////////////////////////////////////////////////////////////////////////
     img: eui.Image;
     textLabel: eui.Label;
     nameLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	__out_x__: number
	__in_x__: number
}