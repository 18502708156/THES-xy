class GangMineTeamPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main;

    /////////////////////////////////////////////////////////////////////////////
    // GangMineTeamPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected list: eui.List;
    protected createBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    public model: TeamBaseModel = GameGlobal.GangMineTeamModel;
    protected mMyTeamPanel = GangMineMyTeamPanel

    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMineTeamPanelSkin";
        this.commonWindowBg.SetTitle('组队');
    };

    initData() {
        this.list.itemRenderer = GangMineTeamItem;
        this.list.dataProvider = null;
    }

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.createBtn, this.onClickHandler);
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.updateContent);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.showMyTeamPanel);
        this.model.SendGetTeamList(1);
    }

    protected showMyTeamPanel() {
        this.CloseSelf();
        ViewManager.ins().open(this.mMyTeamPanel);
    }

    protected updateContent() {
        this.list.dataProvider = new eui.ArrayCollection(this.model.mTeamList[1]);
    }

    protected onClickHandler(e: egret.TouchEvent) {
        this.model.SendCreateTeam(1)
    }

    OnClose() {
        this.removeObserve();
        this.removeEvents();
        this.commonWindowBg.OnRemoved();
    };
}

class GangMineTeamItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineTeamItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tname: eui.Label;
    protected tnum: eui.Label;
    protected joinBtn: eui.Button;
    protected tpower: eui.Label;
    protected role0: GangMineTeamRoleItem2;
    protected role1: GangMineTeamRoleItem2;
    protected role2: GangMineTeamRoleItem2;
    /////////////////////////////////////////////////////////////////////////////

    protected leaderId: number;
    protected needPower: number;
    protected memberLen: number;

    public constructor() {
        super()
        this.skinName = 'GangMineTeamItemSkin';
    }

    childrenCreated() {
        this.joinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    protected onClickHandler(e: egret.TouchEvent) {
        if (this.needPower > GameGlobal.actorModel.power) {
            GameGlobal.UserTips.showTips('战力不足，不能加入');
            return;
        }
        if (this.memberLen >= 3) {
            GameGlobal.UserTips.showTips('队伍满员，不能加入');
            return;
        }
        let parent = Util.GetParentByType(this, GangMineTeamPanel) as GangMineTeamPanel
        if (parent) {
            parent.model.SendJoin(1, this.leaderId);
        } else {
            console.error("not parent !!!")
        }
    }

    dataChanged() {
        if (!this.data) return;
        let info: Sproto.team_data = this.data;
        this.leaderId = info.leaderid;
        this.needPower = info.needpower;
        this.tname.text = this.getLeaderName(info.members);
        this.tpower.text = '需战力' + CommonUtils.overLength(info.needpower, true);
        this.memberLen = info.members.length;
        this.tnum.text = '(' + this.memberLen + '/3)';

        this.showMembers(info.members);
    }
    /**显示成员数据 */
    private showMembers(members: Sproto.member_data[]) {
        let i = 0, len = 3;
        let info: Sproto.member_data;
        let role: GangMineTeamRoleItem2;
        for (i; i < len; i++) {
            role = this['role' + i];
            info = members[i];
            role.updateContent(info, this.leaderId);
        }
    }

    private getLeaderName(members: Sproto.member_data[]) {
        let i = 0, len = members.length;
        for (i; i < len; i++) {
            if (this.leaderId == members[i].dbid) {
                return members[i].name;
            }
        }
        return '';
    }
}

class GangMineTeamRoleItem2 extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineTeamRoleItem2Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconImg: eui.Image;
    protected teamImg: eui.Image;
    protected tname: eui.Label;
    protected tserviceID: eui.Label;
    protected tlevel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super()
        this.skinName = 'GangMineTeamRoleItem2Skin';
    }

    public updateContent(info: Sproto.member_data, leaderId) {
        if (info) {
            this.currentState = info.dbid == leaderId ? 'state1' : 'state2';
            this.iconImg.source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.tname.text = info.name;
            this.tserviceID.text = '';
            this.tlevel.text = 'Lv.' + info.level;
        }
        else {
            this.currentState = 'state3';
        }
    }
}