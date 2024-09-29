class Car
{
    constructor(x,y, width, height, maxForwardSpeed, maxReverseSpeed, rotationSpeed, acceleration, friction)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.rotation = 0;

        this.maxForwardSpeed = maxForwardSpeed;
        this.maxReverseSpeed = maxReverseSpeed;
        this.rotationSpeed = rotationSpeed;
        this.acceleration = acceleration;
        this.friction = friction;

        this.controller = new Controller();
    }

    update()
    {
        this.#move();
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
    
            if(this.speed != 0)
            {
                const flipFactor = this.speed > 0 ? 1 : -1;
    
                if(this.controller.right)
                {
                    this.rotation -= this.rotationSpeed * this.speed * flipFactor;
                }
                if(this.controller.left)
                {
                    this.rotation += this.rotationSpeed * this.speed  * flipFactor;
                }
            }
    
            this.x -= Math.sin(this.rotation) * this.speed;
            this.y -= Math.cos(this.rotation) * this.speed;
    }

    draw(context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(-this.rotation);

        context.beginPath();
        context.rect
        (
            - this.width / 2,
            - this.height / 2,
            this.width,
            this.height
        );
        context.fill();

        context.restore();
    }
}