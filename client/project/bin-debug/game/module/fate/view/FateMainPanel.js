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
 * 系统预告
 */
var FateMainPanel = (function (_super) {
    __extends(FateMainPanel, _super);
    function FateMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FateMainSkin";
        return _this;
    }
    FateMainPanel.prototype.childrenCreated = function () {
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "功能预告";
        this._AddClick(this.exchangeBtn, this.onClick);
        this.funcNoticeConfigTab = GameGlobal.Config.FuncNoticeConfig;
    };
    FateMainPanel.prototype.OnOpen = function (id) {
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.describeLab.text = "";
        if (id != 0) {
            if (id != 0) {
                this.itemList.dataProvider = new eui.ArrayCollection(this.funcNoticeConfigTab[id].reward);
            }
            var arr = this.funcNoticeConfigTab[id].openLv;
            var str = this.funcNoticeConfigTab[id].des3;
            if (arr[0] == 1) {
                this.describeLab.text = str.replace("%s", arr[1]);
            }
            else if (arr[0] == 2) {
                this.describeLab.text = str.replace("%s", arr[1]);
            }
            else if (arr[0] == 3) {
                // let number=0;
                // if(GameGlobal.UserTask.mainTaskData!=undefined)
                // {
                //     if(GameGlobal.UserTask.mainTaskData[0]!=undefined)
                //     {
                //         if(GameGlobal.UserTask.mainTaskData[0].id!=undefined)
                //             number=arr[1]-GameGlobal.UserTask.mainTaskData[0].id;
                //     }
                // }
                this.describeLab.text = str.replace("%s", arr[1]);
            }
        }
        this.fateModelItem.typeView = 1;
        var modelType = this.funcNoticeConfigTab[id].type;
        var pid = this.funcNoticeConfigTab[id].pid;
        if (pid != undefined) {
            if (pid[1] != undefined)
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[id].pid[0], this.funcNoticeConfigTab[id].pid[1]);
            else if (pid[0] != undefined)
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[id].pid[0]);
            else
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[id].pid);
        }
    };
    FateMainPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    FateMainPanel.prototype.update = function () {
    };
    FateMainPanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.exchangeBtn:
                ViewManager.ins().close(FateMainPanel);
                break;
        }
    };
    //skinName
    //FateMainSkin.exml
    FateMainPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FateMainPanel;
}(BaseEuiView));
__reflect(FateMainPanel.prototype, "FateMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=FateMainPanel.js.map