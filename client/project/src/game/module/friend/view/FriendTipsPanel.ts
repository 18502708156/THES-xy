class FriendTipsPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // FriendTipsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog
    protected playerAvatar: ItemIcon;
    protected nameTxt: eui.Label;
    protected lvTxt: eui.Label;
    protected gangNameTxt: eui.Label;
    protected tipsTxt: eui.Label;
    protected vipTxt: eui.Label;
    protected affirmBtn: eui.Button;
    protected cancelBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    protected data;
    public constructor() {
        super()

    }

    public childrenCreated() {
        this.skinName = "FriendTipsSkin"
        this.commonDialog.title = "提示"
    }

    public OnOpen(...param: any[]) {
        this.commonDialog.OnAdded(this);
        this._AddClick(this.affirmBtn, this.onClick)
        this._AddClick(this.cancelBtn, this.onClick)
        this.data = param[0];
        this.UpdateContent();
    }

    UpdateContent() {
        this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.job, this.data.sex));
        this.nameTxt.text = this.data.name;
        this.lvTxt.text = this.data.level;
        this.gangNameTxt.text = this.data.guildNames
        this.vipTxt.visible = this.data.vip > 0;
        this.tipsTxt.text = `确认要取消对【${this.data.name}】的关注？`
    }

    onClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.affirmBtn:
                GameGlobal.FriendModel.sendDleFriend(this.data.dbid);
                ViewManager.ins().close(FriendTipsPanel)
                break;
            case this.cancelBtn:
                ViewManager.ins().close(FriendTipsPanel)
                break;
        }
    }
}
