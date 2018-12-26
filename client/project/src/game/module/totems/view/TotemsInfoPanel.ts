/**
 * 图腾_Info介面
 */
class TotemsInfoPanel extends BaseEuiView
{
	//SkinName
	//TotemsInfoSkin

	//bg
	private commonDialog:CommonDialog;
	//战斗力
	private totalPower:PowerLabel;
	//角色Img
	private totemsImg:eui.Image;
	//LvGroup
	private LvGroup:eui.Group;
	//LvLabel
	private LvLabel:eui.Label;
	//未激活Img
	private noImg:eui.Image;
	//角色Name
	private totemsName:eui.Label;
	//Label
	private label0:eui.Label;
	private label1:eui.Label;
	private label2:eui.Label;
	private power=0;
	private ID=0;
	//titleName
	private titleName="详细属性";

	public static LAYER_LEVEL = LayerManager.UI_Popup;
	public constructor()
    {
        super()
        this.skinName = "TotemsInfoSkin";
    }

	public childrenCreated() 
	{

	}

	public OnOpen(ID,power) 
	{
		this.ID=ID;
		this.power=power;
		this.commonDialog.title=this.titleName;
		this.commonDialog.OnAdded(this);
		this.powerShow();
		this.isShowLabel();
		this.labelInfoShow();
		this.nameShow();
		this.totemsImgShow();
	}
	private totemsImgShow():void
	{
		let Img=GameGlobal.Config.TotemsActConfig[this.ID].pic;
		this.totemsImg.source=Img;
	}

	private nameShow():void
	{
		let name=GameGlobal.Config.TotemsActConfig[this.ID].name;
		this.totemsName.text=name;
	}

	private powerShow():void
	{
		this.totalPower.text=this.power.toString();
	}

	

	private isShowLabel():void
	{
		if(GameGlobal.TotemsModel.totemsDic[this.ID]!=undefined)//已激活
		{
			this.LvGroup.visible=true;
			this.noImg.visible=false;
			let lv=GameGlobal.TotemsModel.totemsDic[this.ID].lv;
			this.LvLabel.text=lv+"级";
		}
		else
		{
			this.LvGroup.visible=false;
			this.noImg.visible=true;
		}
	}
	private labelInfoShow():void
	{
		let attr;
		if(GameGlobal.TotemsModel.totemsDic[this.ID]!=undefined)
		{
			let lv=GameGlobal.TotemsModel.totemsDic[this.ID].lv;
			attr=GameGlobal.Config.TotemsAttrsConfig[this.ID][lv].attr;
		}	
		else
			attr=GameGlobal.Config.TotemsAttrsConfig[this.ID][0].attr;
		let str="";
		let str2="";
		if(attr[0]!=undefined)
		{
			str=AttributeData.TYPE_TO_NAME[attr[0].type];
			str2=AttributeData.getAttStrByType(attr[0]);
			this.label0.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>"+str2+"</b>");
		}
		if(attr[1]!=undefined)
		{
		    str=AttributeData.TYPE_TO_NAME[attr[1].type];
			str2=AttributeData.getAttStrByType(attr[1]);
			this.label1.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>"+str2+"</b>");
		}
		if(attr[2]!=undefined)
		{
			str=AttributeData.TYPE_TO_NAME[attr[2].type];
			str2=AttributeData.getAttStrByType(attr[2]);
			this.label2.textFlow=(new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>"+str2+"</b>");

		}
	}
	
	public OnClose() 
	{
		this.commonDialog.OnRemoved()
	}
}