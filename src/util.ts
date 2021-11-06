import { Edge, Node, RevisNode } from "./components";
import { RevisOptions } from "./types";

const SCREEN_PAN_MARGIN = 35;
const ZOOM_FACTOR = 0.002;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;

// if we are dragging off screen, pan with the edges of the screen
// the screenSettings.screenPan setting changes the pan by that amount during the ReVisNetwork.draw function
export function getScreenEdgePan(sc: { width?: number | undefined; height?: number | undefined; ratio?: number; boundingRect: any; }, e: { clientX: number; clientY: number; }) {
  const br = sc.boundingRect;
  const d = SCREEN_PAN_MARGIN;
  const screenPan = { x: 0, y: 0 };
  // if the mouse x is less than the margin for panning, we change the screenPan
  if (e.clientX < d + br.left) {
    screenPan.x = d + br.left - e.clientX;
  } else if (e.clientX > br.width + br.left - d) {
    screenPan.x = -(d - (br.width + br.left - e.clientX));
  }

  if (e.clientY < d + br.top) {
    screenPan.y = d + br.top - e.clientY;
  } else if (e.clientY > br.height + br.top - d) {
    screenPan.y = -(d - (br.height + br.top - e.clientY));
  }
  return screenPan.x || screenPan.y ? screenPan : null;
}

// translate a node position into DOM coordinates relative to the canvas
export function getNodeScreenPos(n: { x: number; y: number; }, tracking: { pan: any; scale: any; }) {
  const { pan, scale } = tracking;
  const x = n.x * scale + pan.x;
  const y = n.y * scale + pan.y;
  return { x, y };
}

// figure out if a hover window should go left, right, above or below based on screen position
export function getHoverPos(pos: { x: any; y: any; }, screen: { width?: number | undefined; height?: number | undefined; ratio?: number; boundingRect: any; }, panScaleState: { scale: any; }, opts: RevisOptions) {
  const nodeSize = opts.nodes!.defaultSize;
  const { width, height } = screen.boundingRect;
  const { scale } = panScaleState;
  // @ts-ignore
  const nodeOffset = (nodeSize * scale) / 2;
  // @ts-ignore
  const x = pos.x > width * 0.5 ? pos.x - opts.hover.width : pos.x;
  const y =
    pos.y > height * 0.5
      // @ts-ignore
      ? pos.y - opts.hover.height - nodeOffset
      : pos.y + nodeOffset;
  return { x, y };
}

// detect node and mouse collisions for nodeClicking
export function checkNodeAtPosition(node: { bSize: number; x: number; y: number; }, position: { x: number; y: number; }) {
  const offset = node.bSize / 2;
  return (
    position.x > node.x - offset &&
    position.x < node.x + offset &&
    position.y > node.y - offset &&
    position.y < node.y + offset
  );
}

// looks through the dataset and returns a node at a given mouse position if there is one
export function getNodeAtPosition(nodes: any[] | Map<string, Node>, pos: { x: number; y: number; }) {
  // @ts-ignore
  for (const node of nodes.values()) {
    if (checkNodeAtPosition(node, pos)) {
      return node;
    }
  }
  return null;
}

// looks through the dataset and returns an edge at a given mouse position if there is one
// @ts-ignore
export function getEdgeAtPosition(edges: any[] | Map<string, Edge>, pos: any, edgeOptions) {
  // @ts-ignore
  for (const edge of edges.values()) {
    if (edge.getDistanceFrom(pos, edgeOptions) < 10) {
      return edge;
    }
  }
  return null;
}

export const getBounds = (nds = [], shps = []) => {
  const combined = [
    ...nds,
    // @ts-ignore
    ...shps.filter((s) => s && s.boundsIgnore === undefined),
  ];
  const first = combined[0];
  if (!first) {
    return { maxX: 100, minX: 0, maxY: 100, minY: 0, width: 100, height: 100 };
  }
  // @ts-ignore
  const bds = { maxX: first.x, minX: first.x, maxY: first.y, minY: first.y };
  combined.forEach((n: RevisNode) => {
    const newX = n.destination?.x || n.x || 0;
    const newY = n.destination?.y || n.y || 0;
    // @ts-ignore
    bds.maxX = Math.max(bds.maxX, newX + (n.width || n.size || 30));
    // @ts-ignore
    bds.maxY = Math.max(bds.maxY, newY + (n.height || n.size || 30));
    bds.minX = Math.min(bds.minX, newX - 30);
    bds.minY = Math.min(bds.minY, newY - 30);

    // @ts-ignore
    bds.width = bds.maxX - bds.minX;
    // @ts-ignore
    bds.height = bds.maxY - bds.minY;
  });
  return bds;
};

export const getBoundsScale = (height: number | undefined, width: number | undefined, bounds: { maxX: any; minX: any; maxY: any; minY: any; } | { maxX: number; minX: number; maxY: number; minY: number; width: number; height: number; }, opts: RevisOptions) => {
  // @ts-ignore
  const nodeSize = opts.nodes.defaultSize;
  // @ts-ignore
  const hf = height / (bounds.height + nodeSize * 2); // height factor
  // @ts-ignore
  const wf = width / (bounds.width + nodeSize * 2); // width factor
  return Math.min(hf, wf); // return the lesser of the 2
};

export function getPanScaleFromMouseWheel(
  e: MouseEvent,
  panScaleState: { scale: any; pan: any; },
  screen: { width: any; height: any; ratio?: number; boundingRect: any; },
  bounds: { maxX: any; minX: any; maxY: any; minY: any; },
  opts: RevisOptions,
) {
  const { scale, pan } = panScaleState;
  const { height, width, boundingRect } = screen;
  const boundScale = getBoundsScale(height, width, bounds, opts);
  const realMinZoom = Math.min(MIN_ZOOM, boundScale) * 0.95; // * 0.95 provides a margin
  const newScale = Math.min(
    // @ts-ignore
    Math.max(realMinZoom, scale - ZOOM_FACTOR * e.deltaY),
    MAX_ZOOM,
  );

  // raw mouse cooridnates
  const mouseX = e.clientX - boundingRect.left;
  const mouseY = e.clientY - boundingRect.top;

  // account for pan, but not scale.  pm = panMouse
  const pm = { x: mouseX - pan.x, y: mouseY - pan.y };
  const diffPt = {
    x: (pm.x * newScale - pm.x * scale) / scale,
    y: (pm.y * newScale - pm.y * scale) / scale,
  };

  // offset so the mouse stays at the center of the zoom
  const newPan = {
    x: pan.x - diffPt.x,
    y: pan.y - diffPt.y,
  };

  return { ...panScaleState, scale: newScale, pan: newPan };
}

export function getFitToScreen(bounds: { maxX: any; minX: any; maxY: any; minY: any; } | { maxX: number; minX: number; maxY: number; minY: number; width: number; height: number; }, screen: { width: any; height: any; ratio?: number; boundingRect?: DOMRect | undefined; }, padding: number | { horizontal: number; vertical: number; }, opts: RevisOptions) {
  if (!bounds) {
    return null;
  }
  // @ts-ignore
  const nodeSize = opts.nodes.defaultSize;
  // @ts-ignore
  const { horizontal, vertical } = padding;
  // @ts-ignore
  const hf = (screen.height - vertical) / (bounds.height + nodeSize * 2);
  // @ts-ignore
  const wf = (screen.width - horizontal) / (bounds.width + nodeSize * 2);
  const scale = Number(Math.min(hf, wf).toFixed(4));
  // @ts-ignore
  const x = screen.width / 2 - (bounds.width / 2 + bounds.minX) * scale;
  // @ts-ignore
  const y = screen.height / 2 - (bounds.height / 2 + bounds.minY) * scale;
  const pan = { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  return { scale, pan };
}

export const getMousePos = (e: MouseEvent, screen: { width?: number | undefined; height?: number | undefined; ratio?: number; boundingRect: any; }, panZoomState: { scale: any; pan: any; }) => {
  const { boundingRect } = screen;
  const { scale, pan } = panZoomState;
  if (!boundingRect) {
    return { x: -1000, y: -1000 };
  }
  return {
    x: (e.clientX - boundingRect.left - pan.x) / scale,
    y: (e.clientY - boundingRect.top - pan.y) / scale,
  };
};

export const getNodePositions = (nodes: any[] | Map<string, RevisNode>) => {
  const ret = {};
  // @ts-ignore
  for (const node of nodes.values()) {
    // @ts-ignore
    ret[node.id] = { x: node.x, y: node.y };
  }
  return ret;
};

const keyMap = {
  ArrowUp: '_moveUp',
  ArrowDown: '_moveDown',
  ArrowLeft: '_moveLeft',
  ArrowRight: '_moveRight',
  '[': '_zoomOut',
  ']': '_zoomIn',
  pageup: '_zoomIn',
  pagedown: '_zoomOut',
  '1': '_1',
  '2': '_2',
  '3': '_3',
  '5': '_0.5',
};

// @ts-ignore
export const getKeyAction = (key) => keyMap[key] || null;

export function addGraphEvents(canvas: { focus: () => void; addEventListener: (arg0: string, arg1: any) => void; }, scope: { handleMouse: { bind: (arg0: any, arg1: boolean) => any; }; handleMouseWheel: { bind: (arg0: any, arg1: boolean) => any; }; handleKey: { bind: (arg0: any, arg1: boolean) => any; }; }) {
  if (!canvas || !canvas.focus) return false;
  canvas.focus();
  canvas.addEventListener('dblclick', scope.handleMouse.bind(scope, false));
  canvas.addEventListener('wheel', scope.handleMouseWheel.bind(scope, false));
  canvas.addEventListener('mousedown', scope.handleMouse.bind(scope, false));
  canvas.addEventListener('mousemove', scope.handleMouse.bind(scope, false));
  canvas.addEventListener('mouseup', scope.handleMouse.bind(scope, false));
  canvas.addEventListener('mouseleave', scope.handleMouse.bind(scope, false));
  canvas.addEventListener('keydown', scope.handleKey.bind(scope, false));
  canvas.addEventListener('keyup', scope.handleKey.bind(scope, false));
  return true;
}

export function removeGraphEvents(canvas: { removeEventListener: (arg0: string, arg1: any) => void; }, scope: { handleMouse: any; handleMouseWheel: any; handleKey: any; }) {
  if (!canvas.removeEventListener) return false;
  canvas.removeEventListener('dblclick', scope.handleMouse);
  canvas.removeEventListener('wheel', scope.handleMouseWheel);
  canvas.removeEventListener('mousedown', scope.handleMouse);
  canvas.removeEventListener('mousemove', scope.handleMouse);
  canvas.removeEventListener('mouseup', scope.handleMouse);
  canvas.removeEventListener('mouseleave', scope.handleMouse);
  canvas.removeEventListener('keydown', scope.handleKey);
  canvas.removeEventListener('keyup', scope.handleKey);
  return true;
}

const checkShapeClick = (n: { noClick: any; x: undefined; y: undefined; size: undefined; width: undefined; height: undefined; }, pos: { x: number; y: number; }) => {
  if (
    n.noClick ||
    n.x === undefined ||
    n.y === undefined ||
    (n.size === undefined && n.width === undefined && n.height === undefined)
  ) {
    return false;
  }
  const bounds = {
    minX: n.x,
    maxX: n.x + (n.width || n.size),
    minY: n.y,
    maxY: n.y + (n.height || n.size),
  };
  if (
    pos.x > bounds.minX &&
    // @ts-ignore
    pos.x < bounds.maxX &&
    pos.y > bounds.minY &&
    // @ts-ignore
    pos.y < bounds.maxY
  ) {
    return true;
  }
  return false;
};

export function getShapeAtPos(shapes: string | any[] | undefined, pos: { x: number; y: number; }) {
  // @ts-ignore
  for (let i = shapes.length - 1; i >= 0; i--) {
    // @ts-ignore
    const n = shapes[i];
    const clicked = checkShapeClick(n, pos);
    if (clicked) {
      return n;
    }
  }
  return false;
}

export function inViewPort(item: { x: number; y: number; }, viewPort: { left: any; top: any; right: any; bottom: any; }) {
  return (
    viewPort &&
    item.x < viewPort.right &&
    item.x > viewPort.left &&
    item.y > viewPort.top &&
    item.y < viewPort.bottom
  );
}

const HANDLE_OFFSET = 8;
const MIN_SHAPE_SIZE = 10;

export function getHandleAtPos(item: { width: any; size: any; height: any; x: number; y: number; }, pos: { x: number; y: number; }, scale: number) {
  const itemWidth = item.width || item.size;
  const itemHeight = item.height || item.size;
  const handleSize = HANDLE_OFFSET / scale;
  const offset = handleSize * 0.5;

  // drawHandle(context, l, t, handleSize);
  // context.rect(x, y, s, s);
  const c = item.x + itemWidth / 2 - offset;
  const m = item.y + itemHeight / 2 - offset;
  const l = item.x - handleSize * 2 + offset;
  const r = item.x + itemWidth + offset;
  const t = item.y - handleSize - offset;
  const b = item.y + itemHeight + offset;
  const handles = [
    { id: 'tl', x: l, y: t, size: handleSize },
    { id: 'tc', x: c, y: t, size: handleSize },
    { id: 'tr', x: r, y: t, size: handleSize },
    { id: 'bl', x: l, y: b, size: handleSize },
    { id: 'bc', x: c, y: b, size: handleSize },
    { id: 'br', x: r, y: b, size: handleSize },
    { id: 'ml', x: l, y: m, size: handleSize },
    { id: 'mr', x: r, y: m, size: handleSize },
  ];
  const handle = getShapeAtPos(handles, pos);
  return handle?.id;
}

export function setShapeByHandleDrag(si: { width: any; size: any; height: any; y:number; x: number }, handle: any, delta: { x: any; y: any; }, ctrl: any) {
  const ret = { ...si };
  if (si && handle) {
    switch (handle) {
      case 'tl':
        ret.width = (si.width || si.size) - delta.x;
        ret.x += delta.x;
        ret.height = (si.height || si.size) - delta.y;
        ret.y += delta.y;
        break;
      case 'bl':
        ret.width = (si.width || si.size) - delta.x;
        ret.x += delta.x;
        ret.height = (si.height || si.size) + delta.y;
        break;
      case 'ml':
        ret.width = (si.width || si.size) - delta.x;
        ret.x += delta.x;
        break;
      case 'tr':
        ret.width = (si.width || si.size) + delta.x;
        ret.height = (si.height || si.size) - delta.y;
        ret.y += delta.y;
        break;
      case 'br':
        ret.width = (si.width || si.size) + delta.x;
        ret.height = (si.height || si.size) + delta.y;
        break;
      case 'mr':
        ret.width = (si.width || si.size) + delta.x;
        break;
      case 'bc':
        ret.height = (si.height || si.size) + delta.y;
        break;
      case 'tc':
        ret.height = (si.height || si.size) - delta.y;
        ret.y += delta.y;
        break;
      default:
        break;
    }
  }
  ret.width = Math.max(ret.width, MIN_SHAPE_SIZE);
  ret.height = Math.max(ret.height, MIN_SHAPE_SIZE);
  if (ctrl) {
    const smaller = Math.min(ret.width, ret.height);
    ret.height = smaller;
    ret.width = smaller;
  }
  return ret;
}
