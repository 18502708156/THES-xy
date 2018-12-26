var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DeblockingType;
(function (DeblockingType) {
    DeblockingType[DeblockingType["TYPE_1"] = 1] = "TYPE_1";
    DeblockingType[DeblockingType["TYPE_2"] = 2] = "TYPE_2";
    DeblockingType[DeblockingType["TYPE_3"] = 3] = "TYPE_3";
    DeblockingType[DeblockingType["TYPE_4"] = 4] = "TYPE_4";
    DeblockingType[DeblockingType["TYPE_5"] = 5] = "TYPE_5";
    DeblockingType[DeblockingType["TYPE_6"] = 6] = "TYPE_6";
    DeblockingType[DeblockingType["TYPE_7"] = 7] = "TYPE_7";
    DeblockingType[DeblockingType["TYPE_8"] = 8] = "TYPE_8";
    DeblockingType[DeblockingType["TYPE_9"] = 9] = "TYPE_9";
    DeblockingType[DeblockingType["TYPE_10"] = 10] = "TYPE_10";
    DeblockingType[DeblockingType["TYPE_11"] = 11] = "TYPE_11";
    DeblockingType[DeblockingType["TYPE_12"] = 12] = "TYPE_12";
    DeblockingType[DeblockingType["TYPE_13"] = 13] = "TYPE_13";
    DeblockingType[DeblockingType["TYPE_14"] = 14] = "TYPE_14";
    DeblockingType[DeblockingType["TYPE_15"] = 15] = "TYPE_15";
    DeblockingType[DeblockingType["TYPE_16"] = 16] = "TYPE_16";
    DeblockingType[DeblockingType["TYPE_17"] = 17] = "TYPE_17";
    DeblockingType[DeblockingType["TYPE_18"] = 18] = "TYPE_18";
    DeblockingType[DeblockingType["TYPE_19"] = 19] = "TYPE_19";
    DeblockingType[DeblockingType["TYPE_20"] = 20] = "TYPE_20";
    DeblockingType[DeblockingType["TYPE_21"] = 21] = "TYPE_21";
    DeblockingType[DeblockingType["TYPE_22"] = 22] = "TYPE_22";
    DeblockingType[DeblockingType["TYPE_23"] = 23] = "TYPE_23";
    DeblockingType[DeblockingType["TYPE_24"] = 24] = "TYPE_24";
    DeblockingType[DeblockingType["TYPE_25"] = 25] = "TYPE_25";
    DeblockingType[DeblockingType["TYPE_26"] = 26] = "TYPE_26";
    DeblockingType[DeblockingType["TYPE_27"] = 27] = "TYPE_27";
    DeblockingType[DeblockingType["TYPE_28"] = 28] = "TYPE_28";
    DeblockingType[DeblockingType["TYPE_29"] = 29] = "TYPE_29";
    DeblockingType[DeblockingType["TYPE_30"] = 30] = "TYPE_30";
    DeblockingType[DeblockingType["TYPE_31"] = 31] = "TYPE_31";
    DeblockingType[DeblockingType["TYPE_32"] = 32] = "TYPE_32";
    DeblockingType[DeblockingType["TYPE_33"] = 33] = "TYPE_33";
    DeblockingType[DeblockingType["TYPE_34"] = 34] = "TYPE_34";
    DeblockingType[DeblockingType["TYPE_35"] = 35] = "TYPE_35";
    DeblockingType[DeblockingType["TYPE_36"] = 36] = "TYPE_36";
    DeblockingType[DeblockingType["TYPE_37"] = 37] = "TYPE_37";
    DeblockingType[DeblockingType["TYPE_38"] = 38] = "TYPE_38";
    DeblockingType[DeblockingType["TYPE_39"] = 39] = "TYPE_39";
    DeblockingType[DeblockingType["TYPE_40"] = 40] = "TYPE_40";
    DeblockingType[DeblockingType["TYPE_41"] = 41] = "TYPE_41";
    DeblockingType[DeblockingType["TYPE_42"] = 42] = "TYPE_42";
    DeblockingType[DeblockingType["TYPE_43"] = 43] = "TYPE_43";
    DeblockingType[DeblockingType["TYPE_44"] = 44] = "TYPE_44";
    DeblockingType[DeblockingType["TYPE_45"] = 45] = "TYPE_45";
    DeblockingType[DeblockingType["TYPE_46"] = 46] = "TYPE_46";
    DeblockingType[DeblockingType["TYPE_47"] = 47] = "TYPE_47";
    DeblockingType[DeblockingType["TYPE_48"] = 48] = "TYPE_48";
    DeblockingType[DeblockingType["TYPE_49"] = 49] = "TYPE_49";
    DeblockingType[DeblockingType["TYPE_50"] = 50] = "TYPE_50";
    DeblockingType[DeblockingType["TYPE_51"] = 51] = "TYPE_51";
    DeblockingType[DeblockingType["TYPE_52"] = 52] = "TYPE_52";
    DeblockingType[DeblockingType["TYPE_53"] = 53] = "TYPE_53";
    DeblockingType[DeblockingType["TYPE_54"] = 54] = "TYPE_54";
    DeblockingType[DeblockingType["TYPE_55"] = 55] = "TYPE_55";
    DeblockingType[DeblockingType["TYPE_56"] = 56] = "TYPE_56";
    DeblockingType[DeblockingType["TYPE_57"] = 57] = "TYPE_57";
    DeblockingType[DeblockingType["TYPE_58"] = 58] = "TYPE_58";
    DeblockingType[DeblockingType["TYPE_59"] = 59] = "TYPE_59";
    DeblockingType[DeblockingType["TYPE_60"] = 60] = "TYPE_60";
    DeblockingType[DeblockingType["TYPE_61"] = 61] = "TYPE_61";
    DeblockingType[DeblockingType["TYPE_62"] = 62] = "TYPE_62";
    DeblockingType[DeblockingType["TYPE_63"] = 63] = "TYPE_63";
    DeblockingType[DeblockingType["TYPE_64"] = 64] = "TYPE_64";
    DeblockingType[DeblockingType["TYPE_65"] = 65] = "TYPE_65";
    DeblockingType[DeblockingType["TYPE_66"] = 66] = "TYPE_66";
    DeblockingType[DeblockingType["TYPE_67"] = 67] = "TYPE_67";
    DeblockingType[DeblockingType["TYPE_68"] = 68] = "TYPE_68";
    DeblockingType[DeblockingType["TYPE_69"] = 69] = "TYPE_69";
    DeblockingType[DeblockingType["TYPE_70"] = 70] = "TYPE_70";
    DeblockingType[DeblockingType["TYPE_71"] = 71] = "TYPE_71";
    DeblockingType[DeblockingType["TYPE_72"] = 72] = "TYPE_72";
    DeblockingType[DeblockingType["TYPE_73"] = 73] = "TYPE_73";
    DeblockingType[DeblockingType["TYPE_74"] = 74] = "TYPE_74";
    DeblockingType[DeblockingType["TYPE_75"] = 75] = "TYPE_75";
    DeblockingType[DeblockingType["TYPE_76"] = 76] = "TYPE_76";
    DeblockingType[DeblockingType["TYPE_77"] = 77] = "TYPE_77";
    DeblockingType[DeblockingType["TYPE_78"] = 78] = "TYPE_78";
    DeblockingType[DeblockingType["TYPE_79"] = 79] = "TYPE_79";
    DeblockingType[DeblockingType["TYPE_80"] = 80] = "TYPE_80";
    DeblockingType[DeblockingType["TYPE_81"] = 81] = "TYPE_81";
    DeblockingType[DeblockingType["TYPE_82"] = 82] = "TYPE_82";
    DeblockingType[DeblockingType["TYPE_83"] = 83] = "TYPE_83";
    DeblockingType[DeblockingType["TYPE_84"] = 84] = "TYPE_84";
    DeblockingType[DeblockingType["TYPE_85"] = 85] = "TYPE_85";
    DeblockingType[DeblockingType["TYPE_86"] = 86] = "TYPE_86";
    DeblockingType[DeblockingType["TYPE_87"] = 87] = "TYPE_87";
    DeblockingType[DeblockingType["TYPE_88"] = 88] = "TYPE_88";
    DeblockingType[DeblockingType["TYPE_89"] = 89] = "TYPE_89";
    DeblockingType[DeblockingType["TYPE_90"] = 90] = "TYPE_90";
    DeblockingType[DeblockingType["TYPE_91"] = 91] = "TYPE_91";
    DeblockingType[DeblockingType["TYPE_92"] = 92] = "TYPE_92";
    DeblockingType[DeblockingType["TYPE_93"] = 93] = "TYPE_93";
    DeblockingType[DeblockingType["TYPE_94"] = 94] = "TYPE_94";
    DeblockingType[DeblockingType["TYPE_95"] = 95] = "TYPE_95";
    DeblockingType[DeblockingType["TYPE_96"] = 96] = "TYPE_96";
    DeblockingType[DeblockingType["TYPE_97"] = 97] = "TYPE_97";
    DeblockingType[DeblockingType["TYPE_98"] = 98] = "TYPE_98";
    DeblockingType[DeblockingType["TYPE_99"] = 99] = "TYPE_99";
    DeblockingType[DeblockingType["TYPE_100"] = 100] = "TYPE_100";
    DeblockingType[DeblockingType["TYPE_101"] = 101] = "TYPE_101";
    DeblockingType[DeblockingType["TYPE_102"] = 102] = "TYPE_102";
    DeblockingType[DeblockingType["TYPE_103"] = 103] = "TYPE_103";
    DeblockingType[DeblockingType["TYPE_104"] = 104] = "TYPE_104";
    DeblockingType[DeblockingType["TYPE_105"] = 105] = "TYPE_105";
    DeblockingType[DeblockingType["TYPE_106"] = 106] = "TYPE_106";
    DeblockingType[DeblockingType["TYPE_107"] = 107] = "TYPE_107";
    DeblockingType[DeblockingType["TYPE_108"] = 108] = "TYPE_108";
    DeblockingType[DeblockingType["TYPE_109"] = 109] = "TYPE_109";
    DeblockingType[DeblockingType["TYPE_110"] = 110] = "TYPE_110";
    DeblockingType[DeblockingType["TYPE_111"] = 111] = "TYPE_111";
    DeblockingType[DeblockingType["TYPE_112"] = 112] = "TYPE_112";
    DeblockingType[DeblockingType["TYPE_113"] = 113] = "TYPE_113";
    DeblockingType[DeblockingType["TYPE_114"] = 114] = "TYPE_114";
    DeblockingType[DeblockingType["TYPE_115"] = 115] = "TYPE_115";
    DeblockingType[DeblockingType["TYPE_116"] = 116] = "TYPE_116";
    DeblockingType[DeblockingType["TYPE_117"] = 117] = "TYPE_117";
    DeblockingType[DeblockingType["TYPE_118"] = 118] = "TYPE_118";
    DeblockingType[DeblockingType["TYPE_119"] = 119] = "TYPE_119";
    DeblockingType[DeblockingType["TYPE_120"] = 120] = "TYPE_120";
    DeblockingType[DeblockingType["TYPE_212"] = 212] = "TYPE_212";
    DeblockingType[DeblockingType["TYPE_121"] = 121] = "TYPE_121";
    DeblockingType[DeblockingType["TYPE_122"] = 122] = "TYPE_122";
    DeblockingType[DeblockingType["TYPE_123"] = 123] = "TYPE_123";
    DeblockingType[DeblockingType["TYPE_124"] = 124] = "TYPE_124";
    DeblockingType[DeblockingType["TYPE_125"] = 125] = "TYPE_125";
    DeblockingType[DeblockingType["TYPE_126"] = 126] = "TYPE_126";
    DeblockingType[DeblockingType["TYPE_127"] = 127] = "TYPE_127";
    DeblockingType[DeblockingType["TYPE_128"] = 128] = "TYPE_128";
    DeblockingType[DeblockingType["TYPE_129"] = 129] = "TYPE_129";
    DeblockingType[DeblockingType["TYPE_130"] = 130] = "TYPE_130";
    DeblockingType[DeblockingType["TYPE_131"] = 131] = "TYPE_131";
    DeblockingType[DeblockingType["TYPE_132"] = 132] = "TYPE_132";
    DeblockingType[DeblockingType["TYPE_133"] = 133] = "TYPE_133";
    DeblockingType[DeblockingType["TYPE_134"] = 134] = "TYPE_134";
    DeblockingType[DeblockingType["TYPE_137"] = 137] = "TYPE_137";
    DeblockingType[DeblockingType["TYPE_138"] = 138] = "TYPE_138";
    DeblockingType[DeblockingType["TYPE_140"] = 140] = "TYPE_140";
    DeblockingType[DeblockingType["TYPE_141"] = 141] = "TYPE_141";
    DeblockingType[DeblockingType["TYPE_142"] = 142] = "TYPE_142";
    DeblockingType[DeblockingType["TYPE_143"] = 143] = "TYPE_143";
    DeblockingType[DeblockingType["TYPE_144"] = 144] = "TYPE_144";
    DeblockingType[DeblockingType["TYPE_145"] = 145] = "TYPE_145";
})(DeblockingType || (DeblockingType = {}));
var Deblocking = (function () {
    function Deblocking() {
    }
    /**condition = 1 与， 2 或 */
    Deblocking.CheckSinge = function (type, value) {
        if (!type || !value) {
            return true;
        }
        switch (type) {
            case 1:
                if (GameGlobal.UserFb.guanqiaID >= value) {
                    return true;
                }
                break;
            case 2:
                if (GameGlobal.actorModel.level >= value) {
                    return true;
                }
                break;
            case 3:
                if (GameGlobal.actorModel.vipLv >= value) {
                    return true;
                }
                break;
            case 4:
                if (GameServer.serverOpenDay >= value) {
                    return true;
                }
                break;
            case 5:
                if (GameServer.loginDay >= value) {
                    return true;
                }
                break;
            case 6:
                // if (value == 2) {
                // 	return GuildWar.ins().IsServerWarOpen2()
                // }
                // if (GuildWar.ins().IsServerWarOpen()) {
                // 	return true
                // }
                break;
            // 默认开启
            default:
                return true;
        }
        return false;
    };
    Deblocking.Init = function () {
        var config = GameGlobal.Config.FuncOpenConfig;
        for (var key in config) {
            var data = config[key];
            if (data.isOpen) {
                for (var i = 0; i < this.KEYS.length; ++i) {
                    var type = Deblocking.CONVERT[data[this.KEYS[i]]];
                    var list = this.m_DoCheckList[type];
                    if (!list) {
                        this.m_DoCheckList[type] = list = [];
                    }
                    list.push(data.id);
                }
            }
        }
    };
    Deblocking.Update = function (type) {
        // let dataList = this.m_DoCheckList[type]
        // if (!dataList) {
        // 	return
        // }
        // let openList = null
        // if (this.m_Initds[type]) {
        // 	openList = {}
        // }
        // this.m_Initds[type] = true
        // for (let i = dataList.length - 1; i >= 0; --i) {
        // 	if (this.Check(dataList[i], true)) {
        // 		if (openList) {
        // 			openList[dataList[i]] = true
        // 		}
        // 		dataList.splice(i, 1)
        // 	}
        // }
        // if (dataList.length < 1) {
        // 	delete this.m_DoCheckList[type]
        // }
        // if (openList) {
        // 	for (let key in openList) {
        // 		this.mOpenIds.push(Number(key))
        // 	}
        // 	this.mOpenIds.sort(function (lhs, rhs) {
        // 		return lhs - rhs
        // 	})
        // 	GameGlobal.MessageCenter.dispatch(MessageDef.GAME_DEBLOCKING)
        // }
    };
    // 是否解锁
    Deblocking.IsDeblocking = function (type) {
        return this.Check(type, true);
    };
    Deblocking.Check = function (type, notTip) {
        if (notTip === void 0) { notTip = false; }
        var cfg = GameGlobal.Config.FuncOpenConfig[type];
        if (!cfg || !cfg.conditionkind) {
            return true;
        }
        var result = true;
        if (!cfg.condition || cfg.condition == 1) {
            for (var i = 0; i < this.KEYS.length; ++i) {
                var type_1 = this.KEYS[i];
                var value = this.VALUES[i];
                if (!this.CheckSinge(cfg[type_1], cfg[value])) {
                    result = false;
                    break;
                }
            }
        }
        else if (!cfg.condition || cfg.condition == 2) {
            result = false;
            for (var i = 0; i < this.KEYS.length; ++i) {
                var type_2 = this.KEYS[i];
                var value = this.VALUES[i];
                if (this.CheckSinge(cfg[type_2], cfg[value])) {
                    result = true;
                    break;
                }
            }
        }
        if (result) {
            return true;
        }
        if (!notTip) {
            UserTips.InfoTip(cfg.opencondition);
        }
        // Deblocking._ShowTip(conType, conValue, notTip, cfg.opencondition)
        return false;
    };
    Deblocking._ShowTip = function (type, value, notTip, tipValue) {
        if (notTip === void 0) { notTip = false; }
        if (notTip) {
            return;
        }
        var str = tipValue;
        if (!str) {
            switch (type) {
                case 1:
                    str = "\u901A\u5173\u5230\u7B2C" + value + "\u5173\u5F00\u542F";
                    break;
                case 2:
                    str = value + "\u7EA7\u5F00\u542F";
                    break;
                case 3:
                    str = "\u767B\u5F55\u7B2C" + value + "\u5929\u5F00\u542F";
                    break;
            }
        }
        if (str) {
            UserTips.InfoTip(str);
        }
    };
    Deblocking.IsHide = function (type) {
        if (this.Check(type, true)) {
            return false;
        }
        var cfg = GameGlobal.Config.FuncOpenConfig[type];
        if (cfg && cfg.isHide == 1) {
            return true;
        }
        return false;
    };
    /*
    1、通关关卡数
    2、人物等级
    3、VIP等级
    4、开服天数
    5、登录天数
    6、开服周数
    */
    Deblocking.CHECK_TYPE_01 = 1;
    Deblocking.CHECK_TYPE_02 = 2;
    Deblocking.CHECK_TYPE_03 = 3;
    Deblocking.CHECK_TYPE_04 = 4; // 4、5、6
    // public static readonly CHECK_TYPE_05 = 5
    // public static readonly CHECK_TYPE_06 = 6
    Deblocking.CONVERT = (_a = {},
        _a[1] = 1,
        _a[2] = 2,
        _a[3] = 3,
        _a[4] = 4,
        _a[5] = 4,
        _a[6] = 4,
        _a);
    Deblocking.KEYS = ["conditionkind", "conditionkind2"];
    Deblocking.VALUES = ["conditionnum", "conditionnum2"];
    Deblocking.m_Initds = {};
    Deblocking.m_DoCheckList = {};
    Deblocking.mOpenIds = [];
    return Deblocking;
}());
__reflect(Deblocking.prototype, "Deblocking");
var _a;
//# sourceMappingURL=Deblocking.js.map