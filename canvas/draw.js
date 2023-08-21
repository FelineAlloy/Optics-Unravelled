const canvas = document.getElementById("example");
const c = canvas.getContext("2d");

var draw = {
    clear: function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
    },

    draw_ray: function(ray1) {
        c.beginPath();
        c.moveTo(ray1.p1.x, ray1.p1.y);

        var d = canvas.height*canvas.height + canvas.width*canvas.width;
        var x = (ray1.p2.x - ray1.p1.x) / graphs.length(ray1.p1, ray1.p2) * d;
        var y = (ray1.p2.y - ray1.p1.y) / graphs.length(ray1.p1, ray1.p2) * d;

        c.lineTo(ray1.p2.x, ray1.p2.y);
        c.stroke();
    }
}