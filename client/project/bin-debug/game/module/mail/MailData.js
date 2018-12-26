var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MailData = (function () {
    function MailData() {
        this.handle = 0;
        this.title = "";
        this.times = 0;
        this.type = 0;
        this.receive = 0;
        this.item = [];
        this.text = '';
    }
    MailData.prototype.parser = function (rsp) {
        this.disposeData(rsp.mailData);
        this.item = [];
        this.text = rsp.text;
        for (var len = rsp.rewardData.length, i = 0; len > i; i++) {
            var data = new RewardData;
            data.parser(rsp.rewardData[i]);
            this.item.push(data);
        }
    };
    MailData.prototype.disposeData = function (rsp) {
        this.handle = rsp.handle;
        this.title = rsp.title;
        this.times = rsp.times;
        this.type = rsp.type;
        this.receive = rsp.receive;
    };
    return MailData;
}());
__reflect(MailData.prototype, "MailData");
//# sourceMappingURL=MailData.js.map