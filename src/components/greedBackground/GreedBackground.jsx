import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import 'tailwindcss/tailwind.css';

const GreedBackGround = ({ className }) => {
  const mountRef = useRef(null);
  const fixedHeight = 900;
  useEffect(() => {



    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / fixedHeight, 0.2, 100);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color('#242933'));
    renderer.setSize(window.innerWidth, fixedHeight);
    mountRef.current.appendChild(renderer.domElement);

    let gradientColor = new THREE.Color('#6996ff');
    let gradientToColor = new THREE.Color('#da43ff');

    const gridMaterial = new THREE.LineBasicMaterial({
      linewidth: 20,
      vertexColors: true,
    });
    
    
    const isPointInside = (point, vertices) => {
      let inside = false;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const { x: xi, y: yi } = vertices[i];
        const { x: xj, y: yj } = vertices[j];

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };
    const observer2 = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          updateBackgroundColor();
        }
      });
    });

    observer2.observe(document.documentElement, {
      attributes: true
    });

    const updateBackgroundColor = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const backgroundColor = isDarkMode ? new THREE.Color('#242933') : new THREE.Color('#f2f4f8');
      renderer.setClearColor(backgroundColor);
    };
  
    updateBackgroundColor();
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          updateBackgroundColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true
    });
  

    const createGridForShape = (vertices, gridSize) => {
      const points = [];
      const indices = [];
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      vertices.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });

      let index = 0;
      for (let x = minX; x <= maxX; x += gridSize) {
        for (let y = minY; y <= maxY; y += gridSize) {
          const corners = [
            new THREE.Vector3(x, y, 0),
            new THREE.Vector3(x + gridSize, y, 0),
            new THREE.Vector3(x + gridSize, y + gridSize, 0),
            new THREE.Vector3(x, y + gridSize, 0)
          ];

          if (corners.every(corner => isPointInside(corner, vertices))) {
            points.push(...corners.flatMap(corner => corner.toArray()));
            indices.push(index, index + 1, index + 1, index + 2, index + 2, index + 3, index + 3, index);
            index += 4;
          }
        }
      }

      const colors = [];
      const gradientStep = 1 / (indices.length / 2);
      for (let i = 0; i < indices.length / 2; i++) {
        const color = new THREE.Color().lerpColors(gradientColor, gradientToColor, i * gradientStep);
        colors.push(color.r, color.g, color.b);
      }

      const gridGeometry = new THREE.BufferGeometry();
      gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      gridGeometry.setIndex(indices);
      gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
      scene.add(grid);
    };

    const rectangleVertices = [
      new THREE.Vector3(-2.0, 0.5, 0),
      new THREE.Vector3(1.0, 2.5, 0),
      new THREE.Vector3(0.0, 3.5, 0),
      new THREE.Vector3(-3.0, 1.5, 0),
    ];

    const squareVertices = [
      new THREE.Vector3(-2.0, 0.5, 0),
      new THREE.Vector3(-3.0, 1.5, 0),
      new THREE.Vector3(-3.0, 0.5, 0),
      new THREE.Vector3(-2.0, -0.5, 0),
    ];

    const trapezoidVertices = [
      new THREE.Vector3(-2.0, -2.5, 0),
      new THREE.Vector3(-2.0, -0.5, 0),
      new THREE.Vector3(-0.5, 0.5, 0),
      new THREE.Vector3(-0.5, -3.5, 0),
    ];

    const shiftAmount = 4;

    // Смещение вершин вправо
    rectangleVertices.forEach(vertex => (vertex.x += shiftAmount));
    squareVertices.forEach(vertex => (vertex.x += shiftAmount));
    trapezoidVertices.forEach(vertex => (vertex.x += shiftAmount));

    const gridSize = 0.08;

    createGridForShape(rectangleVertices, gridSize);
    createGridForShape(squareVertices, gridSize);
    createGridForShape(trapezoidVertices, gridSize);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetX = 0;
    let targetY = 0;

    const onDocumentMouseMove = (event) => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      mouse.x = ((event.clientX + scrollX) / window.innerWidth) * 2 - 1;
      mouse.y = -((event.clientY + scrollY) / fixedHeight) * 2 + 1;


      const proportionalX = (mouse.x * window.innerWidth / 2) + scrollX;
      const proportionalY = (mouse.y * fixedHeight / 2) + scrollY;

      targetX = proportionalX * 4;
      targetY = proportionalY * 4;

      raycaster.setFromCamera(mouse, camera);

    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / fixedHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, fixedHeight);
    };


    window.addEventListener('resize', onWindowResize);

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);

      targetX = mouse.x * window.innerWidth * 0.00425;
      targetY = mouse.y * window.innerHeight * 0.0042;

      scene.traverse(object => {
        if (object.isLineSegments) {
          const positions = object.geometry.attributes.position;
          const colors = object.geometry.attributes.color;
          const influenceRadius = 0.6;
          let needsUpdate = false;

          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const distance = Math.sqrt((targetX - x) * (targetX - x) + (targetY - y) * (targetY - y));

            if (distance < influenceRadius) {
              const dynamicWaveAmplitude = 0.2 + 0.2 * (1 - distance / influenceRadius);


              const dynamicWaveFrequency = 5 + 5 * (1 - distance / influenceRadius);
          

              const expandingSwirlFactor = Math.sin(distance * dynamicWaveFrequency + performance.now() * 0.001) * Math.cos(distance * 2);
              const waveZ = dynamicWaveAmplitude * expandingSwirlFactor * distance;
              positions.setZ(i, waveZ);

              const colorShift = 0.5 + 0.5 * Math.sin(waveZ * 2 * Math.PI);
              const dynamicColor = new THREE.Color().lerpColors(gradientColor, gradientToColor, colorShift);
              colors.setXYZ(i, dynamicColor.r, dynamicColor.g, dynamicColor.b);
          
              needsUpdate = true;
            } else if (positions.getZ(i) !== 0) {
              positions.setZ(i, 0);
              needsUpdate = true;
            }
          }

          if (needsUpdate) {
            positions.needsUpdate = true;
            colors.needsUpdate = true;
          }
        }
      });

      updateGradientColors();

      renderer.render(scene, camera);
    };

    const updateGradientColors = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const time = performance.now() * 0.0005;
    
      if (isDarkMode) {

         const hueShift = (Math.sin(time) + 1) / 2;
         const startHue = 120;
         const endHue = 320;
        
         const hue = startHue + (endHue - startHue) * hueShift;
         const saturation = 100; 
         const lightness = 60; 
        
         gradientColor.setStyle(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
         gradientToColor.setStyle(`hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`);
      } else {
        const hueShift = (Math.sin(time) + 1) / 2; 
        const startHue = 120; 
        const endHue = 320;
    
        const hue = startHue + (endHue - startHue) * hueShift;
        const saturation = 100; 
        const lightness = 40; 
    
        gradientColor.setStyle(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        gradientToColor.setStyle(`hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`);
      }

    };

    animate();


    
    return () => {
      observer.disconnect();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    };
  }, []);

  return      <div
  ref={mountRef}
  className={`flex justify-center items-center ${className}`}
  style={{
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>

};

export default GreedBackGround;
