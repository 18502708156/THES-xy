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
var ActivityModel = (function (_super) {
    __extends(ActivityModel, _super);
    function ActivityModel() {
        var _this = _super.call(this) || this;
        /**活动类型是否开启 */
        _this.activityList = {};
        _this.regNetMsg(S2cProtocol.sc_activity_hall, _this.getActivityList);
        _this.regNetMsg(S2cProtocol.sc_activity_msg, _this.updateActivity);
        return _this;
    }
    /**
     * 进入活动 活动TYPE
     * @param type
    */
    ActivityModel.prototype.sendActivityEnter = function (type) {
        var req = new Sproto.cs_activity_enter_request;
        req.activity = type;
        this.Rpc(C2sProtocol.cs_activity_enter, req);
    };
    /**请求活动列表 */
    ActivityModel.prototype.sendActivityList = function () {
        this.Rpc(C2sProtocol.cs_activity_hall);
    };
    //请求答题活动内容
    ActivityModel.prototype.sendActivityInfoReq = function () {
        this.Rpc(C2sProtocol.cs_activity_info_req);
    };
    ActivityModel.prototype.getActivityList = function (rsp) {
        this.activityList = {};
        var i = 0, len = rsp.activitys.length;
        var data;
        for (i; i < len; i++) {
            data = rsp.activitys[i];
            this.activityList[data.activity] = data.isopen;
        }
        MessageCenter.ins().dispatch(MessageDef.ACTIVITY_LIST_INFO);
        if (this.activityList[ActivityModel.TYPE_GANG_BATTLE]) {
            PlayFunView.GameNotice(ActivityModel.TYPE_GANG_BATTLE, 600, MainGameNoticeView.SHOW_TYPE_GOTO);
        }
        else {
            PlayFunView.RemoveGameNotice(ActivityModel.TYPE_GANG_BATTLE);
        }
    };
    /**活动开启通知 */
    ActivityModel.prototype.updateActivity = function (rsp) {
        if (!this.activityList[rsp.activity]) {
            return;
        }
        this.activityList[rsp.activity] = true;
        if (rsp.activity == ActivityModel.TYPE_CROSS_BATTLE) {
            PlayFunView.GameNotice(ActivityModel.TYPE_CROSS_BATTLE, 300, 2);
        }
        MessageCenter.ins().dispatch(MessageDef.ACTIVITY_OPEN_UPDATE);
    };
    ActivityModel.prototype.GetActivityOpenFlag = function (type) {
        return this.activityList[type];
    };
    /**科举比赛 */
    ActivityModel.TYPE_ANSWER = 1;
    /**取经东归 */
    ActivityModel.TYPE_QUJING = 2;
    /**帮派BOSS */
    ActivityModel.TYPE_GANG_BOSS = 3;
    /**矿山争夺 */
    ActivityModel.TYPE_GANGMINE = 4;
    /**跨服争霸 */
    ActivityModel.TYPE_CROSS_BATTLE = 5;
    /**帮会战 */
    ActivityModel.TYPE_GANG_BATTLE = 6;
    /**九重天 */
    ActivityModel.TYPE_CLOUD_NINE = 7;
    /**探险 */
    ActivityModel.TYPE_EXPEDITION = 8;
    ActivityModel.ICONSOURCE_MAP = (_a = {},
        _a[ActivityModel.TYPE_ANSWER] = "ui_dt_bt_keju",
        _a[ActivityModel.TYPE_QUJING] = "ui_qj_bm_husongshangdian",
        _a[ActivityModel.TYPE_GANG_BOSS] = "ui_hddt_bt_pmjl",
        _a[ActivityModel.TYPE_GANGMINE] = "",
        _a[ActivityModel.TYPE_CROSS_BATTLE] = "ui_hddt_bt_pmjl",
        _a[ActivityModel.TYPE_GANG_BATTLE] = "ui_hddt_bt_pmjl",
        _a[ActivityModel.TYPE_CLOUD_NINE] = "ui_hddt_bt_paihang",
        _a);
    return ActivityModel;
}(BaseSystem));
__reflect(ActivityModel.prototype, "ActivityModel");
var _a;
//# sourceMappingURL=ActivityModel.js.map