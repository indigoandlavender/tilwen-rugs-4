"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface RugVisualizerProps {
  rugImage: string;
  rugName: string;
  onClose?: () => void;
}

interface Corner {
  x: number;
  y: number;
}

export default function RugVisualizer({ rugImage, rugName, onClose }: RugVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0 });
  const [rugLoaded, setRugLoaded] = useState(false);
  const [rugImageObj, setRugImageObj] = useState<HTMLImageElement | null>(null);
  
  // Four corners for perspective (percentage based)
  const [corners, setCorners] = useState<Corner[]>([
    { x: 25, y: 50 },  // top-left
    { x: 75, y: 50 },  // top-right
    { x: 80, y: 80 },  // bottom-right
    { x: 20, y: 80 },  // bottom-left
  ]);
  
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null);
  const [isDraggingRug, setIsDraggingRug] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load rug image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setRugImageObj(img);
      setRugLoaded(true);
    };
    img.src = rugImage;
  }, [rugImage]);

  // Handle room image upload
  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setRoomDimensions({ width: img.width, height: img.height });
        setRoomImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Draw the composite image
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !roomImage || !rugImageObj) return;

    const roomImg = new window.Image();
    roomImg.onload = () => {
      // Set canvas size to match room image
      canvas.width = roomImg.width;
      canvas.height = roomImg.height;

      // Draw room
      ctx.drawImage(roomImg, 0, 0);

      // Convert percentage corners to pixels
      const pixelCorners = corners.map(c => ({
        x: (c.x / 100) * canvas.width,
        y: (c.y / 100) * canvas.height,
      }));

      // Draw rug with perspective transform
      ctx.save();
      
      // Create clipping path for the quadrilateral
      ctx.beginPath();
      ctx.moveTo(pixelCorners[0].x, pixelCorners[0].y);
      ctx.lineTo(pixelCorners[1].x, pixelCorners[1].y);
      ctx.lineTo(pixelCorners[2].x, pixelCorners[2].y);
      ctx.lineTo(pixelCorners[3].x, pixelCorners[3].y);
      ctx.closePath();
      ctx.clip();

      // Calculate bounding box
      const minX = Math.min(...pixelCorners.map(c => c.x));
      const maxX = Math.max(...pixelCorners.map(c => c.x));
      const minY = Math.min(...pixelCorners.map(c => c.y));
      const maxY = Math.max(...pixelCorners.map(c => c.y));
      const width = maxX - minX;
      const height = maxY - minY;

      // Draw rug (simplified - fills bounding box within clip)
      ctx.globalAlpha = 0.95;
      ctx.drawImage(rugImageObj, minX, minY, width, height);
      
      ctx.restore();
    };
    roomImg.src = roomImage;
  }, [roomImage, rugImageObj, corners]);

  // Redraw when dependencies change
  useEffect(() => {
    if (roomImage && rugLoaded) {
      drawCanvas();
    }
  }, [roomImage, rugLoaded, corners, drawCanvas]);

  // Handle corner dragging
  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCorner(index);
  };

  const handleRugMouseDown = (e: React.MouseEvent) => {
    if (draggingCorner !== null) return;
    e.preventDefault();
    setIsDraggingRug(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (draggingCorner !== null) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setCorners(prev => {
        const newCorners = [...prev];
        newCorners[draggingCorner] = {
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        };
        return newCorners;
      });
    } else if (isDraggingRug) {
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      setCorners(prev => prev.map(corner => ({
        x: Math.max(0, Math.min(100, corner.x + deltaX)),
        y: Math.max(0, Math.min(100, corner.y + deltaY)),
      })));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggingCorner, isDraggingRug, dragStart]);

  const handleMouseUp = useCallback(() => {
    setDraggingCorner(null);
    setIsDraggingRug(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Download composite image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${rugName.replace(/\s+/g, "-").toLowerCase()}-in-room.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
  };

  // Reset rug position
  const handleReset = () => {
    setCorners([
      { x: 25, y: 50 },
      { x: 75, y: 50 },
      { x: 80, y: 80 },
      { x: 20, y: 80 },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-cream rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-charcoal/10">
          <div>
            <h2 className="font-serif text-xl text-charcoal">Visualize in Your Space</h2>
            <p className="text-xs text-stone mt-1">{rugName}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-stone hover:text-charcoal transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l10 10M15 5l-10 10" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!roomImage ? (
            /* Upload State */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 mb-6 rounded-full bg-sand flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone">
                  <rect x="4" y="8" width="32" height="24" rx="2" />
                  <circle cx="12" cy="16" r="3" />
                  <path d="M4 28l8-8 6 6 8-10 10 12" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-charcoal mb-2">Upload a photo of your room</h3>
              <p className="text-sm text-stone mb-6 text-center max-w-md">
                Take a photo of your floor space where you&apos;d like to place the rug. 
                For best results, shoot from standing height looking down at an angle.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleRoomUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
              >
                Choose Photo
              </button>
              
              {/* Preview of rug being placed */}
              <div className="mt-8 w-32 h-40 relative opacity-50">
                <Image
                  src={rugImage}
                  alt={rugName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            /* Editing State */
            <div className="space-y-4">
              {/* Canvas container */}
              <div 
                ref={containerRef}
                className="relative bg-sand overflow-hidden"
                style={{ 
                  aspectRatio: roomDimensions.width && roomDimensions.height 
                    ? `${roomDimensions.width}/${roomDimensions.height}` 
                    : "16/9",
                  maxHeight: "60vh"
                }}
              >
                {/* Hidden canvas for export */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Room image */}
                <Image
                  src={roomImage}
                  alt="Your room"
                  fill
                  className="object-contain"
                />

                {/* Rug overlay with perspective */}
                <div
                  className="absolute cursor-move"
                  style={{
                    clipPath: `polygon(${corners[0].x}% ${corners[0].y}%, ${corners[1].x}% ${corners[1].y}%, ${corners[2].x}% ${corners[2].y}%, ${corners[3].x}% ${corners[3].y}%)`,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  onMouseDown={handleRugMouseDown}
                >
                  <div
                    className="absolute"
                    style={{
                      left: `${Math.min(...corners.map(c => c.x))}%`,
                      top: `${Math.min(...corners.map(c => c.y))}%`,
                      width: `${Math.max(...corners.map(c => c.x)) - Math.min(...corners.map(c => c.x))}%`,
                      height: `${Math.max(...corners.map(c => c.y)) - Math.min(...corners.map(c => c.y))}%`,
                    }}
                  >
                    <Image
                      src={rugImage}
                      alt={rugName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Corner handles */}
                {corners.map((corner, index) => (
                  <div
                    key={index}
                    className="absolute w-4 h-4 bg-white border-2 border-charcoal rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-10"
                    style={{
                      left: `${corner.x}%`,
                      top: `${corner.y}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(index, e)}
                  />
                ))}

                {/* Corner labels */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded">
                  Drag corners to fit floor perspective
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-stone text-center">
                Drag the white handles to match your floor&apos;s perspective. Drag the rug to reposition.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {roomImage && (
          <div className="flex items-center justify-between p-4 border-t border-charcoal/10">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-charcoal/20 text-xs uppercase tracking-[0.1em] text-stone hover:text-charcoal hover:border-charcoal/40 transition-colors"
              >
                Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleRoomUpload}
                className="hidden"
              />
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-charcoal/20 text-xs uppercase tracking-[0.1em] text-stone hover:text-charcoal hover:border-charcoal/40 transition-colors"
              >
                Reset Position
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
