/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/27 17:01
 * @meaning: 灵童命格详情
 * 
 **/

class DestinyPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "命格"

    /////////////////////////////////////////////////////////////////////////////
    // DestinySkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnResolve: eui.Button;
    protected btnShow: eui.Button;
    protected uiBg1: eui.Image;
    protected powerLabel: PowerLabel;
    protected item0: DestinyItem;
    protected item1: DestinyItem;
    protected item2: DestinyItem;
    protected item3: DestinyItem;
    protected item4: DestinyItem;
    protected item5: DestinyItem;
    protected lbGoto1: eui.Label;
    protected gRect1: eui.Group;
    protected info0: DestinyInfoRect;
    protected info1: DestinyInfoRect;
    protected btnUp: eui.Button;
    protected btnEquip: eui.Button;
    protected lbGetItemNe: eui.Label;
    protected gRect0: eui.Group;
    protected goToEquip: eui.Button;
    protected gRect2: eui.Group;
    protected info2: DestinyInfoRect;
    /////////////////////////////////////////////////////////////////////////////




	tPanelData = [];//界面总体数据数据

	tItemList: DestinyItem[] = [];//命格列表

	public tBagList = [];//背包命格列表


	public nIndex = 0; //当前选择下标

	tDestinyList = [];//命格列表

	private bUp = false;//能否升级命格



	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "DestinySkin"

		for (let i = 0; i < 6; i++) {
			this.tItemList.push(this["item" + i])
		}

		UIHelper.SetLinkStyleLabel(this.lbGoto1, "前往获取命格") //下划线

	}

	public childrenCreated() {

	}

	public OnOpen(...param: any[]) {

		this.nIndex = param[0] || 0
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//
		this.observe(MessageDef.DESTINY_CLICK, this.onItem)//
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateMeatialCount)
		this.observe(MessageDef.DESTINY_RP, this.setData)
		this._AddClick(this.btnResolve, this.onClick)
		this._AddClick(this.btnShow, this.onClick)

		this._AddClick(this.btnUp, this.onClick)
		this._AddClick(this.btnEquip, this.onClick)
		this._AddClick(this.goToEquip, this.onClick)
		this._AddClick(this.lbGoto1, this.onClick)
		this._AddClick(this.powerLabel, this.onClick)



	}

	public UpdateContent() {
		this.setData()
		this.onSelectChange()

		//所有命格战力
		this.powerLabel.text = GameGlobal.DestinyController.GetPower()
	}

	public getAttrInfoLb() {
		let strObj = { strL: "", strR: "" };
		let count = 0
		for (const item in this.tBagList) {
			let data = this.tBagList[item]
			if (data.attars) {
				for (const index in data.attars) {
					let 　pData = data.attars[index]
					count++
					let strHuan = '\n'
					if (count % 2 == 1) {
						strObj.strL = strObj.strL + AttributeData.getAttStrByType(pData, 0, "+", false, '#682f00') + '\n';
					}
					else {
						strObj.strR = strObj.strR + AttributeData.getAttStrByType(pData, 0, "+", false, '#682f00') + '\n';
					}
				}
			}
		}
		return strObj
	}



	public setData() {
		this.tBagList = GameGlobal.DestinyController.getUseDestinyData()

		for (let i = 0; i < 6; i++) {
			let tList = { index: this.nIndex == i, data: this.tBagList[i], num: i }
			this.tItemList[i].onUpdate(tList)

		}
	}

	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.btnResolve:
				ViewManager.ins().open(DestinyResovePanel)
				break
			case this.btnShow:
				ViewManager.ins().open(DestinyShow)
				break
			case this.btnUp://升级
				if (this.bUp) {
					GameGlobal.DestinyManage.babyStartUpLv(this.nIndex + 1)
				}
				else {
					UserTips.ins().showTips("物品不足")
				}
				break
			case this.btnEquip://点击则打开“选择命格装备面板”
				this.ShowDestinyEquipLayer(this.nIndex)
				break
			case this.goToEquip://点击则打开“选择命格装备面板”
				this.ShowDestinyEquipLayer(this.nIndex)
				break
			case this.lbGoto1://点击将跳转到“逆命面板”
				ViewManager.ins().openIndex(DestinyUpWin, 1)
				break
			case this.powerLabel://打开属性界面
				ViewManager.ins().open(DestinyArrDescPanel, this.getAttrInfoLb().strL, this.getAttrInfoLb().strR)//打开属性界面
				break
		}
	}

	public onItem(_num) {
		this.tBagList = GameGlobal.DestinyController.getUseDestinyData()
		if (this.tBagList[_num]) {
			let same = this.nIndex == _num
			let openEquip = true
			if (this.tBagList[_num].level) {
				openEquip = same
			}
			this.nIndex = _num || 0
			this.setData()
			this.onSelectChange()
			if (openEquip) {
				this.ShowDestinyEquipLayer(_num)
			}
		}
		else {
			UserTips.ins().showTips("灵童达到" + DestinyConst.GetLockLevel(_num) + "阶解锁")
		}
	}

	private ShowDestinyEquipLayer(index: number) {
		ViewManager.ins().open(DestinyEquipLayer, this.tBagList[index], this.nIndex, false)
	}

	//选择变化
	public onSelectChange() {
		let data = this.tBagList[this.nIndex]
		if (data.item) {
			if (data)//命格数据 //已解锁
			{
				if (data.id) {
					this.gRect0.visible = false
					this.gRect1.visible = true
					this.gRect2.visible = false

					//当前属性
					let tList = this.getArrInfoList(data)
					this.info0.onUpdate(tList)
					let local = GlobalConfig.ins().DestinyAttrsConfig[data.id];
					if (local) {
						let tList = this.getArrInfoList(local)
						this.info1.onUpdate(tList)
					}
					// 显示升级所需材料
					this.showUpMeatial(GlobalConfig.ins().DestinyResolveConfig[data.type][data.level - 1].promotestar)


				}
				else//最后一个
				{
					this.gRect0.visible = false
					this.gRect1.visible = false
					this.gRect2.visible = true
					let tList = this.getArrInfoList(data)
					this.info2.onUpdate(tList)
				}
			}

		}
		else //未装备
		{
			this.gRect0.visible = true
			this.gRect1.visible = false
			this.gRect2.visible = false
		}




	}

	private m_Count: number = 0

	//显示升级所需材料
	private showUpMeatial(_count) {
		this.m_Count = _count
		this.UpdateMeatialCount()
	}

	private UpdateMeatialCount() {
		if (this.m_Count == null) {
			this.lbGetItemNe.text = ""
			return
		}
		let _count = this.m_Count
		let ownStr = ""
		let upId = GlobalConfig.ins().DestinyBaseConfig.uplevelitemid
		var curNum = UserBag.ins().GetCount(upId);
		let config = GameGlobal.Config.ItemConfig[upId]
		let strCount = curNum + "/" + _count
		//显示升级所需材料
		if (curNum >= _count) //满足
		{
			ownStr = `|C:0x6e330b&T:消耗: |C:0x6e330b&T:${config.name}|C:0x019704&T:${strCount}|`
			this.bUp = true
		}
		else {
			this.bUp = false
			ownStr = `|C:0x6e330b&T:消耗: |C:0x6e330b&T:${config.name}|C:0xdb0000&T:${strCount}|`
		}
		this.lbGetItemNe.textFlow = TextFlowMaker.generateTextFlow(ownStr)
	}

	private getArrInfoList(_arr) {
		let data = {} as any
		let strList = []
		data.list = strList
		if (_arr) {
			let config = GlobalConfig.ins().ItemConfig[_arr.item]
			data.quality = config.quality
			strList[0] = config.name
			let strPower = ""
			let strArr1 = ""
			let strArr2 = ""
			if (_arr.attars) {
				strPower = "战力+" + ItemConfig.CalcAttrScoreValue(_arr.attars)
				if (_arr.attars[0]) {
					strArr1 = AttributeData.getAttStrByType(_arr.attars[0], 0, "+", false, '#682f00');
				}
				if (_arr.attars[1]) {
					strArr2 = AttributeData.getAttStrByType(_arr.attars[1], 0, "+", false, '#682f00');
				}
			}
			strList[1] = strPower

			if (_arr.desc) {
				strArr1 = _arr.desc
			}

			strList[2] = strArr1
			strList[3] = strArr2
		}

		return data
	}

}




