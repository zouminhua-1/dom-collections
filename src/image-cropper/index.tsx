import { useDraggable, useResizeable } from '@/hooks';
import React, { useRef } from 'react';
import './index.scss';
import { mergeRefs } from '@/utils';

const ImageCropper = ({ imageUrl }: { imageUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const croppingAreaRef = React.useRef({});
  const [draggableRef, dx, dy] = useDraggable();
  const [resizeRef] = useResizeable();

  const mergeRef = mergeRefs([croppingAreaRef, resizeRef, draggableRef]);

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
      <div className="cropper" ref={containerRef}>
        {/* 图片 */}
        <div className="cropper__image">
          <img
            ref={originalImageRef}
            alt=""
            src={imageUrl}
            onLoad={handleImageLoad}
          />
        </div>
        {/* 遮罩 */}
        <div className="cropper__overlay" />
        {/* 裁剪框 */}
        <div className="cropper__cropping" ref={mergeRef as RefFunc}>
          {/* 预览图片 */}
          <div className="cropper__preview">
            <img
              src={imageUrl}
              alt=""
              ref={previewImageRef}
              style={{
                transform: `translate(${-dx}px, ${-dy}px)`,
              }}
            />
          </div>
          {/* resizer */}
          <div className="resizer resizer--r"></div>
          <div className="resizer resizer--b"></div>
        </div>
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
