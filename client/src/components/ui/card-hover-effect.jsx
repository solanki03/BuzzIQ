import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; 
import { useState } from "react";
import QuizButton from "../QuizButton";

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-10", className)}>
      {items.map((item, idx) => (
        <div
          className="relative group block p-2 h-full w-full"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-slate-700/[0.8] block rounded-3xl z-10 pointer-events-none"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          <Card>
            <CardImage>{item.image}</CardImage>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <QuizButton name="Start Test" topic={item.title} />
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div className={cn(
      "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-slate-400/[0.4] group-hover:border-slate-700 relative z-20",
      className
    )}>
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return <h4 className={cn("text-zinc-100 font-semibold tracking-wide mt-4 text-lg text-center", className)}>{children}</h4>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={cn("mt-5 text-zinc-400 tracking-wide leading-relaxed text-sm text-center mb-6", className)}>{children}</p>;
};

export const CardImage = ({ className, children }) => {
  return <img src={children} className={cn("w-full h-36 object-contain", className)} />;
};
