class LadderConst {

	public static GetMiniIcon(level: number) {
		return this.GRADE_MINI_ICON[level] || ""
	}

	private static GRADE_LIST = {
		[5]: { icon: "font_kfwz_zqwz02", level: ["", "font_kfwz_zqwz001", "font_kfwz_zqwz002", "font_kfwz_zqwz003", "font_kfwz_zqwz004", "font_kfwz_zqwz005"] },
		[4]: { icon: "font_kfwz_yhzs02", level: ["", "font_kfwz_yhzs001", "font_kfwz_yhzs002", "font_kfwz_yhzs003", "font_kfwz_yhzs004", "font_kfwz_yhzs005"] },
		[3]: { icon: "font_kfwz_ryhj02", level: ["", "font_kfwz_ryhj001", "font_kfwz_ryhj002", "font_kfwz_ryhj003", "font_kfwz_ryhj004", "font_kfwz_ryhj005"] },
		[2]: { icon: "font_kfwz_zxby02", level: ["", "font_kfwz_zxby001", "font_kfwz_zxby002", "font_kfwz_zxby003", "font_kfwz_zxby004", "font_kfwz_zxby005"] },
		[1]: { icon: "font_kfwz_jjqt02", level: ["", "font_kfwz_jjqt001", "font_kfwz_jjqt002", "font_kfwz_jjqt003", "font_kfwz_jjqt004", "font_kfwz_jjqt005"] }
	}

	public static SetGradeInfo(comp: eui.Component, grade: number) {
		let target = comp as any
		let config = GameGlobal.Config.KingSportsConfig[grade]
		let configData = LadderConst.GRADE_LIST[config.showType]
		if (!configData) {
			return
		}
		target.img1.source = configData.icon
		target.img2.source = configData.level[config.showLevel] || ""
	}

	private static GRADE_ICON = {
		[5]: "ui_kfwz_hz_zqwz01",
		[4]: "ui_kfwz_hz_yhzs01",
		[3]: "ui_kfwz_hz_ryhj01",
		[2]: "ui_kfwz_hz_zxby01",
		[1]: "ui_kfwz_hz_jjqt01",
	}

	private static GRADE_MINI_ICON = {
		[1]: "ui_kfwz_hz_jjqt02",
		[2]: "ui_kfwz_hz_zxby02",
		[3]: "ui_kfwz_hz_ryhj02",
		[4]: "ui_kfwz_hz_yhzs02",
		[5]: "ui_kfwz_hz_zqwz02",
	}

	public static GetMiddleIcon(level: number) {
		return LadderConst.GRADE_ICON[level] || ""
	}

	public static GetRankIconTwo(level: number) {
		switch (level) {
			case 1: return "青铜"
			case 2: return "白银"
			case 3: return "黄金"
			case 4: return "钻石"
			case 5: return "王者"
		}
		return "青铜"
	}

	private static STR = {
		[1]: "倔\n强\n青\n铜\nIII",
		[2]: "倔\n强\n青\n铜\nII",
		[3]: "倔\n强\n青\n铜\nI",
		[4]: "秩\n序\n白\n银\nIV",
		[5]: "秩\n序\n白\n银\nIII",
		[6]: "秩\n序\n白\n银\nII",
		[7]: "秩\n序\n白\n银\nI",
		[8]: "荣\n耀\n黄\n金\nV",
		[9]: "荣\n耀\n黄\n金\nIV",
		[10]: "荣\n耀\n黄\n金\nIII",
		[11]: "荣\n耀\n黄\n金\nII",
		[12]: "荣\n耀\n黄\n金\nI",
		[13]: "永\n恒\n钻\n石\nV",
		[14]: "永\n恒\n钻\n石\nIV",
		[15]: "永\n恒\n钻\n石\nIII",
		[16]: "永\n恒\n钻\n石\nII",
		[17]: "永\n恒\n钻\n石\nI",
		[18]: "最\n强\n王\n者\nV",
		[19]: "最\n强\n王\n者\nIV",
		[20]: "最\n强\n王\n者\nIII",
		[21]: "最\n强\n王\n者\nII",
		[22]: "最\n强\n王\n者\nI",
	}

	// I
	// II
	// III
	// IV
	// V

	// public static GRADE_NAME_BIG_IMG = {
	// 	[1]: "font_kfwz_jjqt",
	// 	[2]: "font_kfwz_zxby",
	// 	[3]: "font_kfwz_yyhj",
	// 	[4]: "font_kfwz_yhzs",
	// 	[5]: "font_kfwz_zqwz",
	// }

	public static GetGradeInfo(grade: number): string {
		return LadderConst.STR[grade] || ""
	}

}