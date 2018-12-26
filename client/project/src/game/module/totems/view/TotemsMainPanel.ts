/**
 * 图腾
 */
class TotemsMainPanel extends BaseView implements ICommonWindowTitle
{
	//SkinName
	//TotemsMainSkin

	public static NAME = "图腾"

	private itemCount=8;//図騰個數
	//图腾总战力
	private powerLabel:eui.Label;
	//已激活
	private activationLabel:eui.Label;
	//战斗力
	private totalPower:PowerLabel;
	//LvGroup
	private LvGroup:eui.Group;
	//未激活Img
	private noImg:eui.Image;
	//Lv
	private LvLabel:eui.Label;
	//怪物Logo
	private totemsImg:eui.Image;
	//怪物名字
	private nameLabel:eui.Label;
	//怪物Group
	private totemsGroup:eui.Group;
	//突破/进阶模块
	private totemsActivation:TotemsActivationModelPanel;
	//进度条模块
	private totemsMain:TotemsMainModelPanel;
	//查看
	private checkAttr:eui.Button;
	//已满级 Label
	private LvMaxLabel:eui.Label;

	private totemsActTab:any;//图腾激活表
	private totemsAttrsTab:any;//图腾升级表
	private power=0;//戰鬥力
	private IDArr=[];
	// private tabNameArr=[];
	// private tabImgArr=[];
	public constructor()
    {
        super()
        this.skinName = "TotemsMainSkin";
    }
	
	public UpdateContent()
	{

	}

	public childrenCreated():void
	{
		this.totemsActTab=GameGlobal.Config.TotemsActConfig;
		this.totemsAttrsTab=GameGlobal.Config.TotemsAttrsConfig;
		//let configArr = [1001, 1002, 1008]
		this.observe(MessageDef.TOTEMS_UPDATEACTIVATION, this.updateUpLvMes)
		this.IDArr=GameGlobal.TotemsModel.tabIDArr();
		this.totemsMain.bar.slideDuration=0;
	}

	public OnOpen():void
	{
		this.itemCount=this.totemsGroup.numChildren;
		this.showImg();
		for(let i=0;i<this.itemCount;i++)
		{
			this._AddClick(this.totemsGroup.getChildAt(i),this.onClick);
		}
		this._AddClick(this.checkAttr,this.onClick);
	}
	//private clickIndex=0;
	//點擊事件
	private onClick(e:egret.TouchEvent):void
	{
		switch (e.currentTarget) 
		{
			case this.totemsGroup.getChildAt(0):
				GameGlobal.TotemsModel.clickIndex=0;
				this.updateOther(0);
				break;
			case this.totemsGroup.getChildAt(1):
				GameGlobal.TotemsModel.clickIndex=1;
				this.updateOther(1);
				break;
			case this.totemsGroup.getChildAt(2):
				GameGlobal.TotemsModel.clickIndex=2;
				this.updateOther(2);
				break;
			case this.totemsGroup.getChildAt(3):
				GameGlobal.TotemsModel.clickIndex=3;
				this.updateOther(3);
				break;
			case this.totemsGroup.getChildAt(4):
				GameGlobal.TotemsModel.clickIndex=4;
				this.updateOther(4);
				break;
			case this.totemsGroup.getChildAt(5):
				GameGlobal.TotemsModel.clickIndex=5;
				this.updateOther(5);
				break;
			case this.totemsGroup.getChildAt(6):
				GameGlobal.TotemsModel.clickIndex=6;
				this.updateOther(6);
				break;
			case this.totemsGroup.getChildAt(7):
				GameGlobal.TotemsModel.clickIndex=7;
				this.updateOther(7);
				break;
			case this.checkAttr:
				ViewManager.ins().open(TotemsInfoPanel,this.IDArr[GameGlobal.TotemsModel.clickIndex],this.power);
				break;
		}
	}


	private showImg():void
	{
		
		let defaultID=0; 
		let index=0;
		// this.IDArr=[];
		//let globalIndex=0;

		for(let key in this.totemsActTab)
		{
			let row=this.totemsActTab[key];
			// this.tabNameArr.push(row.name);
			// this.tabImgArr.push(row.pic);
			// this.IDArr.push(row.id);
			if(index<this.itemCount)
			{
				if(GameGlobal.TotemsModel.totemsDic[key]!=undefined)
				{
					if(defaultID==0)
						defaultID=index;
					// let lv=GameGlobal.TotemsModel.totemsDic[key].lv;
					// let breachID=GameGlobal.TotemsModel.totemsDic[key].breach;
					// if(breachID!=0)//需要突破
					// {
					// 	if(this.totemsAttrsTab[key][breachID].tpcost!=undefined)
					// 	{
					// 		if(Checker.Data(this.totemsAttrsTab[key][breachID].tpcost[0],false)==true)
					// 			this.updateRedItemGlobal(index,true);
					// 	}
					// }
					// else
					// {
					// 	this.updateRedItemGlobal(index,false);
					// }
				}
				// else
				// {
				// 	let item=this.totemsActTab[key].cost[0];
				// 		if(Checker.Data(item,false)==true)
				// 			this.updateRedItemGlobal(index,true);
				// 		else
				// 			this.updateRedItemGlobal(index,false);
				// }
				this.isShowIconSign(index);
				index++;
			}
		}
		GameGlobal.TotemsModel.clickIndex=defaultID;
		this.updateOther(defaultID);
	
		(this.totemsGroup.getChildAt(defaultID) as TotemsItemCom ).img_select.visible=true;
		this.activationLabel.text=this.totemsDicCount().toString();
		// this.totemsActivation.updateModelShow();
		this.updateRedPoint();
	}
	private updateUpLvMes()
	{
		this.updateOther(GameGlobal.TotemsModel.clickIndex);
	}
	private updateOther(index)
	{
		this.updateRedPoint();
		this.updatePower(index);
		this.updateTotemsName(index);
		this.updateTotemsActivation(index);
		this.isShowIconSign(index);
		this.updateTotemsLogo(index);
		this.updateSelectImg(index);
		this.updateModelView(index);
		//GameGlobal.TotemsModel.isNotUp=false;
		let lv=0;
		let tabLength=this.totemsAttrsTab[this.IDArr[index]].length;
		if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]]!=undefined)
			lv=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
		if(lv<tabLength)
		{
			this.totemsActivation.updateModelShow();
			this.totemsMain.updateModelShow();
		}
		this.activationLabel.text=this.totemsDicCount().toString();
		

		// if(GameGlobal.TotemsModel.isNotUp)
		// {	
		// 	this.updateRedItemGlobal(index,true);
		// 	//GameGlobal.TotemsModel.isNotUp=false
		// }
		// else
		// 	this.updateRedItemGlobal(index,false);
	}

	private updateSelectImg(index)
	{
		for(let i=0;i<this.itemCount;i++)
		{
			(this.totemsGroup.getChildAt(i) as TotemsItemCom ).img_select.visible=false;
		}
		(this.totemsGroup.getChildAt(index) as TotemsItemCom ).img_select.visible=true;
	}

	private updateRedPoint():void
	{
		let dic=GameGlobal.TotemsModel.mRedPoint.mRedPointMap;
		for(let key in dic)
		{
			let index=GameGlobal.TotemsModel.DicIndex(key,this.IDArr);
			this.updateRedItemGlobal(index,dic[key]);
		}
	}
	//更新紅點
	private updateRedItemGlobal(index,bool=false):void
	{
		(this.totemsGroup.getChildAt(index) as TotemsItemCom ).redPoint.visible=bool;
	}
	//设置是否变灰
	private isShowIconSign(index):void
	{
		let row=this.totemsActTab[this.IDArr[index]];
		if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]]!=undefined)
			(this.totemsGroup.getChildAt(index) as TotemsItemCom).img_icon.source=row.icon; //_s
		else
			(this.totemsGroup.getChildAt(index) as TotemsItemCom).img_icon.source=row.icon+"_s"; //_s
	
	}
	//設置標題
	private updateTotemsName(index)
	{
		this.nameLabel.text=this.totemsActTab[this.IDArr[index]].name;
	}
	//設置是否激活図標
	private updateTotemsActivation(index)
	{
		if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]]!=undefined) //已經激活
		{
			this.noImg.visible=false;
			this.LvGroup.visible=true;
			// ItemConfig.CalcAttrScoreValue()
			// this.totalPower.text=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
			let lv=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
			let breach=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach;
			if(breach==0)
				this.LvLabel.text=lv+"级";
			else
			{
				this.LvLabel.text=breach+"级";
			}

		}
		else
		{
			this.LvGroup.visible=false;
			this.noImg.visible=true;
		}
	}
	//战斗力
	private updatePower(index):void
	{
		let power=this.calculationPower(index);
		this.power=power;
		this.totalPower.text=power.toString();
		let powerAll=0;
		for(let i=0;i<this.IDArr.length;i++)
		{
			if(GameGlobal.TotemsModel.totemsDic[this.IDArr[i]]!=undefined)
			{
				powerAll+=this.calculationPower(i,false);
			}
		}
		this.powerLabel.text=powerAll.toString();
	}


	//計算戰鬥力
	private calculationPower(index,bool=true):number
	{
		let power=0;
		let attr;
		let attrpower;
		if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]]!=undefined)
		{
			let breach=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach;
			let lv=0;
			if(breach==0)
				lv=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
			else
				lv=breach;
			if(this.totemsAttrsTab[this.IDArr[index]][lv-1]!=undefined)
			{	
				attr=this.totemsAttrsTab[this.IDArr[index]][lv-1].attr;
				attrpower=this.totemsAttrsTab[this.IDArr[index]][lv-1].attrpower;
			}
		}
		else
		{
			if(bool==true)
			{
				attr=this.totemsAttrsTab[this.IDArr[index]][0].attr;
				attrpower=this.totemsAttrsTab[this.IDArr[index]][0].attrpower;
			}
		}
		if(attr!=undefined)
			power+=ItemConfig.CalcAttrScoreValue(attr);
		if(attrpower!=undefined)
			power+=ItemConfig.CalcAttrScoreValue(attrpower);

		return power;
	}

	//設置怪物Logo
	private updateTotemsLogo(index):void
	{

		this.totemsImg.source=this.totemsActTab[this.IDArr[index]].pic;
	}
	//切換模塊Panel
	private updateModelView(index):void
	{
		this.LvMaxLabel.visible=false;
		if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]]!=undefined) //已經激活
		{
			
			let lv=GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].lv;
			let tabLength=this.totemsAttrsTab[this.IDArr[index]].length;
			// let tpcost=this.totemsAttrsTab[this.IDArr[index]][lv-1].tpcost; 
			if(lv<tabLength)
			{
				if(GameGlobal.TotemsModel.totemsDic[this.IDArr[index]].breach!=0)//需要突破
				{
					this.totemsMain.visible=false;
					this.totemsActivation.visible=true;
				}
				else//繼續升級
				{
					this.totemsMain.visible=true;
					this.totemsActivation.visible=false;
				}
			}
			else//滿級
			{
				this.totemsMain.visible=false;
				this.totemsActivation.visible=false;
				this.LvMaxLabel.visible=true;
			}
		}
		else
		{
			this.totemsMain.visible=false;
			this.totemsActivation.visible=true;
		}
	}
	//激活個數
	private totemsDicCount():number
	{
		let number=0;
		for(let key in GameGlobal.TotemsModel.totemsDic)
		{
			if(GameGlobal.TotemsModel.totemsDic[key]!=undefined)
				number+=1;
		}
		return number;
	}

	// public static RedPointCheck(): boolean 
	// {
	// 	return GameGlobal.TotemsModel.mRedPoint.Get(TotemsModelRedPoint.TOTEMS_ACTIVATION);
    // }
	
}

class TotemsItemCom extends eui.Component
{
	//SkinName
	//TotemsItemComSkin

	//选中边框
	public img_select:eui.Image;
	//LogoImg
	public img_icon:eui.Image;
	//紅點
	public redPoint:eui.Image;

	public childrenCreated()
    {
		this.img_select.visible=false;
	}

	
}