class BattleUnitBuff {
	public mTarget: BattleUnit
	public mBuffId: number
	public mConfig: any[]
	public mTurn: number = 0

	public Turn(): boolean {
		++this.mTurn
		if (this.mTurn >= this.mConfig[GameGlobal.Config.EffectsConfig_keys.duration]) {
			return false
		}
		return true
	}

	// buff添加事件
	public OnAdd(): void {

	}
	
	// buff移除事件
	public OnRemove(): BUnitAction {
		let action = new BRemoveBuffAction	
		action.src = this.mTarget.mInfo.handle
		action.id = this.mBuffId
		action.args = [0]
		return action
	}


/*
补充类型
1 改变血量 {a=系数,t=属性类型,b=附加值}
2 附加属性 {a=系数,t=属性类型,b=附加值}
3 附加状态 {i=状态值, a=系数, b=附加, p=概率0-1} 血量相关的a,b不填默认1,0 概率相关的p不填默认1
 状态值:i
   1:昏迷
   2:封印
   3:冰冻
   4:沉睡
   5:反击 p=概率
   6:反伤 a=系数 b=附加
   7:复活 p=概率 a=复活后血量系数 b=复活后血量附加
   8:吸血 a=系数 b=附加
   9:吸收 a=系数 b=附加
   10:连击 p=概率 a=系数 b=附加
   11:回血 a=系数 b=附加
   12:中毒 a=系数 b=附加
   13:净化 p=概率
   */

	public Execute() {
		// let args = this.mConfig[GameGlobal.Config.EffectsConfig_keys.args]

		
	}

	// private Type2(args: any) {
	// 	this.mTarget.ChangeAtt(args.t, args.t )
	// }
}