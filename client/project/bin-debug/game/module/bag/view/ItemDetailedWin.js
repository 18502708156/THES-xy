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
var ItemDetailedWin = (function (_super) {
    __extends(ItemDetailedWin, _super);
    function ItemDetailedWin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemDetailedWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "ItemTipsSkin";
        this.jobLabel1.visible = false;
    };
    ;
    ItemDetailedWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var type = param[0];
        var id = param[1];
        var num = param[2];
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.setData(type, id, num);
    };
    ;
    ItemDetailedWin.prototype.OnClose = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
    };
    ;
    ItemDetailedWin.prototype.otherClose = function (evt) {
        ViewManager.ins().close(this);
    };
    ;
    ItemDetailedWin.prototype.setData = function (type, id, num) {
        var numStr = "";
        if (num == undefined) {
            var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
            if (data && data.count) {
                numStr = data.count + "";
            }
        }
        else {
            numStr = num + "";
        }
        var config = GlobalConfig.ins().ItemConfig[id];
        if (config.name) {
            this.nameLabel.text = config.name;
        }
        else {
            this.nameLabel.text = "";
        }
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
        this.itemIcon.setData(config);
        if (config.level) {
            this.lv.text = "等级：" + config.level + "级";
        }
        else {
            this.lv.text = "";
        }
        if (config.type == ItemType.DESTINY) {
            var str = config.desc + "\n";
            var attrConfig = GameGlobal.Config.DestinyAttrsConfig[id];
            if (attrConfig) {
                str += AttributeData.getAttStr(attrConfig.attars, 1, 1, "+", false, "00fc06&", "        ");
            }
            this.description.textFlow = TextFlowMaker.generateTextFlow(str);
        }
        else {
            this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
        }
        if (config.type == 2) {
            // var sID = MiJiSkillConfig.getSkillIDByItem(config.id);
            // this.power.text = "评分：" + GlobalConfig.ins().MiJiSkillConfig[sID].power;
        }
        else
            this.power.text = "";
        this.num.text = "数量：" + numStr;
        if (this.power.text == "") {
            this.powerLabel.visible = false;
            this.powerLabel.y = 0;
            this.lineImg.y = 140;
        }
        egret.callLater(this.LaterUpdate, this);
    };
    ;
    ItemDetailedWin.prototype.LaterUpdate = function () {
        this.group1.height = this.group2.height + 37;
    };
    return ItemDetailedWin;
}(BaseEuiView));
__reflect(ItemDetailedWin.prototype, "ItemDetailedWin");
ItemDetailedWin.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=ItemDetailedWin.js.map