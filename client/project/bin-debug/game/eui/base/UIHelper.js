var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var UIHelper = (function () {
    function UIHelper() {
    }
    UIHelper.SetHead = function (comp, job, sex, isCircle) {
        if (isCircle === void 0) { isCircle = true; }
        if (comp == null) {
            return;
        }
        var face = comp["face"];
        if (face == null) {
            console.log("UIHelper.SetHead face == null");
            return;
        }
        if (job == null || sex == null) {
            face.source = "";
            return;
        }
        // if (isCircle) face.source = ResDataPath.GetHeadCircleImgName(job, sex)
        // else 
        face.source = ResDataPath.GetHeadImgName(job, sex);
    };
    UIHelper.SetHeadByHeadId = function (comp, headId, isCircle) {
        if (isCircle === void 0) { isCircle = true; }
        if (comp == null) {
            return;
        }
        var face = comp["face"];
        if (face == null) {
            console.log("UIHelper.SetHeadByHeadId face == null");
            return;
        }
        if (isCircle)
            face.source = headId ? ResDataPath.GetHeadCircleImgNameById(headId) : "";
        else
            face.source = headId ? ResDataPath.GetHeadMiniImgNameById(headId) : "";
    };
    UIHelper.ShowRedPoint = function (comp, isShow) {
        if (!comp) {
            return;
        }
        var redPoint = comp["redPoint"];
        if (redPoint == null) {
            var group = comp;
            if (group.getChildByName) {
                redPoint = group.getChildByName("redPoint");
            }
        }
        if (!redPoint) {
            console.log("没有设置提示图标", comp.name);
            return;
        }
        redPoint.visible = isShow ? true : false;
    };
    UIHelper.SetBtnNormalEffe = function (btn, isShow, width, height) {
        var scalex = 1;
        var scaley = 1;
        if (width) {
            scalex = width / 148;
        }
        if (height) {
            scaley = height / 53;
        }
        var effeName = "normalbtn";
        var eff = btn.getChildByName(effeName);
        if (eff) {
            if (isShow) {
                eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1);
            }
            else {
                DisplayUtils.removeFromParent(eff);
            }
        }
        else {
            if (isShow) {
                eff = new MovieClip;
                eff.name = effeName;
                eff.x = btn.width >> 1;
                eff.y = btn.height >> 1;
                eff.scaleX = scalex;
                eff.scaleY = scaley;
                btn.addChild(eff);
                eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1);
            }
        }
    };
    UIHelper.SetBtnEffe = function (btn, effeName, isShow, scalex, scaley, posX, posY) {
        if (scalex === void 0) { scalex = null; }
        if (scaley === void 0) { scaley = null; }
        if (posX === void 0) { posX = null; }
        if (posY === void 0) { posY = null; }
        var eff = btn.getChildByName(effeName);
        if (eff) {
            if (isShow) {
                eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1);
            }
            else {
                DisplayUtils.removeFromParent(eff);
            }
        }
        else {
            if (isShow) {
                eff = new MovieClip;
                eff.name = effeName;
                btn.addChild(eff);
                eff.loadUrl(ResDataPath.GetUIEffePath2(effeName), true, -1);
            }
        }
        if (eff && eff.parent) {
            if (scalex || scaley) {
                eff.scaleX = scalex || scaley;
                eff.scaleY = scaley || scalex;
            }
            eff.x = posX || 30;
            eff.y = posY || 0;
        }
    };
    // public static SetIconMovie(target: egret.DisplayObject, startY: number = null) {
    // 	if (!target) {
    // 		return
    // 	}
    // 	startY = startY != null ? startY : target.y
    // 	egret.Tween.removeTweens(target)
    // 	var tween = egret.Tween.get(target, { loop: true });
    // 	target.y = startY
    // 	var y1 = startY + 20;
    // 	var y2 = startY
    // 	tween.to({ "y": y1 }, 1500).to({ "y": y2 }, 1500)
    // }
    UIHelper.RemoveIconMovie = function (target) {
        egret.Tween.removeTweens(target);
    };
    UIHelper.SetBtnEffeType8 = function (target, isShow) {
        UIHelper.SetBtnEffe(target, "chargeff1", isShow, 1.1, 1.3);
    };
    UIHelper.SetCircleEffe = function (target, isShow, x, y) {
        if (x === void 0) { x = 33; }
        if (y === void 0) { y = 30; }
        UIHelper.SetBtnEffe(target, "actIconCircle", isShow, null, null, x, y);
    };
    UIHelper.SetScrollHIndex = function (group, index) {
        if (group.parent == null) {
            console.warn("not scroll view");
            return;
        }
        var scrollWidth = group.parent.width;
        var gap = 0;
        var left = 0;
        var right = 0;
        if (group.layout != null) {
            if (egret.is(group.layout, "eui.HorizontalLayout")) {
                gap = group.layout.gap || 0;
                left = group.layout.paddingLeft || 0;
                right = group.layout.paddingRight || 0;
            }
            else if (egret.is(group.layout, "eui.HorizontalLayout")) {
                gap = group.layout.horizontalGap || 0;
                left = group.layout.paddingLeft || 0;
                right = group.layout.paddingRight || 0;
            }
        }
        var childWidth = group.getChildAt(0) ? group.getChildAt(0).width : 0;
        var pos = -left + (childWidth + gap) * index;
        group.scrollH = MathUtils.Clamp(pos, -left, left + (childWidth + gap) * (group.numElements) + right - gap - scrollWidth);
    };
    UIHelper.ScrollHIndex = function (list, leftIndex, itemWidth, listWidth) {
        if (listWidth == null) {
            listWidth = list.width;
        }
        list.validateNow();
        var offsetWidth = list.numElements * itemWidth - listWidth;
        list.scrollH = Math.min(leftIndex * itemWidth, offsetWidth);
    };
    UIHelper.ScrollHRight = function (list, itemWidth, listWidth) {
        if (listWidth == null) {
            listWidth = list.width;
        }
        list.scrollH = Math.min(list.numElements * itemWidth - listWidth, list.scrollH + listWidth);
    };
    UIHelper.ScrollHLeft = function (list, listWidth) {
        if (listWidth == null) {
            listWidth = list.width;
        }
        list.scrollH = Math.max(0, list.scrollH - listWidth);
    };
    // public static ShowItemListEff(list: eui.List): void {
    // 	if (list == null) {
    // 		return
    // 	}
    // 	list.validateNow()
    // 	for (let i = 0; i < list.numChildren; ++i) {
    // 		let item = list.getChildAt(i) as ItemBase
    // 		if (item && item.showItemEffect) {
    // 			item.showItemEffect()
    // 		}
    // 	}
    // }
    /** 设置链接样式文本 */
    UIHelper.SetLinkStyleLabel = function (label, text) {
        if (text === void 0) { text = null; }
        if (!label) {
            return;
        }
        label.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + (text == null ? label.text : text) + "</u></a>");
    };
    UIHelper.GetChildByName = function (obj, name) {
        if (obj == null || obj.getChildByName == null) {
            return null;
        }
        return obj.getChildByName(name);
    };
    UIHelper.ListRefresh = function (list) {
        if (list == null) {
            return;
        }
        var array = list.dataProvider;
        if (array == null) {
            return;
        }
        array.replaceAll(array.source);
    };
    UIHelper.PlayBoomEff = function (obj) {
        if (!obj) {
            return;
        }
        var mc = ObjectPool.pop("MovieClip");
        mc.scaleX = mc.scaleY = 1;
        mc.rotation = 0;
        // mc.x = mc.y = 40;
        mc.x = obj.width >> 1;
        mc.y = obj.height >> 1;
        mc.loadFile(ResDataPath.GetUIEffePath("litboom"), true, 1, function () {
            ObjectPool.push(mc);
        });
        obj.addChild(mc);
    };
    UIHelper.PlayUpEff = function (obj, scale) {
        if (scale === void 0) { scale = 1; }
        if (!obj) {
            return;
        }
        var mc = ObjectPool.pop("MovieClip");
        mc.scaleX = mc.scaleY = scale;
        mc.x = obj.width >> 1;
        mc.y = obj.height >> 1;
        mc.loadFile(ResDataPath.GetUIEffePath("ui_eff_skillf_001"), true, 1, function () {
        });
        obj.addChild(mc);
    };
    UIHelper.SetVisible = function (view, visible) {
        if (!view) {
            return;
        }
        view.visible = visible;
        view.includeInLayout = visible;
    };
    UIHelper.prototype.RefreshList = function (list) {
        if (!list) {
            return;
        }
        var dataProvider = list.dataProvider;
        if (dataProvider && egret.is(dataProvider, "eui.ArrayCollection")) {
            var array = dataProvider;
            array.replaceAll(array.source);
        }
    };
    UIHelper.SetLabelText = function (label, preText, valText) {
        label.textFlow = TextFlowMaker.generateTextFlow(preText + ("|C:0x38983d&T:" + valText + "|"));
    };
    UIHelper.SetInputMaxChar = function (textinput, maxLen) {
        var oldInput = textinput.text;
        textinput.addEventListener(egret.Event.CHANGE, function () {
            var num = StringUtils.strByteLen(textinput.text);
            if (num > 12) {
                textinput.text = oldInput;
            }
            else {
                oldInput = textinput.text;
            }
        }, textinput);
    };
    UIHelper.SetRatio = function (img, width, height) {
        if (!img) {
            return;
        }
        var tex = img.$Bitmap[0];
        if (!tex) {
            return;
        }
        if (tex) {
            var texWidth = tex.textureWidth;
            var texHeight = tex.textureHeight;
            if (texHeight > height) {
                img.height = height;
                img.width = height / texHeight * texWidth;
            }
            else {
                img.width = width;
                img.height = width / texWidth * texHeight;
            }
        }
    };
    UIHelper.PlayPanelTween = function (target) {
        egret.Tween.removeTweens(target);
        target.scaleX = target.scaleY = 0.5;
        target.alpha = 0;
        egret.Tween.get(target).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200, egret.Ease.backOut);
    };
    UIHelper.PANEL = "Panel";
    UIHelper.PANEL_NO_TAB = "Panel2";
    UIHelper.STAE_IMG_NAME = "ui_bm_star022";
    UIHelper.STAE_NONE_IMG_NAME = "ui_bm_star021";
    UIHelper.DEFUALT_HEAD_ID = 10;
    return UIHelper;
}());
__reflect(UIHelper.prototype, "UIHelper");
//# sourceMappingURL=UIHelper.js.map