class YingYuanInfoPanel extends BaseView implements ICommonWindowTitle {

	public girl: eui.CheckBox;
	public box: eui.CheckBox;
	public imgIcon0: eui.Image;
	public btnPrev0: eui.Button;
	public btnNext0: eui.Button;
	public priceicon: PriceIcon;
	public jieHunBtn: eui.Button;
	public imgIcon1: eui.Image;
	public imgIcon2: eui.Image;
	public chage: eui.Button;
	//public list: eui.List;
	public head:YingYuanHeadItem
	public xianHuaBnt: eui.Button;
	public jieHunBnt: eui.Button;
	public liHunBnt: eui.Button;
	public qingLv: eui.Label;
	public bar: eui.ProgressBar;
	public pro: eui.Label
	public Bnt: eui.Button;
	public wenHao: eui.Button;
	public list1: eui.List;
	public list0: eui.List;
	protected roleShowPanel0: RoleShowPanel;
	protected roleShowPanel1: RoleShowPanel;
	public helpBtn: eui.Button
	public DayTimes: eui.Label
	protected pGroupRewar: eui.Group;
	protected itemBaee: ItemBase;
	protected lbPassLvReward: eui.Label;

	public static NAME = "婚姻"

	public grade: number = 1
	public spouse: number = 1

	protected childrenCreated(): void {
		//this.list.itemRenderer = YingYuanHeadItem
		this.list1.itemRenderer = ItemBase
		this.list0.itemRenderer = ItemBaseNotName
	}

	public OnOpen() {
		GameGlobal.YingYuanModel.sendMarryFriends()
		this.observe(MessageDef.YING_YUAN_HEAD, this.UpdataHead)
		this.observe(MessageDef.IS_MARRY_INFO, this.UpdateContent)
		this._AddClick(this.chage, this._OnClick)
		this._AddClick(this.girl, this._OnClick)
		this._AddClick(this.box, this._OnClick)
		this._AddClick(this.btnPrev0, this._OnClick)
		this._AddClick(this.btnNext0, this._OnClick)
		this._AddClick(this.jieHunBtn, this._OnClick)
		this._AddClick(this.Bnt, this._OnClick)
		this._AddClick(this.xianHuaBnt, this._OnClick)
		this._AddClick(this.jieHunBnt, this._OnClick)
		this._AddClick(this.liHunBnt, this._OnClick)
		this._AddClick(this.wenHao, this._OnClick)
		this._AddClick(this.helpBtn, this._OnClick)
		this.box.selected = true
		this.girl.selected = false
		this.touchEnabled = false
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.xianHuaBnt:
				ViewManager.ins().open(YingYuanXianHuaPanel)
				break
			case this.jieHunBnt:
				ViewManager.ins().open(YingYuanZhengShuPanel)
				break
			case this.liHunBnt:
				ViewManager.ins().open(YingYuanLiHunPanel)
				break
			case this.chage:
				ViewManager.ins().open(YingYuanAddPanel)
				break
			case this.girl:
				this.box.selected = !this.girl.selected
				this.box.selected ? this.spouse = 1 : this.spouse = 2
				break
			case this.box:
				this.girl.selected = !this.box.selected
				this.box.selected ? this.spouse = 1 : this.spouse = 2
				break
			case this.btnPrev0:
				this.grade--
				if (this.grade == 0) {
					this.grade = 1
					return
				}
				this.MarryType(this.grade)
				break
			case this.btnNext0:
				this.grade++
				if (this.grade > GameGlobal.YingYuanModel.MarryConfigLen()) {
					this.grade = GameGlobal.YingYuanModel.MarryConfigLen()
					return
				}
				this.MarryType(this.grade)
				break
			case this.jieHunBtn:
				if (!GameGlobal.YingYuanModel.marryFRIend) {
					return
				}
				let ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency
				if (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today == 0) {
					UserTips.InfoTip("今日没有结婚次数")
					return
				}
				GameGlobal.YingYuanModel.marryPropose(GameGlobal.YingYuanModel.marryFRIend.friendInfo.dbid, this.grade, this.spouse)
				break
			case this.Bnt:
				let Config = GameGlobal.Config.IntimateConfig[GameGlobal.YingYuanModel.marryInfo.level + 1]
				let Info = GameGlobal.YingYuanModel.marryInfo
				if (Info.intimate < Config.intimate) {
					return
				}
				GameGlobal.YingYuanModel.marryLevelUp()
				break
			case this.wenHao:
				ViewManager.ins().open(ActivityDescPanel, 45, "甜蜜值")
				break
			case this.helpBtn:
				ViewManager.ins().open(ActivityDescPanel, 18, "规则说明");
				break
		}
	}

	public UpdateContent(): void {
		if (GameGlobal.YingYuanModel.iSMarry()) {
			this.currentState = "married"
			this.UpExp()
		} else {
			this.currentState = "unmarried"
			this.MarryType(this.grade)
			this.UpdataHead()
		}
	}

	public UpExp() {
		let Config = GameGlobal.Config.IntimateConfig[GameGlobal.YingYuanModel.marryInfo.level + 1]
		let Info = GameGlobal.YingYuanModel.marryInfo
		this.qingLv.text = Config.name + "(Lv." + Info.level + ")"
		this.bar.maximum = Config.intimate
		this.bar.value = Info.intimate
		this.pro.text = Info.intimate + "/" + Config.intimate
		this.list1.dataProvider = new eui.ArrayCollection(Config.reward)
		let dataHusband = GameGlobal.YingYuanModel.marryInfo.husband
		let dataWife = GameGlobal.YingYuanModel.marryInfo.wife
		this.roleShowPanel0.SetShowMarry(dataHusband)
		this.roleShowPanel1.SetShowMarry(dataWife)
        
		let ConfigData = GameGlobal.Config.IntimateConfig
		let pReData
		for (let item in ConfigData) {
			if (ConfigData[item].level > Info.level && ConfigData[item].id) {
				pReData = ConfigData[item]
				break
			}
		}

		if (pReData) {
			this.pGroupRewar.visible = true
			this.itemBaee.data = pReData.id
			this.lbPassLvReward.text = pReData.caption
		}
		else {
			this.pGroupRewar.visible = false
		}
	}

	public UpdataHead() {
		let dataModel = GameGlobal.YingYuanModel
		if (!dataModel.marryFRIend) {
			let data = null
			//this.list.dataProvider = new eui.ArrayCollection([data]);
		} else {
			let data = {
				name: dataModel.marryFRIend.friendInfo.name,
				job: dataModel.marryFRIend.friendInfo.job,
				sex: dataModel.marryFRIend.friendInfo.sex,
			}
			this.head.data = data
			//this.list.dataProvider = new eui.ArrayCollection([data]);
		}
		let ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency
		this.DayTimes.text = "今日还可结婚：" + (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today) + "/" + ConfigModel
	}

	public MarryType(type: number) {
		let Config = GameGlobal.Config.MarryConfig[type]
		this.imgIcon0.source = Config.marryicon
		// this.imgIcon1.source = Config.normalrewardicon
		// this.imgIcon2.source = Config.houseicon
		this.priceicon.setType(Config.price.id)
		this.priceicon.setPrice(Config.price.count)
		this.list0.dataProvider = new eui.ArrayCollection(Config.id)
	}
}

class YingYuanHeadItem extends eui.ItemRenderer {
	public username: eui.Label;
	public deal: eui.Label;
	public face: eui.Component;
	public constructor() {
		super();
	}
	public childrenCreated() {

	}
	public dataChanged() {
		let data = this.data
		if (!data) {
			return
		}
		this.username.text = data.name;
		this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex)
	}
}