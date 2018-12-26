class FansPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "我的粉丝";
    /////////////////////////////////////////////////////////////////////////////
    // FansSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected allGiveBtn: eui.Button;
    protected pageBtn: PageButton;
    protected fansCountTxt: eui.Label;
    protected giveCountTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    protected dataProvider: eui.ArrayCollection
    protected curPage = 1;

    public constructor() {
        super()
    }

    public childrenCreated() {
        this.list.itemRenderer = FriendItem
    }

    public OnOpen(...param: any[]) {
        GameGlobal.FriendModel.FriendData.curState = "fans";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage)
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent)

        this._AddClick(this.allGiveBtn, this.onClick);
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.fansData)
        this.list.dataProvider = this.dataProvider;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
        this.UpdateContent();
    }
    UpdateContent() {
        let maxPage = GameGlobal.FriendModel.FriendData.fansData.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage))
        }

        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.fansData);
        this.dataProvider.length > 0 ? null : this.list.dataProvider = new eui.ArrayCollection([]);

        let friendConfig = GameGlobal.Config.FriendBaseConfig;
        let friendData = GameGlobal.FriendModel.FriendData;
        this.giveCountTxt.text = `${friendData.takeCoinNum}/${friendConfig.receivecoin}`;
        this.fansCountTxt.text = `${GameGlobal.FriendModel.fansNum}/${friendConfig.fanscount}`;

        this.allGiveBtn.visible = GameGlobal.FriendModel.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin;
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
            case this.allGiveBtn:
                GameGlobal.FriendModel.sentTakeAllCoin();
                break;
        }
    }
}
