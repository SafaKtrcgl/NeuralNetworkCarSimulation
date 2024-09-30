class Sensor
{
    constructor(car, rayCount, rayLength, raySpread)
    {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;

        this.rays = [];
        this.rayData = [];
    }

    update(roadBorders, traffic)
    {
        this.#castRays(roadBorders);
        this.rayData = [];
        for(let i = 0; i < this.rays.length; i++)
        {
            this.rayData.push(this.#getData(this.rays[i], roadBorders, traffic));
        }
    }

    #getData(ray, roadBorders, traffic)
    {
        let touches = [];

        for(let i = 0; i < roadBorders.length; i++)
        {
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1])
            
            if (touch)
            {
                touches.push(touch);
            }
        }
        for(let i = 0; i < traffic.length; i++)
        {
            const poly = traffic[i].polygon;
            
            for(let j = 0; j < poly.length; j++)
            {
                const value = getIntersection
                (
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );
                if (value)
                {
                    touches.push(value);
                }
            }
        }

        if(touches.length == 0)
        {
            return null;
        }
        else
        {
            /*
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
            */
            return touches.reduce
            ((minTouch, currentTouch) => 
                currentTouch.offset < minTouch.offset ? currentTouch : minTouch
            );
        }
    }

    #castRays(roadBorders)
    {
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++)
        {
            const rayRotation = lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) + this.car.rotation;
        
            const start = {x: this.car.x, y: this.car.y};
            const end =
            {
                x: this.car.x - Math.sin(rayRotation) * this.rayLength,
                y: this.car.y - Math.cos(rayRotation) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(context)
    {
        for(let i = 0; i < this.rayCount; i++)
        {
            let end = this.rays[i][1];
            if(this.rayData[i])
            {
                end = this.rayData[i]
            }

            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "green";
            context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            context.lineTo(end.x, end.y);
            context.stroke();

            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }
    }
}