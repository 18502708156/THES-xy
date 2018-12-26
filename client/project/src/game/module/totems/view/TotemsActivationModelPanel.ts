/**
 * 图腾_激活/突破模块
 */
class TotemsActivationModelPanel extends BaseView 
{
	//SkinName
	//TotemsActivationModelSkin

	public static NAME = "图腾"

	//當前Lab_Group
	private currentGroup:eui.Group;
	//當前Label
	private currentLabel:eui.Label;
	//升級Lab_Group
	private upGroup:eui.Group;
	//upLabel
	private upLabel:eui.Label;
	//up等级提示
	private openlvLabel:eui.Label;
	//GoToVIP
	private gotoVipLabel: GainLabel
	//Btn
	private addFiftyBtn:eui.Button;
	//item
	private priceicon:PriceIcon;
	//itemName
	private itemName:eui.Label;
	//描述
	private describeLabel:eui.Label;

	private index=0;
	//図騰升級表
	private tabTotemsAttrsConfig;
	//図騰激活表
	private tabTotemsActConfig;

	private x1=192.5;
	private x2=345.5;
	private text="图腾激活条件";
	private text2="图腾突破条件";
	private btnText="激活";
	private btnText2="突破";
	public constructor()
    {
        super()
        this.skinName = "TotemsActivationModelSkin";
    }

	public childrenCreated() 
    {
		this.tabTotemsActConfig=GameGlobal.Config.TotemsActConfig;
		this.tabTotemsAttrsConfig=GameGlobal.Config.TotemsAttrsConfig;
		// this.index=GameGlobal.TotemsModel.clickIndex;

		this._AddClick(this.addFiftyBtn,this.onClick);
	}
	private onClick(e:egret.TouchEvent):void
	{
		switch (e.currentTarget) 
		{
			case this.addFiftyBtn:
				let IDArr=GameGlobal.TotemsModel.tabIDArr();
				if(this.addFiftyBtn.label==this.btnText)
				{
					let cost=this.tabTotemsActConfig[IDArr[this.index]].cost[0];
					if(Checker.CheckItem(cost.id,cost.count,false)==true)
					{
						GameGlobal.TotemsModel.activationTotems(IDArr[this.index]);
					}
				}
				else if(this.addFiftyBtn.label==this.btnText2)
				{
					let totemsDic=GameGlobal.TotemsModel.totemsDic;
					let id=totemsDic[IDArr[this.index]].id;
					//let lv=totemsDic[IDArr[this.index]].lv;
					let lv=totemsDic[IDArr[this.index]].breach;
					if(lv<=this.tabTotemsAttrsConfig[id].length)
					{
						let tpcost=this.tabTotemsAttrsConfig[id][lv].tpcost;
						if(tpcost!=undefined)
						{
							if(Checker.CheckItem(tpcost[0].id,tpcost[0].count,false)==true)
							{
								GameGlobal.TotemsModel.breachTotems(IDArr[this.index]);
							}
						}
					}
				}
				break;
		}
	}

	public updateModelShow()
	{
		this.currentLabel.text="";
		this.index=GameGlobal.TotemsModel.clickIndex;
		let IDArr=GameGlobal.TotemsModel.tabIDArr();
		let totemsDic=GameGlobal.TotemsModel.totemsDic;
		if(totemsDic[IDArr[this.index]]!=undefined) ////已經激活
		{
			this.currentGroup.visible=true;
			this.upGroup.x=this.x2;
			this.ItemShow2(totemsDic);
			this.LabelShow2(totemsDic);
			this.describeLabel.text=this.text2;
			this.addFiftyBtn.label=this.btnText2;
		}
		else
		{
			this.currentLabel.text="";
			this.currentGroup.visible=false;
			this.upGroup.x=this.x1;
			this.LabelShow();
			this.ItemShow();
			this.LabelShow2(totemsDic);
			this.describeLabel.text=this.text;
			this.addFiftyBtn.label=this.btnText;
		}
	}

	private ItemShow()
	{
		// this.currentGroup.visible=false;
		// this.upGroup.x=this.x1;
		let IDArr=GameGlobal.TotemsModel.tabIDArr();
		let itemArr=this.tabTotemsActConfig[IDArr[this.index]].cost[0];
		//this.priceicon.type=itemArr.id;
		//this.priceicon.price=itemArr.count;

		this.priceicon.setPriceData(itemArr.id,itemArr.count);
		

		this.itemName.text=GameGlobal.Config.ItemConfig[itemArr.id].name;

		this.gotoVipLabel.SetId(itemArr.id)
	}
	private ItemShow2(totemsDic)
	{
		// this.currentGroup.visible=true;
		// this.upGroup.x=this.x2;
		let IDArr=GameGlobal.TotemsModel.tabIDArr();
		
		let id=totemsDic[IDArr[this.index]].id;
		let lv=totemsDic[IDArr[this.index]].lv;
		if(lv<=this.tabTotemsAttrsConfig[id].length)
		{
			let breachID=totemsDic[IDArr[this.index]].breach;
			let tpcost=this.tabTotemsAttrsConfig[id][breachID].tpcost;
			if(tpcost!=undefined)
			{
				// this.priceicon.type=tpcost[0].id;
				// this.priceicon.price=tpcost[0].count;
				this.priceicon.setPriceData(tpcost[0].id,tpcost[0].count);

				this.itemName.text=GameGlobal.Config.ItemConfig[tpcost[0].id].name;
			}
			else
			{
				let itemArr=this.tabTotemsAttrsConfig[IDArr[this.index]][lv].cost[0];
				this.itemName.text=GameGlobal.Config.ItemConfig[itemArr.id].name;
			}
		}
		// let itemArr=this.tabTotemsAttrsConfig[IDArr[this.index]][lv].cost[0];
		// this.itemName.text=GameGlobal.Config.ItemConfig[itemArr.id].name;
	}

	private LabelShow()
	{
		let IDArr=GameGlobal.TotemsModel.tabIDArr();
		let id=IDArr[this.index];
		let attrpower=this.tabTotemsAttrsConfig[id][0].attrpower;
		if(attrpower!=undefined)
		{
			let str2=AttributeData.TYPE_TO_NAME[attrpower[0].type];
			let str=AttributeData.getAttStrByType(attrpower[0]);
			if(str!="+undefined")
				this.currentLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>"+str+"</b>");
		}
	}

	private LabelShow2(totemsDic)
	{
		let IDArr=GameGlobal.TotemsModel.tabIDArr();
		if(totemsDic[IDArr[this.index]]!=undefined)//已激活
		{
			let id=totemsDic[IDArr[this.index]].id;
			let lv=0;
			let breach=totemsDic[IDArr[this.index]].breach;
			if(breach==0)
				lv=totemsDic[IDArr[this.index]].lv;
			else
				lv=breach;
			// this.currentGroup.visible=true;
			//this.upGroup.visible=true;
			// this.upGroup.x=this.x2;
			if(lv<=this.tabTotemsAttrsConfig[id].length)
			{
				let attrpower=this.tabTotemsAttrsConfig[id][lv-1].attrpower;
				if(attrpower!=undefined)
				{
					let str2=AttributeData.TYPE_TO_NAME[attrpower[0].type];
					let str=AttributeData.getAttStrByType(attrpower[0]);
					if(str!="+undefined")
						this.currentLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>"+str+"</b>");
				}
				let nextAttrpower;
				let labLV=0;
				for(let i=0;i<this.tabTotemsAttrsConfig[id].length;i++)
				{
					let attrpower2=this.tabTotemsAttrsConfig[id][i].attrpower;
					if(attrpower!=undefined)
					{
						if(attrpower2!=undefined)
						{
							if(attrpower[0].value!=attrpower2[0].value && attrpower[0].value<=attrpower2[0].value)
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
				// if(lv<this.tabTotemsAttrsConfig[id].length)
				// {	
				// 	let attrpowerUp=this.tabTotemsAttrsConfig[id][lv].attrpower;
				// 	if(attrpowerUp!=undefined)	
				// 	{
				// 		let str=AttributeData.getAttStrByType(attrpowerUp);
				// 		if(str!="+undefined")
				// 			this.upLabel.textFlow=str;
				// 	}
				// }
			}
		}
		else
		{
			let tab_Lv=0;
			let nextAttrpower;
			for(let i=0;i<this.tabTotemsAttrsConfig[IDArr[this.index]].length;i++)
			{
				let attrpower2=this.tabTotemsAttrsConfig[IDArr[this.index]][i].attrpower;
				if(attrpower2!=undefined)
				{
					
					tab_Lv=i;
					nextAttrpower=attrpower2;
					break;
				}
			}
			let str2=AttributeData.TYPE_TO_NAME[nextAttrpower[0].type];
			let str=AttributeData.getAttStrByType(nextAttrpower[0]);
			if(str!="+undefined")
			{
				this.upLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str2 + "</a><b color=0x00AD00>"+str+"</b>");
				this.openlvLabel.text="("+this.tabTotemsAttrsConfig[IDArr[this.index]][tab_Lv].level+"级激活)";
			}
		}
	}

	public UpdateContent() 
    {

    }
}