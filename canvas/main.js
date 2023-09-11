const rect = canvas.getBoundingClientRect();

let mouseX, mouseY;

canvas.addEventListener("mousemove", function() {
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    ray.p2 = graphs.point(mouseX, mouseY);
    updateSimulation();
});

const ray = graphs.ray(
    graphs.point(canvas.width/2, canvas.height/2),
    graphs.point(0, 0));

const diopter = new planeDiopter(
    graphs.point(200, canvas.height),
    graphs.point(200, 0), 
    1, 1.5
);

const diopter2 = new planeDiopter(
    graphs.point(400, canvas.height),
    graphs.point(400, 0), 
    1.5, 1
);

const screen1 = new screen(
    graphs.point(100, canvas.height),
    graphs.point(100, 0)
);

const lens1 = new lens(
    graphs.point(500, canvas.height - 100),
    graphs.point(900, 100),
    100
);

const mirror = new planeMirror(
    graphs.point(800, 0),
    graphs.point(800, canvas.height), 
    10
);

artist.objects.push(diopter);
artist.objects.push(diopter2);
artist.objects.push(screen1);
artist.objects.push(lens1);
artist.rays.push(ray);

function updateSimulation() {
    artist.clear();
    artist.draw(100);
}

updateSimulation();