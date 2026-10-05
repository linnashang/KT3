import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Сцена, камера и рендер
const canvas = document.querySelector('.scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#080b14');

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 100);
camera.position.set(3.4, 3.8, 10.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// Управление мышью
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;

// Свет
const ambientLight = new THREE.HemisphereLight('#cbdcff', '#121426', 1.2);

const mainLight = new THREE.DirectionalLight('#ffffff', 3.5);
mainLight.position.set(4, 7, 5);
mainLight.castShadow = true;

const blueLight = new THREE.PointLight('#6ea8ff', 22, 14);
blueLight.position.set(-4, 3, 3);

const violetLight = new THREE.PointLight('#9d7cff', 18, 14);
violetLight.position.set(4, 3, -3);

scene.add(ambientLight, mainLight, blueLight, violetLight);

// Пол и платформа
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: '#0d1220', roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.3;
floor.receiveShadow = true;
scene.add(floor);

const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.7, 2.85, 0.35, 64),
    new THREE.MeshStandardMaterial({ color: '#20263b', metalness: 0.55, roughness: 0.35 })
);
platform.position.y = -0.05;
platform.receiveShadow = true;
scene.add(platform);

// Простые 3D-объекты
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshStandardMaterial({ color: '#9dcaff', metalness: 0.5, roughness: 0.25 })
);
sphere.position.set(-3.25, 0.85, 1.1);
scene.add(sphere);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.65, 0.65),
    new THREE.MeshStandardMaterial({ color: '#9b94d4', metalness: 0.45, roughness: 0.3 })
);
cube.position.set(3.4, 1, -0.2);
scene.add(cube);

const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.095, 20, 64),
    new THREE.MeshStandardMaterial({ color: '#9899ee', metalness: 0.55, roughness: 0.25 })
);
ring.position.set(-3.6, 2.65, -1);
scene.add(ring);

// Импорт BoomBox.glb
const modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new GLTFLoader();
loader.load('models/BoomBox.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(216.71);
    model.position.y = 2.258;

    model.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    modelGroup.add(model);
});

// Анимация
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    modelGroup.rotation.y += 0.0015;
    sphere.position.y = 0.85 + Math.sin(time) * 0.18;
    cube.rotation.x += 0.004;
    cube.rotation.y += 0.006;
    ring.rotation.y += 0.005;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Размер окна
window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
