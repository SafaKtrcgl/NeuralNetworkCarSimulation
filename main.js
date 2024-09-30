const roadCanvas = document.getElementById("roadCanvas");
roadCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carContext = roadCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(roadCanvas.width / 2, roadCanvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(Math.floor(road.laneCount / 2)), 100, 30, 50, 2, 1.5, 0.015, 0.2, 0.05, "AI");
const traffic = 
[
    new Car(road.getLaneCenter(0), -100, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(road.laneCount - 1), -150, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY")
];
animate();

function animate(time)
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
    
    roadCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -car.y + roadCanvas.height * 0.75);
    road.draw(carContext);
    for(let i = 0; i < traffic.length; i++)
    {
        traffic[i].draw(carContext, "yellow");
    }
    car.draw(carContext, "green");
    carContext.restore();

    if(car.brain)
    {
        networkContext.lineDashOffset = -time / 50;
        Visualizer.drawNetwork(networkContext, car.brain)
    }
    
    requestAnimationFrame(animate);
}
