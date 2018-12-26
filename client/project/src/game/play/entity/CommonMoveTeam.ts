class CommonMoveTeam extends MoveTeam {

    // private INDEX = 0
    // private WAY = 1
    // private pathIndex = 0

    // private GetNextPos() {
    //     let pathData = GameMap.mPath[this.pathIndex]
    //     if (!pathData) {
    //         return null
    //     }
    //     let points = pathData.points
    //     let data = points[this.INDEX]
    //     this.INDEX += this.WAY
    //     if (this.INDEX >= points.length - 1) {
    //         this.WAY = -1
    //     } else if (this.INDEX <= 0) {
    //         this.WAY = 1
    //     }
    //     return [Const.PosToPixel(pathData.x + data.x), Const.PosToPixel(pathData.y + data.y)]
    // }

    // public Init(member: MapEntity[]) {
    //     super.Init(member)
    //     if (GameMap.mPath && GameMap.mPath.length) {
    //         this.pathIndex = MathUtils.limitInteger(0, GameMap.mPath.length - 1)
    //     }
        // let data = this.GetNextPos() 
        // if (data) {
        //     this.MoveTo(data[0], data[1])
        // }
    // }

    // public Update(delta: number): number {
    //     let ret = super.Update(delta)
    //     return ret
    // }
    
    // public MoveTo(x: number, y: number): void {
        // if (this.mMember.length) {
        //    this.mMember[0].MoveTo(x, y)
        // }
    //     for(let i = 0; i<this.mMember.length ; i++){
    //          this.mMember[i].MoveTo(x+(i*10),y+(i*10))
    //     }
    // }
    
}


