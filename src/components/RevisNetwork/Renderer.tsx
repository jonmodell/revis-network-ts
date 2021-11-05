/* eslint-disable no-param-reassign, no-unused-expressions, no-undef */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ZoomControls, HoverPopup } from "./components";
import { ActionLayer, EditLayer } from "./renderingLayers";
import { RevisNode, RevisEdge } from "./components";
import { RendererProps, DrawingBounds, PanScaleState, ShapeDrawingFunction, NodeDrawingFunction, RevisShapeDefinition } from "./types";
import { inViewPort } from "./util";

const MS_PER_RENDER = 30;

const Container = styled.div`
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  canvas {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &:focus {
      outline: none;
    }

    &.editing {
      background: rgba(250, 250, 250, 0.3);
    }
  }
  .controls {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 39px;

    .control-button {
      position: relative;
      height: 36px;
      width: 36px;
      opacity: 0.7;
      &:hover {
        opacity: 0.9;
      }
    }
    button {
      background: none;
      padding: 0;
      margin: 1px 0;
      border: none;
      &:focus {
        outline: 0;
      }
    }
  }
  .node-detail {
    display: block;
    position: relative;
  }
`;

const DEFAULT_SHAPE_STYLE = {
  fill: "#ffffff",
  stroke: "#333333",
  lineWidth: 2,
  font: "16px lato, Arial",
};

const Renderer = (props: RendererProps) => {
  const nodesRef = React.createRef<HTMLCanvasElement>();
  const edgesRef = React.createRef<HTMLCanvasElement>();
  const shapesRef = React.createRef<HTMLCanvasElement>();
  const containerRef = React.createRef<HTMLDivElement>();
  const hoverRef = React.createRef<HTMLCanvasElement>();

  let lastFrameTime: number = 0;
  let animRequest: number = 0;
  let lastScale = null;
  let lastRollOver = props.rolloverState;
  let lastScreen = null;
  let lastOptions = null;
  const [dirty, setDirty] = useState<boolean | null>(null);

  // loop starter hook
  useEffect(() => {
    loop();
    return () => {
      window.cancelAnimationFrame(animRequest);
    };
  });

  // sets dirty === true whenever the props change
  useEffect(() => { 
    setDirty(true);
  }, [props])

  // drawing hook
  const draw = () => {
    const ndf = props.nodeDrawingFunction || null;
    const sdf = props.shapeDrawingFunction || null;
    // shapes
    drawShapes(props.shapes, shapesRef, sdf);
    // edges
    drawObjects(props.edges.values(), edgesRef, null);
    // nodes
    drawObjects(props.nodes.values(), nodesRef, ndf);

    // draw boundaires for debugging
    // this.drawBounds(props.bounds, shapesRef, props.panScaleState);
  };

  const loop = (elapsedTime = 0) => {
    // calculate the delta since the last frame
    const delta = elapsedTime - (lastFrameTime || 0);
    const { handlers } = props;

    // queue up an rAF draw call
    const lp = loop;
    animRequest = window.requestAnimationFrame(lp);

    // if we *don't* already have a first frame, and the
    // delta <  milliseconds per render, don't do anything and return
    if (lastFrameTime && delta < MS_PER_RENDER) {
      return;
    }

    // capture the last frame draw time so we can work out a delta next time.
    lastFrameTime = elapsedTime;

    handlers && handlers("tick");

    // now do the frame update and render work
    const ps = props.panScaleState;
    const is = props.interactionState;
    if (dirty || is.action || ps.destinationPan || ps.destinationScale) {
      draw();
      setDirty(false);
    }
  };

  /** when props updated, we set dirty to true - replace with effect 
  componentDidUpdate() {
    this.dirty = true;
  }
  */

  /**
   * @description - draw a rectangle with the given bounds
   * @param bounds { minX, minY, width, height } - the bounds of the area to draw
   * @param shapesRef HTMLCanvasElement - the canvas to draw on
   * @param panScaleState { pan, scale } - the pan and scale state
   * @returns boolean - true if the bounds are visible
   */
  const drawBounds = (
    bounds: DrawingBounds,
    shapesRef: React.RefObject<HTMLCanvasElement>,
    panScaleState: PanScaleState
  ) => {
    if (!bounds || !shapesRef.current) return false;
    const ctx: CanvasRenderingContext2D | null = shapesRef.current.getContext("2d");
    const { scale, pan } = panScaleState;
    ctx!.save();
    //   ctx.clearRect(0, 0, width, height);
    ctx!.transform(scale, 0, 0, scale, pan.x, pan.y);
    // draw
    ctx!.fillStyle = "rgba(0,0,0,0.2)";
    ctx!.strokeStyle = "#222222";
    ctx!.beginPath();
    ctx!.fillRect(bounds.minX, bounds.minY, bounds.width, bounds.height);
    ctx!.closePath();
    ctx!.stroke();
    ctx!.restore();
    return true;
  };

  const drawShapes = (items: RevisShapeDefinition[] | Map<string, RevisShapeDefinition>, ref: React.RefObject<HTMLCanvasElement>, drawingFunction: ShapeDrawingFunction | null) => {
    if (!items || !ref.current) return false;
    const ctx = ref.current!.getContext("2d");
    const { panScaleState, screen, images } = props;
    const { scale, pan } = panScaleState;
    const { width, height } = screen;
    ctx!.save();
    ctx!.clearRect(0, 0, width, height);
    ctx!.transform(scale, 0, 0, scale, pan.x, pan.y);
    items.forEach((i) => {
      if (i.visible !== false) {
        const style = { ...DEFAULT_SHAPE_STYLE, ...(i.style || {}) };
        // draw
        ctx!.save();
        ctx!.translate(i.x, i.y);
        ctx!.lineWidth = style.lineWidth;
        ctx!.fillStyle = style.background || style.fillColor || style.fill;
        // @ts-ignore
        ctx!.strokeStyle =
          style.border || style.strokeColor || style.stroke || style.line;
        ctx!.beginPath();
        if (drawingFunction) {
          // @ts-ignore
          drawingFunction(ctx, i);
        } else {
          ctx!.fillRect(0, 0, i.width, i.height);
        }

        if (i.shape && i.shape !== "image") {
          ctx!.closePath();
          if (style && style.fill !== null) {
            ctx!.fill();
          }
          ctx!.stroke();

          // image support
        } else if (i.mapImageId || i.imageId || i.image) {
          
          const imageData =
            // @ts-ignore
            images[i.mapImageId] || images[i.imageId] || i.image;
          if (
            imageData &&
            (imageData instanceof HTMLImageElement ||
              imageData instanceof SVGImageElement ||
              imageData instanceof HTMLCanvasElement)
          ) {
            const sc = i.scale || 1;
            ctx!.drawImage(imageData, 0, 0, i.width * sc, i.height * sc);
          }
        }

        ctx!.restore();
      }
    });
    ctx!.restore();
    return true;
  };

  // TODO: could check to see if nodes are in viewport before calling render
  const drawObjects = (items: IterableIterator<any>, ref: React.RefObject<HTMLCanvasElement>, drawingFunction: NodeDrawingFunction | null) => {
    const { panScaleState, options, rolloverState, images, screen } = props;
    
    if (!items || !ref.current) return false;

    const { scale, pan } = panScaleState;
    const { width, height } = screen;
    const viewPort = {
      left: (-10 - pan.x) / scale,
      top: (-10 - pan.y) / scale,
      right: (10 + width - pan.x) / scale,
      bottom: (10 + height - pan.y) / scale,
    };

    

    const context = ref.current!.getContext("2d");
    context!.save();
    // clear
    context!.clearRect(0, 0, width, height);
    context!.transform(scale, 0, 0, scale, pan.x, pan.y);
    const st = {
      ...panScaleState,
      options,
      rolloverItem: rolloverState,
    };

    // @ts-ignore
    for (const item of items) {
      if (
        item.render !== undefined &&
        (ref !== nodesRef ||
          item.destination ||
          inViewPort(item, viewPort))
      ) {
        item.render(st, context, images, drawingFunction);
      }
    }
    context!.restore();
    return true;
  };

  const {
    className,
    customControls,
    screen,
    // @ts-ignore
    hoverState,
    // @ts-ignore
    clearHover,
    handlers,
    // @ts-ignore
    handleKey,
    // @ts-ignore
    handleMouse,
    // @ts-ignore
    handleMouseWheel,
    // @ts-ignore
    handleZoom,
    options,
    panScaleState,
    interactionState,
    // @ts-ignore
    uid,
    shapes,
  } = props;

  const hideControls = customControls === null;
  const { width, height } = screen;
  // console.log('renderer re-rendering ');
  return (
    <Container ref={containerRef} className={className} key={uid}>
      <>
        <canvas ref={shapesRef} width={width} height={height} tabIndex={-4} />

        <canvas ref={edgesRef} width={width} height={height} tabIndex={-3} />

        <canvas ref={nodesRef} width={width} height={height} tabIndex={-0} />

        <canvas ref={hoverRef} width={width} height={height} tabIndex={-1} />

        <EditLayer
          showMutedOverlay={options.showMutedOverlay || false}
          shapes={shapes}
          interactionState={interactionState}
          screen={screen}
          panScaleState={panScaleState}
        />

        <ActionLayer
          handlers={handlers}
          handleMouse={handleMouse}
          handleMouseWheel={handleMouseWheel}
          handleKey={handleKey}
        />
      </>

      <HoverPopup
        tracking={hoverState}
        // @ts-ignore
        options={options.hover}
        clearHover={() => clearHover()}
      />

      {!hideControls && (
        // @ts-ignore
        <ZoomControls customControls={customControls} zoom={handleZoom} />
      )}
    </Container>
  );
};

export { Renderer };
