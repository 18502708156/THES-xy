class BaseEuiView extends BaseView {

    // 定义view对象的层级
    public static LAYER_LEVEL = null
    // 定义view对象的名称
    public static VIEW_LAYER_LEVEL = null
    // 移除清除资源
    public mRemoveNotDestroyView: boolean
    public mIsAutoSkin = false

    protected _resources: any = null;
    _isInit: boolean = false;
    
    public mCommonWindowBg: CommonWindowBg

    private mDialog: CommonDialog

    public mRefBaseView: {[key: number]: BaseView} = {}

    public constructor() {
        super();

        this._resources = null;
        this._isInit = false;
        this.SetFullType()
    }

    protected SetFullType() {
        this.percentHeight = 100;
        this.percentWidth = 100;
    }

    public isInit(): boolean {
        return this._isInit;
    }
    
    public isShow() {
        return ViewManager.ins().isShow(this)
    }

	public DoClose() {
        if (this.mCommonWindowBg) {
            this.mCommonWindowBg.OnRemoved()
        }
        if (this.mDialog) {
            this.mDialog.OnRemoved()
        }
        super.DoClose()
	}

    public DoInit() {
        this._isInit = true
        this.initUI()
    }

    /**
     *对面板进行显示初始化，用于子类继承
     */
    public initUI() {
    }
    
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    public initData() {
    }

    public destoryView() {
        if (this.mRemoveNotDestroyView) {
            return
        }
        super.destoryView()
        ViewManager.ins().destroy(this.hashCode);
        if (this.mCommonWindowBg) {
            this.mCommonWindowBg.OnDestroy()
        }
        if (this.mRefBaseView) {
            for (let key in this.mRefBaseView) {
                let view = this.mRefBaseView[key]
                if (view) {
                    view.destoryView()
                }
            }
            this.mRefBaseView = null
        }
    }

    /**
     * 加载面板所需资源
     */
    public loadResource(loadComplete: Function, initComplete: Function) {
        if (this._resources && this._resources.length > 0) {
            ResourceUtils.ins().loadResource(this._resources, [], () => {
                loadComplete()
                initComplete()
            }, null, this);
            // this.addEventListener(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        } else {
            loadComplete();
            initComplete();
        }
    }
    /**
     * 设置是否隐藏
     * @param value
     */
    public setVisible(value) {
        this.visible = value;
    }

    public static openCheck(...param: any[]) {
        return true;
    }

    public GetLayerLevel() {
        return null
    }

    public SetTableIndex(index: number) {
        let window = this.mCommonWindowBg
        if (window) {
            window.SetTabIndex(index)
        }
	}
    public getSubViewByIndex(index)
    {
        let window = this.mCommonWindowBg
        if (window) {
            return window.GetViewStackElementByIndex(index)
        }
        return null;
    }
    
	public CloseSelf() {
		ViewManager.ins().close(this)
	}

    public RefBaseView(view: BaseView) {
        if (!egret.is(view, "BaseView")) {
            return
        }
        if (!this.mRefBaseView) {
            this.mRefBaseView = {}
        }
        view.mIsAutoSkin = null
        this.mRefBaseView[view.hashCode] = view
    }

    public UnRefBaseView(view: BaseView) {
        if (!egret.is(view, "BaseView")) {
            return
        }
        if (!this.mRefBaseView) {
            return
        }
        view.mIsAutoSkin = true
        delete this.mRefBaseView[view.hashCode]
        view.CheckUnrefSkin()
    }

    // protected SetFullScreenType() {
    //     this.addEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this);
    //     this.OnFullScreenResize()
    // }

    protected OnFullScreenResize() {
        // egret.callLater(this.DoFullScreenResize, this)
        this.width = GameGlobal.StageUtils.GetWidth()
        this.height = GameGlobal.StageUtils.GetHeight()
        if (this.parent) {
            let w = StageUtils.WIDTH
            let h = StageUtils.HEIGHT
            this.x = (w - this.width) >> 1
            this.y = (h - this.height) >> 1
        } else {
            this.x = 0
            this.y = 0
        }
    }

    // private DoFullScreenResize() {
    //     this.width = GameGlobal.StageUtils.GetWidth()
    //     this.height = GameGlobal.StageUtils.GetHeight()
    //     if (this.parent) {
    //         let pos = egret.$TempPoint
    //         this.parent.globalToLocal(0, 0, pos)
    //         this.x = pos.x
    //         this.y = pos.y
    //     } else {
    //         this.x = 0
    //         this.y = 0
    //     }
    // }
}