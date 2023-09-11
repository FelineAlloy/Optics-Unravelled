
function lens(point1, point2, f) {

    this.l1 = graphs.line(point1, point2);
    this.f = f;

    const normal = graphs.perpendicular_bisector(this.l1);
    const midpoint = graphs.midpoint(this.l1)
    this.fp1 = graphs.addPointAlongSegment(midpoint, normal.p1, this.f);
    this.fp2 = graphs.addPointAlongSegment(midpoint, normal.p2, this.f);

    // required member functions
    this.draw = function() {
        c.beginPath();
        
        c.strokeStyle = "black";
        c.lineWidth = 3;

        c.moveTo(this.l1.p1.x, this.l1.p1.y);
        c.lineTo(this.l1.p2.x, this.l1.p2.y);

        const sgnf = Math.sign(this.f);
        const angle = Math.atan2(this.l1.p1.y - this.l1.p2.y, this.l1.p1.x - this.l1.p2.x);

        c.moveTo(
            this.l1.p1.x - sgnf * 15 * Math.cos(angle - Math.PI/6), 
            this.l1.p1.y - sgnf * 15 * Math.sin(angle - Math.PI/6)
        );

        c.lineTo(this.l1.p1.x, this.l1.p1.y);

        c.lineTo(
            this.l1.p1.x - sgnf * 15 * Math.cos(angle + Math.PI/6), 
            this.l1.p1.y - sgnf * 15 * Math.sin(angle + Math.PI/6)
        );

        c.moveTo(
            this.l1.p2.x + sgnf * 15 * Math.cos(angle - Math.PI/6), 
            this.l1.p2.y + sgnf * 15 * Math.sin(angle - Math.PI/6)
        );

        c.lineTo(this.l1.p2.x, this.l1.p2.y);

        c.lineTo(
            this.l1.p2.x + sgnf * 15 * Math.cos(angle + Math.PI/6), 
            this.l1.p2.y + sgnf * 15 * Math.sin(angle + Math.PI/6)
        );

        c.stroke();

        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "20px Arial";
        c.fillText("f1", this.fp1.x, this.fp1.y);
        c.fillText("f2", this.fp2.x, this.fp2.y);

    };

    this.getCollision = function(ray1) {
        const colPoint = graphs.intersection(ray1, this.l1);
        const dist = graphs.length(ray1.p1, colPoint);
        //console.log(dist);

        if(graphs.intersection_is_on_segment(colPoint, this.l1) && graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
            return {point: colPoint, dist: dist};
        }

        colPoint.exist = false;
        return {point: colPoint, dist: dist};
    };

    this.getNewRay = function(ray1, colPoint) {

        const normal = graphs.parallel(graphs.perpendicular_bisector(this.l1), colPoint);
        const midpoint = graphs.midpoint(this.l1);

        let i = graphs.get_angle(ray1.p1, colPoint, normal.p1);
        let p3 = graphs.point(this.fp2.x, this.fp2.y);

        if(Math.abs(i) > Math.PI/2) {
            p3 = graphs.point(this.fp1.x, this.fp1.y);
            i = graphs.get_angle(ray1.p1, colPoint, normal.p2);
        }

        const alpha = Math.atan2(p3.y - midpoint.y, p3.x - midpoint.x);
        console.log(alpha * 180 / Math.PI);

        p3.x += Math.tan(i) * this.f * Math.sin(alpha);
        p3.y += Math.tan(i) * this.f * Math.cos(alpha);

        c.stroke();
        c.beginPath();
        
        c.arc(p3.x, p3.y, 3, 0, Math.PI*2);

        const parallel = graphs.parallel(ray1, midpoint);
        c.moveTo(parallel.p1.x, parallel.p1.y);
        c.lineTo(parallel.p2.x, parallel.p2.y);
        
        c.stroke();
        c.beginPath();

        const newRay = graphs.ray(colPoint, p3);

        return newRay;

    };
}