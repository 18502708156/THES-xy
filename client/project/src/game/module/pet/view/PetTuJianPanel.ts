class PetTuJianPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "图鉴"

    /////////////////////////////////////////////////////////////////////////////
    // PetTuJianSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected List: eui.List;
    /////////////////////////////////////////////////////////////////////////////

    public mContext: PetMainPanel
    public constructor() {
        super()
    }

    public childrenCreated() {
        this.List.itemRenderer = PetTuJianItem;
        let dataProvider = new eui.ArrayCollection();

        let pets: { [key: number]: any[] } = {};
        let config = GameGlobal.Config.petBiographyConfig;
        for (let key1 in config) {
            if (!pets[config[key1].pictype])
                pets[config[key1].pictype] = []
            pets[config[key1].pictype].push(config[key1]);
        }
        for (let key in GameGlobal.Config.HandBookConfig) {
            SortTools.sortMap(pets[key], "id");
            let itemData = {};
            itemData["info"] = GameGlobal.Config.HandBookConfig[key];
            itemData["datas"] = pets[key];
            dataProvider.addItem(itemData);
        }
        this.List.dataProvider = dataProvider;
    }

    UpdateContent() {

    }
}

class PetTuJianItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // PetTuJianItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected List: eui.List;
    protected getThroughTxt: eui.Label;
    protected getwaylabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super();
        this.skinName = "PetTuJianItemSkin"
    }

    public childrenCreated() {
        super.childrenCreated()
        this.List.itemRenderer = PetTuJianItemIcon;
        this.getwaylabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this)
    }

    public dataChanged() {
        super.dataChanged()
        this.List.dataProvider = new eui.ArrayCollection(this.data.datas);
        this.getwaylabel.text = this.data.info.name;
        this.getThroughTxt.text = this.data.info.name;
        UIHelper.SetLinkStyleLabel(this.getwaylabel)
    }

    tap() {
        let config = GameGlobal.Config.HandBookConfig[this.data.info.id]
        let info;
        if (config.hasOwnProperty("gainWay"))
            info = config.gainWay[0]
        if (!info) {
            GameGlobal.UserTips.showTips(config.name);
            return
        }

        ViewManager.ins().Guide(info[1][0], info[1][1]);
    }
}

class PetTuJianItemIcon extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // PetTuJianItemIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected item: ItemIcon;
    protected lbName: eui.Label;
    protected godImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super();
    }

    public childrenCreated() {
        super.childrenCreated()
        this.skinName = "PetTuJianItemIconSkin"
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    public dataChanged() {
        super.dataChanged()
        this.item.setItemImg(PetConst.GetHeadPath(this.data.icon));
        this.item.SetQuality(this.data.quality)
        this.lbName.textColor = ItemBase.GetColorByQuality(this.data.quality)
        this.lbName.text = this.data.name
        this.godImg.visible = GameGlobal.Config.petBiographyConfig[this.data.id].picshow
    }

    onClick(e) {
        ViewManager.ins().open(PetInfoPanel, this.data);
    }
}