class ActivityModel extends BaseSystem {
	/**科举比赛 */
	public static TYPE_ANSWER = 1;
	/**取经东归 */
	public static TYPE_QUJING = 2;
	/**帮派BOSS */
	public static TYPE_GANG_BOSS = 3;
	/**矿山争夺 */
	public static TYPE_GANGMINE = 4;
	/**跨服争霸 */
	public static TYPE_CROSS_BATTLE = 5;
	/**帮会战 */
	public static TYPE_GANG_BATTLE = 6;
	/**武林争霸 */
	public static TYPE_WULIN_ZHENGBA = 8;
	/**九重天 */
	public static TYPE_CLOUD_NINE = 7;

	/**活动类型是否开启 */
	public activityList: { [key: number]: boolean } = {};

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_activity_hall, this.getActivityList);
		this.regNetMsg(S2cProtocol.sc_activity_msg, this.updateActivity);
	}

	/**
	 * 进入活动 活动TYPE
	 * @param type
	*/
	public sendActivityEnter(type) {
		let req = new Sproto.cs_activity_enter_request;
		req.activity = type;
		this.Rpc(C2sProtocol.cs_activity_enter, req);
	}

	/**请求活动列表 */
	public sendActivityList() {
		this.Rpc(C2sProtocol.cs_activity_hall);
	}

	//请求答题活动内容
	public sendActivityInfoReq() {
		this.Rpc(C2sProtocol.cs_activity_info_req);
	}

	private getActivityList(rsp: Sproto.sc_activity_hall_request) {
		this.activityList = {};
		let i = 0, len = rsp.activitys.length;
		let data: Sproto.activity_brief;
		for (i; i < len; i++) {
			data = rsp.activitys[i];
			this.activityList[data.activity] = data.isopen;
		}
		MessageCenter.ins().dispatch(MessageDef.ACTIVITY_LIST_INFO);

		if (this.activityList[ActivityModel.TYPE_GANG_BATTLE])
		{
			PlayFunView.GameNotice(ActivityModel.TYPE_GANG_BATTLE, 600, MainGameNoticeView.SHOW_TYPE_GOTO)
		}
		else
		{
			PlayFunView.RemoveGameNotice(ActivityModel.TYPE_GANG_BATTLE)
		}
	}

	/**活动开启通知 */
	private updateActivity(rsp: Sproto.sc_activity_msg_request) {
		if (!this.activityList[rsp.activity]) {
			return
		}
		this.activityList[rsp.activity] = true;
		if (rsp.activity == ActivityModel.TYPE_CROSS_BATTLE) {
			PlayFunView.GameNotice(ActivityModel.TYPE_CROSS_BATTLE, 300, 2)
		}
		MessageCenter.ins().dispatch(MessageDef.ACTIVITY_OPEN_UPDATE);
	}

	public GetActivityOpenFlag(type) {
		return this.activityList[type]
	}

	public static ICONSOURCE_MAP = {
		[ActivityModel.TYPE_ANSWER] : "ui_dt_bt_keju",
		[ActivityModel.TYPE_QUJING] : "ui_qj_bm_husongshangdian",
		[ActivityModel.TYPE_GANG_BOSS] : "ui_hddt_bt_pmjl",
		[ActivityModel.TYPE_GANGMINE] : "",
		[ActivityModel.TYPE_CROSS_BATTLE] : "ui_hddt_bt_pmjl",
		[ActivityModel.TYPE_GANG_BATTLE] : "ui_hddt_bt_pmjl",
		[ActivityModel.TYPE_WULIN_ZHENGBA] : "",
		[ActivityModel.TYPE_CLOUD_NINE] : "ui_hddt_bt_paihang",
	}
}

