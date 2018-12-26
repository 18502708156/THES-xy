class RoleSendCheckData {

    private m_IsTips: boolean
    private m_IsUse: boolean

	private m_Callback: Function
	private m_GetFunc: Function
	private m_GetAuto: Function
    private m_GetRestart: Function  //用于 绑元不足，提示框确认按钮被点击时，重启AutoSendData

	public constructor(callback: Function, getFunc: Function, getAuto: Function, getRestart: Function = null) {
		this.m_Callback = callback
		this.m_GetFunc = getFunc
		this.m_GetAuto = getAuto
        this.m_GetRestart = getRestart
	}

	private SendBoost(autoBuy: number) {
		if (this.m_Callback) {
			this.m_Callback(autoBuy)
		}
	}

	private GetCost() {
		return this.m_GetFunc()
	}

    public SendUp() {
        let data = this.GetCost()
        if (!data) {
            return false
        }
        let monId = data[0]
        let monCount = data[1]
        let costId = data[2]
        let costCount = data[3]

        if (monId && !Checker.Money(monId, monCount)) {
            return false
        }
        let upitemId = costId
        if (!upitemId) {
            return false
        }
        let count = GameGlobal.UserBag.GetCount(upitemId)
        let needCount = costCount - count
        
        if (count >= costCount) {
            this.SendBoost(0)
            return true
        } else {
            if (this.m_GetAuto()) {
                let storeType = ItemStoreConfig.GetStoreType(upitemId)
                if (storeType == ShopController.EN_SHOP_BANGYUAN) {
                    let price = ItemStoreConfig.GetPrice(upitemId) * needCount
                    let actor = GameLogic.ins().actorModel
                    if (price > actor.byb) {
                        if (!this.m_IsTips) {
                            WarnWin.show("绑元不足，是否【消耗元宝】来自动购买？", () => {
                                this.m_IsUse = true
                                this.m_IsTips = true
                                if (this.m_GetRestart) {
                                    this.m_GetRestart()
                                }
                            }, this, () => {
                                this.m_IsUse = false
                            }, this)
                            return false
                        }
                        if (!this.m_IsUse) {
                            return false
                        }
                        price = ItemStoreConfig.GetPrice(upitemId,ShopController.EN_SHOP_YUANBAO) * needCount
                        if (Checker.Money(MoneyConst.yuanbao, price)) {
                            this.SendBoost(2)
                            return true
                        }
                    } else {
                        this.SendBoost(1)
                        return true
                    }
                } else if (storeType == ShopController.EN_SHOP_YUANBAO) {
                    let price = ItemStoreConfig.GetPrice(upitemId,ShopController.EN_SHOP_YUANBAO) * needCount
                    if (Checker.Money(MoneyConst.yuanbao, price)) {
                        this.SendBoost(2)
                        return true
                    }
                } else {
                    console.warn("not store type => ", storeType, upitemId)
                }
                
            } else {
                UserWarn.ins().setBuyGoodsWarn(upitemId,needCount)
            }
        }
        return false
    }
}