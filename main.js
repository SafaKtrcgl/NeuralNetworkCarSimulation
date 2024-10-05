const roadCanvas = document.getElementById("roadCanvas");
roadCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carContext = roadCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(roadCanvas.width / 2, roadCanvas.width * 0.9, 3);

const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];
let bestModel = localStorage.getItem("bestModel");
if(bestModel)
{
    for(let i = 0; i < cars.length; i++)
    {
        cars[i].brain = JSON.parse(bestModel)
        if(i != 0)
        {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = 
[
    new Car(road.getLaneCenter(0), -350, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(0), -650, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(0), -800, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),

    new Car(road.getLaneCenter(1), -100, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(1), -500, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(1), -800, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(1), -1200, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),

    new Car(road.getLaneCenter(2), -350, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(2), -650, 30, 50, 1, 0.5, 0.01, 0.1, 0.05, "DUMMY"),
    new Car(road.getLaneCenter(2), -1200, 30, 50, 1.25, 0.5, 0.01, 0.1, 0.05, "DUMMY"),

];
animate();

function saveModel()
{
    localStorage.setItem("bestModel", JSON.stringify(bestCar.brain));
}

function discardModel()
{
    localStorage.removeItem("bestModel");
}

function generateCars(N)
{
    const cars = [];
    for(let i = 0; i < N; i++)
    {
        cars.push(new Car(road.getLaneCenter(Math.floor(road.laneCount / 2)), 100, 30, 50, 2, 1.5, 0.015, 0.2, 0.05, "AI"));
    }

    return cars;
}

function animate(time)
{
    for(let i = 0; i < traffic.length; i++)
    {
        /*const otherCars = [];
        for (let j = 0; j < traffic.length; j++)
        {
            if (i == j)
            {
                continue;
            }
            
            otherCars.push(traffic[j]);
        }

        traffic[i].update(road.borders, [...otherCars, car]);
        */
       traffic[i].update(road.borders, []);
    }

    for(let i = 0; i < cars.length; i++)
    {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
    
    roadCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -bestCar.y + roadCanvas.height * 0.75);

    road.draw(carContext);
    
    for(let i = 0; i < traffic.length; i++)
    {
        traffic[i].draw(carContext, "yellow");
    }
    
    carContext.globalAlpha = 0.2;
    for(let i = 1; i < cars.length; i++)
    {
        cars[i].draw(carContext, "green");
    }
    carContext.globalAlpha = 1;
    bestCar.draw(carContext, "green", true);

    carContext.restore();

    if(bestCar.brain)
    {
        networkContext.lineDashOffset = -time / 50;
        Visualizer.drawNetwork(networkContext, bestCar.brain)
    }
    
    requestAnimationFrame(animate);
}
