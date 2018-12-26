
class KaiFuLeiJiReChargePanel extends BaseView
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuLeiJiReChargePanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected time_txt: eui.Label;
    protected lv_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected allReCharge_label:eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    // 进阶类型
    public jijieType: number

	public constructor()
    {
        super()
        this.skinName = "KaiFuLeiJiReChargePanelSkin";
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = KaiFuLeiJiReChargeItem;
    }
	public OnOpen()
    {
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent)
        this.AddClick(this.getwayLabel, this._OnClick);
        this.AddTimer(1000,0,this.updateTime)
        this.UpdateContent();
        this.updateTime();
    }
    private updateTime(): void
    {
        let time = KaiFuJiJieRankPanel.GetUpdateTime(this.jijieType)
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow(`活动倒计时：|C:0x2dff42&T:${time}|`);
    }
    private getReward(): any
    {
        let type = this.jijieType
        let config = GameGlobal.Config.ProgressCrazyRechargeConfig;
        let arr = []
        let obj = config[type];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let cfgObj = obj[key];
                let o :any= {};
                o.type = type;
                o.cfg = cfgObj
                o.weight = cfgObj.id;
                let canGet = GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue >= cfgObj.money
                let getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetChargeReward(cfgObj.id);
                if (canGet) { 
                    if (getted) o.weight += 1000;
                    else o.weight -= 1000;
                } else if(getted) {
                    o.weight += 1000;
                }
                arr.push(o); 
            }
        }
        return arr
    }
	public OnClose() 
	{
		
	}
    public UpdateContent() 
	{
		if (!this.visible) return;
        let type = this.jijieType
        let arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
		this.allReCharge_label.text = "累计充值：" + GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue + '元'
	}


    private _OnClick(e: egret.TouchEvent)
    {
        if (e.currentTarget == this.getwayLabel)
        {
            RechargeWin.Open();
            //GameGlobal.ActivityKaiFuModel.OpenAdvancedPanel();
        }    
    }
    
}

class KaiFuLeiJiReChargeItem extends KaiFuJiJieAwardItem {


	public constructor() {
		super()
    }
    protected onClick(e:egret.TouchEvent): void
    {
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.Send_advanced_charger_reward(this.data.cfg.id)
        } 
        
    }

	dataChanged() {
        super.dataChanged();
        let type = this.data.type;
        let cfgObj = this.data.cfg
        let weight = this.data.weight;
        
        this.tipsTxt.text = "累计充值" + cfgObj.money + "元"
        this.btn.visible = weight < 100;
        this.btn.label = (weight > 0 && weight < 100) ? "未达成" : "领 取";
        UIHelper.ShowRedPoint(this.btn,weight < 0)  
        this.getted_img.visible = !this.btn.visible
    }
    
}