










import { GameNotify } from '../utils/GameNotify';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/BaseComponent')
export default class BaseComponent extends cc.Component {
	@property({ tooltip: '隐藏是否监听事件' })
	hide_is_handleEvent: boolean = false;
	
	

	
	

	
	private __eventHandle = null;
	
	

	
	m__addEventHandle(event_name_all: Array<string>, priority: number) {
		console.log('BaseComponent > m__addEventHandle ');

		let event_name_hash = event_name_all;
		if (!event_name_hash) {
			return;
		}
		var self = this;
		if (self.__eventHandle == null) {
			self.__eventHandle = (data: any) => {
				let curr_node = self.node;
				
				if (curr_node) {
					if (curr_node.active) {
						self.m__eventHandle(data);
					} else {
						if (self.hide_is_handleEvent) {
							self.m__eventHandle(data);
						}
					}
				} else {
					self.m__eventHandle(data);
				}
			};

			GameNotify.getInstance().removeAllEventListenersForHandle(
				self.__eventHandle
			);
			for (let i = 0; i < event_name_hash.length; i++) {
				let one_name = event_name_hash[i];
				GameNotify.getInstance().addEventListener(
					one_name,
					self.__eventHandle,
					null,
					priority
				);
			}
		}
	}

	m__eventHandle(event: { name: string; data?: any; target?: any }) {
		var self = this;
		var data = event.data;
		
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	onDestroy() {
		

		this.node.stopAllActions();
		this.unschedule(null);
		this.unscheduleAllCallbacks();

		
		
		
		GameNotify.getInstance().removeAllEventListenersForHandle(
			this.__eventHandle
		);
		this.__eventHandle = null;
		
	}
}
