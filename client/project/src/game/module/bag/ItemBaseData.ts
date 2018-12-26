class ItemBaseData {
	private score: number = -1
	public configID: number;
    public handle: number = 0;
    public count: number;
    public att: Array<AttributeData> = [];
    public itemConfig: any;

    public parser(data: Sproto.item_data) {
        if (data == null) {
            return
        }
        this.handle = data.handle
        this.UpdateConfigId(data.id)
        this.count = data.count
        this.att = []
        for (let dataAtt of data.attrs) {
            var att = new AttributeData();
            att.parser(dataAtt);
            this.att.push(att);
        }
    }

    public ParserByEquipData(data: Sproto.equip_item_data) {
        this.UpdateConfigId(data.id)
        // 角色装备不需要handle和count
        if (this.configID) {
            this.handle = 1
            this.count = 1
        } else {
            this.handle = 0
            this.count = 0
        }
        if (data.attrs) {
            this.att = []
            for (let dataAtt of data.attrs) {
                var att = new AttributeData();
                att.parser(dataAtt);
                this.att.push(att);
            }
        }
    }

    public UpdateConfigId(value: number) {
        this.score = -1
        this.configID = value || 0
        if (value) {
            this.itemConfig = GlobalConfig.ins().ItemConfig[value];
        }
    }

    /** TODO hepeiye
     * 通过string数组获取多行字符串
     * @param str[]   属性string数组
     * @param newline  属性与属性上下间隔几行(默认1行)
     */
    public static getStringByList(str, newline = 1, addStr = ": "): string {
        var ret = "";
        for (var i = 0; i < str.length; i++) {
            ret += str[i] + addStr;
            if (i < str.length - 1) {
                for (var j = 0; j < newline; j++)
                    ret += "\n";
            }
        }
        return ret;
    }

    public static getStringByNextList(now, next) {
        var ret = "";
        for (var i = 0; i < now.length; i++) {
            ret += now[i];
            if (next[i]) {
                ret += next[i];
            }
            if (i < now.length - 1) {
                ret += "\n";
            }
        }
        return ret;
    }

    public GetScore(): number {
        if (this.score < 0) {
            this.score = ItemConfig.calculateBagItemScore(this);
        }
        return this.score
        // return ItemConfig.calculateBagItemScore(this);
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
		return true
	}
}