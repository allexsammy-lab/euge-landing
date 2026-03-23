import { useEffect, useRef, useState, useCallback } from "react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663206037536/rXrwBEkZyiYABMfe.png";

/**
 * How It Works Animation
 * - Static structure (hub, destination lines, labels) fades in once and stays
 * - Moving elements loop: source labels slide in, dots travel paths,
 *   integration→checkmark lines draw progressively, checkmark pops
 */

// Dot component that moves along an SVG path using JS
function TravelingDot({ pathId, delay = 0, duration = 1500, color = "#c0ff80", size = 3.5, active = false }: {
  pathId: string; delay?: number; duration?: number; color?: string; size?: number; active?: boolean;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      if (circleRef.current) circleRef.current.setAttribute("opacity", "0");
      return;
    }

    const pathEl = document.getElementById(pathId) as unknown as SVGGeometryElement;
    if (!pathEl || !circleRef.current) return;

    const totalLength = pathEl.getTotalLength();
    let startTime: number | null = null;
    let delayDone = false;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (!delayDone) {
        if (elapsed < delay) { rafRef.current = requestAnimationFrame(animate); return; }
        delayDone = true;
        startTime = timestamp;
      }

      const realElapsed = timestamp - startTime;
      const progress = Math.min(realElapsed / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const point = pathEl.getPointAtLength(eased * totalLength);
      const circle = circleRef.current;
      if (circle) {
        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
        let opacity = 1;
        if (progress < 0.1) opacity = progress / 0.1;
        else if (progress > 0.85) opacity = (1 - progress) / 0.15;
        circle.setAttribute("opacity", String(opacity));
      }

      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, pathId, delay, duration]);

  return <circle ref={circleRef} r={size} fill={color} filter="url(#glow)" opacity="0" />;
}

// JS-driven progressive dashed line reveal using stroke-dashoffset
function RevealingDashLine({ pathId, delay = 0, duration = 1200, active = false, uniqueId }: {
  pathId: string; delay?: number; duration?: number; active?: boolean; uniqueId: string;
}) {
  const pathRef = useRef<SVGUseElement>(null);
  const rafRef = useRef<number>(0);
  const [totalLength, setTotalLength] = useState(0);

  // Get path length on mount
  useEffect(() => {
    const pathEl = document.getElementById(pathId) as unknown as SVGGeometryElement;
    if (pathEl) {
      setTotalLength(pathEl.getTotalLength());
    }
  }, [pathId]);

  useEffect(() => {
    if (!active || totalLength === 0) {
      return;
    }

    let startTime: number | null = null;
    let delayDone = false;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (!delayDone) {
        if (elapsed < delay) { rafRef.current = requestAnimationFrame(animate); return; }
        delayDone = true;
        startTime = timestamp;
      }

      const realElapsed = timestamp - startTime;
      const progress = Math.min(realElapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      if (pathRef.current) {
        // Reveal from start: offset goes from totalLength to 0
        const offset = totalLength * (1 - eased);
        pathRef.current.style.strokeDashoffset = String(offset);
        // Fade in during first 15%
        const opacity = progress < 0.15 ? (progress / 0.15) * 0.4 : 0.4;
        pathRef.current.style.opacity = String(opacity);
      }

      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, totalLength, delay, duration]);

  if (totalLength === 0) return null;

  return (
    <use
      ref={pathRef}
      href={`#${pathId}`}
      fill="none"
      stroke="#c0ff80"
      strokeWidth="1.3"
      strokeDasharray={`${totalLength}`}
      strokeDashoffset={`${totalLength}`}
      strokeLinecap="round"
      opacity="0"
    />
  );
}

export default function HowItWorksAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [structureReady, setStructureReady] = useState(false);
  const [motionPhase, setMotionPhase] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setStructureReady(true), 300);
    return () => clearTimeout(t);
  }, [isVisible]);

  const runMotionCycle = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMotionPhase(0);

    const t0 = setTimeout(() => setMotionPhase(1), 100);     // Source labels slide in
    const t1 = setTimeout(() => setMotionPhase(2), 2400);    // Dots travel hub → dest
    const t15 = setTimeout(() => setMotionPhase(2.5), 3800); // Integration → checkmark lines draw
    const t2 = setTimeout(() => setMotionPhase(3), 5400);    // Checkmark appears
    const t3 = setTimeout(() => {                             // Reset and loop
      setCycleKey(k => k + 1);
    }, 8000);

    timersRef.current = [t0, t1, t15, t2, t3];
  }, []);

  useEffect(() => {
    if (!structureReady) return;
    runMotionCycle();
    return () => timersRef.current.forEach(clearTimeout);
  }, [structureReady, cycleKey, runMotionCycle]);

  // === LAYOUT ===
  const Y1 = 80, Y2 = 190, Y3 = 300;
  const SRC_X = 20, SRC_END = 155;
  const HUB_X = 270, HUB_R = 32;
  const DEST_X = 460, INTG_X = 580, CHECK_X = 820;
  const SRC_HUB_MID = (SRC_END + HUB_X) / 2;
  const HUB_DEST_MID = (HUB_X + DEST_X) / 2;
  const INTG_CHECK_MID = (INTG_X + 90 + CHECK_X) / 2;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[380px] overflow-hidden rounded-lg">
      {/* Light grid — exact multiple of 40px, subtle pulsing fade */}
      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      {/* Outer clip container — clips to exact multiple of 40px */}
      <div className="absolute pointer-events-none overflow-hidden" style={{
        top: "50%",
        left: "0",
        transform: "translateY(-50%)",
        width: "100%",
        height: "320px",
        animation: "gridPulse 4s ease-in-out infinite",
      }}>
        {/* Inner grid — offset by -1px to hide top/left edge lines, open on all 4 sides */}
        <div style={{
          position: "relative",
          top: "-1px",
          left: "-1px",
          width: "2002px",
          height: "322px",
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)
          `,
          backgroundSize: "40px 40px",
        }} />
      </div>

      <svg viewBox="0 0 1000 380" className="relative z-10 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <style>{`
            @keyframes dashFlow { to { stroke-dashoffset: -20; } }
            @keyframes shimmer { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.7; } }
            @keyframes slideInTop {
              0%   { transform: translateX(0); opacity: 0; }
              8%   { opacity: 0.9; }
              40%  { opacity: 0.7; }
              70%  { transform: translateX(80px); opacity: 0.3; }
              100% { transform: translateX(115px); opacity: 0; }
            }
            @keyframes slideInMid {
              0%   { transform: translateX(0); opacity: 0; }
              8%   { opacity: 0.8; }
              40%  { opacity: 0.6; }
              70%  { transform: translateX(60px); opacity: 0.25; }
              100% { transform: translateX(95px); opacity: 0; }
            }
            @keyframes slideInBot {
              0%   { transform: translateX(0); opacity: 0; }
              8%   { opacity: 0.9; }
              40%  { opacity: 0.7; }
              70%  { transform: translateX(70px); opacity: 0.3; }
              100% { transform: translateX(108px); opacity: 0; }
            }
            @keyframes checkPop {
              0%   { transform: scale(0); opacity: 0; }
              50%  { transform: scale(1.12); opacity: 1; }
              75%  { transform: scale(0.96); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes srcLinesFade {
              0%   { opacity: 0; }
              8%   { opacity: 0.3; }
              50%  { opacity: 0.25; }
              85%  { opacity: 0.1; }
              100% { opacity: 0; }
            }
            @keyframes pulseRing {
              0%   { r: 20; opacity: 0.5; }
              100% { r: 36; opacity: 0; }
            }
          `}</style>

          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c0ff80" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#c0ff80" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c0ff80" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Path definitions */}
          <path id="pathS1" d={`M ${SRC_END + 8},${Y1} C ${SRC_HUB_MID},${Y1} ${SRC_HUB_MID},${Y2 - 8} ${HUB_X - HUB_R - 4},${Y2 - 8}`} />
          <path id="pathS2" d={`M ${SRC_END + 8},${Y2} L ${HUB_X - HUB_R - 4},${Y2}`} />
          <path id="pathS3" d={`M ${SRC_END + 8},${Y3} C ${SRC_HUB_MID},${Y3} ${SRC_HUB_MID},${Y2 + 8} ${HUB_X - HUB_R - 4},${Y2 + 8}`} />

          <path id="pathR1" d={`M ${HUB_X + HUB_R + 4},${Y2 - 8} C ${HUB_DEST_MID},${Y2 - 8} ${HUB_DEST_MID},${Y1} ${DEST_X - 8},${Y1}`} />
          <path id="pathR2" d={`M ${HUB_X + HUB_R + 4},${Y2} L ${DEST_X - 8},${Y2}`} />
          <path id="pathR3" d={`M ${HUB_X + HUB_R + 4},${Y2 + 8} C ${HUB_DEST_MID},${Y2 + 8} ${HUB_DEST_MID},${Y3} ${DEST_X - 8},${Y3}`} />

          <path id="pathI1" d={`M ${DEST_X + 80},${Y1} L ${INTG_X - 6},${Y1}`} />
          <path id="pathI2" d={`M ${DEST_X + 72},${Y2} L ${INTG_X - 6},${Y2}`} />
          <path id="pathI3" d={`M ${DEST_X + 68},${Y3} L ${INTG_X - 6},${Y3}`} />

          <path id="pathC1" d={`M ${INTG_X + 90},${Y1} C ${INTG_CHECK_MID},${Y1} ${INTG_CHECK_MID},${Y2 - 6} ${CHECK_X - 22},${Y2 - 6}`} />
          <path id="pathC2" d={`M ${INTG_X + 90},${Y2} L ${CHECK_X - 22},${Y2}`} />
          <path id="pathC3" d={`M ${INTG_X + 90},${Y3} C ${INTG_CHECK_MID},${Y3} ${INTG_CHECK_MID},${Y2 + 6} ${CHECK_X - 22},${Y2 + 6}`} />
        </defs>

        {/* ========================================== */}
        {/* STATIC STRUCTURE — fades in once, stays    */}
        {/* ========================================== */}

        {/* Euge Hub */}
        <g opacity={structureReady ? 1 : 0} style={{ transition: "opacity 0.8s ease" }}>
          <circle cx={HUB_X} cy={Y2} r="65" fill="url(#hubGlow)">
            <animate attributeName="r" values="62;70;62" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx={HUB_X} cy={Y2} r={HUB_R} fill="rgba(27,46,31,0.9)" stroke="#c0ff80" strokeWidth="1.5" />
          <image href={LOGO_URL} x={HUB_X - 20} y={Y2 - 20} width="40" height="40" preserveAspectRatio="xMidYMid meet" />
        </g>

        {/* Hub → Destination dashed lines */}
        {["pathR1", "pathR2", "pathR3"].map((id, i) => (
          <use key={`rl-${id}`} href={`#${id}`}
            fill="none" stroke="#c0ff80" strokeWidth="1.8"
            strokeDasharray="10 6" strokeLinecap="round"
            opacity={structureReady ? 0.35 : 0}
            style={{
              transition: `opacity 0.6s ease ${0.3 + i * 0.08}s`,
              animation: structureReady ? "dashFlow 1.2s linear infinite" : "none",
            }}
          />
        ))}

        {/* Destination labels */}
        {[
          { label: "Supplier A", y: Y1 },
          { label: "Partner B", y: Y2 },
          { label: "Service C", y: Y3 },
        ].map((d, i) => (
          <text key={`dl-${i}`} x={DEST_X} y={d.y + 5}
            fill="white" fontSize="15" fontWeight="600"
            opacity={structureReady ? 0.9 : 0}
            style={{ transition: `opacity 0.5s ease ${0.5 + i * 0.1}s` }}>
            {d.label}
          </text>
        ))}

        {/* Dest → Integration dashed lines */}
        {["pathI1", "pathI2", "pathI3"].map((id, i) => (
          <use key={`il-${id}`} href={`#${id}`}
            fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3"
            strokeDasharray="7 5" strokeLinecap="round"
            opacity={structureReady ? 0.35 : 0}
            style={{ transition: `opacity 0.5s ease ${0.7 + i * 0.08}s` }}
          />
        ))}

        {/* Integration labels */}
        {[
          { label: "Integration 1", y: Y1 },
          { label: "Integration 2", y: Y2 },
          { label: "Integration 3", y: Y3 },
        ].map((intg, i) => (
          <text key={`it-${i}`} x={INTG_X} y={intg.y + 4}
            fill="#c0ff80" fontSize="12" fontWeight="400"
            opacity={structureReady ? 0.5 : 0}
            style={{ transition: `opacity 0.5s ease ${0.8 + i * 0.08}s` }}>
            {intg.label}
          </text>
        ))}

        {/* ========================================== */}
        {/* MOVING ELEMENTS — loop via cycleKey        */}
        {/* ========================================== */}
        <g key={cycleKey}>

          {/* Phase 2.5: Integration → Checkmark dashed lines draw progressively (JS-driven) */}
          <RevealingDashLine pathId="pathC1" delay={0} duration={1200} active={motionPhase >= 2.5} uniqueId={`rl1-${cycleKey}`} />
          <RevealingDashLine pathId="pathC2" delay={150} duration={1000} active={motionPhase >= 2.5} uniqueId={`rl2-${cycleKey}`} />
          <RevealingDashLine pathId="pathC3" delay={300} duration={1200} active={motionPhase >= 2.5} uniqueId={`rl3-${cycleKey}`} />

          {/* Phase 1: Source → Hub dashed lines appear and fade with labels */}
          {motionPhase >= 1 && ["pathS1", "pathS2", "pathS3"].map((id, i) => (
            <use key={`sl-${id}`} href={`#${id}`}
              fill="none" stroke="#c0ff80" strokeWidth="1.5"
              strokeDasharray="8 5" strokeLinecap="round"
              opacity="0"
              style={{ animation: `srcLinesFade 2.2s cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 0.1}s forwards` }}
            />
          ))}

          {/* Phase 1: Source labels slide right and dissolve */}
          {motionPhase >= 1 && (
            <>
              <text x={SRC_X} y={Y1 + 5} fill="#c0ff80" fontSize="14" fontWeight="500" opacity="0"
                style={{ animation: "slideInTop 2s cubic-bezier(0.22, 0.61, 0.36, 1) 0s forwards" }}>
                Hotel A
              </text>
              <text x={SRC_X} y={Y2 + 5} fill="#c0ff80" fontSize="11" fontWeight="400" opacity="0"
                style={{ animation: "slideInMid 2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s forwards" }}>
                Food Supply Export Co. B
              </text>
              <text x={SRC_X} y={Y3 + 5} fill="#c0ff80" fontSize="14" fontWeight="500" opacity="0"
                style={{ animation: "slideInBot 2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.3s forwards" }}>
                Hospitality Group C
              </text>
            </>
          )}

          {/* Phase 1: Dots travel source → hub */}
          <TravelingDot pathId="pathS1" delay={200} duration={1600} active={motionPhase >= 1} />
          <TravelingDot pathId="pathS2" delay={350} duration={1400} active={motionPhase >= 1} />
          <TravelingDot pathId="pathS3" delay={500} duration={1600} active={motionPhase >= 1} />

          {/* Phase 2: Dots travel hub → destination */}
          <TravelingDot pathId="pathR1" delay={0} duration={1400} active={motionPhase >= 2} />
          <TravelingDot pathId="pathR2" delay={150} duration={1200} active={motionPhase >= 2} />
          <TravelingDot pathId="pathR3" delay={300} duration={1400} active={motionPhase >= 2} />

          {/* Phase 2.5: Dots travel integration → checkmark */}
          <TravelingDot pathId="pathC1" delay={200} duration={1200} active={motionPhase >= 2.5} />
          <TravelingDot pathId="pathC2" delay={350} duration={1000} active={motionPhase >= 2.5} />
          <TravelingDot pathId="pathC3" delay={500} duration={1200} active={motionPhase >= 2.5} />

          {/* Phase 3: Checkmark pops in */}
          {motionPhase >= 3 && (
            <g style={{
              transformOrigin: `${CHECK_X}px ${Y2}px`,
              animation: "checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0s both",
            }}>
              {/* Pulse rings */}
              <circle cx={CHECK_X} cy={Y2} r="20" fill="none" stroke="#c0ff80" strokeWidth="1.2">
                <animate attributeName="r" values="20;36" dur="1.5s" repeatCount="2" />
                <animate attributeName="opacity" values="0.5;0" dur="1.5s" repeatCount="2" />
              </circle>

              {/* Green circle */}
              <circle cx={CHECK_X} cy={Y2} r="20" fill="#c0ff80" filter="url(#glow)" />

              {/* Checkmark */}
              <path
                d={`M ${CHECK_X - 10},${Y2} L ${CHECK_X - 3},${Y2 + 8} L ${CHECK_X + 10},${Y2 - 7}`}
                fill="none" stroke="#1a1a1a" strokeWidth="3.2"
                strokeLinecap="round" strokeLinejoin="round"
              />

              {/* Text */}
              <text x={CHECK_X} y={Y2 + 40} textAnchor="middle"
                fill="#c0ff80" fontSize="9" fontWeight="600" letterSpacing="1" opacity="0"
                style={{ animation: "fadeIn 0.4s ease 0.3s forwards" }}>
                PAYMENT RECEIVED
              </text>

              {/* Shimmer */}
              {[
                { cx: CHECK_X - 22, cy: Y2 - 18, d: 0.3 },
                { cx: CHECK_X + 22, cy: Y2 - 14, d: 0.6 },
                { cx: CHECK_X + 20, cy: Y2 + 18, d: 0.9 },
                { cx: CHECK_X - 20, cy: Y2 + 16, d: 1.2 },
              ].map((p, i) => (
                <circle key={`sh-${i}`} cx={p.cx} cy={p.cy} r="1.8" fill="#c0ff80"
                  style={{ animation: `shimmer 1.8s ease ${p.d}s 2` }} />
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
