objTypes["beam"] = {
	get_rays: function (obj) {
		let rays = [];
		const dist = graphs.length_segment(obj.l1) / (obj.rayNr - 1);
		const angle = Math.atan2(obj.l1.p2.y - obj.l1.p1.y, obj.l1.p2.x - obj.l1.p1.x);
		const rayAngle = Math.PI / 2 + angle;
		const distx = dist * Math.cos(angle);
		const disty = dist * Math.sin(angle);

		for (let i = 0; i < obj.rayNr; i++) {
			let p = graphs.point(obj.l1.p1.x + i * distx, obj.l1.p1.y + i * disty);
			let pp = graphs.point(p.x + dist * Math.cos(rayAngle), p.y + dist * Math.sin(rayAngle));
			rays.push(graphs.ray(p, pp));
		}

		return rays;
	},

	create: function (
		p1 = graphs.point(...reverseTransform(dispalyWidth / 2, (displayHeight * 2) / 3)),
		p2 = graphs.point(...reverseTransform(dispalyWidth / 2, displayHeight / 3)),
		rayNr = 5,
		track_deflection = false,
		track_extended = false,
		uid = uidGen()
	) {
		// track_deflection is not supported for beam
		return {
			type: "beam",
			l1: graphs.segment(p1, p2),
			rayNr: rayNr,
			track_deflection: track_deflection,
			track_extended: track_extended,
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.l1.p1) &&
			graphs.length_squared(mouse, obj.l1.p1) <= graphs.length_squared(mouse, obj.l1.p2)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.l1.p2)) {
			selected.part = 2;
			return true;
		}
		if (mouseOnSegment(mouse, obj.l1)) {
			selected.part = 0;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 0) {
			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;
			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;
		} else if (selected.part == 1) {
			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;
		} else if (selected.part == 2) {
			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;
		}
	},

	draw: function (obj) {
		const angle = Math.atan2(obj.l1.p2.y - obj.l1.p1.y, obj.l1.p2.x - obj.l1.p1.x);
		const distx = 3 * Math.cos(angle);
		const disty = 3 * Math.sin(angle);

		c.lineWidth = 5;
		c.strokeStyle = colors.objects;

		c.beginPath();
		c.moveTo(obj.l1.p1.x - distx, obj.l1.p1.y - disty);
		c.lineTo(obj.l1.p2.x + distx, obj.l1.p2.y + disty);
		c.stroke();
	},
};
