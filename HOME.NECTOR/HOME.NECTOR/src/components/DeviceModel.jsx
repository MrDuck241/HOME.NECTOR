import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DeviceModel = ({path}) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scena
    const scene = new THREE.Scene();
    scene.background = null;

    // Kamera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(100, 0, 0); // Widok z boku
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Ustaw kolor tła na czarny (0x000000) i przezroczystość na 0
    container.appendChild(renderer.domElement);

    // Oświetlenie
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);

    // Ładowanie modelu STL
    const loader = new STLLoader();
    loader.load(
      `3D_models/${path}.stl`,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0x111111,
          shininess: 200,
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Dopasowanie modelu
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());

        mesh.position.sub(center);

        scene.add(mesh);
      },
      undefined,
      (error) => console.error("Error loading STL:", error)
    );

    // Interaktywność
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Włączenie tłumienia ruchu dla płynniejszych obrotów
    controls.dampingFactor = 0.05; // Ustawienie intensywności tłumienia
    controls.mouseButtons.RIGHT = null; // Zablokowanie przycisku prawym myszki

    // Animacja
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Aktualizacja kontrolera
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default DeviceModel;
