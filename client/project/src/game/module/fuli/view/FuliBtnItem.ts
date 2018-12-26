class RechargeBtnItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // FuliBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected icon: eui.Image;
    protected redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	dataChanged() {
		this.icon.source = this.data.icon
		this.UpdateRedPoint()
	}

	public UpdateRedPoint() {
		if (this.$stage == null || this.redPoint == null) {
			return
		}
        let showRedPoint = false
		if (this.data.cls && this.data.cls && this.data.cls["CheckRedPoint"]) {
			showRedPoint = this.data.cls["CheckRedPoint"](this.data.id)
		}
		this.redPoint.visible = showRedPoint
	}
}

class FuliBtnItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // FuliBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected icon: eui.Image;
    protected redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	dataChanged() {
		this.icon.source = this.data.icon
		this.UpdateRedPoint()
	}

	public UpdateRedPoint() {
		if (this.$stage == null || this.redPoint == null) {
			return
		}
        // let showRedPoint = false
		// if (this.data.cls && this.data.cls && this.data.cls["CheckRedPoint"]) {
		// 	showRedPoint = this.data.cls["CheckRedPoint"](this.data.id)
		// }
		this.redPoint.visible = this.data.__redPoint__
	}
}