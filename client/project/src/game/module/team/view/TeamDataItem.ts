class TeamDataItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // TeamDataItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected name_txt: eui.Label;
    protected num_txt: eui.Label;
    protected goBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	childrenCreated() {
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}

	private OnClick() {
		let model = this.data.mModel as TeamBaseModel	
		let data = this.data.mInfo as Sproto.team_data
		let config = this.data.config
		model.SendJoin(config, data.leaderid)
	}

	public dataChanged() {
		let model = this.data.mModel as TeamBaseModel	
		let data = this.data.mInfo as Sproto.team_data
		this.num_txt.text = data.count + "/3"


		let mem = data.members || []
		for (let i = 0; i < mem.length; i++) {
			if (mem[i].dbid == data.leaderid) {
				this.name_txt.text = mem[i].name
				break
			}
		}
	}
}