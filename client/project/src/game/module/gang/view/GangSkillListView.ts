class GangSkillListView extends BaseView implements ICommonWindowTitle {

    public static NAME = "帮会技能";
	/////////////////////////////////////////////////////////////////////////////
    // GangSkillListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected powerLabel: PowerLabel;
    protected totalAttr0: eui.Label;
    protected totalAttr1: eui.Label;
    protected totalAttr2: eui.Label;
    protected totalAttr3: eui.Label;
    protected totalAttr4: eui.Label;
    protected totalAttr5: eui.Label;
    protected totalAttr6: eui.Label;
    protected totalAttr7: eui.Label;
    protected btnUp: eui.Button;
    protected g0: eui.Component;
    protected g1: eui.Component;
    protected g2: eui.Component;
    protected g3: eui.Component;
    protected g4: eui.Component;
    protected g5: eui.Component;
    protected g6: eui.Component;
    protected g7: eui.Component;
    protected curAttr_label: eui.Label;
    protected nextAttrs_label: eui.Label;
    protected curSkill_group: eui.Group;
    protected price:PriceIcon;
    protected nextImage:eui.Image;
    protected lvMax_label:eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    private mItems: RoleSkillItem[] = []
    private nSelectIndex: number = 0

    // posId 		0 : integer
	// level 		1 : integer
    private skillInfoData = [];
    private allPower = 0;
    AttrName = ["生命+0","攻击+0","防御+0","速度+0","暴击+0","抗暴+0","命中+0","闪避+0"];
    //tDanYaoImg = ["ui_gang_skill_1","ui_gang_skill_2","ui_gang_skill_3","ui_gang_skill_4","ui_gang_skill_5","ui_gang_skill_6","ui_gang_skill_7","ui_gang_skill_8"];

	public constructor() {
		super()
	}

	public childrenCreated() 
    {
        for (let i = 0; i <= 7; i++) 
        {
            let item = this["g" + i]
            item.currentState = "open"
            item.nameGroup.visible = false;
            this.mItems[i] = item
            this._AddClick(item, this._OnItemClick)
            var skill_data = {"posId":i,"level":0}
            this.skillInfoData.push(skill_data);
        }
	}

	public OnOpen(...param: any[]) 
    {
        this._AddClick(this.btnUp, this.onCkick);
        //this.observe(MessageDef.GANG_SKILL_UP, this.UpdateContent)
        this.observe(MessageDef.GANG_SKILL_UP,this.UpdateSkillInfo)
        this.observe(MessageDef.GUILD_CONTRIB_UPDATE,this.upDateInfo)
        this.observe(MessageDef.GANG_SKILL_LEARN_UP,this.UpdateLearnSkillInfo)
        
		//this.UpdateContent();
        GameGlobal.GangModel.sendGetSkillInfos();
	}
    private UpdateSkillInfo(infos)
    {
        if(infos != null){
            this.skillInfoData = infos;
        }
        this.nSelectIndex =  this.getNextUpSkillData();
        this.UpdateContent();
    }

    private UpdateLearnSkillInfo(infos)
    {
        if(infos != null){
            for(var i = 0;i < this.skillInfoData.length;i++)
            {
                if(this.skillInfoData[i].posId == infos.posId)
                {
                    this.skillInfoData[i].level = infos.level
                     break;
                }
            }
        }
        this.nSelectIndex =  this.getNextUpSkillData();
        this.UpdateContent();
    }

	private onCkick(e: egret.TouchEvent) 
    {
        var upDataPos = this.getNextUpSkillData();
        let lv = this.skillInfoData[upDataPos].level;
        var config = this.getNextNeedCostByPosAndLv(lv,this.nSelectIndex)
        if(config == null){
            return;
        }
        if(GameGlobal.actorModel.contrib >= config.cost.count){    
            GameGlobal.GangModel.sendLearnGangSkill()
        }else{
           	// UserWarn.ins().BuyGoodsWarn(config.icon)
           	UserWarn.ins().BuyGoodsWarn(config.cost.id)
        }
	}

    private getNextUpSkillData():number
    {
        var nextPos = 0;
        var lv = 1000;
        for(var i = 0;i < this.skillInfoData.length;i++)
        {
            if(this.skillInfoData[i].level < lv)
            {
                lv = this.skillInfoData[i].level;
                nextPos = this.skillInfoData[i].posId;
            }
        }
        return nextPos;
    }
    private getNextNeedCostByPosAndLv(lv,pos,isNext = true)
    {
        if(isNext){
            lv = lv + 1;
        }
        let config = GameGlobal.Config.GuildCommonSkillConfig[lv];
        if(config == null){
            return null;
        }
        return config[pos]
    }

	public UpdateContent(): void 
    {
        var gangLevel = GameGlobal.GangModel.myGangInfo.mLevel;
        let config = GameGlobal.Config.GuildLevelConfig[gangLevel];
        this.lvMax_label.text = this.skillInfoData[0].level + "/" + config.skilllv;
        this.upDateInfo()
        this.allPower = 0;
        //总属性战力
		this.setAllSkillAttrs();
        //战力
        this.powerLabel.text = this.allPower;
	}

    upDateInfo()
    {
        let selectIndex = this.nSelectIndex
        for (let i = 0; i < this.mItems.length; i++) 
        {
            let item = this.mItems[i]
            item.img_select.visible = i == selectIndex
            this.UpdateItem(i)
        }
        var lv = this.skillInfoData[this.nSelectIndex].level;
        var curConfig = this.getNextNeedCostByPosAndLv(lv,this.nSelectIndex,false)
        var nextConfig = this.getNextNeedCostByPosAndLv(lv,this.nSelectIndex);
        this.nextImage.visible = true
        this.setCurSkllAttrs(curConfig);
        this.setNextSkllAttrs(nextConfig);
        if(nextConfig == null){   
            return
        }
        var cost = nextConfig.cost;
        this.price.setType(cost.id);
        this.price.setPrice(cost.count);
        this.price.setMyCount(GameGlobal.actorModel.contrib)
    }

    private getCurAllSkillLv()
    {
        var curLV = 0;
        for(var i = 0;i < this.skillInfoData.length;i++)
        {
            curLV += this.skillInfoData[i].level;
        }
        return curLV;   
    }


    UpdateItem(itemIndex: number) 
    {
        let item = this.mItems[itemIndex]
        if(itemIndex < 8)
        {
            item.img_icon.source = GangConst.GetSkillIcon(itemIndex)   
        }
        let strLv = this.skillInfoData[itemIndex].level
        item.lb_level.text = strLv
        item.lb_name.textColor = 0x682f00;
    }
   
    private _OnItemClick(e: egret.TouchEvent) 
    {
        // let index = this.mItems.indexOf(e.currentTarget)
        // this.nSelectIndex = index
        // this.upDateInfo()
        for(var i = 0;i < this.mItems.length;i++)
        {
            if(i == this.nSelectIndex){
                this.mItems[i].currentState = "down"
            }else{
                this.mItems[i].currentState = "up"
            }
        }
    }

	public OnClose() {
        GameGlobal.MessageCenter.removeAll(this);
        this.removeEvents();
	}
    //private isHadCur = false;
    private setCurSkllAttrs(config)
    {
        this.curAttr_label.text = "";
        if(config == null){
            this.nextImage.visible = false
            //this.isHadCur = false;
            return;
        }   
        //this.isHadCur = true;
        var attrs = config.attrpower;
        for(var i = 0;i < attrs.length;i++){
            this.curAttr_label.text += AttributeData.getAttStrByType(attrs[i], 0, "+", false, '#682f00');
            if(i % 2 != 0){
                this.curAttr_label.text += "\n";
            }else{
                this.curAttr_label.text += "         ";
            }
        }
    }

    private setNextSkllAttrs(config)
    {
        this.nextAttrs_label.text = "";
        if(config == null){
            this.nextImage.visible = false
            return;
        } 
        this.nextImage.visible = true
        var attrs = config.attrpower;
        for(var i = 0;i < attrs.length;i++){
            this.nextAttrs_label.text += AttributeData.getAttStrByType(attrs[i], 0, "+", false, '#682f00');
            if(i % 2 != 0){
                this.nextAttrs_label.text += "\n";
            }else{
                this.nextAttrs_label.text += "         ";
            }
            
        }
    }

    public setAllSkillAttrs()
    {
        var i = 0;
        let config
        var attrs:Object = new Object();
        
		for( i = 0;i < this.skillInfoData.length;i++)
        {
            let lv = this.skillInfoData[i].level;
            config = GameGlobal.Config.GuildCommonSkillConfig[lv];
            if(config == null){
                continue;
            }
            var _attrs = config[i].attrpower;
            this.allPower += ItemConfig.CalcAttrScoreValue(_attrs)
            for(var j = 0;j < _attrs.length;j++)
            {
                if(attrs[_attrs[j].type] == null)
                {
                    attrs[_attrs[j].type] = 0;
                }
                attrs[_attrs[j].type] += _attrs[j].value;
            }
        }
        for (let i = 0; i < 8; i++) 
        {   
            this['totalAttr' + i].text = this.AttrName[i];	
		}
        let index = 0;
        for (var key in attrs) {
            var attributeData = new AttributeData();
            attributeData.type = parseInt(key);
            attributeData.value = attrs[key];
			if (attributeData) {
				this['totalAttr' + index].text = AttributeData.getAttStrByType(attributeData, 0, "+", false, '#682f00');
			}
			else {
				this['totalAttr' + index].text = '';
			}
            index ++;
		}
        //return  attrs;
	}
}
