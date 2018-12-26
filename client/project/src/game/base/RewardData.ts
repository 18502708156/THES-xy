interface IRewardData {
    type: number;
    id: number;
    count: number;
}

class RewardData implements IRewardData {

    type: number;
    id: number;
    count: number;
    myCount:number

    public parser(bytes: Sproto.reward_data): void {
        this.type = bytes.type
        this.id = bytes.id
        this.count = bytes.count
    }

    private static SetValue(key: string, src: any, dst: any): boolean {
        if (src[key] != null) {
            dst[key] = src[key]
            return true
        }
        return false
    }

    public static ToRewardData(data: any): RewardData {
        let obj = new RewardData
        RewardData.SetValue("type", data, obj)
        RewardData.SetValue("id", data, obj)
        RewardData.SetValue("count", data, obj)
        return obj
    }

    public static ToRewardDatas(datas: any[]): RewardData[] {
        let list = []
        if (datas)
        {
            for (let data of datas) {
                list.push(this.ToRewardData(data))
            }
        }    
        
        return list
    }

    public static getCurrencyName(v) {
        return MoneyConstToName[v] || ""
    }

    // 货币的大图标
    public static getCurrencyRes(v) {
        return ResDataPath.GetItemFullPath(MoneyConstToRes[v] || "")
    }

    // 货币的小图标
    public static GetCurrencyMiniRes(type: number) {
        let res = MoneyConstToMiniRes[type]
        if (res) {
            return res
        }
        let config = GameGlobal.Config.ItemConfig[type]
        if (config) {
            return ResDataPath.GetItemFullPath(config.icon);
        }
        return ""
    }
}