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
var XiandaoVideoPanel = (function (_super) {
    __extends(XiandaoVideoPanel, _super);
    function XiandaoVideoPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoVideoSkin";
        _this.list.itemRenderer = XiandaoVideoItem;
        return _this;
    }
    XiandaoVideoPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var turnId = param[0];
        var index = param[1];
        this.mCommonWindowBg.OnAdded(this);
        var model = GameGlobal.XiandaoModel;
        var turnData = this.m_TurnData = model.GetTurnData(turnId, index);
        if (turnData) {
            var role1 = model.GetRoleData(turnData.noA);
            var role2 = model.GetRoleData(turnData.noB);
            this.SetAttData(role1, this.att1, this.role1);
            this.SetAttData(role2, this.att2, this.role2);
            var list = [];
            for (var i = 0; i < turnData.fightRecord.length; i++) {
                list.push({
                    turn: turnData,
                    role1: role1,
                    role2: role2,
                    turnId: turnId,
                    index: index,
                });
            }
            this.list.dataProvider = new eui.ArrayCollection(list);
        }
    };
    XiandaoVideoPanel.prototype.OnClose = function () {
    };
    XiandaoVideoPanel.prototype.GetAttLabel = function (group) {
        var list = [];
        for (var _i = 0, _a = group.$children; _i < _a.length; _i++) {
            var data = _a[_i];
            for (var _b = 0, _c = data.$children; _b < _c.length; _b++) {
                var child = _c[_b];
                if (egret.is(child, "eui.Label")) {
                    list.push(child);
                    break;
                }
            }
        }
        return list;
    };
    XiandaoVideoPanel.prototype.SetAttData = function (data, attGroup, role) {
        if (!data) {
            return;
        }
        var list = this.GetAttLabel(attGroup);
        list[0].text = GameString.GetSerAndName(data.serverId, data.roleName);
        list[1].text = "Lv." + data.lv;
        list[2].textFlow = TextFlowMaker.generateTextFlow("战力：|C:0x019704&T:" + data.power + "|");
        role.SetShowImage(data.shows);
    };
    XiandaoVideoPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return XiandaoVideoPanel;
}(BaseEuiView));
__reflect(XiandaoVideoPanel.prototype, "XiandaoVideoPanel");
var XiandaoVideoItem = (function (_super) {
    __extends(XiandaoVideoItem, _super);
    function XiandaoVideoItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    XiandaoVideoItem.prototype.childrenCreated = function () {
        UIHelper.SetLinkStyleLabel(this.videoLabel);
        this.videoLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    XiandaoVideoItem.prototype._OnClick = function () {
        var turn = this.data.turn;
        GameGlobal.XiandaoModel.SendVideo([16, 8, 4, 2][this.data.turnId], this.data.index + 1, this.itemIndex + 1);
    };
    XiandaoVideoItem.prototype.dataChanged = function () {
        if (!this.data) {
            return;
        }
        var turn = this.data.turn;
        this.turn.text = "\u7B2C" + StringUtils.numberToChinese(this.itemIndex + 1) + "\u5C40";
        var isWin = turn.noA == turn.winNo;
        var role1 = this.data.role1;
        var role2 = this.data.role2;
        this.nameLabel1.text = GameString.GetSerAndName(role1.serverId, role1.roleName);
        this.nameLabel2.text = GameString.GetSerAndName(role2.serverId, role2.roleName);
        this.retImg1.source = isWin ? "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai";
        this.retImg2.source = !isWin ? "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai";
    };
    return XiandaoVideoItem;
}(eui.ItemRenderer));
__reflect(XiandaoVideoItem.prototype, "XiandaoVideoItem");
//# sourceMappingURL=XiandaoVideoPanel.js.map