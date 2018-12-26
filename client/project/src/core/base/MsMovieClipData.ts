interface IMsClipData {
    m1: number[]
    m2: number[]
    m3: number[]
}

class MsMovieClipData extends egret.HashObject {
    $mcData: any = null;

    public numFrames: number = 1;

    public frames: any[] = [];

    public frameRate: number = 0;

    private m_JsonData: any

    $init(mcData: any, jsonData: any) {
        this.m_JsonData = jsonData
        this.setMCData(mcData);
    }

    public getKeyFrameData(frame: number): any {
        let outputFrameData = this.frames[frame - 1];
        if (outputFrameData.frame) {
            outputFrameData = this.frames[outputFrameData.frame - 1];
        }
        return outputFrameData;
    }

    public getTextureByFrame(frame: number): IMsClipData {
        let frameData = this.getKeyFrameData(frame);
        if (frameData.res) {
            return this.getTextureByResName(frameData.res);
        }
        return null;
    }

    public $getOffsetByFrame(frame: number, point: egret.Point): void {
        let frameData = this.getKeyFrameData(frame);
        if (frameData.res) {
            point.setTo(frameData.x | 0, frameData.y | 0);
        }
    }

    private getTextureByResName(resName: string): IMsClipData {
        return this.m_JsonData.res[resName]
    }

    $isDataValid(): boolean {
        return this.frames.length > 0;
    }

    $isTextureValid(): boolean {
        return this.$mcData != null
    }

    $fillMCData(mcData: any): void {
        this.frameRate = mcData["frameRate"] || 24;
        this.fillFramesData(mcData.frames);
    }

    private fillFramesData(framesData: any[]): void {
        let frames: any[] = this.frames;
        let length: number = framesData ? framesData.length : 0;
        let keyFramePosition: number;
        for (let i = 0; i < length; i++) {
            let frameData: any = framesData[i];
            frames.push(frameData);
            if (frameData.duration) {
                let duration: number = parseInt(frameData.duration);
                if (duration > 1) {
                    keyFramePosition = frames.length;
                    for (let j = 1; j < duration; j++) {
                        frames.push({ "frame": keyFramePosition })
                    }
                }
            }
        }
        this.numFrames = frames.length;
    }

    public set mcData(value: MsMovieClipData) {
        this.setMCData(value);
    }

    public get mcData(): MsMovieClipData {
        return this.$mcData;
    }

    private setMCData(value: MsMovieClipData) {
        if (this.$mcData == value) {
            return;
        }
        this.$mcData = value;
        if (value) {
            this.$fillMCData(value);
        }
    }
}
