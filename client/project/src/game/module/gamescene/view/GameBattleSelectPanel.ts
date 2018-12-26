class GameBattleSelectPanel extends BaseView {

	private m_Context: GameBattlePanel

	private mSelectView: GameBattleSelectItem[][] = []
	private mSelectCount: number = 0

	private mRoleType: number
	private mSkillId: number
    private mTarget: number[] = []

	public constructor(context: GameBattlePanel) {
		super()
		this.m_Context = context
	}

	public CancelSelectTarget() {
		this.mRoleType = 0
		this.mSkillId = 0
		this.mSelectCount = 0
        this.mTarget = []
		this.removeChildren()

		DisplayUtils.removeFromParent(this)
	}

    public SelectTarget(roleType: number, skillId: number): boolean {
		this.mRoleType = roleType
		this.mSkillId = skillId
		this.mSelectCount = 0
        this.mTarget = []
        let config = GameGlobal.Config.SkillsConfig[skillId]
        if (!config) {
            this.SelectDone()
            return
        }
        let ttype = config[GameGlobal.Config.SkillsConfig_keys.ttype]
        let args = config[GameGlobal.Config.SkillsConfig_keys.targetType]
        let raid = GameGlobal.RaidMgr.mBattleRaid
       
        if (ttype == 1 || ttype == 2 || ttype == 4) {
			this.SelectDone()
            return
        }

		let side = ttype == 3 ? 1 : 0
        // this.mSelectCount = args.count
        // 只需要选择一个对象
        this.mSelectCount = 1

        let entityDatas = raid.mEntityDatas[side]
        for (let data of entityDatas) {
            let entity = raid.GetEntity(data.handle)
            if (entity && entity.mAI && entity.mAI.IsTarget()) {
                this.AddSelectView(data.handle, side, data.posIndex)
            }
        }
    }

    public AddSelectView(handle: number, side: number, posIndex: number) {
		let list = this.mSelectView[side]
		if (!list) {
			list = this.mSelectView[side] = []
		}
		if (!list[posIndex]) {
			let view = list[posIndex] = new GameBattleSelectItem
            let data = BattleCtrl.POS_EM[posIndex]
            let pos = egret.$TempPoint
            GameMap.GetBattleView().GetEntityGlobal(data[0], data[1], pos)
            this.globalToLocal(pos.x, pos.y, pos)
            view.x = pos.x
            view.y = pos.y
            this._AddClick(view, this._OnSelClick)
		}
        this.addChild(list[posIndex])
        list[posIndex].SetData(handle)
    }

    private SelectDone() {
        this.m_Context.SelectDone(this.mRoleType, this.mSkillId, this.mTarget)
    }

    private _OnSelClick(e: egret.TouchEvent) {
        let target = e.currentTarget as GameBattleSelectItem
        DisplayUtils.removeFromParent(target)
        this.mTarget.push(target.mHandle)
        if (this.mTarget.length >= this.mSelectCount || this.numChildren < 1) {
            this.SelectDone()
            this.CancelSelectTarget()
        }
    }
}

class GameBattleSelectItem extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // GameBattleSelectSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	public mHandle: number

	public constructor() {
		super()
		this.skinName = "GameBattleSelectSkin"
		this.group.x = this.group.y = 0
	}

	public SetData(handle: number) {
		this.mHandle = handle
	}
}