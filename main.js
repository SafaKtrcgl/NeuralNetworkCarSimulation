const canvas = document.getElementById("roadCanvas");
canvas.width = 200;

const context = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(Math.floor(road.laneCount / 2)), 100, 30, 50, 2, 1.5, 0.015, 0.2, 0.05, "KEYS");
const traffic = 
[
    new Car(road.getLaneCenter(0), -100, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(road.laneCount - 1), -150, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY")
];
animate();

function animate()
{
    for(let i = 0; i < traffic.length; i++)
    {
        const otherCars = [];
        for (let j = 0; j < traffic.length; j++)
        {
            if (i == j)
            {
                continue;
            }
            
            otherCars.push(traffic[j]);
        }

        traffic[i].update(road.borders, [...otherCars, car]);
    }
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;
    context.save();
    context.translate(0, -car.y + canvas.height * 0.75);
    road.draw(context);
    for(let i = 0; i < traffic.length; i++)
    {
        traffic[i].draw(context, "yellow");
    }
    car.draw(context, "green");
    context.restore();
    requestAnimationFrame(animate);
}
