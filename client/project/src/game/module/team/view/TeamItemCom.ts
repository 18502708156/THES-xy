/**
 * 组队_ 选择关卡列表 Com
 */
class TeamItemCom extends eui.ItemRenderer
{
    //SkinName.
    //TeamItemComSkin

	//private imgChoose: eui.Image;//选中边框
	private title: eui.Label;//标题
	private extraPanel: PetShowPanel;//怪物模型
	//private clearanceImg: eui.Image;//通关Img
	private itemList: eui.List;//道具list

	private notAdoptLabel: eui.Label;//未通关Lab
	private recordLabel: eui.Label;//首通奖励Lab
	private m_Model: CrossTeamBaseModel

	public childrenCreated() 
	{
		
	}
	dataChanged() 
    {
		let data = this.data;
		if (data != undefined) 
		{
			
			// this.title.text = data.name;
			this.itemList.itemRenderer = ItemBase;
			this.m_Model=data.model;
			let index =data.index;
			this.itemList.dataProvider = new eui.ArrayCollection([]);
			let configList = this.m_Model.GetConfig();
			let configData2 = this.m_Model.GetConfigData(configList[index])
			if (!configData2) {
				return
			}
			this.notAdoptLabel.visible=false;
			this.recordLabel.visible=true;
			let bossId = configData2.GetBossId()
			this.extraPanel.SetBodyId(MonstersConfig.GetAppId(bossId));
			this.title.text = configData2.GetUititle();
			let notEnter = this.m_Model.IsNotEnter(configData2.GetKey())
			this.notAdoptLabel.text=notEnter;
			if(this.m_Model.IsFirst(configData2.GetKey()))//configData2.GetKey())) //首通獎勵
			{
				this.recordLabel.text = "首通奖励";
				this.itemList.dataProvider=new eui.ArrayCollection(configData2.GetFirstDropShow());
			}
			else
			{
				this.recordLabel.text = "通关奖励";
				this.itemList.dataProvider = new eui.ArrayCollection(configData2.GetDropShow());
			}
			if(this.notAdoptLabel.text!="")
			{
				this.notAdoptLabel.visible=true;
				this.recordLabel.visible=false;
			}
		}
		
	}
	protected IsNotEnter(id: number): string {
		// let config;
		// //if(id>999)
		// if(GameGlobal.Config.GuildFubenConfig[id]!=undefined)
		// {
		// 	config = GameGlobal.Config.GuildFubenConfig[id]
		// 	if (!config) {
		// 		return ""
		// 	}
		// 	if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
		// 		return "帮会等级"+"\n"+"达到" + config.needlv + "级开启"
		// 	}
		// }
		// else
		// {
		// 	let level=id;
		// 	config = GameGlobal.Config.CrossTeamFbConfig[level]
		// 	if (!config) {
		// 		return ""
		// 	}
		// 	if (GameGlobal.actorModel.level < config.level) {
		// 		return "等级达到"+"\n" + config.level + "级开启"
		// 	}
		// }
        return ""
	}
}