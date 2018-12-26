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
var ShouDaoXianHuaPanel = (function (_super) {
    __extends(ShouDaoXianHuaPanel, _super);
    function ShouDaoXianHuaPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.skinName = "ShouDaoXianHuaSkin";
        return _this;
    }
    ShouDaoXianHuaPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.jieshou, this._OnClick);
        this._AddClick(this.jujue, this._OnClick);
        this._AddClick(this.next, this._OnClick);
        this.updateContent();
    };
    ShouDaoXianHuaPanel.prototype.updateContent = function () {
        this.userChatData = new Sproto.chat_data;
        var other = GameGlobal.YingYuanModel.getOther();
        this.userChatData.id = other.dbid;
        this.userChatData.job = other.job;
        this.userChatData.sex = other.sex;
        this.userChatData.name = other.name;
        var data = GameGlobal.YingYuanModel.marrySFlower;
        if (data.length == 0) {
            ViewManager.ins().close(this);
            return;
        }
        if (this.index == (data.length - 1)) {
            this.next.label = "取消";
        }
        var indexData = data[this.index];
        if (!indexData) {
            this.text.text = "";
            this.text0.text = "";
            return;
        }
        this.text.text = indexData.name + "赠送你" + indexData.flower + "*" + indexData.count;
        this.text0.text = "恩爱有加的你们亲密度各自增加了" + indexData.intimacy + "您想对Ta做出什么回应昵？";
    };
    ShouDaoXianHuaPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.jieshou:
                ViewManager.ins().open(YingYuanXianHuaPanel);
                GameGlobal.YingYuanModel.flower(this.index);
                this.updateContent();
                break;
            case this.jujue:
                ViewManager.ins().open(PlayerChatpanel, this.userChatData);
                break;
            case this.next:
                if (this.next.label == "取消") {
                    ViewManager.ins().close(this);
                    GameGlobal.YingYuanModel.removeAllFlower();
                    return;
                }
                if (this.index == (GameGlobal.YingYuanModel.marrySFlower.length - 1)) {
                    ViewManager.ins().close(this);
                    return;
                }
                this.index++;
                this.updateContent();
                break;
        }
    };
    ShouDaoXianHuaPanel.prototype.OnClose = function () {
    };
    ShouDaoXianHuaPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ShouDaoXianHuaPanel;
}(BaseEuiView));
__reflect(ShouDaoXianHuaPanel.prototype, "ShouDaoXianHuaPanel", ["ICommonWindow"]);
//# sourceMappingURL=ShouDaoXianHuaPanel.js.map