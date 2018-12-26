class XiandaoVideoPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoVideoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected att1: eui.Group;
    protected att2: eui.Group;
    protected role1: RoleShowPanel;
    protected role2: RoleShowPanel;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	private m_TurnData: XiandaoKnockoutTurn

	public constructor() {
		super()
		this.skinName = "XiandaoVideoSkin"
		this.list.itemRenderer = XiandaoVideoItem
	}

	public OnOpen(...param: any[]) {
		let turnId = param[0]
        let index = param[1]
		this.mCommonWindowBg.OnAdded(this)

		let model = GameGlobal.XiandaoModel
		let turnData = this.m_TurnData = model.GetTurnData(turnId, index)
        if (turnData) {
            let role1 = model.GetRoleData(turnData.noA)
            let role2 = model.GetRoleData(turnData.noB)
            this.SetAttData(role1, this.att1, this.role1)
            this.SetAttData(role2, this.att2, this.role2)

			let list = []
			for (let i = 0; i < turnData.fightRecord.length; i++) {
				list.push({
					turn: turnData,
					role1: role1,
					role2: role2,
					turnId: turnId,
					index: index,
				})	
			}
            this.list.dataProvider = new eui.ArrayCollection(list)
        }
	}

	public OnClose() {
		
	}


    private GetAttLabel(group: eui.Group): eui.Label[] {
        let list = []
        for (let data of group.$children) {
            for (let child of (data as eui.Group).$children) {
                if (egret.is(child, "eui.Label")) {
                    list.push(child)
                    break
                }
            }
        }
        return list
    }

    private SetAttData(data: XiandaoKnockoutRoleData, attGroup: eui.Group, role: RoleShowPanel) {
        if (!data) {
            return
        }
        let list = this.GetAttLabel(attGroup)  
        list[0].text = GameString.GetSerAndName(data.serverId, data.roleName)
        list[1].text = "Lv." + data.lv
        list[2].textFlow = TextFlowMaker.generateTextFlow("战力：|C:0x019704&T:" + data.power + "|")
        role.SetShowImage(data.shows)
    }

}

class XiandaoVideoItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoVideoItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected turn: eui.Label;
    protected retImg1: eui.Image;
    protected nameLabel1: eui.Label;
    protected retImg2: eui.Image;
    protected nameLabel2: eui.Label;
    protected scoreLabel: eui.Label;
    protected videoLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		UIHelper.SetLinkStyleLabel(this.videoLabel)
		this.videoLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick ,this)
	}

	private _OnClick() {
		let turn = this.data.turn as XiandaoKnockoutTurn
        GameGlobal.XiandaoModel.SendVideo([16, 8, 4, 2][this.data.turnId], this.data.index + 1, this.itemIndex + 1)
	}
	
	public dataChanged() {
        if (!this.data) {
            return
        }
		let turn = this.data.turn as XiandaoKnockoutTurn
		this.turn.text = `第${StringUtils.numberToChinese(this.itemIndex + 1)}局`

		let isWin = turn.noA == turn.winNo

		let role1 = this.data.role1 as XiandaoKnockoutRoleData
		let role2 = this.data.role2 as XiandaoKnockoutRoleData

		this.nameLabel1.text = GameString.GetSerAndName(role1.serverId, role1.roleName)
		this.nameLabel2.text = GameString.GetSerAndName(role2.serverId, role2.roleName)
		this.retImg1.source = isWin ?  "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai"
		this.retImg2.source = !isWin ?  "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai"
	}
}