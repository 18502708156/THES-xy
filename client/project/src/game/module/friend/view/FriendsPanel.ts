class FriendsPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "我的关注"
    windowTitleIconName = "好友"
    /////////////////////////////////////////////////////////////////////////////
    // MyFriendSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected allGiveBtn: eui.Button;
    protected pageBtn: PageButton;
    protected deleteBtn: eui.Button;
    protected giveCountTxt: eui.Label;
    protected friendsTxt: eui.Label;
    protected scroller: eui.Scroller;
    /////////////////////////////////////////////////////////////////////////////
    protected dataProvider: eui.ArrayCollection;
    protected curPage = 1;
    public constructor() {
        super()
    }

    public childrenCreated() {
        this.list.itemRenderer = FriendItem
    }

    public OnOpen(...param: any[]) {
        this.currentState = "normal";
        GameGlobal.FriendModel.FriendData.curState = "friend";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage)
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent)
        this._AddClick(this.allGiveBtn, this.onClick);
        this._AddClick(this.deleteBtn, this.onClick);

        this.pageBtn.setPage(1);
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.friendsDate.slice());
        this.list.dataProvider = this.dataProvider
        this.recoverTouchPos();
        this.UpdateContent();
    }
    UpdateContent() {
        let maxPage = GameGlobal.FriendModel.FriendData.friendsDate.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage))
        }

        if (this.currentState == "normal") {
            this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.friendsDate.slice());
            this.allGiveBtn.visible = GameGlobal.FriendModel.friendsNum > 0;
            this.deleteBtn.visible = GameGlobal.FriendModel.friendsNum > 0;
        }
        else {
            let arr = GameGlobal.FriendModel.FriendData.friendsDate.slice()
            this.dataProvider.replaceAll(arr.reverse());
        }
        this.list.dataProvider = this.dataProvider.length > 0 ? this.dataProvider : new eui.ArrayCollection([]);

        let friendConfig = GameGlobal.Config.FriendBaseConfig;
        let friendData = GameGlobal.FriendModel.FriendData;
        let vipConfig = GameGlobal.Config.VipPrivilegeConfig;
        this.giveCountTxt.text = `${friendData.curCoinNum}/${friendConfig.givecoin}`;
        this.friendsTxt.text = `${GameGlobal.FriendModel.friendsNum}/${vipConfig[GameGlobal.actorModel.vipLv].friendnum}`;
    }

    changePage(page: number) {
        this.SetPos((page - 1) * this.scroller.width)
        this.curPage = page;
    }

    private SetPos(pos: number): void {
        let touch = this.scroller.$Scroller[8]
        touch.maxScrollPos = this.list.contentWidth
        touch.throwTo(pos);
    }

    private recoverTouchPos() {
        let touch = this.scroller.$Scroller[8]
        touch.maxScrollPos = this.list.contentWidth
        touch.currentScrollPos = 0;
    }
    onClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.deleteBtn:
                this.currentState = "delete"
                GameGlobal.FriendModel.FriendData.curState = "delete";

                let arr = GameGlobal.FriendModel.FriendData.friendsDate.slice()
                this.list.dataProvider = new eui.ArrayCollection(arr.reverse());

                this.pageBtn.setPage(1);
                this.recoverTouchPos();
                this.UpdateContent();

                break;
            case this.allGiveBtn:
                if (this.currentState == "delete") {
                    this.currentState = "normal"
                    GameGlobal.FriendModel.FriendData.curState = "friend";

                    this.list.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.friendsDate);
                    this.pageBtn.setPage(1);
                    this.recoverTouchPos();
                    this.UpdateContent();
                }
                else
                    GameGlobal.FriendModel.sentAllGive();
                break;
        }
    }
}
