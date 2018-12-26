class LadderLevelIcon extends eui.Component implements eui.UIComponent {
    /////////////////////////////////////////////////////////////////////////////
    // LadderLevelIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected myRank: eui.Image;
    protected level: eui.Component;
    /////////////////////////////////////////////////////////////////////////////

	/** 等级和段位 */
	private m_Rank01: number

	public constructor() {
		super()
	}

	protected childrenCreated() {
		this._Update()
	}

	/**
	 * 设置等级
	 */
	public SetRank2(rank01: number): void {
		this.m_Rank01 = rank01
		this._Update()
	}

	private _Update() {
		if (this.$stage == null || this.m_Rank01 == null) {
			return
		}
		let config = GameGlobal.Config.KingSportsConfig[this.m_Rank01]
		this.myRank.source = LadderConst.GetMiniIcon(config.showType)
		LadderConst.SetGradeInfo(this.level, this.m_Rank01)
		// // 钻石不显示段位
		// if (this.m_Rank01 == 4) {
		// 	this.m_Rank02 = 0
		// }
		// if (this.m_Rank02 > 0) {
			// this.level.source = LadderLevelIcon.GetLevelImgName(this.m_Rank02)
			this.currentState = "normal"

		// }
		// else {
		// 	this.currentState = "full"
		// 	// this.level.source = null;
		// 	this.level.visible = false
		// 	this.levelBg.visible = false;
		// }
	}

	public static GetLevelImgName(level: number): string {
		return 'laddergradnum_' + level
	}
}