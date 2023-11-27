import React from 'react';
import useResizeable from '@/hooks/useResizable';
import './index.scss';

const ResizeElement = () => {
  const [resizableRef] = useResizeable();
  return (
    <div className="resize-wrapper">
      <div ref={resizableRef as RefFunc} className="resizable">
        <div className="resizer resizer--r"></div>
        <div className="resizer resizer--b"></div>
      </div>
    </div>
  );
};

export default ResizeElement;
