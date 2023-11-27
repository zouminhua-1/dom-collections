import { HtmlHTMLAttributes, useEffect } from 'react';
import { useClickToSelect, useDraggable } from '@/hooks';
import { Selection } from '@/hooks/useClickToSelect';
import './index.scss';

type func = (...args: any[]) => void;

interface Iprops extends HtmlHTMLAttributes<HTMLDivElement> {}

const Croper = (props: Iprops) => {
  const [clickToSelectRef, dx, dy, startX, startY, selection] =
    useClickToSelect();

  const [draggableRef, dragX, dragY, setOffset] = useDraggable();

  useEffect(() => {
    setOffset({ dx: startX, dy: startY });
  }, [startX, startY]);

  return (
    <div className="image-crop-container" ref={clickToSelectRef as func}>
      {selection === Selection.Dragging && (
        <div
          className="selection"
          style={{
            width: `${dx}px`,
            height: `${dy}px`,
            transform: `translate(${startX}px, ${startY}px)`,
          }}
        ></div>
      )}
      {selection === Selection.Selected && (
        <div
          ref={draggableRef as func}
          className="draggable"
          style={{
            width: `${dx}px`,
            height: `${dy}px`,
            transform: `translate(${dragX}px, ${dragY}px)`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Croper;
