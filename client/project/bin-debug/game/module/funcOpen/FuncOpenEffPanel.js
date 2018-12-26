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
var FuncOpenEffPanel = (function (_super) {
    __extends(FuncOpenEffPanel, _super);
    function FuncOpenEffPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuncOpenEffSkin";
        _this._AddClick(_this.goBtn, _this._OnClick);
        var eff = new MovieObject;
        eff.LoadByUrl(ResDataPath.GetUIEffePath("eff_ui_hyui_001"));
        _this.effGroup.addChild(eff);
        return _this;
    }
    FuncOpenEffPanel.setOpenId = function (value) {
        this._NEED_OPEN_ID = value;
        this.checkNeedOpen();
    };
    FuncOpenEffPanel.checkNeedOpen = function () {
        // if(this._NEED_OPEN_ID)
        // {
        //     if (!GameMap.IsNoramlLevel()) {
        //         return
        //     }
        //     ViewManager.ins().open(FuncOpenEffPanel, this._NEED_OPEN_ID)
        //     this._NEED_OPEN_ID = null
        // }
    };
    FuncOpenEffPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var RES_LIST = {};
        this.m_Type = param[0];
        var data = RES_LIST[param[0]];
        this.tip1Img.source = data[0];
        this.tip2Img.source = data[1];
        this.tip3Img.source = data[2];
        if (typeof (data[3]) == 'number') {
            // if(this.m_Type == 1)
            // {
            //     this.roleShowPanel.SetShinv(data[3])
            // }else if(this.m_Type == 5)
            // {
            //     this.roleShowPanel.SetPet(data[3])
            // }
        }
        else {
            var mv = new MovieObject;
            mv.LoadByUrl(data[3]);
            this.effGroup2.addChild(mv);
        }
        if (param[0] == 3) {
            this.effGroup2.y = 480;
        }
        else if (param[0] == 4) {
            this.effGroup2.horizontalCenter = 100;
            this.effGroup2.y = 540;
        }
        this.AddTimer(5000, 1, this._OnClick);
    };
    FuncOpenEffPanel.prototype.OnClose = function () {
        TimerManager.ins().removeAll(this);
        if (this.m_Type == 4) {
            ViewManager.ins().open(RoleWin, 2);
        }
        else if (this.m_Type == 2) {
            ViewManager.ins().open(RoleWin, 1);
        }
        egret.setTimeout(function () {
            var view = ViewManager.ins().getView(PlayFunView);
            if (view && view.isShow()) {
                // view.upDateTaskGuild()
            }
        }, this, 500);
    };
    FuncOpenEffPanel.prototype._OnClick = function () {
        this.CloseSelf();
    };
    FuncOpenEffPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FuncOpenEffPanel;
}(BaseEuiView));
__reflect(FuncOpenEffPanel.prototype, "FuncOpenEffPanel");
//# sourceMappingURL=FuncOpenEffPanel.js.map