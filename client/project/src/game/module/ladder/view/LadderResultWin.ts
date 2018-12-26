class LadderResultWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // LadderResultWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgTitle: eui.Image;
    protected list: eui.List;
    protected upStarGroup: eui.Group;
    protected star1: eui.Component;
    protected star2: eui.Component;
    protected dwImg: eui.Image;
    protected starGroup: eui.DataGroup;
    protected closeBtn: eui.Button;
    protected level: eui.Component;
    /////////////////////////////////////////////////////////////////////////////



	private starList: LadderStarListView
	private isWin: boolean
	private m_TempTime: number
	private upGrade: number
	private upStar: number
	private lastType
	private lastLevel
	private delayTime
	private m_BtnName: string

	public constructor() {
		super();

		this.skinName = "LadderResultWinSkin"
		this.list.itemRenderer = ItemBase

		// this.bg2.x += this.bg2.anchorOffsetX = 80
		// this.bg2.y += this.bg2.anchorOffsetY = 50

		this.starList = new LadderStarListView(this.dwImg, this.level, this.starGroup)

	}

    /**
     * @param isWin: boolean  		是否胜利
     * @param list: RewardData[]  	奖励数据列表
     * @param upgrade: number 		之前的段位
     * @param upStar: number   		之前的星星
     * @param changeStar: number   		加了多少星
     */
	OnOpen(...param: any[]) {
		this.isWin = param[0]; //是否胜利	
		var list = param[1]; //奖励数据列表	
		var upgrade = param[2]; //之前的level
		var upStar = param[3]; //之前的id
		var changeStar = param[4]; //加了多少星

		this.imgTitle.source = this.isWin ? "ui_bm_shengli" : "ui_bm_shibai"
		// this.currentState = this.isWin ? "win" : "lose"
		this.m_BtnName = this.isWin ? "领取奖励" : "退出",

		this.m_TempTime = 5
		this.updateCloseBtnLabel()
		this.AddTimer(1000, this.m_TempTime, this.updateCloseBtnLabel)

		this.list.dataProvider = new eui.ArrayCollection(list)
		this.refushStarInfo(upgrade, upStar, changeStar)
		this.AddClick(this.closeBtn, this.CloseSelf)
		// this.playEffect()
		// this.playTitleTween()
	}

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

	OnClose() {
		// egret.Tween.removeTweens(this.starList);
		// egret.Tween.removeTweens(this.starBg)
		// DisplayUtils.removeFromParent(this.mc);
		if (GameMap.fubenID > 0) {
			GameGlobal.RaidMgr.ExitFbRewardAndEnterMap();
		}
		// ViewManager.ins().open(LadderWin)
	}

    /**
     * 更新界面
     */
	refushStarInfo(grade: number, star: number, changeStart: number) {
		var config = GameGlobal.Ladder.GetLevelConfig(grade);
		if (config == null) {
			return
		}
		this.upGrade = grade;
		this.upStar = star;

		//更新段位星星
		this.starList.UpdataStarInfo(config.needstar, star);
		LadderConst.SetGradeInfo(this.level, grade)
		this.lastType = config.showType;
		this.lastLevel = config.showLevel;

		// 如果当前等级没有需要显示的星星，则不需要增加数量
		// if (Ladder.GetStatuByLevel(level) == 0) {
		// 	starNum = 0
		// }
		let starNum = Math.abs(changeStart)

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
		this.upStarGroup.visible = starNum != 0
		//延迟0.5秒播放星星改变动画
		this.delayTime = egret.setTimeout(() => {
			egret.clearTimeout(this.delayTime);
			this.setStarInfoChange(star, starNum);
		}, this, 500);
	}

    /**
     * 星星数量改变
     * @param index	当前数量
     * @param num	增加数量
     */
	setStarInfoChange(curStar: number, num: number) {
		if (num > 0) {
			this.starList.upStarStatu(curStar, num, this.isWin);
		}
	}

	cheackIsChangeLevel(num: number) {
		if (this.upGrade == GameGlobal.Ladder.grade && this.upStar == GameGlobal.Ladder.star) {
			return;
		}
		var t = egret.Tween.get(this.starList);
		t.to({ "alpha": 1 }, 600).call(() => {
			var config = GameGlobal.Ladder.GetSelfLevelConfig();
			this.starList.UpdataStarInfo(config.needstar, GameGlobal.Ladder.star);
			if (this.isWin && num >= 1) {
				this.starList.upStarStatu(0, num, this.isWin);
			}

			var currentType = config.showType
			var currentLevel = config.showLevel;
			// if (this.lastLevel > currentLevel) {
			// 	this.starList.showLvUp(currentLevel);
			// } else if (this.lastLevel < currentLevel) {
			// 	this.starList.showLvDown(currentType);
			// }
			LadderConst.SetGradeInfo(this.level, config.type)
			if (this.lastType < currentType) {
				this.starList.showRankUp(currentType);
			}
			egret.Tween.removeTweens(this.starList);
		}, this);
	}

    /**
     * 倒计时关闭界面
     */
	updateCloseBtnLabel() {
		this.m_TempTime--;
		if (this.m_TempTime <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = this.m_BtnName + "(" + this.m_TempTime + "s)";
	}

	// playTitleTween() {
	// 	this.removeTitleTween();
	// 	var t = egret.Tween.get(this.bg2);
	// 	if (t) {
	// 		this.bg2.scaleX = 3
	// 		this.bg2.scaleY = 3
	// 		this.bg2.alpha = 0.2
	// 		t.to({
	// 			"scaleX": .7,
	// 			"scaleY": .7,
	// 			"alpha": .9
	// 		}, 150).to({
	// 			"scaleX": 1,
	// 			"scaleY": 1,
	// 			"alpha": 1
	// 		}, 100)
	// 	}
	// }

	// removeTitleTween() {
	// 	this.bg2 && egret.Tween.removeTweens(this.bg2)
	// }
}