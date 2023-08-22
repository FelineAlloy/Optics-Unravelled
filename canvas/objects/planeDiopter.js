
function planeDiopter(point1, point2, n1, n2) {

    this.l1 = {type: 2, p1: point1, p2: point2, exist: true};
    this.n1 = n1;
    this.n2 = n2;

    // required member functions
    this.draw = function() {};
    this.getCollision = function(ray1) {
        
        let line1 = ray1;
        line1.type = 2;
        let colPoint = graphs.intersection(line1, this.l1);

        if(graphs.intersection_is_on_ray(colPoint, ray1))
        {
            let normal = graphs.perpendicular_bisector(this.l1);

            let p0 = graphs.intersection(normal, line1)
            let p1 = {type: 1, x: normal.p1.x - p0.x, y: normal.p1.y - p0.y, exist: true};
            let p2 = {type: 1, x: line1.p1.x - p0.x, y: line1.p1.y - p0.y, exist: true};

            let i = Math.abs(graphs.cross(p1, p2) / graphs.length(p0, p1) / graphs.length(p0, p2));
            let r = i * n1 / n2;

            let newRay = graphs.ray(
                colPoint,
                graphs.point(0, 0)); //find a way of calculating this using r

            return {point: colPoint, ray: newRay}
        } else {

            colPoint.exist = false;
            return {point: colPoint, ray: {}};
        }

    };
}