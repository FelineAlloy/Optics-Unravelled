canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

const rect = canvas.getBoundingClientRect();

var mouseX, mouseY;

canvas.addEventListener("mousemove", function() {
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    ray.p2 = graphs.point(mouseX, mouseY);
});

var ray = graphs.ray(
    graphs.point(canvas.width/2, canvas.height/2),
    graphs.point(0, 0));

var diopter = new planeDiopter(
    graphs.point(100, canvas.height),
    graphs.point(100, 0), 
    1, 1.5);

artist.objects.push(diopter);
artist.rays.push(ray);

function animate() {
    requestAnimationFrame(animate);
    artist.clear();
    artist.draw();
}

animate();