class CatchPetResultWin extends ResultBasePanel {
	protected titleLabel: eui.BitmapLabel;
	protected closeBtn: eui.Button;
	protected gpStar: eui.Group;
	protected bmStar0: eui.Image;
	protected bmStar1: eui.Image;
	protected bmStar2: eui.Image;
	public petShowPanel: PetShowPanel
	protected text: eui.Label
	public group:eui.Group
	protected mc: MovieClip
	public constructor() {
		super();
		this.skinName = "CatchPetResultWinSkin";
	}

	OnOpen(...param: any[]) {
		this.SetBtnLabel("确定")
		this.SetTitleLabel("捕捉成功")
		this.SetCloseFunc(param[1])
		super.OnOpen()
		let star = param[2]

		this.petShowPanel.SetBody(PetConst.GetSkin(param[0]))

		this.text.text = '恭喜获得' + GameGlobal.Config.petBiographyConfig[param[0]].name
		if (star != null) {
			if (star == 0) {
				this.bmStar0.visible = false
				this.bmStar1.visible = false
				this.bmStar2.visible = false
			} else if (star == 1) {
				this.bmStar0.visible = false
				this.bmStar2.visible = false
			} else if (star == 2) {
				this.bmStar1.visible = false
				this.bmStar0.x = 233
				this.bmStar2.x = 400
			}
		}
		else {
			this.bmStar0.visible = false
			this.bmStar1.visible = false
			this.bmStar2.visible = false
		}

		this.mc = this.mc || new MovieClip;
		
		this.mc.loadFile(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, -1);
		this.group.addChild(this.mc)
		this.mc.scaleX = 2.3
		this.mc.scaleY = 2.3
	}
}