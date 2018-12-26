/**
 * 福利_历练
 */
class FuliPracticePanel extends BaseEuiView {
	//skinName
	//FuliPracticeSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;

	//名次显示
	private top1Panel: RoleComponent;
	private top2Panel: RoleComponent;
	private top3Panel: RoleComponent;
	//领取按钮
	private receiveBtn: eui.Button;
	//问号
	private questionBtn: eui.Button;
	//积分
	private score: eui.Label;
	//自己积分
	private myScore = 0;
	//item
	private item: ItemBase;
	//已获得Img
	private itemGetImg: eui.Image;
	//世界等级
	private worldClassLab: eui.Label;
	//前往
	private gotoLab: eui.Label;
	//滑动条
	private progressBar: eui.ProgressBar;
	//宝箱Img
	private boxImg0: eui.Image;
	private boxImg1: eui.Image;
	private boxImg2: eui.Image;
	//已领取宝箱Img
	private gainedImg0: eui.Image;
	private gainedImg1: eui.Image;
	private gainedImg2: eui.Image;
	//选中宝箱Img
	private selectBoxImg0: eui.Image;
	private selectBoxImg1: eui.Image;
	private selectBoxImg2: eui.Image;

	private lv = 0;
	private distanceLv = 0;
	private data: any;
	private tabID = 1;
	//显示类型 1绑元奖励 2经验奖励
	private showType = 2;
	//福利大厅_基础配置表
	private welfareBaseConfigTab: any;
	//福利大厅_历练奖励表
	private welfareConfigTab: any;
	//选择宝箱的索引 1 2 3 
	private index = 1;
	private isOwn = false;//是否夠歷練分
	public static CheckRedPoint() {
		if (!Deblocking.Check(GameGlobal.Config.WelfareBaseConfig.opentype, true)) {
			return false
		}
		return GameGlobal.FuliModel.mRedPoint.PracticeShowRedPoint();
	}
	public constructor() {
		super()
		this.skinName = "FuliPracticeSkin";
	}
	public childrenCreated() {
		this.welfareBaseConfigTab = GameGlobal.Config.WelfareBaseConfig;
		this.welfareConfigTab = GameGlobal.Config.WelfareConfig;
		this.data = GameGlobal.FuliModel.FuliData;
		this.lv = GameGlobal.actorModel.level;
		this.distanceLv = this.data.avgLv - this.lv;
		if (this.distanceLv <= 3) this.showType = 1;
		else this.showType = 2;

		for (let key in this.welfareConfigTab) {

			let lvArr = this.welfareConfigTab[key].level;
			if (lvArr.length == 2) {
				if (this.lv >= lvArr[0] && this.lv <= lvArr[1]) {
					this.tabID = Number(key);
					break;
				}
			}
			else {
				this.tabID = Number(key);
			}
		}

		this._AddClick(this.questionBtn, this._OnClick);
		this._AddClick(this.receiveBtn, this._OnClick);
		this._AddClick(this.gotoLab, this._OnClick);
		this._AddClick(this.boxImg0, this._OnClick);
		this._AddClick(this.boxImg1, this._OnClick);
		this._AddClick(this.boxImg2, this._OnClick);
	}
	public OnOpen() {
		//this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.updateTop1Panel);
		this.observe(MessageDef.FULI_GET_RECEIVEITEMSIGN, this.updateItemSign);
		//GameGlobal.RankingModel.sendRank(2);
		let baseInfo = GameGlobal.DailyModel.baseInfo;
		this.myScore = baseInfo.mCurActive;
		this.score.text = this.myScore.toString();

		this.worldClassLab.text = (this.data.avgLv).toString();

		this.progressBar.value = this.myScore;

		let arr = this.welfareBaseConfigTab.score;
		this.progressBar.maximum = arr[arr.length - 1];


		this.itemGetImg.visible = false;

		if (this.showType == 1) 
		{
			this.item.setItemData(this.welfareConfigTab[this.tabID].goldreward[0]);
			// this.item.isShowName(false);
		}
		else 
		{
			this.item.setItemData(this.welfareConfigTab[this.tabID].expreward[0]);
			// this.item.isShowName(false);
		}
		if (this.myScore < arr[0]) this.index = 1;
		for (let i = 0; i < arr.length; i++) {

			this["gainedImg" + i].visible = false;

			if (GameGlobal.FuliModel.isReceive(i + 1) == true) {
				this["gainedImg" + i].visible = true;
			}
			if (this.myScore >= arr[i]) {
				if (GameGlobal.FuliModel.isReceive(i + 1) == false)
					this.index = i + 1;
				else {
					if (i > 0) {
						if (GameGlobal.FuliModel.isReceive(i) == false)
							this.index = i;
						else
							this.index = i + 1;
					}

				}

			}

		}
		this.isItemGetImg(this.index);
		this.isShowSelectBoxImg(this.index);
		this.showTop1Panel();
		this.isOwnTF(this.welfareBaseConfigTab.score[0]);
	}

	public showTop1Panel() {

		for (let i = 0; i < this.data.rankData.length; i++) {
			let color = 0xFF5900;
			if (i == 0) color = 0xFF5900;
			if (i == 1) color = 0xAF2BB7;
			if (i == 2) color = 0x5A6EE7;
			if (i + 1 < 4) {
				RoleComponent.setlv(this["top" + (i + 1) + "Panel"], this.data.rankData[i].level, color);
				this["top" + (i + 1) + "Panel"].setName(this.data.rankData[i].name, color);
				RoleComponent.SetShowImage(this["top" + (i + 1) + "Panel"], this.data.rankData[i].job, this.data.rankData[i].sex, this.data.rankData[i].shows);
			}
		}
	}



	private updateItemSign(msg) {
		if (msg.ret) {
			if (GameGlobal.FuliModel.isReceive(this.index)) {
				let num = this.index - 1;
				this["gainedImg" + num].visible = true;
				this.itemGetImg.visible = true;
			}
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.receiveBtn:
				if (this.isOwn == false)
					UserTips.ins().showTips("活跃度不足");
				else
					GameGlobal.FuliModel.ReceiveItem(this.index);
				break;
			case this.questionBtn:
				ViewManager.ins().open(ActivityDescPanel, this.welfareBaseConfigTab.welfarehelpinfo);
				break;
			case this.gotoLab:
				ViewManager.ins().close(FuliPracticePanel);
				ViewManager.ins().open(DailyMainWin);
				break;
			case this.boxImg0:
				this.isOwnTF(this.welfareBaseConfigTab.score[0]);
				this.index = 1;
				this.isItemGetImg(this.index);
				this.isShowSelectBoxImg(this.index);
				break;
			case this.boxImg1:
				this.isOwnTF(this.welfareBaseConfigTab.score[1]);
				this.index = 2;
				this.isItemGetImg(this.index);
				this.isShowSelectBoxImg(this.index);
				break;
			case this.boxImg2:
				this.isOwnTF(this.welfareBaseConfigTab.score[2]);
				this.index = 3;
				this.isItemGetImg(this.index);
				this.isShowSelectBoxImg(this.index);
				break;

		}
	}
	//判断分数 是否足够
	private isOwnTF(score: number): boolean {
		this.myScore = GameGlobal.DailyModel.baseInfo.mCurActive
		if (this.myScore >= score)
			this.isOwn = true;
		else
			this.isOwn = false;
		return this.isOwn;
	}
	//item领取是否显示
	private isItemGetImg(index) {
		if (GameGlobal.FuliModel.isReceive(index) == true) {
			this.itemGetImg.visible = true;
		}
		else {
			this.itemGetImg.visible = false;
		}
	}
	//小宝箱选中效果是否显示
	private isShowSelectBoxImg(index) {
		this.selectBoxImg0.visible = false;
		this.selectBoxImg1.visible = false;
		this.selectBoxImg2.visible = false;
		let num = index - 1;
		this["selectBoxImg" + num].visible = true;

	}
	public OnClose() {

	}
}

class RoleComponent extends eui.Component {
	////
	// ShowPanelSkin.exml
	////

	protected roleShowPanel: RoleShowPanel;
	protected lvTxt: eui.Label;
	protected nameTxt: eui.Label;

	public constructor() {
		super();
		this.skinName = "ShowPanelSkin";
	}
	public setName(name: string, color) {
		this.nameTxt.text = name;
		this.nameTxt.textColor = color;
	}
	public static setlv(comp: RoleComponent, lv: string, color) {
		if (comp != undefined) {
			comp.lvTxt.text = "Lv." + lv;
			comp.lvTxt.textColor = color;
		}
	}


	public static SetShowImage(comp: RoleComponent, job, sex, shows) {
		let playerInfo = new Sproto.sc_show_other_player_request
		playerInfo["job"] = job;
		playerInfo["sex"] = sex;
		playerInfo["shows"] = shows;
		if (comp != undefined) {
			comp.roleShowPanel.mScale = 1;
			comp.roleShowPanel.SetShowImage(playerInfo);
			comp.roleShowPanel.SetTianx("");
			comp.roleShowPanel.scaleX = comp.roleShowPanel.scaleY = 0.8
		}

	}

}