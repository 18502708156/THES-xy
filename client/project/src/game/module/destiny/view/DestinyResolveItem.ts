/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/27 18:51
 * @meaning: 灵童命格分解详情item
 * 
 **/


class DestinyResolveItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyResolveItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected pItem: eui.Group;
    protected effGroup: eui.Group;
    protected item: ItemBase;
    protected lbNe: eui.Label;
    protected lbInfo: eui.Label;
    protected countTxt: eui.TextInput;
    protected decBtn: eui.Button;
    protected addBtn: eui.Button;
    protected imgBg: eui.Image;
    protected imgAdd: eui.Image;
    /////////////////////////////////////////////////////////////////////////////



    public PlayEff() {
        UIHelper.PlayBoomEff(this.effGroup)
    }


    private _totalNum = 0


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "DestinyResolveItemSkin";

        // //点击响应
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        this.countTxt.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
        this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.imgAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        


    }

    public dataChanged(): void {


        if (this.data) {
            this.currentState = "item"

            if (this.data.itemConfig.name) {
                this.lbNe.text = this.data.itemConfig.name
                this.lbNe.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality]
            }

            this._totalNum = this.data.count || 0

            this.item.num = this.data.count;
            this.item.setDataByConfig(this.data.itemConfig);
            let arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID]
            let soConfig = GlobalConfig.ins().DestinyResolveConfig[arrCon.type][arrCon.level - 1]
            let nums = 1
            let strTi = ""
            if (soConfig) {
                nums = soConfig.resolvestar || soConfig.resolvecoin
                strTi = soConfig.resolvestar ? "碎片: " : "银两: "
            }
            this.lbInfo.text = strTi + CommonUtils.overLength(this.data.count * nums)
            this.countTxt.text = this.data.count || 0
        }
        else {
            this.currentState = "add"
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
            case this.imgBg:
                if (this.currentState == "add") {
                    ViewManager.ins().open(DestinyResolvelHandleLayer)
                }
                break;
            case this.imgAdd:
                if (this.currentState == "add") {
                    ViewManager.ins().open(DestinyResolvelHandleLayer)
                }
                break;

        }
    }


}