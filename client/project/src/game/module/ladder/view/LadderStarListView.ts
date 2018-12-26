class LadderStarListView {

	// public level: eui.Component
	// public bg: eui.Image
	public starGroup: eui.DataGroup
	public dwImg: eui.Image

	mc: MovieClip
	// numLevel
	lvMc: MovieClip
	numRank
	rankMc: MovieClip

	public constructor(dwImg: eui.Image, level: eui.Component, startGroup: eui.DataGroup) {
		this.dwImg = dwImg
		this.starGroup = startGroup
		this.starGroup.itemRenderer = LadderStarItem
		// this.level = level
	}

    /**
     * 设置奖牌等级
     */
	setLvAndRank(config) {
		if (config == null) {
			return
		}
		this.dwImg.source = LadderConst.GetMiddleIcon(config.showType)
		// LadderConst.SetGradeInfo(this.level, config.type)
		// this.level.text = config.showLevel
	}

	private _GetBoolList(len: number, show: number): boolean[] {
		let list = []
		for (let i = 1; i <= len; ++i) {
			list.push(i <= show)
		}
		return list
	}

	private m_FullStar: number

    /**
     * 更新星星状态显示
     */
	public UpdataStarInfo(fullStar: number, curStar: number) {
		this.m_FullStar = fullStar

		this.starGroup.dataProvider = new eui.ArrayCollection(this._GetBoolList(fullStar, curStar))
		this.starGroup.validateNow()

		let isShow = true
		// this.level.visible = isShow
		// this.bg.visible = isShow
		this.starGroup.visible = isShow
		if (!isShow) {
			this.dwImg.verticalCenter = 0
		}
	};

    /**
     * 星星特效
     */
	upStarStatu(index: number, num: number, light = false) {
		var times = num;

		if (light) {
			if (index >= this.m_FullStar) {
				var win = this.GetView()
				if (win) {
					win.cheackIsChangeLevel(times);
				}
				return
			}
		} else {
			if (index == 0) {
				var win = this.GetView()
				if (win) {
					win.cheackIsChangeLevel(times);
				}
				return
			}
		}
		var _index = light ? index + 1 : index;
		var self = this;

		if (!this.mc) {
			this.mc = new MovieClip;
		}
		let item = this.starGroup.getChildAt(_index - 1) as eui.ItemRenderer

		this.mc.x = item.x + 39;
		this.mc.y = item.y + 36;
		this.mc.scaleX = this.mc.scaleY = 0.85
		this.starGroup.addChild(this.mc);
		if (light) {
			--times;
			this.mc.loadUrl(ResDataPath.GetUIEffePath2("ladder/addstar"), true, 1, () => {
				DisplayUtils.removeFromParent(self.mc)
				item.currentState = "light";

				if (_index == this.m_FullStar) {
					var win = this.GetView()
					if (win)
						win.cheackIsChangeLevel(times);
				}
				if (times > 0 && _index < this.m_FullStar) {
					this.upStarStatu(_index, times, light);
				}
			});
		}
		else {
			--times;
			--_index;
			this.mc.loadUrl(ResDataPath.GetUIEffePath2("ladder/minusstar"), true, 1, () => {
				DisplayUtils.removeFromParent(self.mc)
				item.currentState = "black";
				if (_index == 0) {
					var win = this.GetView()
					if (win)
						win.cheackIsChangeLevel(times);
				}
			});
			times = 0;
		}
	}

	private GetView(): LadderResultWin {
		var win = <LadderResultWin>ViewManager.ins().getView(LadderResultWin);
		if (win && win.isShow())
			return win
		return null
	}

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
	showRankUp(currentRank) {
		this.numRank = currentRank;
		this.rankMc = new MovieClip();
		this.rankMc.x = this.dwImg.x + this.dwImg.width * 0.5
		this.rankMc.y = this.dwImg.y + this.dwImg.height * 0.5
		this.rankMc.loadUrl(ResDataPath.GetUIEffePath2("ladder/ladderlvup"), true, 1);
		this.dwImg.parent.addChild(this.rankMc);

		this.RankChangeCallback()
	};

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
	RankChangeCallback() {
		this.dwImg.source = LadderConst.GetMiddleIcon(this.numRank)
		var tw = egret.Tween.get(this.dwImg);
		this.dwImg.alpha = 0;
		tw.wait(200).to({ 'alpha': 1 }, 700);
	};

    /**
     * 设置等级
     */
	// lvUpCallback() {
	// 	this.level.scaleX = 3.3;
	// 	this.level.scaleY = 3.3;
	// 	if (this.numLevel > 0 && this.numLevel < 6) {
	// 		this.level.text = this.numLevel;
	// 	}
	// 	else {
	// 		;
	// 		this.level.text = ""
	// 	}
	// 	var tw = egret.Tween.get(this.level);
	// 	tw.to({ "scaleX": 1, "scaleY": 1 }, 300).call(() => {
	// 		if (this.level.text == "") {

	// 		}
	// 	});
	// };
}

class LadderStarItem extends eui.ItemRenderer {

	public constructor() {
		super()
		this.width = this.height = 75
	}

	protected dataChanged() {
		this.currentState = this.data == true ? "light" : "black"
	}
}