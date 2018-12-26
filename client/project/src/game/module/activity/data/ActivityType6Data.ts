class ActivityType6Data extends ActivityBaseData {

    reachindex: number
    value: number
    drawrecord: number
    drawtime: number

    update(e: Sproto.activity_type06) {
        this.reachindex = e.reachindex;
        this.value = e.value;
        this.drawrecord = e.drawrecord;
        this.drawtime = e.drawtime;
    }
}