/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:57
 * @meaning: 法宝分解详情
 * 
 **/

class TreasureResolvePanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "分解"


	tPanelData = [];//界面总体数据数据


	private listView: eui.List;

	protected checkBox0: eui.CheckBox;
	protected checkBox1: eui.CheckBox;
	protected checkBox2: eui.CheckBox;
	protected checkBox3: eui.CheckBox;
	protected checkBox4: eui.CheckBox;
	protected checkBox5: eui.CheckBox;
	protected checkBox6: eui.CheckBox;
	protected lbGet: eui.Label;
	protected btnDress: eui.Button;

	private tHave = [];//持有列表
	private tCheckBox = [];//选择框


	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TreasureResolvePanelSkin"
		this.listView.itemRenderer = TreasureHoldIcon;
	}

	public childrenCreated() {
		for (let i = 0; i < 6; i++) {
			let item = this["checkBox" + i]
			item.labelDisplay.textColor = ItemBase.QUALITY_COLOR[i]
			this.tCheckBox[i] = item
			item.addEventListener(egret.Event.CHANGE, this.chage, this)
		}
	}

	public OnOpen(...param: any[]) {

		var nIndex = param[0] || 0;
		this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent)//法宝数据变化
		this.observe(MessageDef.TREASURE_LOCK, this.upList)//上锁变化
		this._AddClick(this.btnDress, this.onClick)

	}


	public upList() {
		this.setData();
		var tList = [];
		for (const item in this.tHave) {
			if (this.tHave[item].id) {
				tList.push(this.tHave[item])
			}
		}

		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(tList);
	}


	public UpdateContent() {
		this.setData();
		var tList = [];
		for (const item in this.tHave) {
			if (this.tHave[item].id) {
				tList.push(this.tHave[item])
			}
		}


		// (this.listView.dataProvider as eui.ArrayCollection).replaceAll(tList);
		this.listView.dataProvider = new eui.ArrayCollection(tList)


		this.lbGet.text = this.getResolveNum()
	}

	//点击选择框改变内容
	public chage() {
		this.UpdateContent()
	}


	public setData() {
		this.tHave = GameGlobal.TreasureModel.getHaveList()
	}

	public getResolveNum(): string {
		var nNums = 0
		var tHaveData = GameGlobal.TreasureModel.getHaveList()
		var pConfig = GlobalConfig.ins().SpellsResDecomposeConfig

		for (const item in this.tCheckBox) {
			var pBox = this.tCheckBox[item]
			if (pBox.selected) {
				for (const index in tHaveData) {
					if (tHaveData[index].quality == item) {
						nNums = nNums + pConfig[tHaveData[index].id].count
					}
				}
			}
		}

		return nNums + "";
	}


	public getResolveData() {
		var tList = []
		var tHaveData = GameGlobal.TreasureModel.getHaveList()
		for (const item in this.tCheckBox) {
			var pBox = this.tCheckBox[item]
			if (pBox.selected) {
				for (const index in tHaveData) {
					if (tHaveData[index].quality == item) {
						tList.push(tHaveData[index].spellsId)
					}
				}
			}
		}

		return tList;
	}

	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.btnDress:
				if (this.getResolveData().length) {
					GameGlobal.TreasureModel.sendSpellsResSmelt(this.getResolveData())
				}
				break
		}
	}

	public static RedPointCheck(): boolean {
		return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_RESOLVE_TREASURE)
	}

}


