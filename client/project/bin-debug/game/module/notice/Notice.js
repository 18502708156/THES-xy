var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Notice = (function (_super) {
    __extends(Notice, _super);
    function Notice() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_record_datas, _this.doNoticeInit);
        _this.regNetMsg(S2cProtocol.sc_record_add, _this.doNoticeRecords);
        return _this;
    }
    Notice.prototype.doNoticeInit = function (bytes) {
        if (bytes.type == 1) {
            var list = [];
            for (var _i = 0, _a = bytes.record; _i < _a.length; _i++) {
                var data = _a[_i];
                var item = new ChatSystemData(ChatType.Public, data.str, data.time);
                list.push(item);
            }
            GameGlobal.Chat.DoInitSysChatMsg(list);
        }
    };
    Notice.prototype.doNoticeRecords = function (rsp) {
        if (rsp.type == 1 && rsp.record != null) {
            var record = rsp.record;
            var item = new ChatSystemData(ChatType.Public, record.str, record.time);
            GameGlobal.Chat.DoSysChatMsg(item);
            // 1类型才显示到滚动栏
            if (record.type == 1) {
                this.Notice(record.str);
            }
            else if (record.type == 4) {
                this.StaticNotice(record.str);
            }
        }
    };
    Notice.prototype.Notice = function (str) {
        if (ViewManager.ins().isShow(NoticeView)) {
            ViewManager.ins().getView(NoticeView).ShowNotice(str);
        }
        else {
            ViewManager.ins().open(NoticeView).ShowNotice(str);
        }
    };
    Notice.prototype.StaticNotice = function (str) {
        if (ViewManager.ins().isShow(NoticeView)) {
            ViewManager.ins().getView(NoticeView).ShowStaticNotice(str);
        }
        else {
            ViewManager.ins().open(NoticeView).ShowStaticNotice(str);
        }
    };
    return Notice;
}(BaseSystem));
__reflect(Notice.prototype, "Notice");
//# sourceMappingURL=Notice.js.map