objTypes["pointSource"] = {
	gen_rays: function (p1, p2, p3, rayNr) {
		let rays = [];
		const angle = graphs.get_angle(p3, p1, p2);

		for (let i = 0; i < rayNr; i++) {
			let p = graphs.rotate_point(p2, p1, (i * angle) / (rayNr - 1));
			rays.push(graphs.ray(p1, p));
		}

		console.log(rays);
		return rays;
	},

	create: function (p1, p2, p3, rayNr = 2, uid = uidGen(), track_deflection = false) {
		return {
			type: "pointSource",
			p1: p1,
			p2: p2,
			p3: p3,
			rayNr: rayNr,
			rays: this.gen_rays(p1, p2, p3, rayNr),
			track_deflection: track_deflection,
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
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 1) {
			obj.p1.x += dx;
			obj.p1.y += dy;
		} else if (selected.part == 2) {
			obj.p2.x += dx;
			obj.p2.y += dy;
		} else if (selected.part == 3) {
			obj.p3.x += dx;
			obj.p3.y += dy;
		}

		obj.rays = this.gen_rays(obj.p1, obj.p2, obj.p3, obj.rayNr);
	},

	draw: function (obj) {
		angle2 = Math.atan2(obj.p2.y - obj.p1.y, obj.p2.x - obj.p1.x);
		angle3 = Math.atan2(obj.p3.y - obj.p1.y, obj.p3.x - obj.p1.x);

		artist.draw_control_point("hand", obj.p2.x, obj.p2.y, angle2);
		artist.draw_control_point("hand", obj.p3.x, obj.p3.y, angle3);
		artist.draw_control_point("point", obj.p1.x, obj.p1.y);
	},
};
