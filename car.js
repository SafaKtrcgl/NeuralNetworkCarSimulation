class Car
{
    constructor(x, y, width, height, maxForwardSpeed, maxReverseSpeed, rotationSpeed, acceleration, friction, controlType)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.rotation = 0;
        this.damaged = false;

        this.maxForwardSpeed = maxForwardSpeed;
        this.maxReverseSpeed = maxReverseSpeed;
        this.rotationSpeed = rotationSpeed;
        this.acceleration = acceleration;
        this.friction = friction;

        this.polygon = this.#createPolygon();

        if(controlType == "KEYS")
        {
            this.sensor = new Sensor(this, 3, 100, Math.PI / 4);
        }

        this.controller = new Controller(controlType);
    }

    update(roadBorders, traffic)
    {
        if(this.damaged)
        {
            return;
        }
        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders, traffic);

        if(this.sensor)
        {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic)
    {
        for(let i = 0; i < roadBorders.length; i++)
        {
            if(polysIntersect(this.polygon, roadBorders[i]))
            {
                return true;
            }
        }

        for(let i = 0; i < traffic.length; i++)
        {
            if(polysIntersect(this.polygon, traffic[i].polygon))
            {
                return true;
            }
        }

        return false;
    }

    #createPolygon()
    {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push
        ({
            x: this.x - Math.sin(this.rotation - alpha) * rad,
            y: this.y - Math.cos(this.rotation - alpha) * rad
        });
        points.push
        ({
            x: this.x - Math.sin(this.rotation + alpha) * rad,
            y: this.y - Math.cos(this.rotation + alpha) * rad
        });
        points.push
        ({
            x: this.x - Math.sin(Math.PI + this.rotation - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.rotation - alpha) * rad
        });
        points.push
        ({
            x: this.x - Math.sin(Math.PI + this.rotation + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.rotation + alpha) * rad
        });

        return points;
    }

    #move()
    {
        if(this.controller.forward)
            {
                this.speed += this.acceleration;
            }
            if(this.controller.reverse)
            {
                this.speed -= this.acceleration;
            }
            
            if(this.speed > this.maxForwardSpeed)
            {
                this.speed = this.maxForwardSpeed;
            }
            if(this.speed < -this.maxReverseSpeed)
            {
                this.speed = -this.maxReverseSpeed;
            }
    
            if(this.speed > 0)
            {
                this.speed -= this.friction;
            }
            if(this.speed < 0)
            {
                this.speed += this.friction;
            }
            if(Math.abs(this.speed) < this.friction)
            {
                this.speed = 0;
            }
    
            if(this.controller.right)
            {
                this.rotation -= this.rotationSpeed * this.speed;
            }
            if(this.controller.left)
            {
                this.rotation += this.rotationSpeed * this.speed;
            }
    
            this.x -= Math.sin(this.rotation) * this.speed;
            this.y -= Math.cos(this.rotation) * this.speed;
    }

    draw(context, color)
    {
        if(this.damaged)
        {
            context.fillStyle = "black";
        }
        else
        {
            context.fillStyle = color;
        }
        context.beginPath();
        context.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i <this.polygon.length; i++)
        {
            context.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        context.fill();

        if(this.sensor)
        {
            this.sensor.draw(context);
        }
    }
}