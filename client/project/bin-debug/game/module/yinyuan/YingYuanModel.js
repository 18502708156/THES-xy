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
var YingYuanModel = (function (_super) {
    __extends(YingYuanModel, _super);
    function YingYuanModel() {
        var _this = _super.call(this) || this;
        _this.marryFRIend = null;
        _this.askMarry = [];
        _this.marryInvita = [];
        _this.marrySFlower = [];
        _this.friend = [];
        _this.marryLove = [];
        _this.partner = null;
        _this.time = Math.floor(Math.random() * 2 + 300);
        _this.isOpenEff = false;
        _this.EFFXY = [
            [300, 300], [300, 700], [700, 700], [700, 200], [450, 450]
        ];
        _this.regNetMsg(S2cProtocol.sc_marry_info, _this.getMarryInfo);
        _this.regNetMsg(S2cProtocol.sc_marry_asked, _this.marryAsked);
        _this.regNetMsg(S2cProtocol.sc_marry_remove_asked, _this.removeAsked);
        _this.regNetMsg(S2cProtocol.sc_marry_invitation, _this.marryInvitation);
        _this.regNetMsg(S2cProtocol.sc_marry_recv_flower, _this.marryRecvFlower);
        _this.regNetMsg(S2cProtocol.sc_marry_login_tip, _this.marryLoginTip);
        _this.regNetMsg(S2cProtocol.sc_marry_new, _this.marryNew);
        _this.regNetMsg(S2cProtocol.sc_marry_friends, _this.marryFriends);
        _this.regNetMsg(S2cProtocol.sc_marry_divorce_bro, _this.divorceBro);
        _this.regNetMsg(S2cProtocol.sc_marry_love_info, _this.MarryLoveInfo);
        _this.regNetMsg(S2cProtocol.sc_marry_house_partner_up, _this.DoAddHouseShareExp);
        _this.regNetMsg(S2cProtocol.sc_marry_flower_bro, _this.marryFlowerBro);
        return _this;
    }
    YingYuanModel.prototype.getRole = function (player) {
        var list = [];
        var entityRole = new EntityRole;
        entityRole.parserBase({
            ownerid: player.dbid,
            handler: player.dbid,
            type: EntityType.Role,
            shows: {
                job: player.job,
                sex: player.sex,
                shows: player.shows
            },
        });
        entityRole.entityName = player.name;
        return entityRole;
    };
    YingYuanModel.prototype.TimeLove = function () {
        for (var i = 0; i < this.marryLove.length; i++) {
            if (this.marryLove[i].time > 0) {
                this.marryLove[i].time--;
            }
        }
    };
    /*
     恩爱
     */
    YingYuanModel.prototype.UseMarryLove = function (type) {
        var lovetype = new Sproto.cs_marry_love_use_request;
        lovetype.lovetype = type;
        this.Rpc(C2sProtocol.cs_marry_love_use, lovetype, this.UseMarryLoveRule);
    };
    YingYuanModel.prototype.UseMarryLoveRule = function (rsp) {
        if (rsp.ret) {
            //			UserTips.InfoTip("使用成功")
        }
    };
    YingYuanModel.prototype.RevertMarryLove = function (type) {
        var lovetype = new Sproto.cs_marry_love_revert_request;
        lovetype.lovetype = type;
        this.Rpc(C2sProtocol.cs_marry_love_revert, lovetype, this.ReverMarryLoveRule);
    };
    YingYuanModel.prototype.ReverMarryLoveRule = function (rsp) {
        if (rsp.ret) {
            //UserTips.InfoTip("回复成功")
        }
    };
    YingYuanModel.prototype.SendLoveInfo = function () {
        this.Rpc(C2sProtocol.cs_marry_love_info);
    };
    YingYuanModel.prototype.MarryLoveInfo = function (rsp) {
        this.marryLove = rsp.loves;
        GameGlobal.MessageCenter.dispatch(MessageDef.MARRY_LOVE_INFO);
    };
    YingYuanModel.prototype.getMarryLove = function (id) {
        for (var i = 0; i < this.marryLove.length; i++) {
            if (this.marryLove[i].lovetype == id) {
                return this.marryLove[i];
            }
        }
    };
    /* */
    YingYuanModel.prototype.iSMarry = function () {
        if (!this.marryInfo) {
            return false;
        }
        return this.marryInfo.marry;
    };
    YingYuanModel.prototype.getOther = function () {
        if (this.iSMarry()) {
            if (this.marryInfo.husband.dbid != GameGlobal.GameLogic.actorModel.actorID) {
                return this.marryInfo.husband;
            }
            else {
                return this.marryInfo.wife;
            }
        }
    };
    YingYuanModel.prototype.divorceBro = function (rsp) {
        for (var i = 0; i < this.marryInvita.length; i++) {
            if (this.marryInvita[i].dbid == rsp.ids[0] || this.marryInvita[i].dbid == rsp.ids[1]) {
                this.marryInvita.splice(i, 1);
                break;
            }
        }
        this.removeAllFlower();
        GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO);
    };
    YingYuanModel.prototype.getOtherData = function () {
        if (this.iSMarry()) {
            if (this.marryInfo.husband.dbid == GameGlobal.actorModel.actorID) {
                return this.marryInfo.wife;
            }
            else {
                return this.marryInfo.husband;
            }
        }
    };
    YingYuanModel.prototype.sendMarryFriends = function () {
        this.Rpc(C2sProtocol.cs_marry_friends);
    };
    YingYuanModel.prototype.getMarryInfo = function (rsp) {
        this.marryInfo = rsp;
        this.askMarry = [];
        ViewManager.ins().close(ShouDaoPanel);
        GameGlobal.MessageCenter.dispatch(MessageDef.IS_MARRY_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_UPDATE_INFO);
        if (this.marryInfo.marry == false && this.marryInfo.grade > 0) {
            this.shareUpInfo = null;
            GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE);
            GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_UPDATE_SINGLE);
        }
    };
    YingYuanModel.prototype.marryPropose = function (targetid, grade, spouse) {
        var Pro = new Sproto.cs_marry_propose_request();
        Pro.targetid = targetid;
        Pro.grade = grade;
        Pro.spouse = spouse;
        this.Rpc(C2sProtocol.cs_marry_propose, Pro, this.marryProRule);
    };
    YingYuanModel.prototype.marryProRule = function (rsp) {
        if (rsp.ret == 0) {
            UserTips.InfoTip("已发送");
            // this.askMarry = []
            // ViewManager.ins().close(ShouDaoPanel)
        }
    };
    YingYuanModel.prototype.MarryConfigLen = function () {
        var Config = GameGlobal.Config.MarryConfig;
        var Len = 0;
        for (var data in Config) {
            Len++;
        }
        return Len;
    };
    YingYuanModel.prototype.getFriendData = function (data) {
        this.marryFRIend = data;
        ViewManager.ins().close(YingYuanAddPanel);
        GameGlobal.MessageCenter.dispatch(MessageDef.YING_YUAN_HEAD);
    };
    YingYuanModel.prototype.marryAsked = function (rsp) {
        this.askMarry.push(rsp);
        this.askMarry.sort(function (lhs, rhs) {
            return lhs.power - rhs.power;
        });
        GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO);
    };
    YingYuanModel.prototype.removeAsked = function (rsp) {
        for (var i = 0; i < this.askMarry.length; i++) {
            if (this.askMarry[i].fromid == rsp.fromid) {
                this.askMarry.splice(i, 1);
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO);
    };
    YingYuanModel.prototype.marryAnswer = function (agree, id) {
        var data = new Sproto.cs_marry_answer_request;
        data.agree = agree;
        data.fromid = id;
        this.Rpc(C2sProtocol.cs_marry_answer, data);
    };
    YingYuanModel.prototype.removeAnswer = function (id) {
        for (var i = 0; i < this.askMarry.length; i++) {
            if (this.askMarry[i].fromid == id) {
                this.askMarry.splice(i, 1);
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO);
    };
    YingYuanModel.prototype.marryLevelUp = function () {
        this.Rpc(C2sProtocol.cs_marry_levelup);
    };
    YingYuanModel.prototype.marryDivorce = function () {
        this.Rpc(C2sProtocol.cs_marry_divorce);
        UserTips.InfoTip("离婚成功");
    };
    YingYuanModel.prototype.marryInvitation = function (rsp) {
        this.marryInvita.push(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO);
        if (rsp.effect) {
            this.mcName = "eff_ui_yanhua";
            this.openEff();
        }
    };
    YingYuanModel.prototype.marryGreeting = function (id, quantity) {
        var Greet = new Sproto.cs_marry_greeting_request;
        Greet.dbid = id;
        Greet.quantity = quantity;
        this.Rpc(C2sProtocol.cs_marry_greeting, Greet, this.marryGreetingRule);
    };
    YingYuanModel.prototype.marryGreetingRule = function (rsp) {
        if (rsp.ret == 0) {
            ViewManager.ins().close(YingYuanHeLiPanel);
            this.marryInvita.splice(0, 1);
            GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO);
        }
    };
    YingYuanModel.prototype.marryFlower = function (quantity, count, autobuy) {
        var Flower = new Sproto.cs_marry_flower_request;
        Flower.quantity = quantity;
        Flower.count = count;
        Flower.autobuy = autobuy;
        this.Rpc(C2sProtocol.cs_marry_flower, Flower, this.marryFlowerRule);
    };
    YingYuanModel.prototype.marryFlowerRule = function (rsp) {
        if (rsp.ret == 0) {
            ViewManager.ins().close(YingYuanXianHuaPanel);
            this.mcName = "eff_ui_huaban";
            this.openEff2();
        }
    };
    YingYuanModel.prototype.marryLoginTip = function (rsp) {
        this.partner = rsp.partner;
        ViewManager.ins().open(YingYuanZjmPanel);
    };
    YingYuanModel.prototype.marryRecvFlower = function (rsp) {
        this.marrySFlower.push(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO);
        this.mcName = "eff_ui_huaban";
        this.openEff2();
    };
    YingYuanModel.prototype.flower = function (index) {
        this.marrySFlower.splice(index, 1);
        GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO);
    };
    YingYuanModel.prototype.marryNew = function () {
        //ViewManager.ins().open(YingYuanZhengShuPanel)
        this.mcName = "eff_ui_yanhua";
        this.openEff();
    };
    YingYuanModel.prototype.marryFlowerBro = function (rsp) {
        if (rsp.effect) {
            this.mcName = "eff_ui_huaban";
            this.openEff2();
        }
    };
    YingYuanModel.prototype.openEff = function () {
        if (this.isOpenEff) {
            this.isOpenEff = false;
        }
        // TimerManager.ins().doTimer(this.time, 24, this.playEffMove, this, this.closeEff)
    };
    YingYuanModel.prototype.closeEff = function () {
        this.isOpenEff = true;
    };
    YingYuanModel.prototype.openEff2 = function () {
        // this.playEffMove2()
    };
    // public playEffMove2() {
    // 	if (!this.mcName) {
    // 		return
    // 	}
    // 	let eff = new MovieClip
    // 	eff.loadUrl(ResDataPath.GetUIEffePath2(this.mcName), true, 12);
    // 	eff.scaleX = 2
    // 	eff.scaleY = 2
    // 	eff.x = this.EFFXY[4][0]
    // 	eff.y = this.EFFXY[4][1]
    // 	LayerManager.UI_Tips.addChild(eff)
    // }
    // public playEffMove() {
    // 	if (!this.mcName) {
    // 		return
    // 	}
    // 	this.time = Math.floor(Math.random() * 2 + 300)
    // 	let eff = this.playEff(this.mcName)
    // 	let index = Math.floor(Math.random() * this.EFFXY.length)
    // 	eff.x = this.EFFXY[index][0]
    // 	eff.y = this.EFFXY[index][1]
    // 	let scale = Math.floor(Math.random() * 1 + 1)
    // 	eff.scaleX = scale
    // 	eff.scaleY = scale
    // 	LayerManager.UI_Tips.addChild(eff)
    // }
    // public playEff(str: string) {
    // 	let allSrcenEff = new MovieClip
    // 	allSrcenEff.loadUrl(ResDataPath.GetUIEffePath2(str), true, 1);
    // 	return allSrcenEff
    // }
    YingYuanModel.prototype.marryFriends = function (rsp) {
        this.friend = rsp.friends;
    };
    YingYuanModel.prototype.getMarryFriends = function (id) {
        for (var i = 0; i < this.friend.length; i++) {
            if (this.friend[i].dbid == id) {
                return this.friend[i];
            }
        }
    };
    YingYuanModel.prototype.removeAllFlower = function () {
        this.marrySFlower = [];
        GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO);
    };
    /**房屋 */
    //////////////////////////////////////////////////////////////////
    YingYuanModel.prototype.DoAddHouseShareExp = function (rsp) {
        this.shareUpInfo = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE);
    };
    YingYuanModel.prototype.SendAddHouseExp = function () {
        this.Rpc(C2sProtocol.cs_marry_house_addexp);
    };
    YingYuanModel.prototype.SendHouseBuild = function (grade) {
        var req = new Sproto.cs_marry_house_grade_request;
        req.grade = grade;
        this.Rpc(C2sProtocol.cs_marry_house_grade, req, function (rsp) {
            if (rsp.ret) {
            }
        }, this);
    };
    YingYuanModel.prototype.SendAddHouseShareExp = function () {
        this.Rpc(C2sProtocol.cs_marry_house_use_partner_up);
        this.shareUpInfo = null;
        GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE);
    };
    YingYuanModel.prototype.GetIntimacy = function () {
        if (!this.marryInfo) {
            return 0;
        }
        return this.marryInfo.intimacy;
    };
    YingYuanModel.prototype.GetHouseGrade = function () {
        if (!this.marryInfo) {
            return 0;
        }
        return this.marryInfo.grade || 0;
    };
    YingYuanModel.prototype.GetHouseLv = function () {
        if (!this.marryInfo) {
            return [];
        }
        return [this.marryInfo.houselv, this.marryInfo.houseup];
    };
    YingYuanModel.prototype.GetPower = function () {
        if (!this.marryInfo) {
            return 0;
        }
        return HouseConst.GetPower(this.marryInfo.grade, this.marryInfo.houselv, this.marryInfo.houseup);
    };
    YingYuanModel.prototype.GetCurAttr = function () {
        return HouseConst.GetHouseTotalAttr(this.marryInfo.grade, this.marryInfo.houselv, this.marryInfo.houseup);
    };
    YingYuanModel.prototype.GetNextAttr = function () {
        if (!this.marryInfo) {
            return 0;
        }
        return HouseConst.GetHouseLevelAttr(this.marryInfo.grade, this.marryInfo.houselv + 1);
    };
    YingYuanModel.prototype.IsMaxLevel = function () {
        if (!this.marryInfo) {
            return false;
        }
        return HouseConst.IsMaxLevel(this.marryInfo.grade, this.marryInfo.houselv);
    };
    YingYuanModel.prototype.GetCostIntimacy = function () {
        var config = HouseConst.GetHouseConfig(this.marryInfo.grade, this.marryInfo.houselv);
        return config ? (config.Intimacy || 0) : 0;
    };
    YingYuanModel.prototype.GetHouseUpnum = function () {
        var config = HouseConst.GetHouseConfig(this.marryInfo.grade, this.marryInfo.houselv);
        return (config ? config.exp : 0) * (GameGlobal.Config.MarryBaseConfig.exp);
    };
    YingYuanModel.prototype.IsMaxGrage = function () {
        var config = HouseConst.GetHouseShowConfig(this.marryInfo.grade + 1);
        return config == null;
    };
    YingYuanModel.prototype.GetBuildCost = function (grade) {
        var config = HouseConst.GetHouseShowConfig(grade);
        var orgConfig = HouseConst.GetHouseShowConfig(this.marryInfo.grade);
        return {
            type: config.price.type,
            id: config.price.id,
            count: config.price.count - orgConfig.price.count
        };
    };
    YingYuanModel.prototype.CanUpgrade = function () {
        if (!this.marryInfo || !this.marryInfo.marry || this.IsMaxLevel()) {
            return false;
        }
        return this.GetCostIntimacy() <= this.GetIntimacy();
    };
    return YingYuanModel;
}(BaseSystem));
__reflect(YingYuanModel.prototype, "YingYuanModel");
//# sourceMappingURL=YingYuanModel.js.map