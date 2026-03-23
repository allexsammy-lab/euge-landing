import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

interface WireframeGlobeProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function WireframeGlobe({ className, style }: WireframeGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.35; // Tilted
    globeGroup.rotation.z = -0.1;
    scene.add(globeGroup);

    const radius = 1.9;
    const lineColor = new THREE.Color("#3a5a4a");
    const accentColor = new THREE.Color("#c0ff80");

    // Store all materials for brightness adjustment on hover
    const allMaterials: { material: LineMaterial | THREE.MeshBasicMaterial; baseOpacity: number }[] = [];

    const resolution = new THREE.Vector2(container.clientWidth, container.clientHeight);

    // Fat line material creator using Line2
    const createFatLineMaterial = (color: THREE.Color, opacity: number, width: number = 1.5) => {
      const material = new LineMaterial({
        color: color.getHex(),
        transparent: true,
        opacity,
        linewidth: width, // in pixels
        resolution,
        worldUnits: false,
      });
      allMaterials.push({ material, baseOpacity: opacity });
      return material;
    };

    // Helper to create Line2 from points
    const createFatLine = (points: THREE.Vector3[], color: THREE.Color, opacity: number, width: number = 1.5) => {
      const positions: number[] = [];
      points.forEach(p => positions.push(p.x, p.y, p.z));
      const geometry = new LineGeometry();
      geometry.setPositions(positions);
      const material = createFatLineMaterial(color, opacity, width);
      const line = new Line2(geometry, material);
      line.computeLineDistances();
      return line;
    };

    // Latitude lines (horizontal circles)
    const latitudes = [-60, -40, -20, 0, 20, 40, 60];
    latitudes.forEach((lat) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);

      const segments = 80;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          r * Math.cos(theta),
          y,
          r * Math.sin(theta)
        ));
      }

      const isEquator = lat === 0;
      const opacity = isEquator ? 0.7 : 0.4 + Math.abs(lat) * 0.003;
      const lineWidth = isEquator ? 2.0 : 1.5;
      const line = createFatLine(points, isEquator ? accentColor : lineColor, opacity, lineWidth);
      globeGroup.add(line);
    });

    // Longitude lines (vertical great circles)
    const longitudes = 10;
    for (let i = 0; i < longitudes; i++) {
      const theta = (i / longitudes) * Math.PI * 2;
      const segments = 80;
      const points: THREE.Vector3[] = [];

      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI;
        points.push(new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ));
      }

      const line = createFatLine(points, lineColor, 0.35 + (i % 3 === 0 ? 0.15 : 0), 1.5);
      globeGroup.add(line);
    }

    // Outer ring (tilted equator ring for depth effect)
    const outerRingPoints: THREE.Vector3[] = [];
    const outerRadius = radius * 1.05;
    const ringSegments = 120;
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      outerRingPoints.push(new THREE.Vector3(
        outerRadius * Math.cos(theta),
        0,
        outerRadius * Math.sin(theta)
      ));
    }
    const outerRing = createFatLine(outerRingPoints, accentColor, 0.3, 1.5);
    outerRing.rotation.x = 0.2;
    globeGroup.add(outerRing);

    // Second outer ring (slightly different tilt)
    const outerRing2Points: THREE.Vector3[] = [];
    const outerRadius2 = radius * 1.08;
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      outerRing2Points.push(new THREE.Vector3(
        outerRadius2 * Math.cos(theta),
        0,
        outerRadius2 * Math.sin(theta)
      ));
    }
    const outerRing2 = createFatLine(outerRing2Points, lineColor, 0.2, 1.5);
    outerRing2.rotation.x = -0.3;
    outerRing2.rotation.z = 0.15;
    globeGroup.add(outerRing2);

    // Small dots at intersections for detail
    const dotGeometry = new THREE.SphereGeometry(0.015, 6, 6);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.6 });
    allMaterials.push({ material: dotMaterial, baseOpacity: 0.6 });

    latitudes.forEach((lat) => {
      const phi = (90 - lat) * (Math.PI / 180);
      for (let i = 0; i < longitudes; i++) {
        const theta = (i / longitudes) * Math.PI * 2;
        if (Math.random() > 0.5) {
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          dot.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
          globeGroup.add(dot);
        }
      }
    });

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      // Update resolution for fat lines
      resolution.set(width, height);
      allMaterials.forEach(({ material }) => {
        if ('resolution' in material) {
          (material as LineMaterial).resolution.set(width, height);
        }
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, pointerEvents: "none" }}
    />
  );
}
