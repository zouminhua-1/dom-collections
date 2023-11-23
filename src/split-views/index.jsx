import React, { useEffect } from "react";
import "./index.scss";

const SplitViews = () => {
  useEffect(() => {
    document.querySelectorAll(".resizer").forEach(function (ele) {
      resizable(ele);
    });
  }, []);

  function resizable(resizer) {
    function handleMouseDown(e) {
      const startPos = {
        x: e.clientX,
        y: e.clientY,
      };
      const direction = resizer.getAttribute("data-direction") || "horizontal";
      const prevSibling = resizer.previousElementSibling;
      const nextSibling = resizer.nextElementSibling;
      const prevSiblingWidth = prevSibling.getBoundingClientRect().width;
      const w = prevSibling.parentElement.getBoundingClientRect().width;
      const prevSiblingHeight = prevSibling.getBoundingClientRect().height;
      const h = prevSibling.parentElement.getBoundingClientRect().height;

      const handleMouseMove = (e) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        if (direction === "horizontal") {
          const newWidth = ((prevSiblingWidth + dx) * 100) / w;
          prevSibling.style.width = `${newWidth}%`;
        } else {
          const newHeight = ((prevSiblingHeight + dy) * 100) / h;
          prevSibling.style.height = `${newHeight}%`;
        }
        const cursor = direction === "horizontal" ? "col-resize" : "row-resize";
        resizer.style.cursor = cursor;
        document.body.style.cursor = cursor;

        prevSibling.style.userSelect = "none";
        prevSibling.style.pointerEvents = "none";

        nextSibling.style.userSelect = "none";
        nextSibling.style.pointerEvents = "none";
      };

      const handleMouseUp = (e) => {
        resizer.style.removeProperty("cursor");
        document.body.style.removeProperty("cursor");

        nextSibling.style.removeProperty("user-select");
        nextSibling.style.removeProperty("pointer-events");

        nextSibling.style.removeProperty("user-select");
        nextSibling.style.removeProperty("pointer-events");

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    resizer.addEventListener("mousedown", handleMouseDown);
  }

  return (
    <div className="split-views">
      <div className="container">
        <div className="container__left">Left</div>
        <div data-direction="horizontal" className="resizer" id="dragMe"></div>
        <div className="container__right">
          <div className="container__top">Top</div>
          <div className="resizer" data-direction="vertical"></div>
          <div className="container__bottom">Bottom</div>
        </div>
      </div>
    </div>
  );
};

export default SplitViews;
