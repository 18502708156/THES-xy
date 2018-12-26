class LingLongTaModel {
	public constructor() {
	}
	//副本ID
	fbID:number;
	//当前挑战的层数
	public layer: number; // tag 1
	//普通和困难两种状态
	public hard: number = 1; // tag 0

	public parser(hard,layer) {
		this.hard = hard;
		this.layer = layer;
	}
}