import { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

const TiltCard = ({ children, className = "", depth = 30 }: TiltCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${depth / 3.75}deg`, `-${depth / 3.75}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${depth / 3.75}deg`, `${depth / 3.75}deg`]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`perspective-[2000px] relative z-20 transition-all ${className}`}
    >
      <div 
        style={{ transformStyle: "preserve-3d" }} 
        className="w-full h-full relative z-30"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;
