/**
 * 福利_搖錢樹
 */
class FuliGoldTreePanel extends BaseEuiView {
	//skinName
	//FuliGoldTreeSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;

	//購買Btn
	private goBtn: eui.Button;
	//消耗金幣
	private consumeLabel: ConsumeTwoLabel;
	//免費Label
	private freeLabel: eui.Label;
	//獲得錢幣Label
	private acquisitionLabel: eui.Label;
	//今天剩餘次數
	private nowCountLabel: eui.Label;
	//剩餘Label
	private surplusCountLabel: eui.Label;
	//加成
	private addLabel: eui.Label;
	//兌換次數
	private countLabel: eui.Label;
	private label2: eui.Label;
	private ReceiveLabel: eui.Label;
	//VIP次數
	private vipCountLabel: eui.Label;
	private vipLv;
	private keyMax = 0;
	//vip最大次數
	private vipMax;
	//搖獎次數
	private shake;
	//搖錢樹配置表_Vip限制
	private tab_CashCowLimitConfig: any;
	//搖錢樹配置表_基礎配置
	private tab_CashCowBasicConfig: any;
	//金錢增幅
	private tab_CashCowAmplitudeConfig: any;
	//寶箱配置表
	private tab_CashCowBoxConfig: any;
	//文字図片
	private describeImg0: eui.Image;
	private describeImg1: eui.Image;
	private describeImg2: eui.Image;
	private describeImg3: eui.Image;
	private ImgBg: eui.Image;
	//怪物図標
	private playerLogoImg: eui.Image;
	private playerEffGroup: eui.Group;
	//寶箱Img
	private boxImg: eui.Image;
	private boxIndex = 1;


	public static CheckRedPoint(): boolean {
		return GameGlobal.FuliModel.mRedPoint.IsGoldTree() || GameGlobal.FuliModel.mRedPoint.IsGodTreeBox()
	}

	public constructor() {
		super()
		this.skinName = "FuliGoldTreeSkin";
	}
	public childrenCreated() {
		this._AddClick(this.goBtn, this._OnClick);
		this._AddClick(this.boxImg, this._OnClick);

		this.tab_CashCowLimitConfig = GameGlobal.Config.CashCowLimitConfig;
		this.tab_CashCowBasicConfig = GameGlobal.Config.CashCowBasicConfig;
		this.tab_CashCowAmplitudeConfig = GameGlobal.Config.CashCowAmplitudeConfig;
		this.tab_CashCowBoxConfig = GameGlobal.Config.CashCowBoxConfig;

		for (let key in this.tab_CashCowLimitConfig) {
			if (Number(key) != 0)
				this.keyMax++;
		}

	}
	public OnOpen() {
		this.observe(MessageDef.FULI_GOLDTREE_INFO, this.update);
		this.observe(MessageDef.VIP_LEVEL_CHANGE, this.update);
		this.vipLabel();


		this.showNendMoney();
		this.UpdateImgShow();
		this.showBox();
		this.updateLabel();
	}
	private str = "";
	private isShowVIPLabel = true;
	private vipLabel(): void {
		this.vipLv = UserVip.ins().lv;
		let ViplvUp = this.vipLv + 1;
		if (ViplvUp >= this.keyMax) {
			ViplvUp = this.keyMax;
			this.vipCountLabel.visible = false;
			this.isShowVIPLabel = false;
			return;
		}

		let count = this.tab_CashCowLimitConfig[ViplvUp].maxTime - this.tab_CashCowLimitConfig[this.vipLv].maxTime;
		if (ViplvUp == this.vipLv)
			this.vipCountLabel.visible = false;
		// let vip=UserVip.ins().lv+1;
		if (this.tab_CashCowLimitConfig[ViplvUp] == undefined)
			ViplvUp = UserVip.ins().lv;
		this.vipCountLabel.textFlow =
			(new egret.HtmlTextParser).parser
				("<a color=0x6E330B>vip" + ViplvUp +
				"可额外再摇</a><a color=0x00AD00>" + count + "次</a>");

		this.str = ("<a color=0x6E330B>提升至vip" + ViplvUp + ",可额外再摇</a><a color=0x00AD00>" + count + "次</a>");
	}

	private update(): void {
		this.UpdateImgShow();
		this.showNendMoney();
		this.vipLabel();
		this.showBox();
		this.updateLabel();
	}

	private static ODDS = {
		[2]: true,
		[4]: true,
		[8]: true,
		[10]: true,
	}

	public UpdateImgShow() {

		this.ImgBg.visible = true;
		if (GameGlobal.FuliModel.FuliData.odds == 2)//土地
		{
			this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "2beibaoji", "tudigong");
			this.playerLogoImg.source = "ui_fldt_tudigong";

		}
		else if (GameGlobal.FuliModel.FuliData.odds == 4)//幸运
		{
			this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "4beibaoji", "xingyunshen");
			this.playerLogoImg.source = "ui_fldt_xingyunshen";

		}
		else if (GameGlobal.FuliModel.FuliData.odds == 8)//福
		{
			this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "8beibaoji", "fushen");
			this.playerLogoImg.source = "ui_fldt_fushen";

		}
		else if (GameGlobal.FuliModel.FuliData.odds == 10)//財
		{
			this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "10beibaoji", "caishen");
			this.playerLogoImg.source = "ui_fldt_caishen";
		}
		else {
			this.imgNotShow();
		}

		if (this.playerLogoImg.source != "") {
			this.goBtn.enabled = false;
			this.nowPlayerEff();
			this.playerLogoImg.scaleY = this.playerLogoImg.scaleX = 0;
			egret.Tween.get(this.playerLogoImg).to({ scaleY: 1.1, scaleX: 1.1 }, 700)
				.to({ scaleY: 0.9, scaleX: 0.9 }, 200).wait(1500).call(() => {
					this.imgNotShow(1);
					this.goBtn.enabled = true;
					if (this.eff != undefined) {
						this.playerEffGroup.removeChild(this.eff)
						this.eff = null
					}
				}, this)
		}

	}

	private eff;
	private nowPlayerEff(): void {
		if (this.eff)
			return

		this.eff = new MovieClip;
		this.eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hyui_001"), true, 0);
		this.eff.x = this.playerLogoImg.x - 25;
		this.eff.y = this.playerLogoImg.y - 80;
		this.eff.scaleX = 1
		this.eff.scaleY = 1
		this.playerEffGroup.addChild(this.eff)
		this.playerEffGroup.setChildIndex(this.eff, 0);
	}

	private scale = 0;
	private showEff(): void {

		let imgScale = 0;

		this.scale += 0.1;

		this.playerLogoImg.scaleY = this.playerLogoImg.scaleX = this.scale;
		if (this.scale >= 1) {
			this.scale = 0;
			this.goBtn.visible = true;
		}
	}

	private imgNotShow(notSet?): void {
		if (notSet == undefined) {
			this.describeImg0.source = "";
			this.describeImg1.source = "";
			this.describeImg2.source = "";
			this.describeImg3.source = "";
			this.playerLogoImg.source = "";
			this.ImgBg.visible = false;
		}
		else {
			this.describeImg2.source = "";
			this.describeImg3.source = "";
			this.playerLogoImg.source = "";
			this.ImgBg.visible = true;
		}
	}

	private imgSource(img, img2, img3, img4, str, str2): void {
		img.source = "ui_fldt_bm_" + str2 + "01";
		img2.source = "ui_fldt_bm_" + str;

		img3.source = "ui_fldt_bm_" + str2 + "01";
		img4.source = "ui_fldt_bm_" + str;
	}
	//showNeedMoney
	private showNendMoney(): void {
		this.shake = GameGlobal.FuliModel.FuliData.shake + 1;
		let gold = this.tab_CashCowBasicConfig[this.shake].yuanbao;
		if (gold == 0) {
			this.consumeLabel.visible = false;
			this.freeLabel.visible = true;
		}
		else {
			this.freeLabel.visible = false;
			this.consumeLabel.visible = true;
			let item = {};
			item["type"] = 0;
			item["id"] = 2;
			item["count"] = gold;
			let arr = [];
			arr.push(item);
			this.consumeLabel.Set(arr);
		}
	}
	//updateLabel
	private needCount = 0;
	private updateLabel(): void {
		this.countLabel.visible = true;
		this.label2.visible = true;
		this.ReceiveLabel.visible = true;
		this.vipMax = this.tab_CashCowLimitConfig[this.vipLv].maxTime;
		let shakeCount = GameGlobal.FuliModel.FuliData.shake;
		this.nowCountLabel.text = "今日次数:" + shakeCount + "/" + this.vipMax;
		let amplitude = GameGlobal.FuliModel.FuliData.amplitude;
		let gold = CommonUtils.overLength(Math.floor(this.tab_CashCowBasicConfig[this.shake].gold * amplitude / 100));
		//this.acquisitionLabel.text="立即获得"+gold+"银两";

		let addVal = ""
		let odds = GameGlobal.FuliModel.FuliData.odds
		if (odds && FuliGoldTreePanel.ODDS[odds]) {
			addVal = " * " + odds + " "
		}
		this.acquisitionLabel.textFlow = (new egret.HtmlTextParser).parser //6E330B
			("<a color=0x6E330B>立即获得</a> <a color=0xFFeb04>" + gold + addVal + "</a> <a color=0x6E330B>银两</a>");

		let lv = GameGlobal.FuliModel.FuliData.level + 1;

		let maxCount = this.tab_CashCowAmplitudeConfig[lv].needExp;

		let openBoxCount = this.tab_CashCowBoxConfig[this.boxIndex + 1].time;
		this.needCount = openBoxCount - shakeCount;
		this.countLabel.text = this.needCount + "次";
		if (this.needCount <= 0) {
			this.countLabel.visible = false;
			this.label2.visible = false;
			UIHelper.ShowRedPoint(this.boxImg, true)
		}else {
			UIHelper.ShowRedPoint(this.boxImg, false)
		}
		let arrLength=GameGlobal.FuliModel.FuliData.drawBin.length;
		if (GameGlobal.FuliModel.FuliData.drawBin[arrLength-1] == 4) {
			this.ReceiveLabel.visible = false;
			UIHelper.ShowRedPoint(this.boxImg, false)
		}
		//let nowCount=shakeCount-num;
		this.surplusCountLabel.text = GameGlobal.FuliModel.FuliData.exp + "/" + maxCount;

		//let lv=GameGlobal.FuliModel.FuliData.level;
		this.addLabel.text = "加成" + amplitude + "%";


	}
	private showBox(): void {
		this.boxIndex = 0;
		let boxArr = GameGlobal.FuliModel.FuliData.drawBin;
		let isSetIndex=false;
		for (let i = 0; i < boxArr.length; i++) {
			if (boxArr[i] == 2 || boxArr[i] == 3) {
				this.boxIndex = i;
				isSetIndex=false
				break;
			}
			else
			{
				isSetIndex=true;
			}
		}
		if(isSetIndex==true)
			this.boxIndex=boxArr.length-1;
	}

	

	private effGroup: eui.Group;
	private Play() {

		let item = new GoldFlyEff();
		item.mGap = 50;
		item.mCount = 16;
		item.mMax = 16;
		item.mSource = "ui_bm_qianb2";

		let pos = egret.$TempPoint
		DisplayUtils.GetGlobalPos(this.effGroup, pos)

		let targetPos = new egret.Point
		targetPos.x = 100 //561
		targetPos.y = 0
		let view = ViewManager.ins().getView(MainTopPanel) as MainTopPanel
		if (view) {
			DisplayUtils.GetGlobalPos(view.god, targetPos as any)
		}


		item.Play(new egret.Rectangle(pos.x, pos.y, this.effGroup.width, this.effGroup.height), targetPos.x, targetPos.y)
	}


	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.goBtn:
				if (GameGlobal.FuliModel.FuliData.shake < this.vipMax) 
				{
					let needGold=this.tab_CashCowBasicConfig[this.shake].yuanbao;
					// if(needGold!=0)
					// {
					 //WarnWin.show("是否花费"+needGold+" 元宝？",()=>{
						if(Checker.Money(2,needGold, true)) 
						{
							this.Play();
							GameGlobal.FuliModel.playGold();
						}
					 //},this);
					// }
					// else
					// {
					// 	this.Play();
					// 		GameGlobal.FuliModel.playGold();
					// }
				}
				else {
					if (this.isShowVIPLabel == true)
						ViewManager.ins().open(FuliGoldTreeVipPanel, this.str);
				}
				break;
			case this.boxImg:
				if (GameGlobal.FuliModel.FuliData.drawBin[this.boxIndex] == 3)
					GameGlobal.FuliModel.playGoldBox(this.boxIndex + 1);
				else
					ViewManager.ins().open(FuliGoldTreeItemPanel, this.boxIndex, this.needCount);
				break;
		}
	}
	public OnClose() {

	}
}