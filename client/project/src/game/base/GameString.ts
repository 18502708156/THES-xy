class GameString {
	public static GetLvName(zsLevel: number, level: number) {
        if (zsLevel > 0) {
			return `${zsLevel}阶${level}级`
		}
		return `${level}级`
	}

	public static GetLvName2(zsLevel: number = 0, level: number = 0) {
        if (zsLevel > 0) {
			return `${zsLevel}阶`
		}
		return `${level}级`
	}

	public static GetThirdPerson(sex: number) {
		if (sex == 0) {
			return "他"
		}
		return "她"
	}

	public static GetSerAndName(serverId: number, name: string): string {
		if (serverId) {
			return `${name}.S${serverId}`
		}
		return name
	}

	public static GetSer(serverId: number): string {
		return "S" + serverId
	}

	// 获取时间
	// {"*.*.*-21:00 ^ *.*.*-21:10"}
	public static GetSpecTimeString(str: string[]): string[] {
		let array = str[0].split("^")
		return [array[0].trim().split("-")[1], array[1].trim().split("-")[1]]
	}
}