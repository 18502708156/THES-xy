class RoleJingMaiPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main;

	/////////////////////////////////////////////////////////////////////////////
	// RoleJingMaiSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected powerLabel: PowerLabel;
	protected stepLabel: eui.Label;
	protected tattr: eui.Label;
	protected tname1: eui.Label;
	protected tname11: eui.Label;
	protected tname2: eui.Label;
	protected tname3: eui.Label;
	protected tname4: eui.Label;
	protected tname5: eui.Label;
	protected tname6: eui.Label;
	protected tname7: eui.Label;
	protected tname8: eui.Label;
	protected tname9: eui.Label;
	protected tname10: eui.Label;
	protected conGroup: eui.Group;
	protected selectEff: eui.Image;
	protected attGroup: eui.Group;
	protected totalAttr0: eui.Label;
	protected totalAttr1: eui.Label;
	protected totalAttr2: eui.Label;
	protected totalAttr3: eui.Label;
	protected totalAttr4: eui.Label;
	protected totalAttr5: eui.Label;
	protected totalAttr6: eui.Label;
	protected totalAttr7: eui.Label;
	protected needItemView: NeedItemView;
	protected btnUp: eui.Button;
	protected fullLabel: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	/**配置表数据 */
	private config;
	/**是否顶级 */
	private isTop: boolean = false;
	/**第几重 */
	private step: number;
	/**第几级 */
	private level: number;

	public constructor() {
		super()
		this.skinName = "RoleJingMaiSkin";
		this.config = GameGlobal.Config.JingMaiLevelConfig;
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_30);
	}
	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle('经脉');
		this.AddClick(this.btnUp, this.onCkick);
		// this.AddClick(this.conGroup, this.onCkick);
		MessageCenter.ins().dispatch(MessageDef.JINGMAI_DATA_UPDATE);
		this.observe(MessageDef.JINGMAI_DATA_UPDATE, this.UpdateContent);
		this.UpdateContent();
	}

	private onCkick(e: egret.TouchEvent) {
		if (e.target == this.btnUp) {
			if (this.isTop) {
				UserTips.ins().showTips('经脉已达顶级');
				return;
			}
			let item = this.config[0 == this.level ? 1 : this.level].itemid;
			if (UserBag.CheckEnough(item.id, item.count)) {
				GameGlobal.JingMaiData.sendJingMaiUpLevel();
				UserTips.ins().showTips('升级成功');
			}
		}
		// else {
		// 	let index = this.conGroup.getChildIndex(e.target);
		// 	this.showAttr(this.step * JingMaiData.MAX_LEVEL + (index + 1));
		// }
	}

	private showAttr(lv): void {
		let config = GameGlobal.Config.JingMaiLevelConfig[this.isTop ? lv - 1 : lv];
		this.tattr.text = AttributeData.getAttStr(config.attr, 0, 1, '：');
	}

	private UpdateContent(): void {
		let i = 1, len = JingMaiData.MAX_LEVEL;
		this.level = GameGlobal.JingMaiData.level;
		this.isTop = null == this.config[this.level + 1];
		this.fullLabel.visible = this.isTop
		this.attGroup.visible = !this.isTop
		this.step = this.level / len >> 0;
		let lv = this.level % len;
		if (this._IsMaxLv(this.level))
		{
			lv = JingMaiData.MAX_LEVEL
			this.step -= 1
		}
		let data;
		let icon: eui.Image;
		let txt: eui.Label;
		for (i; i <= len; i++) {
			data = this.config[i + this.step * len];
			if (data) {
				txt = this['tname' + i];
				txt.text = data.name;
				txt.textColor = i > lv ? 0x94999b : 0x019704;
				icon = this.conGroup.getChildAt(i - 1) as eui.Image;
				icon.source = i > lv ? 'ui_jm_bm_tupo02' : 'ui_jm_bm_tupo01';
				if (i == len) icon.scaleX = icon.scaleY = 1.2;
				else icon.scaleX = icon.scaleY = 1;
			}
		}
		let attr;
		for (i = 0; i < 8; i++) {
			attr = GameGlobal.JingMaiData.totalAttrs[i];
			if (attr) {
				this['totalAttr' + i].text = AttributeData.getAttStrByType(attr, 0, "+", false, '#682f00');
			}
			else {
				this['totalAttr' + i].text = '';
			}
		}
		this.powerLabel.text = ItemConfig.CalcAttrScoreValue(GameGlobal.JingMaiData.totalAttrs);
		this.showAttr(0 == this.level ? 1 : this.level)
		let item = this.config[0 == this.level ? 1 : this.level].itemid;
		if (item) {
			this.needItemView.SetItemId(item.id, item.count);
		}

		let tenStep = (this.step + 1) / 10 >> 0;
		let numStep = (this.step + 1) % 10;
		let str = '';
		if (tenStep > 0) {
			if (tenStep > 1) {
				str = StringUtils.numTenToChinese(tenStep) + '十';
				if (numStep > 0) str += StringUtils.numTenToChinese(numStep) + '重';
				else str += '重';
			} else {
				if (numStep > 0) str = '十' + StringUtils.numTenToChinese(numStep) + '重';
				else str = '十重';
			}
		}
		else {
			str = StringUtils.numTenToChinese(this.step + 1) + '重';
		}
		this.stepLabel.text = str;
		this.btnUp.label = 0 == this.level ? '激 活' : 10 == lv ? '突 破' : '升 级';
		this.selectEff.visible = true;
		this.selectEff.x = this.conGroup.getChildAt(lv).x - 8 >> 0;
		this.selectEff.y = this.conGroup.getChildAt(lv).y - 8 >> 0;
		if (lv == len - 1) this.selectEff.scaleX = this.selectEff.scaleY = 1.2;
		else this.selectEff.scaleX = this.selectEff.scaleY = 1;
		if (this.isTop) {
			// txt = this['tname' + lv];
			txt = this.tname10
			txt.text = this.config[this.level].name;
			txt.textColor = 0x019704;
			icon = this.conGroup.getChildAt(lv) as eui.Image;
			icon.source = 'ui_jm_bm_tupo01';
			this.selectEff.visible = false;
		}
	}

	public OnClose() {
		this.removeEvents();
		this.removeObserve();
	}

	private _IsMaxLv(lv) {
		return this.config[lv+1] == null
	}
}