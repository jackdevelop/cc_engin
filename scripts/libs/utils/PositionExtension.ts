// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameMath } from './GameMath';

export default class PositionExtension {
	/**
	 * 获取节点的世界坐标
	 * @param node
	 */
	static get_node_world_position(node: cc.Node, pos: cc.Vec2): cc.Vec2 {
		return node.convertToWorldSpaceAR(pos || cc.Vec2.ZERO);
	}

	/**
	 *  转化世界坐标系
	 *  将 source 坐标转化为  traget 的目标坐标系
	 *  @return
	 */
	static convertToNodeSpaceAR(source, traget, x, y) {
		var newVec1 = source.parent.convertToWorldSpaceAR(cc.v2(x || 0, y || 0));
		var newVec2 = traget.convertToNodeSpaceAR(newVec1);

		return newVec2;
	}

	/**
	 *  转化本地坐标系
	 *  将 source 坐标转化为  traget 的目标坐标系
	 *  @return
	 */
	static touchLocationConvertToNodeSpaceAR(touch_location, layer) {
		if (!layer) {
			layer = cc.find('Canvas');
		}
		var location = layer.convertToNodeSpaceAR(touch_location);

		return location;
	}

	/// <summary>
	/// 给定的经度1，纬度1；经度2，纬度2. 计算2个经纬度之间的距离。
	/// </summary>
	/// <param name="lat1">经度1</param>
	/// <param name="lon1">纬度1</param>
	/// <param name="lat2">经度2</param>
	/// <param name="lon2">纬度2</param>
	/// <returns>距离（公里、千米）</returns>
	// static EARTH_RADIUS = 6371.0; //km 地球半径 平均值，千米
	// public static HaverSin(theta) {
	//   var v = Math.sin(theta / 2);
	//   return v * v;
	// }

	// public static distanceByLocation( lat1,lon1, lat2,lon2)
	// {
	//     lat1 = parseInt(lat1);
	//     lon1 = parseInt(lon1);
	//     lat2 = parseInt(lat2);
	//     lon2 = parseInt(lon2);
	//
	//
	//     if(lat1 == 0 && lon1 == 0 ){
	//         return null
	//     }else if(lat2 == 0 && lon2 == 0 ) {
	//         return null
	//     }
	//
	//
	//     //用haversine公式计算球面两点间的距离。
	//     //经纬度转换成弧度
	//     lat1 = GameMath.trans_angle_to_radian(lat1);
	//     lon1 =  GameMath.trans_angle_to_radian(lon1);
	//     lat2 =  GameMath.trans_angle_to_radian(lat2);
	//     lon2 =  GameMath.trans_angle_to_radian(lon2);
	//
	//     //差值
	//     let vLon = Math.abs(lon1 - lon2);
	//     let vLat = Math.abs(lat1 - lat2);
	//
	//     //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
	//     var h = this.HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * this.HaverSin(vLon);
	//
	//     var distance = 2 * this.EARTH_RADIUS * Math.asin(Math.sqrt(h));
	//
	//     return distance;
	// }

	// public static distanceByLocation(lat1, lng1, lat2, lng2) {
	//   lat1 = parseInt(lat1);
	//   lng1 = parseInt(lng1);
	//   lat2 = parseInt(lat2);
	//   lng2 = parseInt(lng2);

	//   if (lat1 == 0 && lng1 == 0) {
	//     return null;
	//   } else if (lat2 == 0 && lng2 == 0) {
	//     return null;
	//   }

	//   var radLat1 = (lat1 * Math.PI) / 180.0;
	//   var radLat2 = (lat2 * Math.PI) / 180.0;
	//   var a = radLat1 - radLat2;
	//   var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
	//   var s =
	//     2 *
	//     Math.asin(
	//       Math.sqrt(
	//         Math.pow(Math.sin(a / 2), 2) +
	//           Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
	//       )
	//     );
	//   s = s * 6378.137; // EARTH_RADIUS;
	//   s = Math.round(s * 10000) / 10000;
	//   return s;
	// }

	/**
	 * 获取两点之间的距离
	 *
	 * @param ax
	 * @param ay
	 * @param bx
	 * @param by
	 * @returns
	 */
	public static dist(ax, ay, bx, by) {
		var dx = bx - ax;
		var dy = by - ay;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * 计算两点之间的距离
	 * - 有开平方计算,可能会有额外的性能损耗
	 * @param p0
	 * @param p1
	 */
	public static dist_v3(p0, p1) {
		return p0.add(p1).divSelf(2);
	}

	// /**
	//  *  获取两点之间的距离
	//  * @param {*} ax
	//  */
	// static splite(p1, p2, num) {
	//   if (!num) {
	//     num = 2;
	//   }

	//   let x = (p1.x + p2.x) / num;
	//   let y = (p1.y + p2.y) / num;

	//   return cc.v2(x, y);
	// }

	// /**
	//  *  获取两点之间的距离
	//  * @param {*} ax
	//  */
	// static middle() {
	//   let winSize = cc.winSize;
	//   return cc.v2(winSize.width / 2, winSize.height / 2);
	// }

	/**
	 * 将角度转换为弧度
	 * - cc.misc.degreesToRadians()
	 * @param angle
	 */
	static trans_angle_to_radian(angle: number): number {
		return angle * (Math.PI / 180);
	}

	/**
	 * 将弧度转换为角度
	 * - cc.misc.radiansToDegrees()
	 * @param radian
	 */
	static trans_radian_to_angle(radian: number): number {
		return radian / (Math.PI / 180);
	}

	/**
	 *  算出两点的角度
	 * @param startpos
	 * @param endPos
	 * @returns
	 */
	static get_p_p_rotation(startpos: cc.Vec2, endPos: cc.Vec2) {
		let dir = endPos.sub(startpos);
		//根据朝向计算出夹角弧度
		var angle = dir.signAngle(cc.v2(1, 0));
		//将弧度转换为欧拉角
		var degree = this.trans_radian_to_angle(angle); //angle / Math.PI * 180;
		return { angle, degree };
	}

	/**
	 * -- 求圆上一个点的位置
	 * @param px
	 * @param py
	 * @param radians  弧度
	 * @param radius  半径
	 * @returns
	 */
	static pointAtCircle(px, py, radians, radius) {
		return cc.v2(
			px + Math.cos(radians) * radius,
			py + Math.sin(radians) * radius
		);
	}
}
