import { useCallback, useEffect, useState } from "react";
import { clamp } from "@/utils/index";

export enum Selection {
  None = "None",
  Clicked = "Clicked",
  Dragging = "Dragging",
  Selected = "Selected",
}

const useClickToSelect = () => {
  const [node, setNode] = useState<HTMLElement>();
  const [selection, setSelection] = useState(Selection.None);
  // represent the distance the mouse has been moved horizontally and vertically.
  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 });
  // They represent the starting point position where users click on the target element.
  const [{ startX, startY }, setStartPosition] = useState({
    startX: 0,
    startY: 0,
  });
  const ref = useCallback((nodeEle: HTMLElement) => {
    setNode(nodeEle);
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    if (!node) {
      return;
    }
    setSelection(Selection.Clicked);
    const eleRect = node.getBoundingClientRect();
    // calculates the position of the mouse relative to the top-left corner of the element
    // using the `getBoundingClientRect()` method and saves it in `startX` and `startY` variables.
    const startRelativePos = {
      startX: e.clientX - eleRect.left, // width
      startY: e.clientY - eleRect.top, // height
    };
    // reset the `dx` and `dy` values in the state by calling `setOffset` with an object that contains zeros for both properties.
    // This ensures that the next time a user starts dragging our new element,
    // it starts from its original position instead of continuing from where it was left off during the previous drag movement.
    setOffset({ dx: 0, dy: 0 });
    setStartPosition(startRelativePos);

    const startPos = {
      x: e.clientX,
      y: e.clientY,
    };

    const handleMouseMove = (e: MouseEvent) => {
      setSelection(Selection.Dragging);
      let dx = e.clientX - startPos.x;
      let dy = e.clientY - startPos.y;
      const maxX = eleRect.width - startRelativePos.startX;
      const maxY = eleRect.height - startRelativePos.startY;
      dx = clamp(dx, 0, maxX);
      dy = clamp(dy, 0, maxY);
      setOffset({ dx, dy });
    };

    const handleMouseUp = () => {
      setSelection(Selection.Selected);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }
      const touch = e.touches[0];

      const eleRect = node.getBoundingClientRect();
      const startRelativePos = {
        startX: touch.clientX - eleRect.left,
        startY: touch.clientY - eleRect.top,
      };
      setOffset({ dx: 0, dy: 0 });
      setStartPosition(startRelativePos);
      const startPos = {
        x: touch.clientX,
        y: touch.clientY,
      };
      setSelection(Selection.Clicked);

      const handleTouchMove = (e: TouchEvent) => {
        if (!node) {
          return;
        }
        const touch = e.touches[0];
        let dx = touch.clientX - startPos.x;
        let dy = touch.clientY - startPos.y;
        const maxX = eleRect.width - startRelativePos.startX;
        const maxY = eleRect.height - startRelativePos.startY;
        dx = clamp(dx, 0, maxX);
        dy = clamp(dy, 0, maxY);

        setOffset({ dx, dy });
        setSelection(Selection.Dragging);
        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        setSelection(Selection.Selected);
        resetCursor();
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [node, dx, dy]
  );

  const updateCursor = () => {
    document.body.style.cursor = "crosshair";
    document.body.style.userSelect = "none";
  };

  const resetCursor = () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  };

  useEffect(() => {
    if (node) {
      node.addEventListener("mousedown", handleMouseDown);
      node.addEventListener("touchstart", handleTouchStart);
      return () => {
        node.removeEventListener("mousedown", handleMouseDown);
        node.removeEventListener("touchstart", handleTouchStart);
      };
    }
  }, [node, dx, dy]);

  return [ref, dx, dy, startX, startY, selection];
};

export default useClickToSelect;
