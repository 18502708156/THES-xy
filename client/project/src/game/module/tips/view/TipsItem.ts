class TipsItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "TipsSkin";
		this.group.x = 0
		this.group.width = 0
	}
	private lab: eui.Label
	private bg: eui.Image
	private group: eui.Group
    private icon:eui.Image
	public endPos: number = 0
	public speed: number = 0
	
	public step: number = 0
	private time: number = 0

	public set labelText(value: string) {
		this.lab.textFlow = TextFlowMaker.generateTextFlow(value);
		this.bg.width = this.lab.width + 80;
		this.group.y = 0
		this.step = 0
		this.time = 0
		this.alpha = 1
	}

	public set iconName(src:string) {
		this.icon.source = src
	}

	public Update(delta: number): boolean {
		this.time += delta
		let endTime
		if (this.step == 0) {
			endTime = 500
			this.group.y = -this.height * Math.min(this.time / endTime, 1)
		} else if (this.step == 1) {
			endTime = 500
		} else if (this.step == 2) {
			endTime = 200
			this.alpha = 1 - Math.min(this.time / endTime, 1)
		} else {
			return false
		}
		if (this.time >= endTime) {
			++this.step
			this.time = 0
		}
		return true
	}
}