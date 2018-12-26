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
/**
 * 组队_选择列表List
 */
var TeamCheckItemList = (function (_super) {
    __extends(TeamCheckItemList, _super);
    function TeamCheckItemList() {
        //SkinName
        //TeamCheckItemListSkin
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.index = 0;
        return _this;
    }
    TeamCheckItemList.prototype.childrenCreated = function () {
        this.listCtrl = new ListLRBtnCtrl(this.checkpointList, this.beforeBtn, this.nextBtn, 214);
        this.checkpointList.dataProvider = new eui.ArrayCollection([]);
        this.checkpointList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onclick, this);
    };
    //this.m_Model.index
    TeamCheckItemList.prototype.showCheckItemList = function (index) {
        //this.m_Model=m_Model;
        this.index = index;
        var configList = this.m_Model.GetConfig();
        var list = [];
        var tabIndex = 0;
        for (var key in configList) {
            var dic = {};
            dic = configList[key];
            dic["model"] = this.m_Model;
            dic["index"] = tabIndex;
            list.push(dic);
            tabIndex++;
        }
        this.checkpointList.itemRenderer = TeamItemCom;
        this.checkpointList.dataProvider = new eui.ArrayCollection(list);
        if (this.m_Model.index == -1)
            this.checkpointList.selectedIndex = index;
        else
            this.checkpointList.selectedIndex = this.m_Model.index;
        this.setListPos(index);
    };
    TeamCheckItemList.prototype.onclick = function (e) {
        this.m_Model.index = e.itemIndex;
    };
    //移動位置
    TeamCheckItemList.prototype.setListPos = function (id) {
        this.checkpointList.validateNow();
        var num = id; //id-this.chapterid*9;
        // if(num<=0) num=id-(this.chapterid-1)*9;
        if (num < 9 && num >= 6)
            this.checkpointList.scrollH = 1258;
        else if (num < 6 && num >= 3)
            this.checkpointList.scrollH = 629;
        else if (num < 3)
            this.checkpointList.scrollH = 0;
    };
    return TeamCheckItemList;
}(eui.Component));
__reflect(TeamCheckItemList.prototype, "TeamCheckItemList");
//# sourceMappingURL=TeamCheckItemList.js.map