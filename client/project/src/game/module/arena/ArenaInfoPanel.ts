class ArenaInfoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "竞技场";

	/////////////////////////////////////////////////////////////////////////////
	// ArenaInfoSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected rankTxt: eui.BitmapLabel;
	protected myPower: PowerLabel;
	protected countTxt: eui.Label;
	protected timeTxt: eui.Label;
	protected buyBtn: eui.Button;
	protected cleanTxt: eui.Label;
	protected itemList: eui.List;
	protected rankBtn: eui.Button;
	protected mallBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////
	private m_roles: ArenaRoleItem[];
	private pkCount: number = 0;
	private remaintime: number = 0;
	private buyCount: number = 0;
	/**剩余购买次数 */
	private reaminCount: number;

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.m_roles[0]
		}
	}

	public constructor() {
		super()
	}

	protected childrenCreated(): void {
		this.m_roles = [];
		let i = 0;
		let role: ArenaRoleItem;
		for (i; i < 5; i++) {
			role = this['role' + i];
			role.touchEnabled = true;
			this.m_roles[i] = role;
		}
		this.itemList.itemRenderer = ItemBaseNotName;
	}

	private _OnClick(e: egret.TouchEvent) {
		if (egret.is(e.currentTarget, 'ArenaRoleItem')) {
			if (this.pkCount > 0) {
				if (UserFb.FinishAndCheckFighting()) {
					GameGlobal.Arena.sendArenaChallenge((e.currentTarget as ArenaRoleItem).getRank());
				}
			}
			else {
				UserTips.ins().showTips('挑战次数不足');
			}
			return;
		}
		switch (e.target) {
			case this.rankBtn:
				ViewManager.ins().open(RankWin, RankDataType.TYPE_ARENA);
				break
			case this.mallBtn:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_ARENA])
				break
			case this.buyBtn:
				let maxCount = GameGlobal.Arena.getVipBuyCount();
				if (maxCount == 0) {
					maxCount = GameGlobal.Arena.getMaxBuyCount();
				}
				let vipLv = GameGlobal.actorModel.vipLv;
				this.reaminCount = maxCount - this.buyCount;
				WarnWin.show('是否消耗|C:0xfff01e&T:' + GameGlobal.Arena.getPKCountBuy() + '元宝|购买|C:0xd27701&T:' + GameGlobal.Arena.getAddPKCount() + '次|挑战机会\n\n'
					+ '剩余购买次数：' + this.reaminCount + '\n\n' + 'VIP' + GameGlobal.actorModel.vipLv + '每天可购买' + maxCount + '次',
					this.okBuyHandler, this, null, null, "normal", { title: '购买提示' });
				break
		}
	}

	private okBuyHandler(...args): void {
		GameGlobal.Arena.sendArenaBuyCount();
	}

	public OnOpen() {

		let i = 0;
		let role: ArenaRoleItem;
		for (i; i < 5; i++) {
			role = this.m_roles[i];
			this.AddClick(role, this._OnClick);
		}

		this.AddClick(this.rankBtn, this._OnClick);
		this.AddClick(this.mallBtn, this._OnClick);
		this.AddClick(this.buyBtn, this._OnClick);

		this.observe(MessageDef.ARENA_INFO_DATA, this.getArenaInfoData);
		this.observe(MessageDef.ARENA_BUY_RESULT, this.getArenaBuyResult);

		GameGlobal.Arena.sendArenaData()
	}

	private getArenaInfoData(data: Sproto.cs_arena_info_response): void {
		let i = 0;
		let role: ArenaRoleItem;
		for (i; i < 5; i++) {
			role = this.m_roles[i];
			role.updateData(data.targets[i]);
		}
		this.buyCount = data.buycount;
		this.pkCount = data.pkcount;
		this.rankTxt.text = data.rank + '';
		this.countTxt.text = data.pkcount + '';
		this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.Arena.getRankRewards(data.rank));

		TimerManager.ins().remove(this.updateTimes, this);
		this.remaintime = data.remaintime;
		this.timeTxt.visible = data.remaintime > 0;
		this.timeTxt.text = DateUtils.getFormatBySecond(data.remaintime);//处理倒计时
		if (data.remaintime > 0) {
			this.AddTimer(1000, 0, this.updateTimes);
		}
	}

	private updateTimes(): void {
		this.remaintime--;
		if (this.remaintime <= 0) {
			this.timeTxt.visible = false;
			TimerManager.ins().remove(this.updateTimes, this);
		}
		this.timeTxt.text = DateUtils.getFormatBySecond(this.remaintime);
	}

	private getArenaBuyResult(data: Sproto.cs_buy_pk_response): void {
		if (!data.ret) {
			if (this.reaminCount <= 0) {
				UserTips.ins().showTips('购买剩余次数不足，购买失败！');
			}
			else UserTips.ins().showTips('元宝不足，购买失败！');
		}
		else {
			this.pkCount = data.pkcount;
			this.buyCount = data.buycount;
			this.countTxt.text = data.pkcount + '';
			this.timeTxt.visible = false
			TimerManager.ins().remove(this.updateTimes, this)
		}
	}

	public UpdateContent(): void {
		this.cleanTxt.text = GameGlobal.Arena.getRankRewardTimes();
		this.myPower.text = GameGlobal.actorModel.power;
	}
}