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
 * 图腾_进度条模块
 */
var TotemsMainModelPanel = (function (_super) {
    __extends(TotemsMainModelPanel, _super);
    function TotemsMainModelPanel() {
        var _this = _super.call(this) || this;
        //checkBool
        _this.checkBool = false;
        _this.One = 1;
        _this.Ten = 10;
        _this.Fifty = 50;
        _this.index = 0;
        _this.IDArr = [];
        _this.skinName = "TotemsMainModelSkin";
        return _this;
    }
    TotemsMainModelPanel.prototype.childrenCreated = function () {
        this.tabTotemsActConfig = GameGlobal.Config.TotemsActConfig;
        this.tabTotemsAttrsConfig = GameGlobal.Config.TotemsAttrsConfig;
        this.tabTotemsBaoJiConfig = GameGlobal.Config.TotemsBaoJiConfig;
        this._AddClick(this.checkBox, this.onClick);
        this._AddClick(this.addBtn, this.onClick);
        this._AddClick(this.addTenBtn, this.onClick);
        this._AddClick(this.addFiftyBtn, this.onClick);
    };
    TotemsMainModelPanel.prototype.updateModelShow = function () {
        this.index = GameGlobal.TotemsModel.clickIndex;
        this.IDArr = GameGlobal.TotemsModel.tabIDArr();
        this.totemsDic = GameGlobal.TotemsModel.totemsDic;
        this.updateLabel();
        this.updateBar();
        this.updaeConsume();
        this.updatePriceicon();
        this.updateDescribe();
    };
    TotemsMainModelPanel.prototype.updateDescribe = function () {
        this.describeLabel.text = "";
        var ID = this.IDArr[this.index];
        if (this.totemsDic[ID] != undefined) {
            var tabID = this.totemsDic[ID].todayId;
            var modelNum = this.totemsDic[ID].todayNum;
            if (this.tabTotemsBaoJiConfig[tabID] != undefined) {
                var tabNum = this.tabTotemsBaoJiConfig[tabID].num;
                var tabRat = this.tabTotemsBaoJiConfig[tabID].rat;
                var needNum = tabNum - modelNum;
                if (needNum != undefined && tabRat != undefined)
                    this.describeLabel.text = "再升级" + needNum + "次必定" + tabRat + "倍暴击,累计次数次日重置";
            }
        }
    };
    TotemsMainModelPanel.prototype.updatePriceicon = function () {
        var itemArr = this.tabTotemsActConfig[this.IDArr[this.index]].cost[0];
        this.priceicon.type = itemArr.id;
        this.priceicon.price = GameGlobal.UserBag.GetCount(itemArr.id); //GameGlobal.Config.ItemConfig[itemArr.id].count;
    };
    TotemsMainModelPanel.prototype.updaeConsume = function () {
        var ID = this.IDArr[this.index];
        if (this.totemsDic[ID] != undefined) {
            var lv = this.totemsDic[ID].lv;
            if (lv < this.tabTotemsAttrsConfig[ID].length) {
                this.cost = this.tabTotemsAttrsConfig[ID][lv].cost;
                this.consumeLabel.Set(this.cost);
            }
        }
    };
    TotemsMainModelPanel.prototype.updateBar = function () {
        if (this.totemsDic[this.IDArr[this.index]] != undefined) {
            var ID = this.IDArr[this.index];
            var lv = this.totemsDic[ID].lv;
            //进度条
            // this.bar.value=this.totemsDic[ID].upNum;
            // this.bar.maximum=this.totemsDic[ID].upNum;
            if (lv <= this.tabTotemsAttrsConfig[ID].length) {
                var exp = this.tabTotemsAttrsConfig[ID][lv].exp;
                this.bar.maximum = this.tabTotemsAttrsConfig[ID][lv - 1].proexp;
                this.bar.value = this.totemsDic[ID].upNum * exp;
                //this.bar.maximum=this.tabTotemsAttrsConfig[ID][lv-1].proexp;
            }
        }
    };
    TotemsMainModelPanel.prototype.updateLabel = function () {
        this.currentLabel.text = "";
        if (this.totemsDic[this.IDArr[this.index]] != undefined) {
            var id = this.totemsDic[this.IDArr[this.index]].id;
            var breachID = this.totemsDic[this.IDArr[this.index]].breach;
            var lv = 0;
            if (breachID == 0)
                lv = this.totemsDic[this.IDArr[this.index]].lv;
            else
                lv = breachID;
            var attrpower = void 0;
            var nextAttrpower = void 0;
            var labLV = 0;
            if (lv <= this.tabTotemsAttrsConfig[id].length) {
                attrpower = this.tabTotemsAttrsConfig[id][lv - 1].attrpower;
                if (attrpower != undefined) {
                    var str2_1 = AttributeData.TYPE_TO_NAME[attrpower[0].type];
                    var str_1 = AttributeData.getAttStrByType(attrpower[0]);
                    if (str_1 != "+undefined")
                        this.currentLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2_1 + "</a><b color=0x00AD00>" + str_1 + "</b>");
                }
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
            }
        }
    };
    TotemsMainModelPanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.addBtn:
                if (Checker.CheckItem(this.cost[0].id, this.cost[0].count * this.One, this.checkBool) == true) {
                    if (Checker.Money(this.cost[1].id, this.cost[1].count * this.One, true) == true) {
                        GameGlobal.TotemsModel.upTotems(this.IDArr[this.index], this.One, this.checkBool);
                    }
                }
                break;
            case this.addTenBtn:
                if (Checker.CheckItem(this.cost[0].id, this.cost[0].count * this.Ten, this.checkBool) == true)
                    if (Checker.Money(this.cost[1].id, this.cost[1].count * this.Ten, true) == true)
                        GameGlobal.TotemsModel.upTotems(this.IDArr[this.index], this.Ten, this.checkBool);
                break;
            case this.addFiftyBtn:
                if (Checker.CheckItem(this.cost[0].id, this.cost[0].count * this.Fifty, this.checkBool) == true)
                    if (Checker.Money(this.cost[1].id, this.cost[1].count * this.Fifty, true) == true)
                        GameGlobal.TotemsModel.upTotems(this.IDArr[this.index], this.Fifty, this.checkBool);
                break;
            case this.checkBox:
                this.checkBool = this.checkBox.selected;
                break;
        }
    };
    TotemsMainModelPanel.prototype.UpdateContent = function () {
    };
    //SkinName
    //TotemsMainModelSkin
    TotemsMainModelPanel.NAME = "图腾";
    return TotemsMainModelPanel;
}(BaseView));
__reflect(TotemsMainModelPanel.prototype, "TotemsMainModelPanel");
//# sourceMappingURL=TotemsMainModelPanel.js.map