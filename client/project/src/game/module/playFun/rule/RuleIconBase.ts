class RuleIconBase {

	public static POS1_X = 44
	public static POS1_Y = 44

	protected firstTap
	
	tar: any
	public updateMessage: any[];

	protected effX = 34
	protected effY = 31

	private m_Parent: egret.DisplayObjectContainer
	private layerCount = 0

	protected time_txt: eui.Label;
	protected ruleEff:MovieClip
	protected iconDisplay: eui.Image;

	public constructor(t) {
		this.tar = t;
		this.m_Parent = this.tar.parent
		t["__c_index__"] = this.layerCount = this.m_Parent.getChildIndex(this.tar)
		this.time_txt = t.getChildByName("time_txt")
		this.iconDisplay = this.tar["iconDisplay"];
	}
	private _endTime:number
	protected setTime(endTime) {
		this._endTime = endTime;
        if(this._endTime - GameServer.serverTimeMilli > 0)
        {
            if (!TimerManager.ins().isExists(this.updateTime, this))
			{
				TimerManager.ins().doTimer(1000, 0, this.updateTime, this)
			}
            this.updateTime();
			if(this.time_txt) this.time_txt.visible = true;
        }else
		{
			TimerManager.ins().remove(this.updateTime, this)
			if(this.time_txt) this.time_txt.visible = false;
		}
    }
    protected updateTime(): void
    {
        if(this._endTime - GameServer.serverTimeMilli <= 0){
            TimerManager.ins().remove(this.updateTime, this)
            if(this.time_txt) this.time_txt.visible = false;
            return;
		}
		let t = this._endTime - GameServer.serverTimeMilli;
		let time = DateUtils.format_16(t);
		if(this.time_txt) this.time_txt.text = time;
    }

	public DoShow(): void {
		if (this.tar.parent || !this.m_Parent) {
			return
		}
		let addIndex = null
		for (let i = 0; i < this.m_Parent.numChildren; ++i) {
			let index = this.m_Parent.getChildAt(i)["__c_index__"] || 0
			if (this.layerCount < index) {
				addIndex = i
				break
			}
		}
		if (addIndex != null) {
			this.m_Parent.addChildAt(this.tar, addIndex)	
		} else {
			this.m_Parent.addChild(this.tar)
		}
		this.tar.visible = true
		this.tar.includeInLayout = true
	}

	public DoHide(): void {
		DisplayUtils.removeFromParent(this.tar)
		this.tar.visible = false
		this.tar.includeInLayout = false
	}

	checkShowIcon() {
		return true;
	}

	checkShowRedPoint() {
		return null;
	}

	getEffName(redPointNum) {
		return null;
	}

	/** 执行 */
	tapExecute(tapTarget: any) {
	}

	update() {
		var tar = this.tar;
		var isShow = this.checkShowIcon();
		var effName;
		var mc;
		var count;
		if (isShow) {
			// 显示图标
			this.DoShow()
			if (tar['redPoint']) {
				count = this.checkShowRedPoint();
				UIHelper.ShowRedPoint(tar, count)
			}
			effName = this.getEffName(count);
			if (effName) {
				if (!this.ruleEff)
				{
					mc = new MovieClip()
					mc.loadUrl(ResDataPath.GetUIEffePath2(effName), true, -1);
					this.ruleEff = mc
				}	
				if (!this.ruleEff.parent) {
					
					this.ruleEff.x = this.effX;
					this.ruleEff.y = this.effY;
					tar.addChild(this.ruleEff);
				}
				else {
					this.ruleEff.play(-1);
				}
			}
			else {
				if(this.ruleEff) DisplayUtils.removeFromParent(this.ruleEff);
			}
		}
		else {
			this.DoHide()
		}
	}

	addEvent() {
		if (!this.updateMessage){
			return
		}
		for (let data of this.updateMessage) {
			GameGlobal.MessageCenter.addListener(data, this.update, this)
		}
	}

	removeEvent() {
		GameGlobal.MessageCenter.removeAll(this);
	}

	protected DefEffe(e) {
		return this.firstTap || e ? ( "ui_yhy002") : void 0
	}
	static SelfTarget:any
}