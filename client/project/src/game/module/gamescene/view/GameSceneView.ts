class GameSceneView extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_USER_INFO
    public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM

    /////////////////////////////////////////////////////////////////////////////
    // GameFightSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labelDisplay: eui.Label;
    protected bGroup: eui.Group;
    miniChat: MiniChatPanel;
    /////////////////////////////////////////////////////////////////////////////

	private _input: eui.TextInput;

	private get input(): eui.TextInput {
		if (!this._input) {
			this._input = new eui.TextInput;
			this._input.width = 250
			this._input.visible = false;
			this._input.prompt = "点我输入命令";
			this._input.y = 300;
			LayerManager.UI_Tips.addChild(this._input);
		}
		return this._input
	}

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.miniChat.input.sendBtn
		}
	}
	public static Show(): void {
		
	}

	public constructor() {
		super()
		this.skinName = "GameFightSceneSkin";
		this.touchEnabled = false;
		this.touchChildren = true;

        KeyboardUtils.ins().addKeyDown(this.TestKeyDown, this);
	}
	
	public TestKeyDown(keyCode: number) {
		if (ActorModel.IsGM()) {
			if (keyCode == Keyboard.BACK_QUOTE) {
				if (this._input && !(this._input as any).isFocus && this._input.visible) {
					this._input.visible = false
				} else {
					this.input.visible = true
				}
			}
			if (keyCode == Keyboard.ENTER && this.input.visible) {
				GameLogic.SendGM(this.input.text);
			}
		}
    }

	public OnOpen(...param: any[]) {
		this.miniChat.openPanel()
	}

	public OnClose(...param: any[]) {
		MessageCenter.ins().removeAll(this);
		this.miniChat.closePanel()
	}

	public destoryView() {
		//场景自动释放
	}
	

	public onTap(e) {
		switch (e.currentTarget) {
		}
	}
}

class BossComeToAttackView extends eui.Component {

	private startTween: egret.tween.TweenGroup

	public constructor() {
		super()
		this.skinName = "BossComeToAttackSkin"
		this.touchEnabled = false
		this.touchChildren = false
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage,nestLevel);
		this.y = 400;
		try {
			let speed = SystemSettingPanel.GetSpeed()
			if (speed > 1) {
				for (let item of this.startTween.items) {
					for (let path of item.paths) {
						let data = path as any
						if (data.duration) {
							data.duration = Math.floor(data.duration / speed)
						}
					}
				}
			}
		} catch(e) {

		}
		this.startTween.once('complete', this.Close, this)
		this.startTween.play()
	}

	private Close() {
		DisplayUtils.removeFromParent(this)
	}
}