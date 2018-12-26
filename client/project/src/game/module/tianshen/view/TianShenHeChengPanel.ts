class TianShenHeChengPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "合成"

    /////////////////////////////////////////////////////////////////////////////
    // TianShenHeChengSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////
    private mHeChengList;

    public constructor() {
        super()
    }

    public childrenCreated() {
        this.list.itemRenderer = TianShenHeChengItem;
        this.mHeChengList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalSynthesisConfig, "id");
        this.list.dataProvider = new eui.ArrayCollection(this.mHeChengList)
    }

    public OnOpen(...args: any[]) {
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateContent)
    }

    public UpdateContent() {
        this.list.dataProvider = new eui.ArrayCollection(this.mHeChengList);
    }
}

class TianShenHeChengItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // TianShenHeChengItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected needItemView: NeedItemView;
    protected btnHC: eui.Button;
    protected getwayLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    private tianshenId: number = 0;

    childrenCreated() {
        this.btnHC.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.getwayLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    private onClickHandler(e: egret.TouchEvent) {
        GameGlobal.TianShenModel.SendHeCheng(this.tianshenId);
    }

    private onClick() {
        UserWarn.ins().setBuyGoodsWarn(this.data.cost.id) 
    }

    dataChanged() {
        if (!this.data) return;
        this.tianshenId = this.data.id;
        this.needItemView.SetItemId(this.data.cost.id, this.data.cost.count);
        let canUp = UserBag.ins().GetCount(this.data.cost.id) >= this.data.cost.count;
        this.btnHC.visible = canUp;
        this.getwayLabel.visible = !canUp;
        this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>获取" + GameGlobal.GetItemName(this.tianshenId) + "碎片</u></a>");

    }
}