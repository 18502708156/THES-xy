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
var WorldMapTipPanel = (function (_super) {
    __extends(WorldMapTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function WorldMapTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "WorldMapTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        _this._AddClick(_this.btnEnter, _this._onClick);
        return _this;
    }
    WorldMapTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "提示";
        var mapId = param[0];
        var config = GameGlobal.Config.ChaptersMapConfig[mapId];
        if (!config)
            return;
        this.mapName.text = config.name;
        var curChapterId = GameGlobal.UserFb.chapterId;
        var chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId];
        this.clearanceTIp.visible = chapterRewardConfig.mapid >= mapId;
        this.groupTip.visible = chapterRewardConfig.mapid < mapId;
        this.mapName.$setX(305);
        if (chapterRewardConfig.mapid > mapId)
            return;
        if (chapterRewardConfig.mapid == mapId) {
            this.clearanceTIp.text = "正在冒险中...";
            return;
        }
        this.mapName.$setX(121);
        this.levelTip.text = "角色等级达到" + config.needLevel + "级";
        var prevConfig = GameGlobal.Config.ChaptersMapConfig[mapId - 1];
        this.bossTip.text = "击败" + prevConfig.name + "所有BOSS";
    };
    WorldMapTipPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    WorldMapTipPanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.btnEnter:
                ViewManager.ins().close(this);
                break;
        }
    };
    WorldMapTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return WorldMapTipPanel;
}(BaseEuiView));
__reflect(WorldMapTipPanel.prototype, "WorldMapTipPanel");
//# sourceMappingURL=WorldMapTipPanel.js.map