class GangMineTeamRoleItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineTeamRoleItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconImg: eui.Image;
    protected teamImg: eui.Image;
    protected kickBtn: eui.Button;
    protected bloodBar: eui.Image;
    protected tname: eui.Label;
    protected tlevel: eui.Label;
    protected tpower: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    private memberId;

    public constructor() {
        super()
        this.skinName = 'GangMineTeamRoleItemSkin';
    }

    childrenCreated() {
        this.kickBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }
    private onClickHandler(e) {
        let parent = Util.GetParentByType(this, GangMineMyTeamPanel) as GangMineMyTeamPanel
        if (parent) {
            parent.model.SendKick(1, this.memberId);
        } else {
            console.error("not parent !!!")
        }
    }

    dataChanged() {
        if (!this.data) return;
        let data = this.data as {
            guardInfo: GangMineGuardInfo
            mInfo: MyTeamInfo
            mIndex: number
        };

        if (data.guardInfo) {
            let info = data.guardInfo;
            this.teamImg.visible = this.kickBtn.visible = false;
            this.iconImg.source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.bloodBar.width = 188 * (info.hp/100);
            this.tname.text = info.name;
            this.tpower.text = info.power + '';
            this.tlevel.text = 'Lv.' + info.level;
        }
        else if (data.mInfo) {
            let mInfo = data.mInfo;
            let member = mInfo.members[data.mIndex];
            this.memberId = member.dbid;
            this.teamImg.visible = mInfo.leaderid == this.memberId;
            this.kickBtn.visible = mInfo.IsMyTeam() && mInfo.leaderid != this.memberId;
            this.iconImg.source = ResDataPath.GetHeadImgName(member.job, member.sex);
            this.tname.text = member.name;
            this.tpower.text = member.power + '';
            this.tlevel.text = 'Lv.' + member.level;
        }
    }
}
