/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/3 21:15
 * @meaning: 命格分解界面
 * 
 **/

class DestinyResovePanel extends BaseEuiView implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main_2

    public static readonly NAME = "分解命格"


    /////////////////////////////////////////////////////////////////////////////
    // DestinyResolveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected btnDress: eui.Button;
    protected listView: eui.List;
    protected lbAccout: eui.Label;
    protected checkBox5: eui.CheckBox;
    protected checkBox4: eui.CheckBox;
    protected checkBox3: eui.CheckBox;
    protected checkBox2: eui.CheckBox;
    protected checkBox1: eui.CheckBox;
    /////////////////////////////////////////////////////////////////////////////



    private tHave = [];//持有列表
    private tCheckBox = [];//选择框

    public constructor() {
        super()
        this.skinName = "DestinyResolveSkin"
        this.listView.itemRenderer = DestinyResolveItem;
        // this.commonWindowBg.returnBtn.visible = false
    }

    public childrenCreated() {
        for (let i = 1; i < 6; i++) {
            let item = this["checkBox" + i]
            item.labelDisplay.textColor = ItemBase.QUALITY_COLOR[i]
            this.tCheckBox[i] = item
            item.addEventListener(egret.Event.CHANGE, this.chage, this)
            item.selected = GameGlobal.DestinyController.tSelectList[i]
        }

    }



    public OnOpen(...param: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//命格数据变化
        this.observe(MessageDef.DESTINY_SMELT, this.SmeltUpdate)//物品变化
        this._AddClick(this.btnDress, this.onClick)
        this.UpdateContent()
    }

    private SmeltUpdate() {
        let i = 0
        for (let oldData of this.tHave) {
            if (oldData != null) {
                let item = this.listView.getChildAt(i) as DestinyResolveItem
                if (item && egret.is(item, "DestinyResolveItem")) {
                    item.PlayEff()
                }
            }
            ++i
        }
        this.UpdateContent()
    }

    public UpdateContent() {
        this.setData();
        (this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tHave)
    }


    public OnClose() {
        this.commonWindowBg.OnRemoved()
    }


    //点击选择框改变内容
    public chage() {
        for (const index in this.tCheckBox) {
            var pBox = this.tCheckBox[index]
            GameGlobal.DestinyController.tSelectList[index] = pBox.selected
            if ((parseInt(index) > 3) && pBox.selected && GameGlobal.DestinyController.bShowResolveTip) //品质大于3的可以需要检查
            {
                this.showTip(Number(index))
                return
            }
        }
        this.UpdateContent()
    }

    //显示二次确认框
    public showTip(index: number) {
        //弹出提示
        ViewManager.ins().open(TipByBox, null, GameGlobal.DestinyController.bShowResolveTip, null, null, (sure) => {
            if (sure) {
                GameGlobal.DestinyController.tSelectList[index] = true
                this.tCheckBox[index].selected = true
                this.UpdateContent()
            } else {
                GameGlobal.DestinyController.tSelectList[index] = false
                this.tCheckBox[index].selected = false
            }
        })
    }


    public setData() {
        this.tHave = []
        let bag = UserBag.ins().GetBagStarBySort()
        let tAllBag = {}
        let tSelect = GameGlobal.DestinyController.tSelectList

        //按品质区分
        for (const item in bag) {
            let pBag = bag[item]
            if (!tAllBag[pBag.itemConfig.quality]) {
                tAllBag[pBag.itemConfig.quality] = []
            }
            tAllBag[pBag.itemConfig.quality].push(CommonUtils.copyDataHandler(pBag))
        }

        //根据品质先后添加
        let addNums = 0
        for (const item in tAllBag) {
            let tListBag = tAllBag[item]
            for (const index in tListBag) {
                let pBag = tListBag[index]
                if (tSelect[pBag.itemConfig.quality] && (addNums < 9)) {
                    this.tHave[addNums] = pBag
                    addNums++
                }
            }
        }


        for (let i = 0; i < 9; i++) {
            if (!this.tHave[i]) {
                this.tHave[i] = null
            }
        }

    }



    public getResolveData() {
        var tList = []
        var tHaveData = this.tHave
        for (const item in this.tCheckBox) {
            var pBox = this.tCheckBox[item]
            if (pBox.selected) {
                for (const index in tHaveData) {
                    if (tHaveData[index]) {
                        if (tHaveData[index].itemConfig.quality == item) {
                            let ob = { id: 0, num: 0 }
                            ob.id = tHaveData[index].configID
                            ob.num = tHaveData[index].count
                            tList.push(ob)
                        }

                    }
                }
            }
        }

        return tList;
    }

    private onClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.btnDress:
                if (this.getResolveData().length)
                    GameGlobal.DestinyManage.babyStartSmelt(this.getResolveData())
                break
        }
    }

    public static RedPointCheck(): boolean {
        // return GameGlobal.TreasureController.mRedPoint.Get(TreasureRedPoint.INDEX_RESOLVE_TREASURE)
        return false
    }

}