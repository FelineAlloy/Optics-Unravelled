const canvas = document.getElementById("example");
const c = canvas.getContext("2d");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

const artist = {

    // Arrayes for objects to be drawn

    objects: [],

    rays: [], // the light sources

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

        const d = canvas.height*canvas.height + canvas.width*canvas.width;
        const x = (ray1.p2.x - ray1.p1.x) / graphs.length(ray1.p1, ray1.p2) * d;
        const y = (ray1.p2.y - ray1.p1.y) / graphs.length(ray1.p1, ray1.p2) * d;

        c.lineTo(x, y);
    },

    draw: function(maxBounces) {

        const drawBuffer = []; // all the rays for which I still need to check collisions before drawing

        for(const obj of artist.objects) {
            obj.draw(); //draw the object
        }

        // since ik rays will only use stroke, i group them toghether.
        c.strokeStyle = "red";
        c.lineWidth = 3;

        c.beginPath();

        for(const ray of artist.rays) {
            drawBuffer.push(ray);
        }

        for(const ray of drawBuffer) {
            let colPoint = {type: 1, x: -1, y: -1, exist: false};
            let colObj;
            let minDist = 1e9;

            //console.log(drawBuffer.length);
            for(const obj of artist.objects) {
                // get the nearest VALID collision point between the ray and a part of the object
                // this should return two things:
                // 1. the point where the collision happend
                // 2. the distance between the source of the ray and the collision

                const {point: colPoint_tmp, dist: dist} = obj.getCollision(ray);
                //console.log(colPoint_tmp, dist);
                
                if(colPoint_tmp.exist && dist < minDist) {
                    // only take into consideration the closest collision
                    minDist = dist;
                    colPoint = colPoint_tmp;
                    colObj = obj;
                }
            }

            if(colPoint.exist) {
                artist.draw_segment(graphs.segment(ray.p1, colPoint));

                if(drawBuffer.length <= maxBounces * artist.rays.length) {
                    const newRay = colObj.getNewRay(ray, colPoint);
                    if(newRay.exist) {
                        drawBuffer.push(newRay);
                    }
                }
            } else {
                artist.draw_ray(ray);
            }
        }

        c.stroke();
    }
}