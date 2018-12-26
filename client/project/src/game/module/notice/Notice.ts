class Notice extends BaseSystem {

    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.sc_record_datas, this.doNoticeInit);
        this.regNetMsg(S2cProtocol.sc_record_add, this.doNoticeRecords);
    }

    doNoticeInit (bytes:Sproto.sc_record_datas_request) {
        if (bytes.type == 1) {
			let list = []
			for (let data of bytes.record) {
				let item = new ChatSystemData(ChatType.Public, data.str, data.time)
				list.push(item)
			}
			GameGlobal.Chat.DoInitSysChatMsg(list);
        }
    }

    doNoticeRecords(rsp: Sproto.sc_record_add_request) {
		if (rsp.type == 1 && rsp.record != null) {
			let record = rsp.record
			let item = new ChatSystemData(ChatType.Public, record.str, record.time)
			GameGlobal.Chat.DoSysChatMsg(item);

            // 1类型才显示到滚动栏
            if (record.type == 1) {
                this.Notice(record.str)
            } else if (record.type == 4) {
                this.StaticNotice(record.str)
            }
		}
    }

    public Notice(str: string) {
        if (ViewManager.ins().isShow(NoticeView)) {
            (<NoticeView>ViewManager.ins().getView(NoticeView)).ShowNotice(str)
        } else {
            (<NoticeView>ViewManager.ins().open(NoticeView)).ShowNotice(str)
        }
    }

    public StaticNotice(str: string) {
        if (ViewManager.ins().isShow(NoticeView)) {
            (<NoticeView>ViewManager.ins().getView(NoticeView)).ShowStaticNotice(str)
        } else {
            (<NoticeView>ViewManager.ins().open(NoticeView)).ShowStaticNotice(str)
        }
    }
}