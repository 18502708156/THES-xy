class ActivityType27Data extends ActivityBaseData {

	/**# 充值次数 */
	cloutArr = [];
	redPoint = true;

	update(req: Sproto.activity_type27) {
		this.cloutArr = req.data;
	}

	isRedPoint() {
		return this.redPoint;
	}
}