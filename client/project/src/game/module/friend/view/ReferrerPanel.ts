class ReferrerPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "关注推荐"
    /////////////////////////////////////////////////////////////////////////////
    // ReferrerSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected friendsTxt: eui.Label;
    protected btn: eui.Button;
    protected pageBtn: PageButton;
    /////////////////////////////////////////////////////////////////////////////

    protected dataProvider: eui.ArrayCollection;
    protected curPage = 1;
    public mContext: PetMainPanel
    public constructor() {
        super()
    }

    public childrenCreated() {
        this.list.itemRenderer = FriendItem
    }

    public OnOpen(...param: any[]) {
        GameGlobal.FriendModel.FriendData.curState = "referrer";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage)
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent)
        GameGlobal.FriendModel.sendReferrer();
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.referrerDate);
        this.list.dataProvider = this.dataProvider;
        this._AddClick(this.btn, this.onClick);
        this.pageBtn.setPage(1);
        this.recoverTouchPos();

        this.UpdateContent();
    }
    UpdateContent() {
        let maxPage = GameGlobal.FriendModel.FriendData.referrerDate.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (maxPage && this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage))
        }
        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.referrerDate);
        this.list.dataProvider = this.dataProvider.length > 0 ? this.dataProvider : new eui.ArrayCollection([]);
        let vipConfig = GameGlobal.Config.VipPrivilegeConfig;
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
        GameGlobal.FriendModel.sentAllFollow();
    }
}
