/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/4 11:15
 * @meaning: 法宝控制类
 * 
 **/
class TreasureModel extends BaseSystem {


    //
    private tUseSpellsData: TreasureData[] = [];//装备的
    private tSpellsListData: TreasureData[] = [];//持有的

    private nNum = 0;//数量,持有上限300
    private nPerfectNum = 0;//integer #完美打造次数



    public constructor() {
        super();

        this.regNetMsg(S2cProtocol.sc_spellsRes_info, this.doSpellsRes);

    }

    public Init() {
        super.Init()

        for (let key in GameGlobal.Config.SpellsResLvproConfig) {
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.SpellsResLvproConfig[key][0].cost.id, MessageDef.TREASURE_ITEM_CHANGE)
            break
        }
        for (let key in GameGlobal.Config.SpellsResMakeConfig) {
            let data = GameGlobal.Config.SpellsResMakeConfig[key]
            for (let costData of data.cost) {
                GameGlobal.UserBag.AddListenerItem(costData.id, MessageDef.TREASURE_ITEM_CHANGE)
            }
        }
    }

    


    //打造
    // 	makeType		0 : integer #洗练类型,1普通,2完美,普通不用带自动购买
    // autoBuy			1 : integer #0不自动购买道具1使用绑元宝2使用绑元宝和元宝
    public sendSpellsResMake(makeType,autoBuy) {
		let req = new Sproto.cs_spellsRes_make_request;
        req.makeType = makeType
        req.autoBuy = autoBuy
        this.Rpc(C2sProtocol.cs_spellsRes_make, req, (rsp) => {
			let rspData: Sproto.cs_spellsRes_make_response = rsp;
            //处理打造逻辑
            if(rspData.ret)
            {
                this.spellsResMake(rspData)
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_UPDATE_MAKE);
            }
            else
            {
                UserTips.ins().showTips("打造失败")
            }
		})
	};


    //装备
    // pos				0 : integer #位置
    // spellsId		1 : integer #法宝id
    public sendSpellsResUse(pos,spellsId) {
		let req = new Sproto.cs_spellsRes_use_request;
        req.pos = pos
        req.spellsId = spellsId
        this.Rpc(C2sProtocol.cs_spellsRes_use, req, (rsp) => {
			let rspData: Sproto.cs_spellsRes_use_response = rsp;
            //处理装备逻辑
            if(rspData.ret)
            {
                this.spellsResUse(rspData)
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
            }
		})
	};

    //上锁
    // spellsId		1 : integer #法宝id
    // lock			0 : integer #0没锁,上锁
    public sendSpellsResLock(lock,spellsId) {
		let req = new Sproto.cs_spellsRes_lock_request;
        req.lock = lock
        req.spellsId = spellsId
        this.Rpc(C2sProtocol.cs_spellsRes_lock, req, (rsp) => {
			let rspData: Sproto.cs_spellsRes_lock_response = rsp;
            //处理上锁逻辑
            if(rspData.ret)
            {
                this.spellsResLock(rspData)
                MessageCenter.ins().dispatch(MessageDef.TREASURE_LOCK);
            }
		})
	};

    //升级
    // pos				0 : integer #位置
    // autoBuy			1 : integer #
    public sendSpellsResUpLv(pos,autoBuy) {
		let req = new Sproto.cs_spellsRes_up_lv_request;
        req.pos = pos
        req.autoBuy = autoBuy
        this.Rpc(C2sProtocol.cs_spellsRes_up_lv, req, (rsp) => {
			let rspData: Sproto.cs_spellsRes_up_lv_response = rsp;
            //处理升级逻辑
            if(rspData.ret)
            {
                this.spellsResUpLv(rspData)
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_UPDATE_LV); //自动购买
                
            }
		})
	};

    //分解
    // spellsIdList		0 : *integer #id列表
    public sendSpellsResSmelt(spellsIdList) {
		let req = new Sproto.cs_spellsRes_smelt_request;
        req.spellsIdList = spellsIdList
        this.Rpc(C2sProtocol.cs_spellsRes_smelt, req, (rsp) => {
			let rspData: Sproto.cs_spellsRes_smelt_response = rsp;
            //处理分解逻辑
            this.spellsResSmelt(rspData)
            MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);

		})
	};


    //法宝内容刷新
    public doSpellsRes(rsp : Sproto.sc_spellsRes_info_request)
    {
        this.updateTreasure(rsp)

        //法宝变化更新
        GameGlobal.MessageCenter.dispatch(MessageDef.TREASURE_CHANGE)
    }




    //获取完美打造次数
    public getPerFectTime(): number {
        return this.nPerfectNum;
    }

    //获取持有列表
    public getHaveList() {
        var tList
        tList = this.deepCopy(this.tSpellsListData)
        return tList.reverse();
    }

    //获取装备列表
    public getUseList() {
        return this.tUseSpellsData
    }


    //实现深拷贝
    public deepCopy(target) {
        if (typeof target !== 'object') return;
        //判断目标类型，来创建返回值
        var newObj = target instanceof Array ? [] : {};

        for (var item in target) {
            //只复制元素自身的属性，不复制原型链上的
            if (target.hasOwnProperty(item)) {
                newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item] //判断属性值类型
            }
        }

        return newObj
    }



    //更新法宝内容
    public updateTreasure(_data: Sproto.sc_spellsRes_info_request) {
        if (!_data) return

        this.nNum = _data.num || 0
        this.nPerfectNum = _data.perfectNum || 0

        //装备的
        if (_data.useSpells) {
            for (const index in _data.useSpells) {
                if (!_data.useSpells[index].spellsNo) {
                    this.tUseSpellsData[index] = {} as any //初始化
                }
                else {
                    if (!this.tUseSpellsData[index]) {
                        var pData = new TreasureData();
                        pData.updateByuseSpells(_data.useSpells[index])
                        this.tUseSpellsData[index] = pData;
                    }
                    else {
                        this.tUseSpellsData[index].updateByuseSpells(_data.useSpells[index])
                    }
                }

            }
        }

        //拥有的
        if (_data.spellsList) {
            for (const index in _data.spellsList) {
                let bFind = false
                for (const index2 in this.tSpellsListData) {
                    if (this.tSpellsListData[index2].spellsId === _data.spellsList[index].spellsId) {
                        this.tSpellsListData[index2].spellsList(_data.spellsList[index])//刷新
                        bFind = true
                    }
                }

                if (!bFind) {
                    var pData = new TreasureData();
                    pData.spellsList(_data.spellsList[index])
                    if (pData) {
                        this.tSpellsListData.push(pData)//添加
                    }
                }
            }
        }

    }

    //打造内容
    public spellsResMake(_data: Sproto.cs_spellsRes_make_response) {

        this.nNum = _data.num || 0
        this.nPerfectNum = _data.perfectNum || 0 //#完美打造次数

        if (_data.spellsId && _data.spellsNo) {
            var pData = new TreasureData();
            pData.spellsList({
		        spellsId: _data.spellsId,
		        spellsNo: _data.spellsNo,
		        lock: 0,
                skillList: _data.skillList,
            })
            if (pData) {
                this.tSpellsListData.push(pData)//无顺序
            }
        }

    }

    //装备
    public spellsResUse(_data: Sproto.cs_spellsRes_use_response) {
        // pos				1 : integer #位置
        // useSpellsNo		2 : integer #使用的法宝编号

        // spellsId		3 : integer #法宝id
        // spellsNo		4 : integer #上面法宝id替换编号，如果这个是0就把这个id的法宝删除
        // lock			5 : integer #上面法宝id替换锁状态
        this.nNum = _data.num || 0

        //装备后的装备 
        var pUseData = this.tUseSpellsData[_data.pos - 1] //_data.pos 返回的位置需要减1
        if (pUseData) {
            if (pUseData instanceof TreasureData)//已经有装备的
            {
                let pData = { 
                    lv: pUseData.level || 1,
                    spellsNo: _data.useSpellsNo, 
                    skillList: _data.useSkillList || [] 
                };
                pUseData.updateByuseSpells(pData)
            }
            else //未装备的
            {
                let pData = new TreasureData();
                let copeData = { 
                    lv: 1,
                    spellsNo: _data.useSpellsNo, 
                    skillList: _data.useSkillList || [] 
                };

                pData.updateByuseSpells(copeData)
                this.tUseSpellsData[_data.pos - 1] = pData //插入
            }
        }

        //对身上的有未装备的法宝
        for (let item = 0; item < this.tSpellsListData.length; item++) {
            let pData = this.tSpellsListData[item]
            if (pData.spellsId === _data.spellsId) {
                if (_data.spellsNo === 0) //删除
                {
                    this.tSpellsListData.splice(item, 1)//删除之后退出
                    break
                }
                else {
                    pData.replace(_data)//刷新内容
                }
            }
        }

    }


    //上锁
    public spellsResLock(_data) {
        // spellsId		1 : integer #法宝id
        // lock			2 : integer #0没锁,上锁
        for (const item in this.tSpellsListData) {
            let pData = this.tSpellsListData[item]
            if (pData.spellsId === _data.spellsId) {
                pData.lock = _data.lock
            }
        }
    }

    //升级
    public spellsResUpLv(_data: Sproto.cs_spellsRes_up_lv_response) {
        // pos				1 : integer #位置
        // lv				2 : integer #等级
        var nPos = _data.pos - 1 // 前后端下标差异
        if (this.tUseSpellsData[nPos]) {
            this.tUseSpellsData[nPos].updateUpuseSpells(_data)//刷新技能等级内容
        }
    }


    //分解
    public spellsResSmelt(_data) {
        for (let i = this.tSpellsListData.length - 1; i >= 0; i--) {
            for (const item in _data.spellsIdList) {
                if (this.tSpellsListData[i] && (this.tSpellsListData[i].spellsId === _data.spellsIdList[item])) {
                    this.tSpellsListData.splice(i, 1)//倒叙删除
                }
            }
        }
    }

    //获取图鉴内容 type 1传说, 2完美 3,其它
    public getShowConByType(type) {

        if (!type) return []
        var tList = []
        var tTreasure = GlobalConfig.ins().SpellsResListConfig
        for (const item in tTreasure) {
            let pData = new TreasureData()
            switch (type) {
                case 1:
                    if (tTreasure[item].quality === ITEM_QUALITY.RED_QUALITY) {
                        pData.initData(tTreasure[item].id, 1, [])
                        tList.push(pData)
                    }
                    break;
                case 2:
                    if (tTreasure[item].quality === ITEM_QUALITY.ORANGE_QUALITY) {
                        pData.initData(tTreasure[item].id, 1, [])
                        tList.push(pData)
                    }
                    break;
                case 3:
                    if (tTreasure[item].quality === ITEM_QUALITY.RED_QUALITY) {
                    }
                    else if (tTreasure[item].quality === ITEM_QUALITY.ORANGE_QUALITY) {

                    }
                    else {
                        pData.initData(tTreasure[item].id, 1, [])
                        tList.push(pData)
                    }
                    break;
            }
        }
        return tList
    }


    public canEquip(type: Number, nPos: number): Boolean {
        for (const item in this.tUseSpellsData) {
            if (nPos != parseInt(item)) {
                if (this.tUseSpellsData[item].type == type) {
                    return false
                }
            }
        }

        return true;
    }

    public mRedPoint = new TreasureRedPoint

}

class TreasureRedPoint extends IRedPoint {

    public static readonly INDEX_UP_TREASURE = 0
    public static readonly INDEX_MAKE_TREASURE = 1
    public static readonly INDEX_RESOLVE_TREASURE = 2

    constructor() {
        super()
        console.log("--------------------------------")
    }

    protected GetCheckFuncList(): { [key: number]: Function } {
        return {
            [TreasureRedPoint.INDEX_UP_TREASURE]: this.GetIndexUpTreasure,
            [TreasureRedPoint.INDEX_MAKE_TREASURE]: this.GetIndexMakeTreasure,
            [TreasureRedPoint.INDEX_RESOLVE_TREASURE]: this.GetIndexResolveTreasure,
        }
    }

    public GetMessageDef(): string[] {
        return [
            MessageDef.TREASURE_CHANGE,
            MessageDef.TREASURE_LOCK,
            MessageDef.TREASURE_ITEM_CHANGE,
        ]
    }

	/**
	 * 当前是否有红点状态
	 */
	public IsRedPoint(): boolean {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_31)) {
            return false
        }
		return super.IsRedPoint()
	}

    protected OnChange(index: number): void {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_TREASURE)
    }

    public GetIndexUpTreasure() {
        let bHave = false
        let tList = GameGlobal.TreasureModel.getUseList()
        for (const item in tList) {
            let data = tList[item]
            if (data.level && (data.level < 100)) {
                if (GameGlobal.UserBag.GetCount(data.cost.id) >= data.cost.count) {
                    bHave = true
                    break
                }
            }
        }

        return bHave;
    }

    public GetIndexMakeTreasure() {
        let tList = GlobalConfig.ins().SpellsResMakeConfig
        for (const item in tList) {
            var pConfig = tList[item]
            if (Checker.CheckDatas(pConfig.cost, false, false)) {
                return true;
            }
        }
        return false;
    }

    public GetIndexResolveTreasure(): boolean {
        let list = GameGlobal.TreasureModel.getHaveList()
        return list.length
    }

}