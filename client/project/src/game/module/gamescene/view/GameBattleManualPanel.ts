class GameBattleManualPanel extends BaseView {

    /////////////////////////////////////////////////////////////////////////////
    // GameBattleManualSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bottomGroup: eui.Group;
    protected autoSkillGroup: eui.Group;
    protected autoBtn: eui.Button;
    protected autoBtnGroup: eui.Group;
    protected petBtn: eui.Button;
    protected roleBtn: eui.Button;
    protected selSkillGroup: eui.Group;
    protected label: eui.Label;
    protected skillList: eui.DataGroup;
    protected timeLabel: eui.BitmapLabel;
    /////////////////////////////////////////////////////////////////////////////

    private static IMG = {
        RETURN: "ui_bm_fanhui",
        AUTO: "ui_bm_zidong",
        MANUAL: "ui_zd_bt_shoudong",
    }

    private m_Context: GameBattlePanel
    private selectTypeIndex: EntityType = EntityType.Role
    private battleManual: { [key: number]: GameBattleManualData } = {}
    private mIsAuto = true
    // 忽略三秒计时
    private mIgnoreTime = false

    private mIsPlay = false

    private static STATE_AUTO = 0
    private static STATE_MANUAL = 1

    private mState: number = 0

    // 释放技能顺序
    public USE_SORT = {
        [EntityType.Role]: EntityType.Pet,
        [EntityType.Pet]: null,
    }

    public constructor(context: GameBattlePanel) {
        super()
        this.skinName = "GameBattleManualSkin"
        this.m_Context = context

        this.skillList.itemRenderer = GameBattleBtn2Item
        // this._AddClick(this.skillList, this._OnItemClick)

        this._AddClick(this.autoBtn, this._OnClick);
        this._AddClick(this.petBtn, this._OnClick);
        this._AddClick(this.roleBtn, this._OnClick);

        (this.roleBtn["typeIcon"] as eui.Image).source = "ui_bm_juesebiaoji";
        (this.petBtn["typeIcon"] as eui.Image).source = "ui_bm_chongwubiaoji";
    }

    public OnOpen() {
        this.timeLabel.visible = false
        this.autoBtnGroup.visible = false
        this.mIsAuto = true
        this.mIgnoreTime = false
        this.mIsPlay = false
        this.observe(MessageDef.BATTLE_TURN, this.StartTurn)
        this.observe(MessageDef.BATTLE_TURN_START, this.StartTurnStart)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos)
        this.StartManual()
        this._UpdatePos()
    }

    private _UpdatePos() {
        MiniChatPanel.UpdateViewPos(this.bottomGroup)
    }

    public OnClose() {
        this.ClearUpdateTimer()
    }

    private SelectNextSkill() {
        let data = this.battleManual[this.selectTypeIndex]
        if (!data) {
            this.UpdateSelSkillGroup(false)
            this.UseSelSkill()
            return
        }
        this.UpdateSelSkillGroup(true, this.selectTypeIndex)
    }

    private StartTurn() {
        // if (!this.selSkillGroup.visible) {
        //     this.autoBtnGroup.visible = true
        // }
        this.mIsPlay = false
    }

    private StartTurnStart() {
        this.mIsPlay = true
        // this.autoBtnGroup.visible = false
        this.selSkillGroup.visible = false
        this.ShowTimeGroup(false)
        this.SetBtnIcon()
    }

    private ShowTimeGroup(state: boolean) {
        this.timeLabel.visible = state
    }

    public _OnItemClick(itemData) {
        // let index = e.itemIndex
        // let itemData = e.item

        let data = this.battleManual[itemData.type]
        if (!data) {
            return
        }
        data.skillId = itemData.skillId
        this.UpdateSelSkillGroup(false)

        this.m_Context.SelectTarget(itemData.type, itemData.skillId)
        this.autoBtn.icon = GameBattleManualPanel.IMG.RETURN
    }

    public SelectTarget(roleType: number, skillId: number, handles: number[]) {
        let data = this.battleManual[roleType]
        if (!data) {
            console.error("SelectTarget error roleType => " + roleType)
            return
        }
        data.targets = handles
        this.selectTypeIndex = this.USE_SORT[roleType]
        this.SelectNextSkill()
    }

    public UseSelSkill() {
        let list = []
        for (let key in this.battleManual) {
            let data = this.battleManual[key]
            if (data) {
                let item = new GameBattleManualData
                item.skillId = data.skillId
                item.handle = data.handle
                item.targets = data.targets
                list.push(item)

                data.skillId = 0
                data.targets = []
            }
        }
        GameGlobal.RaidMgr.mBattleRaid.UseSkill(list)
    }

    public _OnClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.autoBtn:
                // 自动释放技能状态
                if (this.mIsAuto) {
                    this.mIsAuto = false
                    
                    this.ClearUpdateTimer()

                    if (this.mIsPlay || this.mIgnoreTime) {
                        UserTips.InfoTip("下回合开始手动释放技能")
                    } else {
                        this.selectTypeIndex = EntityType.Role
                        this.SelectNextSkill()
                    }
                    this.mIgnoreTime = true
                    this.SetBtnIcon()
                    GameGlobal.RaidMgr.mBattleRaid.SendSetAuto(false)
                    
                    // 如果是手动释放技能
                } else {
                    if (this.autoBtn.icon == GameBattleManualPanel.IMG.RETURN) {
                        this.m_Context.CancelSelectTarget()

                        this.selectTypeIndex = EntityType.Role
                        this.SelectNextSkill()
                    } else if (this.autoBtn.icon == GameBattleManualPanel.IMG.AUTO) {
                        this.mIsAuto = true
                        // 隐藏技能框，开始自动释放技能
                        this.UpdateSelSkillGroup(false)
                        GameGlobal.RaidMgr.mBattleRaid.SendSetAuto(true)

                        this.SetBtnIcon()
                    }
                }
                break
            case this.roleBtn:
                this.UpdateSelSkillGroup(true, EntityType.Role)
                break
            case this.petBtn:
                this.UpdateSelSkillGroup(true, EntityType.Pet)
                break
        }
    }

    public UpdateContent() {
        this.UpdateSkillBtn()
    }

    private UpdateSkillBtn() {
        this.battleManual = {}
        let raid = GameGlobal.RaidMgr.mBattleRaid
        let entityDataList = raid.mEntityDatas[raid.mMySide - 1]
        for (let data of entityDataList) {
            let setData = null
            let entity = raid.GetEntity(data.handle)
            if (!entity) {
                continue
            }
            // 死亡
            if (entity.mAI.IsDead()) {
                continue
            }
            if (data.type == EntityType.Role) {
                setData = true
            // 宠物需要出战状态
            } else if (data.type == EntityType.Pet && data.posIndex != -1) {
                setData = true
            }
            if (setData) {
                let manualData = new GameBattleManualData
                manualData.handle = data.handle
                manualData.skillId = data.GetSkillIDs()[0] || 0
                this.battleManual[data.type] = manualData
            }
        }
        this.UpdateSkillBtnDesc()
    }

    private UpdateSkillBtnDesc() {
        if (this.battleManual[EntityType.Role]) {
            this.roleBtn.icon = SkillsConfig.GetSkillIcon(this.battleManual[EntityType.Role].skillId)
        } else {
            UIHelper.SetVisible(this.roleBtn, false)
        }
        if (this.battleManual[EntityType.Pet]) {
            this.petBtn.icon = SkillsConfig.GetSkillIcon(this.battleManual[EntityType.Pet].skillId)
        } else {
            UIHelper.SetVisible(this.petBtn, false)
        }
    }

    private UpdateSelSkillGroup(state: boolean, index: number = -1) {
        this.selSkillGroup.visible = state
        // this.autoBtnGroup.visible = !state
        if (index < 0) {
            return
        }
        let data = this.battleManual[index]
        if (!data) {
            return
        }
        let entity = GameGlobal.RaidMgr.mBattleRaid.mEntityList[data.handle]
        if (!entity) {
            return
        }
        let info = entity.GetInfo()
        if (!info) {
            return
        }
        this.autoBtn.icon = GameBattleManualPanel.IMG.AUTO

        let title = ""
        let selId = data.skillId || 0
        if (info.type == EntityType.Role) {
            title = "角色技能"
        } else if (info.type == EntityType.Pet) {
            title = "宠物技能"
        } else {
            title = "未知技能"
        }
        this.label.text = title
        let list = []
        for (let id of info.GetSkillIDs()) {
            list.push({
                handle: info.handle,
                type: info.type,
                skillId: id,
                selId: selId
            })
        }
        this.skillList.dataProvider = new eui.ArrayCollection(list)
    }

    private m_Timer: number = 0
    private m_IsUpdate: boolean = false
    // 可以使用的技能列表
    public mEntitySkill: { [key: number]: { [key: number]: boolean } } 

    // 开始手动技能计时
    public StartManual(entitySkill: Sproto.entity_skill[] = null) {
        // 刷新使用的技能
        this.UpdateSkillBtn()
        this.mEntitySkill = null
        if (entitySkill) {
            let data = {}
            for (let data1 of entitySkill) {
                if (data1.skills) {
                    let dict = {}
                    for (let data2 of data1.skills) {
                        dict[data2] = true
                    }
                    data[data1.handler] = dict
                }
            }
            this.mEntitySkill = data
        }
        if (!this.mIsAuto) {
            this.SetBtnIcon()
            this.selectTypeIndex = EntityType.Role
            this.SelectNextSkill()
            return
        }
        this.SetBtnIcon()
        if (!this.mIgnoreTime && !this.m_IsUpdate) {
            this.ShowTimeGroup(true)
            this.m_Timer = 3
            this.m_IsUpdate = true
            this._UpdateTimer()
            this.AddTimer(700, 5, this._UpdateTimer)
        }
    }

    public SetAuto(isauto: boolean) {
        this.mIsAuto = isauto
        if (!isauto) {
            this.mIgnoreTime = true
        }
        this.SetBtnIcon()
    }

    private SetBtnIcon() {
        let isAuto = this.mIsAuto
        if (isAuto) {
            this.autoBtn.icon = GameBattleManualPanel.IMG.MANUAL
        } else {
            this.autoBtn.icon = GameBattleManualPanel.IMG.AUTO
        }
    }

    private ClearUpdateTimer() {
        this.ShowTimeGroup(false)
        if (this.m_IsUpdate) {
            this.m_IsUpdate = false
            TimerManager.ins().remove(this._UpdateTimer, this)
        }
    }

    private _UpdateTimer() {
        this.timeLabel.text = (this.m_Timer--) + ""
        if (this.m_Timer < 0) {
            this.ClearUpdateTimer()
        }
    }
}

class GameBattleManualData {
    handle: number
    skillId: number
    targets: number[] = []
}


class GameBattleBtn2Item extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // GameBattleBtn2Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected skillIcon: eui.Image;
    protected typeIcon: eui.Image;
    protected fengIcon: eui.Image;
    protected coolLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    childrenCreated() {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
    }

    private _OnClick() {
        if (this.IsCool()) {
            UserTips.InfoTip("技能冷却中")
            return
        }
        (Util.GetParentByType(this, GameBattleManualPanel) as GameBattleManualPanel)._OnItemClick(this.data)
    }

    private IsCool(): boolean {
        let parent = (Util.GetParentByType(this, GameBattleManualPanel) as GameBattleManualPanel)
        let skillId = this.data.skillId as number
        let handle = this.data.handle as number
        if (parent.mEntitySkill == null) {
            return false
        }
        return parent.mEntitySkill[handle] && parent.mEntitySkill[handle][skillId] ? false : true
    }

    public dataChanged() {
        let selId = this.data.selId as number
        let skillId = this.data.skillId as number
        let handle = this.data.handle as number
        let icon = SkillsConfig.GetSkillIcon(skillId)
        this.skillIcon.source = icon
        this.coolLabel.visible = this.IsCool()
    }
}