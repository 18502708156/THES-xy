class ActivityRewardPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "奖励预览"

    /////////////////////////////////////////////////////////////////////////////
    // ActivityRewardShowPanel.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgShow: eui.Image;
    protected roleShowpanel: RoleShowPanel;
    protected labTip: eui.Label;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

    protected mIdx: number
    public mContext: ActivityRewardShowWin

	public constructor() {
		super()
        this.skinName = "ActivityRewardShowPanel"
        this.mIdx = 0
	}

    public childrenCreated() {

        this.list.itemRenderer = ActivityAwardShowItem
        
    }

    public UpdateContent() {
        this.imgShow.source = this.mContext.GetImgSource()
        let list = this.mContext.GetAwardList(this.mIdx)
        this.list.dataProvider = new eui.ArrayCollection(list)
    }

	public OnOpen() {
        this.UpdateContent()
	}

	public OnClose() {
        
	}
}

class ActivityAwardShowItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // ActivityRewardShowItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labText: eui.Label;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////
    
	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
	}

	public dataChanged() {
        let data = this.data
        this.labText.text = data.name
        this.list.dataProvider = new eui.ArrayCollection(data.showitem)
	}
}

class ActivityRankRewardPanel extends ActivityRewardPanel {
    public static NAME = "排名奖励"

    public constructor() {
		super()
        this.mIdx = 1
	}
}

class ActivityDragonRankPanel extends ActivityRewardPanel {
    public static NAME = "神龙奖励"

    public constructor() {
		super()
        this.mIdx = 2
	}
}