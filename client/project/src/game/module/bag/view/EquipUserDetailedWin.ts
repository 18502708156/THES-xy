class EquipUserDetailedWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// EquipUserTipsSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected background: eui.Component;
	protected group: eui.Group;
	protected imgTipRect: eui.Image;
	protected score: eui.Label;
	protected type: eui.Label;
	protected lv: eui.Label;
	protected career: eui.Label;
	protected nameLabel: eui.Label;
	protected itemIcon: ItemIcon;
	protected powerLabel: PowerLabel;
	protected attTitleLabel: eui.Label;
	protected attr: eui.Label;
	protected forgeGroup: eui.Group;
	protected btnShow: eui.Button;
	protected orangeBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	private _totalPower = 0;
	private roleModel: Role;
	private mData
	private mConfigId: number

	public constructor() {
		super();
	}

	public initUI() {
		super.initUI();
		this.skinName = "EquipUserTipsSkin";
	};

	public OnOpen(...param: any[]) {
		var handle = param[0];
		var configID = param[1];
		var data = param[2];
		this.roleModel = param[3];

		this.mConfigId = configID
		this.mData = data

		this.setData(handle, configID, data);
		this.AddClick(this, this.CloseSelf);
		this.AddClick(this.btnShow, this.OnShow)

		let config = GameGlobal.Config.ItemConfig[configID]
		let show = GameGlobal.UserRole.IsOrange(config.subType) ? true : false
		if (config && config.quality < 4 && GameGlobal.actorModel.level >= 40 || show) {
			this.orangeBtn.visible = true
			this.AddClick(this.orangeBtn, this.OnClickOrange)
			UIHelper.ShowRedPoint(this.orangeBtn, show)
		} else {
			this.orangeBtn.visible = false
		}
	}

	public OnClose() {
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.CloseSelf, this);
	}

	private OnClickOrange() {
		let type = GameGlobal.UserRole.IsOrange(GameGlobal.Config.ItemConfig[this.mConfigId].subType)
		if (!type) {
			let minLevel = 40
			let actLevel = GameGlobal.actorModel.level
			let level = Math.max(Math.floor(actLevel / 20) * 20, minLevel)
			type = level
		}
		ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_EQUIP], type)
	}

	private OnShow() {
		if (this.mData && this.mData.itemConfig) {
			//分享
			let tList = []
			let tObj = { type: 5, value: this.mData.configID, valueEx: this.mData.itemConfig.subType };
			tList.push(tObj)
			GameGlobal.Chat.chatShareInfo(2, tList);
			// UserTips.ins().showTips("展示成功")
		}

	}

	private _SetType(str: string): void {
		if (str)
			this.type.text = "部位：" + str;
	}

	private _SetLv(txt: string, str: string): void {
		if (txt && str)
			this.lv.text = `${txt}：${str}`;
	}

	public setData(handle, configID, _data: ItemData) {
		var data = _data
		let itemConfig = GlobalConfig.ins().ItemConfig[configID];
		this.nameLabel.text = itemConfig.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
		this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[itemConfig.quality];
		this.itemIcon.setData(itemConfig);

		this._SetType(Role.getEquipNameByType(itemConfig.subType));
		let lv = itemConfig.level + "级"
		this._SetLv("等级", lv)

		this.career.text = "职业：" + Role.getJobNameByJob(itemConfig.job);


		var config = GlobalConfig.ins().EquipConfig[configID];
		var strAtt = AttributeData.getAttStr(config.attrs, 1)
		this.attr.text = strAtt;

		this._totalPower = 0
		if (_data && _data.GetScore) {
			this._totalPower = _data.GetScore()
			this.score.text = "评分: " + this._totalPower
		}

		if (this.roleModel) {
			//身上装备
			var len: number = this.roleModel.getEquipLen();
			for (var i = 0; i < len; i++) {
				var equipsData = this.roleModel.getEquipByIndex(i);
				if (configID && equipsData.item.configID == configID) {
					this.SetInjectSoulAttr(equipsData, i)
					this.setForge(equipsData, i);
					break;
				}
			}
		}

		this.powerLabel.text = this._totalPower
		egret.callLater(this.LaterUpdate, this)
	}

	private LaterUpdate(): void {
		this.background.height = this.group.height + 50
	}

	public setForge(equipsData: EquipsData, pos) {
		var lv = 0;
		for (var i = 0; i < 4; i++) {
			let lv = equipsData.GetForgeValue(i)
			if (lv > 0) {
				var config = GameGlobal.ForgeModel.GetForgeConfigByPos(pos, lv, i);
				if (config) {
					this.addTips(config.attr, i, lv);
					var power = Math.floor(UserBag.getAttrPower(config.attr));
					this._totalPower += power;
				}
			}
		}
	};

	public static GetTipsGroup() {
		let group = new eui.Group
		group.percentWidth = 100
		let img = new eui.Image
		img.source = "ui_bm_tipsfengexian"
		img.left = 5
		img.right = 5
		group.addChild(img)
		return group
	}

	public addTips(attr, type, lv) {
		let group = EquipUserDetailedWin.GetTipsGroup()
		let titleAttrTxt = new eui.Label
		titleAttrTxt.x = this.attTitleLabel.x
		titleAttrTxt.y = this.attTitleLabel.y
		titleAttrTxt.style = this.attTitleLabel.style
		group.addChild(titleAttrTxt)
		let attrTxt = new eui.Label
		attrTxt.x = this.attr.x
		attrTxt.y = this.attr.y
		attrTxt.style = this.attr.style
		group.addChild(attrTxt)
		this.forgeGroup.addChild(group)

		let attrs
		switch (type) {
			case ForgeType.BOOST:
				titleAttrTxt.text = "强化属性";
				attrs = AttributeData.getAttrStrAdd(attr, 11);
				break;
			case ForgeType.REFINE:
				titleAttrTxt.text = "精炼属性";
				attrs = AttributeData.getAttrStrAdd(attr, 11);
				break;
			case ForgeType.EXERCISE:
				titleAttrTxt.text = "锻炼属性";
				attrs = AttributeData.getAttrStrAdd(attr, 11);
				break;
			case ForgeType.GEM:
				titleAttrTxt.text = "宝石属性";
				var str = "";
				for (var i = 1; i < 5; i++) {
					var gem = new eui.Image;
					gem.x = attrTxt.x;
					gem.y = (attrTxt.y) + (i - 1) * 28;
					gem.width = gem.height = 24
					group.addChild(gem);
					var attrName = AttributeData.getAttrStrByType(attr[0].type);
					let len = ForgeGemPanel.GetLen(attr)
					if (len > i) {
						str += "|C:0x2ECA22&T:Lv10|\n";
						lv -= 10;
						gem.source = ForgeGemPanel.GetImg(attr[0].type, 10)
					}
					else if (len == i) {
						if (lv == 10) {
							str += "|C:0x2ECA22&T:Lv10|\n";
						} else {
							str += "Lv" + lv;
						}
						gem.source = ForgeGemPanel.GetImg(attr[0].type, lv)
					}
					else {
						if (i < 5)
							str += "\n|C:0x909090&T:";
						str += attrName + "宝石 未激活|";
						gem.source = "bs_00";
					}
				}

				attrTxt.lineSpacing = 8

				var lvTxt = new eui.Label;
				lvTxt.size = 20;
				lvTxt.lineSpacing = 8;
				lvTxt.x = attrTxt.x + 26;
				lvTxt.y = attrTxt.y;
				lvTxt.textFlow = TextFlowMaker.generateTextFlow(str);
				group.addChild(lvTxt);
				attrTxt.x = lvTxt.x + 58;
				attrTxt.height = lvTxt.height;
				attrs = AttributeData.getAttrStrAdd(attr, 15);
				let list = []
				for (let i = 0; i < attrs.length; i++) {
					if (attrs[i].value) {
						list.push(attrs[i])
					}
				}
				attrs = list
				break;
		}

		attrTxt.text = AttributeData.getAttStr(attrs, 1);
	};

	private SetInjectSoulAttr(equipsData: EquipsData, pos) {
		if (!DeityEquipConst.IsDeityEquip(equipsData.item.configID) || equipsData.deityEquipData.injectLevel == 0)
			return

		let level = equipsData.deityEquipData.injectLevel
		let config = GameGlobal.Config.DeitySpiritConfig[pos][level - 1]
		if (!config)
			return

		let group = EquipUserDetailedWin.GetTipsGroup()
		let titleAttrTxt = new eui.Label
		titleAttrTxt.x = this.attTitleLabel.x
		titleAttrTxt.y = this.attTitleLabel.y
		titleAttrTxt.style = this.attTitleLabel.style
		group.addChild(titleAttrTxt)
		let attrTxt = new eui.Label
		attrTxt.x = this.attr.x
		attrTxt.y = this.attr.y
		attrTxt.style = this.attr.style
		group.addChild(attrTxt)
		this.forgeGroup.addChild(group)
		titleAttrTxt.text = "注灵属性"
		attrTxt.text = AttributeData.getAttStr(config.attrpower, 1)
	}
}