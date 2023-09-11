const graphs = {
    point: function(x, y) {return {type: 1, x: x, y: y, exist: true}},

    line: function(p1, p2) {return {type: 2, p1: p1, p2: p2, exist: true}},
    
    ray: function(p1, p2) {return {type: 3, p1: p1, p2: p2, exist: true}},
    
    segment: function(p1, p2) {return {type: 4, p1: p1, p2: p2, exist: true}},

    circle: function(c, r) {
        if(typeof r == 'object' && r.type == 1) {
            return {type: 5, c: c, r: this.segment(c, r), exist: true}
        } else {
            return {type: 5, c: c, r: r, exist: true}
        }
    },

    // dot product
    dot: function(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y; 
    },

    // cross product
    cross: function(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },

    // angle between two vectors, in the trigonometric direction (ORDER MATTERS!)
    get_angle: function(p1, p2, p3) {

        let vector1 = this.point(p1.x - p2.x, p1.y - p2.y);
        let vector2 = this.point(p3.x - p2.x, p3.y - p2.y);

        let dot = this.dot(vector1, vector2);
        let cross = this.cross(vector1, vector2);

        return Math.atan2(cross, dot);
    },

    // rotate p1 arround p2 by alpha 
    rotate_point: function(point, center, angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
    
        // Translate the point back to the origin
        const translatedX = point.x - center.x;
        const translatedY = point.y - center.y;
    
        // Rotate the point
        const rotatedX = translatedX * c + translatedY * s;
        const rotatedY = - translatedX * s + translatedY * c;
    
        // Translate the point back to its original position
        const finalX = rotatedX + center.x;
        const finalY = rotatedY + center.y;
    
        return this.point(finalX, finalY);
    },

    intersection: function(obj1, obj2) {
        // line & line
        if(1 < obj1.type && obj1.type < 5 && 1 < obj2.type && obj2.type < 5) {
            return this.intersection_2line(obj1, obj2);
        }
        // line & circle 
        else if(obj1.type == 2 && obj2.type == 5) {
            return this.intersection_line_circle(obj1, obj2);
        }
        // circle & line
        else if(obj1.type == 5 && obj2.type == 2) {
            return this.intersection_line_circle(obj2, obj1);
        }
    },

    intersection_2line: function(l1, l2) {
        const A = l1.p2.x * l1.p1.y - l1.p1.x * l1.p2.y;
        const B = l2.p2.x * l2.p1.y - l2.p1.x * l2.p2.y;
        const xa = l1.p2.x - l1.p1.x;
        const xb = l2.p2.x - l2.p1.x;
        const ya = l1.p2.y - l1.p1.y;
        const yb = l2.p2.y - l2.p1.y;

        return graphs.point((A * xb - B * xa) / (xa * yb - xb * ya), (A * yb - B * ya) / (xa * yb - xb * ya));
    },

    intersection_line_circle: function(l1, c1) {
        const xa = l1.p2.x - l1.p1.x;
        const ya = l1.p2.y - l1.p1.y;
        const cx = c1.c.x;
        const cy = c1.c.y;
        const r_sq = (typeof c1.r == 'object') ? ((c1.r.p1.x - c1.r.p2.x) * (c1.r.p1.x - c1.r.p2.x) + (c1.r.p1.y - c1.r.p2.y) * (c1.r.p1.y - c1.r.p2.y)) : (c1.r * c1.r);

        const l = Math.sqrt(xa*xa + ya*ya);
        const ux = xa / l;
        const uy = ya / l;

        const cu = ((cx - l1.p1.x) * ux + (cy - l1.p1.y) * uy);
        const px = l1.p1.x + cu * ux;
        const py = l1.p1.y + cu * uy;


        const d = Math.sqrt(r_sq - (px - cx) * (px - cx) - (py - cy) * (py - cy));

        let ret = [];
        ret[1] = graphs.point(px + ux * d, py + uy * d);
        ret[2] = graphs.point(px - ux * d, py - uy * d);

        return ret;
    },

    intersection_is_on_ray: function(p1, r1) {
        return (p1.x - r1.p1.x) * (r1.p2.x - r1.p1.x) + (p1.y - r1.p1.y) * (r1.p2.y - r1.p1.y) >= 0;
    },

    intersection_is_on_segment: function(p1, s1) {
        return (p1.x - s1.p1.x) * (s1.p2.x - s1.p1.x) + (p1.y - s1.p1.y) * (s1.p2.y - s1.p1.y) >= 0 && (p1.x - s1.p2.x) * (s1.p1.x - s1.p2.x) + (p1.y - s1.p2.y) * (s1.p1.y - s1.p2.y) >= 0;
    },

    // lenght of a segment
    length_segment: function(seg) {
        return Math.sqrt(this.length_segment_squared(seg));
    },

    length_segment_squared: function(seg) {
        return this.length_squared(seg.p1, seg.p2);
    },

    // distance between two points
    length: function(p1, p2) {
        return Math.sqrt(this.length_squared(p1, p2));
    },

    length_squared: function(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    },

    // Geometric constructions

    midpoint: function(l1) {
        const nx = (l1.p1.x + l1.p2.x) * 0.5;
        const ny = (l1.p1.y + l1.p2.y) * 0.5;
        return graphs.point(nx, ny);
    },

    midpoint_points: function(p1, p2) {
        const nx = (p1.x + p2.x) * 0.5;
        const ny = (p1.y + p2.y) * 0.5;
        return graphs.point(nx, ny);
    },

    perpendicular_bisector: function(l1) {
        return graphs.line(
            graphs.point(
              (-l1.p1.y + l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
              (l1.p1.x - l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
            ),
            graphs.point(
              (l1.p1.y - l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
              (-l1.p1.x + l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
            )
          );
    },

    addPointAlongSegment: function(startPoint, endPoint, distanceFromEdge) {
        const segmentVector = this.point(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        const segmentLength = this.length(startPoint, endPoint);
        
        const normalizedVector = this.point(segmentVector.x / segmentLength, segmentVector.y / segmentLength);
        
        const offset = this.point(normalizedVector.x * distanceFromEdge, normalizedVector.y * distanceFromEdge);
        
        const pointAlongSegment = this.point(startPoint.x + offset.x, startPoint.y + offset.y);
        
        return pointAlongSegment;
    },

    // Get the line though p1 and parallel to l1.
    parallel: function(l1, p1) {
        const dx = l1.p2.x - l1.p1.x;
        const dy = l1.p2.y - l1.p1.y;
        return graphs.line(graphs.point(p1.x - dx, p1.y - dy), graphs.point(p1.x + dx, p1.y + dy));
    }
}