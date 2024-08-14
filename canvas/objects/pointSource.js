objTypes["pointSource"] = {
	get_rays: function (obj) {
		let rays = [];
		const angle = graphs.get_angle(obj.p3, obj.p1, obj.p2);

		for (let i = 0; i < obj.rayNr; i++) {
			let p = graphs.rotate_point(obj.p2, obj.p1, (i * angle) / (obj.rayNr - 1));
			rays.push(graphs.ray(obj.p1, p));
		}

		return rays;
	},

	create: function (
		p1,
		p2,
		p3,
		rayNr = 2,
		track_deflection = false,
		track_extended = false,
		uid = uidGen()
	) {
		// track_deflection is not supported for pointSource
		return {
			type: "pointSource",
			p1: p1,
			p2: p2,
			p3: p3,
			rayNr: rayNr,
			track_deflection: track_deflection,
			track_extended: track_extended,
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.p1) &&
			graphs.length_squared(mouse, obj.p1) <= graphs.length_squared(mouse, obj.p2)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.p2)) {
			selected.part = 2;
			return true;
		}
		if (mouseOnPoint(mouse, obj.p3)) {
			selected.part = 3;
			return true;
		}
		if (
			mouseOnSegment(mouse, graphs.segment(obj.p1, obj.p2)) ||
			mouseOnSegment(mouse, graphs.segment(obj.p1, obj.p3))
		) {
			selected.part = 0;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 0) {
			obj.p1.x += dx;
			obj.p1.y += dy;
			obj.p2.x += dx;
			obj.p2.y += dy;
			obj.p3.x += dx;
			obj.p3.y += dy;
		} else if (selected.part == 1) {
			obj.p1.x += dx;
			obj.p1.y += dy;
		} else if (selected.part == 2) {
			obj.p2.x += dx;
			obj.p2.y += dy;
		} else if (selected.part == 3) {
			obj.p3.x += dx;
			obj.p3.y += dy;
		}
	},

	draw: function (obj) {
		angle2 = Math.atan2(obj.p2.y - obj.p1.y, obj.p2.x - obj.p1.x);
		angle3 = Math.atan2(obj.p3.y - obj.p1.y, obj.p3.x - obj.p1.x);

		artist.draw_control_point("hand", obj.p2.x, obj.p2.y, angle2);
		artist.draw_control_point("hand", obj.p3.x, obj.p3.y, angle3);
		artist.draw_control_point("point", obj.p1.x, obj.p1.y);
	},
};
