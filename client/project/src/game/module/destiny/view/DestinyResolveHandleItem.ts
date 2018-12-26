/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/4 21:51
 * @meaning: 灵童命格手动分解详情item
 * 
 **/


class DestinyResolveHandleItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyResolveHandleItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbFight: eui.Label;
    protected nameLabel: eui.Label;
    protected itemIcon: ItemBaseNotName;
    protected lbInfo0: eui.Label;
    protected lbInfo1: eui.Label;
    protected checkBox1: eui.CheckBox;
    protected countTxt: eui.TextInput;
    protected decBtn: eui.Button;
    protected addBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////



    private _totalNum = 0


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "DestinyResolveHandleItemSkin";

        // //点击响应
        this.countTxt.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
        this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.checkBox1.addEventListener(egret.Event.CHANGE, this.chage, this)


    }

    public dataChanged(): void {


        if (this.data) {
            if (this.data.itemConfig.name) {
                this.nameLabel.text = this.data.itemConfig.name
                this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality]
            }
            this._totalNum = this.data.count || 0
            this.itemIcon.setDataByConfig(this.data.itemConfig);
            this.itemIcon.setCount(this._totalNum)
            let arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID]
            if (arrCon.attars) {
                this.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(arrCon.attars)
                if (arrCon.attars[0]) {
                    this.lbInfo0.text = AttributeData.getAttStrByType(arrCon.attars[0], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo0.text = ""
                }

                if (arrCon.attars[1]) {
                    this.lbInfo1.text = AttributeData.getAttStrByType(arrCon.attars[1], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo1.text = ""
                }
            }
            else {
                this.lbFight.text = ""
                this.lbInfo0.text = arrCon.skillName || ""
                this.lbInfo1.text = arrCon.desc || ""
            }
            this.countTxt.text = this.data.count || 0
        }



    }

    public onTxtChange(e) {
        var num = Number(this.countTxt.text);
        this.setTotalPrice(num);
    };


    public setTotalPrice(num: number) {

        var nMaxNum = UserBag.ins().getBagGoodsByHandle(UserBag.BAG_TYPE_ASTROLABE, this.data.handle).count


        if (num < nMaxNum) {
            this._totalNum = num;
        }
        else {
            this._totalNum = nMaxNum;
        }

        if (this._totalNum < 1)
            (
                this._totalNum = 1
            )

        this.data.count = this._totalNum
        this.countTxt.text = this._totalNum + "";
    };


    public onTap(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.decBtn:
                this.setTotalPrice(this._totalNum - 1);
                break;
            case this.addBtn:
                this.setTotalPrice(this._totalNum + 1);
                break;

        }
    }



    //点击选择框改变内容
    public chage() {

        this.data.bSelect = this.checkBox1.selected

        //弹出提示
        if (this.data && this.data.itemConfig && (this.data.itemConfig.quality > 3) && this.data.bSelect) {
            if (GameGlobal.DestinyController.bShowResolveTip) {
                ViewManager.ins().open(TipByBox, null, GameGlobal.DestinyController.bShowResolveTip)
            }
        }
    }


}