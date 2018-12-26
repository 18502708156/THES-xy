class GuanQiaRuleIcon extends RuleIconBase {

	public tar: GuanQiaRuleIconTar

	public constructor(tar) {
		super(tar)
		this.updateMessage = [
			MessageDef.RAID_KILL_MONSTER_COUNT
		]

		this.tar.imgf0.visible = false
		this.tar.imgf1.visible = false
		this.tar.imgf2.visible = false
		this.tar.currentState = "s0"
	}

	public DoHide(): void {
		this.tar.visible = false
	}

	update() {
		super.update()
		this.tar.cbAuto.selected = GameGlobal.UserFb.mAuto
		this.upDataGuanqia()
	}

	checkShowIcon() {
		return !GameGlobal.UserFb.nextMap
	}

	checkShowRedPoint() {
		return 0
	}

	upDataGuanqia() {
		let userFb = GameGlobal.UserFb
		var gqID = userFb.guanqiaID;
		if (gqID >= 0) {
			let need = Math.min(3, userFb.config.bossNeedWave)
			this.tar.currentState = "s" + need
			let newValue = Math.min(userFb.killMonsterCount, userFb.config.bossNeedWave);;
			this.SetVisibleState(newValue, need)

			let isBoss = userFb.killMonsterCount >= userFb.config.bossNeedWave
			this.tar.goBossBtn.visible = isBoss
			this.tar.imgOpen.visible = !isBoss
		} else {
			this.tar.currentState = "s0"
		}
	}

	private SetVisibleState(cur: number, max: number) {
		let tar = this.tar
		if (max == 1) {
			tar.imgf1.visible = cur >= 1
		} else if (max == 2) {
			tar.imgf0.visible = cur >= 1
			tar.imgf2.visible = cur >= 2
		} else if (max == 3) {
			tar.imgf0.visible = cur >= 1
			tar.imgf1.visible = cur >= 2
			tar.imgf2.visible = cur >= 3
		}
	}

	tapExecute(tapTarget: any) {
		if (tapTarget == this.tar.cbAuto) {
			if(Deblocking.Check(DeblockingType.TYPE_3))
			{
				GameGlobal.UserFb.mAuto = this.tar.cbAuto.selected
				GameGlobal.UserFb.sendSetAuto()
			}
			else
			{
				this.tar.cbAuto.selected  = false
			}
		} else {
			ViewManager.ins().open(GuanQiaRewardWin)
		}
	}
}

class GuanQiaRuleIconTar extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // MainGuanqiaBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    public imgOpen: eui.Image;
    public goBossBtn: eui.Image;
    public imgf2: eui.Image;
    public imgf1: eui.Image;
    public imgf0: eui.Image;
    public cbAuto: eui.CheckBox;
    public labelDisplay: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
}