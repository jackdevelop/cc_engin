/**
 * public static js
 * GameEventConstants 常量
 *
 */
export class GameEventConstants {
	//界面尺寸变化
	public static onGameResize = 'onGameResize';
	//按钮按下
	public static onKeyDown = 'onKeyDown';

	//场景切换
	public static SCENE_CHANGE_START_END = 'SCENE_CHANGE_START_END';
	public static SCENE_CHANGE_START = 'SCENE_CHANGE_START';
	public static SCENE_CHANGE_END = 'SCENE_CHANGE_END';

	// 打开了某个界面的 事件
	public static PANEL_OPEN_START = 'PANEL_OPEN_START'; //打开了界面的 start
	public static PANEL_OPEN_BEGIN = 'PANEL_OPEN_BEGIN';
	public static PANEL_OPEN = 'PANEL_OPEN'; //打开了界面
	public static PANEL_HIDE = 'PANEL_HIDE';

	//数据变化相关
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//server_disconnect 连接
	public static server_disconnect = 'server_disconnect';
	//用户属性修改
	public static server_user_changed = 'server_user_changed';
	//用户背包道具修改
	public static server_user_items_changed = 'server_user_items_changed';

	// 支付相关
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public static server_pay_state_change = 'server_pay_state_change'; //支付状态改变

	// 登录相关
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public static server_login_resp = 'server_login_resp';

	//匹配相关的事件
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public static server_hall_join_match = 'server_hall_join_match'; //匹配成功相关
	public static server_hall_quit_match = 'server_hall_quit_match'; //匹配退出相关

	//房间相关的事件
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public static server_room_quit = 'server_room_quit';

	public static game_room_enter = 'game_room_enter';
	public static server_room_ready = 'server_room_ready';

	public static server_room_status_changed_before =
		'server_room_status_changed_before';
	public static server_room_status_changed = 'server_room_status_changed';

	public static server_room_game_action_before =
		'server_room_game_action_before';
	public static server_room_game_action = 'server_room_game_action';

	// public static game_action_start = 'game_action_start';
	public static game_action = 'game_action';
	// public static game_action_end = 'game_action_end'; //某一个action结束
	// public static game_room_sitdown = 'game_room_sitdown';
	// public static game_room_standup = 'game_room_standup';
	// public static server_user_join_room = 'server_user_join_room';
	// public static server_user_quit_room = 'server_user_quit_room';
	// public static server_player_over = 'server_player_over'; //播放完毕
	// public static server_game_over = 'server_game_over'; // 战斗结束

	// public static server_game_ready = 'server_game_ready';
	// public static server_game_continue = 'server_game_continue';
	// public static server_game_init = 'server_game_init';
	// public static sever_game_voting = 'sever_game_voting'; //投票解散
}
