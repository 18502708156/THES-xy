class ItemRenderer extends eui.ItemRenderer {

	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();
		GameGlobal.MessageCenter.removeAll(this)
		TimerManager.ins().removeAll(this)
	}	
}