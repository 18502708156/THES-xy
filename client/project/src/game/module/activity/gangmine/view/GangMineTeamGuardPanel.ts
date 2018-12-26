class GangMineTeamGuardPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup;

    /////////////////////////////////////////////////////////////////////////////
    // GangMineTeamGuardPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected CommonDialog: CommonDialog;
    protected list: eui.List;
    protected cancelBtn: eui.Button;
    protected sureBtn: eui.Button;
    protected exitBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    private mineId;

    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMineTeamGuardPanelSkin";
        this.CommonDialog.title = '提示';
    };

    initData() {
        this.list.itemRenderer = GangMineTeamRoleItem;
        this.list.dataProvider = null;
    }

    OnOpen(...args: any[]) {
        this.CommonDialog.OnAdded(this);
        this.AddClick(this.cancelBtn, this.onClickHandler);
        this.AddClick(this.sureBtn, this.onClickHandler);
        this.AddClick(this.exitBtn, this.onClickHandler);

        this.mineId = args[0];
        this.observe(MessageDef.GANGMINE_UPDATE_INFO, this.updateContent);
        this.updateContent();
    }

    private updateContent() {
        if (this.mineId == GameGlobal.GangMineModel.myInfo.mineId) {
            this.currentState = 'myState';
        } else {
            this.currentState = 'normal';
        }
        let guardList = GameGlobal.GangMineModel.mineInfos[this.mineId].guardList;
        let tempList = [];
        for (let i = 0; i < guardList.length; i++) {
            tempList[i] = { guardInfo: guardList[i], mInfo: null, mIndex: 0 };
        }
        this.list.dataProvider = new eui.ArrayCollection(tempList);

    }

    private onClickHandler(e: egret.TouchEvent) {
        this.CloseSelf();
        if (e.target == this.sureBtn) {
            GameGlobal.GangMineModel.sendGangMineForce(this.mineId);
        }
        else if (e.target == this.exitBtn) {
            GameGlobal.GangMineModel.sendGangMineLeave();
        }
    }

    OnClose() {
        this.removeObserve();
        this.removeEvents();
        this.CommonDialog.OnRemoved();
    };
}