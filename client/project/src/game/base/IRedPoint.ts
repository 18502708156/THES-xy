abstract class IRedPoint {

	private m_Value: number = 0
	private m_Check: number = 0

	/** 当前所以检查索引和对应的方法 */
	private m_CheckList: {[key: number]: Function} = {}

	public constructor() {
		RedPointMgr.Add(this)
		this.m_CheckList = this.GetCheckFuncList()
		if (!this.m_CheckList) {
			console.error("not check list => ", this)
		}
	}

	public GetType(): string {
		return egret.getQualifiedClassName(this)
	}

	/**
	 * 当前是否有红点状态
	 */
	public IsRedPoint(): boolean {
		return this.m_Value > 0
	}

	/**
	 * 当前是否有红点状态，排除indexs
	 */
	public IsRedPointWithout(...indexs: number[]) {
		let val = this.m_Value	
		if (val > 0) {
			for (let index of indexs) {
				val = BitUtil.Set(val, index, false)
			}
			return val > 0
		}
		return false
	}

	/**
	 * 获取对应所以得状态 
	 */
	public Get(index: number): boolean {
		if (BitUtil.Has(this.m_Check, index)) {
			return BitUtil.Has(this.m_Value, index)
		}
		let func = this.m_CheckList[index]
		if (!func) {
			return false
		}
		let newVal = func.call(this) ? true : false
		let oldValue = BitUtil.Has(this.m_Value, index)
		this.m_Value = BitUtil.Set(this.m_Value, index, newVal)
		this.m_Check = BitUtil.Set(this.m_Check, index, true)
		if (newVal != oldValue) {
			this.OnChange(index)
		}
		return newVal
	}

	/**
	 * 清理某个状态，能够重新计算
	 */
	protected ClearFlag(index: number): void {
		this.m_Check = BitUtil.Set(this.m_Check, index, false)
	}

	/**
	 * 初始化
	 */
	public Init(): boolean {
		return true
	}

	/**
	 * 检查所有的状态
	 */
	public CheckAll(): void {
		for (let k in this.m_CheckList) {
			this.Get(Number(k))
		}
	}

	/** 子类重写的方法 */
	
	/**
	 * 检查索引对应的方法
	 */
	protected abstract GetCheckFuncList(): {[key: number]: Function}

	/**
	 * 事件定义，根据事件类型更新状态
	 */
	public abstract GetMessageDef(): string[]

	/**
	 * 如果某个索引状态发生变化，会回调这个方法，子类重写这个用来广播事件
	 */
	protected OnChange(index: number): void {
	}
	
	/**
	 *  收到消息，清空缓存数据
	 * 	@return 是否有延时调用DoUpdate
	 */
	public OnMessage(type: string): boolean {
		this.m_Check = 0
		return true
	}
}