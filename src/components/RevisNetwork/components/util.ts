export function drawText(
  ctx,
  lbl,
  fill,
  fontSize,
  allowedCharacters,
  sizeFactor
) {
  const txt = typeof lbl === "string" ? lbl : JSON.stringify(lbl); // for non string labels
  ctx.fillStyle = fill;
  ctx.font = `${fontSize}px Lato, Arial`;
  ctx.textAlign = "center";
  const fitText = `${txt.substring(0, allowedCharacters)}${
    txt.length > allowedCharacters ? "…" : ""
  }`;
  ctx.fillText(fitText, 0, 0);
}

interface RevisImageDefinition {
  image?: any;
  img?: any;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  element?: HTMLImageElement | HTMLCanvasElement;
}
export function drawImage(
  ctx: CanvasRenderingContext2D,
  definition: RevisImageDefinition,
  images: { [x: string]: RevisImageDefinition },
  size: number
) {
  if (definition.image || definition.img) {
    const defImg: any = definition.image || definition.img;
    let img: any = new Image();

    // if the image is not a .svg file and it can be found by id in state.images
    if (images && typeof(defImg) === "string" && images[defImg!] !== undefined) {
      img = images[defImg!].element || images[defImg!];
      // otherwise we expect the image to be a fully loaded element
    } else if (defImg instanceof HTMLImageElement || defImg instanceof HTMLCanvasElement) {
      img = defImg;
    }

    if (img.src || img instanceof HTMLCanvasElement) {
      const imgSize = (size / 2) * ((images && images[defImg]?.scale) || 1); // image should be 50% of the node by default and 20 % from the top
      const offsetX = images[defImg].offsetX || 0;
      const offsetY = images[defImg].offsetY || 0;

      ctx.beginPath();
      const imgRatio: number = Math.round((img.height / img.width) * 100) / 100; // an attempt to keep the image ratio constant
      // save and restore are just for translations /  x and y could be used in drawing instead
      ctx.drawImage(
        img,
        size / 2 - imgSize / 2 + offsetX,
        size * 0.2 + offsetY,
        imgSize,
        imgSize * imgRatio
      );
    }
  }
}

/**
 * Calculate the distance between a point (x3,y3) and a line segment from
 * (x1,y1) to (x2,y2).
 * http://stackoverflow.com/questions/849211/shortest-distancae-between-a-point-and-a-line-segment
 */
export function getDistanceToBezierEdge(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: any,
  y3: any,
  viaX: number,
  viaY: number
) {
  // x3,y3 is the point
  let minDistance = 1e9;
  let distance;
  let i, t, x, y;
  let lastX = x1;
  let lastY = y1;
  // create 10 line segments from different sectios of the curve
  for (i = 1; i < 10; i++) {
    t = 0.1 * i;
    const tm2 = (1 - t) ** 2;
    const t2 = t ** 2;
    x = tm2 * x1 + 2 * t * (1 - t) * viaX + t2 * x2;
    y = tm2 * y1 + 2 * t * (1 - t) * viaY + t2 * y2;
    if (i > 0) {
      // test out the distance from the point to each segment and find the min
      distance = this.getDistanceToLine(lastX, lastY, x, y, x3, y3);
      minDistance = distance < minDistance ? distance : minDistance;
    }
    lastX = x;
    lastY = y;
  }
  return minDistance;
}
