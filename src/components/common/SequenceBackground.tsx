import React, { useEffect, useRef } from 'react';

interface SequenceBackgroundProps {
  totalFrames?: number;
  fps?: number;
  className?: string;
}

export const SequenceBackground: React.FC<SequenceBackgroundProps> = ({
  totalFrames = 210,
  fps = 30,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);
  const lastDrawTimeRef = useRef<number>(0);

  // Pad number to 3 digits e.g. 1 -> "001"
  const getFrameUrl = (index: number) => {
    const padded = String(index).padStart(3, '0');
    return `/bg-frames/ezgif-frame-${padded}.jpg`;
  };

  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // Preload frames in batches
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      images.push(img);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop with frame throttling
    const frameInterval = 1000 / fps;

    const render = (time: number) => {
      if (!isMounted) return;

      const elapsed = time - lastDrawTimeRef.current;

      if (elapsed >= frameInterval) {
        lastDrawTimeRef.current = time - (elapsed % frameInterval);

        const img = images[currentFrameRef.current - 1];
        if (img && img.complete && img.naturalWidth > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const canvasWidth = window.innerWidth * dpr;
          const canvasHeight = window.innerHeight * dpr;

          const imgRatio = img.naturalWidth / img.naturalHeight;
          const canvasRatio = canvasWidth / canvasHeight;
          let renderWidth, renderHeight, offsetX, offsetY;

          if (canvasRatio > imgRatio) {
            renderWidth = canvasWidth;
            renderHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - renderHeight) / 2;
          } else {
            renderWidth = canvasHeight * imgRatio;
            renderHeight = canvasHeight;
            offsetX = (canvasWidth - renderWidth) / 2;
            offsetY = 0;
          }

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          // Clean zoom crop to eliminate the corner watermark seamlessly
          const zoom = 1.09;
          const srcWidth = img.naturalWidth / zoom;
          const srcHeight = img.naturalHeight / zoom;
          const srcX = (img.naturalWidth - srcWidth) / 2;
          const srcY = (img.naturalHeight - srcHeight) / 2;

          ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, offsetX, offsetY, renderWidth, renderHeight);
        }

        // Cycle through all 210 frames in loop
        currentFrameRef.current = currentFrameRef.current >= totalFrames ? 1 : currentFrameRef.current + 1;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [totalFrames, fps]);

  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden ${className}`}>
      {/* 100% Fully Visible Background Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />

      {/* Subtle gentle vignette to protect text legibility without dimming the animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};
export default SequenceBackground;
