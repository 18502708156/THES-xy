class PlotSimplePanel extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // PlotSimpleSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected anim: egret.tween.TweenGroup;
    protected posGroup: eui.Group;
    protected leftImg: eui.Image;
    protected rightImg: eui.Image;
    protected label: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "PlotSimpleSkin"
		this.width = 0
		this.height = 0
		this.posGroup.x = 0
		this.posGroup.y = -140

		this.anim.play()
	}

	public SetMsg(str: string) {
		this.label.text = str
		this.leftImg.width = this.rightImg.width = (this.label.width >> 1) + 30
	}
}