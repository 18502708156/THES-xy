/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/27 14:35
 * @meaning: 丹药界面
 * 
 **/

class RoleElixirPanel extends BaseEuiView implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main;

    /////////////////////////////////////////////////////////////////////////////
    // RoleElixirSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected powerLabel: PowerLabel;
    protected stepLabel: eui.Label;
    protected tattr: eui.Label;
    protected needItemView: NeedItemView;
    protected btnUp: eui.Button;
    protected totalAttr: eui.Label;
    protected consumeLabel: ConsumeTwoLabel;
    protected g0: eui.Component;
    protected g1: eui.Component;
    protected g2: eui.Component;
    protected g3: eui.Component;
    protected g4: eui.Component;
    protected g5: eui.Component;
    protected g6: eui.Component;
    protected g7: eui.Component;

    protected lbName: eui.Label;
    protected lbInfo: eui.Label;
    protected lbHasUse: eui.Label;



    /////////////////////////////////////////////////////////////////////////////

    private mItems: RoleSkillItem[] = []
    private nSelectIndex: number = 0

    private tElixirData = [];

    tDanYaoName = ["生命丹", "攻击丹", "防御丹", "命中丹", "闪避丹", "暴击丹", "抗暴丹", "攻速丹"];
    tDanYaoImg = ["2006701", "2006702", "2006703", "2006704", "2006705", "2006706", "2006707", "2006708"];

    public constructor() {
        super()
        this.skinName = "RoleElixirSkin";
        this.name = '丹药';
    }

    public childrenCreated() {
        this._AddClick(this.btnUp, this.onCkick);
        this.observe(MessageDef.ROLE_ELIXIR_UPDATE, this.UpdateContent)
        this.commonWindowBg.SetTitle("丹药")
        for (let i = 0; i <= 7; i++) {
            let item = this["g" + i]
            item.currentState = "open"
            this.mItems[i] = item
            this._AddClick(item, this._OnItemClick)
        }
    }

    public OnOpen(...param: any[]) {
        this.commonWindowBg.OnAdded(this);
        GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_ELIXIR_UPDATE)
        this.nSelectIndex = 0
        this.UpdateContent();
    }

    private onCkick(e: egret.TouchEvent) {
        let pData = this.getNowSelctDanYao()
        if (pData) {
            if (UserBag.CheckEnough(pData.itemid.id, pData.itemid.count)) {
                GameGlobal.UserElixir.useElixir(pData.posId)
                // this.localCanUp(true)
            }
        }
    }


    getNowSelctDanYao() {
        return this.tElixirData[this.nSelectIndex]
    }

    upDateData() {
        this.tElixirData = GameGlobal.UserElixir.getElixirData()//
    }

    private UpdateContent(): void {
        this.upDateData()
        this.localCanUpPos()

        let selectIndex = this.nSelectIndex
        for (let i = 0; i < this.mItems.length; i++) {
            let item = this.mItems[i]
            item.img_select.visible = i == selectIndex
            this.UpdateItem(i)
        }

        this.upDateInfo()

    }

    upDateInfo() {
        var pData = this.getNowSelctDanYao()
        if (this.nSelectIndex <= this.tDanYaoName.length) {
            this.lbName.text = this.tDanYaoName[this.nSelectIndex]
        }

        //消耗物品
        this.needItemView.SetItemId(pData.itemid.id, pData.itemid.count)

        //已使用
        UIHelper.SetLabelText(this.lbHasUse, "已使用：", pData.level + "")

        //属性加成
        this.tattr.text = AttributeData.getAttStr(pData.attrpower, 0, 1, '：');

        //战力
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(GameGlobal.UserElixir.getElixirArr());

        //总属性战力
        let attr;
        for (let i = 0; i < 8; i++) {
            attr = GameGlobal.UserElixir.getElixirArr()[i];
            if (attr) {
                this['totalAttr' + i].text = AttributeData.getAttStrByType(attr, 0, "+", false, '#682f00');
            }
            else {
                this['totalAttr' + i].text = '';
            }
        }


    }

    //定位到可以升级的地方 _bFirstMy是否以当前
    // localCanUp(_bFirstMy) {

    //     if (_bFirstMy) {
    //         //已经有选择的位置
    //         if (this.tElixirData[this.nSelectIndex]) {
    //             var nSelectId = this.tElixirData[this.nSelectIndex].itemid.id
    //             var nHaveNums = GameGlobal.UserBag.GetCount(nSelectId)
    //             if (GameGlobal.UserBag.GetCount(nSelectId) > this.tElixirData[this.nSelectIndex].itemid.count) {
    //                 ////如果发现当前可以继续升级的话,选择的位置不发生改变
    //                 return
    //             }
    //         }
    //     }

    //     var bFind = false
    //     for (const item in this.tElixirData) {
    //         var nGetId = this.tElixirData[item].itemid.id
    //         if (nGetId) {
    //             if (GameGlobal.UserBag.GetCount(nGetId) >= this.tElixirData[item].itemid.count) {
    //                 this.nSelectIndex = this.tElixirData[item].posId //定位到可以升级的地方
    //                 bFind = true
    //                 break
    //             }
    //         }
    //     }
    //     if (!bFind) {
    //         this.nSelectIndex = 0 //重置到0的位置
    //     }

    // }

    private localCanUpPos() {
        if (this.tElixirData[this.nSelectIndex]) {
            let selectId = this.tElixirData[this.nSelectIndex].itemid.id
            if (GameGlobal.UserBag.GetCount(selectId) >= this.tElixirData[this.nSelectIndex].itemid.count)
                return
        }

        for (const item in this.tElixirData) {
            var nGetId = this.tElixirData[item].itemid.id
            if (nGetId) {
                if (GameGlobal.UserBag.GetCount(nGetId) >= this.tElixirData[item].itemid.count) {
                    this.nSelectIndex = this.tElixirData[item].posId
                    break
                }
            }
        }
    }



    UpdateItem(itemIndex: number) {
        let item = this.mItems[itemIndex]

        if (itemIndex <= this.tDanYaoName.length) {
            item.lb_name.text = this.tDanYaoName[itemIndex]
            var strImg = this.tDanYaoImg[itemIndex]
            item.img_icon.source = ResDataPath.GetItemFullPath(strImg)
        }

        var strLv = ""
        if (this.tElixirData[itemIndex] && this.tElixirData[itemIndex].level) {
            if (this.tElixirData[itemIndex].level > 0) {
                strLv = this.tElixirData[itemIndex].level
            }
        }
        item.lb_level.text = strLv
        item.lb_name.textColor = 0x682f00;
        UIHelper.ShowRedPoint(item,this.tElixirData[itemIndex].itemid.count <= GameGlobal.UserBag.GetCount(this.tElixirData[itemIndex].itemid.id))
    }

    private _OnItemClick(e: egret.TouchEvent) {
        let index = this.mItems.indexOf(e.currentTarget)
        this.nSelectIndex = index
        this.UpdateContent()
    }


    public OnClose() {

    }


    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_29);
    }
}