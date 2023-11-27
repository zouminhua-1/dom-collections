import { clamp } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

type UseDraggableReturnType = [
  (el: HTMLElement) => void,
  number,
  number,
  React.Dispatch<React.SetStateAction<{ dx: number; dy: number }>>,
];

const useDraggable = (): UseDraggableReturnType => {
  const [node, setNode] = useState<HTMLElement>();
  const [{ dx, dy }, setOffset] = useState<{ dx: number; dy: number }>({
    dx: 0,
    dy: 0,
  });

  const ref = useCallback((el: any) => {
    setNode(el);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const startPos = {
        x: e.clientX - dx, // width
        y: e.clientY - dy, // height
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!node) return;
        const parentRect = node.parentElement?.getBoundingClientRect();
        const elRect = node.getBoundingClientRect();
        if (!parentRect) return;
        let dx = e.clientX - startPos.x;
        let dy = e.clientY - startPos.y;
        const maxX = parentRect.width - elRect.width;
        const maxY = parentRect.height - elRect.height;
        dx = clamp(dx, 0, maxX);
        dy = clamp(dy, 0, maxY);
        setOffset({ dx, dy });
        updateCursor();
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resetCursor();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [node, dx, dy],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();
      const touch = e.touches[0];

      const startPos = {
        x: touch.clientX - dx,
        y: touch.clientY - dy,
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!node) {
          return;
        }
        const touch = e.touches[0];
        const parent = node.parentElement;
        if (!parent) return;
        const parentRect = parent.getBoundingClientRect();
        const eleRect = node.getBoundingClientRect();

        let dx = touch.clientX - startPos.x;
        let dy = touch.clientY - startPos.y;
        const maxX = parentRect.width - eleRect.width;
        const maxY = parentRect.height - eleRect.height;
        dx = clamp(dx, 0, maxX);
        dy = clamp(dy, 0, maxY);

        setOffset({ dx, dy });
        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        resetCursor();
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [node, dx, dy],
  );

  const updateCursor = () => {
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
  };

  const resetCursor = () => {
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  };

  useEffect(() => {
    if (node) {
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  }, [node, dx, dy]);

  useEffect(() => {
    if (!node) {
      return;
    }
    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('touchstart', handleTouchStart);
    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
    };
  }, [node, dx, dy]);

  return [ref, dx, dy, setOffset];
};

export default useDraggable;
