/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 法宝打造框详情
 * 
 **/


//打造的信息框
class TreaMakeRect extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // TreasureMakeRectSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbName: eui.Label;
    protected listView: eui.List;
    protected lbAddup: eui.Label;
    protected checkBox: eui.CheckBox;
    protected lbCome: eui.Label;
    protected btnBuild: eui.Button;
    protected lNe: eui.Label;
    protected rNe: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	private mRoleSendCheckData: RoleSendCheckData
	private lId = 0;
	private rId = 0;


	private nType = 0;


	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "TreasureMakeRectSkin";
		this.listView.itemRenderer = ItemBaseCost;
		this._AddClick(this.btnBuild, this.onClick)
		this._AddClick(this.lNe, this.onClick)
		this._AddClick(this.rNe, this.onClick)


		this.mRoleSendCheckData = new RoleSendCheckData((type) => {
			GameGlobal.TreasureModel.sendSpellsResMake(this.nType, type)
		}, () => {
			var config = GlobalConfig.ins().SpellsResMakeConfig[this.nType]
			if (config) {
				let cost = config.cost
				return [3, 0, cost[0].id, cost[0].count] //因为不消耗钱币,所以,第一二个参数都是模拟为了可以继续进行自动购买
			}
			return [null]
		}, () => {
			let bSelect = this.checkBox.selected
			return bSelect
		})



	}



	private _SendUp(): boolean {
		return this.mRoleSendCheckData.SendUp()
	}


	onUpdate(_type): void {
		var pConfig = GlobalConfig.ins().SpellsResMakeConfig[_type]
		if (!pConfig) return

		this.nType = _type;

		//普通打造
		if (this.nType === 1) {
			this.lbName.text = "普通打造"
			this.currentState = "normal"
			this.btnBuild.icon = "ui_fb_bt_putongdazao"
			let lNe = ""
			let rNe = ""
			for (const item in pConfig.cost) {
				if (pConfig.cost[item].id) {

					if (item == "0") {
						this.lId = pConfig.cost[item].id
						lNe = GameGlobal.Config.ItemConfig[pConfig.cost[item].id].name || ""
					}
					else if (item == "1") {
						this.rId = pConfig.cost[item].id
						rNe = GameGlobal.Config.ItemConfig[pConfig.cost[item].id].name || ""
					}
				}

			}

			UIHelper.SetLinkStyleLabel(this.lNe, lNe)
			UIHelper.SetLinkStyleLabel(this.rNe, rNe)
			// this.lbCome.text = ""
		}
		else if (this.nType === 2)//完美打造
		{
			this.lbName.text = "完美打造"
			this.currentState = "perfit"
			this.btnBuild.icon = "ui_fb_bt_wanmeidazao"
			this.lbAddup.text = "已累计: " + GameGlobal.TreasureModel.getPerFectTime() + "次"
		}

		this.listView.dataProvider = new eui.ArrayCollection(pConfig.cost)
	}


	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.btnBuild:
				this._SendUp()
				break
			case this.lNe:
				if (this.lId) {
					UserWarn.ins().BuyGoodsWarn(this.lId)
				}
				break
			case this.rNe:
				if (this.rId) {
					UserWarn.ins().BuyGoodsWarn(this.rId)
				}
				break
		}
	}



}

