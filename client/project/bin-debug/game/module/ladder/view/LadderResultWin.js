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
var LadderResultWin = (function (_super) {
    __extends(LadderResultWin, _super);
    function LadderResultWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "LadderResultWinSkin";
        _this.list.itemRenderer = ItemBase;
        // this.bg2.x += this.bg2.anchorOffsetX = 80
        // this.bg2.y += this.bg2.anchorOffsetY = 50
        _this.starList = new LadderStarListView(_this.dwImg, _this.level, _this.starGroup);
        return _this;
    }
    /**
     * @param isWin: boolean  		是否胜利
     * @param list: RewardData[]  	奖励数据列表
     * @param upgrade: number 		之前的段位
     * @param upStar: number   		之前的星星
     * @param changeStar: number   		加了多少星
     */
    LadderResultWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.isWin = param[0]; //是否胜利	
        var list = param[1]; //奖励数据列表	
        var upgrade = param[2]; //之前的level
        var upStar = param[3]; //之前的id
        var changeStar = param[4]; //加了多少星
        this.imgTitle.source = this.isWin ? "ui_bm_shengli" : "ui_bm_shibai";
        // this.currentState = this.isWin ? "win" : "lose"
        this.m_BtnName = this.isWin ? "领取奖励" : "退出",
            this.m_TempTime = 5;
        this.updateCloseBtnLabel();
        this.AddTimer(1000, this.m_TempTime, this.updateCloseBtnLabel);
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.refushStarInfo(upgrade, upStar, changeStar);
        this.AddClick(this.closeBtn, this.CloseSelf);
        // this.playEffect()
        // this.playTitleTween()
    };
    /**
    * 提升后的回调
    */
    // playEffect() {
    // 	this.starBg.visible = true
    // 	egret.Tween.removeTweens(this.starBg)
    // 	let tween = egret.Tween.get(this.starBg, { loop: true })
    // 	tween.to({ "rotation": 360 }, 2000)
    // 	// tween.play()
    // }
    LadderResultWin.prototype.OnClose = function () {
        // egret.Tween.removeTweens(this.starList);
        // egret.Tween.removeTweens(this.starBg)
        // DisplayUtils.removeFromParent(this.mc);
        if (GameMap.fubenID > 0) {
            GameGlobal.RaidMgr.ExitFbRewardAndEnterMap();
        }
        // ViewManager.ins().open(LadderWin)
    };
    /**
     * 更新界面
     */
    LadderResultWin.prototype.refushStarInfo = function (grade, star, changeStart) {
        var _this = this;
        var config = GameGlobal.Ladder.GetLevelConfig(grade);
        if (config == null) {
            return;
        }
        this.upGrade = grade;
        this.upStar = star;
        //更新段位星星
        this.starList.UpdataStarInfo(config.needstar, star);
        LadderConst.SetGradeInfo(this.level, grade);
        this.lastType = config.showType;
        this.lastLevel = config.showLevel;
        // 如果当前等级没有需要显示的星星，则不需要增加数量
        // if (Ladder.GetStatuByLevel(level) == 0) {
        // 	starNum = 0
        // }
        var starNum = Math.abs(changeStart);
        //设置星星状态
        if (this.isWin) {
            this.star1.visible = starNum >= 1;
            this.star1.currentState = "light";
            this.star2.visible = starNum >= 2;
            this.star2.currentState = "light";
        }
        else {
            this.star1.visible = starNum >= 1;
            this.star1.currentState = "black";
            this.star2.visible = starNum >= 2;
            this.star2.currentState = "black";
        }
        // if (this.starList) {
        // 	this.starList.x = 142;
        // }
        //星级奖励：
        this.upStarGroup.visible = starNum != 0;
        //延迟0.5秒播放星星改变动画
        this.delayTime = egret.setTimeout(function () {
            egret.clearTimeout(_this.delayTime);
            _this.setStarInfoChange(star, starNum);
        }, this, 500);
    };
    /**
     * 星星数量改变
     * @param index	当前数量
     * @param num	增加数量
     */
    LadderResultWin.prototype.setStarInfoChange = function (curStar, num) {
        if (num > 0) {
            this.starList.upStarStatu(curStar, num, this.isWin);
        }
    };
    LadderResultWin.prototype.cheackIsChangeLevel = function (num) {
        var _this = this;
        if (this.upGrade == GameGlobal.Ladder.grade && this.upStar == GameGlobal.Ladder.star) {
            return;
        }
        var t = egret.Tween.get(this.starList);
        t.to({ "alpha": 1 }, 600).call(function () {
            var config = GameGlobal.Ladder.GetSelfLevelConfig();
            _this.starList.UpdataStarInfo(config.needstar, GameGlobal.Ladder.star);
            if (_this.isWin && num >= 1) {
                _this.starList.upStarStatu(0, num, _this.isWin);
            }
            var currentType = config.showType;
            var currentLevel = config.showLevel;
            // if (this.lastLevel > currentLevel) {
            // 	this.starList.showLvUp(currentLevel);
            // } else if (this.lastLevel < currentLevel) {
            // 	this.starList.showLvDown(currentType);
            // }
            LadderConst.SetGradeInfo(_this.level, config.type);
            if (_this.lastType < currentType) {
                _this.starList.showRankUp(currentType);
            }
            egret.Tween.removeTweens(_this.starList);
        }, this);
    };
    /**
     * 倒计时关闭界面
     */
    LadderResultWin.prototype.updateCloseBtnLabel = function () {
        this.m_TempTime--;
        if (this.m_TempTime <= 0)
            ViewManager.ins().close(this);
        this.closeBtn.label = this.m_BtnName + "(" + this.m_TempTime + "s)";
    };
    LadderResultWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return LadderResultWin;
}(BaseEuiView));
__reflect(LadderResultWin.prototype, "LadderResultWin");
//# sourceMappingURL=LadderResultWin.js.map