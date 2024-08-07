objTypes["angle"] = {
	getVariableByPath: function (obj, path) {
		const properties = path.split(".");
		let variable = obj;

		for (let prop of properties) {
			variable = variable[prop];
		}

		return variable;
	},

	getPoints: function (obj_uids, paths) {
		const points = [];
		for (let i = 0; i < 3; i++) {
			for (const obj of rays) {
				if (obj.uid == obj_uids[i]) {
					points.push(this.getVariableByPath(obj, paths[i]));
				}
			}
			for (const obj of objects) {
				if (obj.uid == obj_uids[i]) {
					points.push(this.getVariableByPath(obj, paths[i]));
				}
			}
			for (const obj of overlayBuffer) {
				if (obj.uid == obj_uids[i]) {
					points.push(this.getVariableByPath(obj, paths[i]));
				}
			}
		}
		return points;
	},

	create: function (obj_uids, paths, uid = uidGen()) {
		return { type: "angle", obj_uids, paths, uid: uid };
	},

	selected: function (obj, mouse, selected) {
		return false;
	},

	c_mousemove: function (obj, dx, dy) {},

	draw: function (obj) {
		const p = this.getPoints(obj.obj_uids, obj.paths);

		// get trig angles
		alpha1 = graphs.get_angle(p[0], p[1], graphs.point(p[1].x + 10, p[1].y));
		alpha2 = graphs.get_angle(p[2], p[1], graphs.point(p[1].x + 10, p[1].y));

		let shortestPath = Math.min(
			Math.abs(alpha1 - alpha2),
			2 * Math.PI - Math.abs(alpha1 - alpha2)
		);
		const anticlockwise = graphs.get_angle(p[0], p[1], p[2]) < 0;
		let sgn = 1;
		if (anticlockwise) sgn = -1;

		let p_text = { ...p[1] };
		p_text.x += 60;
		p_text = graphs.rotate_point(p_text, p[1], alpha1 - (sgn * shortestPath) / 2);

		c.fillStyle = colors.text;
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText(((shortestPath * 180) / Math.PI).toFixed(2).toString(), p_text.x, p_text.y);

		c.strokeStyle = colors.objects;
		c.lineWidth = 2;

		c.beginPath();
		c.arc(p[1].x, p[1].y, 30, -alpha1, -alpha1 + sgn * shortestPath, anticlockwise);
		c.stroke();
	},

	getCollision: function (obj, ray1) {
		const colPoint = { exist: false };
		return { point: colPoint, dist: -1 };
	},
};
