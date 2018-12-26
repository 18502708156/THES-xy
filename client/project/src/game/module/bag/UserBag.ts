class UserBag extends BaseSystem {

	private static EMPTY_TABLE = []

	bagNum: number = 0;
	/** 背包数据 <BR>
	 * 0其他装备，1装备，2寻宝相关。参考UserBag枚举定义
	 * */
	bagModel: { [key: number]: UserBagData } = {}
	/** 使用物品的返回
	 * 0, -- 使用成功
	 * 1, -- 背包满了
	 * 3, -- 不能被使用
	 * 4, -- 级别不足
	 * 5, -- 数量不足够
	 */
	private promptList = ["", "背包满了", "不能使用", "不能被使用", "级别不足", "数量不足够", "物品已过期", "元宝不足"];

	private m_ListenerItems: { [key: number]: string | string[] } = {}

	_useItemFunc = {};

	private m_BagItems: ISpeItemEvent[] = []

	static ins(): UserBag {
		return super.ins();
	}

	public constructor() {
		super();

		this.m_BagItems.push(new SpeEquipItemEvent)

		this.bagModel[UserBag.BAG_TYPE_OTHTER] = new UserBagData02
		this.bagModel[UserBag.BAG_TYPE_EQUIP] = new UserBagData
		this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT] = new UserBagData
		this.bagModel[UserBag.BAG_TYPE_ASTROLABE] = new UserBagData02

		this.regNetMsg(S2cProtocol.sc_bag_init_data, this.doBagData);
		this.regNetMsg(S2cProtocol.sc_bag_deal_delete_item, this.doDeleteItem);
		this.regNetMsg(S2cProtocol.sc_bag_deal_add_item, this.doAddItem);
		this.regNetMsg(S2cProtocol.sc_bag_update_item_data, this.doUpDataItem);

		this.regNetMsg(S2cProtocol.sc_bag_deal_valumn_add, this.doBagValumnAdd);
		this.regNetMsg(S2cProtocol.sc_bag_user_item_back, this.doUserItemBack);
	}

	public Init(): void {
	}

	public AddListenerItem(itemId: number, msg: string) {
		if (!msg || !itemId) {
			return
		}
		if (this.m_ListenerItems[itemId]) {
			if (DEBUG) {
				console.warn("重复 itemId msg => ", itemId, msg)
			}
			let oldmsg = this.m_ListenerItems[itemId]
			if (typeof (oldmsg) == "string") {
				this.m_ListenerItems[itemId] = [oldmsg]
			}
			(this.m_ListenerItems[itemId] as any).push(msg)
		} else {
			this.m_ListenerItems[itemId] = msg
		}
	}

	public NotifyItem(itemId: number) {
		let msg = this.m_ListenerItems[itemId]
		if (msg) {
			if (typeof (msg) == "string") {
				GameGlobal.MessageCenter.dispatch(msg)
			} else {
				for (let data of msg) {
					GameGlobal.MessageCenter.dispatch(data)
				}
			}
			return true
		}
		for (let data of this.m_BagItems) {
			let msg = data.Handle(itemId)
			if (msg) {
				GameGlobal.MessageCenter.dispatch(msg)
				return true
			}
		}
		return false
	}

	public sendAddBagGrid(num: number): void {
		var cs_bag_add_grid = new Sproto.cs_bag_add_grid_request();
		cs_bag_add_grid.bagNum = num;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_add_grid, cs_bag_add_grid)
	};
    /**
     * 使用道具
     */
	public sendUseItem(id, count) {
		var cs_bag_use_item = new Sproto.cs_bag_use_item_request();
		cs_bag_use_item.id = id;
		cs_bag_use_item.count = count;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_use_item, cs_bag_use_item);
		return true;
	};
	public sendUserGoods(id, count) {
	};

    /**
     * 处理背包数据初始化
     */
	public doBagData(rsp: Sproto.sc_bag_init_data_request) {
		var code = rsp.code;
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		//0是清空数据，其他视为追加数据
		if (code == 0) {
			this.bagModel[type].Clear()
		}
		var len = rsp.datas.length;
		var itemModel: ItemData;
		for (var i = 0; i < len; i++) {
			itemModel = new ItemData();

			itemModel.parser(rsp.datas[i]);

			this.bagModel[type].Add(itemModel);

			this.NotifyItem(itemModel.configID)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		if (type == UserBag.BAG_TYPE_EQUIP) {
			this.doBagVolChange(true);
		} else if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE)
		} else if (type == UserBag.BAG_TYPE_OTHTER) {
			// UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
		}
	}

    /**
     * 背包容量提示
     */
	public doBagVolChange(isFirst = false) {
		//道具数量变更
		TimerManager.ins().remove(this.isAutoRonglian, this)
		TimerManager.ins().doTimer(1000, 1, this.isAutoRonglian, this)
		var isTip = this.getBagItemNum() / this.getMaxBagRoom() >= (GlobalConfig.ins().BagBaseConfig.exceed / 100) //|| this.getWingZhuEquip().length >= 10;
		MessageCenter.ins().dispatch(MessageDef.BAG_ITEM_COUNT_CHANGE, isTip)
		isTip = this.getSurplusCount() < this.getMaxBagRoom() * 0.05;
		MessageCenter.ins().dispatch(MessageDef.BAG_WILL_FULL, isTip, isFirst)
	}

	public mIsTip: boolean = true

	public isAutoRonglian() {
		var isrong = this.bFullBag()
		if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_BAG_RONG_LIAN) && isrong) {
			this.ronglian()
		}
	}

	public bFullBag() {
		return this.getBagItemNum() / this.getMaxBagRoom() * 100 >= GlobalConfig.ins().BagBaseConfig.exceed
	}

	public ronglian() {
		let data = this.getOutEquips()
		if (data.length > 0) {
			if (this.mIsTip) {
				this.mIsTip = false
				UserTips.InfoTip("自动熔炼")
			}
			UserEquip.ins().sendSmeltEquip(data)
			TimerManager.ins().doTimer(1000, 1, this.ronglian, this)
		} else {
			this.mIsTip = true
			TimerManager.ins().remove(this.ronglian, this)
		}
	}

	public doUserItemBack(rsp: Sproto.sc_bag_user_item_back_request) {
		var index = rsp.tipIndex;
		if (index > 0) {
			UserTips.ins().showTips(this.promptList[index]);
		}
		else if (index == 0) {
			GameGlobal.MessageCenter.dispatch(MessageDef.postUseItemSuccess);
		}
	}

    /**
     * 处理添加背包格子数
     */
	public doBagValumnAdd(rsp: Sproto.sc_bag_deal_valumn_add_request) {
		var BagBaseConfig = GlobalConfig.ins().BagBaseConfig
		this.bagNum = rsp.bagNum * BagBaseConfig.rowSize + BagBaseConfig.baseSize;
		GameGlobal.MessageCenter.dispatch(MessageDef.BAG_VOL_ADD)
	}

    /**
     * 处理删除背包数据
     */
	public doDeleteItem(rsp: Sproto.sc_bag_deal_delete_item_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		var handle = rsp.handle;
		let isLegend = false
		let bagList = this.bagModel[type]
		let itemData = this.bagModel[type].Delete(handle)
		if (itemData) {
			this.NotifyItem(itemData.configID)
		}
		if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE)
		} else {
			GameGlobal.MessageCenter.dispatch(MessageDef.DELETE_ITEM)
			this.doBagVolChange();
			GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)

			if (type == UserBag.BAG_TYPE_OTHTER) {
				GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_OTHER_COUNT_CHANGE)
			}
		}
		// UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
	};
    /**
     * 处理添加背包数据
     */
	public doAddItem(rsp: Sproto.sc_bag_deal_add_item_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		var itemModel = new ItemData();
		itemModel.parser(rsp.data);

		this.bagModel[type].Add(itemModel);
		this.NotifyItem(itemModel.configID)
		var showTip = rsp.showTip;
		if (showTip) {
			if (itemModel.itemConfig.quality >= 4 && type == UserBag.BAG_TYPE_EQUIP) {
				UserTips.ins().showGoodEquipTips(itemModel)
			} else {
				if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
					UserBag.ShowItemTips(itemModel.configID, itemModel.count)
				}
			}
		}

		if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE)
		} else {
			this.doBagVolChange();
			GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		}

		// UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
	}

	public static ShowItemTips(itemId: number, count: number) {
		let itemConfig = GameGlobal.Config.ItemConfig[itemId]
		if (!itemConfig) {
			return
		}
		var quality = ItemBase.QUALITY_COLOR[itemConfig.quality];
		var str = "获得|C:" + quality + "&T:" + itemConfig.name + " x " + count + "|";
		var img = ResDataPath.GetItemFullPath(itemConfig.icon)
		UserTips.ins().showContTips(str, img);
	}


	private static TEMP_DATA: { itemData: ItemData } = {} as any
    /**
     * 处理物品更新
     */
	public doUpDataItem(rsp: Sproto.sc_bag_update_item_data_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		var handle = rsp.handle;
		var addNum = this.bagModel[type].Update(handle, rsp.num, UserBag.TEMP_DATA)
		var element = UserBag.TEMP_DATA.itemData
		UserBag.TEMP_DATA.itemData = null
		if (addNum != null) {
			this.NotifyItem(element.configID)
		}
		var showTip = rsp.showTip;
		if (showTip) {
			if (addNum > 0) {
				if (type != 2) {
					var quality = ItemBase.QUALITY_COLOR[element.itemConfig.quality];
					var str = "获得|C:" + quality + "&T:" + element.itemConfig.name + " x " + addNum + "|";
					var img = ResDataPath.GetItemFullPath(element.itemConfig.icon)
					UserTips.ins().showContTips(str, img);
				}
			}
		}
		if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
			this.doBagVolChange();
			MessageCenter.ins().dispatch(MessageDef.CHANGE_ITEM)
			GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		}
		// UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());

	};

    /**
     * 发送取出宝物
     */
	public sendGetGoodsByStore(uuid) {
		//去除单件装备 && 背包空间不足的情况下
		if (uuid != 0 && this.getSurplusCount() < 1) {
			// var strTips = GlobalConfig.ins().ServerTips[2].tips;
			UserTips.ins().showTips("strTips");
			return;
		}
		var cs_bag_get_goods_by_store = new Sproto.cs_bag_get_goods_by_store_request();
		cs_bag_get_goods_by_store.uuid = uuid;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_get_goods_by_store, cs_bag_get_goods_by_store);
	}

	///////////////////////////////////////////////////派发消息/////////////////////////////////////////////////////

    /**
     * 注册使用道具的回调方法
     * 用于一些道具特殊处理的情况
     */
	public registerUseItemFunc(itemID, useFunc) {
		this._useItemFunc[itemID] = useFunc;
	};
	/*派发删除道具*/

	/**派发是否有可用道具提示*/
	// private static _DispatchHasItemCanUse(hasItemCanUse) {
	// 	MessageCenter.ins().dispatch(MessageDef.BAG_HAS_ITEM_CAN_USE, hasItemCanUse)
	// }

	///////////////////////////////////////////////////////////////各种查询方法///////////////////////////////////////////////////////////////
    /**
     * 通过id获取背包物品
     * @param type 类型
     * @param id
     */
	public getBagItemById(id) {
		return this.bagModel[UserBag.BAG_TYPE_OTHTER].GetById(id)
	};
	/**根据道具类型和id获取道具*/
	public getBagGoodsByTypeAndId(type, id) {
		return this.bagModel[type].GetById(id)
	};
    /**
     * 获取背包了某种类型的装备
     * @param type 类型
     */
	public getBagEquipByType(type, subType?): ItemData[] {
		var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == type) {
				if (subType) {
					if (itemData[a].itemConfig.subType == subType) {
						itemData1.push(itemData[a]);
					}
				} else {
					itemData1.push(itemData[a]);
				}
			}
		}
		return itemData1;
	};
	/**
     * 获取背包了某种类型的道具
     * @param type 类型
     */
	public getBagGoodsByTypeAndSubType(type, subType): ItemData[] {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == type) {
				if (itemData[a].itemConfig.subType == subType) {
					itemData1.push(itemData[a]);
				}
			}
		}
		return itemData1;
	};
    /**
     * 通过id获取背包物品的数量
     * @param type 类型
     * @param id
     */
	public getBagGoodsCountById(type, id) {
		let itemData = this.bagModel[type].GetById(id)
		if (itemData) {
			return itemData.count
		}
		return 0
	}

	public GetCount(id: number): number {
		return this.getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, id)
	}

	public getGoodsAllCountByid(type, id) {
		let list = this.bagModel[type].GetByIds(id)
		let count = 0
		for (let data of list) {
			count += data.count
		}
		return count
	}

    /**
     * 获取背包道具数量
     * @param type	0是其他物品 1是装备
     */
	public getBagItemNum(type: number = 1) {
		return this.bagModel[type].GetLength()
	};
    /**
     * 获取背包剩余空间
     * 只有装备背包才有空间概念
     */
	public getSurplusCount() {
		return this.getMaxBagRoom() - this.getBagItemNum();
	};
    /**
     * 获取背包总空间
     */
	public getMaxBagRoom() {
		let count = 0;
		if (GameGlobal.FuliModel.FuliData.month > 0) {
			count = GameGlobal.Config.WelfareBaseConfig.moncardbag;
		}
		// return this.bagNum + GlobalConfig.ins().VipGridConfig[UserVip.ins().lv].grid + Recharge.ins().getAddBagGrid() + count;
		return this.bagNum + GlobalConfig.ins().VipGridConfig[UserVip.ins().lv].grid + count;
	};
	public sort1(a, b) {
		var s1 = ItemConfig.calculateBagItemScore(a);
		var s2 = ItemConfig.calculateBagItemScore(b);
		if (s1 > s2)
			return -1;
		else if (s1 < s2)
			return 1;
		else
			return 0;
	};
	public sort2(a, b) {
		var s1 = ItemConfig.calculateBagItemScore(a);
		var s2 = ItemConfig.calculateBagItemScore(b);
		if (s1 < s2)
			return -1;
		else if (s1 > s2)
			return 1;
		else
			return 0;
	};

    /**
     * 获取背包排列过的某种品质的装备 默认全部品质 可以多种品质 可以单一品质
     * @param quality  品质
     * @param sole   是否单一品质   0：返回多种  1：返回单一
     * @param sort 0:评分从小到大 1：评分从大到小
     * @param filter 过滤方法
     */
	public getBagSortQualityEquips(quality: number = 5, sole: number = 0, sort: number = 0, filter: any = null): ItemData[] {
		var list = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		var returnList = [];
		for (let key in list.mItems) {
			let itemData = list.mItems[key]
			if (quality != 5 && (itemData.itemConfig.quality > quality || (sole && itemData.itemConfig.quality < quality)))
				continue;
			if (filter != null && !filter(itemData))
				continue;
			returnList[returnList.length] = itemData;
		}
		return returnList;
	};

	// 删选熔炼的装备
	private SmeltEquip(dataList: ItemData[]) {
		if (!dataList) {
			return
		}
		let slotList: { [key: number]: ItemData[] } = {}
		for (let data of dataList) {
			let itemConfig = data.itemConfig
			if (itemConfig.quality >= 4) {
				continue
			}
			let tmp = slotList[itemConfig.subType]
			if (!tmp) {
				tmp = slotList[itemConfig.subType] = []
			}
			tmp.push(data)
		}
		let lv = GameGlobal.actorModel.level;
		let job = GameGlobal.actorModel.job;
		var role = SubRoles.ins().GetRoleData()
		if (!role) {
			return
		}
		var equipLen = role.getEquipLen()
		let outItemList = []
		for (let i = 0; i < equipLen; i++) {
			let slotItemList = slotList[i]
			if (!slotItemList) {
				continue
			}
			let levelList: { [key: number]: ItemData } = {}
			let goods = role.getEquipByIndex(i);
			let equipScore = 0
			if (goods.item.itemConfig) {
				equipScore = goods.item.GetScore()
			}
			for (let item of slotItemList) {
				let itemConfig = item.itemConfig
				if (itemConfig.job != 0 && itemConfig.job != job) {
					outItemList.push(item)
					continue
				}
				let itemScore = item.GetScore()
				// 装备评分大
				if (equipScore >= itemScore) {
					outItemList.push(item)
				} else {
					// 装备评分小
					let itemLevel = itemConfig.level
					if (!levelList[itemLevel]) {
						// 占位
						levelList[itemLevel] = item
					} else {
						// 占位评分小
						if (levelList[itemLevel].GetScore() < itemScore) {
							// 更换占位物品
							outItemList.push(levelList[itemLevel])
							levelList[itemLevel] = item
						} else {
							outItemList.push(item)
						}
					}
				}
			}
		}
		return outItemList
	}

	// 删选熔炼的装备
	private SmeltTemplateEquip(templateType: number, dataList: ItemData[]) {
		let roleTempData = GameGlobal.SubRoles.mTemplate[templateType]
		if (!roleTempData || !dataList) {
			return
		}

		let slotList: { [key: number]: ItemData[] } = {}
		for (let data of dataList) {
			let tmp = slotList[data.itemConfig.subType]
			if (!tmp) {
				tmp = slotList[data.itemConfig.subType] = []
			}
			tmp.push(data)
		}
		let lv = roleTempData.mLevel
		let outItemList = []
		for (let i = 0; i < UserTemplate.EQUIP_COUNT; i++) {
			let slotItemList = slotList[i]
			if (!slotItemList) {
				continue
			}
			let levelList: { [key: number]: ItemData } = {}
			let goods = roleTempData.mEquip[i]
			let equipScore = 0
			if (goods.itemConfig) {
				equipScore = goods.GetScore()
			}
			for (let item of slotItemList) {
				let itemConfig = item.itemConfig
				let itemScore = item.GetScore()
				// 装备评分大
				if (equipScore >= itemScore) {
					outItemList.push(item)
				} else {
					// 装备评分小
					let itemLevel = itemConfig.level
					if (!levelList[itemLevel]) {
						// 占位
						levelList[itemLevel] = item
					} else {
						// 占位评分小
						if (levelList[itemLevel].GetScore() < itemScore) {
							// 更换占位物品
							outItemList.push(levelList[itemLevel])
							levelList[itemLevel] = item
						} else {
							outItemList.push(item)
						}
					}
				}
			}
		}
		return outItemList
	}
	
    /**
     * 获取背包内用于熔炼的装备（用于熔炼）
     */
	public getOutEquips() {
		var list = this.getBagSortQualityEquips(5, 0, 1); //取得背包内所有的装备
		let dataList = {}
		for (let data of list) {
			if (!data.itemConfig) {
				continue
			}
			let type = data.itemConfig.type
			if (!dataList[type]) {
				dataList[type] = []
			}
			dataList[type].push(data)
		}
		let outList = []
		let equipList = this.SmeltEquip(dataList[0])
		if (equipList) {
			outList = outList.concat(equipList)
		}
		for (let key in dataList) {
			let type = Number(key)
			if (!type) {
				continue
			}
			let templateType = UserTemplate.GetTemplateTypeByItemType(type)
			if (!templateType) {
				continue
			}
			let equipList = this.SmeltTemplateEquip(templateType, dataList[key])
			if (equipList) {
				outList = outList.concat(equipList)
			}
		}
		return outList
	}

    /**
     * 获取背包物品排序
     */
	public getBagGoodsBySort() {
		let datas = this.bagModel[UserBag.BAG_TYPE_OTHTER].mItems
		let list = []
		for (let key in datas) {
			list.push(datas[key])
		}

		var goodsList = list.sort(function (n1, n2) {
			if (n1.configID > n2.configID) {
				return 1;
			}
			if (n1.configID < n2.configID) {
				return -1;
			}
			return 0;
		});
		return goodsList;
	};

	private static SortById(lhs, rhs) {
		return lhs.configID - rhs.configID
	}

	public GetBagStarBySort() {
		let datas = this.bagModel[UserBag.BAG_TYPE_ASTROLABE].mItems
		let list = []
		for (let key in datas) {
			list.push(datas[key])
		}
		var goodsList = list.sort(UserBag.SortById);
		return goodsList;
	}

	public GetBagStarList() {
		return this.bagModel[UserBag.BAG_TYPE_ASTROLABE].mItems
	}

    /**
     * 获取背包了某种类型的物品
     * @param type 类型
     */
	public getBagGoodsByType(type, subType?) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER].mItems;
		var itemData1 = [];

		for (var a in itemData) {
			if (subType) {
				if (itemData[a].itemConfig.type == type && itemData[a].itemConfig.subType == subType) {
					itemData1.push(itemData[a]);
				}
			} else {

				if (itemData[a].itemConfig.type == type) {
					itemData1.push(itemData[a]);
				}
			}
		}
		return itemData1;
	};
    /**
     * 获取背包某种品质装备的id排序，小到大
     */
	public getBagEquipBySort(quality) {
		var ret = [];
		let datas = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems
		let list = []
		for (let key in datas) {
			list.push(datas[key])
		}
		var equipsList = list.sort(function (n1, n2) {
			if (n1.configID > n2.configID) {
				return 1;
			}
			if (n1.configID < n2.configID) {
				return -1;
			}
			return 0;
		});
		for (var k in equipsList) {
			if (GlobalConfig.ins().ItemConfig[equipsList[k].configID].quality == quality) {
				ret.push(equipsList[k]);
			}
		}
		return ret;
	};
    /**
    * 获取背包某种品质装备的id(战力要比装备身上的要少)
    */
	public getBagEquipByLevelSort(quality): ItemData[] {
		var ret = [];
		let config = GlobalConfig.ins().ItemConfig
		if (this.bagModel[UserBag.BAG_TYPE_EQUIP]) {
			var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems;
			var itemData = null;
			var itemConfig = null;
			for (var k in equipsList) {
				itemData = equipsList[k];
				itemConfig = config[itemData.configID];
				if (itemConfig.quality == quality && itemConfig.type == 0) {
					ret.push(itemData);

					//策划需要把比自己战力大的金装装备 也加入分解列表中 (突然又喜欢加上限制的时候把注释打开就好) by 6.27
					// let itemPower = ItemConfig.CalculateScore(itemData.configID)
					// let role = SubRoles.ins().GetRoleData()
					// let eq = role.getEquipByIndex(itemConfig.subType)
					// let eqPower  = 0
					// if(eq)
					// {
					// 	eqPower = ItemConfig.CalculateScore(eq.item.configID) 
					// }

					// if(itemPower<=eqPower)
					// {
					// 	ret.push(itemData);
					// }
				}
			}
		}
		return ret;
	};
    /**
     * 通过handle获取背包物品
     * @param type 类型
     * @param handle
     */
	public getBagGoodsByHandle(type, handle) {
		return this.bagModel[type].GetByHandle(handle)
	};

    /**
     * 获取是否有可用道具
     */
	public getIsExitUsedItem() {
		var arr = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		for (let key in arr.mItems) {
			if (arr.mItems[key].getCanbeUsed()) {
				return true
			}
		}
		return false;
	};

	getBagGoodsById(type: number, id: number): ItemData {
		return this.bagModel[type].GetById(id)
	}

	//------------------------------------------------特殊道具回调函数------------------------------------------------
	public useRenameItem(id, count) {
		// ViewManager.ins().open(RenameWin);
	};

	private UseCallBoss(id, count) {

	}

	//是否有橙色装备
	public HasOrangeEquip() {
		let equipList = this.getBagEquipByLevelSort(ITEM_QUALITY.ORANGE_QUALITY)
		return equipList.length > 0
	}
    /**
 * 换算属性组的战斗力
 */
	public static getAttrPower(attr) {
		var powerConfig = GlobalConfig.ins().AttrPowerConfig;
		var allPower = 0;
		for (var i = 0; i < attr.length; i++) {
			let pConfig = powerConfig[attr[i].type]
			if (pConfig) {
				allPower += (attr[i].value == undefined ? 0 : attr[i].value) * pConfig.power;
			}
		}
		return Math.floor(allPower / 100);
	};
	/**背包物品类型-其他物品*/
	public static BAG_TYPE_OTHTER = 0;
	/**背包物品类型-装备 */
	public static BAG_TYPE_EQUIP = 1;
	/**寻宝相关 */
	public static BAG_TYPE_TREASUREHUNT = 2;
	/** 命格 */
	public static BAG_TYPE_ASTROLABE = 3;
	public static BAG_ENOUGH = 20;

	public static CheckEnough(itemId: number, value: number): boolean {
		var curNum = UserBag.ins().getBagGoodsCountById(0, itemId);
		if (curNum < value) {
			let config = GameGlobal.Config.ItemConfig[itemId]
			if (config) {
				UserTips.ins().showTips(config.name + "数量不足")
			}
			return false
		}
		return true
	}
}
