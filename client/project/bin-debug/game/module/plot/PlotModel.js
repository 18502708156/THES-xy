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
var PlotModel = (function (_super) {
    __extends(PlotModel, _super);
    function PlotModel() {
        var _this = _super.call(this) || this;
        _this.m_Task = {};
        _this.m_ChapterEnter = {};
        _this.m_ChapterExit = {};
        return _this;
    }
    PlotModel.prototype.Init = function () {
        var config = GameGlobal.Config.StoryConfig;
        for (var k in config) {
            var data = config[k];
            if (data.type) {
                var type = data.type.type;
                var id = data.type.id;
                switch (type) {
                    case 0:
                        this.m_ChapterEnter[id] = data.id;
                        break;
                    case 1:
                        this.m_Task[id] = data.id;
                        break;
                    case 2:
                        this.m_ChapterExit[id] = data.id;
                        break;
                }
            }
        }
    };
    PlotModel.prototype.OnPlot = function (dict, id) {
        var data = dict[id];
        if (!data) {
            return false;
        }
        delete dict[id];
        var storyid = GameGlobal.Config.StoryConfig[data].storyid;
        PlotPanel.OpenPlot(storyid, id);
        return true;
    };
    PlotModel.prototype.OnTaskFinish = function (id) {
        return this.OnPlot(this.m_Task, id);
    };
    PlotModel.prototype.OnChapterBattleEnter = function (id) {
        return this.OnPlot(this.m_ChapterEnter, id);
    };
    PlotModel.prototype.OnChapterExit = function (id) {
        return this.OnPlot(this.m_ChapterExit, id);
    };
    return PlotModel;
}(BaseSystem));
__reflect(PlotModel.prototype, "PlotModel");
//# sourceMappingURL=PlotModel.js.map