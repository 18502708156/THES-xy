namespace ceui {

	let MAX_VELOCITY_COUNT = 4;
	let VELOCITY_WEIGHTS: number[] = [1, 1.33, 1.66, 2];
	let CURRENT_VELOCITY_WEIGHT = 2.33;
	let MINIMUM_VELOCITY = 0.02;
	let FRICTION = 0.998;
	let EXTRA_FRICTION = 0.95;
	let FRICTION_LOG = Math.log(FRICTION);

	function easeOut(ratio: number): number {
		let invRatio: number = ratio - 1.0;
		return invRatio * invRatio * invRatio + 1;
	}

	export class CTouchScroll {

        /**
         * @private
         * 创建一个 TouchScroll 实例
         * @param updateFunction 滚动位置更新回调函数
         */
		public constructor(updateFunction: (scrollPos: number) => void, endFunction: () => void, target: egret.IEventDispatcher) {
			if (DEBUG && !updateFunction) {
				egret.$error(1003, "updateFunction");
			}
			this.updateFunction = updateFunction;
			this.endFunction = endFunction;
			this.target = target;
			this.animation = new eui.sys.Animation(this.onScrollingUpdate, this);
			this.animation.endFunction = this.finishScrolling;
			this.animation.easerFunction = easeOut;
		}

       
		$scrollFactor = 1.0;

		private target: egret.IEventDispatcher;
		private updateFunction: (scrollPos: number) => void;
		private endFunction: () => void;
		private previousTime: number = 0;
		private velocity: number = 0;
		private previousVelocity: number[] = [];
		private currentPosition: number = 0;
		private previousPosition: number = 0;
		private currentScrollPos: number = 0;
		private maxScrollPos: number = 0;
		private offsetPoint: number = 0;
		private animation: eui.sys.Animation;
		public $bounces: boolean = true;

		public isPlaying(): boolean {
			return this.animation.isPlaying;
		}

		public stop(): void {
			this.animation.stop();
			egret.stopTick(this.onTick, this);
			this.started = false;
		}

		private started: boolean = true;

		public isStarted(): boolean {
			return this.started;
		}

		public start(touchPoint: number): void {
			this.started = true;
			this.velocity = 0;
			this.previousVelocity.length = 0;
			this.previousTime = egret.getTimer();
			this.previousPosition = this.currentPosition = touchPoint;
			this.offsetPoint = touchPoint;
			egret.startTick(this.onTick, this);
		}

		public update(touchPoint: number, maxScrollValue: number, scrollValue): void {
			maxScrollValue = Math.min(-maxScrollValue, 0);
			this.currentPosition = touchPoint;
			this.maxScrollPos = maxScrollValue;
			let disMove = this.offsetPoint - touchPoint;
			let scrollPos = disMove + scrollValue;
			this.offsetPoint = touchPoint;
			if (scrollPos > 0) {
				if (!this.$bounces) {
					scrollPos = 0;
				}
				else {
					scrollPos -= disMove * 0.5;
				}
			}
			if (scrollPos < maxScrollValue) {
				if (!this.$bounces) {
					scrollPos = maxScrollValue;
				}
				else {
					scrollPos -= disMove * 0.5;
				}
			}
			this.currentScrollPos = scrollPos;
			this.updateFunction.call(this.target, scrollPos);
		}

		public finish(currentScrollPos: number, maxScrollPos: number): void {
			maxScrollPos = -maxScrollPos
			egret.stopTick(this.onTick, this);
			this.started = false;
			let sum = this.velocity * CURRENT_VELOCITY_WEIGHT;
			let previousVelocityX = this.previousVelocity;
			let length = previousVelocityX.length;
			let totalWeight = CURRENT_VELOCITY_WEIGHT;
			for (let i = 0; i < length; i++) {
				let weight = VELOCITY_WEIGHTS[i];
				sum += previousVelocityX[0] * weight;
				totalWeight += weight;
			}

			let pixelsPerMS = sum / totalWeight;
			let absPixelsPerMS = Math.abs(pixelsPerMS);
			let duration = 0;
			let posTo = 0;
			if (absPixelsPerMS > MINIMUM_VELOCITY) {
				posTo = currentScrollPos + (pixelsPerMS - MINIMUM_VELOCITY) / FRICTION_LOG * 2 * this.$scrollFactor;
				if (posTo > 0 || posTo < maxScrollPos) {
					posTo = currentScrollPos;
					while (Math.abs(pixelsPerMS) > MINIMUM_VELOCITY) {
						posTo -= pixelsPerMS;
						if (posTo > 0 || posTo < maxScrollPos) {
							pixelsPerMS *= FRICTION * EXTRA_FRICTION;
						}
						else {
							pixelsPerMS *= FRICTION;
						}
						duration++;
					}
				}
				else {
					duration = Math.log(MINIMUM_VELOCITY / absPixelsPerMS) / FRICTION_LOG;
				}
			}
			else {
				posTo = currentScrollPos;
			}
			if (this.target["$getThrowInfo"]) {
				let event: eui.ScrollerThrowEvent = this.target["$getThrowInfo"](currentScrollPos, posTo);
				posTo = event.toPos;
			}
			if (duration > 0) {
				//如果取消了回弹,保证动画之后不会超出边界
				if (!this.$bounces) {
					if (posTo > 0) {
						posTo = 0;
					}
					else if (posTo < maxScrollPos) {
						posTo = maxScrollPos;
					}
				}
				this.throwTo(posTo, duration);
			}
			else {
				this.finishScrolling();
			}
		}

		private onTick(timeStamp: number): boolean {
			let timeOffset = timeStamp - this.previousTime;
			if (timeOffset > 10) {
				let previousVelocity = this.previousVelocity;
				if (previousVelocity.length >= MAX_VELOCITY_COUNT) {
					previousVelocity.shift();
				}
				this.velocity = (this.currentPosition - this.previousPosition) / timeOffset;
				previousVelocity.push(this.velocity);
				this.previousTime = timeStamp;
				this.previousPosition = this.currentPosition;
			}
			return true;
		}
        
		private finishScrolling(animation?: eui.sys.Animation): void {
			let hsp = this.currentScrollPos;
			let maxHsp = this.maxScrollPos;
			let hspTo = hsp;
			if (hsp > 0) {
				hspTo = 0;
			}
			if (hsp < maxHsp) {
				hspTo = maxHsp;
			}
			this.throwTo(hspTo, 300);
		}

		private throwTo(hspTo: number, duration: number = 500): void {
			let hsp = this.currentScrollPos;
			if (hsp == hspTo) {
				this.endFunction.call(this.target);
				return;
			}
			let animation = this.animation;
			animation.duration = duration;
			animation.from = hsp;
			animation.to = hspTo;
			animation.play();
		}

		private onScrollingUpdate(animation: eui.sys.Animation): void {
			this.currentScrollPos = animation.currentValue;
			this.updateFunction.call(this.target, animation.currentValue);
		}
	}
}