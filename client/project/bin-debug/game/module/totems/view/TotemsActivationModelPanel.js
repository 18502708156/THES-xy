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
/**
 * 图腾_激活/突破模块
 */
var TotemsActivationModelPanel = (function (_super) {
    __extends(TotemsActivationModelPanel, _super);
    function TotemsActivationModelPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.x1 = 192.5;
        _this.x2 = 345.5;
        _this.text = "图腾激活条件";
        _this.text2 = "图腾突破条件";
        _this.btnText = "激活";
        _this.btnText2 = "突破";
        _this.skinName = "TotemsActivationModelSkin";
        return _this;
    }
    TotemsActivationModelPanel.prototype.childrenCreated = function () {
        this.tabTotemsActConfig = GameGlobal.Config.TotemsActConfig;
        this.tabTotemsAttrsConfig = GameGlobal.Config.TotemsAttrsConfig;
        // this.index=GameGlobal.TotemsModel.clickIndex;
        this._AddClick(this.addFiftyBtn, this.onClick);
    };
    TotemsActivationModelPanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.addFiftyBtn:
                var IDArr = GameGlobal.TotemsModel.tabIDArr();
                if (this.addFiftyBtn.label == this.btnText) {
                    var cost = this.tabTotemsActConfig[IDArr[this.index]].cost[0];
                    if (Checker.CheckItem(cost.id, cost.count, false) == true) {
                        GameGlobal.TotemsModel.activationTotems(IDArr[this.index]);
                    }
                }
                else if (this.addFiftyBtn.label == this.btnText2) {
                    var totemsDic = GameGlobal.TotemsModel.totemsDic;
                    var id = totemsDic[IDArr[this.index]].id;
                    //let lv=totemsDic[IDArr[this.index]].lv;
                    var lv = totemsDic[IDArr[this.index]].breach;
                    if (lv <= this.tabTotemsAttrsConfig[id].length) {
                        var tpcost = this.tabTotemsAttrsConfig[id][lv].tpcost;
                        if (tpcost != undefined) {
                            if (Checker.CheckItem(tpcost[0].id, tpcost[0].count, false) == true) {
                                GameGlobal.TotemsModel.breachTotems(IDArr[this.index]);
                            }
                        }
                    }
                }
                break;
        }
    };
    TotemsActivationModelPanel.prototype.updateModelShow = function () {
        this.currentLabel.text = "";
        this.index = GameGlobal.TotemsModel.clickIndex;
        var IDArr = GameGlobal.TotemsModel.tabIDArr();
        var totemsDic = GameGlobal.TotemsModel.totemsDic;
        if (totemsDic[IDArr[this.index]] != undefined) {
            this.currentGroup.visible = true;
            this.upGroup.x = this.x2;
            this.ItemShow2(totemsDic);
            this.LabelShow2(totemsDic);
            this.describeLabel.text = this.text2;
            this.addFiftyBtn.label = this.btnText2;
        }
        else {
            this.currentLabel.text = "";
            this.currentGroup.visible = false;
            this.upGroup.x = this.x1;
            this.LabelShow();
            this.ItemShow();
            this.LabelShow2(totemsDic);
            this.describeLabel.text = this.text;
            this.addFiftyBtn.label = this.btnText;
        }
    };
    TotemsActivationModelPanel.prototype.ItemShow = function () {
        // this.currentGroup.visible=false;
        // this.upGroup.x=this.x1;
        var IDArr = GameGlobal.TotemsModel.tabIDArr();
        var itemArr = this.tabTotemsActConfig[IDArr[this.index]].cost[0];
        //this.priceicon.type=itemArr.id;
        //this.priceicon.price=itemArr.count;
        this.priceicon.setPriceData(itemArr.id, itemArr.count);
        this.itemName.text = GameGlobal.Config.ItemConfig[itemArr.id].name;
        this.gotoVipLabel.SetId(itemArr.id);
    };
    TotemsActivationModelPanel.prototype.ItemShow2 = function (totemsDic) {
        // this.currentGroup.visible=true;
        // this.upGroup.x=this.x2;
        var IDArr = GameGlobal.TotemsModel.tabIDArr();
        var id = totemsDic[IDArr[this.index]].id;
        var lv = totemsDic[IDArr[this.index]].lv;
        if (lv <= this.tabTotemsAttrsConfig[id].length) {
            var breachID = totemsDic[IDArr[this.index]].breach;
            var tpcost = this.tabTotemsAttrsConfig[id][breachID].tpcost;
            if (tpcost != undefined) {
                // this.priceicon.type=tpcost[0].id;
                // this.priceicon.price=tpcost[0].count;
                this.priceicon.setPriceData(tpcost[0].id, tpcost[0].count);
                this.itemName.text = GameGlobal.Config.ItemConfig[tpcost[0].id].name;
            }
            else {
                var itemArr = this.tabTotemsAttrsConfig[IDArr[this.index]][lv].cost[0];
                this.itemName.text = GameGlobal.Config.ItemConfig[itemArr.id].name;
            }
        }
        // let itemArr=this.tabTotemsAttrsConfig[IDArr[this.index]][lv].cost[0];
        // this.itemName.text=GameGlobal.Config.ItemConfig[itemArr.id].name;
    };
    TotemsActivationModelPanel.prototype.LabelShow = function () {
        var IDArr = GameGlobal.TotemsModel.tabIDArr();
        var id = IDArr[this.index];
        var attrpower = this.tabTotemsAttrsConfig[id][0].attrpower;
        if (attrpower != undefined) {
            var str2 = AttributeData.TYPE_TO_NAME[attrpower[0].type];
            var str = AttributeData.getAttStrByType(attrpower[0]);
            if (str != "+undefined")
                this.currentLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>" + str + "</b>");
        }
    };
    TotemsActivationModelPanel.prototype.LabelShow2 = function (totemsDic) {
        var IDArr = GameGlobal.TotemsModel.tabIDArr();
        if (totemsDic[IDArr[this.index]] != undefined) {
            var id = totemsDic[IDArr[this.index]].id;
            var lv = 0;
            var breach = totemsDic[IDArr[this.index]].breach;
            if (breach == 0)
                lv = totemsDic[IDArr[this.index]].lv;
            else
                lv = breach;
            // this.currentGroup.visible=true;
            //this.upGroup.visible=true;
            // this.upGroup.x=this.x2;
            if (lv <= this.tabTotemsAttrsConfig[id].length) {
                var attrpower = this.tabTotemsAttrsConfig[id][lv - 1].attrpower;
                if (attrpower != undefined) {
                    var str2_1 = AttributeData.TYPE_TO_NAME[attrpower[0].type];
                    var str_1 = AttributeData.getAttStrByType(attrpower[0]);
                    if (str_1 != "+undefined")
                        this.currentLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2_1 + "</a><b color=0x00AD00>" + str_1 + "</b>");
                }
                var nextAttrpower = void 0;
                var labLV = 0;
                for (var i = 0; i < this.tabTotemsAttrsConfig[id].length; i++) {
                    var attrpower2 = this.tabTotemsAttrsConfig[id][i].attrpower;
                    if (attrpower != undefined) {
                        if (attrpower2 != undefined) {
                            if (attrpower[0].value != attrpower2[0].value && attrpower[0].value <= attrpower2[0].value) {
                                labLV = i;
                                nextAttrpower = attrpower2;
                                break;
                            }
                        }
                    }
                    else {
                        if (attrpower2 != undefined) {
                            nextAttrpower = attrpower2;
                            labLV = i;
                            break;
                        }
                    }
                }
                var str2 = AttributeData.TYPE_TO_NAME[nextAttrpower[0].type];
                var str = AttributeData.getAttStrByType(nextAttrpower[0]);
                if (str != "+undefined") {
                    this.upLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>" + str + "</b>");
                    this.openlvLabel.text = "(" + this.tabTotemsAttrsConfig[id][labLV].level + "级激活)";
                }
                // if(lv<this.tabTotemsAttrsConfig[id].length)
                // {	
                // 	let attrpowerUp=this.tabTotemsAttrsConfig[id][lv].attrpower;
                // 	if(attrpowerUp!=undefined)	
                // 	{
                // 		let str=AttributeData.getAttStrByType(attrpowerUp);
                // 		if(str!="+undefined")
                // 			this.upLabel.textFlow=str;
                // 	}
                // }
            }
        }
        else {
            var tab_Lv = 0;
            var nextAttrpower = void 0;
            for (var i = 0; i < this.tabTotemsAttrsConfig[IDArr[this.index]].length; i++) {
                var attrpower2 = this.tabTotemsAttrsConfig[IDArr[this.index]][i].attrpower;
                if (attrpower2 != undefined) {
                    tab_Lv = i;
                    nextAttrpower = attrpower2;
                    break;
                }
            }
            var str2 = AttributeData.TYPE_TO_NAME[nextAttrpower[0].type];
            var str = AttributeData.getAttStrByType(nextAttrpower[0]);
            if (str != "+undefined") {
                this.upLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>" + str + "</b>");
                this.openlvLabel.text = "(" + this.tabTotemsAttrsConfig[IDArr[this.index]][tab_Lv].level + "级激活)";
            }
        }
    };
    TotemsActivationModelPanel.prototype.UpdateContent = function () {
    };
    //SkinName
    //TotemsActivationModelSkin
    TotemsActivationModelPanel.NAME = "图腾";
    return TotemsActivationModelPanel;
}(BaseView));
__reflect(TotemsActivationModelPanel.prototype, "TotemsActivationModelPanel");
//# sourceMappingURL=TotemsActivationModelPanel.js.map