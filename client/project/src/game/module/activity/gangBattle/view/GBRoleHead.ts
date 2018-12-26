class GBRoleHead extends eui.Component implements  eui.UIComponent {

	public static Color_Type = [0xdb0000, 0xd27701, 0xc400fd]
	// GBRoleHeadSkin.exml

	protected imgFace: eui.Image;
	protected labNo: eui.Label;
	protected labName: eui.Label;
	protected labServer: eui.Label;



	public constructor() {
		super()
	}

	public childrenCreated() {
		
	}

	public SetPlayerInfo(info: GBattlePlayerRankInfo, no: number) {
		this.labNo.text = `${no}`
		this.labNo.textColor = GBRoleHead.Color_Type[no-1]
		this.imgFace.source = ResDataPath.GetHeadImgName(info.mJob, info.mSex)
		this.labName.text = `${info.mName}`
		this.labServer.text = `S${info.mServerId}`
	}
}