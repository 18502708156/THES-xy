class GBattleDragonItem extends eui.Component implements  eui.UIComponent {

	// GBattleDragonItemSkin.exml

	protected imgFace: eui.Image;
	protected labName: eui.Label;
	protected labDesc: eui.Label;
	protected imgLeader: eui.Image;

	public constructor() {
		super()
	}

	public childrenCreated() {
		
	}

	public SetGuardInfo(info: GuardInfo) {
		this.imgFace.source = ResDataPath.GetHeadImgName(info.mJob, info.mSex)
		this.labName.text = `${info.mName}.S${info.mServerId}`
		this.labDesc.text = info.mGangName ? `(${info.mGangName})` : ""
	}

	public SetMonsterInfo(icon, name) {
		this.imgFace.source = icon
		this.labName.text = name
		this.labDesc.text = ""
	}

	public SetLeader(flag) {
		this.imgLeader.visible = flag
	}
}