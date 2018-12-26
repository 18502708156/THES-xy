/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 升级/打造详情
 * 
 **/

class TreasureUpLvPanel extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // TreasureUpPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected roleShowPanel: RoleShowPanel;
    protected pDress1: TreasureHaveIcon;
    protected pDress2: TreasureHaveIcon;
    protected pDress3: TreasureHaveIcon;
    protected pDress4: TreasureHaveIcon;
    protected gpUp: eui.Group;
    protected pArrInfo0: eui.Component;
    protected pArrInfo1: eui.Component;
    protected btnDress: eui.Button;
    protected consumeLabel: ConsumeLabel;
    protected checkBox: eui.CheckBox;
    protected gpHave: eui.Group;
    protected lbAccount: eui.Label;
    protected listView: eui.List;
    /////////////////////////////////////////////////////////////////////////////


	// imgResoure: eui.Image;


	tPanelData: TreasureData[] = [];//界面总体数据数据(装备)
	tHaveData = [];//拥有而为装备的法宝



    private nType = 0;// 0为主界面 1为升级界面

	private tDress = []//装备列表

	private nSelect = 0//选择位置

	private tArrInfo: TreasureUpArr[] = []//属性列表

    
	/////////////////////////////////////////////////////////////////////////////


    private mRoleSendCheckData: RoleSendCheckData

    public constructor() {
        super()

		this.skinName = "TreasureUpPanelSkin"
		this.roleShowPanel.mShowTianx = false
        this.listView.itemRenderer = TreasureHoldIcon;

        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            GameGlobal.TreasureModel.sendSpellsResUpLv(this.nSelect +1,type) //位置是从1开始,所以需要加1
        }, () => {
			var config = this.tPanelData[this.nSelect]
            if (config&&config.cost) {
                let cost = config.cost
                return [3,0,cost.id, cost.count] //因为不消耗钱币,所以,第一二个参数都是模拟为了可以继续进行自动购买
            }
            return null
        }, () => {
            return this.checkBox.selected
        })
    }

	public childrenCreated() {

		for (let i = 1; i <= 4; i++) {
            let item = this["pDress" + i]
			this.tDress[i] = item
			item.initPos(i-1)
        }

		this._AddClick(this.tDress[1], this.onClick1)
		this._AddClick(this.tDress[2], this.onClick2)
		this._AddClick(this.tDress[3], this.onClick3)
		this._AddClick(this.tDress[4], this.onClick4);


		(this.pArrInfo1 as any).lbTitle.text = "下级属性"
		//属性信息列表
		for (let i = 0; i <= 1; i++) {
            let item = this["pArrInfo" + i]
            this.tArrInfo[i] = item
        }
		

    }

	public upList()
	{
		this.setData();
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tHaveData);
	}


	public UpdateContent()
	{
		this.setData()

		this.listView.dataProvider = new eui.ArrayCollection(this.tHaveData)

		for (let i = 1; i <= 4; i++) {
			if(this.tPanelData[i-1])
			{
				this.tDress[i].setData(this.tPanelData[i-1],this.nSelect)
			}
			else
			{
				this.tDress[i].setData(null,this.nSelect)
			}
        }

		this.upDateShowRect()

		this.updateTotalPower()

		//更新属性内容
		if(this.nType ==1) //升级界面才有
		{
			//属性内容
			for (const item in this.tArrInfo) {
				this.upDateArrInfo(this.tArrInfo[item],parseInt(item))
			}
		}

		//更新购买消耗提示
		this.upDateBuyInfo()

	}


	private upDateBuyInfo()
	{
		let pArr =  this.tPanelData[this.nSelect]
		if(pArr && pArr.cost&&pArr.cost.type) //如果是物品
		{
			let config = GameGlobal.Config.ItemConfig[pArr.cost.id]
			// this.imgResoure.source = RewardData.GetCurrencyMiniRes(pArr.cost.id)
			// this.lbHave.textFlow = ConsumeLabel.GetValueColor(GameGlobal.UserBag.GetCount(pArr.cost.id), pArr.cost.count)
			this.consumeLabel.mIsImg = true
			this.consumeLabel.consumeItemId = pArr.cost.id
			this.consumeLabel.curValue = GameGlobal.UserBag.GetCount(pArr.cost.id)
			this.consumeLabel.consumeValue = pArr.cost.count
			// this.priceIcon.price = 
		}
	}



    /**
     * 显示总战力
     */
    private updateTotalPower() {
        let powerAttrs = [];
        for (let pos in this.tPanelData) {
            let data = this.tPanelData[pos];
            if (data&&data.attrs) {
                for (let i = 0; i < data.attrs.length; i++) {
					let attr = new AttributeData;
					attr.type = data.attrs[i].type;
					attr.value = data.attrs[i].value;
					powerAttrs.push(attr);
                }
            }
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(powerAttrs);
    }

	//刷新属性内容
	private upDateArrInfo(_item,_index)
	{

		var pArr =  this.tPanelData[this.nSelect]
		if(!pArr) return;


		//属性文本内容
		var tcurAttrTxts = []
		tcurAttrTxts.push(_item.lbArr0)
		tcurAttrTxts.push(_item.lbArr1)
		tcurAttrTxts.push(_item.lbArr2)

		for (const item in tcurAttrTxts) {
			tcurAttrTxts[item].text  = ""
		}

		var strSkill = ""
		var strExArr = ""
		var tabelColor=ItemBase.QUALITY_TIP_COLOR[0];
		var tArr;

		if(_index === 0)
		{

			tArr =  pArr.attrs

			let skillId = pArr.skillid ? (pArr.skillid[0] || 0) : 0
			//如果没有技能的话技能不需要显示
			if(skillId)
			{
				strSkill =  PetConst.GetSkillName(skillId)  +": " +  PetConst.GetSkillDesc(skillId)
				let type=SkillsConfig.GetSkillQuality(skillId);
                tabelColor=ItemBase.QUALITY_TIP_COLOR[type];
			}

			 strExArr = "基础属性加成" + pArr.attrstips + "%"
		}
		else
		{

			if(pArr && pArr.id &&pArr.level )
			{
				var pSpellsLv =  GlobalConfig.ins().SpellsResLvproConfig[pArr.id][pArr.level+1] //下一级属性
				if(pSpellsLv)
				{	
					tArr =  pSpellsLv.attrs

					let skillId = pArr.skillid ? (pArr.skillid[0] || 0) : 0
					if(skillId)
					{
						strSkill =  PetConst.GetSkillName(skillId)  +": " +  PetConst.GetSkillDesc(skillId)
						let type=SkillsConfig.GetSkillQuality(skillId);
                		tabelColor=ItemBase.QUALITY_TIP_COLOR[type];
					}
					//如果没有技能的话技能不需要显示
					// if(pSpellsLv.skillid)
					// {
					// 	strSkill =  PetConst.GetSkillName(pSpellsLv.skillid)  +": " +  PetConst.GetSkillDesc(pSpellsLv.skillid)
					// }

					 strExArr = "基础属性加成" + pSpellsLv.attrstips + "%"
					
				}

				
			}
		}


		if(tArr)
		{
			for (const item in tArr) {
				let data = tArr[item]
				let attrData: AttributeData;
				attrData = new AttributeData;
				attrData.type = data.type;
				attrData.value = data.value;
				tcurAttrTxts[item].text = AttributeData.getAttStr(attrData, 0);
			}
		}

		//_item.lbSkillInfo.text = strSkill; //技能
		_item.lbSkillInfo.text = ""; //临时处理
		//_item.lbSkillInfo.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + strSkill + "</a>");
		_item.lbBaseAtt.text = strExArr; //增加属性值
		//_item.lbBaseAtt.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + strExArr + "</a>");
		


	}


    //点击选择框改变内容
	public chage()
	{

	}

	//自动购买的内容
    private _DoUpdateExp() {
    }

    private SendUp() {
        return this.mRoleSendCheckData.SendUp()
    }



	public setData()
	{
		this.tPanelData = GameGlobal.TreasureModel.getUseList()
		var tGetList =  this.deepCopy(GameGlobal.TreasureModel.getHaveList()) 
		this.tHaveData = []

		for (const item in tGetList) { //需要深度拷贝一下,不然数据会修改原来的数据
			var pObj = tGetList[item]
			pObj.nPos = this.nSelect +1  //告诉界面,当前选择位置(后端位置需要从1开始)
			this.tHaveData.push(pObj)			
		}

		

	}




	//实现深拷贝
	public deepCopy( target ){
		if(typeof target !== 'object') return ;
		//判断目标类型，来创建返回值
		var newObj = target instanceof Array ? [] : {};
		
		for(var item in target){
		//只复制元素自身的属性，不复制原型链上的
			if(target.hasOwnProperty(item)){
			newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item] //判断属性值类型
				}
		}
		
		return newObj
	}
 


	private onClick1()
	{
		this.onClick(0)
	}
	private onClick2()
	{
		this.onClick(1)
	}
	private onClick3()
	{
		this.onClick(2)
	}
	private onClick4()
	{
		this.onClick(3)
	}

	private onClick(_nSl)
	{

		var nSl = _nSl
	
		if(this.nSelect === nSl)
		{
			//弹窗
			this.onEquip(nSl)
			this.upDateShowRect()
		}
		else{
			this.nSelect = nSl
			this.UpdateContent()
		}

	}

	//装备  _nSl 位置
	private onEquip(_nSl)
	{
		if(this.tPanelData[this.nSelect])//已开放
		{
			if(!this.tPanelData[this.nSelect].id)//还没有装备东西
			{
				//后端以1为开始的数组下标
				if(this.tHaveData[0]&&this.tHaveData[0].spellsId)
				{
					if(GameGlobal.TreasureModel.canEquip(this.tHaveData[0].type,_nSl))
					{
						GameGlobal.TreasureModel.sendSpellsResUse(_nSl+1,this.tHaveData[0].spellsId)
					}
					else
					{
						UserTips.ins().showTips("相同类型的法宝不能装备")
					}
					
				}
				
			}
			else //已装备东西
			{
				ViewManager.ins().open(TreasureArrInfo,this.tPanelData[this.nSelect],false,false,GameLogic.ins().actorModel.name)
			}
		}
	}

	private upDateShowRect()
	{
		if(this.nType ===1)
		{
			if(this.tPanelData[this.nSelect]&&this.tPanelData[this.nSelect].id)//有装备才显示
			{
				this.gpUp.visible = true
				this.gpHave.visible = false
			}
			else
			{
				this.gpUp.visible = false
				this.gpHave.visible = true
			}
		}

	}

	private onUpClick(e: egret.TouchEvent)
	{
		switch (e.target) {
				case this.btnDress:
					// if(this.checkBox.selected)
					// {
					// 	this.mRoleAutoSendData.Toggle()
					// }
					// else
					// {
					// 	this.SendUp()
					// }
					this.SendUp()
				break
			
		}
	}
	

    public setType(_type)
    {

		this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent)//法宝变化
		this.observe(MessageDef.TREASURE_LOCK, this.upList)//上锁变化
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)//物品变化的时候也刷新一下内容

		
		// this.observe(MessageDef.TREASURE_UPDATE_LV, this._DoUpdateExp)

		this._AddChange(this.checkBox,this.chage)
        this._AddClick(this.btnDress, this.onUpClick)



        this.nType = _type
		this.UpdateContent()

		if(this.nType == 0)
		{
			this.gpHave.visible = true
			this.gpUp.visible = false
		}
		else
		{
			this.gpHave.visible = false
			this.gpUp.visible = true
		}

		let roleData = SubRoles.ins().GetRoleData().GetSubRoleData()
		roleData.titleId = 0
		this.roleShowPanel.SetAll(roleData)
    }
}



//身上法宝列表icon
class TreasureHaveIcon extends BaseView {
  
    imgCover :eui.Image//覆盖为开启在状态
    imgLock :eui.Image//
    imgSelect :eui.Image
    
    lbLv: eui.Label;
    lbName: eui.Label;

	gpLv: eui.Group
    
    baseCricle: BaseCricleIcon;

	private data;

	private nPos = 0;//选择位置

	private nSelect = 0;

	private tLockLvList = [];//等级锁列表
	private tLockVipList = [];//Vip锁列表
	

    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "TreasureHoldIconSkin";

    	this.currentState = "dress"

    }

	//初始化位置
	initPos(_pos)
	{
		this.nPos = _pos

		var tLockLvList = GlobalConfig.ins().SpellsResBaseConfig.unlocklv
		for (const item in tLockLvList) {
			this.tLockLvList.push(item)
		}

 		var tLockVipList = GlobalConfig.ins().SpellsResBaseConfig.unlockvip
		 for (const item in tLockVipList) {
			 this.tLockVipList.push(item)
		 }
	}

	public setData(_data,_select)
	{
		this.data  = _data
		this.nSelect = _select

		this.dataChanged()
	}
    
    public dataChanged():void{


		if(this.nPos == this.nSelect)
		{
			this.imgSelect.visible = true
		}
		else
		{
			this.imgSelect.visible = false
		}


		if(this.data)
		{
			
			if(this.data.name)
			{
				this.imgCover.visible = false
				this.gpLv.visible = true
				this.baseCricle.visible = true

				//是否开放
				if(this.data.name)
				{
					this.lbName.text = this.data.name
				}

				if(this.data.quality)
				{
					this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality]
				}
				
				//圆形圆圈
				this.baseCricle.setData(this.data)

				//等级
				if(typeof(this.data.level) ==="number")
				{
					this.lbLv.text  = this.data.level
				}



			}
			else
			{
				this.lbName.text = ""
				this.gpLv.visible = false
				this.imgCover.visible = false
				this.baseCricle.visible = true
			}


		}
		else
		{
			if(this.tLockLvList[this.nPos]&&this.tLockVipList[this.nPos])
			{
				this.lbName.text = this.tLockLvList[this.nPos] + "级或v" +  this.tLockVipList[this.nPos]
			}
			this.gpLv.visible = false
			this.imgCover.visible = true

			this.lbName.textColor = Color.l_normal

			this.baseCricle.visible = false
		}








    }

    

}


//法宝主界面
class TreasureUpFirPanel extends TreasureUpLvPanel
{
	public static readonly NAME = "法宝";
	public OnOpen(...param: any[]) {
		this.setType(0)
	}

};


//法宝升级界面
class TreasureUpSecPanel extends TreasureUpLvPanel
{
	public static readonly NAME = "升级";
	public OnOpen(...param: any[]) {
		this.setType(1)
	}

	public static RedPointCheck(): boolean {
        return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_UP_TREASURE)
    }

};



//法宝属性界面
interface TreasureUpArr extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // TreasureArrRectInfo.exml
    /////////////////////////////////////////////////////////////////////////////


    lbBaseAtt: eui.Label;//增加属性值
    lbArr0: eui.Label;// 属性值
    lbArr1: eui.Label;//属性值
    lbArr2: eui.Label;//属性值
    lbSkillInfo: eui.Label;//技能

    
    /////////////////////////////////////////////////////////////////////////////
}
