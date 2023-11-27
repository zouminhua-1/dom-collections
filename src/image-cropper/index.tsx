import { useClickToSelect, useDraggable, useResizeable } from '@/hooks';
import React, { useEffect, useState, useRef } from 'react';
import { Selection } from '@/hooks/useClickToSelect';
import './index.scss';
import { mergeRefs } from '@/utils';

const ImageCropper = ({ imageUrl }: { imageUrl: string }) => {
  const [clickToSelectRef, dx, dy, startX, startY, selection] =
    useClickToSelect();

  const containerRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const croppingAreaRef = React.useRef({});
  const [draggableRef, dragX, dragY, setOffset] = useDraggable();
  const [resizeRef] = useResizeable();

  const containerMergedRef = mergeRefs([containerRef, clickToSelectRef]);

  const croppingMergedRef = mergeRefs([
    croppingAreaRef,
    resizeRef,
    draggableRef,
  ]);

  const [{ imageWidth, imageHeight }, setImageSize] = useState({
    imageWidth: 0,
    imageHeight: 0,
  });

  useEffect(() => {
    setOffset({
      dx: startX,
      dy: startY,
    });
  }, [startX, startY]);

  const handleImageLoad = (e: any) => {
    const container = containerRef.current;
    const previewImage = previewImageRef.current;
    if (!container) {
      return;
    }
    const naturalWidth = e.target.naturalWidth;
    const naturalHeight = e.target.naturalHeight;
    const ratio = naturalWidth / naturalHeight;

    const containerWidth = container.getBoundingClientRect().width;
    container.style.height = `${containerWidth / ratio}px`;
    e.target.style.width = `${containerWidth}px`;
    if (!previewImage) return;
    previewImage.style.width = `${containerWidth}px`;

    const imageWidth = container.getBoundingClientRect().width;
    const imageHeight = imageWidth / ratio;

    setImageSize({ imageWidth, imageHeight });
  };

  const handleSaveImage = () => {
    const img = originalImageRef.current;
    const croppingArea = croppingAreaRef.current as HTMLDivElement;
    if (!img || !croppingArea) {
      return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 缩放比例等于图像的naturalWidth（即原始图像的宽度）除以图像的width（即当前显示的宽度）。
    const scale = img.naturalWidth / img.width;
    const croppingRect = croppingArea.getBoundingClientRect();
    const scaledWidth = croppingRect.width * scale;
    const scaledHeight = croppingRect.height * scale;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // 在canvas上绘制图像的左上角坐标（dx * scale和dy * scale）
    // 绘制图像的宽度和高度（scaledWidth和scaledHeight）
    // 图像的源矩形（0、0、scaledWidth和scaledHeight）
    ctx.drawImage(
      img,
      dx * scale,
      dy * scale,
      scaledWidth,
      scaledHeight,
      0,
      0,
      scaledWidth,
      scaledHeight,
    );

    // Save image as file
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'cropped-image.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <div
        className="cropper"
        ref={containerMergedRef}
        style={{
          width: imageWidth === 0 ? '' : `${imageWidth}px`,
          height: imageHeight === 0 ? '' : `${imageHeight}px`,
        }}
      >
        <div className="cropper__image">
          <img
            src={imageUrl}
            ref={originalImageRef}
            alt=""
            onLoad={handleImageLoad}
            style={{
              width: imageWidth === 0 ? '' : `${imageWidth}px`,
            }}
          />
        </div>
        <div className="cropper__overlay" />
        {selection === Selection.Dragging && (
          <div
            className="cropper__selection"
            style={{
              transform: `translate(${startX}px, ${startY}px)`,
              width: `${dx}px`,
              height: `${dy}px`,
            }}
          />
        )}
        {selection === Selection.Selected && (
          <div
            ref={croppingMergedRef}
            className="cropper__cropping"
            style={{
              transform: `translate(${dragX}px, ${dragY}px)`,
              width: `${dx}px`,
              height: `${dy}px`,
            }}
          >
            <div className="cropper__preview">
              <img
                alt=""
                src={imageUrl}
                style={{
                  transform: `translate(${-dragX}px, ${-dragY}px)`,
                  width: imageWidth === 0 ? '' : `${imageWidth}px`,
                }}
              />
            </div>

            <div className="resizer resizer--r" />
            <div className="resizer resizer--b" />
          </div>
        )}
      </div>
      <button
        className="cropper__button"
        type="button"
        onClick={handleSaveImage}
      >
        Crop
      </button>
    </>
  );
};

export default ImageCropper;
