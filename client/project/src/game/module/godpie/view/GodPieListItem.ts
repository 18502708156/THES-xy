class GodPieListItem extends eui.ItemRenderer {

private list: eui.List;
private buyGroup: eui.Group;
private send: eui.Button;
private contion: eui.Label;
private consumeLabel: eui.Label;
private geted: eui.Image;
private scroller: eui.Scroller


	public constructor() {
		super()
	}

    public childrenCreated(): void {
        this.list.itemRenderer = ItemBaseEffe
        this.scroller.horizontalScrollBar.autoVisibility = false
        this.send.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
    }

    private _OnClick(): void {
        let data = this.data as {index: number, info: Sproto.sc_rechargew_shit_request}
        GodPieWin.BuyData(data.info, data.index)
    }

    public dataChanged(): void {
        let data = this.data as {index: number, info: Sproto.sc_rechargew_shit_request}
        let info = data.info
        GodPieWin.ShowTargetData(this.contion, this.consumeLabel, this.list, this.buyGroup, this.geted, this.send, info, data.index)
    }
}