/* Canvas resize */
function canvas_resize() {
	const t = c.getTransform();

	// Get the DPR and size of the canvas
	// const dpr = window.devicePixelRatio;
	const dpr = window.devicePixelRatio;

	// Set the "actual" size of the canvas
	canvas.width = canvas.parentElement.clientWidth * dpr;
	canvas.height = canvas.parentElement.clientHeight * dpr;

	// Scale down for smaller devices
	if (canvas.parentElement.clientWidth < 966) scale = canvas.parentElement.clientWidth / 966;

	// Scale the context to ensure correct drawing operations
	c.setTransform(dpr * scale, t.b, t.c, dpr * scale, t.e, t.f);

	// "Drawn" size of the canvas will be 100%, as set by CSS
}

// this function reverses both the matrix transform and the scaling applied to the entire canvas after.
// the second scaling is because we set canvas.width = canvas.parentElement.clientWidth * dpr. Thus, the canvas bitmap is scaled up (multiplied by 1/drp) before it is displayed.
// we need to account for this effect.
function reverseTransform(x, y) {
	const matrix = c.getTransform();
	const drp = window.devicePixelRatio;

	rev_x = (x * drp - matrix.e - y * matrix.c) / matrix.a;
	rev_y = (y * drp - matrix.f - x * matrix.b) / matrix.d;
	return [rev_x, rev_y];
}

/*
matrix @ point = transformed point
a c e     x     a*x+c*y+e
b d f  @  y  =  b*x+d*y+f
0 0 1     1     1
*/
