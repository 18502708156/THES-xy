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
var FriendModel = (function (_super) {
    __extends(FriendModel, _super);
    function FriendModel() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_friend_follow_data, _this.getFriendsData);
        _this.regNetMsg(S2cProtocol.sc_friend_funs_data, _this.getFansData);
        _this.regNetMsg(S2cProtocol.sc_friend_black_list, _this.getBlackListData);
        _this.regNetMsg(S2cProtocol.sc_friend_follow_nominate_list, _this.getReferrerData);
        _this.regNetMsg(S2cProtocol.sc_friend_follow_update, _this.getFriendUpdate);
        _this.regNetMsg(S2cProtocol.sc_friend_funs_update, _this.getAddFans);
        _this.regNetMsg(S2cProtocol.sc_friend_blacklist_update, _this.getBlacklistUpdate);
        _this.regNetMsg(S2cProtocol.sc_friend_gift_receive_info, _this.getCoinInfo);
        _this.regNetMsg(S2cProtocol.sc_friend_funs_remove, _this.getDelFans);
        _this.FriendData = new FriendData;
        return _this;
    }
    FriendModel.prototype.isFriend = function (id) {
        for (var _i = 0, _a = this.FriendData.friendsDate; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.friendInfo.dbid == id)
                return true;
        }
        return false;
    };
    FriendModel.prototype.isBlacklist = function (id) {
        for (var _i = 0, _a = this.FriendData.blacklistData; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.dbid == id)
                return true;
        }
        return false;
    };
    Object.defineProperty(FriendModel.prototype, "friendsNum", {
        get: function () {
            return this.FriendData.friendsDate.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FriendModel.prototype, "blacklistNum", {
        get: function () {
            return this.FriendData.blacklistData.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FriendModel.prototype, "fansNum", {
        get: function () {
            return this.FriendData.fansData.length;
        },
        enumerable: true,
        configurable: true
    });
    FriendModel.prototype.checkRedPoint = function () {
        if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin)
            for (var _i = 0, _a = this.FriendData.fansData; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value.gift && !value.receive) {
                    return true;
                }
            }
        return false;
    };
    /**聊天列表排序*/
    FriendModel.prototype.arrDispose = function (arr) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var onLine = [];
        var offLine = [];
        for (var i = 0; i < arr.length; i++) {
            if (param.length == 1) {
                if (arr[i][param[0]] == 0)
                    onLine.push(arr[i]);
                else
                    offLine.push(arr[i]);
            }
            else if (param.length == 2) {
                if (arr[i][param[0]][param[1]] == 0)
                    onLine.push(arr[i]);
                else
                    offLine.push(arr[i]);
            }
        }
        if (param.length == 1)
            SortTools.sortMap1(offLine, false, param[0]);
        else if (param.length == 2)
            SortTools.sortMap1(offLine, false, param[0], param[1]);
        return onLine.concat(offLine);
    };
    /**数据变更处理*/
    FriendModel.prototype.arrUpdate = function (arr, reference) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        var isExist = false;
        for (var i = 0; i < arr.length; i++) {
            if (param.length == 1) {
                if (arr[i][param[0]] == reference[param[0]]) {
                    arr[i] = reference;
                    isExist = true;
                    break;
                }
            }
            else if (param.length == 2) {
                if (arr[i][param[0]][param[1]] == reference[param[0]][param[1]]) {
                    arr[i] = reference;
                    isExist = true;
                    break;
                }
            }
        }
        if (!isExist)
            arr.push(reference);
    };
    /**删除Itme*/
    FriendModel.prototype.delItem = function (arr, id) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        for (var i = 0; i < arr.length; i++) {
            if (param.length == 1) {
                if (arr[i][param[0]] == id) {
                    arr.splice(i, 1);
                    break;
                }
            }
            else if (param.length == 2) {
                if (arr[i][param[0]][param[1]] == id) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
    };
    /**更新列表*/
    FriendModel.prototype.refreshList = function (id) {
        for (var i = 0; i < this.FriendData.friendsDate.length; i++)
            if (this.FriendData.friendsDate[i].friendInfo.dbid == id)
                this.FriendData.friendsDate.splice(i, 1);
        for (var i = 0; i < this.FriendData.fansData.length; i++)
            if (this.FriendData.fansData[i].dbid == id)
                this.FriendData.fansData.splice(i, 1);
        for (var i = 0; i < this.FriendData.referrerDate.length; i++)
            if (this.FriendData.referrerDate[i].dbid == id)
                this.FriendData.referrerDate.splice(i, 1);
    };
    /**一键关注*/
    FriendModel.prototype.sentAllFollow = function () {
        var vipConfig = GameGlobal.Config.VipPrivilegeConfig;
        for (var i = 0; i < this.FriendData.referrerDate.length;) {
            if (this.friendsNum < vipConfig[GameGlobal.actorModel.vipLv].friendnum) {
                this.sendAddFriend(this.FriendData.referrerDate[i].dbid);
                this.FriendData.referrerDate.splice(i, 1);
            }
            else
                i++;
        }
    };
    /**一键接收友币*/
    FriendModel.prototype.sentTakeAllCoin = function () {
        if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin) {
            var config = GameGlobal.Config.FriendBaseConfig;
            for (var i = 0; i < this.FriendData.fansData.length;) {
                if (this.FriendData.takeCoinNum < config.receivecoin && this.FriendData.fansData[i].gift && !this.FriendData.fansData[i].receive) {
                    this.sentTakeGive(this.FriendData.fansData[i].funsInfo.dbid);
                    this.FriendData.fansData.splice(i, 1);
                }
                else
                    i++;
            }
        }
        else
            GameGlobal.UserTips.showTips("今天接收次数已达上限");
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    FriendModel.prototype.getFriendsData = function (req) {
        this.FriendData.friendsDate = this.arrDispose(req.friendlist, "friendInfo", "offlineTime");
    };
    FriendModel.prototype.getFansData = function (req) {
        SortTools.sortMap1(req.funslist, false, "gifttime");
        this.FriendData.fansData = req.funslist;
    };
    FriendModel.prototype.getBlackListData = function (req) {
        SortTools.sortMap1(req.blacklist, false, "power");
        this.FriendData.blacklistData = req.blacklist;
    };
    /**请求推荐列表*/
    FriendModel.prototype.sendReferrer = function () {
        var req = new Sproto.cs_friend_follow_nominate_request;
        this.Rpc(C2sProtocol.cs_friend_follow_nominate, req);
    };
    FriendModel.prototype.getReferrerData = function (req) {
        this.FriendData.referrerDate = this.arrDispose(req.playerinfos, "offlineTime");
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
    };
    FriendModel.prototype.getFriendUpdate = function (req) {
        this.arrUpdate(this.FriendData.friendsDate, req.friendinfo, "friendInfo", "dbid");
        this.FriendData.friendsDate = this.arrDispose(this.FriendData.friendsDate, "friendInfo", "offlineTime");
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
    };
    FriendModel.prototype.getAddFans = function (req) {
        this.arrUpdate(this.FriendData.fansData, req.funsinfo, "funsInfo", "dbid");
        SortTools.sortMap1(this.FriendData.fansData, false, "gifttime");
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
        MessageCenter.ins().dispatch(MessageDef.FRIEND_RED_POINT_CHANGE);
    };
    FriendModel.prototype.getDelFans = function (req) {
        GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.fansData, req.dbid, "funsInfo", "dbid");
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
    };
    FriendModel.prototype.getBlacklistUpdate = function (req) {
        this.arrUpdate(this.FriendData.blacklistData, req.blackdata, "dbid");
        SortTools.sortMap1(this.FriendData.blacklistData, false, "power");
        this.refreshList(req.blackdata.dbid);
        MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
    };
    /**请求赠送友币*/
    FriendModel.prototype.sentGive = function (id) {
        if (GameGlobal.FriendModel.FriendData.curCoinNum < GameGlobal.Config.FriendBaseConfig.givecoin) {
            var req = new Sproto.cs_friend_gift_friendcoin_request;
            req.targetid = id;
            this.Rpc(C2sProtocol.cs_friend_gift_friendcoin, req);
            GameGlobal.UserTips.showTips("赠送成功");
        }
        else
            GameGlobal.UserTips.showTips("今天赠送次数已用完");
    };
    /**请求接收友币*/
    FriendModel.prototype.sentTakeGive = function (id) {
        if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin) {
            var req = new Sproto.cs_friend_receive_friendcoin_request;
            req.targetid = id;
            this.Rpc(C2sProtocol.cs_friend_receive_friendcoin, req);
            GameGlobal.UserTips.showTips("接收成功");
            MessageCenter.ins().dispatch(MessageDef.FRIEND_RED_POINT_CHANGE);
        }
        else
            GameGlobal.UserTips.showTips("今天接收次数已达上限");
    };
    FriendModel.prototype.getCoinInfo = function (req) {
        this.FriendData.takeCoinNum = req.receivetime;
        this.FriendData.curCoinNum = req.gifttime;
    };
    /**请求所有赠送*/
    FriendModel.prototype.sentAllGive = function () {
        if (this.FriendData.curCoinNum < GameGlobal.Config.FriendBaseConfig.givecoin) {
            var giveSum = GameGlobal.Config.FriendBaseConfig.givecoin;
            for (var i = 0; i < this.FriendData.friendsDate.length; i++) {
                if ((giveSum - this.FriendData.curCoinNum) > 0)
                    if (!this.FriendData.friendsDate[i].gift)
                        this.sentGive(this.FriendData.friendsDate[i].friendInfo.dbid);
            }
        }
        else
            GameGlobal.UserTips.showTips("今天赠送次数已用完");
    };
    /**请求移除关注*/
    FriendModel.prototype.sendDleFriend = function (id) {
        var req = new Sproto.cs_friend_del_follow_request;
        req.targetid = id;
        this.Rpc(C2sProtocol.cs_friend_del_follow, req);
        GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.friendsDate, id, "friendInfo", "dbid");
    };
    /**请求添加关注*/
    FriendModel.prototype.sendAddFriend = function (id) {
        if (GameGlobal.FriendModel.friendsNum < GameGlobal.Config.VipPrivilegeConfig[GameGlobal.actorModel.vipLv].friendnum) {
            var req = new Sproto.cs_friend_add_follow_request;
            req.targetid = id;
            this.targetId = id;
            this.Rpc(C2sProtocol.cs_friend_add_follow, req, this.addSuccess, this);
        }
        else
            GameGlobal.UserTips.showTips("关注列表已满");
    };
    FriendModel.prototype.addSuccess = function (req) {
        if (req.ret) {
            GameGlobal.UserTips.showTips("已关注");
            GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.referrerDate, this.targetId, "dbid");
            GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.blacklistData, this.targetId, "dbid");
            MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
        }
        else
            GameGlobal.UserTips.showTips("对方粉丝已满");
    };
    /**请求添加黑名单*/
    FriendModel.prototype.sendAddBlacklist = function (id) {
        if (this.blacklistNum < GameGlobal.Config.FriendBaseConfig.blacklist) {
            var req = new Sproto.cs_friend_add_blacklist_request;
            req.targetid = id;
            this.Rpc(C2sProtocol.cs_friend_add_blacklist, req);
        }
        else
            GameGlobal.UserTips.showTips("黑名单已达上限，无法拉黑");
    };
    /**请求移出黑名单*/
    FriendModel.prototype.sendRemoveBlacklist = function (id) {
        var req = new Sproto.cs_friend_del_blacklist_request;
        req.targetid = id;
        this.Rpc(C2sProtocol.cs_friend_del_blacklist, req);
        GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.blacklistData, id, "dbid");
    };
    /**每页的最大容量*/
    FriendModel.MAX_COUNT = 6;
    return FriendModel;
}(BaseSystem));
__reflect(FriendModel.prototype, "FriendModel");
//# sourceMappingURL=FriendModel.js.map