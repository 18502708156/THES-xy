
// 仙道上届冠军数据
class XiandaoLastData {

	public roleName: string = ""
	public serverId: number = 0
	public role1Job: number = 1
	public role1Sex: number = 0
	public role2Job: number = 1
	public role2Sex: number = 0

	public GetName(): string {
		return GameString.GetSerAndName(this.serverId, this.roleName)
	}
}