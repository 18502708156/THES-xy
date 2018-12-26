var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ResData = (function () {
    function ResData() {
    }
    ResData.GetSliceImgData = function (name) {
        if (this.m_SliceData == null) {
            this.EMPTY_DATA = {
                offY: 0,
                offX: 0,
                sourceH: 512,
                sourceW: 512,
                w: 512,
                h: 512,
                y: 0,
                x: 0,
            };
            try {
                // let data = JSON.parse(RES.getRes("slice_img_json"))
                var data = RES.getRes("slice_img_json");
                this.m_SliceData = data["slice_img"] || {};
                RES.destroyRes("slice_img_json");
            }
            catch (e) { }
            if (!this.m_SliceData) {
                this.m_SliceData = {};
            }
        }
        return this.m_SliceData[name] || this.EMPTY_DATA;
    };
    ResData.m_SliceData = null;
    return ResData;
}());
__reflect(ResData.prototype, "ResData");
//# sourceMappingURL=ResData.js.map