class CmLabel extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // CmLabel.exml
    /////////////////////////////////////////////////////////////////////////////
    protected label: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	
	public constructor() {
		super()
	}

	private val: string

	public set text(value: string) {
		this.val = value	
		this.UpdateLabel()
	}

	public childrenCreated() {
		this.UpdateLabel()
	}

	private UpdateLabel() {
		if (!this.$stage) {
			return
		}
		this.label.text = this.val || ""
	}
}