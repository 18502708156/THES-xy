var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameApp = (function () {
    function GameApp(callback) {
        this.mCallback = callback;
        var groupName = "preload";
        var subGroups = [];
        var keys = ["cm_json", "zjm_json", "ui_zc_jz_ditu", "ui_bm_icombg1-46"];
        var groupDicList = RES["configInstance"].groupDic[groupName];
        if (groupDicList) {
            var keyMap = RES["configInstance"].keyMap;
            for (var j = 0, len = keys.length; j < len; j++) {
                var name_1 = keys[j].trim();
                var item = keyMap[name_1];
                if (item && groupDicList.indexOf(item) == -1) {
                    groupDicList.push(item);
                }
            }
        }
        RES.setMaxLoadingThread(5);
        ResourceUtils.ins().loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    /**
     * 资源组加载完成
     */
    GameApp.prototype.onResourceLoadComplete = function () {
        this.init();
        //预加载某些东西。
        // RES.getResByUrl(ResDataPath.GetMapThumbnailPath("map001"),()=>{},this);
        //=============================
        if (this.mCallback) {
            this.mCallback();
            this.mCallback = null;
        }
    };
    /**
     * 初始化函数
     */
    GameApp.prototype.init = function () {
        Main.Instance.UpdateLoadingUI(false, "初始化数据", 0.8, 1, 5000);
        // 配置
        GlobalConfig.DecompressZip();
        // 物品配置
        ItemConfig.InitConfig();
        // 显示层级
        LayerManager.Init();
        // 地图网格初始化
        GameMap.Init();
        Deblocking.Init();
        GameGlobal.GuideUtil.Init();
        GameGlobal.ActivityKaiFuModel.init();
        GameGlobal.ViewManagerImpl.Init();
        var t = egret.getTimer();
        GameGlobal.InitConfig();
        // 特殊处理的代码
        var serId = Main.Instance.mConnectServerData.id;
        if (serId == 17 || serId == 18) {
            GameGlobal.Config.FuncOpenConfig[DeblockingType.TYPE_32].conditionnum2 = 3;
            GameGlobal.Config.FuncOpenConfig[DeblockingType.TYPE_137].conditionnum2 = 3;
        }
        console.log("模块初始化完成 耗时:" + (egret.getTimer() - t));
    };
    /**
     * 资源组加载进度
     */
    GameApp.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        Main.Instance.UpdateLoadingUI(true, "资源加载", 0.8, itemsLoaded / itemsTotal, 200);
    };
    ;
    return GameApp;
}());
__reflect(GameApp.prototype, "GameApp");
//# sourceMappingURL=GameApp.js.map