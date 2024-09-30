function lerp(pointA, pointB, percent)
{
    return pointA + (pointB - pointA) * percent;
}

function getIntersection(pointA, pointB, pointC, pointD)
{
    const tTop = (pointD.x - pointC.x) * (pointA.y - pointC.y) - (pointD.y - pointC.y) * (pointA.x - pointC.x);
    const uTop = (pointC.y - pointA.y) * (pointA.x - pointB.x) - (pointC.x - pointA.x) * (pointA.y - pointB.y);
    const bottom = (pointD.y - pointC.y) * (pointB.x - pointA.x) - (pointD.x - pointC.x) * (pointB.y - pointA.y);

    if(bottom != 0)
    {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if(t >= 0 && t <= 1 && u >= 0 && u <= 1)
        {
            return {
                x: lerp(pointA.x, pointB.x, t),
                y: lerp(pointA.y, pointB.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2)
{
    for(let i = 0; i < poly1.length; i++)
    {
        for(let j = 0; j <poly2.length; j++)
        {
            const touch = getIntersection
            (
                poly1[i], poly1[(i + 1) % poly1.length], 
                poly2[j], poly2[(j + 1) % poly2.length]
            );

            if(touch)
            {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value)
{
    const alpha = Math.abs(value);
    const R = value < 0 ? 255 : 0;
    const G = value > 0 ? 255 : 0;
    const B = 0;

    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}