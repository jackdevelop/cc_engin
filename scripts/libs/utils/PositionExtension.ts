









import { GameMath } from './GameMath';

export default class PositionExtension {
	
	static get_node_world_position(node: cc.Node, pos: cc.Vec2): cc.Vec2 {
		return node.convertToWorldSpaceAR(pos || cc.Vec2.ZERO);
	}

	
	static convertToNodeSpaceAR(source, traget, x, y) {
		var newVec1 = source.parent.convertToWorldSpaceAR(cc.v2(x || 0, y || 0));
		var newVec2 = traget.convertToNodeSpaceAR(newVec1);

		return newVec2;
	}

	
	static touchLocationConvertToNodeSpaceAR(touch_location, layer) {
		if (!layer) {
			layer = cc.find('Canvas');
		}
		var location = layer.convertToNodeSpaceAR(touch_location);

		return location;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	

	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	public static dist(ax, ay, bx, by) {
		var dx = bx - ax;
		var dy = by - ay;
		return Math.sqrt(dx * dx + dy * dy);
	}

	
	public static dist_v3(p0, p1) {
		return p0.add(p1).divSelf(2);
	}

	
	
	
	
	
	
	
	

	
	

	
	

	
	
	
	
	
	
	
	

	
	static trans_angle_to_radian(angle: number): number {
		return angle * (Math.PI / 180);
	}

	
	static trans_radian_to_angle(radian: number): number {
		return radian / (Math.PI / 180);
	}

	
	static get_p_p_rotation(startpos: cc.Vec2, endPos: cc.Vec2) {
		let dir = endPos.sub(startpos);
		
		var angle = dir.signAngle(cc.v2(1, 0));
		
		var degree = this.trans_radian_to_angle(angle); 
		return degree;
	}

	
	static pointAtCircle(px, py, radians, radius) {
		return cc.v2(
			px + Math.cos(radians) * radius,
			py + Math.sin(radians) * radius
		);
	}
}
