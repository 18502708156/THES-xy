/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/6 16:21
 * @meaning: 命格装备界面
 *
 **/
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
var DestinyEquipLayer = (function (_super) {
    __extends(DestinyEquipLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyEquipLayer() {
        var _this = _super.call(this) || this;
        _this.nPos = 0; //当前位置0开始
        _this.skinName = "DestinyEquipDlgSkin";
        _this.listView.itemRenderer = DestinyEquipItem;
        _this.listView.dataProvider = new eui.ArrayCollection;
        UIHelper.SetLinkStyleLabel(_this.lbGo, "前往获取命格"); //下划线
        _this.cEquip.buy.label = "升级";
        return _this;
    }
    DestinyEquipLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        //
        this.pDestinyData = param[0];
        this.nPos = param[1];
        if (this.cEquip.buy.visible = param[2]) {
            UIHelper.ShowRedPoint(this.cEquip.buy, GameGlobal.DestinyController.mRedPoint.IsRedUp(this.nPos));
        }
        this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent); //物品变化
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //命格数据变化
        this.observe(MessageDef.DESTINY_EQUIP_REWARD, this.equipItem); //装备物品
        this.AddClick(this.lbGo, this.onClick);
        this.AddClick(this.cEquip.buy, this.onUpClick);
        this.UpdateContent();
    };
    DestinyEquipLayer.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    DestinyEquipLayer.prototype.UpdateContent = function () {
        var DestinyAttrsConfig = GameGlobal.Config.DestinyAttrsConfig;
        var pDestinyDataType = -1;
        if (this.pDestinyData && this.pDestinyData.item && DestinyAttrsConfig[this.pDestinyData.item]) {
            pDestinyDataType = DestinyAttrsConfig[this.pDestinyData.item].sort;
        }
        var typeDict = {};
        var outlist = [];
        var list = GameGlobal.DestinyController.getUseDestinyData() || [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            if (!data.item) {
                continue;
            }
            var config = DestinyAttrsConfig[data.item];
            if (!config) {
                continue;
            }
            if (config.sort == pDestinyDataType) {
                continue;
            }
            typeDict[config.sort] = true;
        }
        var itemList = GameGlobal.UserBag.GetBagStarList();
        for (var key in itemList) {
            var itemData = itemList[key];
            if (DestinyAttrsConfig[itemData.configID] && !typeDict[DestinyAttrsConfig[itemData.configID].sort]) {
                outlist.push(itemData);
            }
        }
        var getScore = function (id) {
            var config = GameGlobal.Config.DestinyAttrsConfig[id];
            if (config) {
                return ItemConfig.CalcAttrScoreValue(config.attars);
            }
            else {
                return 0;
            }
        };
        outlist.sort(function (lhs, rhs) {
            return getScore(rhs.configID) - getScore(lhs.configID);
        });
        this.tLayerData = outlist;
        this.listView.dataProvider.replaceAll(this.tLayerData);
        if (this.tLayerData.length) {
            this.currentState = "have";
        }
        else {
            this.currentState = "kong";
        }
        if (this.pDestinyData && this.pDestinyData.item) {
            this.cEquip.visible = true;
            // this.cEquip.data = this.pDestinyData
            // this.cEquip.dataChanged()
            this.upEquip();
            this.scroller.height = 491;
            this.equipGroup.visible = true;
        }
        else {
            this.cEquip.visible = false;
            this.scroller.height = 658;
            this.equipGroup.visible = false;
        }
    };
    DestinyEquipLayer.prototype.upEquip = function () {
        if (this.pDestinyData) {
            var itemConfig = GlobalConfig.ins().ItemConfig[this.pDestinyData.item];
            if (itemConfig.name) {
                this.cEquip.nameLabel.text = itemConfig.name;
                this.cEquip.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
            }
            // this.cEquip.buy.visible = false
            this.cEquip.itemIcon.setDataByConfig(itemConfig);
            this.cEquip.itemIcon.isShowName(false);
            this.cEquip.itemIcon.setItemCount(false);
            // let arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.pDestinyData.item]
            if (this.pDestinyData.attars) {
                this.cEquip.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(this.pDestinyData.attars);
                this.cEquip.lbInfo0.text = AttributeData.getAttStrByType(this.pDestinyData.attars[0], 0, ": ", false, '#682f00');
                if (this.pDestinyData.attars[1]) {
                    this.cEquip.lbInfo1.text = AttributeData.getAttStrByType(this.pDestinyData.attars[1], 0, ": ", false, '#682f00');
                }
                else {
                    this.cEquip.lbInfo1.text = "";
                }
            }
            else {
                this.cEquip.lbFight.text = "";
                this.cEquip.lbInfo0.text = this.pDestinyData.skillName || "";
                this.cEquip.lbInfo1.text = this.pDestinyData.desc || "";
            }
        }
        else {
        }
    };
    DestinyEquipLayer.prototype.equipItem = function (_id) {
        if (!_id)
            return;
        GameGlobal.DestinyManage.babyStartUse(_id, this.nPos + 1);
    };
    DestinyEquipLayer.prototype.onClick = function () {
        this.CloseSelf();
        // if (this.cEquip.buy.visible) {
        // 	ViewManager.ins().openIndex(LingtongMainPanel, 3)
        // } else {
        ViewManager.ins().openIndex(DestinyUpWin, 1);
        // }
    };
    DestinyEquipLayer.prototype.onUpClick = function () {
        this.CloseSelf();
        ViewManager.ins().open(DestinyUpWin, 0, this.nPos); //打开逆命窗口
    };
    DestinyEquipLayer.LAYER_LEVEL = LayerManager.UI_Popup;
    return DestinyEquipLayer;
}(BaseEuiView));
__reflect(DestinyEquipLayer.prototype, "DestinyEquipLayer");
//# sourceMappingURL=DestinyEquipLayer.js.map