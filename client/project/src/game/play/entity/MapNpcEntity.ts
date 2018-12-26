class MapNpcEntity extends RoleBattleEntity {

	private m_NameTxt: MapEntityTxt

	public UpdateInfo(model: EntityRole): void {
		this.UpateName(model.GetName())
		super.UpdateInfo(model)
	}

	public UpateName(str: string): void {
		if (!str) {
			if (this.m_NameTxt) 
				this.m_NameTxt.visible = false
			return
		}
		if (!this.m_NameTxt) {
			this.m_NameTxt = new MapEntityTxt
		} else {
			this.m_NameTxt.visible = true
		}
		this.addChild(this.m_NameTxt)
		this.m_NameTxt.textFlow = TextFlowMaker.generateTextFlow(str)
	}
}