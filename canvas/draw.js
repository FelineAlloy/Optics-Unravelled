const canvas = document.getElementById("example");
const c = canvas.getContext("2d");

var artist = {

    // Arrayes for objects to be drawn

    objects: [],

    rays: [], // the light sources

    drawBufffer: [], // all the rays forwhich I still need to check collisions before drawing

    // Drawing functions

    clear: function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
    },

    draw_segment: function(seg1) {
        c.moveTo(seg1.p1.x, seg1.p1.y);
        c.lineTo(seg1.p2.x, seg1.p2.y);
    },

    draw_ray: function(ray1) {
        c.moveTo(ray1.p1.x, ray1.p1.y);

        var d = canvas.height*canvas.height + canvas.width*canvas.width;
        var x = (ray1.p2.x - ray1.p1.x) / graphs.length(ray1.p1, ray1.p2) * d;
        var y = (ray1.p2.y - ray1.p1.y) / graphs.length(ray1.p1, ray1.p2) * d;

        c.lineTo(x, y);
    },

    draw: function() {

        for(const obj of artist.objects) {
            obj.draw(); //draw the object
        }

        // since ik rays will only use stroke, i group them toghether.
        c.strokeStyle = "red";
        c.lineWidth = 3;

        c.beginPath();

        for(const ray of artist.rays) {
            artist.drawBufffer.push(ray);
        }

        for(const ray of artist.drawBufffer) {
            var colPoint = {type: 1, x: -1, y: -1, exist: false};
            var newRay;
            var minDist = 1e9;
            for(const obj of artist.objects) {
                //get the nearest collision point between the ray and a part of the object
                // this should return two things:
                // 1. the point where the collision happend
                // 2. a new ray to be added to rays[] which represents the new light direction

                var {point: colPoint_tmp, ray: newRay_tmp} = obj.getCollision(ray);

                console.log(colPoint_tmp)

                if(colPoint_tmp.exist) {
                    var dist = graphs.length(ray.p1, colPoint_tmp);

                    // only take into consideration the closest collision
                    if(dist < minDist) {
                        minDist = dist;
                        colPoint = colPoint_tmp;
                        newRay = newRay_tmp;
                    }
                }
            }

            if(colPoint.exist) {
                console.log("yes");
                artist.draw_segment(graphs.segment(ray.p1, colPoint));
                //if(newRay.exist) {artist.drawBufffer.push(newRay);}
            } else {
                console.log("no");
                artist.draw_ray(ray);
            }
        }

        c.stroke();
    }
}