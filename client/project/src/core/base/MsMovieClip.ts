class MsMovieClip extends egret.Mesh {

    private offsetPoint: egret.Point = egret.Point.create(0, 0);
    $movieClipData: MsMovieClipData = null;
    private frames: any[] = null;
    $totalFrames: number = 0;
    $frameLabelStart: number = 0;
    $frameLabelEnd: number = 0;
    private frameIntervalTime: number = 0;
    $eventPool: string[] = null;
    $isPlaying: boolean = false;
    private isStopped: boolean = true;
    private playTimes: number = 0;
    $currentFrameNum: number = 0;
    $nextFrameNum: number = 1;
    private displayedKeyFrameNum: number = 0;
    private passedTime: number = 0;
    private $frameRate: number = NaN;
    $smoothing: boolean;

    public get smoothing(): boolean {
        return this.$smoothing;
    }

    public set smoothing(value: boolean) {
        value = !!value;
        if (value == this.$smoothing) {
            return;
        }
        this.$smoothing = value;
        this.$invalidate();
    }

    $init() {
        this.$reset();
        let movieClipData: MsMovieClipData = this.$movieClipData;
        if (movieClipData && movieClipData.$isDataValid()) {
            this.frames = movieClipData.frames;
            this.$totalFrames = movieClipData.numFrames;
            this.$frameRate = movieClipData.frameRate;
            this.frameIntervalTime = 1000 / this.$frameRate;
            this._initFrame();
        }
    }

    $reset(): void {
        this.frames = null;
        this.playTimes = 0;
        this.$isPlaying = false;
        this.setIsStopped(true);
        this.$currentFrameNum = 0;
        this.$nextFrameNum = 1;
        this.displayedKeyFrameNum = 0;
        this.passedTime = 0;
        this.$eventPool = [];
    }

    private _initFrame(): void {
        if (this.$movieClipData.$isTextureValid()) {
            this.advanceFrame();
            this.constructFrame();
        }
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        if (this.$isPlaying && this.$totalFrames > 1) {
            this.setIsStopped(false);
        }
    }

    $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        this.setIsStopped(true);
    }

    public play(playTimes: number = 0): void {
        this.$isPlaying = true;
        this.setPlayTimes(playTimes);
        if (this.$totalFrames > 1 && this.$stage) {
            this.setIsStopped(false);
        }
    }

    public stop(): void {
        this.$isPlaying = false;
        this.setIsStopped(true);
    }

    public prevFrame(): void {
        this.gotoAndStop(this.$currentFrameNum - 1);
    }

    public nextFrame(): void {
        this.gotoAndStop(this.$currentFrameNum + 1);
    }

    public gotoAndPlay(frame: number, playTimes: number = 0): void {
        if (arguments.length == 0 || arguments.length > 2) {
            egret.$error(1022, "MovieClip.gotoAndPlay()");
        }

        this.$frameLabelStart = 0;
        this.$frameLabelEnd = 0;

        this.play(playTimes);
        this.gotoFrame(frame);
    }

    public gotoAndStop(frame: number): void {
        if (arguments.length != 1) {
            egret.$error(1022, "MovieClip.gotoAndStop()");
        }
        this.stop();
        this.gotoFrame(frame);
    }

    private gotoFrame(frame: number): void {
        let frameNum: number;

        frameNum = parseInt(frame + '', 10);
        if (<any>frameNum != frame) {
            egret.$error(1022, "Frame Label Not Found");
        }

        if (frameNum < 1) {
            frameNum = 1;
        } else if (frameNum > this.$totalFrames) {
            frameNum = this.$totalFrames;
        }
        if (frameNum == this.$nextFrameNum) {
            return;
        }

        this.$nextFrameNum = frameNum;
        this.advanceFrame();
        this.constructFrame();
        this.handlePendingEvent();
    }

    private lastTime: number = 0;

    private advanceTime(timeStamp: number): boolean {
        let self = this;

        let advancedTime: number = timeStamp - self.lastTime;
        self.lastTime = timeStamp;

        let frameIntervalTime: number = self.frameIntervalTime;
        let currentTime = self.passedTime + advancedTime;
        self.passedTime = currentTime % frameIntervalTime;

        let num: number = currentTime / frameIntervalTime;
        if (num < 1) {
            return false;
        }
        while (num >= 1) {
            num--;
            self.$nextFrameNum++;
            if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart > 0 && self.$nextFrameNum > self.$frameLabelEnd)) {
                if (self.playTimes == -1) {
                    self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                    self.$nextFrameNum = 1;
                }
                else {
                    self.playTimes--;
                    if (self.playTimes > 0) {
                        self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                        self.$nextFrameNum = 1;
                    }
                    else {
                        self.$nextFrameNum = self.$totalFrames;
                        self.$eventPool.push(egret.Event.COMPLETE);
                        self.stop();
                        break;
                    }
                }
            }
            if (self.$currentFrameNum == self.$frameLabelEnd) {
                self.$nextFrameNum = self.$frameLabelStart;
            }
            self.advanceFrame();
        }
        self.constructFrame();
        self.handlePendingEvent();

        return false;
    }

    private advanceFrame(): void {
        this.$currentFrameNum = this.$nextFrameNum;
    }

    private constructFrame() {
        let currentFrameNum: number = this.$currentFrameNum;
        if (this.displayedKeyFrameNum == currentFrameNum) {
            return;
        }

        let msData = this.$movieClipData.getTextureByFrame(currentFrameNum);
        let node = this.$renderNode as egret.sys.MeshNode

        node.uvs = msData.m1
        node.vertices = msData.m2
        node.indices = msData.m3

        this.$movieClipData.$getOffsetByFrame(currentFrameNum, this.offsetPoint);
        let offsetX: number = Math.round(this.offsetPoint.x);
        let offsetY: number = Math.round(this.offsetPoint.y);
        this.anchorOffsetX = -offsetX
        this.anchorOffsetY = -offsetY

        this.$invalidateContentBounds();

        this.displayedKeyFrameNum = currentFrameNum;
    }

    private handlePendingEvent(): void {
        if (this.$eventPool.length != 0) {
            this.$eventPool.reverse();
            let eventPool = this.$eventPool;
            let length = eventPool.length;
            let isComplete = false;
            let isLoopComplete = false;

            for (let i = 0; i < length; i++) {
                let event: string = eventPool.pop();
                if (event == egret.Event.LOOP_COMPLETE) {
                    isLoopComplete = true;
                } else if (event == egret.Event.COMPLETE) {
                    isComplete = true;
                } else {
                    this.dispatchEventWith(event);
                }
            }

            if (isLoopComplete) {
                this.dispatchEventWith(egret.Event.LOOP_COMPLETE);
            }
            if (isComplete) {
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
        }
    }

    public get totalFrames(): number {
        return this.$totalFrames;
    }

    public get currentFrame(): number {
        return this.$currentFrameNum;
    }

    public get frameRate(): number {
        return this.$frameRate;
    }

    public set frameRate(value: number) {
        if (value == this.$frameRate) {
            return;
        }
        this.$frameRate = value;
        this.frameIntervalTime = 1000 / this.$frameRate;
    }

    public get isPlaying(): boolean {
        return this.$isPlaying;
    }

    public set movieClipData(value: MsMovieClipData) {
        this.setMovieClipData(value);
    }

    public get movieClipData(): MsMovieClipData {
        return this.$movieClipData;
    }

    private setMovieClipData(value: MsMovieClipData) {
        if (this.$movieClipData == value) {
            return;
        }
        this.$movieClipData = value;
        this.$init();
    }

    private setPlayTimes(value: number) {
        if (value < 0 || value >= 1) {
            this.playTimes = value < 0 ? -1 : Math.floor(value);
        }
    }

    private setIsStopped(value: boolean) {
        if (this.isStopped == value) {
            return;
        }
        this.isStopped = value;
        if (value) {
            egret.ticker.$stopTick(this.advanceTime, this);
        } else {
            this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
            this.lastTime = egret.getTimer();
            egret.ticker.$startTick(this.advanceTime, this);
        }
    }
}
