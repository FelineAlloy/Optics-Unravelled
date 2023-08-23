
function planeDiopter(point1, point2, n1, n2) {

    this.l1 = {type: 2, p1: point1, p2: point2, exist: true};
    this.n1 = n1;
    this.n2 = n2;

    // required member functions
    this.draw = function() {};
    this.getCollision = function(ray) {
        
        let ray1 = ray;
        ray1.type = 2;
        let colPoint = graphs.intersection(ray1, this.l1);

        if(graphs.intersection_is_on_ray(colPoint, ray))
        {
            let normal = graphs.parallel(graphs.perpendicular_bisector(this.l1), colPoint);

            c.stroke();
            c.beginPath();
            c.strokeStyle = "green";
            c.moveTo(normal.p1.x, normal.p1.y);
            c.lineTo(normal.p2.x, normal.p2.y);
            c.stroke();
            c.beginPath();
            c.strokeStyle = "red";


            let p1 = graphs.point(normal.p1.x - colPoint.x, normal.p1.y - colPoint.y);
            let p2 = graphs.point(ray1.p1.x - colPoint.x, ray1.p1.y - colPoint.y);

            let i = Math.asin(graphs.cross(p1, p2) / (graphs.length(colPoint, p1) * graphs.length(colPoint, p2)));
            let r = Math.asin(Math.sin(i) * n1 / n2);

            let p3 = normal.p2;
            if(graphs.dot(p1, p2) <= 0) {
                p3 = normal.p1;
            }

            console.log(p1, p2, p3);
            console.log(i, Math.asin(Math.sin(i)), r); // i isnt calculated well

            p3 = graphs.rotate_point(r, p3, colPoint);

            let newRay = graphs.ray(colPoint,p3); //find a way of calculating this using r

            return {point: colPoint, ray: newRay}
        } else {

            colPoint.exist = false;
            return {point: colPoint, ray: {}};
        }

    };
}