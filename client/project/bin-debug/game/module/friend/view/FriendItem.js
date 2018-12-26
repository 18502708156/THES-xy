var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FriendItem = (function (_super) {
    __extends(FriendItem, _super);
    function FriendItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "FriendItemSkin";
        return _this;
    }
    FriendItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDeleteBtnClick, this);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
        this.btn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn0Click, this);
        this.playerAvatar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.iconClick, this);
        // MessageCenter.ins().addListener(MessageDef.FRIEND_DATA_REFRESH, this.fansChange, this)
        this.currentState = GameGlobal.FriendModel.FriendData.curState;
        this.btn0.visible = false;
        // this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
        //     MessageCenter.ins().removeAll(this)
        // }, this)
    };
    FriendItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var info;
        if (egret.is(this.data, "Sproto.player_whole_data"))
            info = this.data;
        else {
            for (var key in this.data) {
                if (egret.is(this.data[key], "Sproto.player_whole_data")) {
                    info = this.data[key];
                    break;
                }
            }
        }
        if (info != null) {
            this.info = info;
            this.playerAvatar["face"].source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.playerAvatar["imgFrame"].source = ResDataPath.GetHeadFrameImgName(info.headframe);
            this.nameTxt.text = info.name;
            this.lvTxt.text = info.level;
            this.gangNameTxt.text = info.guildName;
            this.powerText.text = info.power;
            var offlineTime = DateUtils.format_4((GameServer.serverTime - info.offlineTime) * 1000);
            this.onLineTxt.textFlow = TextFlowMaker.generateTextFlow(info.offlineTime == 0 ? "在线" : "|C:" + Color.Red + "&T:" + offlineTime + "\u5728\u7EBF");
            // this.vipTxt.visible = info.vip > 0;
            this.vipIcon.setVipLv(info.vip, true);
            if (this.currentState == "friend")
                this.btn.visible = !this.data.gift;
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
    };
    FriendItem.prototype.onBtnClick = function () {
        switch (this.currentState) {
            case "friend":
                GameGlobal.FriendModel.sentGive(this.info.dbid);
                break;
            case "fans":
                GameGlobal.FriendModel.sentTakeGive(this.info.dbid);
                break;
            case "blacklist":
                GameGlobal.FriendModel.sendRemoveBlacklist(this.info.dbid);
                break;
            case "referrer":
                GameGlobal.FriendModel.sendAddFriend(this.info.dbid);
                break;
            case "delete":
                ViewManager.ins().open(FriendTipsPanel, this.info);
                break;
        }
    };
    FriendItem.prototype.onBtn0Click = function () {
        GameGlobal.FriendModel.sendAddFriend(this.info.dbid);
    };
    FriendItem.prototype.iconClick = function () {
        ViewManager.ins().open(PlayerDetailsPanel, this.info.dbid);
    };
    FriendItem.prototype.onDeleteBtnClick = function () {
        ViewManager.ins().open(FriendTipsPanel, this.info);
    };
    FriendItem.prototype.fansChange = function () {
        if (this.currentState == "fans")
            this.btn0.visible = !GameGlobal.FriendModel.isFriend(this.info.dbid);
    };
    return FriendItem;
}(eui.ItemRenderer));
__reflect(FriendItem.prototype, "FriendItem");
//# sourceMappingURL=FriendItem.js.map