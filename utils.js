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