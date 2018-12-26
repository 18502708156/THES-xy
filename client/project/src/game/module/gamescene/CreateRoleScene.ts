class CreateRoleScene extends BaseScene {
	public constructor() {
		super();
	}

	public onEnter() {
		super.onEnter();
		ViewManager.ins().open(CreateDefaultRoleView);
	}

	public onExit() {
		super.onExit();
	}
}