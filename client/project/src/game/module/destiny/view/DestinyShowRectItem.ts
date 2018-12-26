/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:51
 * @meaning: 灵童命格框信息
 * 
 * 
 **/


class DestinyShowRectItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyShowRectSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected listView: eui.List;
    protected nameLabel: eui.Label;
    protected imgIcon: eui.Image;
    protected imgArrow: eui.Image;
    /////////////////////////////////////////////////////////////////////////////





    private _totalNum = 0


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "DestinyShowRectSkin";
        this.listView.itemRenderer = DestinyShowInfoItem
    }

    public dataChanged(): void {

        if (this.data) {
            this.nameLabel.text = this.data.tList[0].name || ""
            this.imgIcon.source = ResDataPath.GetItemFullPath(this.data.tList[0].icon || "")
        }
        if (this.data.bSelect) {
            this.currentState = "show"
            this.listView.dataProvider = new eui.ArrayCollection(this.data.tList)
        }
        else {
            this.currentState = "nor"
            this.listView.dataProvider = new eui.ArrayCollection([])
        }

    }






}