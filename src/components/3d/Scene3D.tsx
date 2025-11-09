import { useEffect, useRef } from 'react';

export const Scene3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    // Coding characters - mix of symbols, letters, and numbers
    const chars = '01{}</>[]();.,/*+-=@#$%&|~абвгдежзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Animation loop
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(11, 15, 25, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Color gradient based on position
        const y = drops[i] * fontSize;
        const brightness = Math.min(255, 150 + (y / canvas.height) * 100);
        
        // Use primary/accent colors with variation
        if (Math.random() > 0.95) {
          // Accent color (cyan) for highlights
          ctx.fillStyle = `rgba(0, 209, 255, ${0.8 + Math.random() * 0.2})`;
        } else if (Math.random() > 0.9) {
          // Primary color (purple) for variety
          ctx.fillStyle = `rgba(108, 92, 231, ${0.6 + Math.random() * 0.4})`;
        } else {
          // Green Matrix-style
          ctx.fillStyle = `rgba(34, 197, 94, ${0.5 + Math.random() * 0.5})`;
        }
        
        // Draw character
        ctx.fillText(char, i * fontSize, y);
        
        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    };

    // Start animation
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};
