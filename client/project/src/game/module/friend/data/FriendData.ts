class FriendData {
	/**关注列表数据 */
	public friendsDate = []

	/**黑名单列表数据 */
	public blacklistData = []

	/**推荐列表数据 */
	public referrerDate = []

	/**粉丝列表数据 */
	public fansData = []

	/**友币次数 */
	public curCoinNum: number = 0;

	/**接收友币次数 */
	public takeCoinNum: number = 0;

	/**FriendItem的状态 */
	public curState: string;
	constructor() {

	}
}