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
/**主逻辑管理器 */
var GameLogic = (function (_super) {
    __extends(GameLogic, _super);
    function GameLogic() {
        var _this = _super.call(this) || this;
        /** 个人数据 */
        _this.actorModel = new ActorModel;
        _this.isInit = true;
        _this.regNetMsg(S2cProtocol.gold_change, _this.doGoldChange);
        _this.regNetMsg(S2cProtocol.exp_change, _this.doExp);
        _this.regNetMsg(S2cProtocol.sub_role_att_change, _this.doSubRoleAtt);
        _this.regNetMsg(S2cProtocol.show_server_tip, _this.doTips);
        _this.regNetMsg(S2cProtocol.first_register, _this.doFirstRegister);
        _this.regNetMsg(S2cProtocol.sc_welcome, _this.doWelcome);
        _this.RegNetMsgs(S2cProtocol.player_guild_change, _this.doGuildChange);
        _this.regNetMsg(S2cProtocol.sc_actor_base, _this.doActorInfo);
        return _this;
    }
    GameLogic.ins = function () {
        return _super.ins.call(this);
    };
    ;
    GameLogic.prototype.SendClientPoint = function (point) {
        var req = new Sproto.cs_send_client_point_request;
        req.point = point;
        this.Rpc(C2sProtocol.cs_send_client_point, req);
    };
    /**发送创建子角色 */
    GameLogic.prototype.sendNewRole = function (job, sex) {
        var cs_create_new_sub_role = new Sproto.cs_create_new_sub_role_request();
        cs_create_new_sub_role.job = job;
        cs_create_new_sub_role.sex = sex;
        GameSocket.ins().Rpc(C2sProtocol.cs_create_new_sub_role, cs_create_new_sub_role);
    };
    ;
    GameLogic.SendGM = function (str) {
        var cs_sene_gm_command = new Sproto.cs_sene_gm_command_request();
        cs_sene_gm_command.cmd = str;
        GameSocket.ins().Rpc(C2sProtocol.cs_sene_gm_command, cs_sene_gm_command);
    };
    /**
     * 处理个人信息
     */
    GameLogic.prototype.doActorInfo = function (data) {
        GameLogic.ins().actorModel.parser(data);
        // Shop.ins().shopNorefrush = data.shopNorefrush
        // CrossEliteBossModel.ins().delayToReqCrossEliteBossList()
        if (this.isInit) {
            this.isInit = false;
            GameGlobal.MessageCenter.dispatch(MessageDef.postInitActorInfo);
        }
        // if (Shop.ins().shopNorefrush && GameGlobal.UserFb.guanqiaID >= 11) {
        //     Shop.ins().NotifyShop(true)
        // }
        // Recharge.DoEnter()
    };
    ;
    /**
     * 处理金钱变化
     */
    GameLogic.prototype.doGoldChange = function (rsp) {
        var model = GameLogic.ins().actorModel;
        var type = rsp.type;
        if (type == 1) {
            var oldGold = model.gold;
            var newGold = rsp.value;
            model.gold = newGold;
            if (newGold != oldGold) {
                GameGlobal.MessageCenter.dispatch(MessageDef.GOLD_CHANGE);
            }
        }
        else if (type == 4) {
            var num = rsp.value;
            if (model.soul > 0) {
                var addSoul = num - model.soul;
                if (addSoul > 0) {
                    var str = "";
                    str = "|C:0xffb02d&T:灵魄  +" + addSoul + "|";
                    UserTips.ins().showTips(str);
                }
            }
            model.soul = num;
        }
        else if (type == MoneyConst.yuanbao) {
            var oldYb = model.yb;
            var newYb = rsp.value;
            model.yb = newYb;
            if (oldYb != newYb) {
                GameGlobal.MessageCenter.dispatch(MessageDef.YB_CHANGE);
            }
        }
        else if (type == MoneyConst.byb) {
            var oldVal = model.byb;
            var newVal = rsp.value;
            model.byb = newVal;
            if (oldVal != newVal) {
                GameGlobal.MessageCenter.dispatch(MessageDef.BYB_CHANGE);
            }
        }
        else if (type == MoneyConst.GuildContrib) {
            var oldContrib = model.contrib;
            var newContrib = rsp.value;
            model.contrib = newContrib;
            if (newContrib > oldContrib) {
                var src = ResDataPath.GetItemFullPath("item1009");
                UserTips.ins().showContTips("帮会贡献 +" + (newContrib - oldContrib), src);
            }
            if (newContrib != oldContrib) {
                GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_CONTRIB_UPDATE);
            }
        }
        else if (type == MoneyConst.GuildFund) {
            var value = rsp.value;
            if (value > 0) {
                if (value > 0) {
                    UserTips.ins().showTips("帮会资金 +" + value);
                }
            }
        }
        else if (type == MoneyConst.Medal) {
            var value = rsp.value;
            var addvalue = value - GameGlobal.Arena.getMedal();
            if (addvalue > 0) {
                UserTips.ins().showTips("功勋 +" + addvalue);
            }
            if (value > 0) {
                GameGlobal.Arena.setMedal(value);
            }
        }
        else if (type == MoneyConst.FriendCion) {
            var value = rsp.value - model.friendCoin;
            if (value > 0)
                UserTips.ins().showTips("友情币*" + value);
            model.friendCoin = rsp.value;
        }
        else {
            console.warn("GameLogic:doGoldChange type => " + type);
        }
    };
    ;
    /**
     * 处理经验变化
     */
    GameLogic.prototype.doExp = function (rsp) {
        var model = GameLogic.ins().actorModel;
        var oldLevel = model.level;
        var newLevel = rsp.level;
        model.level = newLevel;
        var oldExp = model.exp;
        var newExp = rsp.exp;
        model.exp = newExp;
        if (oldExp != newExp)
            GameGlobal.MessageCenter.dispatch(MessageDef.EXP_CHANGE);
        if (oldLevel < model.level) {
            this.levelEffect();
        }
        if (rsp.upexp > 0) {
            var src = ResDataPath.GetItemFullPath("ui_zjm_exp1");
            UserTips.ins().showContTips("|C:0x23CA23&T:经验 +" + rsp.upexp + "|", src);
        }
    };
    ;
    /**
     * 处理属性变化
     * 0-8
     * @param bytes
     */
    GameLogic.prototype.doSubRoleAtt = function (rsp) {
        // SubRoles.ins().doSubRole(bytes);
        SubRoles.ins().doSubRoleAtt(rsp);
    };
    ;
    /**
     * 显示服务器提示
     */
    GameLogic.prototype.doTips = function (bytes) {
    };
    /**
     * 第一次登陆
     */
    GameLogic.prototype.doFirstRegister = function (bytes) {
        //ViewManager.ins().open(WelcomeWin);
        //ViewManager.ins().open(WelComeLandingPanel);
    };
    /**
     * 新号欢迎界面
     */
    GameLogic.prototype.doWelcome = function () {
        ViewManager.ins().open(WelComeLandingPanel);
    };
    /**
     * 发送_欢迎确认
     */
    GameLogic.SendWelcome = function () {
        GameSocket.ins().Rpc(C2sProtocol.cs_welcome_confirm);
    };
    /**
     * 处理玩家帮会变化
     */
    GameLogic.prototype.doGuildChange = function (bytes) {
        GameLogic.ins().actorModel.setGuild(bytes.guildID, bytes.guildName);
    };
    //更新属性
    GameLogic.prototype.doGuildFbBossBlood = function (bytes) {
    };
    /**
     * 请求改名
     */
    GameLogic.prototype.sendRename = function (name) {
        var req = new Sproto.cs_change_player_name_request();
        req.name = name;
        GameSocket.ins().Rpc(C2sProtocol.cs_change_player_name, req);
    };
    /** 播放升级特效 */
    GameLogic.prototype.levelEffect = function () {
        // var char = EntityManager.ins().getNoDieRole();
        // if (char) {
        //     var mc = new MovieClip;
        //     mc.loadFile(ResDataPath.GetUIEffePath("levelUpEffect"), true, 1);
        //     char.addChild(mc);
        // }
    };
    return GameLogic;
}(BaseSystem));
__reflect(GameLogic.prototype, "GameLogic");
//# sourceMappingURL=GameLogic.js.map