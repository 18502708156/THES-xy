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
var PetExpeditionResultPanel = (function (_super) {
    __extends(PetExpeditionResultPanel, _super);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function PetExpeditionResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionResultSkin";
        return _this;
    }
    PetExpeditionResultPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._AddClick(this.btnOk, this.CloseSelf);
    };
    PetExpeditionResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "探险奖励";
        var rsp = param[0];
        var taskId = rsp.taskId;
        var result = rsp.success;
        var t = rsp.time;
        var yb = rsp.money;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        this.lv_img.source = ExpeditionConst.GetQualitySource(taskConfig.quality);
        this.name_txt.text = taskConfig.name;
        this.type_txt.text = ExpeditionConst.GetTaskTypeName(taskConfig.type);
        this.item0.data = taskConfig.reward1[0];
        this.item1.data = taskConfig.reward2[0];
        this.lv_txt.text = "Lv." + taskConfig.levellimit;
        var timeText = DateUtils.format_12(t * DateUtils.MS_PER_SECOND);
        this.time_txt.text = timeText == "" ? "少于一分钟" : timeText;
        this.txt_yb.text = yb == 0 ? "" : "财富之手生效，额外获得" + yb + "元宝";
        this.succeedGroup.visible = result == 0;
    };
    PetExpeditionResultPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPDATE_DOTASK_STATE);
    };
    PetExpeditionResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetExpeditionResultPanel;
}(BaseEuiView));
__reflect(PetExpeditionResultPanel.prototype, "PetExpeditionResultPanel");
//# sourceMappingURL=PetExpeditionResultPanel.js.map