
class FbModelRedPoint extends IRedPoint {
public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly CAILIAO_FB = 1
		public static readonly CANGBAOTU_FB = 2
		public static readonly TIANTING_FB = 3
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}

	constructor() {
		super()
	}

	public GetMessageDef(): string[] {
		return [MessageDef.FB_INFO_UPDATE, MessageDef.FB_CBT_UPDATE, 
				MessageDef.FB_CBT_UPDATE_REWARD, MessageDef.FB_TIANTING_UPDATE]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[FbModelRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == FbModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.FB_REDPOINT_NOTICE)
		}
	}
	
	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mRedPointMap) {
			if (this.mRedPointMap[key]) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.mRedPointMap[FbModelRedPoint.CAILIAO_FB] = GameGlobal.UserFb.IsCailiaoNotice()
		this.mRedPointMap[FbModelRedPoint.CANGBAOTU_FB] = false //藏宝图有宝箱未领取
		this.mRedPointMap[FbModelRedPoint.TIANTING_FB] = GameGlobal.UserFb.IsTianshilianNotice()
	}

	public IsRedAct(type: number) {
		this.Get(DailyModelRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}