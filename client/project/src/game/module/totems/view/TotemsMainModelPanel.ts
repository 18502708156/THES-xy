/**
 * 图腾_进度条模块
 */
class TotemsMainModelPanel extends BaseView 
{
	//SkinName
	//TotemsMainModelSkin

	public static NAME = "图腾"

	//当前Label
	private currentLabel:eui.Label;
	//升级Label
	private upLabel:eui.Label;
	//到达等级开启
	private openlvLabel:eui.Label;
	//item
	private priceicon:PriceIcon;
	//consumeLabel
	private consumeLabel:ConsumeTwoLabel;
	//描述
	private describeLabel:eui.Label;
	//checkBox
	private checkBox:eui.CheckBox;
	//checkBool
	private checkBool=false;
	//addBtn
	private addBtn:eui.Button;
	private One=1;
	//addTenBtn
	private addTenBtn:eui.Button;
	private Ten=10;
	//addFiftyBtn
	private addFiftyBtn:eui.Button;
	private Fifty=50;
	//bar
	public bar:eui.ProgressBar;//TabBar;
	//item
	private cost;

	private index=0;
	//図騰升級表
	private tabTotemsAttrsConfig;
	//図騰激活表
	private tabTotemsActConfig;
	//図腾暴击设定表
	private tabTotemsBaoJiConfig;
	private IDArr=[];
	private totemsDic;

	public constructor()
    {
        super()
        this.skinName = "TotemsMainModelSkin";
    }

	public childrenCreated() 
    {
		this.tabTotemsActConfig=GameGlobal.Config.TotemsActConfig;
		this.tabTotemsAttrsConfig=GameGlobal.Config.TotemsAttrsConfig;
		this.tabTotemsBaoJiConfig=GameGlobal.Config.TotemsBaoJiConfig;
		this._AddClick(this.checkBox,this.onClick);
		this._AddClick(this.addBtn,this.onClick);
		this._AddClick(this.addTenBtn,this.onClick);
		this._AddClick(this.addFiftyBtn,this.onClick);
		
	
		
    }

	public updateModelShow()
	{
		this.index=GameGlobal.TotemsModel.clickIndex;
		this.IDArr=GameGlobal.TotemsModel.tabIDArr();
		this.totemsDic=GameGlobal.TotemsModel.totemsDic;
		this.updateLabel();
		this.updateBar();
		this.updaeConsume();
		this.updatePriceicon();
		this.updateDescribe();

	}
	private updateDescribe():void
	{
		this.describeLabel.text="";
		let ID=this.IDArr[this.index];
		if(this.totemsDic[ID]!=undefined)
		{
			let tabID=this.totemsDic[ID].todayId;
			let modelNum=this.totemsDic[ID].todayNum;
			if(this.tabTotemsBaoJiConfig[tabID]!=undefined)
			{
				let tabNum=this.tabTotemsBaoJiConfig[tabID].num;
				let tabRat=this.tabTotemsBaoJiConfig[tabID].rat;
				let needNum=tabNum-modelNum;
				if(needNum!=undefined&&tabRat!=undefined)
					this.describeLabel.text="再升级"+needNum+"次必定"+tabRat+"倍暴击,累计次数次日重置";
			}
		}
		
	}

	private updatePriceicon():void
	{
		let itemArr=this.tabTotemsActConfig[this.IDArr[this.index]].cost[0];
		this.priceicon.type=itemArr.id;
		this.priceicon.price=GameGlobal.UserBag.GetCount(itemArr.id);//GameGlobal.Config.ItemConfig[itemArr.id].count;
	}

	private updaeConsume():void
	{
		let ID=this.IDArr[this.index];
		if(this.totemsDic[ID]!=undefined)
		{
			let lv=this.totemsDic[ID].lv;
			if(lv<this.tabTotemsAttrsConfig[ID].length)
			{	
				this.cost=this.tabTotemsAttrsConfig[ID][lv].cost;
				this.consumeLabel.Set(this.cost);
			}
		}
	}
	private updateBar():void
	{
		if(this.totemsDic[this.IDArr[this.index]]!=undefined)
		{
			let ID=this.IDArr[this.index];
			let lv=this.totemsDic[ID].lv;
			//进度条
			// this.bar.value=this.totemsDic[ID].upNum;
			// this.bar.maximum=this.totemsDic[ID].upNum;
			if(lv<=this.tabTotemsAttrsConfig[ID].length)
			{	
				let exp=this.tabTotemsAttrsConfig[ID][lv].exp;
				this.bar.maximum=this.tabTotemsAttrsConfig[ID][lv-1].proexp;
				this.bar.value=this.totemsDic[ID].upNum*exp;
				//this.bar.maximum=this.tabTotemsAttrsConfig[ID][lv-1].proexp;
			}
			
		}
	}

	private updateLabel():void
	{
		this.currentLabel.text="";
		if(this.totemsDic[this.IDArr[this.index]]!=undefined)
		{
			let id=this.totemsDic[this.IDArr[this.index]].id;
			let breachID=this.totemsDic[this.IDArr[this.index]].breach;
			let lv=0;
			if(breachID==0)
				lv=this.totemsDic[this.IDArr[this.index]].lv;
			else
				lv=breachID;
			let attrpower;
			let nextAttrpower;
			let labLV=0;
			if(lv<=this.tabTotemsAttrsConfig[id].length)
			{
				attrpower=this.tabTotemsAttrsConfig[id][lv-1].attrpower;
				if(attrpower!=undefined)
				{
					let str2=AttributeData.TYPE_TO_NAME[attrpower[0].type];
					let str=AttributeData.getAttStrByType(attrpower[0]);
					if(str!="+undefined")
						this.currentLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>"+str+"</b>");
				}
				for(let i=0;i<this.tabTotemsAttrsConfig[id].length;i++)
				{
					let attrpower2=this.tabTotemsAttrsConfig[id][i].attrpower;
					if(attrpower!=undefined)
					{
						if(attrpower2!=undefined)
						{
							if(attrpower[0].value!=attrpower2[0].value&& attrpower[0].value<=attrpower2[0].value)
							{
								labLV=i;
								nextAttrpower=attrpower2;
								break;
							}
						}
					}
					else
					{
						if(attrpower2!=undefined)
						{
							nextAttrpower=attrpower2;
							labLV=i;
							break;
						}
					}
				}
				let str2=AttributeData.TYPE_TO_NAME[nextAttrpower[0].type];
				let str=AttributeData.getAttStrByType(nextAttrpower[0]);
				if(str!="+undefined")
				{
					this.upLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>"+str+"</b>");
					this.openlvLabel.text="("+this.tabTotemsAttrsConfig[id][labLV].level+"级激活)";
				}
			}
		}
	}

	private onClick(e:egret.TouchEvent):void
	{
		switch (e.currentTarget) 
		{
			case this.addBtn:
				if(Checker.CheckItem(this.cost[0].id,this.cost[0].count*this.One,this.checkBool)==true)
				{
					if(Checker.Money(this.cost[1].id,this.cost[1].count*this.One,true)==true)
					{
						GameGlobal.TotemsModel.upTotems(this.IDArr[this.index],this.One,this.checkBool);

					}
				}
				break;
			case this.addTenBtn:
				if(Checker.CheckItem(this.cost[0].id,this.cost[0].count*this.Ten,this.checkBool)==true)
					if(Checker.Money(this.cost[1].id,this.cost[1].count*this.Ten,true)==true)
						GameGlobal.TotemsModel.upTotems(this.IDArr[this.index],this.Ten,this.checkBool);
				break;
			case this.addFiftyBtn:
				if(Checker.CheckItem(this.cost[0].id,this.cost[0].count*this.Fifty,this.checkBool)==true)
					if(Checker.Money(this.cost[1].id,this.cost[1].count*this.Fifty,true)==true)
						GameGlobal.TotemsModel.upTotems(this.IDArr[this.index],this.Fifty,this.checkBool);
				break;
			case this.checkBox:
				this.checkBool=this.checkBox.selected;
				break;
		}
	}
	
	
	public UpdateContent() 
    {

    }
}