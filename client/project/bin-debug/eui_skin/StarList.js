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
var StarList = (function (_super) {
    __extends(StarList, _super);
    function StarList(listLength, starNum) {
        if (listLength === void 0) { listLength = 10; }
        if (starNum === void 0) { starNum = 0; }
        var _this = _super.call(this) || this;
        _this.m_StarItem = [];
        _this.m_StatListLength = listLength;
        _this.m_StarNum = starNum;
        return _this;
        // this._statListLength = listLength;
        // this._starNum = starNum;
        // this.list = [];
        // for (var i = 0; i < this._statListLength; i++) {
        // 	var starItem = new StarItem;
        // 	starItem.x = i * 30 + 2;
        // 	this.addChild(starItem);
        // 	if (i <= this._starNum - 1)
        // 		starItem.isShow(true);
        // 	this.list.push(starItem);
        // }
    }
    Object.defineProperty(StarList.prototype, "count", {
        set: function (value) {
            var count = parseInt(value) || 0;
            this._UpdateStarCount();
        },
        enumerable: true,
        configurable: true
    });
    StarList.prototype._UpdateStarCount = function () {
        if (this.$stage) {
            // for (let i = 0; i < this.m_StarItem.length; ++i) {
            // 	this.m_StarItem[i].visible = i < this.m_StatListLength
            // }
            this.m_StatListLength = Math.min(this.m_StatListLength, this.m_StarItem.length);
            for (var i = 0; i < this.m_StatListLength; ++i) {
                var item = this.m_StarItem[i];
                item.visible = true;
                DisplayUtils.ChangeParent(item, this.group);
            }
            for (var i = this.m_StatListLength; i < this.m_StarItem.length; ++i) {
                var item = this.m_StarItem[i];
                item.visible = false;
                DisplayUtils.ChangeParent(item, this);
            }
        }
    };
    StarList.prototype._UpdateStarState = function () {
        if (this.$stage) {
            for (var i = 0, len = Math.min(this.m_StarItem.length, this.m_StatListLength); i < len; ++i) {
                this.m_StarItem[i].currentState = i < this.m_StarNum ? "light" : "gray";
            }
        }
    };
    StarList.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    StarList.prototype.childrenCreated = function () {
        var group = this["group"];
        for (var i = 0; i < group.numChildren; ++i) {
            this.m_StarItem[i] = group.getChildAt(i);
        }
        this._UpdateStarCount();
        this._UpdateStarState();
    };
    Object.defineProperty(StarList.prototype, "starNum", {
        get: function () {
            return this.m_StarNum;
        },
        set: function (num) {
            if (this.m_StarNum == num)
                return;
            this.m_StarNum = num;
            this._UpdateStarState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarList.prototype, "listLength", {
        get: function () {
            return this.m_StatListLength;
        },
        set: function (value) {
            if (this.m_StatListLength == value) {
                return;
            }
            this.m_StatListLength = value;
            this._UpdateStarCount();
        },
        enumerable: true,
        configurable: true
    });
    return StarList;
}(eui.Component));
__reflect(StarList.prototype, "StarList", ["eui.UIComponent", "egret.DisplayObject"]);
// class StarItem extends eui.Component {
// 	public constructor() {
// 		super();
// 		this.skinName = "StarItemSkin";
// 	}
// 	isShow(num: boolean): void {
// 		this.currentState = num ? "light" : "gray"
// 	}
// } 
//# sourceMappingURL=StarList.js.map