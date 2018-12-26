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
var XiandaoBetPanel = (function (_super) {
    __extends(XiandaoBetPanel, _super);
    function XiandaoBetPanel() {
        var _this = _super.call(this) || this;
        _this.items = [];
        _this.skinName = "XiandaoBetSkin";
        return _this;
    }
    XiandaoBetPanel.prototype.GetAttLabel = function (group) {
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
    XiandaoBetPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var turnId = param[0];
        var index = param[1];
        this.m_Index = index;
        this.m_TurnId = turnId;
        this.mCommonWindowBg.OnAdded(this);
        this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent);
        var i = 0;
        for (var _a = 0, _b = this.group.$children; _a < _b.length; _a++) {
            var data = _b[_a];
            var item = new XiandaoBetItem(data);
            item.btn.name = i + "";
            this.AddClick(item.btn, this._OnClick);
            this.items.push(item);
            ++i;
        }
        this.AddChange(this.check1, this._OnCheck);
        this.AddChange(this.check2, this._OnCheck);
        this.UpdateContent();
    };
    XiandaoBetPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.XiandaoModel;
        this.m_BetData = model.GetBetData(this.m_Index);
        var turnData = this.m_TurnData = model.GetTurnData(this.m_TurnId, this.m_Index);
        if (turnData) {
            var role1 = model.GetRoleData(turnData.noA);
            var role2 = model.GetRoleData(turnData.noB);
            this.check1.selected = role1.power >= role2.power;
            this.check2.selected = !this.check1.selected;
            this.SetAttData(role1, this.att1, this.role1, this.check1);
            this.SetAttData(role2, this.att2, this.role2, this.check2);
            if (this.m_BetData) {
                this.check1.selected = 1 == this.m_BetData.no;
                this.check2.selected = 2 == this.m_BetData.no;
            }
        }
        var selIndex = this.m_BetData ? (this.m_BetData.typ - 1) : -1;
        var _loop_1 = function (i) {
            var item = this_1.items[i];
            var config = GameGlobal.Config.XianDuMatchStakeBaseConfig[i + 1];
            item.item.data = config.cost;
            var index = i;
            item.item.mCallback = function () {
                ViewManager.ins().open(XiandaoBetTipPanel, index);
            };
            item.price.type = config.cost.id;
            item.price.price = config.cost.count;
            if (selIndex >= 0) {
                item.price.visible = true;
                item.btn.visible = false;
                item.yaImg.visible = selIndex == i;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.items.length; i++) {
            _loop_1(i);
        }
    };
    XiandaoBetPanel.prototype.SetAttData = function (data, attGroup, role, check) {
        if (!data) {
            return;
        }
        var list = this.GetAttLabel(attGroup);
        list[0].text = GameString.GetSerAndName(data.serverId, data.roleName);
        list[1].text = "Lv." + data.lv;
        list[2].textFlow = TextFlowMaker.generateTextFlow("战力：|C:0x019704&T:" + data.power + "|");
        check.label = GameString.GetSerAndName(data.serverId, data.roleName);
        role.SetShowImage(data.shows);
    };
    XiandaoBetPanel.prototype._OnCheck = function (e) {
        if (!this.m_TurnData) {
            return;
        }
        if (this.m_BetData) {
            this.check1.selected = this.m_BetData.no == 1;
            this.check2.selected = this.m_BetData.no == 2;
            return;
        }
        if (!e.currentTarget.selected) {
            e.currentTarget.selected = true;
        }
        else {
            if (e.currentTarget == this.check1) {
                this.check2.selected = false;
            }
            else {
                this.check1.selected = false;
            }
        }
    };
    XiandaoBetPanel.prototype._OnClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        GameGlobal.XiandaoModel.SendGamble(this.m_Index, this.check1.selected ? 0 : 1, index);
    };
    XiandaoBetPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return XiandaoBetPanel;
}(BaseEuiView));
__reflect(XiandaoBetPanel.prototype, "XiandaoBetPanel");
var XiandaoBetItem = (function () {
    function XiandaoBetItem(group) {
        this.mGroup = group;
        this.item = group.getChildByName("item");
        this.btn = group.getChildByName("btn");
        this.price = group.getChildByName("price");
        this.yaImg = group.getChildByName("ya");
    }
    return XiandaoBetItem;
}());
__reflect(XiandaoBetItem.prototype, "XiandaoBetItem");
//# sourceMappingURL=XiandaoBetPanel.js.map