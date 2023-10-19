const artist = {
	// Drawing functions

	clear: function () {
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = colors.background;
		c.fillRect(0, 0, canvas.width, canvas.height);
	},

	draw_segment: function (seg1) {
		c.moveTo(seg1.p1.x, seg1.p1.y);
		c.lineTo(seg1.p2.x, seg1.p2.y);
	},

	draw_ray: function (ray1) {
		c.moveTo(ray1.p1.x, ray1.p1.y);

		const d = canvas.height * canvas.height + canvas.width * canvas.width;
		const x = ((ray1.p2.x - ray1.p1.x) / graphs.length(ray1.p1, ray1.p2)) * d;
		const y = ((ray1.p2.y - ray1.p1.y) / graphs.length(ray1.p1, ray1.p2)) * d;

		c.lineTo(x, y);
	},

	draw: function (maxBounces) {
		const drawBuffer = []; // all the rays for which I still need to check collisions before drawing

		for (const obj of objects) {
			objTypes[obj.type].draw(obj); //draw the object
		}

		for (const rayObj of rays) {
			objTypes[rayObj.type].draw(rayObj);
			drawBuffer.push(rayObj.ray);
		}

		// since ik rays will only use stroke, i group them toghether.
		c.strokeStyle = colors.rays;
		c.lineWidth = 3;

		c.beginPath();

		for (const ray of drawBuffer) {
			let colPoint = { type: 1, x: -1, y: -1, exist: false };
			let colObj;
			let minDist = 1e9;

			//console.log(drawBuffer.length);
			for (const obj of objects) {
				// get the nearest VALID collision point between the ray and a part of the object
				// this should return two things:
				// 1. the point where the collision happend
				// 2. the distance between the source of the ray and the collision

				const { point: colPoint_tmp, dist: dist } = objTypes[obj.type].getCollision(
					obj,
					ray
				);
				//console.log(colPoint_tmp, dist);

				if (colPoint_tmp.exist && dist < minDist) {
					// only take into consideration the closest collision
					minDist = dist;
					colPoint = colPoint_tmp;
					colObj = obj;
				}
			}

			if (colPoint.exist) {
				artist.draw_segment(graphs.segment(ray.p1, colPoint));

				if (drawBuffer.length <= maxBounces * rays.length) {
					const newRay = objTypes[colObj.type].getNewRay(colObj, ray, colPoint);
					if (newRay.exist) {
						drawBuffer.push(newRay);
					}
				}
			} else {
				artist.draw_ray(ray);
			}
		}

		c.stroke();
	},
};
