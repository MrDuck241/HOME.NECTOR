import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const RenderModel = ({ path }) => {
  const containerRef = useRef();
  const [fileExists, setFileExists] = useState(false); // State to track if the file exists

  const checkFileExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" }); // Use HEAD request to check for file existence
      if (response.ok) {
        setFileExists(true); // If file exists, update the state
      } else {
        setFileExists(false); // If file doesn't exist, update the state
      }
    } catch (error) {
      console.error("Error checking file existence:", error);
      setFileExists(false); // In case of error, assume file doesn't exist
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Check if the file exists
    checkFileExists(`${path}.stl`);

    if (!fileExists) {
      return; // Exit early if the file doesn't exist
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(100, 0, 0); // Side View
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);

    // Loading stl model
    const loader = new STLLoader();
    loader.load(
      `${path}.stl`,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0x111111,
          shininess: 200,
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Model fitting
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());

        mesh.position.sub(center);

        scene.add(mesh);
      },
      undefined,
      (error) => console.error("Error loading STL:", error)
    );

    // Interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Turn on motion damping for smoother rotations
    controls.dampingFactor = 0.05; // Setting the damping intensity
    controls.mouseButtons.RIGHT = null; // Locking the right mouse button

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Controler update
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, [fileExists, path]); // Re-run effect when fileExists or path changes

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default RenderModel;
