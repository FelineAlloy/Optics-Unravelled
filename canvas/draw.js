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

	draw_ray_dotted: function (ray1) {
		c.moveTo(ray1.p1.x, ray1.p1.y);

		const distance = graphs.length(ray1.p1, ray1.p2);
		const interval = 3; // set the interval for the dotted line

		dx = ((ray1.p2.x - ray1.p1.x) / distance) * interval;
		dy = ((ray1.p2.y - ray1.p1.y) / distance) * interval;

		for (let i = 1; i <= 100; i += 2) {
			c.moveTo(ray1.p1.x + dx * i, ray1.p1.y + dy * i);
			c.lineTo(ray1.p1.x + dx * (i + 1), ray1.p1.y + dy * (i + 1));
		}
	},

	draw_control_point: function (type, x, y, angle = 0) {
		if (type == "point") {
			c.beginPath();
			c.arc(x, y, 4.5, 0, 2 * Math.PI);
			c.fill();
		}

		if (type == "hand") {
			if (handImg.complete) {
				c.drawImage(handImg, x - 8, y - 9, 16, 18);
			}
		}

		if (type == "arrow") {
			c.beginPath();
			c.moveTo(
				x - 10 * Math.cos(angle - Math.PI / 6),
				y - 10 * Math.sin(angle - Math.PI / 6)
			);

			c.lineTo(x, y);

			c.lineTo(
				x - 10 * Math.cos(angle + Math.PI / 6),
				y - 10 * Math.sin(angle + Math.PI / 6)
			);
			c.stroke();
		}

		return;
	},

	draw: function (maxBounces) {
		const drawBuffer = []; // all the rays for which I still need to check collisions before drawing
		const drawBufferRoots = []; // a reference to the initial rayObject that generated the current ray, along with other useful info that needs to be passsed down
		overlayBuffer = []; // objects which don't interact with anything and are generated each frame
		// also used for other objects which are not drawn but need to be stored and found (ex: point objects)

		for (const obj of objects) {
			objTypes[obj.type].draw(obj); //draw the object
		}

		for (const rayObj of rays) {
			drawBuffer.push(rayObj.ray);
			drawBufferRoots.push({ ...rayObj, depth: 0 });
		}

		// since ik rays will only use stroke, i group them toghether.
		c.strokeStyle = colors.rays;
		c.lineWidth = 3;

		c.beginPath();

		for (const [i, ray] of drawBuffer.entries()) {
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

				// add the refracted/reflected ray to the draw buffer
				if (drawBuffer.length <= maxBounces * rays.length) {
					const newRay = objTypes[colObj.type].getNewRay(colObj, ray, colPoint);
					if (newRay.exist) {
						drawBuffer.push(newRay);

						if (drawBufferRoots[i].ray == ray) {
							drawBufferRoots[i]["colPoint"] = { ...colPoint };
						}
						drawBufferRoots.push({
							...drawBufferRoots[i],
							depth: drawBufferRoots[i].depth + 1,
						});
					}
				}
			} else {
				artist.draw_ray(ray);

				if (drawBufferRoots[i].track_deflection && drawBufferRoots[i].ray != ray) {
					const uid2 = uidGen();
					overlayBuffer.push(
						objTypes["rayObject_dt"].create(
							ray.p1,
							graphs.rotate_point(ray.p2, ray.p1, Math.PI),
							uid2
						)
					);

					if (drawBufferRoots[i].depth >= 2) {
						const uid3 = uidGen();
						const intersect = graphs.intersection(ray, drawBufferRoots[i].ray);
						overlayBuffer.push({ p: intersect, uid: uid3 });

						const uid1 = uidGen();
						overlayBuffer.push(
							objTypes["rayObject_dt"].create(
								drawBufferRoots[i].colPoint,
								graphs.rotate_point(
									drawBufferRoots[i].colPoint,
									intersect,
									Math.PI
								),
								uid1
							)
						);

						overlayBuffer.push(
							objTypes["angle"].create([uid1, uid3, uid2], ["ray.p2", "p", "ray.p1"]),
							uidGen()
						);
					} else {
						overlayBuffer.push(
							objTypes["angle"].create(
								[drawBufferRoots[i].uid, uid2, uid2],
								["ray.p1", "ray.p1", "ray.p2"],
								uidGen()
							)
						);
					}
				}
			}
		}

		c.stroke();

		// draw overlays: angles, construction lines etc...
		for (const obj of overlayBuffer) {
			if (obj.hasOwnProperty("type")) {
				objTypes[obj.type].draw(obj); //draw the object
			}
		}

		// draw ray control points last
		for (const rayObj of rays) {
			objTypes[rayObj.type].draw(rayObj);
		}
	},
};
