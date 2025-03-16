import { useState, useRef } from "react";

export default function PuzzleEditor() {
  const rows = 4;
  const cols = 7;
  const tileSize = 128;
  const [images, setImages] = useState([]);
  const [grid, setGrid] = useState(Array(rows * cols).fill(null));
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const handleDragStart = (event, imgSrc) => {
    event.dataTransfer.setData("text/plain", imgSrc);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const imgSrc = event.dataTransfer.getData("text/plain");
    const newGrid = [...grid];
    newGrid[index] = imgSrc;
    setGrid(newGrid);
  };

  const exportAsPNG = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    grid.forEach((imgSrc, index) => {
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const x = (index % cols) * tileSize;
          const y = Math.floor(index / cols) * tileSize;
          ctx.drawImage(img, x, y, tileSize, tileSize);
        };
      }
    });
  };

  return (
    <div className="p-4">
      <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
      <div className="flex gap-2 my-4">
        {images.map((imgSrc, index) => (
          <img key={index} src={imgSrc} alt="fragment" width={64} height={64} 
               draggable onDragStart={(e) => handleDragStart(e, imgSrc)} 
               className="border p-1 cursor-pointer" />
        ))}
      </div>
      <div className="grid border" 
           style={{ gridTemplateColumns: `repeat(${cols}, ${tileSize}px)` }}>
        {grid.map((imgSrc, index) => (
          <div key={index} 
               className="border border-gray-400 w-32 h-32 flex items-center justify-center bg-gray-200" 
               onDragOver={(e) => e.preventDefault()} 
               onDrop={(e) => handleDrop(e, index)}>
            {imgSrc && <img src={imgSrc} alt="placed" width={tileSize} height={tileSize} />}
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} width={cols * tileSize} height={rows * tileSize} hidden />
      <button onClick={exportAsPNG} className="mt-4 p-2 bg-blue-500 text-white rounded">Export as PNG</button>
    </div>
  );
}
