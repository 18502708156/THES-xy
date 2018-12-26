class ResData {

	private static m_SliceData: {[key: string]: ISliceImgData} = null
	private static EMPTY_DATA: ISliceImgData

	public static GetSliceImgData(name: string) {
		if (this.m_SliceData == null) {
			this.EMPTY_DATA = {
				offY: 0,
				offX: 0,
				sourceH: 512,
				sourceW: 512,
				w: 512,
				h: 512,
				y: 0,
				x: 0,
			}
			try {
				// let data = JSON.parse(RES.getRes("slice_img_json"))
				let data = RES.getRes("slice_img_json")
				this.m_SliceData = data["slice_img"] || {}
				RES.destroyRes("slice_img_json")
			} catch (e) {}
			if (!this.m_SliceData) {
				this.m_SliceData = {}
			}
		}
		return this.m_SliceData[name] || this.EMPTY_DATA
	}
}

interface ISliceImgData {
	offY: number 
	offX: number
	sourceH: number
	sourceW: number
	w: number
	h: number
	y: number
	x: number
}
