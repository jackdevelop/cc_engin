

import GameManger from '../../gamemanager/GameManger';
import PoolManager from '../../scripts/libs/pool/PoolManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlertWindow extends cc.Component {
	
	private static instance: AlertWindow = null;

	
	@property({ type: cc.Prefab, tooltip: 'toolTipPrefable' })
	private toolTipPrefable: cc.Prefab = null;

	@property({ type: cc.Prefab, tooltip: 'toolTipPrefable_2' })
	toolTipPrefable_2: cc.Prefab = null;

	
	onLoad() {
		AlertWindow.instance = this;
	}

	
	public static show(
		title,
		tip,
		btnArr,
		confirmfun,
		canclefun,
		closefun,
		parent_layer = null
	): void {
		let instance = AlertWindow.instance;
		if (instance == null) {
			return;
		}

		if (btnArr == null) {
			btnArr = ['确定'];
		}

		var toolTipPrefable = instance.toolTipPrefable;
		
		if (toolTipPrefable == null) {
			return;
		}

		var gameManger_instance = GameManger.instance;
		if (!gameManger_instance) {
			return;
		}
		let game_font = gameManger_instance.game_font;

		
		var canvas = cc.find('Canvas'); 
		let current_node_parent =
			parent_layer || canvas.getChildByName('uiLayer_top');
		if (!current_node_parent) return;

		
		let retobj = PoolManager.requestPoolObj('AlertPrefab', toolTipPrefable);
		
		if (!retobj.getParent()) {
			current_node_parent.addChild(retobj);
		}

		var node_parent = retobj.getChildByName('node_parent');
		
		if (node_parent.getChildByName('txt_title')) {
			var txt_title = node_parent
				.getChildByName('txt_title')
				.getComponent(cc.Label);
			txt_title.string = title;
			if (game_font) {
				txt_title.font = game_font;
			}
		}

		
		var txt_tips = node_parent
			.getChildByName('txt_tips')
			.getComponent(cc.RichText);
		txt_tips.string = tip;
		if (game_font) {
			txt_tips.font = game_font;
		}

		
		var btn_confirm = node_parent
			.getChildByName('node_layout')
			.getChildByName('btn_confirm')
			.getComponent(cc.Button);
		btn_confirm.node.targetOff(this);
		btn_confirm.node.on(
			cc.Node.EventType.TOUCH_END,
			function (event) {
				cc.log('点击了确定按钮');
				
				
				
				var button = event.detail;
				
				PoolManager.returnPoolObj('AlertPrefab', retobj);

				if (confirmfun) confirmfun();
			},
			this
		);

		var txt_confirm = btn_confirm.node.getChildByName('txt_confirm');
		if (txt_confirm) {
			txt_confirm = txt_confirm.getComponent(cc.Label);
			txt_confirm.string = btnArr[0];
			if (game_font) {
				txt_confirm.font = game_font;
			}
		}

		
		let btn_cancel;
		if (
			node_parent.getChildByName('node_layout').getChildByName('btn_cancel')
		) {
			btn_cancel = node_parent
				.getChildByName('node_layout')
				.getChildByName('btn_cancel')
				.getComponent(cc.Button);
			btn_cancel.node.targetOff(this);
			btn_cancel.node.on(
				cc.Node.EventType.TOUCH_END,
				function (event) {
					
					var button = event.detail;
					
					
					
					PoolManager.returnPoolObj('AlertPrefab', retobj);

					if (canclefun) canclefun();
				},
				this
			);
		}

		
		var ui_mask = retobj.getChildByName('ui_mask');
		if (ui_mask) {
			ui_mask = ui_mask.getComponent(cc.Button);
			if (ui_mask) {
				ui_mask.node.targetOff(this);
				ui_mask.node.on(
					cc.Node.EventType.TOUCH_END,
					function (event) {
						
						var button = event.detail;
						
						
						
						PoolManager.returnPoolObj('AlertPrefab', retobj);

						if (closefun) closefun();
					},
					this
				);
			}
		}

		var btn_close = node_parent.getChildByName('btn_close');
		if (btn_close) {
			btn_close = btn_close.getComponent(cc.Button);
			btn_close.node.targetOff(this);
			btn_close.node.on(
				cc.Node.EventType.TOUCH_END,
				function (event) {
					
					var button = event.detail;
					
					
					
					PoolManager.returnPoolObj('AlertPrefab', retobj);

					if (closefun) closefun();
				},
				this
			);
		}

		
		var _btn_confirm_positon = btn_confirm.node.getPosition();
		var _btn_cancel_positon = btn_cancel.node.getPosition();

		if (btnArr && btnArr.length == 1) {
			
			btn_confirm.node.active = true;
			btn_cancel.node.active = false;
		} else {
			
			

			btn_confirm.node.active = true;
			btn_cancel.node.active = true;

			var txt_cancel = btn_cancel.node;
			txt_cancel = txt_cancel.getChildByName('txt_cancel');
			if (txt_cancel) {
				txt_cancel = txt_cancel.getComponent(cc.Label);
				txt_cancel.string = btnArr[1];
				if (game_font) {
					txt_cancel.font = game_font;
				}
			}
		}

		return retobj;
	}
}
