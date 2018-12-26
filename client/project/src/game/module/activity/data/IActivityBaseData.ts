interface IActivityBaseData  {
	startTime: number
	endTime: number
	openState: number
	id: number
	type: number
	/**奖励领取状态记录，支持数组和数字两种方式 */
	record:any

	init()
	UpdateBase(rsp: Sproto.activity_base_type )
	update(e)
	/**活动里是否有奖励可以领取 */
	hasReward(): boolean 
	GetRecordByIndex(index: number): boolean
	canGetRecordByIndex(index: number):boolean
	isOpenActivity(): boolean
	isOpenTime(): boolean

	getRemindTimeString():string
	/**剩余时间 */
	GetSurplusTimeStr():string
	GetConfig(): any

	// 所以的都已经领取
	AllGotten(): boolean
}