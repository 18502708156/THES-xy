class RankingWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// RankingWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected rankTxt: eui.Label;
	protected selfPowerTxt: eui.Label;
	protected valueList: eui.List;
	protected keyList: eui.List;
	protected top1Panel: PHBShowPanel;
	protected top2Panel: PHBShowPanel;
	protected top3Panel: PHBShowPanel;
	protected scroller: eui.Scroller;
	protected pageBtn: PageButton;
	protected worshipBtn: eui.Button;
	protected zhanliTxt: eui.Label
	/////////////////////////////////////////////////////////////////////////////

	protected top1Item: ValueItem;
	protected top1ItemGroup: eui.Group;

	protected curSelectedIndex = 0;

	public constructor() {
		super();
		this.skinName = 'RankingWinSkin';
	}

	initUI() {
		super.initUI();
		this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle("排行榜");
	};
	initData() {
		this.keyList.itemRenderer = KeyItem;
		this.valueList.itemRenderer = ValueItem;
		this.keyList.dataProvider = GameGlobal.RankingModel.getKeyItemData();

		this.top1Item = new ValueItem();
		this.top1Item.x = 5;
		this.top1Item.y = 6;
		this.top1ItemGroup.addChild(this.top1Item);
	}
	/**排行榜
	 * @param 排行类型
	 */
	OnOpen(...param: any[]) {
		this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage)
		this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
		this.observe(MessageDef.PHB_REPOINT_UPDATE, this.updateWorship);
		this._AddItemClick(this.keyList, this.keyListItemClick)
		this.AddClick(this.worshipBtn, this.tap)
		this.keyList.selectedIndex = 0;
		// this.valueList.dataProvider =  GameGlobal.RankingModel.getValueItemData();
		GameGlobal.RankingModel.sendRank(1);
		this.curSelectedIndex = this.keyList.selectedIndex;

		this.pageBtn.setPage(1);
		this.recoverTouchPos();
	}
	keyListItemClick(e: egret.TouchEvent) {
		if (this.curSelectedIndex == this.keyList.selectedIndex)
			return;
		else
			this.curSelectedIndex = this.keyList.selectedIndex;
		GameGlobal.RankingModel.sendRank(this.keyList.selectedItem.type);
		this.pageBtn.setPage(1);
		this.recoverTouchPos();
	}

	tap() {
		GameGlobal.RankingModel.sendWorship();//膜拜协议
	}

	changePage(page: number) {
		this.SetPos((page - 1) * this.scroller.width)
	}

	private SetPos(pos: number): void {
		let touch = this.scroller.$Scroller[8]
		touch.maxScrollPos = this.valueList.contentWidth
		touch.throwTo(pos);
	}

	private recoverTouchPos() {
		let touch = this.scroller.$Scroller[8]
		touch.maxScrollPos = this.valueList.contentWidth
		touch.currentScrollPos = 0;
	}
	updateWorship() {
		for (let i = 0; i < this.keyList.numChildren; i++)
			(this.keyList.getChildAt(i) as KeyItem).redPointUpdate();
		this.worshipBtn.filters = GameGlobal.RankingModel.isRedPoint() ? null : Color.GetFilter();
		this.worshipBtn.touchEnabled = GameGlobal.RankingModel.isRedPoint();
	}
	UpdateContent() {
		let rep = GameGlobal.RankingModel.ranks[this.keyList.selectedItem.type]
		if (!rep) {
			return
		}
		if (rep.selfRank)
			this.rankTxt.text = '' + rep.selfRank;
		else
			this.rankTxt.text = "未上榜"
		if (rep.type == 2)
			this.zhanliTxt.text = "等级:"
		else
			this.zhanliTxt.text = "战力:"
		this.selfPowerTxt.text = CommonUtils.overLength( rep.value || 0  )

		this.top1Panel.hideAllPanel();
		this.top2Panel.hideAllPanel();
		this.top3Panel.hideAllPanel();
		this.top1Item.visible = false;
		let rankDatas = [];
		let rankDatasIndex = 0;
		for (let i = 0; i < rep.datas.length; i++) {
			let pos = rep.datas[i].pos;
			if (rep.datas[i].pos == 1) {

				let nListSelectedId = this.keyList.selectedIndex;
				RankingWin.showRolePanel(this.top1Panel, this.keyList.selectedItem.type, rep.datas[i])
				this.top1Item.data = rep.datas[i];
				this.top1Item.visible = true;
				this.top1Panel.setName(rep.datas[i].name, 0xFF5900);
				continue;
			}
			if (rep.datas[i].pos == 2) {
				RankingWin.showRolePanel(this.top2Panel, this.keyList.selectedItem.type, rep.datas[i])
				this.top2Panel.setName(rep.datas[i].name, 0xAF2BB7);
			}
			if (rep.datas[i].pos == 3) {
				RankingWin.showRolePanel(this.top3Panel, this.keyList.selectedItem.type, rep.datas[i])
				this.top3Panel.setName(rep.datas[i].name, 0x5A6EE7);
			}
			rankDatas[rankDatasIndex] = rep.datas[i];
			rankDatasIndex++;
		}

		this.valueList.dataProvider = new eui.ArrayCollection(rankDatas);
		this.pageBtn.setMax(Math.ceil(rankDatas.length / 8));
		this.updateWorship();
	}

	static showRolePanel(pPHBShowPanel: PHBShowPanel, nRankType: number, datas: Sproto.rank_data_list) {
		// rankPos -= 1;
		switch (nRankType) {
			case 1://战力
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
				if (!datas.outfairy)
					return
				pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
				break
			case 2://等级
				if (!datas.outwing)
					return
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
				if (!datas.outfairy)
					return
				pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
				break
			case 3://宠物
				if (!datas.outpet)
					return;
				pPHBShowPanel.setPetPanel(datas.outpet);
				break
			case 4://仙侣
				if (!datas.outxianlv)
					return
				pPHBShowPanel.setPetPanel(datas.outxianlv);
				break
			case 5://坐骑
				if (!datas.outride)
					return
				pPHBShowPanel.setPetPanel(GameGlobal.Config.RideSkinConfig[datas.outride].pid);
				break
			case 6://翅膀
				if (!datas.outwing)
					return
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
				break
			case 7://守护
				if (!datas.outfairy)
					return
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
				pPHBShowPanel.setTianXianPanel(GameGlobal.TianxModel.SkinConfig[datas.outfairy].pid);
				break
			case 8://神兵
				if (!datas.outweapon)
					return
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType));
				break
			case 9://玄女
				if (!datas.outtiannv)
					return
				pPHBShowPanel.setPetPanel(GameGlobal.Config.FemaleDevaSkinConfig[datas.outtiannv].pid);
				break
			case 10://天神
				if (!datas.outtianshen)
					return
				pPHBShowPanel.setPetPanel(datas.outtianshen);//
				break
			case 11://法阵
				if (!datas.outcircle)
					return;
				pPHBShowPanel.setPetPanel(datas.outxianlv, 30);
				pPHBShowPanel.setZhengFaPanel(GameGlobal.Config.CircleSkinConfig[datas.outcircle].pid);
				break
			case 12://仙位
				if (!datas.outposition)
					return;
				let sourcePath1 = AppearanceConfig.GetUIAppe(GameGlobal.Config.PositionSkinConfig[datas.outposition].pid)
				pPHBShowPanel.setXianWeiSource(sourcePath1.substring(sourcePath1.lastIndexOf("/") + 1))
				break
			case 13://通灵
				if (!datas.outpsychic)
					return;
				pPHBShowPanel.setPetPanel(datas.outpet, 15);
				pPHBShowPanel.setZhengFaPanel(GameGlobal.Config.PsychicSkinConfig[datas.outpsychic].pid);
				break
			case 14://兽魂
				if (!datas.outsoul)
					return;
				pPHBShowPanel.setPetPanel(datas.outpet);
				let sourcePath2 = AppearanceConfig.GetUIAppe(GameGlobal.Config.SoulSkinConfig[datas.outsoul].pid)
				pPHBShowPanel.setSouHunSource(sourcePath2);
				break
			case 15://花辇
				if (!datas.outflower)
					return;
				pPHBShowPanel.setPetPanel(GameGlobal.Config.FlowerSkinConfig[datas.outflower].pid);
				break
			case 16://灵气
				if (!datas.outnimbus)
					return
				let sourcePath3 = AppearanceConfig.GetUIPath(GameGlobal.Config.NimbusSkinConfig[datas.outnimbus].pid);
				pPHBShowPanel.setXianWeiSource(sourcePath3.substring(sourcePath3.lastIndexOf("/") + 1))
				break
			case 20://灵童
				if (!datas.outbaby)
					return
				pPHBShowPanel.setRole(GameGlobal.RankingModel.getShowById(datas, nRankType), 1, RoleShowDressType.ROLE);
				break
		}
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_86);
	}

}

class ValueItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RankingValueItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected rankingImage: eui.Image;
	protected roleNameTxt: eui.Label;
	protected vipIcon: VipIcon;
	protected lvTxt: eui.Label;
	protected powerTxt: eui.Label;
	protected topTxt: eui.Label;
	protected detailBtn: eui.Button
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "RankingValueItemSkin"
	}

	public childrenCreated() {
		super.childrenCreated()
		this.detailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this)
	}

	public dataChanged() {
		super.dataChanged()
		this.roleNameTxt.textColor = 0x6C310A;
		if (this.data.pos <= 3) {
			if (this.data.pos == 1)
				this.roleNameTxt.textColor = 0xFF5900;
			else if (this.data.pos == 2)
				this.roleNameTxt.textColor = 0xAF2BB7;
			else if (this.data.pos == 3)
				this.roleNameTxt.textColor = 0x5A6EE7;

			this.rankingImage.visible = true;
			this.rankingImage.source = "ui_phb_bm_" + this.data.pos;
			this.topTxt.visible = false;
		}
		else {
			this.rankingImage.visible = false;
			this.topTxt.visible = true;
			this.topTxt.text = '第' + this.data.pos + '名';
		}
		this.roleNameTxt.text = this.data.name;
	
		this.vipIcon.setVipLv(this.data.vip, true);
		this.lvTxt.text = this.data.level + "级";
		this.powerTxt.text = CommonUtils.overLength(this.data.power)
	}

	tap() {
	}
}

class KeyItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RankingKeyItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected itemNameTxt: eui.Label;
	protected redPointImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "RankingKeyItemSkin"
	}

	public childrenCreated() {
		super.childrenCreated()
	}

	public dataChanged() {
		super.dataChanged()
		this.itemNameTxt.text = this.data.name;
		this.redPointUpdate();
	}

	redPointUpdate() {
		this.redPointImg.visible = GameGlobal.RankingModel.isRedPoint();
	}
}

class PHBShowPanel extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// ShowPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected bGImage: eui.Image;
	protected tianXiaDiYiImage: eui.Image;
	protected tianXianPanel: PetShowPanel;
	protected weaponPanel: PetShowPanel;
	protected petPanel: PetShowPanel;
	protected zhengFaPanel: PetShowPanel;
	protected roleShowPanel: RoleShowPanel;
	protected nameTxt: eui.Label;
	protected petPanely: number
	protected xianWeiImage: eui.Image
	protected lvTxt: eui.Label;
	protected soul: eui.Group;

	/////////////////////////////////////////////////////////////////////////////
	protected mc: MovieClip;
	protected roleShowPanelX;
	protected roleShowPanelY;

	public constructor() {
		super();
		this.skinName = "ShowPanelSkin"
		this.tianXiaDiYiImage.visible = false;
	}

	public childrenCreated() {
		super.childrenCreated()
		this.mc = new MovieClip();
		this.soul.addChild(this.mc)
		this.mc.clearCache();
		this.petPanely = this.petPanel.y;
		this.roleShowPanelX = this.roleShowPanel.x;
		this.roleShowPanelY = this.roleShowPanel.y;
	}

	public setTianXianPanel(id: number, scale: number = 0.8) {
		this.tianXianPanel.SetBody(AppearanceConfig.GetUIPath(id));
		this.tianXianPanel.scaleX = scale;
		this.tianXianPanel.scaleY = scale;
		this.tianXianPanel.visible = true;
	}
	public setWeaponPanel(id: number, scale: number = 0.8) {
		this.weaponPanel.SetBody(AppearanceConfig.GetUIPath(id));
		this.weaponPanel.scaleX = scale;
		this.weaponPanel.scaleY = scale;
		this.weaponPanel.visible = true;
	}
	public setPetPanel(id: number, sffsety: number = 0, scale: number = 1.0) {
		this.petPanel.SetBodyId(id);
		this.petPanel.scaleX = scale;
		this.petPanel.scaleY = scale;
		this.petPanel.y = this.petPanely - sffsety;
		this.petPanel.visible = true;
	}

	public setZhengFaPanel(id: number, sffsety: number = 0, scale: number = 1.0) {
		this.zhengFaPanel.SetBody(AppearanceConfig.GetUIPath(id));
		this.zhengFaPanel.scaleX = scale;
		this.zhengFaPanel.scaleY = scale;
		this.zhengFaPanel.visible = true;
	}

	public setRole(subRole: RoleShowData, scale: number = 0.8, type?: RoleShowDressType) {
		this.roleShowPanel.ClearCache();
		if (type)
			LingtongViewHelper.SetRole(this.roleShowPanel,subRole.sex,subRole.clothID)
		else
			this.roleShowPanel.SetAll(subRole);
		this.roleShowPanel.scaleX = scale;
		this.roleShowPanel.scaleY = scale;
		this.roleShowPanel.x = this.roleShowPanelX * (2 - scale);
		this.roleShowPanel.y = this.roleShowPanelY * (2 - scale);
		this.roleShowPanel.visible = true;
	}
	public tXDYImageVisibel(visibel: boolean) {
		this.tianXiaDiYiImage.visible = visibel;
	}
	public setXianWeiSource(source: string) {
		this.xianWeiImage.source = source;
		this.xianWeiImage.visible = true;
	}
	public setSouHunSource(source: string) {
		this.mc.loadUrl(ResDataPath.GetMoviePath(source), true);
		this.mc.visible = true;
	}
	public setName(name: string, color) {
		this.nameTxt.text = name;
		this.nameTxt.textColor = color;
	}

	public hideAllPanel() {
		this.mc.visible = false;
		this.xianWeiImage.visible = false;
		this.nameTxt.text = "";
		this.zhengFaPanel.visible = false
		this.zhengFaPanel.visible = false;;
		this.tianXianPanel.visible = false;
		this.roleShowPanel.visible = false;
		this.petPanel.visible = false;
		this.weaponPanel.visible = false;
		this.lvTxt.visible = false;
	}
}
