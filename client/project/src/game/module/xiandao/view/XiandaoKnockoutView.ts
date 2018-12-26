class XiandaoKnockoutView extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoKnockoutSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected headGroup: eui.Group;
    protected rankLabel: CmLabel;
    protected rankTypeLabel: eui.Label;
    protected startTimeLabel: eui.Label;
    protected head1: eui.Component;
    protected head2: eui.Component;
    protected unHead1: eui.Image;
    protected unHead2: eui.Image;
    protected myTimeGroup: eui.Group;
    protected nextTime: eui.Label;
    protected goLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public static RANK_TYPE_STR = {
		[1]: "帝王榜",
		[2]: "神道榜",
		[3]: "守护榜",
		[4]: "地界榜",
	}

	public static RANK_PRO_STR = {
		[0]: "16进8强赛",
		[1]: "8进4强赛",
		[2]: "4进2强赛",
		[3]: "决赛",
	}

	private headList: XiandaoKnockoutHead[] = []
	// 8强，4强，2强，冠军
	private groupList: XiandaoKnockoutItem[][] = []

	public constructor() {
		super()
		this.skinName = "XiandaoKnockoutSkin"
		UIHelper.SetLinkStyleLabel(this.goLabel)
		for (let i = 0; i <= 3; i++) {
			this.groupList.push([])
		}
		this.GetGroup(this.group, 3)
		for (let list1 of this.groupList) {
			for (let i = 0; i < list1.length; i++) {
				list1[i].index = i
			}
		}
		this.GetHeadComps(this.headGroup)
	}

	public OnOpen() {
		this.myTimeGroup.visible = false;
		this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent)
		this.AddClick(this.goLabel, this.OnClick)
		this.UpdateHeadList()
		this.UpdateContent()
	}

	private OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.goLabel:
				if (GameGlobal.XiandaoModel.mMyTime && GameGlobal.XiandaoModel.mMyTime.ret) {
					if (UserFb.CheckFighting()) {
						GameGlobal.XiandaoModel.SendEnterKnockout()
					}	
				}
			break
		}
	}

	private UpdateRankType() {
		this.rankLabel.text = GameGlobal.XiandaoModel.GetGroupTypeStr()
		this.rankTypeLabel.text = XiandaoKnockoutView.RANK_PRO_STR[GameGlobal.XiandaoModel.GetKnockoutId()]
		this.startTimeLabel.text = "（晚上21点进行）"
	}

	private UpdateMyTime() {
		let timeData = GameGlobal.XiandaoModel.mMyTime
		if (!timeData || !timeData.ret) {
			this.myTimeGroup.visible = false
			TimerManager.ins().remove(this.UpdateTime, this)
			return 
		}
		if (!this.myTimeGroup.visible) {
			this.myTimeGroup.visible = true
			this.AddTimer(1000, 0, this.UpdateTime)
		}
	}

	private UpdateTime() {
		if (GameGlobal.XiandaoModel.mMyTime) {
			this.nextTime.text = DateUtils.format_5(Math.max(GameGlobal.XiandaoModel.mMyTime.timeout - GameServer.serverTime, 0) * 1000, 3)
		} else {
			this.nextTime.text = ""
		}
	}

	public UpdateContent() {
		this.UpdateRankType()
		this.UpdateMyTime()

		let data = GameGlobal.XiandaoModel.GetKnockoutData()
		let turnList = data.turnDatas
		for (let i = 0; i < this.groupList.length; i++) {
			for (let data of this.groupList[i]) {
				data.SetEmpty()
			}
		}
		let knockoutId = GameGlobal.XiandaoModel.GetKnockoutId()
		for (let i = 0, len = knockoutId; i <= len; i++) {
			let list = this.groupList[i]
			let turnDataList = turnList[i]
			if (!turnDataList) {
				continue
			}
			let type
			if (i == len) {
				if (GameGlobal.XiandaoModel.IsGame()) {
					type = 1
				} else {
					type = 2
				}
			} else {
				type = 3
			}
			let j = 0
			for (let data of list) {
				let turnData = turnDataList[j]
				if (turnData) {
					data.SetType(type, turnData.winPart)
				}
				++j
			}
		}
		let roleIds = data ? (data.roleNoList || []) : []
		let groupListRole = this.groupList[0]
		for (let i = 0; i < 8; i++) {
			let index = i * 2
			let data1 = roleIds[index]
			let data2 = roleIds[index + 1]
			groupListRole[i].noA = data1
			groupListRole[i].noB = data2
		}
		if (GameGlobal.XiandaoModel.GetKnockoutId() == 3) {
			this.unHead1.visible = false
			this.unHead2.visible = false
			let turnDataList = turnList[3][0]
			if (turnDataList) {
				let role1 = GameGlobal.XiandaoModel.GetRoleData(turnDataList.noA)
				let role2 = GameGlobal.XiandaoModel.GetRoleData(turnDataList.noB)
				if (role1) {
					UIHelper.SetHead(this.head1, role1.shows.job, role1.shows.sex)
				}
				if (role2) {
					UIHelper.SetHead(this.head2, role2.shows.job, role2.shows.sex)
				}
			}
		} else {
			this.unHead1.visible = true
			this.unHead2.visible = true
		}
	}

	private UpdateHeadList(): void {
		let data = GameGlobal.XiandaoModel.GetKnockoutData()
		let roleIds = data ? (data.roleNoList || []) : []
		for (let i = 0, len = this.headList.length; i < len; i++) {
			let head = this.headList[i] as XiandaoKnockoutHead
			let roleId = roleIds[i]
			let data = GameGlobal.XiandaoModel.GetRoleData(roleId)
			if (data) {
				UIHelper.SetHead(head.head, data.shows.job, data.shows.sex)	
				head.nameLabel.text = GameString.GetSerAndName(data.serverId, data.roleName)
			} else {
				UIHelper.SetHead(head.head, null, null)
				head.nameLabel.text = "暂无"
			}
		}
	}

	private GetHeadComps(group: eui.Group) {
		for (let i = 0; i < group.numChildren; i++) {
			let child = group.getChildAt(i)
			if (egret.is(child, "eui.Group")) {
				this.GetHeadComps(child as eui.Group)
			} else {
				this.headList.push(<XiandaoKnockoutHead><any>child)
			}
		}
	}

	private GetGroup(group: eui.Group, turnId: number) {
		if (!group || turnId < 0) {
			return
		}
		let upline = group.getChildByName("upLine") as eui.Group
		let downline = group.getChildByName("downLine") as eui.Group
		let video = group.getChildByName("video") as eui.Button
		let ya = group.getChildByName("ya") as eui.Button

		let up = this.GetGroup(upline, turnId - 1)	
		let down = this.GetGroup(downline, turnId - 1)

		if (upline && downline) {
			let item = new XiandaoKnockoutItem
			item.turnId = turnId
			item.upLine = upline
			item.downLine = downline
			item.video = video
			if (video) {
				(video as any).itemData = item
			}
			item.yaBtn = ya;
			if (ya) {
				(ya as any).itemData = item
			}
			this._AddClick(video, this._OnClickVideo)
			this._AddClick(ya, this._OnClickYa)
			item.Init()
			this.groupList[turnId].push(item)		
		}
	}

	private _OnClickYa(e: egret.TouchEvent) {
		let data = e.currentTarget.itemData as XiandaoKnockoutItem
		ViewManager.ins().open(XiandaoBetPanel, data.turnId, data.index)
	}

	private _OnClickVideo(e: egret.TouchEvent) {
		let data = e.currentTarget.itemData as XiandaoKnockoutItem
		ViewManager.ins().open(XiandaoVideoPanel, data.turnId, data.index)
	}
}

class XiandaoKnockoutItem {
	// 对战对象
	upLine: eui.Group
	downLine: eui.Group

	turnId: number
	index: number
	// 对战视频
	video: eui.Button
	yaBtn: eui.Button

	img1: eui.Image[] = []
	img2: eui.Image[] = []

	// 对战编号
	noA: number
	noB: number

	private GetImg(g: eui.Group): eui.Image[] {
		if (!g) {
			return []
		}
		let list = []
		for (let i = 0; i < g.numChildren; i++) {
			let child = g.getChildAt(i)
			if (egret.is(child, "eui.Image")) {
				list.push(child)
			}
		}
		return list
	}

	public Init() {
		this.SetEmpty()
		this.img1 = this.GetImg(this.upLine)
		this.img2 = this.GetImg(this.downLine)
	}

	private SetVis(list: eui.Image[], vis: boolean) {
		for (let data of list) [
			data.visible = vis
		]
	}

	public SetWin(winState) {
		this.SetVis(this.img1, winState == 1)
		this.SetVis(this.img2, winState == 2)
		if (this.video) {
			this.video.visible = true
		}
		if (this.yaBtn) {
			this.yaBtn.visible = false
		}
	}

	public SetEmpty() {
		this.SetVis(this.img1, false)
		this.SetVis(this.img2, false)
		if (this.video) {
			this.video.visible = false
		}
		if (this.yaBtn) {
			this.yaBtn.visible = false
		}
	}

	/**
	 * 1、比赛
	 * 2、未开始
	 * 3、结束
	 */
	public SetType(type: number, args = null) {
		if (type == 3) {
			this.SetVis(this.img1, args == 1)
			this.SetVis(this.img2, args == 2)
		} else {
			this.SetVis(this.img1, false)
			this.SetVis(this.img2, false)
		}
		if (this.video) {
			this.video.visible = type != 2
		}
		if (this.yaBtn) {
			if (this.yaBtn.visible = type == 2) {
				this.yaBtn.iconDisplay.filters = GameGlobal.XiandaoModel.GetBetData(this.index) ? Color.GetFilter() : null
			}
		}
	}
}

interface XiandaoKnockoutHead extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // XiandaoKnockoutHeadSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    head: eui.Component;
    nameLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
}