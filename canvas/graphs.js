var graphs = {
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

    intersection: function(obj1, obj2) {
        // line & line
        if(obj1.type == 2 && obj2.type == 2) {
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
        var A = l1.p2.x * l1.p1.y - l1.p1.x * l1.p2.y;
        var B = l2.p2.x * l2.p1.y - l2.p1.x * l2.p2.y;
        var xa = l1.p2.x - l1.p1.x;
        var xb = l2.p2.x - l2.p1.x;
        var ya = l1.p2.y - l1.p1.y;
        var yb = l2.p2.y - l2.p1.y;

        return graphs.point((A * xb - B * xa) / (xa * yb - xb * ya), (A * yb - B * ya) / (xa * yb - xb * ya));
    },

    intersection_line_circle: function(l1, c1) {
        var xa = l1.p2.x - l1.p1.x;
        var ya = l1.p2.y - l1.p1.y;
        var cx = c1.c.x;
        var cy = c1.c.y;
        var r_sq = (typeof c1.r == 'object') ? ((c1.r.p1.x - c1.r.p2.x) * (c1.r.p1.x - c1.r.p2.x) + (c1.r.p1.y - c1.r.p2.y) * (c1.r.p1.y - c1.r.p2.y)) : (c1.r * c1.r);

        var l = Math.sqrt(xa*xa + ya*ya);
        var ux = xa / l;
        var uy = ya / l;

        var cu = ((cx - l1.p1.x) * ux + (cy - l1.p1.y) * uy);
        var px = l1.p1.x + cu * ux;
        var py = l1.p1.y + cu * uy;


        var d = Math.sqrt(r_sq - (px - cx) * (px - cx) - (py - cy) * (py - cy));

        var ret = [];
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
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    },

    // Geometric constructions

    midpoint: function(l1) {
        var nx = (l1.p1.x + l1.p2.x) * 0.5;
        var ny = (l1.p1.y + l1.p2.y) * 0.5;
        return graphs.point(nx, ny);
    },

    midpoint_points: function(p1, p2) {
        var nx = (p1.x + p2.x) * 0.5;
        var ny = (p1.y + p2.y) * 0.5;
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

    // Get the line though p1 and parallel to l1.
    parallel: function(l1, p1) {
        var dx = l1.p2.x - l1.p1.x;
        var dy = l1.p2.y - l1.p1.y;
        return graphs.line(p1, graphs.point(p1.x + dx, p1.y + dy));
    }
}