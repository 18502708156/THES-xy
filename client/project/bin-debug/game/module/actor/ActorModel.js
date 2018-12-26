var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActorModel = (function () {
    function ActorModel() {
        /** 战斗力 */
        this._power = 0;
        this._guildID = 0;
        this._gold = 0;
        this._yb = 0;
        this._byb = 0;
        this.friendCoin = 0;
        this.mSaveDataList = [];
    }
    ActorModel.IsGM = function () {
        return Main.Instance.GmLevel == 100;
    };
    ActorModel.IsSimpleGM = function () {
        if (true) {
            return true;
        }
        return Main.Instance.GmLevel >= 1;
    };
    Object.defineProperty(ActorModel.prototype, "vipLv", {
        get: function () {
            return UserVip.ins().lv;
        },
        enumerable: true,
        configurable: true
    });
    ActorModel.prototype.SendUpLevel = function () {
        GameSocket.ins().Rpc(C2sProtocol.cs_change_role_level);
    };
    ActorModel.prototype.parser = function (data) {
        this.setGuild(data.guildid, data.guildname);
        this.actorID = data.actorid;
        this.job = data.job;
        this.sex = data.sex;
        // 更新当前的服务器ID
        if (Main.Instance.mConnectServerData) {
            Main.Instance.mConnectServerData.id = data.serverid;
        }
        this._name = data.actorname;
        this._level = data.level;
        this._exp = data.exp;
        this._power = data.power || 0;
        this._gold = data.gold;
        this._yb = data.yuanbao;
        this._contrib = data.contrib;
        this._byb = data.byb;
        this.friendCoin = data.friendcoin;
        UserVip.ins().lv = data.vip;
        var BagBaseConfig = GlobalConfig.ins().BagBaseConfig;
        UserBag.ins().bagNum = data.bagnum * BagBaseConfig.rowSize + BagBaseConfig.baseSize;
        this.mSaveData = data.clientvalue;
        this.mSaveDataList = data.clientvaluelist || [];
        GameGlobal.SoundManager.SetBgOn(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY));
        GameGlobal.MessageCenter.dispatch(MessageDef.POWER_CHANGE);
        egret.setTimeout(this.InitMsg, this, 1000);
        GameGlobal.MessageCenter.dispatch(MessageDef.INIT_ACTOR);
        GameGlobal.EntityEffMgr.RefActorEff(this.job);
    };
    Object.defineProperty(ActorModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            if (this._name != value) {
                this._name = value;
                MessageCenter.ins().dispatch(MessageDef.NAME_CHANGE);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "byb", {
        get: function () {
            return this._byb;
        },
        set: function (value) {
            if (this._byb != value) {
                var addGold = value - this._byb;
                if (addGold > 0) {
                    var str = "";
                    str = "|C:0xffb02d&T:绑元  +" + addGold + "|";
                    var src = ResDataPath.GetItemFullPath("ui_icon_item_4203");
                    UserTips.ins().showContTips(str, src);
                }
                this._byb = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "gold", {
        get: function () {
            return this._gold;
        },
        set: function (value) {
            if (this._gold != value) {
                var addGold = value - this._gold;
                if (addGold > 0) {
                    var str = "";
                    str = "|C:0xffb02d&T:银两  +" + addGold + "|";
                    var src = ResDataPath.GetItemFullPath("ui_icon_item_4202");
                    UserTips.ins().showContTips(str, src);
                }
                this._gold = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "yb", {
        get: function () {
            return this._yb;
        },
        set: function (value) {
            if (this._yb != value) {
                var addYB = value - this._yb;
                if (addYB > 0) {
                    var str = "";
                    str = "|C:0xffb02d&T:元宝  +" + addYB + "|";
                    var src = ResDataPath.GetItemFullPath("ui_icon_item_4204");
                    UserTips.ins().showContTips(str, src);
                }
                this._yb = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (value) {
            if (this._level != value) {
                this._level = value;
                MessageCenter.ins().dispatch(MessageDef.LEVEL_CHANGE);
                Deblocking.Update(Deblocking.CHECK_TYPE_02);
                if (this._level == 20) {
                    // Shop.ins().NotifyShop(true)
                }
                // Recharge.DoUpgrate()
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "exp", {
        get: function () {
            return this._exp;
        },
        set: function (value) {
            if (this._exp != value) {
                this._exp = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "contrib", {
        get: function () {
            return this._contrib;
        },
        set: function (value) {
            if (this._contrib != value) {
                this._contrib = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorModel.prototype, "power", {
        get: function () {
            return this._power;
        },
        enumerable: true,
        configurable: true
    });
    ActorModel.prototype.SetPower = function (value, notTip) {
        if (this._power != value) {
            if (this._power < value && this._power > 0) {
                if (!notTip) {
                    MessageCenter.ins().dispatch(MessageDef.POWER_BOOST, value, this._power);
                }
            }
            this._power = value;
            MessageCenter.ins().dispatch(MessageDef.POWER_CHANGE);
        }
    };
    ActorModel.prototype.setGuild = function (id, name) {
        if (this._guildID != id) {
            this._guildID = id;
            this._guildName = name;
            if (this._guildID != 0) {
                // if (ViewManager.ins().isShow(GuildApplyWin)) {
                // 	if (ViewManager.ins().isShow(GuildCreateWin)) {
                // 		ViewManager.ins().close(GuildCreateWin)
                // 	}
                // 	ViewManager.ins().close(GuildApplyWin);
                // 	ViewManager.ins().open(GuildMap);
                // }
            }
        }
    };
    Object.defineProperty(ActorModel.prototype, "guildID", {
        get: function () {
            return this._guildID;
        },
        enumerable: true,
        configurable: true
    });
    ActorModel.prototype.HasGuild = function () {
        return this._guildID != 0;
    };
    Object.defineProperty(ActorModel.prototype, "guildName", {
        get: function () {
            return this._guildName;
        },
        enumerable: true,
        configurable: true
    });
    //获取货币数量 type:为数据表{type=0, id=x, count=xx}中的id
    ActorModel.prototype.GetNum = function (type) {
        var count = 0;
        switch (type) {
            case MoneyConst.gold:
                count = this._gold;
                break;
            case MoneyConst.yuanbao:
                count = this._yb;
                break;
            case MoneyConst.byb:
                count = this.byb;
                break;
            case MoneyConst.GuildContrib:
                count = this._contrib;
                break;
        }
        return count;
    };
    ActorModel.prototype.GetCurrencyName = function (type) {
        return MoneyConstToName[type];
    };
    ActorModel.prototype.IsCurrency = function (type) {
        return MoneyConstToName[type] != null;
    };
    // 登录后需要请求的数据
    ActorModel.prototype.InitMsg = function () {
        GameGlobal.CrossTeamModel.SendGetInfos();
        GameGlobal.BossModel.sendCallFieldBossList();
        GameGlobal.BossModel.sendCallVipBossList();
        GameGlobal.Arena.sendArenaData();
        GameGlobal.QujingModel.SendEnterEscortView();
        GameGlobal.AuctionModel.sendAuctionList(0);
        if (this.HasGuild()) {
            GameGlobal.GangModel.SendGetPanTaoHuiInfo();
            GameGlobal.GangModel.sendGetSkillInfos();
            GameGlobal.GangModel.sendGetProtectorInfo();
            GameGlobal.GangMapModel.SendGetExchange();
            GameGlobal.GuildTeamModel.SendGetInfos();
            GameGlobal.GangModel.sendGetGangBossInfo();
            GameGlobal.AuctionModel.sendAuctionList(1);
            var myGangInfo = GameGlobal.GangModel.myGangInfo;
            if (myGangInfo && GangConst.GetAuditingRight(myGangInfo.mOffice)) {
                GameGlobal.GangModel.SendGetApplicantList();
            }
        }
        GameGlobal.Ladder.SendInitInfo();
    };
    return ActorModel;
}());
__reflect(ActorModel.prototype, "ActorModel");
//# sourceMappingURL=ActorModel.js.map