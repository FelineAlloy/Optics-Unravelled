objTypes["rayObject"] = {
	create: function (p1, p2) {
		return { type: "rayObject", ray: graphs.ray(p1, p2) };
	},

	// TODO: implement this
	selected: function (obj, mouse, dragginPart) {},

	draw: function (obj) {
		// //draw selectables
		// c.beginPath();
		// c.fillStyle = colors.selectables;
		// for (const item of this.selectables) {
		// 	c.arc(item.x, item.y, selectableRadius, 0, 2 * Math.PI);
		// }
		// c.fill();
	},

	// getCollision: function (ray1) {
	// };

	// getNewRay: function (ray1, colPoint) {
	// };
};
