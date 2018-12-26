class BagItemBase extends ItemBase {

	public childrenCreated() {
		super.childrenCreated()
	}

	protected _UpdateRedPoint() {
		if (this.data.getCanbeUsed) {
			this.redPoint.visible = this.data.getCanbeUsed()
		} else {
			super._UpdateRedPoint()
		}
	}

	public showDetail(): void {
		if (this.itemConfig.useType == ItemUseType.TYPE00) {
			super.showDetail()
		}
		else if (this.itemConfig.useType == ItemUseType.TYPE04) {
			ViewManager.ins().open(ItemAuctionTipsWin, 0, this.itemConfig.id);
		} else {
			if (!ItemData.IsNotTimeLimitUse(this.itemConfig)) {
				super.showDetail()
				return
			}
			ViewManager.ins().open(ItemUseTipsWin, 0, this.itemConfig.id);
		}
	}
}