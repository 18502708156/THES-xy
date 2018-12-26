/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/3/29 星期四 11:57
 * @meaning: 中等对话框
 * 
 **/

class CommonMiddleDialog extends eui.Component implements  eui.UIComponent {

    private static SHOW_DIALOG_LIST: CommonMiddleDialog[] = []


	public btnClose: eui.Button //关闭按钮
	// CommonMiddleDialog 皮肤
	public btnReturn: eui.Button //返回按钮
	private cacheReturnBtn: eui.Button //缓存按钮 ,算是备用留着扩展

	
	private dialogMask: eui.Image//灰色背景

	private m_HideBtn: boolean //隐藏按钮开关
	private m_Target: BaseView //父节点
	private m_TopBtn: boolean


	public notClickMask: boolean
	public mCallback: Function


	public set hideBtn(value) {
		this.m_HideBtn = true
	}

	public set topBtn(value) {
		this.m_TopBtn = true
	}



	public SetReturnButton(btn: eui.Button): void {
		if (!btn) {
			if (this.cacheReturnBtn) {
				this.btnReturn = this.cacheReturnBtn
				this.btnReturn.visible = true
				this.cacheReturnBtn = null
			}
			return
		}
        if (this.btnReturn) {
			this.cacheReturnBtn = this.btnReturn
			this.btnReturn.visible = false
		}
		this.btnReturn = btn
	}

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	private m_TempTimer: Timer

	protected childrenCreated():void
	{
		super.childrenCreated();
		if (this.m_HideBtn) {
			this.btnClose.visible = false
		}
		if (this.m_TopBtn && this.parent) {
			this.m_TempTimer = Timer.TimeOut(()=>{
				DisplayUtils.SetParent(this.btnReturn, this.parent as any)
			}, 50)
		}
	}

	public OnAdded(target: BaseView): void {

		for (let item of CommonMiddleDialog.SHOW_DIALOG_LIST) {
			if (item == this) {
				continue
			}
			item.dialogMask.visible = false
		}

		CommonMiddleDialog.SHOW_DIALOG_LIST.push(this)


		this.m_Target = target

        if (this.btnClose) {
			this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if (this.btnReturn) {
			this.btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if(this.dialogMask) this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	public OnRemoved(): void {

		for (let i = CommonMiddleDialog.SHOW_DIALOG_LIST.length - 1; i >= 0 ; --i) {
			let item = CommonMiddleDialog.SHOW_DIALOG_LIST[i]
			if (item == null || item == this) {
				CommonMiddleDialog.SHOW_DIALOG_LIST.splice(i, 1)
			} else {
				item.dialogMask.visible = true
				break
			}
		}


		if (this.btnReturn) {
			this.btnReturn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if (this.btnClose) {
			this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if(this.dialogMask) this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)

		if (this.m_TempTimer) {
			this.m_TempTimer.Stop()
		}
	}

	private _Close(): void {
		if (this.mCallback) {
			this.mCallback()
			return
		}
		if (this.m_Target) {
			ViewManager.ins().close(this.m_Target) 
		}
	}

	private _OnClick(e: egret.TouchEvent): void {
		if (this.btnReturn && e.currentTarget == this.btnReturn) {
			this._Close()
		}
		if (this.m_HideBtn) {
			return
		}
		switch (e.currentTarget) {
			case this.dialogMask:
				if (this.notClickMask) {
					break
				}
			case this.btnClose:
				this._Close()
			break;
		}
	}
	public showReturnBtn(value:boolean):void
	{
		this.btnReturn.visible = value;
	}
	public showCloseBtn(value):void
	{
		this.btnClose.visible = value;
	}
	// /**增加一个放在返回按钮下面的 UI */
	// public addCustomImgBg(value):void
	// {
	// 	this.addChildAt(value,this.getChildIndex(this.btnReturn))
	// }
}