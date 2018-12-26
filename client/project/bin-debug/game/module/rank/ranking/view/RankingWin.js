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
var RankingWin = (function (_super) {
    __extends(RankingWin, _super);
    function RankingWin() {
        var _this = _super.call(this) || this;
        _this.curSelectedIndex = 0;
        _this.skinName = 'RankingWinSkin';
        return _this;
    }
    RankingWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("排行榜");
    };
    ;
    RankingWin.prototype.initData = function () {
        this.keyList.itemRenderer = KeyItem;
        this.valueList.itemRenderer = ValueItem;
        this.keyList.dataProvider = GameGlobal.RankingModel.getKeyItemData();
        this.top1Item = new ValueItem();
        this.top1Item.x = 5;
        this.top1Item.y = 6;
        this.top1ItemGroup.addChild(this.top1Item);
    };
    /**排行榜
     * @param 排行类型
     */
    RankingWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
        this.observe(MessageDef.PHB_REPOINT_UPDATE, this.updateWorship);
        this._AddItemClick(this.keyList, this.keyListItemClick);
        this.AddClick(this.worshipBtn, this.tap);
        this.keyList.selectedIndex = 0;
        // this.valueList.dataProvider =  GameGlobal.RankingModel.getValueItemData();
        GameGlobal.RankingModel.sendRank(1);
        this.curSelectedIndex = this.keyList.selectedIndex;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
    };
    RankingWin.prototype.keyListItemClick = function (e) {
        if (this.curSelectedIndex == this.keyList.selectedIndex)
            return;
        else
            this.curSelectedIndex = this.keyList.selectedIndex;
        GameGlobal.RankingModel.sendRank(this.keyList.selectedItem.type);
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
    };
    RankingWin.prototype.tap = function () {
        GameGlobal.RankingModel.sendWorship(); //膜拜协议
    };
    RankingWin.prototype.changePage = function (page) {
        this.SetPos((page - 1) * this.scroller.width);
    };
    RankingWin.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.valueList.contentWidth;
        touch.throwTo(pos);
    };
    RankingWin.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.valueList.contentWidth;
        touch.currentScrollPos = 0;
    };
    RankingWin.prototype.updateWorship = function () {
        for (var i = 0; i < this.keyList.numChildren; i++)
            this.keyList.getChildAt(i).redPointUpdate();
        this.worshipBtn.filters = GameGlobal.RankingModel.isRedPoint() ? null : Color.GetFilter();
        this.worshipBtn.touchEnabled = GameGlobal.RankingModel.isRedPoint();
    };
    RankingWin.prototype.UpdateContent = function () {
        var rep = GameGlobal.RankingModel.ranks[this.keyList.selectedItem.type];
        if (!rep) {
            return;
        }
        if (rep.selfRank)
            this.rankTxt.text = '' + rep.selfRank;
        else
            this.rankTxt.text = "未上榜";
        if (rep.type == 2)
            this.zhanliTxt.text = "等级:";
        else
            this.zhanliTxt.text = "战力:";
        this.selfPowerTxt.text = CommonUtils.overLength(rep.value || 0);
        this.top1Panel.hideAllPanel();
        this.top2Panel.hideAllPanel();
        this.top3Panel.hideAllPanel();
        this.top1Item.visible = false;
        var rankDatas = [];
        var rankDatasIndex = 0;
        for (var i = 0; i < rep.datas.length; i++) {
            var pos = rep.datas[i].pos;
            if (rep.datas[i].pos == 1) {
                var nListSelectedId = this.keyList.selectedIndex;
                RankingWin.showRolePanel(this.top1Panel, this.keyList.selectedItem.type, rep.datas[i]);
                this.top1Item.data = rep.datas[i];
                this.top1Item.visible = true;
                this.top1Panel.setName(rep.datas[i].name, 0xFF5900);
                continue;
            }
            if (rep.datas[i].pos == 2) {
                RankingWin.showRolePanel(this.top2Panel, this.keyList.selectedItem.type, rep.datas[i]);
                this.top2Panel.setName(rep.datas[i].name, 0xAF2BB7);
            }
            if (rep.datas[i].pos == 3) {
                RankingWin.showRolePanel(this.top3Panel, this.keyList.selectedItem.type, rep.datas[i]);
                this.top3Panel.setName(rep.datas[i].name, 0x5A6EE7);
            }
            rankDatas[rankDatasIndex] = rep.datas[i];
            rankDatasIndex++;
        }
        this.valueList.dataProvider = new eui.ArrayCollection(rankDatas);
        this.pageBtn.setMax(Math.ceil(rankDatas.length / 8));
        this.updateWorship();
    };
    RankingWin.showRolePanel = function (pPHBShowPanel, nRankType, datas) {
        // rankPos -= 1;
        switch (nRankType) {
            case 1://战力
                pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
                if (!datas.outfairy)
                    return;
                pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
                break;
            case 2://等级
                if (!datas.outwing)
                    return;
                pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
                if (!datas.outfairy)
                    return;
                pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
                break;
            case 3://宠物
                if (!datas.outpet)
                    return;
                pPHBShowPanel.setPetPanel(datas.outpet);
                break;
            case 4://仙侣
                if (!datas.outxianlv)
                    return;
                pPHBShowPanel.setPetPanel(datas.outxianlv);
                break;
            case 5://坐骑
                if (!datas.outride)
                    return;
                pPHBShowPanel.setPetPanel(GameGlobal.Config.RideSkinConfig[datas.outride].pid);
                break;
            case 6://翅膀
                if (!datas.outwing)
                    return;
                pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
                break;
            case 7://守护
                if (!datas.outfairy)
                    return;
                pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
                pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
                break;
            case 8://神兵
                if (!datas.outweapon)
                    return;
                pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
                break;
            case 9://玄女
                if (!datas.outtiannv)
                    return;
                pPHBShowPanel.setPetPanel(GameGlobal.Config.FemaleDevaSkinConfig[datas.outtiannv].pid);
                break;
            case 10://天神
                if (!datas.outtianshen)
                    return;
                pPHBShowPanel.setPetPanel(datas.outtianshen); //
                break;
            case 11://法阵
                if (!datas.outcircle)
                    return;
                pPHBShowPanel.setPetPanel(datas.outxianlv, 30);
                pPHBShowPanel.setZhengFaPanel(GameGlobal.Config.CircleSkinConfig[datas.outcircle].pid);
                break;
            case 12://仙位
                if (!datas.outposition)
                    return;
                var sourcePath1 = AppearanceConfig.GetUIAppe(GameGlobal.Config.PositionSkinConfig[datas.outposition].pid);
                pPHBShowPanel.setXianWeiSource(sourcePath1.substring(sourcePath1.lastIndexOf("/") + 1));
                break;
            case 13://通灵
                if (!datas.outpsychic)
                    return;
                pPHBShowPanel.setPetPanel(datas.outpet, 15);
                pPHBShowPanel.setZhengFaPanel(GameGlobal.Config.PsychicSkinConfig[datas.outpsychic].pid);
                break;
            case 14://兽魂
                if (!datas.outsoul)
                    return;
                pPHBShowPanel.setPetPanel(datas.outpet);
                var sourcePath2 = AppearanceConfig.GetUIAppe(GameGlobal.Config.SoulSkinConfig[datas.outsoul].pid);
                pPHBShowPanel.setSouHunSource(sourcePath2);
                break;
            case 15://花辇
                if (!datas.outflower)
                    return;
                pPHBShowPanel.setPetPanel(GameGlobal.Config.FlowerSkinConfig[datas.outflower].pid);
                break;
            case 16://灵气
                if (!datas.outnimbus)
                    return;
                var sourcePath3 = AppearanceConfig.GetUIPath(GameGlobal.Config.NimbusSkinConfig[datas.outnimbus].pid);
                pPHBShowPanel.setXianWeiSource(sourcePath3.substring(sourcePath3.lastIndexOf("/") + 1));
                break;
            case 20: //灵童
            case 21: //灵童
            case 22: //灵童
            case 23://灵童
                if (!datas.outbaby)
                    return;
                pPHBShowPanel.setPetPanel(datas.outbaby);
                break;
        }
    };
    RankingWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_86);
    };
    RankingWin.LAYER_LEVEL = LayerManager.UI_Main;
    return RankingWin;
}(BaseEuiView));
__reflect(RankingWin.prototype, "RankingWin");
var ValueItem = (function (_super) {
    __extends(ValueItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ValueItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RankingValueItemSkin";
        return _this;
    }
    ValueItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.detailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
    };
    ValueItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.roleNameTxt.textColor = 0x6C310A;
        if (this.data.pos <= 3) {
            if (this.data.pos == 1)
                this.roleNameTxt.textColor = 0xFF5900;
            else if (this.data.pos == 2)
                this.roleNameTxt.textColor = 0xAF2BB7;
            else if (this.data.pos == 3)
                this.roleNameTxt.textColor = 0x5A6EE7;
            this.rankingImage.visible = true;
            this.rankingImage.source = "ui_phb_bm_" + this.data.pos;
            this.topTxt.visible = false;
        }
        else {
            this.rankingImage.visible = false;
            this.topTxt.visible = true;
            this.topTxt.text = '第' + this.data.pos + '名';
        }
        this.roleNameTxt.text = this.data.name;
        this.vipIcon.setVipLv(this.data.vip, true);
        this.lvTxt.text = this.data.level + "级";
        this.powerTxt.text = CommonUtils.overLength(this.data.power);
    };
    ValueItem.prototype.tap = function () {
    };
    return ValueItem;
}(eui.ItemRenderer));
__reflect(ValueItem.prototype, "ValueItem");
var KeyItem = (function (_super) {
    __extends(KeyItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KeyItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RankingKeyItemSkin";
        return _this;
    }
    KeyItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    KeyItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.itemNameTxt.text = this.data.name;
        this.redPointUpdate();
    };
    KeyItem.prototype.redPointUpdate = function () {
        this.redPointImg.visible = GameGlobal.RankingModel.isRedPoint();
    };
    return KeyItem;
}(eui.ItemRenderer));
__reflect(KeyItem.prototype, "KeyItem");
var PHBShowPanel = (function (_super) {
    __extends(PHBShowPanel, _super);
    function PHBShowPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShowPanelSkin";
        _this.tianXiaDiYiImage.visible = false;
        return _this;
    }
    PHBShowPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.mc = new MovieClip();
        this.soul.addChild(this.mc);
        this.mc.clearCache();
        this.petPanely = this.petPanel.y;
        this.roleShowPanelX = this.roleShowPanel.x;
        this.roleShowPanelY = this.roleShowPanel.y;
    };
    PHBShowPanel.prototype.setTianXianPanel = function (id, scale) {
        if (scale === void 0) { scale = 0.8; }
        this.tianXianPanel.SetBody(AppearanceConfig.GetUIPath(id));
        this.tianXianPanel.scaleX = scale;
        this.tianXianPanel.scaleY = scale;
        this.tianXianPanel.visible = true;
    };
    PHBShowPanel.prototype.setWeaponPanel = function (id, scale) {
        if (scale === void 0) { scale = 0.8; }
        this.weaponPanel.SetBody(AppearanceConfig.GetUIPath(id));
        this.weaponPanel.scaleX = scale;
        this.weaponPanel.scaleY = scale;
        this.weaponPanel.visible = true;
    };
    PHBShowPanel.prototype.setPetPanel = function (id, sffsety, scale) {
        if (sffsety === void 0) { sffsety = 0; }
        if (scale === void 0) { scale = 1.0; }
        this.petPanel.SetBodyId(id);
        this.petPanel.scaleX = scale;
        this.petPanel.scaleY = scale;
        this.petPanel.y = this.petPanely - sffsety;
        this.petPanel.visible = true;
    };
    PHBShowPanel.prototype.setZhengFaPanel = function (id, sffsety, scale) {
        if (sffsety === void 0) { sffsety = 0; }
        if (scale === void 0) { scale = 1.0; }
        this.zhengFaPanel.SetBody(AppearanceConfig.GetUIPath(id));
        this.zhengFaPanel.scaleX = scale;
        this.zhengFaPanel.scaleY = scale;
        this.zhengFaPanel.visible = true;
    };
    PHBShowPanel.prototype.setRole = function (subRole, scale) {
        if (scale === void 0) { scale = 0.8; }
        this.roleShowPanel.ClearCache();
        // if (type)
        // 	LingtongViewHelper.SetRole(this.roleShowPanel,subRole.sex,subRole.clothID)
        // else
        this.roleShowPanel.SetAll(subRole);
        this.roleShowPanel.scaleX = scale;
        this.roleShowPanel.scaleY = scale;
        this.roleShowPanel.x = this.roleShowPanelX * (2 - scale);
        this.roleShowPanel.y = this.roleShowPanelY * (2 - scale);
        this.roleShowPanel.visible = true;
    };
    PHBShowPanel.prototype.tXDYImageVisibel = function (visibel) {
        this.tianXiaDiYiImage.visible = visibel;
    };
    PHBShowPanel.prototype.setXianWeiSource = function (source) {
        this.xianWeiImage.source = source;
        this.xianWeiImage.visible = true;
    };
    PHBShowPanel.prototype.setSouHunSource = function (source) {
        this.mc.loadUrl(ResDataPath.GetMoviePath(source), true);
        this.mc.visible = true;
    };
    PHBShowPanel.prototype.setName = function (name, color) {
        this.nameTxt.text = name;
        this.nameTxt.textColor = color;
    };
    PHBShowPanel.prototype.hideAllPanel = function () {
        this.mc.visible = false;
        this.xianWeiImage.visible = false;
        this.nameTxt.text = "";
        this.zhengFaPanel.visible = false;
        this.zhengFaPanel.visible = false;
        ;
        this.tianXianPanel.visible = false;
        this.roleShowPanel.visible = false;
        this.petPanel.visible = false;
        this.weaponPanel.visible = false;
        this.lvTxt.visible = false;
    };
    return PHBShowPanel;
}(eui.Component));
__reflect(PHBShowPanel.prototype, "PHBShowPanel");
//# sourceMappingURL=RankingWin.js.map