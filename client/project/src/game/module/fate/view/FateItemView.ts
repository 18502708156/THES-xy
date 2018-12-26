/**
 * 系統預告_Com
 */
class FateItemView extends BaseView implements eui.UIComponent
{
    //skinName
    //FateItemViewSkin.exml

   //缺少Lab
    private deficiencyLabel:eui.Label;
    //目標地Lab
    private objectiveLabel:eui.Label;
    private fateModelItem:FateModelItemPanel;
    
    //功能预告表
	private funcNoticeConfigTab:any;
    private ID=0;
    private IDED=0;

    public static isShowEff=false; 
    // public static IDED2=0;

    public constructor() 
    {
		super();
    }

    public OnOpen() 
    {
        this.funcNoticeConfigTab=GameGlobal.Config.FuncNoticeConfig;
        this.IDED=this.obtainID();
        FateEff.IDED2=this.IDED;
        this.observe(MessageDef.GUANQIA_CHANGE,this.UpdateContent);
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateContent);
        this.UpdateContent();

    }
    
    public getTabID():number
    {
        return this.ID;
    }
    private obtainID():number
    {
        let ID=0;
        let userFb=GameGlobal.UserFb
		for(let key in this.funcNoticeConfigTab)
        {
            // if(this.funcNoticeConfigTab[key].showlevel==undefined)
            // {
                let num=this.funcNoticeConfigTab[key].openLv[1];  
                if(this.funcNoticeConfigTab[key].openLv[0]==1)
                {
                    if(this.funcNoticeConfigTab[key].showlevel!=undefined)
                    {
                        if(GameGlobal.actorModel.level<this.funcNoticeConfigTab[key].showlevel)
                            break;
                    }
                    if(userFb.guanqiaID<num)
                    {
                        ID=this.funcNoticeConfigTab[key].index;
                        break;
                    }
                }
                else if(this.funcNoticeConfigTab[key].openLv[0]==2)
                {
                    if(this.funcNoticeConfigTab[key].showlevel!=undefined)
                    {
                        if(GameGlobal.actorModel.level<this.funcNoticeConfigTab[key].showlevel)
                            break;
                    }
                    if(GameGlobal.actorModel.level<num)
                    {
                        ID=this.funcNoticeConfigTab[key].index;
                        break;
                    }
                }
                else if(this.funcNoticeConfigTab[key].openLv[0]==3)
                {
                    if(this.funcNoticeConfigTab[key].showlevel!=undefined)
                    {
                        if(GameGlobal.actorModel.level<this.funcNoticeConfigTab[key].showlevel)
                            break;
                    }
                    if(GameGlobal.UserTask.mainTaskData[0]!=undefined)
                    {
                        if(GameGlobal.UserTask.mainTaskData[0].id!=undefined)
                        {
                            let id=GameGlobal.UserTask.mainTaskData[0].id;
                            if(id!=undefined)
                            {
                                if(id<this.funcNoticeConfigTab[key].openLv[1])//任務未通过
                                {
                                    ID=this.funcNoticeConfigTab[key].index;
                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    ID=0;
                    break;
                }
            // }
        }
         return ID;
    }
    private openOtherView()
    {
        if(this.ID!=0)
        {
            if(this.ID!=this.IDED)
            {
                //---------------
                // this.IDED=6
                //-----------------------
                //Open
                if(this.IDED==0)this.IDED=this.ID;
                if(this.IDED>this.ID)this.IDED=this.ID;
                ViewManager.ins().open(FateFadeView,this.IDED);
                FateEff.IDED2=this.IDED;
                this.IDED=this.ID;
                FateEff.isShow=true;
                FateEff.isShow3=true;
                GameGlobal.MessageCenter.dispatch(MessageDef.SHOWFATEEFF);
            }
        }
    }

    public UpdateContent() 
    {

         this.deficiencyLabel.text="";
         this.objectiveLabel.text="";
         if(GameGlobal.actorModel.level>=80)
            this.openOtherView();
         this.ID=this.obtainID();
         //--------------
         //this.ID=6
         //-------------
         if(this.ID==0) 
         {
             this.visible = false
            //  GameGlobal.MessageCenter.dispatch(MessageDef.HIDE_FATEITEMVIEW);
             return
         }
         
         this.visible = true
         
         let arr=this.funcNoticeConfigTab[this.ID].openLv;
         let str=this.funcNoticeConfigTab[this.ID].des1;
         let str2=this.funcNoticeConfigTab[this.ID].des2;
         //this.objectiveLabel.text
         if(arr[0]==1)
         {
             
             let number=arr[1]//-GameGlobal.UserFb.guanqiaID;
             this.deficiencyLabel.text=str.replace("%s",number);
             this.objectiveLabel.text=str2.replace("%s",number);
         }
         else if(arr[0]==2)
         {
             let number=arr[1]//-GameGlobal.actorModel.level;
             this.deficiencyLabel.text=str.replace("%s",number);
             this.objectiveLabel.text=str2.replace("%s",number);
         }
         else if(arr[0]==3)
         {
             let number=0;
             if(GameGlobal.UserTask.mainTaskData!=undefined)
             {
                 if(GameGlobal.UserTask.mainTaskData[0]!=undefined)
                 {
                     if(GameGlobal.UserTask.mainTaskData[0].id!=undefined)
                        number=arr[1]//-GameGlobal.UserTask.mainTaskData[0].id;
                 }
             }
             this.deficiencyLabel.text=str.replace("%s",number);
             this.objectiveLabel.text=str2.replace("%s",number);
         }
        
        let modelType=this.funcNoticeConfigTab[this.ID].type;
        let pid=this.funcNoticeConfigTab[this.ID].pid;
        this.fateModelItem.typeView=0;
        if(pid!=undefined)
        {
           
            if(pid[1]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid[0],this.funcNoticeConfigTab[this.ID].pid[1]);
            else if(pid[0]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid[0]);
            else
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid);

        }
        if(GameGlobal.actorModel.level<80)
            this.openOtherView();
    }

  }

class FateModelItemPanel extends eui.Component
{
    //skinName
    //FateModelItemSkin

    //模型
    private extraPanel:RideShowPanel;
    private rideShowPanel:RideShowPanel; //寵物
    private roleShowPanel:RoleShowPanel;//翅膀
	private petShowPanel:PetShowPanel;//寵物
	private petShowPanel2:PetShowPanel;//特效
	private soulImg:eui.Image;//仙女靈氣
	private immortalPositionImg:eui.Image;//仙侶仙位
    private logoImg:eui.Image;
    public  typeView=0;//0小図标 1介面

    private otherComConcealment(Com?:any,Com2?:any):void
    {
        this.extraPanel.visible=false;
        this.logoImg.visible=false;
        this.rideShowPanel.visible=false;
        this.roleShowPanel.visible=false;
		this.petShowPanel.visible=false;
		this.petShowPanel2.visible=false;
		this.soulImg.visible=false;
		this.immortalPositionImg.visible=false;

        if(Com!=undefined)
            Com.visible=true;
        if(Com2!=undefined)
            Com2.visible=true;
    }

    public showModelType(modelType:number,modelId?:any,modelId2?:any):void
    {
        
            this.petShowPanel.skewY=180;
            this.petShowPanel2.skewY=180;
            this.rideShowPanel.skewY=180;
            this.roleShowPanel.skewY=180;

            this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
            this.petShowPanel2.scaleX = this.petShowPanel2.scaleY = 0.7;
        
         this.petShowPanel.x=94
         this.petShowPanel.y=152
         this.roleShowPanel.y=152;
         this.roleShowPanel.x=94;
        switch(modelType)
        {
            case FateShowModelType.LogoImg:
                this.otherComConcealment(this.logoImg);
                this.logoImg.source=modelId;
                break;
            case FateShowModelType.Role://角色 O
				this.otherComConcealment(this.roleShowPanel);
                this.roleShowPanel.mScale=0.8;
				this.roleShowPanel.SetAll(SubRoles.ins().GetRoleData()); 
                this.roleShowPanel.SetTianx("");
                this.roleShowPanel.SetTitle("");
                break;
            case FateShowModelType.Pet://寵物
                this.otherComConcealment(this.petShowPanel);
				this.petShowPanel.SetBodyId(modelId);
                break;
            case FateShowModelType.FairyTale://仙侶 0
                this.otherComConcealment(this.petShowPanel);
				this.petShowPanel.SetBodyId(modelId);
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                break;
            case FateShowModelType.FemaleDeva://玄女 0
                this.otherComConcealment(this.petShowPanel);
				this.petShowPanel.SetBodyId(modelId);
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                break;
            case FateShowModelType.GodOfHeaven://天神
                this.otherComConcealment(this.petShowPanel);
				this.petShowPanel.SetBodyId(modelId);
                break;
            case FateShowModelType.SpiritualChild://靈童
                this.otherComConcealment(this.petShowPanel);
				this.petShowPanel.SetBodyId(modelId);
                break;
            case FateShowModelType.Mounts://坐騎 0
                this.otherComConcealment(this.rideShowPanel);
				this.rideShowPanel.SetBodyId(modelId);
                break;
            case FateShowModelType.Wing://翅膀 0
                this.otherComConcealment(this.petShowPanel);
                this.petShowPanel.SetBody(RoleShowPanel.GetPath(modelId));//modelId.toString());
                this.petShowPanel.skewY=360;
                this.petShowPanel.y=240;
                this.petShowPanel.x=115;
                break;
            case FateShowModelType.TheFairy://守护 0
                this.otherComConcealment(this.roleShowPanel);
                this.roleShowPanel.mScale=0.8;
				//this.roleShowPanel.SetAll(SubRoles.ins().GetRoleData());
                this.roleShowPanel.SetTitle(""); 
                // this.roleShowPanel.SetTianxPow(0,0);
                this.roleShowPanel.y=212;
                this.roleShowPanel.x=24;

                this.roleShowPanel.ClearCache()
                this.roleShowPanel.SetTianx(RoleShowPanel.GetPath(modelId));
                TimerManager.ins().doNext(()=>{
                    this.roleShowPanel.SetTianxPos(-60,-120);
                }, this)
                
                break;
            case FateShowModelType.DivineTroops://神兵 0
                this.otherComConcealment(this.roleShowPanel);
				// this.petShowPanel.SetBodyId(modelId);
                this.roleShowPanel.mScale=0.8;
				this.roleShowPanel.SetAll(SubRoles.ins().GetRoleData()); 
                this.roleShowPanel.SetWeapon(RoleShowPanel.GetPath(modelId));
                this.roleShowPanel.SetTianx("");
                this.roleShowPanel.SetTitle("");
                break;
            case FateShowModelType.Fashion://時裝 0
                this.otherComConcealment(this.roleShowPanel);
                this.roleShowPanel.mScale=0.8;
                let showData = new RoleShowData
                showData.job = GameGlobal.actorModel.job
                showData.sex = GameGlobal.actorModel.sex
                showData.clothID = modelId;
                showData.rideId =SubRoles.ins().GetRoleData().GetRideId();
                this.roleShowPanel.SetAll(showData);//SubRoles.ins().GetRoleData()); 
				this.roleShowPanel.SetTianx("");
                this.roleShowPanel.SetTitle("");
                break;
            case FateShowModelType.Title://稱號 0
                this.otherComConcealment(this.immortalPositionImg);
                this.immortalPositionImg.source=modelId;
                this.immortalPositionImg.y=93;
                // if(this.typeView==1)
                // {
                //     this.immortalPositionImg.scaleX = this.immortalPositionImg.scaleY =1.5
                //     this.immortalPositionImg.y=43;
                // } 
                break;
            case FateShowModelType.PetPsyche://寵物通靈 0
                this.otherComConcealment(this.petShowPanel,this.petShowPanel2);
                this.petShowPanel.scaleX = this.petShowPanel.scaleY =0.5;
				this.petShowPanel.SetBodyId(modelId);
				this.petShowPanel2.SetBodyId(modelId2);
                // this.petShowPanel2.scaleX = this.petShowPanel2.scaleY = 0.7;
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                break;
            case FateShowModelType.PetAnimalSoul://寵物獸魂 0
                this.otherComConcealment(this.petShowPanel,this.petShowPanel2);
                this.petShowPanel.scaleX=this.petShowPanel.scaleY=1.3;
				this.petShowPanel.SetBodyId(modelId);
                this.petShowPanel2.SetBodyId(modelId2);
                this.petShowPanel.x=144
                this.petShowPanel.y=12
                // this.petShowPanel2.scaleX = this.petShowPanel2.scaleY = 0.7;
				// this.soulImg.source=modelId2;
                break;
            case FateShowModelType.FairyTaleNormalArray://仙侶法陣 0
                this.otherComConcealment(this.petShowPanel,this.petShowPanel2);
                this.petShowPanel.y=142;
				this.petShowPanel.SetBodyId(modelId);
				this.petShowPanel2.SetBodyId(modelId2);
                // this.petShowPanel2.scaleX = this.petShowPanel2.scaleY = 0.7;
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                break;
            case FateShowModelType.FairyTaleImmortalPosition://仙侶仙位 0
                this.otherComConcealment(this.petShowPanel,this.immortalPositionImg);
				this.petShowPanel.SetBodyId(modelId2);
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                this.immortalPositionImg.source=modelId;
                this.immortalPositionImg.y=-40;
                break;
            case FateShowModelType.FemaleDevaWeapons://玄女法器
                this.otherComConcealment();
                break;
            case FateShowModelType.FemaleDevaFlower://玄女花X  0
                this.otherComConcealment(this.petShowPanel,this.petShowPanel2);
				this.petShowPanel.SetBodyId(modelId);
                this.petShowPanel2.SetBodyId(modelId2);
                // this.petShowPanel2.scaleX = this.petShowPanel2.scaleY = 0.7;
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                break;
            case FateShowModelType.FemaleDevaO2://玄女靈氣 0
                this.otherComConcealment(this.petShowPanel,this.soulImg);
				this.petShowPanel.SetBodyId(modelId2);
                // this.petShowPanel.scaleX = this.petShowPanel.scaleY = 0.7;
                this.soulImg.height=35
                this.soulImg.width=90
                this.soulImg.x=35
                this.soulImg.y=-50
                //this.soulImg.scaleX=this.soulImg.scaleY=0.5;
                this.soulImg.source=modelId;
                break;
            case FateShowModelType.MagicProps://法寶
                this.otherComConcealment(this.soulImg);
                this.soulImg.height=90
                this.soulImg.width=90
                this.soulImg.x=20
                this.soulImg.y=20
                this.soulImg.source=modelId;
                break;
        }
    }


}
