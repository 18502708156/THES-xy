class ItemData extends ItemBaseData {
    private canbeUsed: boolean;
    public invalidtime: number;

    // 是否是新增加的物品（暂时兵法物品使用）
    public mIsNewItem: boolean = false

    public parser(data: Sproto.item_data) {
        super.parser(data)
        if (data) {
            this.invalidtime = data.invalidtime || 0;
        }
    }

    public UpdateConfigId(value: number) {
        super.UpdateConfigId(value)
        if (value) {
            this.setCanbeUsed();
        }
    }

    /**
     * 设置道具可使用的红点提示
     */
    public setCanbeUsed() {
        if (!this.itemConfig)
            return;
        if (this.itemConfig.useType == 1 || this.itemConfig.useType == 2) {
            if (GameLogic.ins().actorModel.level < this.itemConfig.level) {
                this.canbeUsed = false;
            }
            else {
                //屏蔽召唤令的红点提示
                let id = this.itemConfig.id
                if (id == 230001 || id == 230002 || id == 230003) {
                    this.canbeUsed = false;
                }
                else {
                    let xianlvId = XianlvModel.MATERIAL_ID[id]
                    if (xianlvId) {
                        if (GameGlobal.XianlvModel.HasXianlv(xianlvId)) {
                            this.canbeUsed = true;
                        } else {
                            this.canbeUsed = false
                        }
                    } else {
                        this.canbeUsed = true;
                    }
                }
            }
        }
        else {
            this.canbeUsed = false;
        }
    }

    public getCanbeUsed() {
        if (this.canbeUsed) {
            return ItemData.IsNotTimeLimitUse(this.itemConfig)
        }
        return false
    }

    public static IsNotTimeLimitUse(config) {
		if (config.useType == ItemUseType.TYPE01 && config.useArg != null && config.useArg.timelimit != null) {
			try {
                let date = DateUtils.StrToDate(config.useArg.timelimit)
                if (date) {
                    if (date.getTime() * 0.001 >= GameServer.serverTime) {
                        return false
                    }
                }
			} catch (e) {
			}
		}
        let xianlvId = XianlvModel.MATERIAL_ID[config.id]
        if (xianlvId) {
            if (!GameGlobal.XianlvModel.HasXianlv(xianlvId)) {
                return false
            }
        }
		return true
	}
}