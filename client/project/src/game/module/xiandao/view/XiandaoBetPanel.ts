class XiandaoBetPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoBetSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected check1: eui.CheckBox;
    protected check2: eui.CheckBox;
    protected group: eui.Group;
    protected att1: eui.Group;
    protected att2: eui.Group;
    protected role1: RoleShowPanel;
    protected role2: RoleShowPanel;
    /////////////////////////////////////////////////////////////////////////////

    private m_BetData: Sproto.qualifyingMgr_gamble_data
    private m_TurnData: XiandaoKnockoutTurn

    private items: XiandaoBetItem[] = []

    private m_Index: number
    private m_TurnId: number
    
	public constructor() {
		super()
		this.skinName = "XiandaoBetSkin"
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

	public OnOpen(...param: any[]) {
        let turnId = param[0]
        let index = param[1]
        this.m_Index = index
        this.m_TurnId = turnId
		this.mCommonWindowBg.OnAdded(this)
        this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent)

        let i = 0
        for (let data of this.group.$children) {
            let item = new XiandaoBetItem(data as eui.Group)
            item.btn.name = i + ""
            this.AddClick(item.btn, this._OnClick)
            this.items.push(item)
            ++i
        }

        this.AddChange(this.check1, this._OnCheck)
        this.AddChange(this.check2, this._OnCheck)

        this.UpdateContent()
	}

    private UpdateContent() {
        let model = GameGlobal.XiandaoModel
        this.m_BetData = model.GetBetData(this.m_Index)
        let turnData = this.m_TurnData = model.GetTurnData(this.m_TurnId, this.m_Index)
        if (turnData) {
            let role1 = model.GetRoleData(turnData.noA)
            let role2 = model.GetRoleData(turnData.noB)
            this.check1.selected = role1.power >= role2.power
            this.check2.selected = !this.check1.selected
            this.SetAttData(role1, this.att1, this.role1, this.check1)
            this.SetAttData(role2, this.att2, this.role2, this.check2)
            if (this.m_BetData) {
                this.check1.selected = 1 == this.m_BetData.no
                this.check2.selected = 2 == this.m_BetData.no
            }
        }

        let selIndex = this.m_BetData ? (this.m_BetData.typ - 1) : -1
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            let config = GameGlobal.Config.XianDuMatchStakeBaseConfig[i + 1]
            item.item.data = config.cost
            let index = i
            item.item.mCallback = function() {
                ViewManager.ins().open(XiandaoBetTipPanel, index)
            }
            item.price.type = config.cost.id
            item.price.price = config.cost.count
            if (selIndex >= 0) {
                item.price.visible = true
                item.btn.visible = false
                item.yaImg.visible = selIndex == i 
            }
        }
    }

    private SetAttData(data: XiandaoKnockoutRoleData, attGroup: eui.Group, role: RoleShowPanel, check: eui.CheckBox) {
        if (!data) {
            return
        }
        let list = this.GetAttLabel(attGroup)  
        list[0].text = GameString.GetSerAndName(data.serverId, data.roleName)
        list[1].text = "Lv." + data.lv
        list[2].textFlow = TextFlowMaker.generateTextFlow("战力：|C:0x019704&T:" + data.power + "|")
        check.label = GameString.GetSerAndName(data.serverId, data.roleName)
        role.SetShowImage(data.shows)
    }

    private _OnCheck(e: egret.TouchEvent) {
        if (!this.m_TurnData) {
            return
        }
        if (this.m_BetData)  {
            this.check1.selected = this.m_BetData.no == 1
            this.check2.selected = this.m_BetData.no == 2
            return
        }
        if (!e.currentTarget.selected) {
            e.currentTarget.selected = true
        } else {
            if (e.currentTarget == this.check1) {
                this.check2.selected = false
            } else {
                this.check1.selected = false
            }
        }
    }

    private _OnClick(e: egret.TouchEvent) {
        let index = parseInt(e.currentTarget.name)
        GameGlobal.XiandaoModel.SendGamble(this.m_Index, this.check1.selected ? 0 : 1, index)
    }
}

class XiandaoBetItem {
    public mGroup: eui.Group
    public item: ItemBaseNotName
    public btn: eui.Button
    public price: PriceIcon
    public yaImg: eui.Image

    public constructor(group: eui.Group) {
        this.mGroup = group
        this.item = group.getChildByName("item") as ItemBaseNotName
        this.btn = group.getChildByName("btn") as eui.Button
        this.price = group.getChildByName("price") as PriceIcon
        this.yaImg = group.getChildByName("ya") as eui.Image
    }
}