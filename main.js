const canvas = document.getElementById("roadCanvas");
canvas.width = 200;

const context = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(Math.floor(road.laneCount / 2)), 100, 30, 50, 2, 1.5, 0.015, 0.2, 0.05);

animate();

function animate()
{
    car.update();
    canvas.height = window.innerHeight;
    context.save();
    context.translate(0, -car.y + canvas.height * 0.75);
    road.draw(context);
    car.draw(context);
    context.restore();
    requestAnimationFrame(animate);
}
