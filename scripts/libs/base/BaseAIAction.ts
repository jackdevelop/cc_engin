import BaseAIHandle from "./BaseAIHandle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseAIAction extends BaseAIHandle {

	/** 动作执行状态 */
	protected mActionState = -1;

	// ai执行
	public getActionState() {
		return this.mActionState;
	}

	// ai执行
	public excude(param: string): boolean {
		return false;
	}

	public update(dt: number) {

	}
}
