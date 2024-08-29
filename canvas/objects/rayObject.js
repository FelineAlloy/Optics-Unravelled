objTypes["rayObject"] = {
	create: function (
		p1 = graphs.point(...reverseTransform(dispalyWidth / 3, displayHeight / 2)),
		p2 = graphs.point(...reverseTransform((dispalyWidth * 2) / 3, displayHeight / 2)),
		track_deflection = false,
		track_extended = false,
		uid = uidGen()
	) {
		return {
			type: "rayObject",
			ray: graphs.ray(p1, p2),
			track_deflection: track_deflection,
			track_extended: track_extended,
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.ray.p1) &&
			graphs.length_squared(mouse, obj.ray.p1) <= graphs.length_squared(mouse, obj.ray.p2)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.ray.p2)) {
			selected.part = 2;
			return true;
		}
		if (mouseOnSegment(mouse, obj.ray)) {
			selected.part = 0;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 0) {
			obj.ray.p1.x += dx;
			obj.ray.p1.y += dy;
			obj.ray.p2.x += dx;
			obj.ray.p2.y += dy;
		} else if (selected.part == 1) {
			obj.ray.p1.x += dx;
			obj.ray.p1.y += dy;
		} else if (selected.part == 2) {
			obj.ray.p2.x += dx;
			obj.ray.p2.y += dy;
		}
	},

	draw: function (obj) {
		const angle = Math.atan2(obj.ray.p2.y - obj.ray.p1.y, obj.ray.p2.x - obj.ray.p1.x);

		artist.draw_control_point("hand", obj.ray.p2.x, obj.ray.p2.y, angle);

		artist.draw_control_point("point", obj.ray.p1.x, obj.ray.p1.y);
	},
};

objTypes["rayObject_dt"] = {
	create: function (p1, p2, uid) {
		return { type: "rayObject_dt", ray: graphs.ray(p1, p2), uid: uid };
	},

	selected: function (obj, mouse, selected) {
		return false;
	},

	c_mousemove: function (obj, dx, dy) {},

	draw: function (obj) {
		artist.draw_ray_dotted(obj.ray);
	},
};
