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
var WorldMapPanel = (function (_super) {
    __extends(WorldMapPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function WorldMapPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "WorldMapSkin";
        _this._AddClick(_this.closeBtn, _this._onClick);
        return _this;
    }
    // 引导对象
    WorldMapPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.list.getChildAt(0).getChildAt(1).getChildAt(1),
            _a;
        var _a;
    };
    WorldMapPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.list.itemRenderer = WorldMapContent;
        this.list.dataProvider = new eui.ArrayCollection([1]);
        this.list.validateNow();
        this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateList);
        this.observe(MessageDef.WORLDMAP_LOCATETO, this.UpdateMapOffset);
        if (GameGlobal.GuideUtil.GuideId == 31) {
            GameGlobal.GuideUtil.OnTargetTap(31, 0);
        }
    };
    WorldMapPanel.prototype.UpdateMapOffset = function (idx) {
        var xoffset = this.list.getChildAt(0).getChildAt(1).getChildAt(idx).x - 280;
        this.list.scrollH = Math.min(Math.max(xoffset, 0), 4000 - StageUtils.WIDTH);
    };
    WorldMapPanel.prototype.OnClose = function () {
    };
    // public AddHand(index: number) {
    // let icon = ((this.list.getChildAt(0) as eui.Group).getChildAt(1) as eui.Group).getChildAt(index) as WorldMapIcon
    // let img = new eui.Image
    // }
    WorldMapPanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    WorldMapPanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.closeBtn:
                ViewManager.ins().close(this);
                break;
        }
    };
    WorldMapPanel.LAYER_LEVEL = LayerManager.UI_FullScreen_Popup;
    return WorldMapPanel;
}(BaseEuiView));
__reflect(WorldMapPanel.prototype, "WorldMapPanel");
var WorldMapContent = (function (_super) {
    __extends(WorldMapContent, _super);
    function WorldMapContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorldMapContent.prototype.childrenCreated = function () {
        this.mCount = 6;
        TimerManager.ins().doFrame(1, 6, this._DoUpdate, this);
        var iconArr = CommonUtils.GetArray(GameGlobal.Config.ChaptersMapConfig, "mapid");
        for (var i = 0; i < this.itemGroup.numChildren; i++) {
            var item = this.itemGroup.getChildAt(i);
            if (iconArr[i])
                WorldMapIcon.bindClick(item, iconArr[i].mapid);
        }
    };
    WorldMapContent.prototype.dataChanged = function () {
        var iconArr = CommonUtils.GetArray(GameGlobal.Config.ChaptersMapConfig, "mapid");
        for (var i = 0; i < this.itemGroup.numChildren; i++) {
            var item = this.itemGroup.getChildAt(i);
            WorldMapIcon.setInfo(item, i, iconArr[i]);
        }
    };
    WorldMapContent.prototype._DoUpdate = function () {
        if (this.mCount > 0 && this.$stage) {
            var imgBg = new CImage;
            this.bgGroup.addChild(imgBg);
            var curIdx = (7 - this.mCount);
            imgBg.source = "map00" + curIdx.toString();
            imgBg.$setX((curIdx - 1) * StageUtils.WIDTH);
            imgBg.$setY(0);
        }
        else {
            TimerManager.ins().remove(this._DoUpdate, this);
        }
        this.mCount--;
    };
    return WorldMapContent;
}(eui.ItemRenderer));
__reflect(WorldMapContent.prototype, "WorldMapContent");
var WorldMapIcon = (function (_super) {
    __extends(WorldMapIcon, _super);
    function WorldMapIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    WorldMapIcon.bindClick = function (comp, mapId) {
        comp.imgBox.name = mapId.toString();
        comp.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxClick, comp);
        comp.imgIcon.name = mapId.toString();
        comp.imgIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIconClick, comp);
        comp.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
            egret.Tween.removeTweens(comp.prize);
            egret.Tween.removeTweens(comp.imgArr);
        }, this);
    };
    WorldMapIcon.setInfo = function (comp, index, config) {
        if (!config)
            return;
        comp.iconName.text = config.name;
        var curGuanqiaId = GameGlobal.UserFb.guanqiaID;
        comp.clearanceTip.visible = config.cid < curGuanqiaId;
        var curChapterId = GameGlobal.UserFb.chapterId;
        var chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId];
        comp.userGroup.visible = chapterRewardConfig.mapid == config.mapid;
        comp.imgIcon.source = config.icon;
        comp.newGroup.visible = GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == config.mapid;
        if (chapterRewardConfig.mapid == config.mapid) {
            GameGlobal.MessageCenter.dispatch(MessageDef.WORLDMAP_LOCATETO, index);
        }
        else if (GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == config.mapid) {
            var tw = egret.Tween.get(comp.imgArr, { loop: true });
            tw.to({ y: 32 }, 500).to({ y: 52 }, 500);
        }
        comp.imgBox.visible = WorldMapIcon.getChapterRewardId(config.mapid) != -1;
        comp.redPoint.visible = comp.imgBox.visible;
        if (comp.imgBox.visible) {
            var tw = egret.Tween.get(comp.prize, { loop: true });
            tw.to({ y: 144 }, 400, egret.Ease.sineIn).to({ y: 154 }, 400, egret.Ease.sineIn);
        }
        else
            egret.Tween.removeTweens(comp.prize);
    };
    WorldMapIcon.getChapterRewardId = function (mapId) {
        var rewardList = GameGlobal.UserFb.chapterRewardList;
        for (var _i = 0, rewardList_1 = rewardList; _i < rewardList_1.length; _i++) {
            var rewardId = rewardList_1[_i];
            var chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[rewardId];
            if (chapterRewardConfig && chapterRewardConfig.mapid == mapId)
                return rewardId;
        }
        return -1;
    };
    WorldMapIcon.onBoxClick = function (e) {
        var mapId = parseInt(e.currentTarget.name);
        var rewardId = WorldMapIcon.getChapterRewardId(mapId);
        if (rewardId == -1)
            return;
        ViewManager.ins().open(ClearanceAwardPanel, mapId, rewardId);
    };
    WorldMapIcon.onIconClick = function (e) {
        var mapId = parseInt(e.currentTarget.name);
        var curChapterId = GameGlobal.UserFb.chapterId;
        var chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId];
        if (GameGlobal.UserFb.nextMap && chapterRewardConfig.mapid + 1 == mapId) {
            GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map);
            ViewManager.ins().close(WorldMapPanel);
        }
        else {
            ViewManager.ins().open(WorldMapTipPanel, mapId);
        }
    };
    return WorldMapIcon;
}(eui.Component));
__reflect(WorldMapIcon.prototype, "WorldMapIcon");
//# sourceMappingURL=WorldMapPanel.js.map