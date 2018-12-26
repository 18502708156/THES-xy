class MovieClip extends MovieObject {
	public loadFile(fileName: string, autoPlay?: true, playCount?: number, comp?: Function) {
		this.LoadByUrl(fileName, playCount, autoPlay, comp)
	}
	public loadUrl(fileName: string, autoPlay?: boolean, playCount?: number, comp?: Function,compFuncTagret?:any) {
		this.LoadByUrl(fileName, playCount, autoPlay, comp,compFuncTagret)
	}
	public clearCache() {
		this.ClearCache()
	}
}