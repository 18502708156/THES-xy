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
var GameSceneView = (function (_super) {
    __extends(GameSceneView, _super);
    function GameSceneView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GameFightSceneSkin";
        _this.touchEnabled = false;
        _this.touchChildren = true;
        KeyboardUtils.ins().addKeyDown(_this.TestKeyDown, _this);
        return _this;
    }
    Object.defineProperty(GameSceneView.prototype, "input", {
        get: function () {
            if (!this._input) {
                this._input = new eui.TextInput;
                this._input.width = 250;
                this._input.visible = false;
                this._input.prompt = "点我输入命令";
                this._input.y = 300;
                LayerManager.UI_Tips.addChild(this._input);
            }
            return this._input;
        },
        enumerable: true,
        configurable: true
    });
    // 引导对象
    GameSceneView.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.miniChat.input.sendBtn,
            _a;
        var _a;
    };
    GameSceneView.Show = function () {
    };
    GameSceneView.prototype.TestKeyDown = function (keyCode) {
        if (ActorModel.IsGM()) {
            if (keyCode == Keyboard.BACK_QUOTE) {
                if (this._input && !this._input.isFocus && this._input.visible) {
                    this._input.visible = false;
                }
                else {
                    this.input.visible = true;
                }
            }
            if (keyCode == Keyboard.ENTER && this.input.visible) {
                GameLogic.SendGM(this.input.text);
            }
        }
    };
    GameSceneView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.miniChat.openPanel();
    };
    GameSceneView.prototype.OnClose = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        MessageCenter.ins().removeAll(this);
        this.miniChat.closePanel();
    };
    GameSceneView.prototype.destoryView = function () {
        //场景自动释放
    };
    GameSceneView.prototype.onTap = function (e) {
        switch (e.currentTarget) {
        }
    };
    GameSceneView.LAYER_LEVEL = LayerManager.UI_USER_INFO;
    GameSceneView.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GameSceneView;
}(BaseEuiView));
__reflect(GameSceneView.prototype, "GameSceneView");
var BossComeToAttackView = (function (_super) {
    __extends(BossComeToAttackView, _super);
    function BossComeToAttackView() {
        var _this = _super.call(this) || this;
        _this.skinName = "BossComeToAttackSkin";
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    BossComeToAttackView.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.y = 400;
        try {
            var speed = SystemSettingPanel.GetSpeed();
            if (speed > 1) {
                for (var _i = 0, _a = this.startTween.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    for (var _b = 0, _c = item.paths; _b < _c.length; _b++) {
                        var path = _c[_b];
                        var data = path;
                        if (data.duration) {
                            data.duration = Math.floor(data.duration / speed);
                        }
                    }
                }
            }
        }
        catch (e) {
        }
        this.startTween.once('complete', this.Close, this);
        this.startTween.play();
    };
    BossComeToAttackView.prototype.Close = function () {
        DisplayUtils.removeFromParent(this);
    };
    return BossComeToAttackView;
}(eui.Component));
__reflect(BossComeToAttackView.prototype, "BossComeToAttackView");
//# sourceMappingURL=GameSceneView.js.map