var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RoleMgr = (function (_super) {
    __extends(RoleMgr, _super);
    function RoleMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.errorCode = ["",
            "sql错误",
            "用户没登陆",
            "游戏服务没准备好",
            "角色上一次保存数据是否出现异常",
            "客户端选择角色的常规错误",
            "角色名称重复",
            "角色不存在",
            "错误的性别",
            "随机生成的名字已经分配完",
            "客户端上传的角色阵营参数错误",
            "客户端上传的角色职业参数错误",
            "名称无效，名称中包含非法字符或长度不合法",
            "如果玩家是帮主，不能删除该角色，需要玩家退帮",
            "已经登陆到其他服务器",
            "已经超过最大可建角色数量"
        ];
        _this.m_FirstVerify = true;
        return _this;
    }
    RoleMgr.ins = function () {
        return _super.ins.call(this);
    };
    /**
     * 处理登录认证
     */
    RoleMgr.prototype.doCheckAccount = function (data) {
        var result = data.result;
        GameSocket.ins().CheckAccount(result == 0);
        if (result == 0) {
            console.log("验证成功");
            var QueryList = new Sproto.QueryList_request();
            GameSocket.ins().Rpc(C2sProtocol.QueryList, QueryList, this.doRoleList, this);
        }
        else {
            console.log("验证失败");
            alert(RoleMgr.LONGIN_ERROR_CODE[result]);
            //被顶号
            if (result == 3) {
                window["connectError"]();
            }
            else if (result == 1) {
                // 账号信息已过期，请重新登录
                LocationProperty.Reload();
            }
        }
    };
    ;
    /**
     * 0、无 	1、有		2、 多个
     */
    RoleMgr.GetRoleState = function (data) {
        if (data.actorlist) {
            if (data.actorlist.length > 1) {
                return 2;
            }
            if (data.actorlist.length == 0) {
                return 1;
            }
            return 0;
        }
        if (data.actorid) {
            return 1;
        }
        return 0;
    };
    RoleMgr.GetFirstRole = function (data) {
        if (data.actorlist && data.actorlist.length > 0) {
            return data.actorlist[0].dbid;
        }
        return data.actorid;
    };
    /**
     * 处理角色列表
     */
    RoleMgr.prototype.doRoleList = function (data) {
        if (data.actorlist && data.actorlist.length > 0) {
            data.actorlist.sort(function (lhs, rhs) {
                return lhs.serverindex - rhs.serverindex;
            });
        }
        if (RoleMgr.GetRoleState(data) != 0) {
            this.sendEnterGame(RoleMgr.GetFirstRole(data));
        }
        else {
            var createRoleData = Main.Instance.mCreateRoleData;
            if (createRoleData != null) {
                var name_1 = createRoleData.crn;
                var sex = createRoleData.crji % 2;
                var job = Math.floor(createRoleData.crji / 2) + 1;
                console.log("创建角色中!!!");
                this.sendCreateRole(name_1, (sex), (job));
            }
            else {
                Main.Instance.ShowGame();
                SceneManager.ins().runScene(CreateRoleScene);
            }
        }
    };
    ;
    RoleMgr.EnterGame = function () {
        if (RoleMgr.actorid == 0) {
            console.log("RoleMgr roleid == 0");
            return;
        }
        RoleMgr.ins().sendEnterGame(RoleMgr.actorid);
    };
    /**
     * 请求进入游戏
     */
    RoleMgr.prototype.sendEnterGame = function (actorID) {
        console.log("> SendEnterGame");
        var EnterGame = new Sproto.EnterGame_request();
        EnterGame.actorid = actorID;
        GameSocket.ins().Rpc(C2sProtocol.EnterGame, EnterGame, this.doEnterGame, this);
    };
    /**
     * 处理进入游戏
     */
    RoleMgr.prototype.doEnterGame = function (data) {
        switch (data.result) {
            case 0:
                //验证成功，正在登录游戏
                console.log("进入游戏");
                GameGlobal.RaidMgr.Clear();
                SceneManager.ins().runScene(MainScene);
                break;
            default:
                if (data.result == 4) {
                    alert("帐号被封停，请联系客服QQ：" + (data.QQ || ""));
                }
                else {
                    alert("进入游戏错误码:" + data.result);
                }
                break;
        }
    };
    ;
    /**
     * 请求创建角色
     * @param actorname
     * @param sex
     * @param job
     */
    RoleMgr.prototype.sendCreateRole = function (actorname, sex, job) {
        this.m_TempName = actorname;
        var CreateActor = new Sproto.CreateActor_request();
        CreateActor.actorname = actorname;
        CreateActor.sex = sex;
        CreateActor.job = job;
        CreateActor.icon = 0;
        CreateActor.pf = "";
        GameSocket.ins().Rpc(C2sProtocol.CreateActor, CreateActor, this.doCreateRole, this);
    };
    ;
    /**
     * 处理创建角色
     */
    RoleMgr.prototype.doCreateRole = function (data) {
        if (data.result == 0) {
            RoleMgr.actorid = data.actorid;
            console.log("创建完成，进入游戏!!!");
            this.sendEnterGame(data.actorid);
            // Recharge.DoCreate(data.actorid, this.m_TempName)
        }
        else {
            if (!egret.is(SceneManager.ins().getCurrScene(), "CreateRoleScene")) {
                Main.Instance.ShowGame();
                SceneManager.ins().runScene(CreateRoleScene);
            }
            this.showErrorTips(data.result);
        }
    };
    ;
    RoleMgr.prototype.StartLoadGame = function () {
    };
    /**
     * 弹出错误提示
     */
    RoleMgr.prototype.showErrorTips = function (result) {
        if (result == 0)
            return;
        console.warn("showErrorTips" + result);
        alert(RoleMgr.Create_Actor_Error[result]);
    };
    ;
    RoleMgr.actorid = 0;
    RoleMgr.Create_Actor_Error = [
        "",
        "角色不存在",
        "重复创建角色",
        "创建角色失败",
        "性别职业错误",
        "角色名称重复",
        "角色名含特殊字符",
        "角色名过长",
        "角色名含有屏蔽字",
        "角色名称重复",
    ];
    RoleMgr.LONGIN_ERROR_CODE = [
        "",
        "账号信息已过期，请重新登录",
        "没有这个账号",
        "账号已登录，请刷新页面，最长需等待3分钟后重新登录",
        "服务器忙",
        "服务器维护中",
        "Session服务器出错，可能数据库没连接好",
        // "不存在这个服务器",
        "服务器正在维护中！！！",
        "账号已纳入防沉迷系统，是否需要进行身份证信息填写？"
    ];
    return RoleMgr;
}(BaseSystem));
__reflect(RoleMgr.prototype, "RoleMgr");
//# sourceMappingURL=RoleMgr.js.map