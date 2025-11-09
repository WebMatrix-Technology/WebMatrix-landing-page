import { useEffect, useRef, useState } from 'react';

export const Scene3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

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

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Matrix configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const dropSpeeds: number[] = Array(columns).fill(1);
    
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
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Calculate distance from mouse
        const dx = mousePos.x - x;
        const dy = mousePos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxInfluence = 150;
        
        // Influence speed based on mouse proximity
        if (distance < maxInfluence) {
          const influence = 1 - (distance / maxInfluence);
          dropSpeeds[i] = 1 + influence * 3; // Speed up near mouse
          
          // Draw glow effect around mouse
          const glowSize = fontSize * (1 + influence * 2);
          ctx.save();
          ctx.globalAlpha = influence * 0.3;
          ctx.fillStyle = 'rgba(0, 209, 255, 0.8)';
          ctx.fillRect(x - glowSize/2, y - glowSize/2, glowSize, glowSize);
          ctx.restore();
        } else {
          dropSpeeds[i] = Math.max(0.8, dropSpeeds[i] * 0.95); // Gradually return to normal
        }
        
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Color based on proximity to mouse
        let color;
        if (distance < maxInfluence / 2) {
          // Bright cyan near mouse
          color = `rgba(0, 209, 255, ${0.9 + Math.random() * 0.1})`;
        } else if (distance < maxInfluence) {
          // Purple in medium range
          color = `rgba(108, 92, 231, ${0.7 + Math.random() * 0.3})`;
        } else if (Math.random() > 0.95) {
          // Accent color (cyan) for highlights
          color = `rgba(0, 209, 255, ${0.8 + Math.random() * 0.2})`;
        } else if (Math.random() > 0.9) {
          // Primary color (purple) for variety
          color = `rgba(108, 92, 231, ${0.6 + Math.random() * 0.4})`;
        } else {
          // Green Matrix-style
          color = `rgba(34, 197, 94, ${0.5 + Math.random() * 0.5})`;
        }
        
        ctx.fillStyle = color;
        
        // Draw character with size variation near mouse
        if (distance < maxInfluence / 2) {
          const influence = 1 - (distance / (maxInfluence / 2));
          const scale = 1 + influence * 0.5;
          ctx.save();
          ctx.font = `${fontSize * scale}px monospace`;
          ctx.fillText(char, x, y);
          ctx.restore();
        } else {
          ctx.fillText(char, x, y);
        }
        
        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down with variable speed
        drops[i] += dropSpeeds[i];
      }
    };

    // Start animation
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePos]);

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
