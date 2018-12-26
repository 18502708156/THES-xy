/**
 * 選擇關卡列表Com
 */
class TsumKoCheckpointListItem extends eui.ItemRenderer {
	private imgChoose: eui.Image;//选中边框
	private title: eui.Label;//标题
	private extraPanel: PetShowPanel;//怪物模型
	private clearanceImg: eui.Image;//通关Img
	private itemList: eui.List;//道具list
	private openBtn: eui.Button;//打开宝箱Btn
	private notAdoptLabel: eui.Label;//未通关Lab
	private recordLabel: eui.Label;//首通奖励Lab


	public childrenCreated() 
	{
		this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			ViewManager.ins().open(TsumKoBaseBagItemPlanel);
		}, this);
	}
	dataChanged() {
		let data = this.data;
		let info_clear = GameGlobal.TsumKoBaseModel.info_clear;//已通关的关卡
		if (data != undefined) {
			let isClearance = GameGlobal.TsumKoBaseModel.IsClearance(data.chapterid, data.sectionid);//是否通过
			let isGatePass = GameGlobal.TsumKoBaseModel.IsGatePass(data.chapterid, data.sectionid);//是否购买过
			this.extraPanel.SetBodyId(MonstersConfig.GetAppId(data.monsterid));
			this.title.text = data.name;
			this.itemList.itemRenderer = ItemBase;
			this.itemList.dataProvider = new eui.ArrayCollection([]);

			if (isClearance == true) {
				this.recordLabel.visible = false;
				this.notAdoptLabel.visible = false;
				this.itemList.visible = false;  //perdayreward
				this.itemList.dataProvider = new eui.ArrayCollection(data.perdayreward);
				// GameGlobal.TsumKoBaseModel.isAdopt=true;
				this.clearanceImg.visible = true;
				if (isGatePass == true)//已经购买过
				{
					this.openBtn.visible = false;
					this.itemList.visible = true;
				}
				else {
					this.itemList.visible = false;
					this.openBtn.visible = true;
				}
			}
			else//未通过
			{
				// GameGlobal.TsumKoBaseModel.isAdopt=false;
				this.clearanceImg.visible = false;
				this.openBtn.visible = false;
				this.itemList.visible = true;
				this.itemList.dataProvider = new eui.ArrayCollection(data.firstreward);
				this.notAdoptLabel.visible = true;
				this.recordLabel.visible = false;

				if (GameGlobal.TsumKoBaseModel.info_clear + 1 == data.id) {
					this.notAdoptLabel.visible = false;
					this.recordLabel.visible = true;
				}
				if (GameGlobal.TsumKoBaseModel.info_clear >= data.id) {
					this.notAdoptLabel.visible = false;
					this.itemList.dataProvider = new eui.ArrayCollection(data.perdayreward);
				}
				else {
					this.itemList.dataProvider = new eui.ArrayCollection(data.firstreward);
				}
			}
		}
	}
}