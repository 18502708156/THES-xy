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
 * 升级途径
 */
var UpLvWayMainPanel = (function (_super) {
    __extends(UpLvWayMainPanel, _super);
    function UpLvWayMainPanel() {
        var _this = _super.call(this) || this;
        //Name
        _this.BgName = "升级途径";
        _this.skinName = "UpLvWayMainSkin";
        _this.list.dataProvider = new eui.ArrayCollection([]);
        return _this;
    }
    UpLvWayMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = this.BgName;
        // this.lbSort.text=GameGlobal.actorModel.level.toString();
        this.list.itemRenderer = UpLvWayItem;
        var list = [];
        for (var key in GameGlobal.Config.LevelMethodConfig) {
            var openid = GameGlobal.Config.LevelMethodConfig[key].openid;
            // if(GameGlobal.actorModel.level>=GameGlobal.Config.FuncOpenConfig[openid].conditionnum)
            // {
            if (Deblocking.Check(openid, true))
                list.push(GameGlobal.Config.LevelMethodConfig[key]);
            // }
        }
        this.list.dataProvider = new eui.ArrayCollection(list);
    };
    UpLvWayMainPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    //skinName
    // UpLvWayMainSkin.exml
    UpLvWayMainPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return UpLvWayMainPanel;
}(BaseEuiView));
__reflect(UpLvWayMainPanel.prototype, "UpLvWayMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=UpLvWayMainPanel.js.map