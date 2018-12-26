class FriendItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // FriendItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected playerAvatar: eui.Component;
    protected nameTxt: eui.Label;
    protected lvTxt: eui.Label;
    protected gangNameTxt: eui.Label;
    protected onLineTxt: eui.Label;
    protected btn0: eui.Button;
    protected btn: eui.Button;
    protected deleteBtn: eui.Button;
    protected powerText: eui.Label;
    protected giveTxt: eui.Label;
    protected vipTxt: eui.Label;
    protected vipIcon: VipIcon
    /////////////////////////////////////////////////////////////////////////////
    protected info;

    public constructor() {
        super();
        this.skinName = "FriendItemSkin"
    }

    public childrenCreated() {
        super.childrenCreated()
        this.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDeleteBtnClick, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this)
        this.btn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn0Click, this)
        this.playerAvatar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.iconClick, this)
        // MessageCenter.ins().addListener(MessageDef.FRIEND_DATA_REFRESH, this.fansChange, this)
        this.currentState = GameGlobal.FriendModel.FriendData.curState;
        this.btn0.visible = false;
        // this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
        //     MessageCenter.ins().removeAll(this)
        // }, this)
    }

    public dataChanged() {
        super.dataChanged()
        let info;
        if (egret.is(this.data, "Sproto.player_whole_data"))
            info = this.data
        else {
            for (let key in this.data) {
                if (egret.is(this.data[key], "Sproto.player_whole_data")) {
                    info = this.data[key]
                    break;
                }
            }
        }

        if (info != null) {
            this.info = info;
            this.playerAvatar["face"].source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.playerAvatar["imgFrame"].source = ResDataPath.GetHeadFrameImgName(info.headframe)
            this.nameTxt.text = info.name;
            this.lvTxt.text = info.level;
            this.gangNameTxt.text = info.guildName
            this.powerText.text = info.power;

            let offlineTime = DateUtils.format_4((GameServer.serverTime - info.offlineTime) * 1000);
            this.onLineTxt.textFlow = TextFlowMaker.generateTextFlow(info.offlineTime == 0 ? "在线" : `|C:${Color.Red}&T:${offlineTime}在线`);
            // this.vipTxt.visible = info.vip > 0;
            this.vipIcon.setVipLv(info.vip, true);

            if (this.currentState == "friend")
                this.btn.visible = !this.data.gift
            if (this.currentState == "fans") {
                this.fansChange();
                if (!this.data.receive) {
                    this.btn.visible = this.data.gift;
                    this.giveTxt.visible = false;
                }
                else {
                    this.btn.visible = false;
                    this.giveTxt.visible = true;
                }
            }
        }
    }

    onBtnClick() {
        switch (this.currentState) {
            case "friend":
                GameGlobal.FriendModel.sentGive(this.info.dbid)
                break;
            case "fans":
                GameGlobal.FriendModel.sentTakeGive(this.info.dbid);
                break;
            case "blacklist":
                GameGlobal.FriendModel.sendRemoveBlacklist(this.info.dbid)
                break;

            case "referrer":
                GameGlobal.FriendModel.sendAddFriend(this.info.dbid)
                break;
            case "delete":
                ViewManager.ins().open(FriendTipsPanel, this.info)
                break;
        }
    }
    onBtn0Click() {
        GameGlobal.FriendModel.sendAddFriend(this.info.dbid)
    }

    iconClick() {
        ViewManager.ins().open(PlayerDetailsPanel, this.info.dbid);
    }

    onDeleteBtnClick() {
        ViewManager.ins().open(FriendTipsPanel, this.info)
    }

    fansChange() {
        if (this.currentState == "fans")
            this.btn0.visible = !GameGlobal.FriendModel.isFriend(this.info.dbid);
    }
}