class MyTeamInfo {
    public members: Sproto.member_data[]; // tag 0
    public leaderid: number; // tag 1
    public level: number; // tag 3
    public needpower: number = 0

    public constructor() {
        this.members = []
        this.leaderid = 0
        this.level = 0
    }

    public Clear() {
        this.members = []
        this.leaderid = 0
        this.level = 0
        this.needpower = 0
    }

    public parser(rsp:Sproto.sc_team_info_request) {
        let oldPower = this.needpower
        this.leaderid = rsp.leaderid || 0
        this.level = rsp.level || 0
        this.needpower = rsp.needpower || 0
        if (rsp.leaderid == GameGlobal.actorModel.actorID && oldPower != rsp.needpower) {
            UserTips.InfoTip("进队战力要求已改动")
        }
        this.members = rsp.members || []
        this.members.sort((lhs, rhs) => {
            if (lhs.dbid == this.leaderid) {
                return -1
            }
            if (rhs.dbid == this.leaderid) {
                return 1
            }
            return -1
        })
    }

    public HasTeam(): boolean {
        return this.members.length > 0
    }

    public IsMyTeam(): boolean {
        return GameGlobal.actorModel.actorID == this.leaderid
    }

    public IsFull(): boolean {
        return this.members.length >= 3
    }
}