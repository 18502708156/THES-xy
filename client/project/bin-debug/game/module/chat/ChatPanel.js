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
var ChatPanel = (function (_super) {
    __extends(ChatPanel, _super);
    function ChatPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.selectedIndex = 0;
        _this.skinName = "ChatSkin";
        var layout = new ceui.CVerticalLayout;
        layout.paddingLeft = 3;
        layout.paddingTop = 6;
        layout.gap = 7;
        _this.list.layout = layout;
        _this.list.itemRenderer = ChatItem;
        _this.bar.dataProvider = new eui.ArrayCollection(["全 部", "世 界", "帮 会"]);
        _this.input.SetCallback(function (msg) {
            _this.OnSend(msg);
        });
        _this._AddItemClick(_this.bar, _this._OnItemClick);
        return _this;
    }
    ChatPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.PLAYER_COPY_NAME, this.setInputTxt);
        this.mCommonWindowBg.OnAdded(this);
        this.bar.selectedIndex = 0;
        this._UpdateContent();
    };
    ChatPanel.prototype.OnClose = function () {
        this.list.dataProvider = null;
        this.mCommonWindowBg.OnRemoved();
    };
    ChatPanel.prototype.setInputTxt = function (txt) {
        this.input.SetText(txt);
    };
    ChatPanel.prototype._OnItemClick = function () {
        switch (this.bar.selectedIndex) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                if (!Chat.CanGuildChat()) {
                    this.bar.selectedIndex = this.selectedIndex;
                    return;
                }
                break;
        }
        this.selectedIndex = this.bar.selectedIndex;
        this._UpdateContent();
    };
    ChatPanel.prototype._UpdateContent = function () {
        var index = this.bar.selectedIndex;
        var source;
        if (index == 1) {
            source = GameGlobal.Chat.worldchatList;
        }
        else if (index == 2) {
            source = GameGlobal.Chat.guildchatList;
        }
        else {
            source = GameGlobal.Chat.minichatList;
        }
        this.list.dataProvider = source;
    };
    ChatPanel.prototype.OnSend = function (msg) {
        var _this = this;
        Chat.Send(this.bar.selectedIndex, msg, function () {
            _this.input.SetText("");
        });
    };
    ChatPanel.GetFlagImg = function (type) {
        if (type == ChatType.Guild) {
            return "ui_lt_bm_jiazu";
        }
        else if (type == ChatType.Normal || type == ChatType.NormalPublic) {
            return "ui_lt_bm_shijie";
        }
        else {
            return "ui_lt_bm_xitong";
        }
    };
    ChatPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return ChatPanel;
}(BaseEuiView));
__reflect(ChatPanel.prototype, "ChatPanel");
var ChatItem = (function (_super) {
    __extends(ChatItem, _super);
    function ChatItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ChatItem.prototype.dataChanged = function () {
        var data = this.data;
        if (data.type) {
            switch (data.type) {
                case ChatType.Public:
                case ChatType.System:
                    this.SetContent(3);
                    break;
                case ChatType.Normal:
                case ChatType.Guild:
                case ChatType.NormalPublic:
                    if (data.type2 == 0) {
                        this.SetContent(3);
                    }
                    else {
                        if (data.id == GameGlobal.actorModel.actorID) {
                            this.SetContent(2);
                        }
                        else {
                            this.SetContent(1);
                        }
                    }
                    break;
            }
        }
    };
    ChatItem.prototype.SetContent = function (type) {
        var comp = this["content" + type];
        if (!comp.parent) {
            this.addChild(comp);
        }
        if (!comp.skinName) {
            comp.skinName = "ChatItem" + type + "Skin";
            comp.roleNameTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
            if (comp.contentTxt) {
                comp.contentTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
            }
        }
        this["SetData" + type](comp, this.data);
        for (var i = 1; i <= 3; i++) {
            var comp_1 = this["content" + i];
            if (i != type) {
                DisplayUtils.removeFromParent(comp_1);
            }
        }
    };
    ChatItem.prototype.onLinkText = function (e) {
        GameGlobal.Chat.HandleChatShare(e, this.data);
    };
    ChatItem.prototype.SetData1 = function (comp, data) {
        this.SetChatData(comp, data);
    };
    ChatItem.prototype.SetData2 = function (comp, data) {
        this.SetChatData(comp, data);
    };
    /////////////////////////////////////////////////////////////////////////////
    // ChatItem1Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    // protected head: eui.Component;
    // protected flagImg: eui.Image;
    // protected roleNameTxt: eui.Label;
    // protected contentImg: eui.Image;
    // protected contentTxt: ChatLabel;
    /////////////////////////////////////////////////////////////////////////////
    ChatItem.prototype.SetChatData = function (comp, data) {
        if (data.id == GameGlobal.actorModel.actorID) {
            comp.roleNameTxt.text = data.name;
        }
        else {
            comp.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow("<u><a href='event:" + data.id + "'>" + data.name + "</a></u>");
        }
        if (data.headframe)
            comp.head["imgFrame"].source = ResDataPath.GetHeadFrameImgName(data.headframe);
        UIHelper.SetHead(comp.head, data.job, data.sex);
        // ChatPanel.ReplaceFace(comp.contentTxt, data.str)
        // comp.contentTxt.text = data.str
        var shardStr = GameGlobal.Chat.analyzeCn(data); //添加分享内容
        if (shardStr || data.type == ChatType.NormalPublic) {
            comp.contentTxt.textFlow = TextFlowMaker.generateTextFlow(data.str + shardStr);
        }
        else {
            comp.contentTxt.text = data.str;
        }
        // if (data.type == ChatType.Guild) {
        // 	comp.flagImg.source = "ui_lt_bm_jiazu"
        // } else {
        // 	comp.flagImg.source = "ui_lt_bm_shijie"
        // }
        comp.flagImg.source = ChatPanel.GetFlagImg(data.type);
    };
    /////////////////////////////////////////////////////////////////////////////
    // ChatItem3Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    // protected roleNameTxt: eui.Label;
    // protected flagImg: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    ChatItem.prototype.SetData3 = function (comp, data) {
        comp.flagImg.source = ChatPanel.GetFlagImg(data.type);
        var shardStr = GameGlobal.Chat.analyzeCn(data); //添加分享内容
        comp.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(data.str + shardStr);
    };
    return ChatItem;
}(eui.ItemRenderer));
__reflect(ChatItem.prototype, "ChatItem");
//# sourceMappingURL=ChatPanel.js.map