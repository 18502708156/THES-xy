/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/6 16:21
 * @meaning: 命格装备界面
 * 
 **/

class DestinyEquipLayer extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// DestinyEquipDlgSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected listView: eui.List;
	protected cEquip: DestinyEquipItem;
	protected lbGo: eui.Label;
	protected scroller: eui.Scroller;
    protected equipGroup: eui.Group;
	/////////////////////////////////////////////////////////////////////////////


	tLayerData; //界面数据

	pDestinyData: DestinyData;//命格数据

	nPos = 0;//当前位置0开始

	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

		this.skinName = "DestinyEquipDlgSkin"
		this.listView.itemRenderer = DestinyEquipItem;
		this.listView.dataProvider = new eui.ArrayCollection
		UIHelper.SetLinkStyleLabel(this.lbGo, "前往获取命格") //下划线

		this.cEquip.buy.label = "升级"
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);

		//
		this.pDestinyData = param[0]
		this.nPos = param[1]
		if (this.cEquip.buy.visible = param[2]) {
			UIHelper.ShowRedPoint(this.cEquip.buy, GameGlobal.DestinyController.mRedPoint.IsRedUp(this.nPos))
		}

		this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//物品变化
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//命格数据变化
		this.observe(MessageDef.DESTINY_EQUIP_REWARD, this.equipItem)//装备物品
		this.AddClick(this.lbGo, this.onClick)
		this.AddClick(this.cEquip.buy, this.onUpClick)

		this.UpdateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}



	private UpdateContent() {
		let DestinyAttrsConfig = GameGlobal.Config.DestinyAttrsConfig
		let pDestinyDataType = -1
		if (this.pDestinyData && this.pDestinyData.item && DestinyAttrsConfig[this.pDestinyData.item]) {
			pDestinyDataType = DestinyAttrsConfig[this.pDestinyData.item].sort
		}
		let typeDict = {}
		let outlist: ItemData[] = []

		let list = GameGlobal.DestinyController.getUseDestinyData() || []
		for (let data of list) {
			if (!data.item) {
				continue
			}
			let config = DestinyAttrsConfig[data.item]
			if (!config) {
				continue
			}
			if (config.sort == pDestinyDataType) {
				continue
			} 
			typeDict[config.sort] = true
		}

		let itemList = GameGlobal.UserBag.GetBagStarList()
		for (let key in itemList) {
			let itemData = itemList[key]
			if (DestinyAttrsConfig[itemData.configID] && !typeDict[DestinyAttrsConfig[itemData.configID].sort]) {
				outlist.push(itemData)
			}
		}
		let getScore = function(id) {
			let config = GameGlobal.Config.DestinyAttrsConfig[id];
			if (config) {
				return ItemConfig.CalcAttrScoreValue(config.attars)
			} else {
				return 0
			}
		}
		
		outlist.sort(function(lhs, rhs) {
			return getScore(rhs.configID) - getScore(lhs.configID)
		})

		this.tLayerData = outlist;
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tLayerData)

		if (this.tLayerData.length) {
			this.currentState = "have"
		}
		else {
			this.currentState = "kong"
		}



		if (this.pDestinyData && this.pDestinyData.item)//当前已经装备了命格
		{
			this.cEquip.visible = true
			// this.cEquip.data = this.pDestinyData
			// this.cEquip.dataChanged()
			this.upEquip()

			this.scroller.height = 491
			this.equipGroup.visible = true
		}
		else {
			this.cEquip.visible = false

			this.scroller.height = 658
			this.equipGroup.visible = false
		}

	}

	private upEquip() {

		if (this.pDestinyData) {
			let itemConfig = GlobalConfig.ins().ItemConfig[this.pDestinyData.item]
			if (itemConfig.name) {
				this.cEquip.nameLabel.text = itemConfig.name
				this.cEquip.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality]
			}

			// this.cEquip.buy.visible = false
			this.cEquip.itemIcon.setDataByConfig(itemConfig);
			this.cEquip.itemIcon.isShowName(false)
			this.cEquip.itemIcon.setItemCount(false)

			// let arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.pDestinyData.item]
			if (this.pDestinyData.attars) {
				this.cEquip.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(this.pDestinyData.attars)
				this.cEquip.lbInfo0.text = AttributeData.getAttStrByType(this.pDestinyData.attars[0], 0, ": ", false, '#682f00');
				if (this.pDestinyData.attars[1]) {
					this.cEquip.lbInfo1.text = AttributeData.getAttStrByType(this.pDestinyData.attars[1], 0, ": ", false, '#682f00');

				}
				else {
					this.cEquip.lbInfo1.text = ""
				}
			}
			else {
				this.cEquip.lbFight.text = ""
				this.cEquip.lbInfo0.text = this.pDestinyData.skillName || ""
				this.cEquip.lbInfo1.text = this.pDestinyData.desc || ""
			}
			
		} else {
			
		}


	}

	private equipItem(_id) {
		if (!_id) return;
		GameGlobal.DestinyManage.babyStartUse(_id, this.nPos+1)
	}


	private onClick() {
		this.CloseSelf()
		// if (this.cEquip.buy.visible) {
		// 	ViewManager.ins().openIndex(LingtongMainPanel, 3)
		// } else {
			ViewManager.ins().openIndex(DestinyUpWin, 1)
		// }
	}

	private onUpClick() {
		this.CloseSelf()
		ViewManager.ins().open(DestinyUpWin, 0, this.nPos)//打开逆命窗口
	}

}
