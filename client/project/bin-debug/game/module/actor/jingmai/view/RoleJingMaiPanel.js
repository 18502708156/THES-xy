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
var RoleJingMaiPanel = (function (_super) {
    __extends(RoleJingMaiPanel, _super);
    function RoleJingMaiPanel() {
        var _this = _super.call(this) || this;
        /**是否顶级 */
        _this.isTop = false;
        _this.skinName = "RoleJingMaiSkin";
        _this.config = GameGlobal.Config.JingMaiLevelConfig;
        return _this;
    }
    RoleJingMaiPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_30);
    };
    RoleJingMaiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle('经脉');
        this.AddClick(this.btnUp, this.onCkick);
        // this.AddClick(this.conGroup, this.onCkick);
        MessageCenter.ins().dispatch(MessageDef.JINGMAI_DATA_UPDATE);
        this.observe(MessageDef.JINGMAI_DATA_UPDATE, this.UpdateContent);
        this.UpdateContent();
    };
    RoleJingMaiPanel.prototype.onCkick = function (e) {
        if (e.target == this.btnUp) {
            if (this.isTop) {
                UserTips.ins().showTips('经脉已达顶级');
                return;
            }
            var item = this.config[0 == this.level ? 1 : this.level].itemid;
            if (UserBag.CheckEnough(item.id, item.count)) {
                GameGlobal.JingMaiData.sendJingMaiUpLevel();
                UserTips.ins().showTips('升级成功');
            }
        }
        // else {
        // 	let index = this.conGroup.getChildIndex(e.target);
        // 	this.showAttr(this.step * JingMaiData.MAX_LEVEL + (index + 1));
        // }
    };
    RoleJingMaiPanel.prototype.showAttr = function (lv) {
        var config = GameGlobal.Config.JingMaiLevelConfig[this.isTop ? lv - 1 : lv];
        this.tattr.text = AttributeData.getAttStr(config.attr, 0, 1, '：');
    };
    RoleJingMaiPanel.prototype.UpdateContent = function () {
        var i = 1, len = JingMaiData.MAX_LEVEL;
        this.level = GameGlobal.JingMaiData.level;
        this.isTop = null == this.config[this.level + 1];
        this.fullLabel.visible = this.isTop;
        this.attGroup.visible = !this.isTop;
        this.step = this.level / len >> 0;
        var lv = this.level % len;
        if (this._IsMaxLv(this.level)) {
            lv = JingMaiData.MAX_LEVEL;
            this.step -= 1;
        }
        var data;
        var icon;
        var txt;
        for (i; i <= len; i++) {
            data = this.config[i + this.step * len];
            if (data) {
                txt = this['tname' + i];
                txt.text = data.name;
                txt.textColor = i > lv ? 0x94999b : 0x019704;
                icon = this.conGroup.getChildAt(i - 1);
                icon.source = i > lv ? 'ui_jm_bm_tupo02' : 'ui_jm_bm_tupo01';
                if (i == len)
                    icon.scaleX = icon.scaleY = 1.2;
                else
                    icon.scaleX = icon.scaleY = 1;
            }
        }
        var attr;
        for (i = 0; i < 8; i++) {
            attr = GameGlobal.JingMaiData.totalAttrs[i];
            if (attr) {
                this['totalAttr' + i].text = AttributeData.getAttStrByType(attr, 0, "+", false, '#682f00');
            }
            else {
                this['totalAttr' + i].text = '';
            }
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(GameGlobal.JingMaiData.totalAttrs);
        this.showAttr(0 == this.level ? 1 : this.level);
        var item = this.config[0 == this.level ? 1 : this.level].itemid;
        if (item) {
            this.needItemView.SetItemId(item.id, item.count);
        }
        var tenStep = (this.step + 1) / 10 >> 0;
        var numStep = (this.step + 1) % 10;
        var str = '';
        if (tenStep > 0) {
            if (tenStep > 1) {
                str = StringUtils.numTenToChinese(tenStep) + '十';
                if (numStep > 0)
                    str += StringUtils.numTenToChinese(numStep) + '重';
                else
                    str += '重';
            }
            else {
                if (numStep > 0)
                    str = '十' + StringUtils.numTenToChinese(numStep) + '重';
                else
                    str = '十重';
            }
        }
        else {
            str = StringUtils.numTenToChinese(this.step + 1) + '重';
        }
        this.stepLabel.text = str;
        this.btnUp.label = 0 == this.level ? '激 活' : 10 == lv ? '突 破' : '升 级';
        this.selectEff.visible = true;
        this.selectEff.x = this.conGroup.getChildAt(lv).x - 8 >> 0;
        this.selectEff.y = this.conGroup.getChildAt(lv).y - 8 >> 0;
        if (lv == len - 1)
            this.selectEff.scaleX = this.selectEff.scaleY = 1.2;
        else
            this.selectEff.scaleX = this.selectEff.scaleY = 1;
        if (this.isTop) {
            // txt = this['tname' + lv];
            txt = this.tname10;
            txt.text = this.config[this.level].name;
            txt.textColor = 0x019704;
            icon = this.conGroup.getChildAt(lv);
            icon.source = 'ui_jm_bm_tupo01';
            this.selectEff.visible = false;
        }
    };
    RoleJingMaiPanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
    };
    RoleJingMaiPanel.prototype._IsMaxLv = function (lv) {
        return this.config[lv + 1] == null;
    };
    RoleJingMaiPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleJingMaiPanel;
}(BaseEuiView));
__reflect(RoleJingMaiPanel.prototype, "RoleJingMaiPanel", ["ICommonWindow"]);
//# sourceMappingURL=RoleJingMaiPanel.js.map