class XiandaoRankView extends BaseView implements ICommonWindowTitle {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: CmLabel;
    protected list: eui.List;
    protected list2: eui.List;
    protected myRank: eui.Label;
    protected myScore: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	
	public constructor() {
		super()
		this.skinName = "XiandaoRankSkin"
		this.list.itemRenderer = XiandaoRankItem
		this.list2.itemRenderer = XiandaoRankItem2
	}

	public OnOpen() {
		this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateRank)
		this.UpdateRank()
		GameGlobal.XiandaoModel.SendGetRank()
	}

	public OnClose() {
	}

	public UpdateRank() {
		let model = GameGlobal.XiandaoModel
		let rank = model.GetRankData()	
		this.list.dataProvider = new eui.ArrayCollection(rank)
		let myRankData = model.GetMyRankData()
		this.myRank.textFlow = TextFlowMaker.generateTextFlow(`我的排名：|C:0x019704&T:${myRankData.GetRank()}|`)
		this.myScore.textFlow = TextFlowMaker.generateTextFlow(`我的积分：|C:0x019704&T:${myRankData.score}|`)
		this.titleLabel.text = model.GetGroupTypeStr()
		let record = model.GetRankRecord()
		record.sort(function(lhs, rhs) {
			return rhs.trunId - lhs.trunId
		})
		this.list2.dataProvider = new eui.ArrayCollection(record)
	}

	public UpdateContent() {
		
	}
}

class XiandaoRankItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // XiandaoRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected rankLabel: eui.Label;
    protected nameLabel: eui.Label;
    // protected powerLabel: eui.Label;
    protected scoreLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	
	public dataChanged() {
		this.bg.visible = this.itemIndex % 2 == 0
		let data = this.data as XiandaoRankData
		this.rankLabel.text = data.rank + ""
		this.nameLabel.text = GameString.GetSerAndName(data.serverId, data.roleName)
		// this.powerLabel.text = data.GetPower()
		this.scoreLabel.text = data.score + ""
	}
}

class XiandaoRankItem2 extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // XiandaoRankItem2Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected turn: eui.Label;
    protected retImg: eui.Image;
    protected retImg1: eui.Image;
    protected nameLabel1: eui.Label;
    protected scoreLabel: eui.Label;
    protected nameLabel2: eui.Label;
    protected retImg2: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
	
	public dataChanged() {
		let data = this.data as XiandaoRecordData
		this.turn.text = `第${StringUtils.numberToChinese(data.trunId)}局`
		this.retImg.source =  data.isWin ? "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai"
		this.retImg1.visible = data.isWin
		this.retImg2.visible = !data.isWin
		this.nameLabel1.text = GameString.GetSerAndName(data.server1, data.name1)
		this.nameLabel2.text = GameString.GetSerAndName(data.server2, data.name2)
	}
}