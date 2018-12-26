class StarList extends eui.Component implements eui.UIComponent {

	private m_StatListLength
	private m_StarNum 
	private group: eui.Group 

	private m_StarItem: eui.Component[] = []
	
	public constructor(listLength = 10, starNum = 0) {
		super();
		this.m_StatListLength = listLength
		this.m_StarNum = starNum
		// this._statListLength = listLength;
		// this._starNum = starNum;
		// this.list = [];
		// for (var i = 0; i < this._statListLength; i++) {
		// 	var starItem = new StarItem;
		// 	starItem.x = i * 30 + 2;
		// 	this.addChild(starItem);
		// 	if (i <= this._starNum - 1)
		// 		starItem.isShow(true);
		// 	this.list.push(starItem);
		// }
	}

	set count(value) {
		let count = parseInt(value) || 0
		this._UpdateStarCount()
	}

	private _UpdateStarCount() {
		if (this.$stage) {
			// for (let i = 0; i < this.m_StarItem.length; ++i) {
			// 	this.m_StarItem[i].visible = i < this.m_StatListLength
			// }
			this.m_StatListLength = Math.min(this.m_StatListLength, this.m_StarItem.length)
			for (let i = 0; i < this.m_StatListLength; ++i) {
				let item = this.m_StarItem[i]
				item.visible = true
				DisplayUtils.ChangeParent(item, this.group)
			}
			for (let i = this.m_StatListLength; i < this.m_StarItem.length; ++i) {
				let item = this.m_StarItem[i]
				item.visible = false
				DisplayUtils.ChangeParent(item, this)
			}

		}
	}

	private _UpdateStarState() {
		if (this.$stage) {
			for (let i = 0, len = Math.min(this.m_StarItem.length, this.m_StatListLength); i < len; ++i) {
				this.m_StarItem[i].currentState = i < this.m_StarNum ? "light" : "gray"
			}	
		}
	}

	protected partAdded(partName:string,instance:any):void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		let group: eui.Group = this["group"]
        for (let i = 0; i < group.numChildren; ++i) {
			this.m_StarItem[i] = <eui.Component>group.getChildAt(i)
		}
		this._UpdateStarCount()
		this._UpdateStarState()
	}


	get starNum() {
		return this.m_StarNum;
	}

	set starNum(num) {
		if (this.m_StarNum == num)
			return;
		this.m_StarNum = num;
		this._UpdateStarState()
	}

	get listLength() {
		return this.m_StatListLength;
	}

	set listLength(value) {
		if (this.m_StatListLength == value) {
			return
		}
		this.m_StatListLength = value
		this._UpdateStarCount()
	}
}


// class StarItem extends eui.Component {
// 	public constructor() {
// 		super();
// 		this.skinName = "StarItemSkin";
// 	}
// 	isShow(num: boolean): void {
// 		this.currentState = num ? "light" : "gray"
// 	}
// }