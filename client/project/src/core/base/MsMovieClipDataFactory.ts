class MsMovieClipDataFactory {

	private static m_Cache = {}

	public static generateMovieClipData(movieClipName: string = "", mcData: any): MsMovieClipData {
		if (movieClipName == "") {
			if (mcData) {
				for (movieClipName in mcData.mc) {
					break;
				}
			}
		}
		if (movieClipName == "") {
			return null;
		}
		let output: MsMovieClipData = this.findFromCache(movieClipName);
		if (!output) {
			output = new MsMovieClipData();
			this.fillData(movieClipName, output, mcData);
		}
		return output;
	}

	private static findFromCache(movieClipName: string): any {
		if (this.m_Cache[movieClipName]) {
			return this.m_Cache[movieClipName];
		}
		return null;
	}

	private static fillData(movieClipName: string, movieClip: MsMovieClipData, mcData: any): void {
		if (mcData) {
			if (!mcData["__handle__"]) {
				var _w = mcData["width"]
				var _h = mcData["height"]
				let res = mcData.res
				for (let key in res) {
					let m1 = res[key].m1
					for (let i = 0, len = m1.length; i < len; ++i) {
						m1[i] = m1[i] / (i % 2 == 0 ? _w : _h)
					}
				}
				mcData["__handle__"] = 1
			}
			let data = mcData.mc[movieClipName];
			if (data) {
				movieClip.$init(data, mcData);
				this.m_Cache[movieClipName] = movieClip;
			}
		}
	}
}