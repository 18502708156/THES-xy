/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/26 21:10
 * @meaning: 命格控制类
 * 
 **/
class DestinyController extends BaseSystem {


    //
    private tUseDestinyData: DestinyData[] = [];//装备的
    private tDestinyBagData: DestinyData[] = [];//持有的

    private tDestinyServerInfo: Sproto.sc_baby_star_init_request

    public tSelectList = { 1: true, 2: false, 3: false, 4: false, 5: false }


    public bShowResolveTip = true;//是否二次确认提示分级重要命格

    // private tLocatData;

    // private nNum = 0;//数量,持有上限300
    // private nPerfectNum = 0;//integer #完美打造次数

    public mRedPoint = new DestinyRedPoint



    public constructor() {
        super();

    }

    public Init() {
        super.Init()

        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.DestinyBaseConfig.uplevelitemid, MessageDef.DESTINY_UP_ITEM)
        // this.tLocatData = GameG
    }

    //命格列表
    public getUseDestinyData() {
        return this.tUseDestinyData;
    }

    //命格物品列表
    public getDestBagList() {
        return this.tDestinyBagData
    }


    //获取藏宝图分页数据
    public getShowDestinyData() {
        var tPataData = {}
        let config = GlobalConfig.ins().DestinyAttrsConfig
        for (const item in config) {
            var sort = config[item].sort
            if (!tPataData[sort]) {
                tPataData[sort] = []

                tPataData[sort].push(config[item]);//暂时只显示一个
            }
            // if (sort) {
            //     tPataData[sort].push(config[item]);//根据标签插入
            // }
        }

        return tPataData
    }



    //获得服务器基础数据
    public getServerInfo() {
        return this.tDestinyServerInfo
    }

    //逆命返回
    public babyStarGet(_data: Sproto.cs_baby_start_get_response) {
        this.tDestinyServerInfo.star = _data.star
        this.tDestinyServerInfo.msgData = _data.msgData
    }

    //点亮混元返回
    public babyStartLight(_data: Sproto.cs_baby_start_light_response) {
        this.tDestinyServerInfo.star = 5
    }
    //使用
    public babyStartUse(_data: Sproto.cs_baby_start_use_response) {
        this.updateDestinyData(_data.pos, _data.no)
    }

    public babyStartUpLv(_data: Sproto.cs_baby_start_up_lv_response) {
        this.updateDestinyData(_data.pos, _data.no)
    }

    //更新命格数据
    public updateDestinyData(_pos, _num) {
        let data = this.tUseDestinyData[_pos - 1]
        if (data && _num) {
            let local = GlobalConfig.ins().DestinyAttrsConfig[_num];
            if (data.item) {
                data.initLocalData(local)
            }
            else {
                data = new DestinyData()
                data.initLocalData(local)
                this.tUseDestinyData[_pos - 1] = data
            }
        }
    }

    public doBabyStar(_data: Sproto.sc_baby_star_init_request) {

        this.tDestinyServerInfo = _data

        //命格数据
        this.tUseDestinyData = []
        for (const item in _data.data) {
            let data = {} as DestinyData
            if (_data.data[item]) {
                let local = GlobalConfig.ins().DestinyAttrsConfig[_data.data[item]];
                let deData = new DestinyData()
                deData.initLocalData(local)
                data = deData
            }
            this.tUseDestinyData.push(data)
        }
    }

    public GetPower(): number {
        //所有命格战力
		let allAttr = 0
        let list = this.tUseDestinyData || []
		for (const item in list) {
			let data = list[item]
			if (data.attars) {
				allAttr = allAttr + ItemConfig.CalcAttrScoreValue(data.attars)
			}
		}
		return allAttr
    }
}
