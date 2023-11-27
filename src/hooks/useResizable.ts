import { clamp } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

enum Direction {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}

type UseResizeableReturnType = [(el: HTMLElement) => void];

const useResizeable = (): UseResizeableReturnType => {
  const [node, setNode] = useState<HTMLElement>();

  const ref = useCallback((el: any) => {
    setNode(el);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (!node) {
        return;
      }
      // 方向
      const direction = (e.target as any).classList.contains('resizer--r')
        ? Direction.Horizontal
        : Direction.Vertical;
      // 按下位置
      const startPos = {
        x: e.clientX,
        y: e.clientY,
      };
      // 元素宽高
      const styles = window.getComputedStyle(node);
      const w = parseInt(styles.width, 10);
      const h = parseInt(styles.height, 10);

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        const parent = node.parentElement as HTMLDivElement;
        const parentRect = parent.getBoundingClientRect();
        const eleRect = node.getBoundingClientRect();
        const newWidth = clamp(
          w + dx,
          0,
          parentRect.width - (eleRect.left - parentRect.left),
        );
        const newHeight = clamp(
          h + dy,
          0,
          parentRect.height - (eleRect.top - parentRect.top),
        );

        // 改变元素宽高
        direction === Direction.Horizontal
          ? (node.style.width = `${newWidth}px`)
          : (node.style.height = `${newHeight}px`);

        updateCursor(direction);
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resetCursor();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [node],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();
      if (!node) {
        return;
      }
      const direction = (e.target as any).classList.contains('resizer--r')
        ? Direction.Horizontal
        : Direction.Vertical;
      const touch = e.touches[0];
      const startPos = {
        x: touch.clientX,
        y: touch.clientY,
      };
      const styles = window.getComputedStyle(node);
      const w = parseInt(styles.width, 10);
      const h = parseInt(styles.height, 10);

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const dy = touch.clientY - startPos.y;

        const parent = node.parentElement as HTMLDivElement;
        const parentRect = parent.getBoundingClientRect();
        const eleRect = node.getBoundingClientRect();
        const newWidth = clamp(
          w + dx,
          0,
          parentRect.width - (eleRect.left - parentRect.left),
        );
        const newHeight = clamp(
          h + dy,
          0,
          parentRect.height - (eleRect.top - parentRect.top),
        );

        // 改变元素宽高
        direction === Direction.Horizontal
          ? (node.style.width = `${newWidth}px`)
          : (node.style.height = `${newHeight}px`);
        updateCursor(direction);
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        resetCursor();
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [node],
  );

  const updateCursor = (direction: Direction) => {
    document.body.style.cursor =
      direction === Direction.Horizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const resetCursor = () => {
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  };

  useEffect(() => {
    if (!node) {
      return;
    }
    const resizerElements = [...node.querySelectorAll('.resizer')];
    resizerElements.forEach((resizerEle: any) => {
      resizerEle.addEventListener('mousedown', handleMouseDown);
      resizerEle.addEventListener('touchstart', handleTouchStart);
    });

    return () => {
      resizerElements.forEach((resizerEle: any) => {
        resizerEle.removeEventListener('mousedown', handleMouseDown);
        resizerEle.removeEventListener('touchstart', handleTouchStart);
      });
    };
  }, [node]);

  return [ref];
};

export default useResizeable;
