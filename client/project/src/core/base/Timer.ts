class Timer {

	private m_Timer = -1	

	public static TimeOut(func: Function, time: number): Timer {
		let timer = new Timer
		let f = () => {
			if (timer.m_Timer == -1) {
				return
			}
			func()
			timer.m_Timer = -1
		}
		timer.m_Timer = setTimeout(f, time)
		return timer
	}

	public Stop() {
		if (this.m_Timer != -1) {
			clearTimeout(this.m_Timer)
		}
		this.m_Timer = -1
	}
}