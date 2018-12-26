class TipsView extends BaseEuiView {

	static LAYER_LEVEL = LayerManager.UI_Tips

	private m_Group: eui.Group
	private labCount = 0
	private list: TipsItem[] = []
	private goodEquipList = []
	private equipTip1: TipsGoodEquip
	private equipTip2: TipsGoodEquip

	private isWait

	private static START_Y = 640
	private static END_Y_OFFSET = 60
	private static MAX_ITEMS = 15

	private m_StrList: string[][] = []

	private m_CacheList: TipsItem[] = []

	initUI() {
		super.initUI()
		this.touchChildren = false;
		this.touchEnabled = false;
		this.m_Group = new eui.Group
		this.m_Group.horizontalCenter = 0
		this.m_Group.width = 0
		this.addChild(this.m_Group)
		this.equipTip1 = new TipsGoodEquip();
		this.equipTip2 = new TipsGoodEquip();
	};
    /**
     * 显示tips
     * @param str
     */
	showTips(str: string): void {
		this.m_StrList.push([str])
		this._StartUpdate()
	}

	showIconTips(str: string, src: string): void {
		this.m_StrList.push([str, src])
		this._StartUpdate()
	}

	private _Cache(index: number): void {
		let item = this.list[index]
		if (!item) {
			return
		}
		this.m_Group.removeChild(item)
		this.list.splice(index, 1)
		if (this.m_CacheList.length < 25) {
			this.m_CacheList.push(item)
		}
	}

	private CreateTips(): void {
		if (this.m_StrList.length < 1) {
			return
		}

		let time = egret.getTimer()
		let str = this.m_StrList.shift()
		var tips: TipsItem = this.m_CacheList.pop() || new TipsItem
		tips.labelText = str[0]
		tips.iconName = str[1]
		this.m_Group.addChild(tips);
		this.list.unshift(tips)
		let center = GameGlobal.StageUtils.GetHeight() >> 1
		tips.y = center
		for (let i = this.list.length - 1; i >= 0; --i) {
			let item = this.list[i]
			if (item.y < 0) {
				this._Cache(i)
				continue
			}
			item.endPos = center - i * item.height
			item.speed = (item.y - item.endPos) / 500;
		}
	}

	private m_IsUpadte = false
	private m_PreTime = 0

	private _StartUpdate() {
		if (this.m_IsUpadte) {
			return
		}
		this.m_IsUpadte = true
		this.m_PreTime = egret.getTimer()
		egret.startTick(this.Update, this)
	}

	private _StopUpdate() {
		if (!this.m_IsUpadte) {
			return
		}
		this.m_IsUpadte = false
		egret.stopTick(this.Update, this)
	}

	private Update(timeStamp: number): boolean {
		let delta = timeStamp - this.m_PreTime
		this.m_PreTime = timeStamp

		for (let i = this.list.length - 1; i >= 0; --i) {
			let item = this.list[i]
			let y = item.y - delta * item.speed
			item.y = Math.max(item.endPos, y)
			if (!item.Update(delta)) {
				this._Cache(i)
			}
		}

		this.CreateTips()

		if (this.m_StrList.length < 1 && this.list.length < 1) {
			this._StopUpdate()
		}
		return false
	}

	showGoodEquipTip(item) {
		this.goodEquipList.push(item);
		if (TimerManager.ins().isExists(this.goodEquipTimer, this)) {
		}
		else {
			TimerManager.ins().doTimer(16, 0, this.goodEquipTimer, this);
		}
	};
	goodEquipTimer() {
		if (this.goodEquipList.length == 0 || this.isWait) {
			return;
		}
		var equipTip = undefined;
		if (!this.equipTip1.isUsing) {
			equipTip = this.equipTip1;
		}
		if (!this.equipTip2.isUsing) {
			equipTip = this.equipTip2;
		}
		if (equipTip == undefined) {
			return;
		}
		equipTip.x = -235
		equipTip.y = 1000;
		equipTip.alpha = 1;

		this.m_Group.addChild(equipTip);
		equipTip.isUsing = true;
		this.isWait = true;
		var itemData = this.goodEquipList.pop();
		equipTip.data = itemData;
		var t = egret.Tween.get(equipTip);
		t.to({ "y": 850 }, 500).call(() => {
			this.isWait = false;
		}).wait(1000).to({ "alpha": 0 }, 1000).call(() => {
			// equipTip.visible = false;
			equipTip.isUsing = false;
			this.m_Group.removeChild(equipTip);
		});
		var otherEquipTip;
		if (equipTip == this.equipTip1) {
			otherEquipTip = this.equipTip2;
		}
		else {
			otherEquipTip = this.equipTip1;
		}
		if (otherEquipTip.isUsing) {
			egret.Tween.removeTweens(otherEquipTip);
			var tt = egret.Tween.get(otherEquipTip);
			tt.to({ "y": 700, "alpha": 0 }, 1000).wait(300).call(() => {
				// otherEquipTip.visible = false;
				otherEquipTip.isUsing = false;
				this.m_Group.removeChild(otherEquipTip);
			});
		}
	};
}
