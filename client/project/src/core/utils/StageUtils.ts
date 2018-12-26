class StageUtils {

    public static readonly WIDTH = 720
    public static readonly HEIGHT = 1280

    private static _uiStage: eui.UILayer

    public constructor() {
        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new eui.UILayer();
            StageUtils._uiStage.touchEnabled = false;
            StageUtils._uiStage.percentHeight = 100;
            StageUtils._uiStage.percentWidth = 100;
            // StageUtils._uiStage.scaleX = StageUtils._uiStage.scaleY = 2.25
            this.GetStage().addChildAt(StageUtils._uiStage, 0);
        }
	}

    public GetHeight (): number {
        return this.GetStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     */
    public GetWidth (): number {
        return this.GetStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren (value: boolean): void {
        this.GetStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     */
    public SetMaxTouches(value: number): void {
        this.GetStage().maxTouches = value;
    }

    /**
     * 设置帧频
     */
    public SetFrameRate(value: number): void {
        this.GetStage().frameRate = value;
    }

    public GetStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    /**
     * 获取唯一UIStage
     */
    public GetUIStage(): eui.UILayer {
        return StageUtils._uiStage;
    }
}