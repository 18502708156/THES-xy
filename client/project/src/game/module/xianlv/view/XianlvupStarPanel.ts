class XianlvupStarPanel extends XianlvBaseInfoPanel {

    public static NAME = "升星"
    mWindowHelpId?: number = 5
    /////////////////////////////////////////////////////////////////////////////
    // XianlvupStarSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnCulture: eui.Button;
    protected needItemView: NeedItemView;
    protected curSkill: eui.Component;
    protected nextSkill: eui.Component;
    protected curStarNum: eui.Label;
    protected nextStarNum: eui.Label;
    protected XianlvupAttr:XianlvupAttr
    /////////////////////////////////////////////////////////////////////////////

    private m_XianlvId: number

    public childrenCreated() {
        super.childrenCreated() 
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.curSkill, this._OnClick)
        this._AddClick(this.nextSkill, this._OnClick)
        this._AddClick(this.baseView.btnZZ, this._OnClick)
    }

    public OnOpen() {
        super.OnOpen()
        this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent)
    }

    public XianlvUpAttr() {
        let model = GameGlobal.XianlvModel
        let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
        let xianlvId = selectConfig.id
        let xianlvInfo = model.GetXianlvInfo(xianlvId)    
        let quality = GameGlobal.Config.partnerBiographyConfig[xianlvId].quality
        let Level = GameGlobal.Config.partnerLvproConfig[quality][xianlvInfo.mLevel]
        let Star = GameGlobal.Config.partnerAttrsConfig[xianlvId][xianlvInfo.mStar - 1]
        let NextStar = GameGlobal.Config.partnerAttrsConfig[xianlvId][xianlvInfo.mStar]
        let skill = GameGlobal.Config.SkillsConfig[Star.skillid]
        
        if(NextStar){
              let Nextskill = GameGlobal.Config.SkillsConfig[NextStar.skillid]
              let attr0 = Star.attrs //= this.XianlvupAttr.addAttrType(Star.attrs,Level.attrs)
              let attr1 = NextStar.attrs // this.XianlvupAttr.addAttrType(NextStar.attrs,Level.attrs)
              this.XianlvupAttr.setAttrNol(attr0,attr1)      
              this.XianlvupAttr.setStarNol(xianlvInfo.mStar,xianlvInfo.mStar + 1)    
              this.XianlvupAttr.setSkillNol([skill[7],skill[8],skill[9]],[Nextskill[7],Nextskill[8],Nextskill[9]])      
        }else{
              let attr0 = Star.attrs //this.XianlvupAttr.addAttrType(Star.attrs,Level.attrs)
              this.XianlvupAttr.setAttrFull(attr0)  
              this.XianlvupAttr.setStarFull(xianlvInfo.mStar)   
              this.XianlvupAttr.setSkillFull([skill[7],skill[8],skill[9]]) 
        }
    }

    public UpdateInfo(id: number) {
        super.UpdateInfo(id)
        this.m_XianlvId = id
        let model = GameGlobal.XianlvModel
        let info = GameGlobal.XianlvModel.GetXianlvInfo(id)
        if (info.mStar >= model.MAX_STAR) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        let config = GameGlobal.Config.partnerAttrsConfig[info.mXianlvId][info.mStar - 1]
        if (config) {
            this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count)
        }
        PetSkillIconItem.SetContent(this.curSkill as any, info.GetSkillId(), 0)
        let curStar = Math.max(info.mStar, 1)
        this.curStarNum.text = curStar.toString()
        PetSkillIconItem.SetContent(this.nextSkill as any, info.GetSkillId(1), 0)
        this.nextStarNum.text = (curStar+1).toString()
        this.XianlvUpAttr()
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this._Send()
            break
            case this.curSkill: {
                let info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId)
                ViewManager.ins().open(XianlvSkillTipPanel, info.GetSkillId(), info.GetSkillId(1), info.mStar)
            }
            break
            case this.nextSkill: {
                let info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId)
                ViewManager.ins().open(XianlvSkillTipPanel, info.GetSkillId(1), info.GetSkillId(2), info.mStar+1)
            }
            break
            case this.baseView.btnZZ:
                if (GameGlobal.XianlvModel.HasBattle(this.m_XianlvId)) {
                    GameGlobal.XianlvModel.SendUnBattle(this.m_XianlvId)
                } else {
                    ViewManager.ins().open(XianlvBattlePanel, this.m_XianlvId)
                }
            break
        }
    }

    private _Send() {
        let info = GameGlobal.XianlvModel.GetXianlvInfo(this.m_XianlvId)
        let config = GameGlobal.Config.partnerAttrsConfig[info.mXianlvId][info.mStar - 1]
        if (config) {
            if (Checker.CheckDatas(config.cost, false)) {
                GameGlobal.XianlvModel.SendUpStar(info.mXianlvId)
            }
        }
    }
    
    public static RedPointCheck(): boolean {
        return GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_STAR)
    }
}