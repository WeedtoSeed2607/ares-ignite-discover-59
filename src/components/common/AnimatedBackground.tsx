import { memo } from "react";

const AnimatedBackground = memo(() => {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Floating gemstone-colored orbs for visual appeal */}
      <div className="pointer-events-none">
        <div className="bg-[hsl(var(--ruby)/0.08)] blur-3xl rounded-full w-72 h-72 absolute -top-10 -left-10 animate-blob" />
        <div className="bg-[hsl(var(--emerald)/0.06)] blur-3xl rounded-full w-96 h-96 absolute top-1/3 -right-10 animate-blob animation-delay-2000" />
        <div className="bg-[hsl(var(--sapphire)/0.07)] blur-3xl rounded-full w-80 h-80 absolute bottom-10 left-1/3 animate-blob animation-delay-4000" />
        <div className="bg-[hsl(var(--amethyst)/0.05)] blur-3xl rounded-full w-64 h-64 absolute bottom-1/4 right-1/4 animate-blob animation-delay-2000" />
      </div>

      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsla(var(--primary),0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
    </div>
  );
});

export default AnimatedBackground;
