class GangPanTaoHuiListItem extends eui.ItemRenderer {
	info:eui.Label
	public constructor() {
		super();
	}
	
	TYPECOLOR = [
		"#019704",
		"#DB0000",
		"#F77C67" 
	]

	TYPENAME = [
		"百年桃",
		"万年桃",
		"千年桃" 
	]

	protected dataChanged(): void {
	  let data = this.data;  
	  let str =  GameServer.PanTaoHui(data.time) +"   ";
	  str += '[<font color = "#00A2FF">'+ data.playerName +'</font>]'+"   ";
	  str += '食用了<font color = "'+this.TYPECOLOR[data.peachId-1]+'">'+ this.TYPENAME[data.peachId-1] +'</font>';
	  this.info.textFlow = (new egret.HtmlTextParser()).parser(str)
	}

}          