var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StartMain = (function () {
    function StartMain() {
        var _this = this;
        this.mIsPauseApp = false;
        this.UpErrorLog();
        egret.lifecycle.onPause = function () {
            _this.mIsPauseApp = true;
            GameGlobal.SoundManager.UpdateBgOn();
        };
        egret.lifecycle.onResume = function () {
            _this.mIsPauseApp = false;
            GameGlobal.SoundManager.UpdateBgOn();
        };
        StartMain.instance = this;
        LocationProperty.init();
        GameSocket.ins();
        this.Init();
    }
    StartMain.prototype.UpErrorLog = function () {
        if (!window['closeError']) {
            if (!window['submitError']) {
                window['submitError'] = this.SubmitError;
            }
            window['submitTime'] = 0;
            window['errorstr'] = '';
            /**错误上报 */
            var matchStr_1 = "main.*.min\\.js";
            window.onerror = function () {
                var str = arguments[1] || "";
                if (str.match(matchStr_1) != null) {
                    var stack = arguments[4] ? arguments[4].stack : "";
                    if (window['errorstr'].indexOf(stack) == -1) {
                        if (window['errorstr'] != "") {
                            window['errorstr'] += "^^^";
                        }
                        window['errorstr'] += stack;
                    }
                    if (egret.getTimer() - window['submitTime'] > 5000) {
                        window['submitError']();
                    }
                }
                return false;
            };
        }
    };
    StartMain.prototype.SubmitError = function () {
        try {
            if (!window['errorstr']) {
                return;
            }
            var actorId = GameGlobal.actorModel ? GameGlobal.actorModel.actorID : 0;
            var actorName = GameGlobal.actorModel ? GameGlobal.actorModel.name : "";
            var str = void 0;
            str = WindowData._GetPlatformId() + "|" + Main.Instance.playerServerData.data.player.username + "|" + actorId + "|" + actorName + "|" + Main.Instance.mConnectServerData.id + "|" + GameGlobal.actorModel.level;
            str += "||" + window['errorstr'];
            var url = window["__CONFIG__"]["__ERROR_UP_URL__"] || "https://sdk.api.mjh5.com/sdk/into_log";
            var request = new egret.HttpRequest();
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send('gameid=' + LocationProperty.VerPlat() + '&platformid=' + WindowData._GetPlatformId() + "&title=error&content=" + ccode.encrypt(encodeURI(str), "123"));
            window['submitTime'] = egret.getTimer();
            window['errorstr'] = "";
        }
        catch (e) {
            console.error(e);
        }
    };
    StartMain.RunGame = function () {
        new StartMain;
    };
    StartMain.prototype.Init = function () {
        //注入自定义的素材解析器
        egret.MainContext.instance.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.MainContext.instance.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        Sproto.SprotoCore.Init();
        Sproto.SprotoSender.Init(new C2sProtocol().GetProtocol());
        Sproto.SprotoReceiver.Init(new S2cProtocol().GetProtocol());
        GameGlobal.initModule();
        ResVersionManager.ins();
        RedPointMgr.Init();
        ResMgr.Init();
        ResMgr.GmInit();
        StartMain.LoadResVersionComplate();
    };
    // 开始加载资源文件
    StartMain.LoadResVersionComplate = function () {
        Main.Instance.UpdateLoadingUI(false, "加载配置文件", 0.4, 1, 5000);
        if (true) {
            if (window["TEST_LOAD_ATLAS"]) {
                console.warn("当前使用图集！！！");
                ResourceUtils.ins().addConfig("resource/default_at.res.json", "resource/");
            }
            else {
                ResourceUtils.ins().addConfig("resource/default.res.json", "resource/");
            }
        }
        else {
            ResourceUtils.ins().addConfig("resource/default.res.json", "resource/");
        }
        ResourceUtils.ins().loadConfig(StartMain.instance.onConfigComplete, StartMain.instance);
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    StartMain.prototype.onConfigComplete = function () {
        Main.Instance.UpdateLoadingUI(false, "加载主题文件", 0.6, 1, 5000);
        var theme = new eui.Theme("resource/default.thm.json", egret.MainContext.instance.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    };
    /**
     * 主题文件加载完成
     */
    StartMain.prototype.onThemeLoadComplete = function () {
        RES.destroyRes("resource/default.thm.json");
        var gameApp = new GameApp(function () {
            Main.Instance.UpdateLoadingUI(false, "进入游戏", 1, 1, 5);
            // 加载完成连接游戏服务器
            GameSocket.ins().login(Main.Instance.mConnectServerData.ip);
        });
    };
    return StartMain;
}());
__reflect(StartMain.prototype, "StartMain");
var MainTestLogin = (function () {
    function MainTestLogin() {
    }
    MainTestLogin.GetLoginView = function (callback) {
        var _this = this;
        var group = new eui.Group;
        group.width = 480;
        group.height = 800;
        var rect1 = new eui.Rect;
        rect1.fillColor = Color.White;
        rect1.width = 480;
        rect1.height = 800;
        rect1.touchEnabled = false;
        group.addChild(rect1);
        var rect = new eui.Rect;
        rect.fillColor = Color.Black;
        rect.alpha = 0.5;
        rect.horizontalCenter = 0;
        rect.verticalCenter = 0;
        rect.width = 300;
        rect.height = 50;
        rect1.touchEnabled = false;
        group.addChild(rect);
        var text = new eui.EditableText;
        text.horizontalCenter = rect.horizontalCenter;
        text.verticalCenter = rect.verticalCenter;
        text.width = rect.width;
        text.height = rect.height;
        text.textAlign = "center";
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.text = egret.localStorage.getItem("account");
        group.addChild(text);
        var rect3 = new eui.Rect;
        rect3.fillColor = Color.Black;
        rect3.horizontalCenter = 0;
        rect3.verticalCenter = 100;
        rect3.width = 150;
        rect3.height = 50;
        rect3.touchEnabled = false;
        group.addChild(rect3);
        var btn = new eui.Label;
        btn.text = "开始游戏";
        btn.horizontalCenter = rect3.horizontalCenter;
        btn.verticalCenter = rect3.verticalCenter;
        btn.width = rect3.width;
        btn.height = rect3.height;
        btn.textAlign = "center";
        btn.verticalAlign = egret.VerticalAlign.MIDDLE;
        group.addChild(btn);
        var click = function () {
            LocationProperty.urlParam["token"] = text.text;
            egret.localStorage.setItem("account", text.text);
            group.parent.removeChild(group);
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, click, _this);
            KeyboardUtils.ins().removeKeyDown(keyDown, _this);
            if (callback) {
                callback();
            }
        };
        var keyDown = function (keyCode) {
            if (keyCode == Keyboard.ENTER) {
                click();
            }
        };
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, click, this);
        KeyboardUtils.ins().addKeyDown(keyDown, this);
        return group;
    };
    return MainTestLogin;
}());
__reflect(MainTestLogin.prototype, "MainTestLogin");
//# sourceMappingURL=StartMain.js.map