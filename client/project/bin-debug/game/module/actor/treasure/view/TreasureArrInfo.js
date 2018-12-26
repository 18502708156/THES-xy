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
var TreasureArrInfo = (function (_super) {
    __extends(TreasureArrInfo, _super);
    function TreasureArrInfo() {
        return _super.call(this) || this;
    }
    TreasureArrInfo.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "TreasureArrSkin";
    };
    ;
    TreasureArrInfo.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var data = param[0];
        var nPos = param[1];
        this.bViBtn = param[2];
        this.bg.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.btnDress.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_END, this.onShow, this);
        this.setData(data, nPos);
        this.setMakeName(param[3]);
        UIHelper.PlayPanelTween(this.animGroup);
    };
    TreasureArrInfo.prototype.OnClose = function () {
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.btnDress.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
    };
    TreasureArrInfo.prototype.otherClose = function (evt) {
        ViewManager.ins().close(TreasureArrInfo);
    };
    TreasureArrInfo.prototype.onUp = function (evt) {
        if (this.data.spellsId) {
            if (GameGlobal.TreasureModel.canEquip(this.data.type, this.nPos - 1)) {
                //处理位置.
                GameGlobal.TreasureModel.sendSpellsResUse(this.nPos, this.data.spellsId);
            }
            else {
                UserTips.ins().showTips("相同类型的法宝不能装备");
            }
        }
        ViewManager.ins().close(TreasureArrInfo);
    };
    //展示
    TreasureArrInfo.prototype.onShow = function () {
        //法宝内容
        var tList = [];
        // let tObj = { type: 2, value: this.data.id, valueEx: this.data.level || 1 };
        var tObj = new Sproto.client_chat_param;
        tObj.type = 2;
        tObj.value = this.data.id;
        tObj.valueEx = this.data.level || 1;
        tObj.strvalue = this.data.skillid ? this.data.skillid.join(",") : "";
        tList.push(tObj);
        GameGlobal.Chat.chatShareInfo(3, tList);
        // UserTips.ins().showTips("展示成功")
        ViewManager.ins().close(TreasureArrInfo);
    };
    TreasureArrInfo.prototype._SetType = function (str) {
        if (str)
            this.type.text = "级别：" + str;
    };
    TreasureArrInfo.prototype.setMakeName = function (_str) {
        if (_str) {
            this.lv.text = "打造者: " + _str;
        }
        else {
            this.lv.text = "";
        }
    };
    TreasureArrInfo.prototype.setData = function (_data, _pos) {
        //当前选择位置
        this.nPos = _pos;
        if (!_data) {
            return;
        }
        var treasureData = _data;
        this.data = _data;
        if (this.bViBtn) {
            UIHelper.SetVisible(this.gDown, false);
        }
        else {
            UIHelper.SetVisible(this.gDown, true);
            if (_pos) {
                this.btnShow.x = 62;
                this.btnDress.visible = true;
            }
            else {
                this.btnShow.x = 121;
                this.btnDress.visible = false;
            }
        }
        this.nameLabel.text = treasureData.name; //名字
        this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[treasureData.quality];
        if (_data.attrs) {
            this.score.text = "评分: " + ItemConfig.CalcAttrScoreValue(_data.attrs);
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(_data.attrs); //战力
        }
        //圆形圆圈
        this.baseCricle.setData(treasureData);
        this._SetType(TreasureShowItem.TREASURETYPE[treasureData.quality]);
        //属性
        var strAtt = AttributeData.getAttStr(treasureData.attrs, 1);
        this.attr.text = strAtt;
        this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[treasureData.quality];
        //如果没有技能的话技能不需要显示
        if (treasureData.skillid && treasureData.skillid.length) {
            this.gSkill.visible = true;
            for (var _i = 0, _a = treasureData.skillid; _i < _a.length; _i++) {
                var id = _a[_i];
                var comp = (new eui.Component);
                comp.skinName = "TreasureSkillDescSkin";
                // comp.lbSkillName.text = SkillsConfig.GetSkillName(id)
                // comp.lbSkillDes.text = PetConst.GetSkillDesc(id)
                var type = SkillsConfig.GetSkillQuality(id);
                var tabelColor = ItemBase.QUALITY_TIP_COLOR[type];
                if (type == "")
                    tabelColor = ItemBase.QUALITY_TIP_COLOR[0];
                var str = SkillsConfig.GetSkillName(id);
                var str2 = PetConst.GetSkillDesc(id);
                comp.lbSkillName.textFlow = (new egret.HtmlTextParser).parser("<a color=" + tabelColor + ">" + str + "</a>");
                comp.lbSkillDes.textFlow = (new egret.HtmlTextParser).parser("<a color=" + tabelColor + ">" + str2 + "</a>");
                this.gSkill.addChild(comp);
            }
            // this.lbSkillName.text = SkillsConfig.GetSkillName(itemConfig.skillid)//名称
            // this.lbSkillDes.text = PetConst.GetSkillDesc(itemConfig.skillid)
        }
    };
    return TreasureArrInfo;
}(BaseEuiView));
__reflect(TreasureArrInfo.prototype, "TreasureArrInfo");
TreasureArrInfo.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=TreasureArrInfo.js.map