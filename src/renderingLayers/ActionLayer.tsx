import React, { useRef, useLayoutEffect, Fragment } from 'react';
import ReactResizeDetector from 'react-resize-detector';

const ActionLayer = (props: { handlers?: any; handleMouse?: any; handleMouseWheel?: any; handleKey?: any; }) => {
  const { handlers, handleMouse, handleMouseWheel, handleKey } = props;

  const actionRef = React.useRef<HTMLCanvasElement>(null);

  const onResize = () => {
    if (!actionRef?.current) {
      handlers && handlers('resize', null);
      return false;
    }

    handlers && handlers('resize', actionRef.current);

    return true;
  };

  // send the actual screen size on the first render only
  useLayoutEffect(() => {
    onResize();
  }, []);

  return (
    <>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={() => onResize()}
      />
      <canvas
        ref={actionRef}
        tabIndex={0}
        className='action-canvas'
        onWheel={handleMouseWheel}
        onMouseDown={handleMouse}
        onMouseMove={handleMouse}
        onDoubleClick={handleMouse}
        onMouseUp={handleMouse}
        onMouseLeave={handleMouse}
        onKeyDown={handleKey}
        onKeyUp={handleKey}
      />
    </>
  );
};

export default ActionLayer;
