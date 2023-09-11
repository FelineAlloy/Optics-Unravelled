
function planeMirror(point1, point2, dashLength) {
    this.l1 = graphs.line(point1, point2);
    this.dashLength = dashLength;

    // required member functions
    this.draw = function() {
        
        const distance = graphs.length_segment(this.l1);
        const numDashes = Math.floor(distance / this.dashLength);

        const dx = this.l1.p2.x - this.l1.p1.x;
        const dy = this.l1.p2.y - this.l1.p1.y;

        const lineAngle = Math.atan2(-dy, -dx);
        const dashAngle =  lineAngle + Math.PI / 4;

        const dxStep = dx / numDashes;
        const dyStep = dy / numDashes;

        const dxDash = this.dashLength * Math.cos(dashAngle);
        const dyDash = this.dashLength * Math.sin(dashAngle);

        c.strokeStyle = "black";
        c.lineWidth = 3;

        c.beginPath();

        c.moveTo(this.l1.p1.x, this.l1.p1.y);
        c.lineTo(this.l1.p2.x, this.l1.p2.y);

        c.stroke();
        c.lineWidth = 2;
        c.beginPath();

        c.moveTo(this.l1.p1.x, this.l1.p1.y);

        for (let i = 1; i <= numDashes; i++) {
            c.moveTo(this.l1.p1.x + i * dxStep, this.l1.p1.y + i * dyStep);
            c.lineTo(this.l1.p1.x + i * dxStep + dxDash, this.l1.p1.y + i * dyStep + dyDash);
        }

        c.stroke();
    };

    this.getCollision = function(ray1) {
        const colPoint = graphs.intersection(ray1, this.l1);
        const dist = graphs.length(ray1.p1, colPoint);
        //console.log(dist);

        if(graphs.intersection_is_on_segment(colPoint, this.l1)) {
            if(graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
                return {point: colPoint, dist: dist};
            }
        }

        colPoint.exist = false;
        return {point: colPoint, dist: dist};
    };

    this.getNewRay = function(ray1, colPoint) {

        const normal = graphs.parallel(graphs.perpendicular_bisector(this.l1), colPoint);

        let i = graphs.get_angle(ray1.p1, colPoint, normal.p2);
        let p3 = normal.p2;

        //console.log(i * 180 / Math.PI);

        // c.stroke();
        // c.beginPath();
        // c.moveTo(colPoint.x, colPoint.y);
        // c.lineTo(p3.x, p3.y);
        // c.stroke();
        // c.beginPath();

        if(Math.abs(i) >= Math.PI/2) {
            return {exist: false};
        }

        p4 = graphs.rotate_point(p3, colPoint, -i);
        const newRay = graphs.ray(colPoint, p4);

        return newRay;

    };
}