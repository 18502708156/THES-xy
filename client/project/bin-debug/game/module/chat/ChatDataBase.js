var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ChatDataBase = (function () {
    function ChatDataBase() {
    }
    ChatDataBase.prototype.IsTipType = function () {
        return true;
    };
    return ChatDataBase;
}());
__reflect(ChatDataBase.prototype, "ChatDataBase");
//# sourceMappingURL=ChatDataBase.js.map