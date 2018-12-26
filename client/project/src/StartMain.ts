class StartMain {

    public static instance: StartMain

    public mIsPauseApp = false

    public constructor() {
        this.UpErrorLog()

        egret.lifecycle.onPause = () => {
            this.mIsPauseApp = true
            GameGlobal.SoundManager.UpdateBgOn()
        }

        egret.lifecycle.onResume = () => {
            this.mIsPauseApp = false
            GameGlobal.SoundManager.UpdateBgOn()
        }

        StartMain.instance = this
        LocationProperty.init();
        GameSocket.ins()
        this.Init()
    }

    private UpErrorLog() {
        if (!window['closeError']) {
            if (!window['submitError']) {
                window['submitError'] = this.SubmitError;
            }
            window['submitTime'] = 0
            window['errorstr'] = ''
            /**错误上报 */
            let matchStr = "main.*.min\\.js"
            window.onerror = function () {
                let str = arguments[1] || ""
                if (str.match(matchStr) != null) {
                    let stack = arguments[4] ? arguments[4].stack : ""
                    if (window['errorstr'].indexOf(stack) == -1) {
                        if (window['errorstr'] != "") {
                            window['errorstr'] += "^^^"
                        }
                        window['errorstr'] += stack
                    }
                    if (egret.getTimer() - window['submitTime'] > 5000) {
                        window['submitError']();
                    }
                }
                return false;
            };
        }
    }

    private SubmitError(): void {
        try {
            if (!window['errorstr']) {
                return;
            }
            let actorId = GameGlobal.actorModel ? GameGlobal.actorModel.actorID : 0
            let actorName = GameGlobal.actorModel ? GameGlobal.actorModel.name : ""
            let str
            str = WindowData._GetPlatformId() + "|" + Main.Instance.playerServerData.data.player.username + "|" + actorId + "|" + actorName + "|" + Main.Instance.mConnectServerData.id + "|" + GameGlobal.actorModel.level;
            str += "||" + window['errorstr'];

            let url = window["__CONFIG__"]["__ERROR_UP_URL__"] || "https://sdk.api.mjh5.com/sdk/into_log"

            let request = new egret.HttpRequest();
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send('gameid=' + LocationProperty.VerPlat() + '&platformid=' + WindowData._GetPlatformId() + "&title=error&content=" + ccode.encrypt(encodeURI(str), "123"))

            window['submitTime'] = egret.getTimer();
            window['errorstr'] = "";

        } catch (e) {
            console.error(e)
        }
    }

    public static RunGame() {
        new StartMain
    }

    private Init() {
        //注入自定义的素材解析器
        egret.MainContext.instance.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.MainContext.instance.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        Sproto.SprotoCore.Init();
        Sproto.SprotoSender.Init(new C2sProtocol().GetProtocol());
        Sproto.SprotoReceiver.Init(new S2cProtocol().GetProtocol());
        GameGlobal.initModule()


        ResVersionManager.ins();

        RedPointMgr.Init()
        ResMgr.Init()
        ResMgr.GmInit()

        StartMain.LoadResVersionComplate()
    }

    // 开始加载资源文件
    static LoadResVersionComplate() {
        Main.Instance.UpdateLoadingUI(false, "加载配置文件", 0.4, 1, 5000)
        if (DEBUG) {
            if (window["TEST_LOAD_ATLAS"]) {
                console.warn("当前使用图集！！！")
                ResourceUtils.ins().addConfig("resource/default_at.res.json", "resource/");
            } else {
                ResourceUtils.ins().addConfig("resource/default.res.json", "resource/");
            }
        } else {
            ResourceUtils.ins().addConfig("resource/default.res.json", "resource/");
        }
        ResourceUtils.ins().loadConfig(StartMain.instance.onConfigComplete, StartMain.instance);
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    public onConfigComplete() {
        Main.Instance.UpdateLoadingUI(false, "加载主题文件", 0.6, 1, 5000)
        var theme = new eui.Theme("resource/default.thm.json", egret.MainContext.instance.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    }

    /**
     * 主题文件加载完成
     */
    public onThemeLoadComplete() {
        RES.destroyRes("resource/default.thm.json")
        var gameApp = new GameApp(() => {
            Main.Instance.UpdateLoadingUI(false, "进入游戏", 1, 1, 5)
            // 加载完成连接游戏服务器
            GameSocket.ins().login(Main.Instance.mConnectServerData.ip)
        });
    }
}

class MainTestLogin {
    public static GetLoginView(callback) {
        let group = new eui.Group
        group.width = 480
        group.height = 800
        let rect1 = new eui.Rect
        rect1.fillColor = Color.White
        rect1.width = 480
        rect1.height = 800
        rect1.touchEnabled = false
        group.addChild(rect1)


        let rect = new eui.Rect
        rect.fillColor = Color.Black
        rect.alpha = 0.5
        rect.horizontalCenter = 0
        rect.verticalCenter = 0
        rect.width = 300
        rect.height = 50
        rect1.touchEnabled = false
        group.addChild(rect)

        let text = new eui.EditableText
        text.horizontalCenter = rect.horizontalCenter
        text.verticalCenter = rect.verticalCenter
        text.width = rect.width
        text.height = rect.height
        text.textAlign = "center"
        text.verticalAlign = egret.VerticalAlign.MIDDLE

        text.text = egret.localStorage.getItem("account");

        group.addChild(text)

        let rect3 = new eui.Rect
        rect3.fillColor = Color.Black
        rect3.horizontalCenter = 0
        rect3.verticalCenter = 100
        rect3.width = 150
        rect3.height = 50
        rect3.touchEnabled = false
        group.addChild(rect3)

        let btn = new eui.Label
        btn.text = "开始游戏"
        btn.horizontalCenter = rect3.horizontalCenter
        btn.verticalCenter = rect3.verticalCenter
        btn.width = rect3.width
        btn.height = rect3.height
        btn.textAlign = "center"
        btn.verticalAlign = egret.VerticalAlign.MIDDLE
        group.addChild(btn)

        let click = () => {
            LocationProperty.urlParam["token"] = text.text
            egret.localStorage.setItem("account", text.text);
            group.parent.removeChild(group)
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, click, this)
            KeyboardUtils.ins().removeKeyDown(keyDown, this)
            if (callback) {
                callback()
            }
        }
        var keyDown = (keyCode: number) => {
            if (keyCode == Keyboard.ENTER) {
                click()
            }
        }
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, click, this)
        KeyboardUtils.ins().addKeyDown(keyDown, this);

        return group
    }
}