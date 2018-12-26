class GBattleGangRankPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "帮会排行"

    /////////////////////////////////////////////////////////////////////////////
    // GBattleGangRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected labMyRank: eui.Label;
    protected labMyData: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
        this.skinName = "GBattleGangRankSkin"
	}

    public childrenCreated() {
        this.list.itemRenderer = GangRankIem
        this.list.dataProvider = new eui.ArrayCollection([])
    
    }

    public UpdateContent() {

    }

	public UpdateRankInfo(gangRankList: Sproto.guildwar_guild_info[]) {
        let myGangRankInfo = this.GetMyGangRankInfo(gangRankList)
        this.labMyRank.text = `${myGangRankInfo ? myGangRankInfo.rankData.injureRank : "未排名"}`
        this.labMyData.text = `${myGangRankInfo ? myGangRankInfo.rankData.injure : 0}`

        gangRankList.sort(function (lhs, rhs) {
			return lhs.rankData.injureRank - rhs.rankData.injureRank
		})
        this.list.dataProvider = new eui.ArrayCollection(gangRankList)
	}

	public OnOpen() {
        this.observe(MessageDef.GANGBATTLE_UPDATE_ALLGANGRANK, this.UpdateRankInfo)

        GameGlobal.GangBattleModel.SendAllGangRank()
	}

	public OnClose() {
        
	}

    private GetMyGangRankInfo(gangRankList) {
        for (let info of gangRankList) {
            if (info.guildId == GameGlobal.actorModel.guildID)
            {
                return info
            }
        }
    }

}

class GangRankIem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // GBattleGangRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgBg: eui.Image;
    protected labNo: eui.Label;
    protected labGangName: eui.Label;
    protected labData: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {

	}

	public dataChanged() {
		this.imgBg.visible = this.itemIndex % 2 == 0

        let gangRankInfo: Sproto.guildwar_guild_info = this.data
        this.labNo.text = `${gangRankInfo.rankData.injureRank}`
        this.labGangName.text = `${gangRankInfo.guildName}.S${gangRankInfo.serverId}`
        this.labData.text = `${gangRankInfo.rankData.injure}`
	}

}
