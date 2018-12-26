class KaiFuJiJiePanel extends BaseView
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected time_txt: eui.Label;
    protected lv_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    /////////////////////////////////////////////////////////////////////////////

    // 进阶类型
    public jijieType: number

	public constructor()
    {
        super()
        this.skinName = "KaiFuJiJieSkin";
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = KaiFuJiJieAwardItem;
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
        let config = GameGlobal.Config.ProgressCrazyRewardConfig;
        let arr = []
        let obj = config[type];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let cfgObj = obj[key];
                let o :any= {};
                o.type = type;
                o.cfg = cfgObj
                o.weight = cfgObj.index;
                let canGet = GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type) >= cfgObj.value
                if (canGet) { 
                    let getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetAdvancedReward(type,cfgObj.index);
                    if (getted) o.weight += 1000;
                    else o.weight -= 1000;
                } 
                arr.push(o); 
            }
        }
        return arr
    }
    
	public OnClose() 
	{
		TimerManager.ins().removeAll(this)
	}
    public UpdateContent() 
	{
		if (!this.visible) return;
        let type = this.jijieType
        let arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
		let stageStr = `|C:0x2dff42&T:${GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type)} 阶|`
        this.lv_txt.textFlow = TextFlowMaker.generateTextFlow("当前"+ActivityConst.JiJieTypeName(type)+"阶数：" + stageStr)
	}

    private _OnClick(e: egret.TouchEvent)
    {
        if (e.currentTarget == this.getwayLabel)
        {
            GameGlobal.ActivityKaiFuModel.OpenAdvancedPanel(this.jijieType);
        }    
    }
    
}

class KaiFuJiJieAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieAwardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    protected getted_img: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
    }
    public childrenCreated() 
    {
		this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
    }
    protected onClick(e:egret.TouchEvent): void
    {
        GameGlobal.ActivityKaiFuModel.Send_advanced_lv_reward(this.data.cfg.type, this.data.cfg.index)
    }

	dataChanged() {
		
        let type = this.data.type;
        if(type == null) return;
        let cfgObj = this.data.cfg
        let weight = this.data.weight;

        this.btn.visible = weight < 100;
        this.btn.enabled = (weight > 0 && weight < 100) ? false : true;
        UIHelper.ShowRedPoint(this.btn,weight < 0)  
        this.getted_img.visible = !this.btn.visible
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.reward);
        this.tipsTxt.text = ActivityConst.JiJieTypeName(type) + "达到"+ cfgObj.value +"阶"
	}

	
}