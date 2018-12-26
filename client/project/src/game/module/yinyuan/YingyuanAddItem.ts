class YingyuanAddItem extends eui.ItemRenderer {

    public bnt:eui.Button;
    public jsname:eui.Label;
    public lv:eui.Label;
    public zdl:eui.Label;

    public constructor() {
        super();
        this.skinName = "YingYuanItemSkin"
    }

    public childrenCreated() {
         this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onclick,this)
    }

    onclick() {
        let data = this.data
        GameGlobal.YingYuanModel.getFriendData(this.data)
    }

    public dataChanged() {
        let data = this.data
        this.jsname.text = data.friendInfo.name
        this.lv.text = data.friendInfo.level
        this.zdl.text = data.friendInfo.power
    }

}