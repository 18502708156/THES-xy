class BagFullTipsPanel {
	public static CheckOpen(count) {
		if (UserBag.ins().getSurplusCount() < count) {
			BagFullTipsPanel.Open()
			return false
		}
		return true
	}

	private static strText = "空余背包不足<font color=0xdb0000>Num</font>";

	public static Open() {
		this.strText = this.strText.replace(/Num/,UserBag.BAG_ENOUGH + "个");
		WarnWin.show(this.strText, () => {
			ViewManager.ins().open(SmeltEquipTotalWin);
		}, this, null, null, "sure", {
			btnName: "前往熔炼"
		})
	}
	//打开熔炼界面，但不关闭自己原来的界面，寻宝功能需要用到
	public static OpenNoCloseMe() {
		this.strText = this.strText.replace(/Num/,UserBag.BAG_ENOUGH+"个");
		WarnWin.show(this.strText, () => {
			ViewManager.ins().openEasy(SmeltEquipTotalWin);
		}, this, null, null, "sure", {
			btnName: "前往熔炼"
		})
	}
}
