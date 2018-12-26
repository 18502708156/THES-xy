class MailData {

	handle: number = 0
	title: string = ""
	times: number = 0
	type = 0
	receive = 0

	item = []
	text = ''

	parser(rsp: Sproto.sc_mail_detailed_info_request) {
		this.disposeData(rsp.mailData)
		this.item = []
		this.text = rsp.text
		for (var len = rsp.rewardData.length, i = 0; len > i; i++) {
			var data = new RewardData;
			data.parser(rsp.rewardData[i])
			this.item.push(data)
		}
	}

	disposeData(rsp: Sproto.mail_data) {
		this.handle = rsp.handle
		this.title = rsp.title
		this.times = rsp.times
		this.type = rsp.type
		this.receive = rsp.receive
	}
}