namespace ceui {

    export class CScroller extends eui.Scroller {
        constructor() {
            super()
            this.skinName = "CScrollerSkin"
            let self = <any>this
            let touchScrollH = new CTouchScroll(self.horizontalUpdateHandler, self.horizontalEndHandler, self);
            let touchScrollV = new CTouchScroll(self.verticalUpdateHandler, self.verticalEndHanlder, self);
            this.$Scroller = {
                0: "auto",          //scrollPolicyV,
                1: "auto",          //scrollPolicyH,
                2: null,            //autoHideTimer,
                3: 0,               //touchStartX,
                4: 0,               //touchStartY,
                5: false,           //touchMoved,
                6: false,           //horizontalCanScroll,
                7: false,           //verticalCanScroll,
                8: touchScrollH,    //touchScrollH,
                9: touchScrollV,    //touchScrollV
                10: null,           //viewport
                11: false,          //viewprotRemovedEvent
                12: false           //touchCancle
            };
        }
    }
}
