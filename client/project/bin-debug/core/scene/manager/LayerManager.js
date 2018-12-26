var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LayerManager = (function () {
    function LayerManager() {
    }
    LayerManager.Init = function () {
        if (this.m_Init) {
            return;
        }
        this.m_Init = true;
        var stage = GameGlobal.StageUtils.GetStage();
        var uiStage = GameGlobal.StageUtils.GetUIStage();
        stage.addChildAt(LayerManager.Game_Main, 0);
        uiStage.addChild(LayerManager.UI_GAME_MAP).name = "UI_GAME_MAP";
        uiStage.addChild(LayerManager.UI_BATTLE).name = "UI_BATTLE";
        uiStage.addChild(ViewManagerImpl.GetComBg());
        uiStage.addChild(LayerManager.UI_Main).name = "UI_Main";
        uiStage.addChild(LayerManager.UI_USER_INFO).name = "UI_USER_INFO";
        uiStage.addChild(LayerManager.UI_Main_2).name = "UI_Main_2";
        uiStage.addChild(LayerManager.UI_FullScreen_Popup).name = "UI_FullScreen_Popup";
        uiStage.addChild(LayerManager.UI_Popup).name = "UI_Popup";
        uiStage.addChild(LayerManager.UI_Message).name = "UI_Message";
        uiStage.addChild(LayerManager.UI_Tips).name = "UI_Tips";
        this._SetType1(this.UI_Main);
        this._SetType1(this.UI_Main_2);
        this._SetType1(this.UI_Popup);
        this._SetType2(this.UI_FullScreen_Popup);
        this._SetType2(this.UI_GAME_MAP);
        this._SetType2(this.UI_BATTLE);
        this._SetType2(this.UI_USER_INFO);
        this._SetType2(this.UI_Message);
        this._SetType2(this.UI_Tips);
    };
    LayerManager._SetType1 = function (group) {
        group.touchEnabled = false;
        group.horizontalCenter = 0;
        group.verticalCenter = 0;
        group.width = StageUtils.WIDTH;
        group.height = StageUtils.HEIGHT;
        group["__TOP_LAYER__"] = true;
    };
    LayerManager._SetType2 = function (group) {
        group.touchEnabled = false;
        group.horizontalCenter = 0;
        group.percentWidth = 100;
        group.percentHeight = 100;
        group["__TOP_LAYER__"] = true;
    };
    LayerManager.IsShowGameMain = function () {
        return LayerManager.Game_Main.$stage ? true : false;
    };
    LayerManager.HasMainPanel = function () {
        return LayerManager.UI_Main.numChildren > 0;
    };
    /**
     * 主游戏层
     */
    LayerManager.Game_Main = new BaseSpriteLayer();
    /**
     * 场景ui
     */
    LayerManager.UI_GAME_MAP = new BaseEuiLayer();
    /**
     * 战斗ui
     */
    LayerManager.UI_BATTLE = new BaseEuiLayer();
    // public static UI_Main_Bg = new BaseEuiLayer()
    LayerManager.UI_USER_INFO = new BaseEuiLayer();
    /**
     * UI主界面
     */
    LayerManager.UI_Main = new BaseEuiLayer();
    /**
     * UI导航栏界面
     */
    LayerManager.UI_Main_2 = new BaseEuiLayer();
    /**
     * UI弹出框层
     */
    LayerManager.UI_Popup = new BaseEuiLayer();
    /**
     * UI全屏弹出框层
     */
    LayerManager.UI_FullScreen_Popup = new BaseEuiLayer();
    /**
     * UI警告消息层
     */
    LayerManager.UI_Message = new BaseEuiLayer();
    /**
     * UITips层
     */
    LayerManager.UI_Tips = new BaseEuiLayer();
    LayerManager.m_Init = false;
    return LayerManager;
}());
__reflect(LayerManager.prototype, "LayerManager");
//# sourceMappingURL=LayerManager.js.map