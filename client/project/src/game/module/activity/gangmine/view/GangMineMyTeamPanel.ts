class GangMineMyTeamPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup;

    /////////////////////////////////////////////////////////////////////////////
    // GangMineMyTeamPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected CommonDialog: CommonDialog;
    protected list: eui.List;
    protected tpower: eui.Label;
    protected setUpBtn: eui.Button;
    protected zaomuBtn: eui.Button;
    protected exitBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////
    public model: TeamBaseModel

    public constructor() {
        super()
        this.model = GameGlobal.GangMineTeamModel;
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMineMyTeamPanelSkin";
        this.CommonDialog.title = '组队成员';
    };

    initData() {
        this.list.itemRenderer = GangMineTeamRoleItem;
        this.list.dataProvider = null;
        this.tpower.restrict = '0-9';
        this.tpower.maxChars = 9;
    }

    OnOpen(...args: any[]) {
        this.CommonDialog.OnAdded(this);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateTeamInfo)
        this.AddClick(this.setUpBtn, this.onClickHandler);
        this.AddClick(this.zaomuBtn, this.onClickHandler);
        this.AddClick(this.exitBtn, this.onClickHandler);

        this.UpdateTeamInfo()
    }

    protected UpdateTeamInfo() {
        // 如果队伍退出队伍，或者被剔除队伍
        if (!this.model.mTeamInfo.HasTeam()) {
            this.CloseSelf()
            return
        }
        let members = [];
        let i = 0;
        for (let data of this.model.mTeamInfo.members) {
            members.push({
                guardInfo: null,
                mInfo: this.model.mTeamInfo,
                mIndex: i++,
            })
        }
        this.list.dataProvider = new eui.ArrayCollection(members);
        this.tpower.text = this.model.mTeamInfo.needpower + ''
    }

    protected onClickHandler(e: egret.TouchEvent) {
        switch (e.target) {
            case this.exitBtn:
                this.OnClickExit();
                break;
            case this.zaomuBtn:
                this.OnClickZaomu()
                break;
            case this.setUpBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    // this.model.SendGetTeamCondition(1, parseInt(this.tpower.text));
                    this.OnClickSetup()
                } else {
                    this.tpower.text = this.model.mTeamInfo.needpower + ''
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
        }
    }

    protected OnClickExit() {
        this.CloseSelf();
        this.model.SendLeave(1);
    }

    protected OnClickZaomu() {
        if (this.model.mTeamInfo.IsMyTeam()) {
            //发送到聊天
        } else {
            GameGlobal.UserTips.showTips('您不是队长没有权限操作');
        }
    }

    protected OnClickSetup() {
        this.model.SendGetTeamCondition(1, parseInt(this.tpower.text));
    }

    OnClose() {
        this.removeObserve();
        this.removeEvents();
        this.CommonDialog.OnRemoved();
    };
}