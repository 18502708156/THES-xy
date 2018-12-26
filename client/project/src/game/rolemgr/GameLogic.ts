/**主逻辑管理器 */
class GameLogic extends BaseSystem {

    /** 个人数据 */
    actorModel = new ActorModel;

    isInit = true;

    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.gold_change, this.doGoldChange);
        this.regNetMsg(S2cProtocol.exp_change, this.doExp);
        this.regNetMsg(S2cProtocol.sub_role_att_change, this.doSubRoleAtt);
        this.regNetMsg(S2cProtocol.show_server_tip, this.doTips);
        this.regNetMsg(S2cProtocol.first_register, this.doFirstRegister);
        this.regNetMsg(S2cProtocol.sc_welcome, this.doWelcome);
        this.RegNetMsgs(S2cProtocol.player_guild_change, this.doGuildChange);

        this.regNetMsg(S2cProtocol.sc_actor_base, this.doActorInfo)
    }

    public static ins(): GameLogic {
        return super.ins();
    };

    public SendClientPoint(point: number): void {
        let req = new Sproto.cs_send_client_point_request
        req.point = point
        this.Rpc(C2sProtocol.cs_send_client_point, req)
    }

    /**发送创建子角色 */
    public sendNewRole(job, sex) {
        var cs_create_new_sub_role = new Sproto.cs_create_new_sub_role_request();
        cs_create_new_sub_role.job = job;
        cs_create_new_sub_role.sex = sex;
        GameSocket.ins().Rpc(C2sProtocol.cs_create_new_sub_role, cs_create_new_sub_role);
    };

    public static SendGM(str) {
        var cs_sene_gm_command = new Sproto.cs_sene_gm_command_request();
        cs_sene_gm_command.cmd = str;
        GameSocket.ins().Rpc(C2sProtocol.cs_sene_gm_command, cs_sene_gm_command);
    }

    /**
     * 处理个人信息
     */
    public doActorInfo(data: Sproto.sc_actor_base_request) {
        GameLogic.ins().actorModel.parser(data);
        // Shop.ins().shopNorefrush = data.shopNorefrush
        // CrossEliteBossModel.ins().delayToReqCrossEliteBossList()
        if (this.isInit) {
            this.isInit = false
            GameGlobal.MessageCenter.dispatch(MessageDef.postInitActorInfo)
        }
        // if (Shop.ins().shopNorefrush && GameGlobal.UserFb.guanqiaID >= 11) {
        //     Shop.ins().NotifyShop(true)
        // }

        // Recharge.DoEnter()
    };

    /**
     * 处理金钱变化
     */
    public doGoldChange(rsp: Sproto.gold_change_request) {
        var model = GameLogic.ins().actorModel;
        var type = rsp.type;
        if (type == 1) {
            var oldGold = model.gold;
            var newGold = rsp.value;
            model.gold = newGold;
            if (newGold != oldGold) {
                GameGlobal.MessageCenter.dispatch(MessageDef.GOLD_CHANGE)
            }
        } else if (type == 4) {
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
        } else if (type == MoneyConst.yuanbao) {
            var oldYb = model.yb;
            var newYb = rsp.value;
            model.yb = newYb;
            if (oldYb != newYb) {
                GameGlobal.MessageCenter.dispatch(MessageDef.YB_CHANGE)
            }
        } else if (type == MoneyConst.byb) {
            let oldVal = model.byb
            let newVal = rsp.value
            model.byb = newVal
            if (oldVal != newVal) {
                GameGlobal.MessageCenter.dispatch(MessageDef.BYB_CHANGE)
            }
        } else if (type == MoneyConst.GuildContrib) {
            var oldContrib = model.contrib;
            var newContrib = rsp.value;
            model.contrib = newContrib;
            if (newContrib > oldContrib) {
                let src = ResDataPath.GetItemFullPath("item1009")
                UserTips.ins().showContTips("帮会贡献 +" + (newContrib - oldContrib),src)
            }
            if (newContrib != oldContrib) {
                GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_CONTRIB_UPDATE)
            }
        } else if (type == MoneyConst.GuildFund) {
            let value = rsp.value
            if (value > 0) {
                if (value > 0) {
                    UserTips.ins().showTips("帮会资金 +" + value)
                }
            }
        } else if (type == MoneyConst.Medal) {
            let value = rsp.value
            let addvalue = value - GameGlobal.Arena.getMedal()
            if (addvalue > 0) {
                UserTips.ins().showTips("功勋 +" + addvalue)
            }
            if (value > 0) {
                GameGlobal.Arena.setMedal(value)
            }
        } else if (type == MoneyConst.FriendCion) {
            let value = rsp.value - model.friendCoin
            if (value > 0)
                UserTips.ins().showTips("友情币*" + value)
            model.friendCoin = rsp.value;
        }
        else {
            console.warn("GameLogic:doGoldChange type => " + type)
        }
    };

    /**
     * 处理经验变化
     */
    public doExp(rsp: Sproto.exp_change_request) {
        var model = GameLogic.ins().actorModel;
        var oldLevel = model.level;
        var newLevel = rsp.level;
        model.level = newLevel;
        let oldExp = model.exp;
        let newExp = rsp.exp;
        model.exp = newExp;
        if (oldExp != newExp)
            GameGlobal.MessageCenter.dispatch(MessageDef.EXP_CHANGE)
        if (oldLevel < model.level) {
            this.levelEffect();
        }
        if (rsp.upexp > 0) {
            let src = ResDataPath.GetItemFullPath("ui_zjm_exp1")
            UserTips.ins().showContTips("|C:0x23CA23&T:经验 +" + rsp.upexp + "|",src);
        }
    };

    /**
     * 处理属性变化
     * 0-8
     * @param bytes
     */
    public doSubRoleAtt(rsp: Sproto.sub_role_att_change_request) {
        // SubRoles.ins().doSubRole(bytes);
        SubRoles.ins().doSubRoleAtt(rsp);
    };

    /**
     * 显示服务器提示
     */
    public doTips(bytes: Sproto.show_server_tip_request) {
    }

    /**
     * 第一次登陆
     */
    public doFirstRegister(bytes) {
        //ViewManager.ins().open(WelcomeWin);
        //ViewManager.ins().open(WelComeLandingPanel);
    }
    /**
     * 新号欢迎界面
     */
    public doWelcome():void
    {
        ViewManager.ins().open(WelComeLandingPanel);
    }
    /**
     * 发送_欢迎确认
     */
    public static SendWelcome() 
    {
        GameSocket.ins().Rpc(C2sProtocol.cs_welcome_confirm);
    }

    /**
     * 处理玩家帮会变化
     */
    public doGuildChange(bytes: Sproto.player_guild_change_request) {
        GameLogic.ins().actorModel.setGuild(bytes.guildID, bytes.guildName);
    }

    //更新属性
    public doGuildFbBossBlood(bytes) {
    }

    /**
     * 请求改名
     */
    public sendRename(name) {
        var req = new Sproto.cs_change_player_name_request();
        req.name = name;
        GameSocket.ins().Rpc(C2sProtocol.cs_change_player_name, req);
    }

    /** 播放升级特效 */
    public levelEffect() {
        // var char = EntityManager.ins().getNoDieRole();
        // if (char) {
        //     var mc = new MovieClip;
        //     mc.loadFile(ResDataPath.GetUIEffePath("levelUpEffect"), true, 1);
        //     char.addChild(mc);
        // }
    }
}