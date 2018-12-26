class KaiFuTargetFuncTargetPanel extends BaseView {

	private activityType: number
	public _activityId: number
	/////////////////////////////////////////////////////////////////////////////
	// KaiFuTargetFuncTargetSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected list: eui.List;
	protected time_txt: eui.Label;
	protected value_txt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "KaiFuTargetFuncTargetSkin";
		this.activityType = ActivityKaiFuFuncType.ACT_17_ArenaTarget;
	}

	public childrenCreated() {
		this.list.itemRenderer = KaiFuTargetFuncTargetItem;
	}

	public OnOpen() {
		this.UpdateContent();

		this.AddLoopTimer(1000, this.updateTime)
	}

	private updateTime(): void {
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(this.getRemindTimeString())
        } else {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("活动未开启")
        }
    }

	getRemindTimeString() {
		let time = GameServer.serverTimeMilli
		let date = new Date(time)
		date.setHours(0, 0, 0, 0)
		date.setDate(date.getDate() + 1)
		return `倒计时：|C:0x2dff42&T:${DateUtils.format_1(date.getTime() - time)}|`
	}

	private getReward(): any {
		let openDay = Math.min(GameServer.serverOpenDay, 7)

		let idsArr = ActivityConst.GetQiTianActivityIds(openDay, 1)
		let arr = []
		let i: number;
		let len: number = idsArr.length;
		let show = false
		for (i = 0; i < len; i++) {
			let cfgObj = ActivityConst.GetCfgObjByValue(idsArr[i]);
			if (!show) {
				this.ShowDesc(cfgObj)
				show = true
			}
			let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
			let o: any = {};
			o.cfg = cfgObj
			o.weight = cfgObj.index;
			if (activityData) {
				let canGet = activityData.canGetRecordByIndex(cfgObj.index)
				let getted = activityData.GetRecordByIndex(cfgObj.index)
				if (canGet) {
					if (getted) o.weight += 1000;
					else o.weight -= 1000;
				} else if (getted) o.weight += 1000;
			}
			arr.push(o);
		}

		return arr
	}

	private ShowDesc(cfgObj) {
		let type = cfgObj.type
		let arr = []
		switch (type) {
			case "arenarank":
				arr = ["竞技场排名：", GameGlobal.Arena.getMyRank()]
			break;
			case "wildgeese":
				arr = ["玲珑宝塔层数：", GameGlobal.UserFb.GetLinglongLayer()]
			break;
			case "chapter":
				arr = ["关卡关数：", (GameGlobal.UserFb.guanqiaID || 0)]
			break;
			case "heaven":
				arr = ["勇闯天庭：", (GameGlobal.UserFb.tFbTiantingServerData ? GameGlobal.UserFb.tFbTiantingServerData.todayLayer : 0)]
			break;
			case "treasuremap":
				arr = ["藏宝图层数：",Math.max(FbCbtPanel.GetLastNum() - 1, 1)]
			break;
			case "petcount":
				arr = ["宠物数量：", GameGlobal.PetModel.GetActiveCount()]
			break;
			// case "enhancelevel":
			// break;
			// case "refinelevel":
			// break;
		}
		let str = ""
		if (arr.length && cfgObj.info && cfgObj.info.text) {
			// str = `${arr[0]}|C:0x2dff42&T:${arr[1]}|`
			str = cfgObj.info.text.replace("%s", `|C:0x2dff42&T:${arr[1]}|`)
			this.value_txt.textFlow = TextFlowMaker.generateTextFlow(str)
		} else {
			this.value_txt.text = ""
		}
	}

	public OnClose() {

	}
	public UpdateContent() {
		if (!this.visible) return;
		let arrlist = this.getReward();
		SortTools.sortMap(arrlist, "weight");
		this.list.dataProvider = new eui.ArrayCollection(arrlist);
	}
	static RedPoint(day): boolean {
		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(15);

		if (activityData) {
			let config = activityData.GetConfig()
			for (let key in config) {
				if (config.hasOwnProperty(key)) {
					let cfgobj = config[key];
					if (cfgobj.day != day) {
						continue
					}
					if (activityData.canGetRecordByIndex(cfgobj.index)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	private _OnClick(e: egret.TouchEvent) {

	}
}


class KaiFuTargetFuncTargetItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianAwardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected tip2: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    protected getted_img: eui.Image;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "KaiFuQiTianAwardItemSkin"
	}
	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName;
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}
	private onClick(e: egret.TouchEvent): void {
		let config = this.data.cfg
		if (this.btn.label == "领 取") {
			GameGlobal.ActivityKaiFuModel.sendReward(config.Id, config.index)
		}
		else if (this.btn.label == "前 往") {
			if (config.gainway) {
				GameGlobal.ViewManager.Guide(config.gainway[0][1][0])
			}

		}
	}
	dataChanged() {

		let type = this.data.type;
		let cfgObj = this.data.cfg
		let weight = this.data.weight;
		let actType = this.data.actType

		this.tipsTxt.text = cfgObj.des.replace("%s", cfgObj.value);
		this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);

		// let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);


		let openDay = Math.min(GameServer.serverOpenDay, 7)

		if (openDay > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7) {
			this.tip2.text = "明日开启"
			this.getted_img.visible = false;
			this.btn.visible = false;
		} else {
			this.tip2.text = ""

			this.btn.visible = weight < 100;
			this.btn.label = (weight > 0 && weight < 100) ? (cfgObj.gainway ? "前 往" : "未达成") : "领 取";
			UIHelper.ShowRedPoint(this.btn, weight < 0)
			this.getted_img.visible = !this.btn.visible


			// if (weight > 0 && weight < 100 && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay)
			// {
			//     this.btn.visible = false;
			//     this.tip2.text = "已过期"
			// }
		}
	}
}