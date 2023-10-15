function rayObject(p1, p2) {
	this.ray = graphs.ray(p1, p2);

	// selecteble objects
	this.selectables = [this.ray.p1, this.ray.p2];

	// required member functions
	this.draw = function () {
		//draw selectables
		c.beginPath();
		c.fillStyle = colors.selectables;
		for (const item of this.selectables) {
			c.arc(item.x, item.y, selectableRadius, 0, 2 * Math.PI);
		}
		c.fill();
	};

	// this.getCollision = function (ray1) {
	// };

	// this.getNewRay = function (ray1, colPoint) {
	// };
}
