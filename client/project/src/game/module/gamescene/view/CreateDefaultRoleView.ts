class CreateDefaultRoleView extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main_2

    /////////////////////////////////////////////////////////////////////////////
    // CreateRolSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected gotBtn: eui.Button;
    protected roleGroup0: eui.Group;
    protected roleImg0: eui.Image;
    protected roleGroup1: eui.Group;
    protected roleImg1: eui.Image;
    protected nameLabel: eui.EditableText;
    protected randomName: eui.Button;
    protected selGroup: eui.Group;
    protected selGroupImg: eui.Group;
    protected time: eui.Label;
    protected sex1: eui.Button;
    protected sex2: eui.Button;
    protected sel1: eui.Image;
    protected sel2: eui.Image;
    protected leftBtn: eui.Button;
    protected rightBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public timeNum: number = 60

	private m_RoleImg = [
	    ["ui_cjjs_bm_juese", "ui_cjjs_bm_nvjuese"],
	    ["ui_cjjs_xianzhu_nan", "ui_cjjs_xianzhu_nv"],
	    ["ui_cjjs_mozhu_nan", "ui_cjjs_mozhu_nv"],
	]

	private m_CurImgIndex: number = 0

	private m_Index: number = -1
	private m_Job: number = 1
	private m_Sex: number = 0

	private m_IsRandom = true

	private mSelImg: eui.Image[] = []

	public constructor() {
		super()
		this.skinName = "CreateRolSkin"
		this.nameLabel.type = egret.TextFieldType.INPUT

		this.nameLabel.addEventListener(egret.TouchEvent.FOCUS_IN, this._DoFocus, this)

		this.sel1.visible = true
		this.sel2.visible = false

		this.m_Job = 1
		this.m_Sex = 0
	}

	private _DoFocus() {
		this.m_IsRandom = false
	}

	public OnOpen() {
		this.AddClick(this.leftBtn, this.OnClick)
		this.AddClick(this.rightBtn, this.OnClick)
		this.AddClick(this.sex1, this.OnClick)
		this.AddClick(this.sex2, this.OnClick)
		this.AddClick(this.randomName, this.OnClick)
		this.AddClick(this.gotBtn, this.OnClick)
		for (let i = 0; i < this.selGroup.numChildren; ++i) {
			this.AddClick(this.selGroup.getChildAt(i), this.OnSelect)
		}
		this.mSelImg = this.selGroupImg.$children as any
		this.Select(1)

		this.AddTimer(1000, 0, this.timeShow)

		let list = ["_ui_xzjs_h1", "_ui_xzjs_h2", "_ui_xzjs_h3", , "_ui_xzjs_h4"]
		for (let t of list) {
			RES.getResAsync(t, this._Load, this)
		}
	}

	private m_Count = 0
	private m_TexList: egret.Texture[] = []

	private _Load(obj: egret.Texture) {
		if (!this.m_TexList) {
			return
		}
		if (obj) {
			this.m_TexList.push(obj)
		}
		if (++this.m_Count >= 4) {
			WeatherFactory.getFlower().playWeather(this.m_TexList)
		}
	}

	public timeShow() {
		if (this.timeNum == 0) {
			TimerManager.ins().remove(this.timeShow, this)
			let name = this.nameLabel.text
			if (name == null || name == "") {
				alert("名称不能为空")
				return
			}
			RoleMgr.ins().sendCreateRole(name, this.GetSex(), this.GetJob())
			this.time.text = ""
			return
		}
		this.time.text = this.timeNum + "s后自动进入服务器"
		this.timeNum--
	}

	public OnClose() {

		WeatherFactory.getFlower().stopWeather()
		this.removeObserve()
		this.removeEvents()
		TimerManager.ins().removeAll(this)

		this.m_TexList = null
	}

	private OnSelect(e: egret.TouchEvent) {
		this.Select(this.selGroup.getChildIndex(e.target))
	}

	private Select(index: number) {
		this.m_Job = index + 1
		this.UpdateSel()
	}

	private UpdateSel() {
		let oldIndex = this.m_Index
		this.m_Index = (this.m_Job - 1) * 2 + this.m_Sex

		let jobIndex = this.m_Job - 1
		for (let i = 0; i < this.mSelImg.length; i++) {
			this.mSelImg[i].visible = i == jobIndex
		}

		this.sel1.visible = this.m_Sex == 0
		this.sel2.visible = this.m_Sex == 1

		let curImg = this["roleImg" + this.m_CurImgIndex]
		let curGroup = this["roleGroup" + this.m_CurImgIndex]

		if (oldIndex != this.m_Index) {
			let isRight = this.m_Index > oldIndex ? -1 : 1
			let pos = 600

			egret.Tween.removeTweens(curGroup)
			egret.Tween.get(curGroup).to({
				x: isRight * pos,
				alpha: 0
			}, 350, egret.Ease.circOut)

			this.m_CurImgIndex = (this.m_CurImgIndex + 1) % 2

			let nextImg = this["roleImg" + this.m_CurImgIndex]
			let nextGroup = this["roleGroup" + this.m_CurImgIndex]

			nextImg.source = this.m_RoleImg[this.m_Job - 1][this.m_Sex]
			nextGroup.x = -1 * isRight * pos
			nextGroup.alpha = 0

			egret.Tween.removeTweens(nextGroup)
			egret.Tween.get(nextGroup).wait(150).to({
				x: 0,
				alpha: 1,
			}, 350, egret.Ease.circOut)

			if (this.m_IsRandom) {
				this.GetRandomName()
			}
		}
	}

	private GetSex(): number {
		return this.m_Sex
	}

	public GetJob(): number {
		return this.m_Job
	}

	private doRandom(rsp: Sproto.RandName_response) {
		if (rsp.result == 0) {
			this.nameLabel.text = rsp.actorname
		}
	}

	private GetRandomName() {
		let RandName = new Sproto.RandName_request();
		RandName.sex = this.GetSex()
		GameSocket.ins().Rpc(C2sProtocol.RandName, RandName, this.doRandom, this);
	}

	private OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.sex1:
				this.m_Sex = 0
				this.UpdateSel()
				break
			case this.sex2:
				this.m_Sex = 1
				this.UpdateSel()
				break
			case this.randomName:
				this.m_IsRandom = false
				this.GetRandomName()
				break
			case this.gotBtn:
				let name = this.nameLabel.text
				if (name == null || name == "") {
					alert("名称不能为空")
					return
				}
				RoleMgr.ins().sendCreateRole(name, this.GetSex(), this.GetJob())
				break
			case this.leftBtn:
				this.UpdateIndex(this.m_Index - 1)
				break
			case this.rightBtn:
				this.UpdateIndex(this.m_Index + 1)
				break
		}
	}

	private UpdateIndex(value: number) {
		if (value < 0) {
			value = 5
		}
		if (value > 5) {
			value = 0
		}
		this.m_Sex = value % 2
		this.m_Job = Math.floor(value / 2) + 1
		this.UpdateSel()
	}
}