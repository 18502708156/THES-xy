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
var LadderLevelIcon = (function (_super) {
    __extends(LadderLevelIcon, _super);
    function LadderLevelIcon() {
        return _super.call(this) || this;
    }
    LadderLevelIcon.prototype.childrenCreated = function () {
        this._Update();
    };
    /**
     * 设置等级
     */
    LadderLevelIcon.prototype.SetRank2 = function (rank01) {
        this.m_Rank01 = rank01;
        this._Update();
    };
    LadderLevelIcon.prototype._Update = function () {
        if (this.$stage == null || this.m_Rank01 == null) {
            return;
        }
        var config = GameGlobal.Config.KingSportsConfig[this.m_Rank01];
        this.myRank.source = LadderConst.GetMiniIcon(config.showType);
        LadderConst.SetGradeInfo(this.level, this.m_Rank01);
        // // 钻石不显示段位
        // if (this.m_Rank01 == 4) {
        // 	this.m_Rank02 = 0
        // }
        // if (this.m_Rank02 > 0) {
        // this.level.source = LadderLevelIcon.GetLevelImgName(this.m_Rank02)
        this.currentState = "normal";
        // }
        // else {
        // 	this.currentState = "full"
        // 	// this.level.source = null;
        // 	this.level.visible = false
        // 	this.levelBg.visible = false;
        // }
    };
    LadderLevelIcon.GetLevelImgName = function (level) {
        return 'laddergradnum_' + level;
    };
    return LadderLevelIcon;
}(eui.Component));
__reflect(LadderLevelIcon.prototype, "LadderLevelIcon", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=LadderLevelIcon.js.map