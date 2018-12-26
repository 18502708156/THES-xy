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
var LadderStarListView = (function () {
    function LadderStarListView(dwImg, level, startGroup) {
        this.dwImg = dwImg;
        this.starGroup = startGroup;
        this.starGroup.itemRenderer = LadderStarItem;
        // this.level = level
    }
    /**
     * 设置奖牌等级
     */
    LadderStarListView.prototype.setLvAndRank = function (config) {
        if (config == null) {
            return;
        }
        this.dwImg.source = LadderConst.GetMiddleIcon(config.showType);
        // LadderConst.SetGradeInfo(this.level, config.type)
        // this.level.text = config.showLevel
    };
    LadderStarListView.prototype._GetBoolList = function (len, show) {
        var list = [];
        for (var i = 1; i <= len; ++i) {
            list.push(i <= show);
        }
        return list;
    };
    /**
     * 更新星星状态显示
     */
    LadderStarListView.prototype.UpdataStarInfo = function (fullStar, curStar) {
        this.m_FullStar = fullStar;
        this.starGroup.dataProvider = new eui.ArrayCollection(this._GetBoolList(fullStar, curStar));
        this.starGroup.validateNow();
        var isShow = true;
        // this.level.visible = isShow
        // this.bg.visible = isShow
        this.starGroup.visible = isShow;
        if (!isShow) {
            this.dwImg.verticalCenter = 0;
        }
    };
    ;
    /**
     * 星星特效
     */
    LadderStarListView.prototype.upStarStatu = function (index, num, light) {
        var _this = this;
        if (light === void 0) { light = false; }
        var times = num;
        if (light) {
            if (index >= this.m_FullStar) {
                var win = this.GetView();
                if (win) {
                    win.cheackIsChangeLevel(times);
                }
                return;
            }
        }
        else {
            if (index == 0) {
                var win = this.GetView();
                if (win) {
                    win.cheackIsChangeLevel(times);
                }
                return;
            }
        }
        var _index = light ? index + 1 : index;
        var self = this;
        if (!this.mc) {
            this.mc = new MovieClip;
        }
        var item = this.starGroup.getChildAt(_index - 1);
        this.mc.x = item.x + 39;
        this.mc.y = item.y + 36;
        this.mc.scaleX = this.mc.scaleY = 0.85;
        this.starGroup.addChild(this.mc);
        if (light) {
            --times;
            this.mc.loadUrl(ResDataPath.GetUIEffePath2("ladder/addstar"), true, 1, function () {
                DisplayUtils.removeFromParent(self.mc);
                item.currentState = "light";
                if (_index == _this.m_FullStar) {
                    var win = _this.GetView();
                    if (win)
                        win.cheackIsChangeLevel(times);
                }
                if (times > 0 && _index < _this.m_FullStar) {
                    _this.upStarStatu(_index, times, light);
                }
            });
        }
        else {
            --times;
            --_index;
            this.mc.loadUrl(ResDataPath.GetUIEffePath2("ladder/minusstar"), true, 1, function () {
                DisplayUtils.removeFromParent(self.mc);
                item.currentState = "black";
                if (_index == 0) {
                    var win = _this.GetView();
                    if (win)
                        win.cheackIsChangeLevel(times);
                }
            });
            times = 0;
        }
    };
    LadderStarListView.prototype.GetView = function () {
        var win = ViewManager.ins().getView(LadderResultWin);
        if (win && win.isShow())
            return win;
        return null;
    };
    /**
     * 等级上升特效
     */
    // showLvUp(currentLv) {
    // 	if (!this.level.visible) {
    // 		return
    // 	}
    // this.numLevel = currentLv;
    // this.lvUpCallback();
    // }
    /**
     * 奖牌上升特效
     * @param currentRank	奖牌
     */
    LadderStarListView.prototype.showRankUp = function (currentRank) {
        this.numRank = currentRank;
        this.rankMc = new MovieClip();
        this.rankMc.x = this.dwImg.x + this.dwImg.width * 0.5;
        this.rankMc.y = this.dwImg.y + this.dwImg.height * 0.5;
        this.rankMc.loadUrl(ResDataPath.GetUIEffePath2("ladder/ladderlvup"), true, 1);
        this.dwImg.parent.addChild(this.rankMc);
        this.RankChangeCallback();
    };
    ;
    /**
     * 等级下降特效
     * @param currentLv	等级
     */
    // showLvDown(currentLv) {
    // 	this.numLevel = currentLv;
    // 	this.level.text = this.numLevel;
    // };
    /**
     * 设置奖牌
     */
    LadderStarListView.prototype.RankChangeCallback = function () {
        this.dwImg.source = LadderConst.GetMiddleIcon(this.numRank);
        var tw = egret.Tween.get(this.dwImg);
        this.dwImg.alpha = 0;
        tw.wait(200).to({ 'alpha': 1 }, 700);
    };
    ;
    return LadderStarListView;
}());
__reflect(LadderStarListView.prototype, "LadderStarListView");
var LadderStarItem = (function (_super) {
    __extends(LadderStarItem, _super);
    function LadderStarItem() {
        var _this = _super.call(this) || this;
        _this.width = _this.height = 75;
        return _this;
    }
    LadderStarItem.prototype.dataChanged = function () {
        this.currentState = this.data == true ? "light" : "black";
    };
    return LadderStarItem;
}(eui.ItemRenderer));
__reflect(LadderStarItem.prototype, "LadderStarItem");
//# sourceMappingURL=LadderStarListView.js.map