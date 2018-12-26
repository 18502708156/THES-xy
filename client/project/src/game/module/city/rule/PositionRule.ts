class PositionRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.POSITION_AWARD_CHANGE, MessageDef.LEVEL_CHANGE]
	}

	checkShowIcon() {
		let config = GameGlobal.Config.StationConfig
		let position_info = GameGlobal.PositionForeshowModel.position_info;
		let show = false;
		if (position_info) {
			for (let key in position_info.data) {
				if (position_info.data[key].typ != 3 && GameGlobal.actorModel.level >= config[parseInt(key) + 1].showlv) {
					this.iconDisplay.source = `ui_gk_bt_zw${parseInt(key) + 2}`
					show = true;
					break
				}
			}
		}
		return Deblocking.IsDeblocking(DeblockingType.TYPE_142) && show;
	}

	checkShowRedPoint() {
		return GameGlobal.PositionForeshowModel.isRedPoint();
	}

	tapExecute() {
		ViewManager.ins().open(PositionForeshowPanel);
	}
}
