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
var MainChapterInfoView = (function (_super) {
    __extends(MainChapterInfoView, _super);
    function MainChapterInfoView() {
        return _super.call(this) || this;
    }
    MainChapterInfoView.prototype.childrenCreated = function () {
        this.imgRed.visible = false;
        this._AddClick(this.imgMap, this._Onclick);
        this._AddClick(this.groupLine, this._Onclick);
    };
    MainChapterInfoView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mType = param[0];
        this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateContent);
        this.observe(MessageDef.MAIN_CITY_INFO, this.UpdateContent);
        this.UpdateContent();
    };
    MainChapterInfoView.prototype.OnClose = function () {
    };
    MainChapterInfoView.prototype.UpdateContent = function () {
        this.lbSeat.visible = this.mType != MainChapterInfoView.CITY_TYPE;
        this.groupLine.visible = !this.lbSeat.visible;
        var userFb = GameGlobal.UserFb;
        this.lbMap.text = "第" + userFb.guanqiaID + "关";
        this.lbSeat.text = userFb.Desc;
        this.imgRed.visible = GameGlobal.UserFb.chapterRewardList.length > 0;
        if (this.mType == MainChapterInfoView.FIGHT_TYPE) {
            return;
        }
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (!info)
            return;
        this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.people);
        this.labLinerNo.text = (info.channelid || 0) + "\u7EBF";
    };
    MainChapterInfoView.prototype._Onclick = function (e) {
        switch (e.currentTarget) {
            case this.imgMap:
                ViewManager.ins().open(WorldMapPanel);
                break;
            case this.groupLine:
                if (this.mType == MainChapterInfoView.FIGHT_TYPE)
                    return;
                ViewManager.ins().open(ChangeLinerWin);
                break;
        }
    };
    /////////////////////////////////////////////////////////////////////////////
    MainChapterInfoView.FIGHT_TYPE = 1;
    MainChapterInfoView.CITY_TYPE = 2;
    return MainChapterInfoView;
}(BaseView));
__reflect(MainChapterInfoView.prototype, "MainChapterInfoView", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MainChapterInfoView.js.map