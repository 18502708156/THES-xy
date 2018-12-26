//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    // 登录界面
    public mLoadResGroup01 = {
        // "_start_res2": "resource/assets/game_start/_start_res2.json",
    }

    // 创建角色
    public mLoadResGroup02 = {
        "_ui_cjjs_bm_ditu": "resource/assets/game_start/_ui_cjjs_bm_ditu.jpg",
    }

    public mLoadResGroup03 = {
        "_notice_res": "resource/assets/game_start/_notice_res.json",
    }

    public mLoadResGroup04 = {
        "_notice_res": "resource/assets/game_start/_notice_res.json",
    }

    // loading
    public mLoadResGroup05 = {
        "ui_xzfwq_p_show": "resource/assets/game_start/ui_xzfwq_p_show.jpg",
    }

    private sheet: egret.SpriteSheet

    private m_CurLoadGroup = []
    public mToken: string

    public static Instance: Main
    public playerServerData: GetPlayerServerInfoData
    public mConnectServerData: GameServerDescData
    public mCreateRoleData: {
        crn: string
        crji: number
    }

    public UserName: string
    public NoticeStatus: number
    public GmLevel: number
    public lid: string

    private m_CreateRoleData: GameServerDescData

    // 1、显示登陆界面     2、显示创建角色界面      3、显示公告
    private m_UIGroup: egret.DisplayObjectContainer
    private m_NextStepType = -1

    private m_CreateRolViewData: any

    public static $GetThmPath(str: string, thmId: number): string {
        if (thmId) {
            let array = str.split("game_start")
            return array[0] + "game_start/thm" + thmId + array[1]
        }
        return str
    }

    public constructor() {
        super();

        this.m_CreateRolViewData = [CreateRoleUI, "CreateRoleUI"]
        Main.Instance = this

        if (WindowData._GetStartResAddr()) {
            let resUrl = WindowData._GetStartResAddr()
            RES.web.Html5VersionController.prototype.getVirtualUrl = (url) => {
                if (url.indexOf("http") != -1) {
                    return url
                }
                return resUrl + url
            } 
        }

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private m_BGImg: egret.Bitmap

    private onAddToStage(event: egret.Event) {

        egret.TextField.default_fontFamily = "SimHei,SimSun,Arial"
        egret.DisplayObject.defaultTouchEnabled = false
        egret.ImageLoader.crossOrigin = "anonymous";

        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.m_UIGroup = new egret.DisplayObjectContainer
        if (WindowData._GetBGImg()) {
            this.m_BGImg = new egret.Bitmap
            this.m_UIGroup.addChild(this.m_BGImg)
            this._LoadGroup({["__BG_IMG__"]: WindowData._GetBGImg()})
        }
		this.m_UIGroup.width = 0
		this.m_UIGroup.height = 0
		this.addChild(this.m_UIGroup)
		this.onResize()

        // egret.lifecycle.addLifecycleListener((context) => {
        //     // custom lifecycle plugin

        //     context.onUpdate = () => {
        //         console.log('hello,world')
        //     }
        // })

        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }

        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }

        this._LoadSheet("resource/assets/game_start/_start_res2.json")
        if (WindowData._DirectLogin()) {
            window["_LoginToken"]((token, infostr) => {
                this.mToken = token
                // egret.setTimeout(() => {
                //    console.log(infostr)
                    this._DoParsePlayerServerInfo(infostr)
                // }, this, 1)
            })
        } else {
            window["_LoginToken"]((token) => {
                this.mToken = token
                HttpHelper.GetPlayerServerInfo(token, this._DoGetPlayerServerInfo, this)
            })
        }
    }

    private _DoGetPlayerServerInfo(event:egret.Event): void {
        let request = <egret.HttpRequest>event.currentTarget;
        return this._DoParsePlayerServerInfo(request.response)
    }

    private _DoParsePlayerServerInfo(infostr:string): void {
        let jsonObj: GetPlayerServerInfoData = JSON.parse(infostr)

		if (jsonObj.result != 1) {
			alert(jsonObj.result_msg)
			return
		}
        let Default = function(obj) {
            if (!obj) {
                return []
            }
            for (let key in obj) {
                return obj
            }
            return []
        }
        let playerInfo = jsonObj.data.player
        this.UserName = playerInfo.username
        this.GmLevel = playerInfo.gm_level
        this.lid = playerInfo.lid
        this.playerServerData = jsonObj
        this.NoticeStatus = jsonObj.data.ns

        let recent_serverids = Default(jsonObj.data.recent)
        recent_serverids.sort(function(lhs, rhs) {
            return rhs.time - lhs.time
        })
        let recentList: GameServerDescData[] = []
        for (let data of recent_serverids) {
            let descData = GameServerDescData.Get(data, true)
            if (!descData) {
                continue
            }
            recentList.push(descData)
        }
        let lastList: GameServerDescData[] = []
        let last_page = Default(jsonObj.data.lpage)
        last_page.sort(function(lhs, rhs) {
            return rhs.sid - lhs.sid
        })
        for (let data of last_page) {
            let descData = GameServerDescData.Get(data)
            if (!descData) {
                continue
            }
            lastList.push(descData)
        }
        GameServerData.Init(jsonObj.data.maxid, recentList, lastList)
        // 如果没有最近登陆的列表，就给一个最近的服务器，直接进入游戏
        if (GameServerData.PageData[0].datas.length == 0) {
            let lastList = GameServerData.PageData[1].datas
            for (let i = 0; i < lastList.length; ++i) {
                let data = lastList[i]
                if (data.CanEnter()) {
                    HttpHelper.SendPoint(4)
                    this.m_CreateRoleData = data
                    this._LoadGroup(this.mLoadResGroup02)
                    this._SetNextStep(2)
                    return                    
                }
            }
            console.log("没有可以创建角色的服务器")
        }
        this._LoadGroup(this.mLoadResGroup01)
        this._SetNextStep(1)
    }

    private _SetNextStep(step: number) {
        this.DoShowLoadingImg()
        this.m_NextStepType = step
        this._CreateScene()
    }

    private _LoadSheet(jsonName: string): void {
        this.m_CurLoadGroup.push(jsonName)
        RES.getResByUrl(jsonName, this._OnLoadItem, this, RES.ResourceItem.TYPE_SHEET)
    }

    private _LoadGroup(group: any) {
        for (let key in group) {
            this.m_CurLoadGroup.push(group[key])
        }
        for (let key in group) {
            let resName = group[key]
            if (resName.indexOf(".json") != -1) {
                RES.getResByUrl(resName, this._OnLoadItem, this, RES.ResourceItem.TYPE_SHEET)
            } else {
                RES.getResByUrl(resName, this._OnLoadItem, this, RES.ResourceItem.TYPE_IMAGE)
            }
        }
    }

    private _CheckUI(name: string): boolean {
         if (this.m_CurLoadGroup.length > 0 || this.m_NextStepType != -1) {
            return false
        }
        for (let child of this.$children) {
            if (egret.is(child, name)) {
                return false
            }
        }       
        return true
    }

    public ShowServerUI() {
        if (!this._CheckUI("ServerUI")) {
            return
        }
        this._LoadGroup(this.mLoadResGroup03)
        this._SetNextStep(3)
    }

    public ShowNoticeUI() {
        if (!this._CheckUI("NoticeUI")) {
            return
        }
        this._LoadGroup(this.mLoadResGroup04)
        this._SetNextStep(4)      
    }

    public ShowCreateUI(data: GameServerDescData) {
        if (!this._CheckServerState(data)) {
            return
        }
        if (!this._CheckUI(this.m_CreateRolViewData[1])) {
            return
        }
        this.m_CreateRoleData = data
        this._LoadGroup(this.mLoadResGroup02)
        this._SetNextStep(2)
    }

	public UpdateLoadingUI(isUpdate: boolean, str: string, p1: number, p2: number, time: number) {
        for (let i = this.m_UIGroup.numChildren - 1; i >= 0; --i) {
            let child = this.m_UIGroup.getChildAt(i)
            if (egret.is(child, "LoadingUI")) {
                if (isUpdate) {
                    (child as LoadingUI).UpdateText(str, p1, p2, time)
                } else {
                    (child as LoadingUI).SetText(str, p1, p2, time)
                }
                break
            }
        }   
    }

    public ShowLoadingUI() {
        if (!this._CheckUI("LoadingUI")) {
            return
        }
        this._LoadGroup(this.mLoadResGroup05)
        this._SetNextStep(5) 
    }

    private m_LoadingImg: egret.Bitmap
    private m_TimeOutId: number = null

    private DoShowLoadingImg(): void {
        if (this.m_TimeOutId) {
            egret.clearTimeout(this.m_TimeOutId)
            this.m_TimeOutId = null
        }
        this.m_TimeOutId = egret.setTimeout(this.ShowLoadingImg, this, 1000)
    }

    private ShowLoadingImg(): void {
        if (this.m_LoadingImg == null) {
            this.m_LoadingImg = new egret.Bitmap
            this.m_LoadingImg.texture = this.GetImg("_start_load_Reel")
            this.m_LoadingImg.anchorOffsetX = this.m_LoadingImg.width >> 1
            this.m_LoadingImg.anchorOffsetY = this.m_LoadingImg.height >> 1
            this.onResize()
        }
        if (this.m_LoadingImg.parent) {
            this.m_LoadingImg.parent.removeChild(this.m_LoadingImg)
        }
        egret.stopTick(this.UpdateLoadingImgAnim, this)
        egret.startTick(this.UpdateLoadingImgAnim, this)
        this.m_UIGroup.addChild(this.m_LoadingImg)
    }

    private UpdateLoadingImgAnim(timeStamp: number): boolean {
        if (this.m_LoadingImg) {
            this.m_LoadingImg.rotation = Math.floor(timeStamp * 0.5) % 360
        }
        return false
    }

    private HideLoadingImg() {
        egret.stopTick(this.UpdateLoadingImgAnim, this)
        if (this.m_TimeOutId) {
            egret.clearTimeout(this.m_TimeOutId)
            this.m_TimeOutId = null
        }
        if (!this.m_LoadingImg) {
            return
        }
        if (this.m_LoadingImg.parent) {
            this.m_LoadingImg.parent.removeChild(this.m_LoadingImg)
        }
    }

    public mUIGroupYPos = 0

    private onResize() {
        if (this.m_LoadingImg) {
            this.m_LoadingImg.y = egret.MainContext.instance.stage.stageHeight >> 1
        }
        this.m_UIGroup.x = egret.MainContext.instance.stage.stageWidth >> 1
        this.m_UIGroup.y = (egret.MainContext.instance.stage.stageHeight - 1280) >> 1
        this.mUIGroupYPos = this.m_UIGroup.y
        for (let i = this.m_UIGroup.numChildren - 1; i >= 0; --i) {
            let child = this.m_UIGroup.getChildAt(i)
            if (child["onResize"]) {
                child["onResize"]()
            }
        }
    }

    private m_HasLoading = true

    private _CloseView(view: any): void {
        try {
            if (view.Close) {
                view.Close()
            } else {
                console.log("not close func " + view)
            }
        } catch(e) {
            console.log(e)
        }
        
    }

    public ShowGame() {
        if (!this.m_HasLoading) {
            return
        }
        this.m_HasLoading = null
        this.HideLoadingImg()
        this.m_LoadingImg = null
        for (let i = this.m_UIGroup.numChildren - 1; i >= 0; --i) {
            let child = this.m_UIGroup.getChildAt(i)
            if (egret.is(child, "LoadingUI")) {
            }
            this._CloseView(child)
        }
        for (let key in this.mLoadResGroup01) {
            RES.destroyRes(this.mLoadResGroup01[key])
        }
        for (let key in this.mLoadResGroup02) {
            RES.destroyRes(this.mLoadResGroup02[key])
        }
        for (let key in this.mLoadResGroup03) {
            RES.destroyRes(this.mLoadResGroup03[key])
        }
        for (let key in this.mLoadResGroup04) {
            RES.destroyRes(this.mLoadResGroup04[key])
        }
        for (let key in this.mLoadResGroup05) {
            RES.destroyRes(this.mLoadResGroup05[key])
        }
        if (WindowData._GetBGImg()) {
            if (RES.destroyRes(WindowData._GetBGImg())) {
                console.log("destroy res => " + WindowData._GetBGImg())
            }
        }
    }

    private _CheckServerState(serverData: GameServerDescData): boolean {
        if (!serverData) {
            alert("服务器数据为空，请重新登录！！！")
            return false
        }
        if (!serverData.version) {
            alert("服务器正在维护，请稍后重试！！！")
            return false
        }
        if ((serverData.status == 0 || serverData.status > 2) && !this.GmLevel) {
            alert("服务器维护中，请稍后重试！！！")
            return false
        } 
        return true
    }

    private m_ConCallback: Function = null

    public ConnectServer(serverData: GameServerDescData, callback: Function) {
        if (!this._CheckServerState(serverData)) {
            return
        }
        let state = Socket.ins().GetSocketState()
        if (state == Socket.STATUS_CONNECTING) {
            console.log("正在连接")
            return
        }
        if (state == Socket.STATUS_CHECKING) {
            console.log("连接成功")
            if (callback) {
                callback()
            } else {
                console.log("not callback func !")
            }
            return
        }
        this.DoShowLoadingImg()
        this.mConnectServerData = serverData
        let arr = serverData.ip.split(":")
		let host = arr[0]
		let port = arr[1]
        this.m_ConCallback = callback
        Socket.ins().UpdateStateEvent = this.SocketUpdateState.bind(this)
        Socket.ins().connect(host, Number(port))
    }

    public StartLoadGame(serverData: GameServerDescData) {
        this.ConnectServer(serverData, () => {
            this.ShowLoadingUI()
        })
    }

    private _ClearConData() {
        this.HideLoadingImg()
        Socket.ins().UpdateStateEvent = null
        this.m_ConCallback = null
    }

    public SocketUpdateState(state: number) {
        if (state == Socket.STATUS_CHECKING) {
            let func = this.m_ConCallback
            this._ClearConData()
            if (func) {
                func()
            } else {
                console.log("not callback func !!!")
            }
        } else if (state == Socket.STATUS_DISCONNECT) {
            this._ClearConData()
        }
    }

    public GetImg(name: string): egret.Texture {
        return RES.getAnalyzer(RES.ResourceItem.TYPE_SHEET).getRes(name) as egret.Texture
    }

    public GetSingleImg(name: string): egret.Texture {
        let url = this.mLoadResGroup02[name]
        if (!url) {
            url = this.mLoadResGroup05[name]
        }
        if (!url) {
            console.error("not name " + name)
        }
        return RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).getRes(url)
    }

    private _OnLoadItem(obj, name: string) {
        for (let i = 0, len = this.m_CurLoadGroup.length; i < len; ++i) {
            if (this.m_CurLoadGroup[i] == name) {
                this.m_CurLoadGroup.splice(i, 1)
                break
            }
        }
        console.log("loaded => " + name)
        if (this.m_BGImg && name == WindowData._GetBGImg()) {
            if (obj) {
                this.m_BGImg.texture = obj
                this.m_BGImg.x = - ((obj as egret.Texture).textureWidth >> 1)
            }
        }
        if (this.m_CurLoadGroup.length > 0) {
            return
        }
        this._CreateScene()
    }

    private _CreateScene() {
        if (this.m_CurLoadGroup.length > 0) {
            return
        }
        if (WindowData._GetStartType() == 1) {
            if (window["__RemoveLoading"]) {
                window["__RemoveLoading"]()
            }
            if (this.m_NextStepType < 1) {
                return
            }
        } else {
            if (this.m_NextStepType < 1) {
                return
            }
            if (window["__RemoveLoading"]) {
                window["__RemoveLoading"]()
            }
        }
        
        let nextType = this.m_NextStepType
        this.m_NextStepType = -1
        this.CreateGameScene(nextType)
    }

    /**
     * 创建游戏场景
     */
    private CreateGameScene(nextType: number) {
        if (nextType == 1) {
            this.m_UIGroup.addChild(new LoginUI)
        } else if (nextType == 2) {
            if (this.m_CreateRoleData == null) {
                console.error("not server data create")                
            } else {
                let data = this.m_CreateRoleData
                this.m_CreateRoleData = null
                let cls = this.m_CreateRolViewData[0]
                this.m_UIGroup.addChild(new cls(data))

                WindowData.RemoveBg()
                for (let i = this.m_UIGroup.numChildren - 1; i >= 0; --i) {
                    let child = this.m_UIGroup.getChildAt(i)
                    if (!egret.is(child, this.m_CreateRolViewData[1])) {
                        this._CloseView(child)
                    }
                }  
            }
        } else if (nextType == 3) {
            this.m_UIGroup.addChild(new ServerUI)
        } else if (nextType == 4) {
            this.m_UIGroup.addChild(new NoticeUI)
        } else if (nextType == 5) {
            this.m_UIGroup.addChild(new LoadingUI)
            WindowData.RemoveBg()
            for (let i = this.m_UIGroup.numChildren - 1; i >= 0; --i) {
                let child = this.m_UIGroup.getChildAt(i)
                if (!egret.is(child, "LoadingUI")) {
                    this._CloseView(child)
                }
            }  
        }
        this.HideLoadingImg()
    }

    public static closesocket() {
        let ins = (Socket as any)._ins
        if (!ins) {
            return
        }
        ins.close()
    }
}

interface GetPlayerServerInfoData {
    data: {
        player: {username: string, gm_level: number, lid: string},
        maxid: number,
        ns: number,
        lpage: {version: number, status: number, sid: number, addr: string}[],
        recent: {job:number,sex:number,name:string, time: number, status: number, sid: number, version: number, addr: string}[],
    },

    result_msg: string,
	status_msg: string,
	status: number,
	result: number
}


class TestScreenAdapter extends egret.HashObject implements egret.sys.IScreenAdapter {
    /**
     * @private
     * 计算舞台显示尺寸
     * @param scaleMode 当前的缩放模式
     * @param screenWidth 播放器视口宽度
     * @param screenHeight 播放器视口高度
     * @param contentWidth 初始化内容宽度
     * @param contentHeight 初始化内容高度
     */
    public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
        contentWidth = 720
        contentHeight = 1280
        let displayWidth = screenWidth;
        let displayHeight = screenHeight;
        let stageWidth = contentWidth;
        let stageHeight = contentHeight;
        let scaleX = (screenWidth / stageWidth) || 0;
        let scaleY = (screenHeight / stageHeight) || 0;

        let HEIGHT = 1280
        let WIDTH = 720

        let ratio = screenWidth / screenHeight
        let rotio1 = 3 / 4
        let rotio2 = 18 / 16

        if (ratio > rotio1) {
            contentWidth = Math.round(HEIGHT * rotio1)
            stageWidth = contentWidth
            displayWidth = Math.round(contentWidth * scaleY);
        } else if (ratio < 9 / 18) {
            contentHeight = Math.round(WIDTH * 18 / 9)
            stageHeight = contentHeight
            displayHeight = Math.round(contentHeight * scaleX);
		} else if (ratio < 9 / 16) {
            contentHeight = Math.round(WIDTH / ratio)
            stageHeight = contentHeight
            displayHeight = Math.round(contentHeight * scaleX);
        } else {
            stageWidth = Math.round(screenWidth / scaleY);
        }
        //宽高不是2的整数倍会导致图片绘制出现问题
        if (displayWidth % 2 != 0) {
            displayWidth += 1;
        }
        if (displayHeight % 2 != 0) {
            displayHeight += 1;
        }
        // egret.sys.DisplayList.$canvasScaleFactor = stageHeight / displayHeight
        return {
            stageWidth: stageWidth,
            stageHeight: stageHeight,
            displayWidth: displayWidth,
            displayHeight: displayHeight
        };
    }
}
egret.sys.screenAdapter = new TestScreenAdapter