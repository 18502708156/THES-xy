class DirUtil {
	
	/**
     * 通过2点，获取8方向值
     */
	public static Get8DirBy2Point(p1, p2) {
		//计算方向
		var angle = MathUtils.getAngle(MathUtils.getRadian2(p1.x, p1.y, p2.x, p2.y));
		return this.Gngle2dir(angle);
	}

	/** 方向转角度 */
	public static dir2angle(dir) {
		dir *= 45;
		dir -= 90;
		return dir;
	}

	/** 角度转方向 */
	public static Gngle2dir(angle) {
		if (angle < -90)
			angle += 360;
		angle += 90
		if (angle <= 80) {
			return 1
		}
		if (angle > 80 && angle <= 190) {
			return 3
		}
		if (angle > 190 && angle <= 280) {
			return 5
		}
		return 7
		// return (Math.floor((angle + 90) / 90) % 4) * 2 + 1;
	};

	/** 反方向 */
	public static DirOpposit(dir) {
		return dir < 4 ? dir + 4 : dir - 4;
	}

	/** 8方向转5方向资源方向 */
	public static Get5DirBy8Dir(dir8: number) {
		var td = 2 * (dir8 - 4);
		if (td < 0)
			td = 0;
		return dir8 - td;
	}

	/** 获取方向格子坐标后几格的坐标 */
	public static GetGridByDir(dir, pos: number = 1, p: any = null) {
		var angle = this.dir2angle(this.DirOpposit(dir));
		var tp = p || new egret.Point();
		MathUtils.getDirMove(angle, pos * MapGrid.CELL_SIZE, tp);
		return tp;
	};

	public static GetDir(sx: number, sy: number, ex: number, ey: number): number {
		return this.Gngle2dir(MathUtils.getAngle(MathUtils.getRadian2(sx, sy, ex, ey)));
	}
}