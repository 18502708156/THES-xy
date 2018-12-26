class TreasureArrInfo extends BaseEuiView {

    /////////////////////////////////////////////////////////////////////////////
    // TreasureArrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected animGroup: eui.Group;
    protected bg: eui.Component;
    protected gRect: eui.Group;
    protected background: eui.Component;
    protected group: eui.Group;
    protected imgTipRect: eui.Image;
    protected score: eui.Label;
    protected type: eui.Label;
    protected lv: eui.Label;
    protected nameLabel: eui.Label;
    protected baseCricle: BaseCricleIcon;
    protected powerLabel: PowerLabel;
    protected attTitleLabel: eui.Label;
    protected attr: eui.Label;
    protected gSkill: eui.Group;
    protected gDown: eui.Group;
    protected btnShow: eui.Button;
    protected btnDress: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    replaceBtn: eui.Button


    ////////////////////////////////////////////////////////////////////////////////////////////////////

    _totalPower
    _equipPower

    data: TreasureData //物品数据


    nPos//选择位置,只有需要装备位置的才有

    bViBtn: Boolean;//true为不显示按钮,纯属展示用


    public constructor() {
        super();
    }

    public initUI() {
        super.initUI();
        this.skinName = "TreasureArrSkin";
    };

    public OnOpen(...param: any[]) {
        var data = param[0];
        var nPos = param[1];
        this.bViBtn = param[2];

        this.bg.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.btnDress.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_END, this.onShow, this);



        this.setData(data, nPos);
        this.setMakeName(param[3])

        UIHelper.PlayPanelTween(this.animGroup)
    }

    public OnClose() {
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.btnDress.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_END, this.onUp, this);
    }

    public otherClose(evt: egret.TouchEvent) {
        ViewManager.ins().close(TreasureArrInfo);
    }

    public onUp(evt: egret.TouchEvent) {
        if (this.data.spellsId) {
            if (GameGlobal.TreasureModel.canEquip(this.data.type, this.nPos - 1)) {
                //处理位置.
                GameGlobal.TreasureModel.sendSpellsResUse(this.nPos, this.data.spellsId)
            }
            else {
                UserTips.ins().showTips("相同类型的法宝不能装备")
            }
        }
        ViewManager.ins().close(TreasureArrInfo);
    }

    //展示
    private onShow() {
        //法宝内容
        let tList = []
        // let tObj = { type: 2, value: this.data.id, valueEx: this.data.level || 1 };
        let tObj = new Sproto.client_chat_param
        tObj.type = 2
        tObj.value = this.data.id
        tObj.valueEx = this.data.level || 1 
        tObj.strvalue = this.data.skillid ? this.data.skillid.join(",") : ""
        tList.push(tObj)
        GameGlobal.Chat.chatShareInfo(3, tList);
        // UserTips.ins().showTips("展示成功")
        ViewManager.ins().close(TreasureArrInfo);
    }


    private _SetType(str: string): void {
        if (str)
            this.type.text = "级别：" + str;
    }


    private setMakeName(_str) {
        if (_str) {
            this.lv.text = "打造者: " + _str
        }
        else {
            this.lv.text = ""
        }

    }

    public setData(_data, _pos) {

        //当前选择位置
        this.nPos = _pos

        if (!_data) {
            return;
        }

        var treasureData = _data as TreasureData

        this.data = _data

        if (this.bViBtn) {
            UIHelper.SetVisible(this.gDown, false)
        }
        else {
            UIHelper.SetVisible(this.gDown, true)
            if (_pos) {
                this.btnShow.x = 62
                this.btnDress.visible = true
            }
            else {
                this.btnShow.x = 121
                this.btnDress.visible = false
            }
        }


        this.nameLabel.text = treasureData.name;//名字
        this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[treasureData.quality];

        if (_data.attrs) {
            this.score.text = "评分: " + ItemConfig.CalcAttrScoreValue(_data.attrs);
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(_data.attrs);  //战力
        }


        //圆形圆圈
        this.baseCricle.setData(treasureData)
        this._SetType(TreasureShowItem.TREASURETYPE[treasureData.quality]);


        //属性
        let strAtt = AttributeData.getAttStr(treasureData.attrs, 1)
        this.attr.text = strAtt;

        this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[treasureData.quality];


        //如果没有技能的话技能不需要显示
        if (treasureData.skillid && treasureData.skillid.length) {
            this.gSkill.visible = true

            for (let id of treasureData.skillid) {
                let comp = <ITreasureSkillDescSkin><any>(new eui.Component)
                comp.skinName = "TreasureSkillDescSkin"
                // comp.lbSkillName.text = SkillsConfig.GetSkillName(id)
                // comp.lbSkillDes.text = PetConst.GetSkillDesc(id)
                let type=SkillsConfig.GetSkillQuality(id);
                let tabelColor=ItemBase.QUALITY_TIP_COLOR[type];
                if(type=="") 
                    tabelColor=ItemBase.QUALITY_TIP_COLOR[0];
                let str=SkillsConfig.GetSkillName(id);
                let str2=PetConst.GetSkillDesc(id)
                comp.lbSkillName.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + str + "</a>");
                comp.lbSkillDes.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + str2 + "</a>");


                this.gSkill.addChild(comp)
                
            }
            // this.lbSkillName.text = SkillsConfig.GetSkillName(itemConfig.skillid)//名称
            // this.lbSkillDes.text = PetConst.GetSkillDesc(itemConfig.skillid)

        }
    }


}

interface ITreasureSkillDescSkin extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // TreasureSkillDescSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    gSkill: eui.Group;
    lbSkillName: eui.Label;
    lbSkillDes: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

}

TreasureArrInfo.LAYER_LEVEL = LayerManager.UI_Popup;