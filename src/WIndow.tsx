import React, { useEffect, useRef, useState } from "react";
import { IoMdHeartHalf } from "react-icons/io";

export default function NamesCenteredGradient() {
    const yRef = useRef<HTMLDivElement | null>(null);
    const [yWidth, setYWidth] = useState<number | null>(null);
    const seiyaRowRef = useRef<HTMLDivElement | null>(null);
    const firstRef = useRef<HTMLSpanElement | null>(null);
    const lastRef = useRef<HTMLSpanElement | null>(null);
    const [slideDeltas, setSlideDeltas] = useState<{ left: number; right: number }>({ left: 0, right: 0 });

    // Measure YUKITCH width so SEIYAITO can match the width
    useEffect(() => {
        const measure = () => {
            if (yRef.current) {
                const w = yRef.current.getBoundingClientRect().width;
                setYWidth(w);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Half-heart component. Translation to center is performed via CSS var animation
    const HeartHalf: React.FC<{ keep: "left" | "right"; scale?: number; slideDeltaPx?: number }> = ({ keep, scale = 1, slideDeltaPx = 0 }) => {
        const sizeEm = 1.1 * scale;
        return (
            <div
                className="absolute left-1/2 pointer-events-none"
                style={{
                    width: `${sizeEm}em`,
                    height: `${sizeEm}em`,
                    top: `calc(-${sizeEm * 0.9}em - 10px)`,
                    transform: "translateX(calc(-50% + var(--slide-x)))",
                    willChange: "transform",
                    animation: "slideToCenter 0.5s cubic-bezier(1, 0, 1, 1) 3.3s 1 both",
                    // supply per-instance delta as a CSS variable
                    ["--slide-delta" as any]: `${slideDeltaPx}px`,
                } as React.CSSProperties}
            >
                <IoMdHeartHalf
                    color="#ffffff"
                    style={{
                        width: "100%",
                        height: "100%",
                        // keep only the requested half visible, mask rotates together
                        clipPath: keep === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
                        transformBox: "fill-box",
                        // pivot near the pointy bottom; left uses right-bottom, right uses left-bottom
                        transformOrigin: keep === "left" ? "50% 100%" : "50% 100%",
                        willChange: "transform",
                        // one-time outward tilt and return
                        animation: `${keep === "left" ? "tiltLeft" : "tiltRight"} 0.8s ease-in-out 3s 1 both`,
                    }}
                />
            </div>
        );
    };

    // Compute how far each heart needs to travel to reach the center of the row
    useEffect(() => {
        const compute = () => {
            if (!seiyaRowRef.current || !firstRef.current || !lastRef.current) return;
            const c = seiyaRowRef.current.getBoundingClientRect();
            const f = firstRef.current.getBoundingClientRect();
            const l = lastRef.current.getBoundingClientRect();
            const centerX = c.left + c.width / 2;
            const fCenter = f.left + f.width / 2;
            const lCenter = l.left + l.width / 2;
            setSlideDeltas({ left: centerX - fCenter, right: centerX - lCenter });
        };
        compute();
        window.addEventListener("resize", compute);
        // cleanup (no stray clearTimeout of undefined variable)
        return () => {
            window.removeEventListener("resize", compute);
        };
    }, [yWidth]);

    const seiya = "SEIYAITO".split("");

    return (
        <div
            className="fixed inset-0 w-screen h-screen"
            style={{
                background:
                    "linear-gradient(180deg, #ff1d1d 0%, #da0000 55%, #a40000 100%)",
            }}
        >
            <style>{`
@property --slide-x {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}
@keyframes slideToCenter {
  to { --slide-x: var(--slide-delta); }
}
@keyframes tiltLeft {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}
@keyframes tiltRight {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}
      `}</style>
            {/* Content positioned a bit below the center */}
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: "56%" }}
            >
                <div className="flex flex-col items-center gap-0 px-4">
                    {/* YUKITCH (larger) */}
                    <div
                        ref={yRef}
                        className="inline-block order-1 -mt-1 text-white font-extrabold leading-none text-center"
                        style={{ fontSize: "clamp(48px, 12vw, 160px)" }}
                    >
                        YUKITCH
                    </div>

                    {/* SEIYAITO (smaller ~ half size). Width matches YUKITCH; letters spread evenly. */}
                    <div
                        className="order-0 text-white font-bold leading-none mx-auto"
                        style={{
                            fontSize: "clamp(20px, 4.8vw, 72px)",
                            width: yWidth ? `${yWidth}px` : "auto",
                        }}
                    >
                        <div ref={seiyaRowRef} className="flex justify-between">
                            {seiya.map((ch, i) => (
                                <span
                                    key={i}
                                    ref={i === 0 ? firstRef : i === seiya.length - 1 ? lastRef : null}
                                    className="relative inline-block"
                                >
                  {i === 0 && (
                      <HeartHalf keep="left" scale={7} slideDeltaPx={slideDeltas.left} />
                  )}
                                    {i === seiya.length - 1 && (
                                        <HeartHalf keep="right" scale={7} slideDeltaPx={slideDeltas.right} />
                                    )}
                                    {ch}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
