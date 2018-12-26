class EquipDetailedWin extends BaseEuiView {


    /////////////////////////////////////////////////////////////////////////////
    // EquipTipsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected colorCanvas: eui.Component;
    protected background: eui.Component;
    protected group: eui.Group;
    protected imgTipRect: eui.Image;
    protected nameLabel: eui.Label;
    protected score: eui.Label;
    protected type: eui.Label;
    protected lv: eui.Label;
    protected career: eui.Label;
    protected itemIcon: ItemIcon;
    protected powerLabel: PowerLabel;
    protected attTitleLabel: eui.Label;
    protected attr: eui.Label;
    protected forgeGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super();
    }

    public initUI() {
        super.initUI();
        this.skinName = "EquipTipsSkin";
    };

    public OnOpen(...param: any[]) {
        var configID = param[0];
        var data = param[1];


        this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.setData(configID, data);

    }

    public OnClose() {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
    }

    public otherClose(evt: egret.TouchEvent) {
        ViewManager.ins().close(EquipDetailedWin);
    }

    private _SetType(str: string): void {
        if (str)
            this.type.text = "部位：" + str;
    }

    private _SetLv(str: string, color: string): void {
        // this.lv.textFlow = TextFlowMaker.generateTextFlow(`${txt}：|C:${color}&T:${str}|`)
        if (str)
            this.lv.text = str;
    }

    public setData(configID: number, data: ItemBaseData) {
        var itemConfig;
        itemConfig = GlobalConfig.ins().ItemConfig[configID];
        this.nameLabel.text = itemConfig.name;
        this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
        this.itemIcon.setData(itemConfig);
        this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[itemConfig.quality];
        if (data instanceof ItemData || itemConfig != null) {
            let color
            color = GameLogic.ins().actorModel.level < itemConfig.lv ? Color.Red : Color.Green;
            if (itemConfig.type == ItemType.EQUIP) {
                this._SetLv("等级：" + itemConfig.level + "级", Color.GetStr(color))
                this._SetType(Role.getEquipNameByType(itemConfig.subType));
                this.career.text = "职业：" + Role.getJobNameByJob(itemConfig.job);
            }
            else {
                this._SetLv("阶数：" + itemConfig.level + "阶", Color.GetStr(color))
                this._SetType(Role.typeNumberToName2[itemConfig.subType]);
                this.career.text = "系统：" + ItemConst.TYPE_NAME[itemConfig.type];
            }
        }

        let equipConfig = GlobalConfig.ins().EquipConfig[configID];
        let strAtt = AttributeData.getAttStr(equipConfig.attrs, 1)
        this.attr.text = strAtt;
        if (data && data.GetScore) {
            this.score.text = "评分: " + data.GetScore()
            this.powerLabel.text =  data.GetScore()
        }
        else {
            this.score.text = "评分: " + ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
            this.powerLabel.text =  ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
        }

        if (data && data.att && data.att.length) {
            this.AddAttrTips("附加属性", data.att)
        }

        egret.callLater(this.LaterUpdate, this)
    }


    public AddAttrTips(type: string, attr) {
        let group = EquipUserDetailedWin.GetTipsGroup()
        let titleAttrTxt = new eui.Label
        titleAttrTxt.x = this.attTitleLabel.x
        titleAttrTxt.y = this.attTitleLabel.y
        titleAttrTxt.style = this.attTitleLabel.style
        titleAttrTxt.text = type
        group.addChild(titleAttrTxt)
        let attrTxt = new eui.Label
        attrTxt.x = this.attr.x
        attrTxt.y = this.attr.y
        attrTxt.style = this.attr.style
        group.addChild(attrTxt)
        attrTxt.text = AttributeData.getAttStr(attr, 1);

        this.forgeGroup.addChild(group)
    }

    private AddTips(descStr: string) {
        let group = EquipUserDetailedWin.GetTipsGroup()
        var desc = new eui.Label;
        desc.style = this.attTitleLabel.style
        desc.x = this.attTitleLabel.x
        desc.y = this.attTitleLabel.y
        desc.style = this.attTitleLabel.style
        desc.textFlow = TextFlowMaker.generateTextFlow(descStr);
        group.addChild(desc)
        this.forgeGroup.addChild(group);
    }

    private LaterUpdate(): void {
        this.background.height = this.group.height + 50
    }
}

EquipDetailedWin.LAYER_LEVEL = LayerManager.UI_Popup;