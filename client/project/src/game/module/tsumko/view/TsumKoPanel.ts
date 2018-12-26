/**
 81难-生死劫(章節选择列表界面)
 */
// TsumKoPanelSkin.exml
class TsumKoPanel extends BaseView implements ICommonWindowTitle
{
    public static NAME = "八十一难"
    
    private list:eui.List;

    private shopBtn:eui.Button;

    public constructor()
    {
        super()
        this.skinName = "TsumKoPanelSkin";
        
	}

    public childrenCreated() 
    {
        let list = CommonUtils.GetArray(GameGlobal.Config.ClientShowConfig, "chapterid");
        this.list.itemRenderer=TsumKoListItem;
        this.list.dataProvider = new eui.ArrayCollection(list)

        this.observe(MessageDef.TSUMKO_UPDATE_LIST, this.UpdateList)
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,(e:eui.ItemTapEvent)=>{
            GameGlobal.TsumKoBaseModel.chapterid=e.itemIndex+1;
        },this);
        this._AddClick(this.shopBtn, this._onclick);
    }

   
    public UpdateContent() 
    {

    }

    private UpdateList()
    {
        UIHelper.ListRefresh(this.list);
    }
    private _onclick(e:egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer,[ShopController.EN_SHOP_BASHI]);
                break;
        }
    }
}

