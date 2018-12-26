class RoleTemplatePanel extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // RoleTemplateSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected nameBg: eui.Image;
    protected imgXianw: eui.Image;
    protected petSoul: eui.Group;
    protected showPanel: PetShowPanel;
    protected extraPanel: PetShowPanel;
    protected ridePanel: RideShowPanel;
    protected roleShowPanel: RoleShowPanel;
    protected imgHuanHua: eui.Image;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected lbName: eui.Label;
    protected lbLev: eui.Label;
    protected addPowerGroup: eui.Group;
    protected lbAlert: eui.Label;
    protected title1Label: eui.Label;
    protected title2Label: eui.Label;
    protected lbFull: eui.Label;
    protected btnSkin: eui.Button;
    protected btnAttrDrug: eui.Button;
    protected btnUpLevel: eui.Button;
    protected btnPrev: eui.Button;
    protected btn_juexing: eui.Button;
    protected btnNext: eui.Button;
    protected btnNextIcon: eui.Image;
    protected btnHuanHua: eui.Button;
    protected btnPutOn: eui.Button;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected skill0: eui.Component;
    protected skill1: eui.Component;
    protected skill2: eui.Component;
    protected skill3: eui.Component;
    protected equip0: eui.Component;
    protected equip1: eui.Component;
    protected equip2: eui.Component;
    protected equip3: eui.Component;
    protected checkBox: eui.CheckBox;
    protected onekeyEquip: eui.Button;
    protected consumeLabel: ConsumeTwoLabel;
    protected jijie_link: GetwayLabel;

    /////////////////////////////////////////////////////////////////////////////

    protected mHasDress = false
    protected mModel: UserTemplate
    protected mModelRedPoint: UserTemplateRedPoint

    private mShowLevel: number = 0
    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

    private m_SkillIconList = []
    private mEquipItems: RideMiniItem[] = []
    private mSkillItems: RideMiniItem[] = []

    private mPlayEff: {[key: number]: boolean} = {}

    // public static RedPointCheck(): boolean {
    //     return GameGlobal.UserRide.mRedPoint.IsRedPoint()
    // }
    protected m_activityJiJieId
    public constructor() {
        super()
        this.skinName = "RoleTemplateSkin"
        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this.SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnAuto.label = "停止"
            } else {
                this.btnAuto.label = "自动进阶"
            }
        }, 200)
        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            if (this.mModel) {
                this.mModel.SendBoost(type)
            }
        }, () => {
            let model = this.mModel
            let levelConfig = this.mModel.LvproConfig[model.mLevel]
            if (!levelConfig) {
                return [null]
            }
            let cost = levelConfig.cost
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count]
        }, () => {
            return this.checkBox.selected
        }, () => {
            this.mRoleAutoSendData.Toggle()
        })
        this.title1Label.text = this.name + "技能"
        this.title2Label.text = this.name + "装备"
        this.lbFull.text = this.name + "已满阶"
    }

    public childrenCreated() {
        this._AddClick(this.btnPrev, this._OnClick)
        this._AddClick(this.btnNext, this._OnClick)
        this._AddClick(this.btnHuanHua, this._OnClick)
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
        this._AddClick(this.btnAttrDrug, this._OnClick)
        this._AddClick(this.btnUpLevel, this._OnClick)
        this._AddClick(this.powerLabel, this._OnClick)
        this._AddClick(this.btnSkin, this._OnClick)
        this._AddClick(this.onekeyEquip, this._OnClick)
        this._AddClick(this.btn_juexing, this._OnClick)
        // this.typeImg.source = RewardData.GetCurrencyMiniRes(this.mModel.uplvitemid)

        for (let i = 0; i < 4; i++) {
            let item = this["skill" + i] as RideMiniItem
            if (item) {
                item.touchEnabled = true
                item.touchChildren = false
                this.mSkillItems[i] = item;
                item.name = i + ""
                this._AddClick(item, this._OnSkillClick)
            }
        }

        for (let i = 0; i < 4; i++) {
            let item = this["equip" + i] as RideMiniItem
            if (item) {
                item.touchEnabled = true
                item.touchChildren = false
                this.mEquipItems[i] = item
                item.name = i + ""
                this._AddClick(item, this._OnEquipClick)
            }
        }

        this.btnSkin.visible = this.mHasDress

        this.SetEquipIconList(this.mModel.mEquipIcon)

        //直升一阶显示状态
        this.btnUpLevel.visible = this.mModel.IsShowShootUpDrugID()

        let skillId = this.mModel.BaseConfig.skilllist
        let skillConfig = this.mModel.SkillConfig
        let skillIcon = []
        for (let id of skillId) {
            skillIcon.push(skillConfig[id][0].skillitem);
        }
        this.SetSkillIconList(skillIcon);
    }



    protected SetSkillIconList(iconList) {
        this.m_SkillIconList = iconList
        for (let i = 0; i < iconList.length; i++) {
            let item = this.mSkillItems[i]
            if (item) {
                item.item.setItemImg(iconList[i])
                let isOpen = this.mModel.IsOpen(i)
                item.item.setItemImgGray(isOpen ? false : true)
                let curSkillLv = this.mModel.mSkills[i]
                item.item.setCount(curSkillLv > 0 ? curSkillLv.toString() : "")
            }
        }
    }

    protected SetEquipIconList(iconList) {
        for (let i = 0; i < iconList.length; i++) {
            let item = this.mEquipItems[i]
            if (item) {
                item.item.setItemImg(ResDataPath.GetItemFullPath(iconList[i]))
                item.item.setCount("")
                let configID = this.mModel.mEquip[i].configID
                let rec = GameGlobal.Config.ItemConfig[configID]
                let quality = rec ? rec.quality : 0
                item.item.setItemBg(ResDataPath.GetItemQualityName(quality))
            }
        }
    }

    public OnOpen() {
        this.mShowLevel = this.mModel.mLevel
        this.UpdateModel(Math.max(this.mShowLevel, 1))
        this.UpdateContent()
        this.UpdateRedPoint()
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
        this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp)
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent)
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
        // this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//背包变化更新
        ActivityKaiFuModel.setJiJieOpenViewData(this.m_activityJiJieId)
        this.jijie_link.visible = GameGlobal.ActivityKaiFuModel.GetAdvancedTypeArr().indexOf(this.m_activityJiJieId) != -1;
        if (this.jijie_link.visible) {
            this.jijie_link.text = "进阶狂欢"
            this.AddClick(this.jijie_link, this.openActivityJiJieView);
            this.updateJiJieBtnPng()
        }
    }
    private updateJiJieBtnPng(): void {
        UIHelper.ShowRedPoint(this.jijie_link, GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(this.m_activityJiJieId))
    }

    protected openActivityJiJieView(): void {
        KaiFuActivityWin.Show(ActivityKaiFuFuncType.ACT_99990_JiJie, false)
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnPrev:
                this.UpdateModel(this.mShowLevel - 1)
                break
            case this.btnNext:
                this.UpdateModel(this.mShowLevel + 1)
                break
            case this.btnHuanHua:
                this.mModel.SendDress(this.mModel.BaseConfig.pictureid[this.mShowLevel - 1])
                break
            case this.btnCulture:
                this.SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel)
                break
            case this.btnUpLevel://直升一阶
                if (UserBag.CheckEnough(this.mModel.GetShootUpDrugID(), 1)) {
                    WarnWin.show('6阶或以下使用直升丹可以直升1阶，6阶以上使用可以获得200进阶值，建议6阶时使用', () => {
                        this.mModel.SendShootUpDrug(this.mModel.GetShootUpDrugID());
                    }, this, null, null, 'normal', {btnName:'使用'})
                }
                break
            case this.powerLabel:
                ViewManager.ins().open(RoleTemplateAttrPanel, this.mModel, this.name, this.mModel.GetLevelSkin(this.mShowLevel))
                break
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel)
                break
            case this.onekeyEquip:
                for (let i = 0; i < UserRide.EQUIP_COUNT; i++) {
                    let handle = this.mModelRedPoint.IsRedEquip(i)
                    if (handle) {
                        this.mModel.SendEquip(handle)
                    }
                }
                break
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType)
                break
        }
    }

    private SendUp() {
        return this.mRoleSendCheckData.SendUp()
    }

    private _OnSkillClick(e: egret.TouchEvent) {
        let index = parseInt(e.currentTarget.name)
        ViewManager.ins().open(RoleTemplateSkillPanel, this.mModel, index, this.m_SkillIconList)
    }

    private _OnEquipClick(e: egret.TouchEvent) {
        let index = parseInt(e.currentTarget.name)
        let baseData = this.mModel.mEquip[index]
        if (!baseData.configID)
            return
        ViewManager.ins().open(EquipDetailedWin, baseData.configID, baseData, true)
    }

    public UpdateExp(upLevel: boolean): void {
        if (upLevel) {
            this.UpdateModel(this.mShowLevel + 1)
            this.mRoleAutoSendData.Stop()
            ViewManager.ins().open(GainNewImagePanel, this.mModel)
        } else {
            this.mRoleAutoSendData.Continue()
        }
    }

    UpdateContent(): void {
        let model = this.mModel
        this.powerLabel.text = model.GetDescPower()
        for (let i = 0; i < this.mSkillItems.length; i++) {
            let item = this.mSkillItems[i];
            let isOpen = this.mModel.IsOpen(i)
            item.item.setItemImgGray(isOpen ? false : true)
            let curSkillLv = this.mModel.mSkills[i]
            if (isOpen) {
                item.item.setCount(curSkillLv > 0 ? curSkillLv.toString() : "")
            } else {
                item.item.count.text = this.mModel.GetOpenLevel(i) + "阶开启"
            }
        }

        for (let i = 0; i < this.mEquipItems.length; i++) {
            if (model.mEquip[i].configID) {
                let oldId = this.mEquipItems[i].item.data
                let newId = this.mEquipItems[i].item.data = model.mEquip[i]
                if (newId && oldId != newId && this.mPlayEff[i]) {
                    UIHelper.PlayUpEff(this.mEquipItems[i], 0.8) 
                }
            }
            this.mPlayEff[i] = true
        }

        if (!model.mLevel) {
            this.currentState = "none"
            return
        }
        if (this.mModel.mLevel >= this.mModel.mMaxLevel) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        this.UpdateModel(this.mShowLevel)

        let levelConfig = this.mModel.LvproConfig[model.mLevel]
        if (!levelConfig) {
            return
        }
        this.bar.maximum = levelConfig.proexp
        this.bar.value = model.mUpNum * levelConfig.exp

        this.UpdateItemContent()
    }

    private UpdateItemContent() {
        let levelConfig = this.mModel.LvproConfig[this.mModel.mLevel]
        if (!levelConfig) {
            return
        }
        this.consumeLabel.Set(levelConfig.cost)
    }

    private UpdateRedPoint() {
        let hasEquip = false
        for (let i = 0; i < UserRide.EQUIP_COUNT; i++) {
            let item = this.mEquipItems[i]
            let state = this.mModelRedPoint.IsRedEquip(i) ? true : false
            item.item.IsShowRedPoint(state)
            if (state) {
                hasEquip = state
            }
        }
        this.onekeyEquip.visible = hasEquip

        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN))
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM))

        for (let i = 0; i < this.mSkillItems.length; i++) {
            let item = this.mSkillItems[i];
            item.item.IsShowRedPoint(this.mModelRedPoint.IsRedSkill(i))
        }

        UIHelper.ShowRedPoint(this.btn_juexing, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD))

        UIHelper.ShowRedPoint(this.btnAuto, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK))
        UIHelper.ShowRedPoint(this.btnCulture, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK))
        if (this.btnUpLevel.visible) {
            UIHelper.ShowRedPoint(this.btnUpLevel, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_UP_LEVEL_ITEM))
        }
    }

    private UpdateModel(level: number) {
        let model = this.mModel
        this.mShowLevel = level
        this.btnPrev.enabled = level > 1
        this.btnNext.enabled = level < this.mModel.mLevel + 1 && level < model.mMaxLevel
        this.btnNextIcon.visible = level >= this.mModel.mLevel
        this.imgHuanHua.visible = false
        this.btnHuanHua.visible = false
        this.addPowerGroup.visible = false
        let proConfig = this.mModel.ProgressConfig[level]
        if (proConfig && proConfig.name) {
            this.lbName.text = proConfig.name
            this.nameBg.visible = true
        } else {
            this.lbName.text = ""
            this.nameBg.visible = false
        }
        this.lbLev.text = level + "\n阶"
        let dressId = model.BaseConfig.pictureid[level - 1]
        this.SetMainShow(dressId)
        this.SetExtraShow(dressId)

        if (dressId == model.mDressId) {
            this.imgHuanHua.visible = true
        } else if (level <= model.mLevel) {
            this.btnHuanHua.visible = true
        } else {
            this.addPowerGroup.visible = true
            this.lbAlert.textFlow = TextFlowMaker.generateTextFlow(`可提升战力|C:0x63ff57&T:${model.GetNextAddPower(level)}|`)
        }
    }

    private SetMainShow(dressId) {
        let model = this.mModel
        if (!model.SkinConfig[dressId]) {
            return
        }
        if (model.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(model.SkinConfig[dressId].pid)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW) {
            let xianlvModel = GameGlobal.XianlvModel
            let battledXianlvId = xianlvModel.getBattledXianlv()
            if (battledXianlvId != 0) {
                let xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId)
                this.showPanel.SetBody(xianlvInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ) {
            let havingModel = GameGlobal.HavingModel
            this.showPanel.SetBodyId(havingModel.GetAppaId());
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            let petModel = GameGlobal.PetModel
            let battledPetId = petModel.GetShowId()
            if (battledPetId != 0) {
                let petInfo = petModel.GetPetInfo(battledPetId)
                this.showPanel.SetBody(petInfo.GetSkin())
            }

            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_WING) {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTianx(null)
            this.roleShowPanel.SetTitle(null)
            this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid))
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTitle(null)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_SHENGB) {
            let role = SubRoles.ins().GetRoleData()
            this.roleShowPanel.SetAll(role)
            this.roleShowPanel.SetTianx(null)
            this.roleShowPanel.SetTitle(null)
            this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid, role.job, role.sex, false, true))
            return
        }

        this.showPanel.SetBodyId(model.SkinConfig[dressId].pid)
    }

    private SetExtraShow(dressId) {
        let model = this.mModel
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_FZ) {
            let xianlvModel = GameGlobal.XianlvModel
            let battledXianlvId = xianlvModel.getBattledXianlv()
            if (battledXianlvId != 0) {
                let xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId)
                this.extraPanel.SetBody(xianlvInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW || model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ) {
            let sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid)
            this.imgXianw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1)
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_TONGL) {
            let petModel = GameGlobal.PetModel
            let battledPetId = petModel.GetShowId()
            if (battledPetId != 0) {
                let petInfo = petModel.GetPetInfo(battledPetId)
                this.extraPanel.SetBody(petInfo.GetSkin())
            }
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            let sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid)
            let mc: MovieClip;
            if (this.petSoul.numChildren > 0) {
                mc = this.petSoul.getChildAt(0) as any;
            } else {
                mc = new MovieClip();
                this.petSoul.addChild(mc)
            }
            mc.loadUrl(ResDataPath.GetMoviePath(sourcePath), true);
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            this.roleShowPanel.SetTianx(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid))
            return
        }

        if (model.mTemplateType == UserTemplate.TYPE_HAVING_HUAN) {
            let model = GameGlobal.HavingModel;
            this.extraPanel.SetBody(AppearanceConfig.GetUIPath(model.SkinConfig[model.mDressId].pid));
            return
        }
    }
}