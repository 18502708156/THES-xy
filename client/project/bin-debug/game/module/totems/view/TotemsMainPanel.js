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
 * 图腾
 */
var TotemsMainPanel = (function (_super) {
    __extends(TotemsMainPanel, _super);
    // private tabNameArr=[];
    // private tabImgArr=[];
    function TotemsMainPanel() {
        var _this = _super.call(this) || this;
        _this.itemCount = 8; //図騰個數
        _this.power = 0; //戰鬥力
        _this.IDArr = [];
        _this.skinName = "TotemsMainSkin";
        return _this;
    }
    TotemsMainPanel.prototype.UpdateContent = function () {
    };
    TotemsMainPanel.prototype.childrenCreated = function () {
        this.totemsActTab = GameGlobal.Config.TotemsActConfig;
        this.totemsAttrsTab = GameGlobal.Config.TotemsAttrsConfig;
        //let configArr = [1001, 1002, 1008]
        this.observe(MessageDef.TOTEMS_UPDATEACTIVATION, this.updateUpLvMes);
        this.IDArr = GameGlobal.TotemsModel.tabIDArr();
        this.totemsMain.bar.slideDuration = 0;
    };
    TotemsMainPanel.prototype.OnOpen = function () {
        this.itemCount = this.totemsGroup.numChildren;
        this.showImg();
        for (var i = 0; i < this.itemCount; i++) {
            this._AddClick(this.totemsGroup.getChildAt(i), this.onClick);
        }
        this._AddClick(this.checkAttr, this.onClick);
    };
    //private clickIndex=0;
    //點擊事件
    TotemsMainPanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.totemsGroup.getChildAt(0):
                GameGlobal.TotemsModel.clickIndex = 0;
                this.updateOther(0);
                break;
            case this.totemsGroup.getChildAt(1):
                GameGlobal.TotemsModel.clickIndex = 1;
                this.updateOther(1);
                break;
            case this.totemsGroup.getChildAt(2):
                GameGlobal.TotemsModel.clickIndex = 2;
                this.updateOther(2);
                break;
            case this.totemsGroup.getChildAt(3):
                GameGlobal.TotemsModel.clickIndex = 3;
                this.updateOther(3);
                break;
            case this.totemsGroup.getChildAt(4):
                GameGlobal.TotemsModel.clickIndex = 4;
                this.updateOther(4);
                break;
            case this.totemsGroup.getChildAt(5):
                GameGlobal.TotemsModel.clickIndex = 5;
                this.updateOther(5);
                break;
            case this.totemsGroup.getChildAt(6):
                GameGlobal.TotemsModel.clickIndex = 6;
                this.updateOther(6);
                break;
            case this.totemsGroup.getChildAt(7):
                GameGlobal.TotemsModel.clickIndex = 7;
                this.updateOther(7);
                break;
            case this.checkAttr:
                ViewManager.ins().open(TotemsInfoPanel, this.IDArr[GameGlobal.TotemsModel.clickIndex], this.power);
                break;
        }
    };
    TotemsMainPanel.prototype.showImg = function () {
        var defaultID = 0;
        var index = 0;
        // this.IDArr=[];
        //let globalIndex=0;
        for (var key in this.totemsActTab) {
            var row = this.totemsActTab[key];
            // this.tabNameArr.push(row.name);
            // this.tabImgArr.push(row.pic);
            // this.IDArr.push(row.id);
            if (index < this.itemCount) {
                if (GameGlobal.TotemsModel.totemsDic[key] != undefined) {
                    if (defaultID == 0)
                        defaultID = index;
                    // let lv=GameGlobal.TotemsModel.totemsDic[key].lv;
                    // let breachID=GameGlobal.TotemsModel.totemsDic[key].breach;
                    // if(breachID!=0)//需要突破
                    // {
                    // 	if(this.totemsAttrsTab[key][breachID].tpcost!=undefined)
                    // 	{
                    // 		if(Checker.Data(this.totemsAttrsTab[key][breachID].tpcost[0],false)==true)
                    // 			this.updateRedItemGlobal(index,true);
                    // 	}
                    // }
                    // else
                    // {
                    // 	this.updateRedItemGlobal(index,false);
                    // }
                }
                // else
                // {
                // 	let item=this.totemsActTab[key].cost[0];
                // 		if(Checker.Data(item,false)==true)
                // 			this.updateRedItemGlobal(index,true);
                // 		else
                // 			this.updateRedItemGlobal(index,false);
                // }
                this.isShowIconSign(index);
                index++;
            }
        }
        GameGlobal.TotemsModel.clickIndex = defaultID;
        this.updateOther(defaultID);
        this.totemsGroup.getChildAt(defaultID).img_select.visible = true;
        this.activationLabel.text = this.totemsDicCount().toString();
        // this.totemsActivation.updateModelShow();
        this.updateRedPoint();
    };
    TotemsMainPanel.prototype.updateUpLvMes = function () {
        this.updateOther(GameGlobal.TotemsModel.clickIndex);
    };
    TotemsMainPanel.prototype.updateOther = function (index) {
        this.updateRedPoint();
        this.updatePower(index);
        this.updateTotemsName(index);
        this.updateTotemsActivation(index);
        this.isShowIconSign(index);
        this.updateTotemsLogo(index);
        this.updateSelectImg(index);
        this.updateModelView(index);
        //GameGlobal.TotemsModel.isNotUp=false;
        var lv = 0;
        var tabLength = this.totemsAttrsTab[this.IDArr[index]].length;
        if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]] != undefined)
            lv = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
        if (lv < tabLength) {
            this.totemsActivation.updateModelShow();
            this.totemsMain.updateModelShow();
        }
        this.activationLabel.text = this.totemsDicCount().toString();
        // if(GameGlobal.TotemsModel.isNotUp)
        // {	
        // 	this.updateRedItemGlobal(index,true);
        // 	//GameGlobal.TotemsModel.isNotUp=false
        // }
        // else
        // 	this.updateRedItemGlobal(index,false);
    };
    TotemsMainPanel.prototype.updateSelectImg = function (index) {
        for (var i = 0; i < this.itemCount; i++) {
            this.totemsGroup.getChildAt(i).img_select.visible = false;
        }
        this.totemsGroup.getChildAt(index).img_select.visible = true;
    };
    TotemsMainPanel.prototype.updateRedPoint = function () {
        var dic = GameGlobal.TotemsModel.mRedPoint.mRedPointMap;
        for (var key in dic) {
            var index = GameGlobal.TotemsModel.DicIndex(key, this.IDArr);
            this.updateRedItemGlobal(index, dic[key]);
        }
    };
    //更新紅點
    TotemsMainPanel.prototype.updateRedItemGlobal = function (index, bool) {
        if (bool === void 0) { bool = false; }
        this.totemsGroup.getChildAt(index).redPoint.visible = bool;
    };
    //设置是否变灰
    TotemsMainPanel.prototype.isShowIconSign = function (index) {
        var row = this.totemsActTab[this.IDArr[index]];
        if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]] != undefined)
            this.totemsGroup.getChildAt(index).img_icon.source = row.icon; //_s
        else
            this.totemsGroup.getChildAt(index).img_icon.source = row.icon + "_s"; //_s
    };
    //設置標題
    TotemsMainPanel.prototype.updateTotemsName = function (index) {
        this.nameLabel.text = this.totemsActTab[this.IDArr[index]].name;
    };
    //設置是否激活図標
    TotemsMainPanel.prototype.updateTotemsActivation = function (index) {
        if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]] != undefined) {
            this.noImg.visible = false;
            this.LvGroup.visible = true;
            // ItemConfig.CalcAttrScoreValue()
            // this.totalPower.text=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
            var lv = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
            var breach = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach;
            if (breach == 0)
                this.LvLabel.text = lv + "级";
            else {
                this.LvLabel.text = breach + "级";
            }
        }
        else {
            this.LvGroup.visible = false;
            this.noImg.visible = true;
        }
    };
    //战斗力
    TotemsMainPanel.prototype.updatePower = function (index) {
        var power = this.calculationPower(index);
        this.power = power;
        this.totalPower.text = power.toString();
        var powerAll = 0;
        for (var i = 0; i < this.IDArr.length; i++) {
            if (GameGlobal.TotemsModel.totemsDic[this.IDArr[i]] != undefined) {
                powerAll += this.calculationPower(i, false);
            }
        }
        this.powerLabel.text = powerAll.toString();
    };
    //計算戰鬥力
    TotemsMainPanel.prototype.calculationPower = function (index, bool) {
        if (bool === void 0) { bool = true; }
        var power = 0;
        var attr;
        var attrpower;
        if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]] != undefined) {
            var breach = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach;
            var lv = 0;
            if (breach == 0)
                lv = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
            else
                lv = breach;
            if (this.totemsAttrsTab[this.IDArr[index]][lv - 1] != undefined) {
                attr = this.totemsAttrsTab[this.IDArr[index]][lv - 1].attr;
                attrpower = this.totemsAttrsTab[this.IDArr[index]][lv - 1].attrpower;
            }
        }
        else {
            if (bool == true) {
                attr = this.totemsAttrsTab[this.IDArr[index]][0].attr;
                attrpower = this.totemsAttrsTab[this.IDArr[index]][0].attrpower;
            }
        }
        if (attr != undefined)
            power += ItemConfig.CalcAttrScoreValue(attr);
        if (attrpower != undefined)
            power += ItemConfig.CalcAttrScoreValue(attrpower);
        return power;
    };
    //設置怪物Logo
    TotemsMainPanel.prototype.updateTotemsLogo = function (index) {
        this.totemsImg.source = this.totemsActTab[this.IDArr[index]].pic;
    };
    //切換模塊Panel
    TotemsMainPanel.prototype.updateModelView = function (index) {
        this.LvMaxLabel.visible = false;
        if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]] != undefined) {
            var lv = GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
            var tabLength = this.totemsAttrsTab[this.IDArr[index]].length;
            // let tpcost=this.totemsAttrsTab[this.IDArr[index]][lv-1].tpcost; 
            if (lv < tabLength) {
                if (GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach != 0) {
                    this.totemsMain.visible = false;
                    this.totemsActivation.visible = true;
                }
                else {
                    this.totemsMain.visible = true;
                    this.totemsActivation.visible = false;
                }
            }
            else {
                this.totemsMain.visible = false;
                this.totemsActivation.visible = false;
                this.LvMaxLabel.visible = true;
            }
        }
        else {
            this.totemsMain.visible = false;
            this.totemsActivation.visible = true;
        }
    };
    //激活個數
    TotemsMainPanel.prototype.totemsDicCount = function () {
        var number = 0;
        for (var key in GameGlobal.TotemsModel.totemsDic) {
            if (GameGlobal.TotemsModel.totemsDic[key] != undefined)
                number += 1;
        }
        return number;
    };
    //SkinName
    //TotemsMainSkin
    TotemsMainPanel.NAME = "图腾";
    return TotemsMainPanel;
}(BaseView));
__reflect(TotemsMainPanel.prototype, "TotemsMainPanel", ["ICommonWindowTitle"]);
var TotemsItemCom = (function (_super) {
    __extends(TotemsItemCom, _super);
    function TotemsItemCom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TotemsItemCom.prototype.childrenCreated = function () {
        this.img_select.visible = false;
    };
    return TotemsItemCom;
}(eui.Component));
__reflect(TotemsItemCom.prototype, "TotemsItemCom");
//# sourceMappingURL=TotemsMainPanel.js.map