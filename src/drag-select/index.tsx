import React from "react";
import { useClickToSelect } from "@/hooks";
import { Selection } from "@/hooks/useClickToSelect";
import "./index.scss";

const DragSelect = () => {
  const [clickToSelectRef, dx, dy, startX, startY, selection] =
    useClickToSelect();
  return (
    <div className="drag-select">
      <div
        className="container"
        ref={clickToSelectRef as (arg: HTMLDivElement) => void}
      >
        {selection === Selection.Dragging && (
          <div
            className="selection"
            style={{
              transform: `translate(${startX}px, ${startY}px)`,
              width: `${dx}px`,
              height: `${dy}px`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DragSelect;
