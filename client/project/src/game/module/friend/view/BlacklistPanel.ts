class BlacklistPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "黑名单";
    /////////////////////////////////////////////////////////////////////////////
    // FriendBlacklistSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected blacklistTxt: eui.Label;
    protected pageBtn: PageButton;
    /////////////////////////////////////////////////////////////////////////////
    protected dataProvider: eui.ArrayCollection;
    protected curPage = 1;
    public constructor() {
        super()
    }

    public childrenCreated() {
        this.list.itemRenderer = FriendItem;
    }

    public OnOpen(...param: any[]) {
        GameGlobal.FriendModel.FriendData.curState = "blacklist";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage)
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent)
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.blacklistData);
        this.list.dataProvider = this.dataProvider;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
        this.UpdateContent();
    }
    UpdateContent() {
        let maxPage = GameGlobal.FriendModel.FriendData.blacklistData.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage))
        }
        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.blacklistData);

        let friendConfig = GameGlobal.Config.FriendBaseConfig;
        this.blacklistTxt.text = `${GameGlobal.FriendModel.blacklistNum}/${friendConfig.blacklist}`;
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
}
