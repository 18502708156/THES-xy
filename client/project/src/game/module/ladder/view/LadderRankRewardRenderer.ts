class LadderRankRewardRenderer extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // LadderRankRewardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected img1: eui.Image;
    protected img2: eui.Image;
    protected item: ItemBaseNotName;
    /////////////////////////////////////////////////////////////////////////////

	public static GRADE_NAME_BIG_IMG = {
		[1]: "font_kfwz_zqwz",
		[2]: "font_kfwz_yhzs",
		[3]: "font_kfwz_yyhj",
		[4]: "font_kfwz_zxby",
		[5]: "font_kfwz_jjqt",
	}

	public constructor() {
		super()
		this.skinName = "LadderRankRewardItemSkin"
	}

	public dataChanged() {
		let config = this.data
		this.img1.source = LadderConst.GetMiddleIcon(6 - config.type)
		this.img2.source = LadderRankRewardRenderer.GRADE_NAME_BIG_IMG[config.type]
		this.item.data = config.rankreward[0]
	}
}