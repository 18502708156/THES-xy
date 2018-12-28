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
var MiniChatItemRender = (function (_super) {
    __extends(MiniChatItemRender, _super);
    function MiniChatItemRender() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_IsClickLink = false;
        return _this;
    }
    MiniChatItemRender.prototype.childrenCreated = function () {
        this.roleNameTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnTouchDown, this);
    };
    MiniChatItemRender.prototype._OnTouchBegin = function () {
        this.m_IsClickLink = false;
    };
    MiniChatItemRender.prototype._OnTouchDown = function (e) {
        if (this.m_IsClickLink) {
            return;
        }
        if (e.target == this.flagImg) {
            return;
        }
        if (!this.m_Context) {
            this.m_Context = Util.GetParentByType(this, MiniChatPanel);
        }
        this.m_Context.OpenChatPanel();
    };
    MiniChatItemRender.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.width = MiniChatPanel.CANVAS_WIDTH;
        this.roleNameTxt.width = this.width - this.roleNameTxt.x;
        var data = this.data;
        var type = data.type;
        if (type != null) {
            this.flagImg.source = ChatPanel.GetFlagImg(data.type);
            var shardStr = GameGlobal.Chat.analyzeCn(this.data); //添加分享内容
            if (data.IsTipType()) {
                this.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(data.str + shardStr);
            }
            else if (type == ChatType.Normal || type == ChatType.NormalPublic || type == ChatType.Guild) {
                // var n = MiniChatItemRender.filterContentStr(this.data.str+shardStr);
                var n = MiniChatItemRender.filterContentStr(this.data.str);
                var name_1;
                if (data.id == GameGlobal.GameLogic.actorModel.actorID) {
                    name_1 = "<font color = '0x83dafe'><u>" + MiniChatItemRender.getNameStr(this.data.name) + "</u></font>";
                }
                else {
                    name_1 = "<font color = '0x83dafe'><a href='event:" + data.id + "'><u>" + MiniChatItemRender.getNameStr(this.data.name) + "</u></a></font>";
                }
                if (shardStr || type == ChatType.NormalPublic) {
                    this.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(name_1 + n + shardStr);
                }
                else {
                    this.roleNameTxt.SetText(TextFlowMaker.generateTextFlow(name_1), n);
                }
            }
            this.validateNow();
        }
    };
    MiniChatItemRender.prototype.onLinkText = function (e) {
        this.m_IsClickLink = true;
        GameGlobal.Chat.HandleChatShare(e, this.data);
    };
    MiniChatItemRender.filterContentStr = function (str) {
        var t = "";
        if (str) {
            t = str;
            for (var e = "<", i = "&lt;", s = t.indexOf(e, 0); s >= 0;)
                t = t.replace(e, i),
                    s = t.indexOf(e, s + i.length);
        }
        return t;
    };
    MiniChatItemRender.getImageSpaceStr = function (actorName, lab) {
        var nameWidth = actorName.width;
        lab.text = " ";
        var str = "";
        for (var s = lab.textWidth, n = Math.ceil(actorName.width / s), a = 0; n > a; a++) {
            str += " ";
        }
        return str;
    };
    MiniChatItemRender.getNameStr = function (name) {
        return name ? "[" + name + "]" : "";
    };
    MiniChatItemRender.IMAGE_POS_X = -1;
    return MiniChatItemRender;
}(eui.ItemRenderer));
__reflect(MiniChatItemRender.prototype, "MiniChatItemRender");
//# sourceMappingURL=MiniChatItemRender.js.map