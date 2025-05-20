
import { useSprings, animated, SpringValue } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: (t: number) => number;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "initial" | "inherit";
  onLetterAnimationComplete?: () => void;
  animateBy?: "letters" | "words" | "chars"; // Added property
  direction?: "top" | "bottom" | "left" | "right"; // Added property
}

const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom,
  animationTo,
  easing = (t) => t,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  animateBy = "letters",
  direction = "bottom",
}) => {
  // Determine animation direction
  const getAnimationProps = () => {
    // Set default transforms based on direction
    let fromTransform = "translate3d(0,40px,0)";
    let toTransform = "translate3d(0,0,0)";

    switch (direction) {
      case "top":
        fromTransform = "translate3d(0,-40px,0)";
        break;
      case "left":
        fromTransform = "translate3d(-40px,0,0)";
        break;
      case "right":
        fromTransform = "translate3d(40px,0,0)";
        break;
      default: // "bottom" or any other value defaults to bottom
        fromTransform = "translate3d(0,40px,0)";
    }

    return {
      from: animationFrom || { opacity: 0, transform: fromTransform },
      to: animationTo || { opacity: 1, transform: toTransform },
    };
  };

  const { from, to } = getAnimationProps();

  // Split text by words or letters based on animateBy prop
  const words = text.split(" ").map((w) => w.split(""));
  
  // If animateBy is "words", we'll treat each word as a single unit
  const units = animateBy === "words" 
    ? words.map(word => word.join("")) 
    : words.flat();

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin },
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    units.length,
    units.map((_, i) => ({
      from,
      to: inView
        ? async (
            next: (step: Record<string, string | number>) => Promise<void>,
          ) => {
            await next(to);
            animatedCount.current += 1;
            if (
              animatedCount.current === units.length &&
              onLetterAnimationComplete
            ) {
              onLetterAnimationComplete();
            }
          }
        : from,
      delay: i * delay,
      config: { easing },
    })),
  );

  if (animateBy === "words") {
    // Render for words animation
    return (
      <p
        ref={ref}
        className={`split-parent overflow-hidden inline ${className}`}
        style={{ textAlign: textAlign }}
      >
        {units.map((word, wIdx) => (
          <animated.span
            key={wIdx}
            style={
              {
                ...springs[wIdx],
                display: "inline-block",
                willChange: "transform, opacity",
                marginRight: "0.3em",
              } as unknown as Record<string, SpringValue | string | number>
            }
          >
            {word}
          </animated.span>
        ))}
      </p>
    );
  }

  // Default: Render for letters animation
  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline ${className}`}
      style={{ textAlign: textAlign }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.map((letter, lIdx) => {
            const index =
              words.slice(0, wIdx).reduce((acc, w) => acc + w.length, 0) + lIdx;

            return (
              <animated.span
                key={index}
                style={
                  {
                    ...springs[index],
                    display: "inline-block",
                    willChange: "transform, opacity",
                  } as unknown as Record<string, SpringValue | string | number>
                }
              >
                {letter}
              </animated.span>
            );
          })}
          <span className="inline-block w-[0.3em]">&nbsp;</span>
        </span>
      ))}
    </p>
  );
};

export default SplitText;
