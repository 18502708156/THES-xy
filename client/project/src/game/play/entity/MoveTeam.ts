class MoveTeam {
    public static NONE_ORDER = -1

    public static MOVE_SPEED = 140

    public mMasterHandle: number = 0
    public mMember: MoveMember[] = []

    private mOrderId: number

    private GetInfo(): EntityData {
        if (!this.mMember[0]) {
            return null
        }
        let info = this.mMember[0].mTarget.GetInfo()
        if (!info) {
            return null
        }
        return info
    }

    public GetX(): number {
        let info = this.GetInfo()
        if (!info) {
            return 0
        }
        return info.x
    }

    public GetY(): number {
        let info = this.GetInfo()
        if (!info) {
            return 0
        }
        return info.y
    }

    constructor() {
    }

    public Init(member: MapEntity[]) {
        let list = []
        let pre: MoveMember = null
        for (let m of member) {
            m.mTeamHandle = this.mMasterHandle
            m.UpdateAction(EntityClipType.STAND, false)
            let mem = new MoveMember()
            mem.mTarget = m
            list.push(mem)
            if (pre) {
                m.SetPos(m.x, m.y)
                mem.mPre = pre
            }
            pre = mem
        }
        this.mMember = list
    }

    public Clear() {
        for (let data of this.mMember) {
            if (data.mTarget) {
                data.mTarget.mTeamHandle = null
            }
        }
        this.mMember = []
        this.mOrderId = null
    }

    public AddEntity(m: MapEntity) {
        if (!m) {
            return
        }
        m.mTeamHandle = this.mMasterHandle
        m.UpdateAction(EntityClipType.STAND, false)
        let mem = new MoveMember()
        mem.mTarget = m
        let pre = this.mMember[this.mMember.length - 1]
        if (pre) {
            m.SetPos(pre.mTarget.x, pre.mTarget.y)
            mem.mPre = pre
        }
        this.mMember.push(mem)
    }

    public RemoveMem(handle: number) {
        for (let i = 0; i < this.mMember.length; i++) {
            let entity = this.mMember[i].mTarget
            if (entity && entity.GetHandle() == handle) {
                let pre = this.mMember[i].mPre
                let next = this.mMember[i + 1]
                if (next) {
                    next.mPre = pre
                }
                this.mMember.splice(i, 1)
                entity.mTeamHandle = null
                break
            }
        }
    }

    public GetMember(): EntityData[] {
        let list = []
        for (let m of this.mMember) {
            let target = m.mTarget
            if (target) {
                let info = target.GetInfo()
                info.x = target.x
                info.y = target.y
                list.push(info)
            }
        }
        return list
    }

    public MoveTo(id: number, x: number, y: number, offset: number, isBack: boolean): void {
        if (this.mMember.length) {
            this.mOrderId = id
            let mem = this.mMember[0]
            if (mem && mem.mTarget) {
                if (isBack) {
                     mem.MoveTo(x, y, offset)
                } else {
                    let astar = GameMap.aStar.getPatch(mem.mTarget.x, mem.mTarget.y, x, y)
                    if (astar && astar.length) {
                        mem.MoveToByAStar(astar, offset)
                    } else {
                        mem.MoveTo(x, y, offset)
                    }
                }
            }
        }
    }

    public FlyTo(x: number, y: number): void {
        if (this.mMember.length) {
            this.mOrderId = null
            this.mMember[0].FlyTo(x, y)
        }
    }

    public Update(delta: number): number {
        if (this.mMember.length) {
            let ret = this.mMember[0].Update(delta)
            for (let i = this.mMember.length - 1; i >= 1; --i) {
                this.mMember[i].Update(delta)
            }
            if (this.mOrderId != null && this.mOrderId != -1 && ret == AIUnitMoveData.STATE_FINISH) {
                let id = this.mOrderId
                this.mOrderId = null
                let target = this.mMember[0].mTarget
                GameGlobal.RaidMgr.mMapRaid.OnMoveLeval(id, target.GetHandle(), target.x, target.y);
            }
            return ret
        }
        return AIUnitMoveData.STATE_FINISH
    }
}

class NormalMoveTeam extends MoveTeam {

    public static PATH_INDEX = -1

    private INDEX = 0
    private WAY = 1
    private pathIndex = 0

    private GetNextPos() {
        let pathData = GameMap.mPath[this.pathIndex]
        if (!pathData) {
            return null
        }
        let points = pathData.points
        let data = points[this.INDEX]
        if (!data) {
            if (this.INDEX >= points.length - 1) {
                data = points[0]
            } else if (this.INDEX <= 0) {
                data = points[points.length - 1]
            }
        }
        this.INDEX += this.WAY
        if (this.INDEX >= points.length - 1) {
            this.WAY = -1
        } else if (this.INDEX <= 0) {
            this.WAY = 1
        }
        return [Const.PosToPixel(pathData.x + data.x), Const.PosToPixel(pathData.y + data.y)]
    }

    private SetRanStartPos(entity: MapEntity[]) {
        if (!entity || !entity.length) {
            return
        }
        let pathData = GameMap.mPath[this.pathIndex]
        if (!pathData) {
            return
        }
        let points = pathData.points
        this.INDEX = MathUtils.limitInteger(0, points.length - 1)
        let pos = points[this.INDEX]
        if (pos) {
            entity[0].SetPos(Const.PosToPixel(pathData.x + pos.x), Const.PosToPixel(pathData.y + pos.y))
        } else {
            entity[0].SetPos(Const.PosToPixel(pathData.x + 4), Const.PosToPixel(pathData.y + 4))
        }
        // 偏移坐标
		for (let i = 1; i < entity.length; i++) {
			entity[i].x = entity[i - 1].x - 50
			entity[i].y = entity[i - 1].y
		}
    }

    public Init(member: MapEntity[]) {
        if (GameMap.mPath && GameMap.mPath.length) {
            NormalMoveTeam.PATH_INDEX++
            if (NormalMoveTeam.PATH_INDEX >= GameMap.mPath.length) {
                NormalMoveTeam.PATH_INDEX = 0
            } else if (NormalMoveTeam.PATH_INDEX < 0) {
                NormalMoveTeam.PATH_INDEX = 0
            }
            this.pathIndex = NormalMoveTeam.PATH_INDEX
            // this.pathIndex = MathUtils.limitInteger(0, GameMap.mPath.length - 1)
        }
        if (member.length) {
            if (member[0].GetInfo().x == 0 && member[0].GetInfo().y == 0) {
                this.SetRanStartPos(member)
            }
        }
        super.Init(member)
        let data = this.GetNextPos()
        if (data) {
            this.MoveTo(MoveTeam.NONE_ORDER, data[0], data[1], 0, true)
        }
    }

    public Update(delta: number): number {
        let ret = super.Update(delta)
        if (ret == 2) {
            let data = this.GetNextPos()
            if (data) {
                this.MoveTo(MoveTeam.NONE_ORDER, data[0], data[1], 0, true)
            }
        }
        return ret
    }
}

class MoveMember {

    private m_MoveData: AIUnitMoveData

    public mTarget: MapEntity
    public mPre: MoveMember

    public mIsMove: boolean = false

    public constructor() {
        this.m_MoveData = new AIUnitMoveData
    }

    public MoveToByAStar(aStar: AStarNode[], offset: number): void {
        if (!offset) {
            offset = this.mPre ? 20 : 0
        }
        if (this.m_MoveData.InitByAStar(this.mTarget.x, this.mTarget.y, aStar, MoveTeam.MOVE_SPEED, offset)) {
            this.mTarget.SetDir(this.m_MoveData.mDir)
            this.mIsMove = true
        }
        if (this.mIsMove) {
            this.mTarget.UpdateAction(EntityClipType.RUN, false)
        }
    }

    public MoveTo(x: number, y: number, offset: number) {
        if (!offset) {
            offset = this.mPre ? 20 : 0
        }
        if (this.m_MoveData.Init(this.mTarget.x, this.mTarget.y, x, y, MoveTeam.MOVE_SPEED, offset)) {
            this.mTarget.SetDir(this.m_MoveData.mDir)
            this.mIsMove = true
        }
        if (this.mIsMove) {
            this.mTarget.UpdateAction(EntityClipType.RUN, false)
        }
    }

    public FlyTo(x: number, y: number) {
        if (this.m_MoveData) {
            this.m_MoveData.Stop()
        }
        this.mTarget.SetPos(x, y)
    }

    public Update(delta: number): number {
        if (!this.mIsMove) {
            this.CheckRun()
            return AIUnitMoveData.STATE_FINISH
        }
        let taget = this.mTarget
        let ret = this.m_MoveData.Update(delta, taget)
        this.mTarget.SetDir(this.m_MoveData.mDir)
        this.mTarget.alpha = GameMap.checkAlpha(Const.PixelToPos(taget.x), Const.PixelToPos(taget.y)) ? 0.5 : 1
        if (ret == AIUnitMoveData.STATE_FINISH) {
            if (!this.CheckRun()) {
                this.mTarget.UpdateAction(EntityClipType.STAND, false)
                this.mIsMove = false
            }
        }
        return ret
    }

    private CheckRun() {
        if (this.mPre) {
            let x1 = this.mTarget.x
            let y1 = this.mTarget.y
            let x2 = this.mPre.mTarget.x
            let y2 = this.mPre.mTarget.y

            var disX = x2 - x1
            var disY = y2 - y1
            let dis = disX * disX + disY * disY;
            if (dis >= 6000) {
                this.MoveTo(x2, y2, 0)
                return true
            }
        }
        return false
    }
}


