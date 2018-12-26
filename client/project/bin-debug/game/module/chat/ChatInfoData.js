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
var ChatInfoData = (function (_super) {
    __extends(ChatInfoData, _super);
    function ChatInfoData(data) {
        if (data === void 0) { data = null; }
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.superMonthCard = 0;
        if (!data) {
            return _this;
        }
        if (data) {
            if (egret.is(data, "Sproto.chat_data")) {
                var chatData = data;
                _this.type = chatData.type;
                _this.id = chatData.id;
                _this.name = chatData.name;
                _this.job = chatData.job;
                _this.sex = chatData.sex;
                _this.vip = chatData.vip;
                _this.share = chatData.share;
                _this.str = chatData.str;
                _this.serverid = chatData.serverid;
                _this.time = chatData.time;
                _this.headframe = chatData.headframe;
            }
            else if (egret.is(data, "Sproto.guild_chat")) {
                var guildChat = data;
                _this.name = guildChat.name;
                _this.type = ChatType.Guild;
                _this.id = guildChat.playerid;
                _this.type2 = data.type;
                _this.job = data.job;
                _this.sex = data.sex;
                _this.str = guildChat.content;
                _this.vip = guildChat.vip;
                // this.monthCard = t.monthCard
                _this.monthCard = 0;
                _this.time = guildChat.time;
                _this.share = guildChat.share;
                _this.headframe = guildChat.headframe;
            }
            else {
                console.log("not type => " + data);
            }
        }
        return _this;
    }
    ChatInfoData.prototype.IsTipType = function () {
        return this.type == ChatType.Public || this.type == ChatType.System || (this.type == ChatType.Guild && this.type2 == 0);
    };
    return ChatInfoData;
}(ChatDataBase));
__reflect(ChatInfoData.prototype, "ChatInfoData");
var ChatSystemData = (function (_super) {
    __extends(ChatSystemData, _super);
    function ChatSystemData(type, str, time) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.str = str;
        _this.time = time || 0;
        return _this;
    }
    return ChatSystemData;
}(ChatDataBase));
__reflect(ChatSystemData.prototype, "ChatSystemData");
//# sourceMappingURL=ChatInfoData.js.map