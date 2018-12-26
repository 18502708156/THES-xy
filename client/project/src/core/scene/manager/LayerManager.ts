class LayerManager {
    /**
     * 主游戏层
     */
    public static Game_Main = new BaseSpriteLayer();

    /**
     * 场景ui
     */
    public static UI_GAME_MAP = new BaseEuiLayer();

    /**
     * 战斗ui
     */
    public static UI_BATTLE = new BaseEuiLayer();
    // public static UI_Main_Bg = new BaseEuiLayer()
    public static UI_USER_INFO = new BaseEuiLayer();
    /**
     * UI主界面
     */
    public static UI_Main = new BaseEuiLayer();
    /**
     * UI导航栏界面
     */
    public static UI_Main_2 = new BaseEuiLayer();
    /**
     * UI弹出框层
     */
    public static UI_Popup = new BaseEuiLayer();
    /**
     * UI全屏弹出框层
     */
    public static UI_FullScreen_Popup = new BaseEuiLayer();
    /**
     * UI警告消息层
     */
    public static UI_Message = new BaseEuiLayer();
    /**
     * UITips层
     */
    public static UI_Tips = new BaseEuiLayer();

    private static m_Init = false

    public static Init(): void {
        if (this.m_Init) {
            return
        }
        this.m_Init = true

        let stage = GameGlobal.StageUtils.GetStage()
        let uiStage = GameGlobal.StageUtils.GetUIStage()
        stage.addChildAt(LayerManager.Game_Main, 0);
		
		uiStage.addChild(LayerManager.UI_GAME_MAP).name = "UI_GAME_MAP"
		uiStage.addChild(LayerManager.UI_BATTLE).name = "UI_BATTLE"
        uiStage.addChild(ViewManagerImpl.GetComBg());
		uiStage.addChild(LayerManager.UI_Main).name = "UI_Main";
        uiStage.addChild(LayerManager.UI_USER_INFO).name = "UI_USER_INFO";
		uiStage.addChild(LayerManager.UI_Main_2).name = "UI_Main_2";
        uiStage.addChild(LayerManager.UI_FullScreen_Popup).name = "UI_FullScreen_Popup"
		uiStage.addChild(LayerManager.UI_Popup).name = "UI_Popup";
		uiStage.addChild(LayerManager.UI_Message).name = "UI_Message";
		uiStage.addChild(LayerManager.UI_Tips).name = "UI_Tips";

        this._SetType1(this.UI_Main)
        this._SetType1(this.UI_Main_2)
        this._SetType1(this.UI_Popup)

        this._SetType2(this.UI_FullScreen_Popup)
        this._SetType2(this.UI_GAME_MAP)
        this._SetType2(this.UI_BATTLE)
        this._SetType2(this.UI_USER_INFO)
        this._SetType2(this.UI_Message)
        this._SetType2(this.UI_Tips)
    }

    private static _SetType1(group: eui.Group): void {
        group.touchEnabled = false;
        group.horizontalCenter = 0
        group.verticalCenter = 0
        group.width = StageUtils.WIDTH
        group.height = StageUtils.HEIGHT

        group["__TOP_LAYER__"] = true
    }

    private static _SetType2(group: eui.Group): void {
        group.touchEnabled = false;
        group.horizontalCenter = 0
        group.percentWidth = 100
        group.percentHeight = 100

        group["__TOP_LAYER__"] = true
    }

    public static IsShowGameMain(): boolean {
        return LayerManager.Game_Main.$stage ? true : false
    }

    public static HasMainPanel(): boolean {
        return LayerManager.UI_Main.numChildren > 0
    }
}