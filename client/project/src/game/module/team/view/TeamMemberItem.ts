class TeamMemberItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // TeamMemberItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected memberGroup: eui.Group;
    protected power_txt: eui.Label;
    protected name_txt: eui.Label;
    protected level_txt: eui.Label;
    protected leader_icon: eui.Image;
    protected tiRen_btn: eui.Button;
    protected head: eui.Component;
    /////////////////////////////////////////////////////////////////////////////

    childrenCreated(): void {
        super.childrenCreated()
        this.tiRen_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.OnTap,this)
    }

    private OnTap() {
        let data = this.data as {
            mModel: TeamBaseModel
            mInfo: MyTeamInfo
            mIndex: number
        } 
        data.mModel.SendKick(data.mInfo.level, data.mInfo.members[data.mIndex].dbid)
    }

    dataChanged() {
       let data = this.data as {
                    mModel: TeamBaseModel
                    mInfo: MyTeamInfo
                    mIndex: number
                } 
        let mem = data.mInfo.members[data.mIndex]
        if (!mem) {
            return
        }

        this.leader_icon.visible = mem.dbid == data.mInfo.leaderid
        this.tiRen_btn.visible = data.mInfo.IsMyTeam() && mem.dbid != GameGlobal.actorModel.actorID
        UIHelper.SetHead(this.head, mem.job, mem.sex, false)
        this.level_txt.text = mem.level + "级"
        this.name_txt.text = mem.name
        this.power_txt.text = "战力 " + mem.power
    }
}