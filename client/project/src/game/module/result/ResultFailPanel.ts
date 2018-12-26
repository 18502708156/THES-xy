class ResultFailPanel extends ResultBasePanel {

    /////////////////////////////////////////////////////////////////////////////
    // ResultFailSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleImg2: eui.Image;
    protected titleImg: eui.Image;
    protected gpGuanqia: eui.Group;
    protected helpBtn: eui.Button;
    protected gp: eui.Group;
    protected img0: eui.Image;
    protected img1: eui.Image;
    protected img2: eui.Image;
    protected img3: eui.Image;
    protected titleLabel: eui.BitmapLabel;
    protected closeBtn: eui.Button;
    protected gifBtn: eui.Button
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super();
        this.skinName = "ResultFailSkin";
    }

    OnOpen(...param: any[]) {
        this.SetBtnLabel("退出")
        this.SetTitleLabel("我要变强")
        this.SetCloseFunc(param[1])
        for (let i = 0; i < 4; i++) {
            this._AddClick(this["img" + i], this.click)
        }
        this._AddClick(this.helpBtn, this.click)
        this._AddClick(this.gifBtn,this.click)
        let state = param[2] || 0
        if (state == 2) {
            this.titleImg.source = "ui_js_bm_tiaozhanjieshu"
            this.gpGuanqia.visible = false
        } else {
            this.titleImg.source = "ui_bm_shibai"
        }
        this.gpGuanqia.visible = BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS
        super.OnOpen()
        this.showGif()
    }

    click(e: egret.TouchEvent) {
        switch (e.target) {
            case this.img0:
                ViewManager.ins().open(GrowUpWin)
                this.CloseSelf()
                break;
            case this.img1:
                ViewManager.ins().open(PetMainPanel)
                this.CloseSelf()
                break;
            case this.img2:
                ViewManager.ins().open(ForgeWin)
                this.CloseSelf()
                break;
            case this.img3:
                ViewManager.ins().open(RoleSkilSetLayer)
                this.CloseSelf()
                break;
            case this.helpBtn:
                this.help()
                break;
            case this.gifBtn:
                if(this.index == 0){
                    return 
                }
                let config = GameGlobal.Config.RecmdGiftConfig[this.index];
                ViewManager.ins().Guide(config.taget)
                this.CloseSelf()
                break;
        }
    }

    public index: number = 0
    showGif() {
        if (this.gpGuanqia.visible) {
            this.gifBtn.visible = false
            return
        }

        if (this.selectShouCong()) {
            this.index = 1
            this.showBnt()
            return
        }

        if (!this.selectXuanNv()) {
            this.index = 2
            this.showBnt()
            return
        }

        if (this.selectGif()) {
            this.index = 3
            this.showBnt()
            return
        }
        this.showBnt()
    }

    showBnt() {
        if (this.index == 0) {
            this.gifBtn.visible = false
            return
        }
        let config = GameGlobal.Config.RecmdGiftConfig[this.index]
        this.gifBtn.icon = config.icon
    }

    public selectShouCong() {
        let result = false;
        let config = GameGlobal.Config.FirstRechargeConfig;
        for (let key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                result = true;
                break;
            }
        }
        return result
    }

    public selectXuanNv() {
        return Deblocking.Check(DeblockingType.TYPE_19, true)
    }

    public selectGif() {
        let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9) as ActivityType19Data;
        if (data) {
            let config = data.GetConfig();
            if (!config[data.reachday]) {
                return false
            }
            //this.tar.icon = config[data.reachday].icon;
            if (data.runday <= data.reachday) {
                return false;
            }
            if (data.isOpenActivity() && Deblocking.Check(DeblockingType.TYPE_104, true)) {
                return true;
            }
        }
        return false
    }

    public help() {
        if (Deblocking.Check(DeblockingType.TYPE_49) && Deblocking.Check(DeblockingType.TYPE_115)) {
            GameGlobal.Chat.chatShareInfo(20, null);//目前只有世界
        }
    }

}