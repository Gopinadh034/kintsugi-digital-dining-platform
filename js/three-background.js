/**
 * three-background.js - Interactive 3D Japanese Restaurant Motion Background & 3D Menu Display
 * Built with Three.js for luxury WebGL rendering with interactive dish carousel,
 * camera transitions, sakura petals, steam simulation, and mouse parallax.
 */

class Japanese3DStage {
    constructor() {
        this.container = document.getElementById('webgl-canvas-container');
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.dishesGroup = null;
        this.dishObjects = [];
        this.sakuraParticles = null;
        this.steamParticles = null;
        this.ambientLights = [];
        this.clock = new THREE.Clock();

        // Interaction state
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.currentDishIndex = 0;
        this.targetRotationY = 0;
        this.currentRotationY = 0;
        this.isOrbiting = true;
        this.orbitSpeed = 0.003;
        this.cameraMode = 'cinematic'; // 'cinematic', 'orbit', 'focus', 'topdown'

        this.init();
    }

    init() {
        // 1. Create Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

        // 2. Camera setup
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(0, 2.8, 7.5);
        this.camera.lookAt(0, 0.2, 0);

        // 3. Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.3;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        // 4. Setup Lighting
        this.setupLighting();

        // 5. Build Environment & 3D Dish Carousel
        this.buildStageEnvironment();
        this.buildDishesCarousel();

        // 6. Build Sakura Petals & Steam Particles
        this.buildSakuraParticleSystem();
        this.buildSteamParticles();

        // 7. Event Listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                this.onMouseMove(e.touches[0]);
            }
        }, { passive: true });
        
        // 8. Animation Loop
        this.animate();
    }

    setupLighting() {
        // Ambient soft zen light
        const ambientLight = new THREE.AmbientLight(0x2a2430, 1.8);
        this.scene.add(ambientLight);

        // Warm Japanese golden spotlight
        const warmSpot = new THREE.SpotLight(0xffb347, 4.2);
        warmSpot.position.set(4, 7, 5);
        warmSpot.angle = Math.PI / 4;
        warmSpot.penumbra = 0.8;
        warmSpot.castShadow = true;
        warmSpot.shadow.mapSize.width = 1024;
        warmSpot.shadow.mapSize.height = 1024;
        warmSpot.shadow.bias = -0.001;
        this.scene.add(warmSpot);

        // Cool Moonlit Crimson rim light
        const rimLight = new THREE.DirectionalLight(0xff3366, 2.5);
        rimLight.position.set(-6, 4, -4);
        this.scene.add(rimLight);

        // Underglow teal / matcha point light for zen atmosphere
        const zenPointLight = new THREE.PointLight(0x10b981, 1.8, 12);
        zenPointLight.position.set(0, -0.5, 0);
        this.scene.add(zenPointLight);

        // Amber hearth glow point light
        const emberGlow = new THREE.PointLight(0xff6b35, 2.0, 10);
        emberGlow.position.set(2, 1, 2);
        this.scene.add(emberGlow);
    }

    buildStageEnvironment() {
        // Dark Japanese Slate Stone Pedestal Platform
        const pedestalGeo = new THREE.CylinderGeometry(4.2, 4.6, 0.4, 64);
        const pedestalMat = new THREE.MeshStandardMaterial({
            color: 0x14141c,
            roughness: 0.7,
            metalness: 0.3
        });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.y = -1.2;
        pedestal.receiveShadow = true;
        this.scene.add(pedestal);

        // Golden Kintsugi Ring Accent
        const ringGeo = new THREE.TorusGeometry(4.25, 0.04, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xdfb15b,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x5a4115,
            emissiveIntensity: 0.4
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -1.0;
        this.scene.add(ring);

        // Outer Zen Circle
        const outerRingGeo = new THREE.TorusGeometry(5.2, 0.02, 16, 100);
        const outerRingMat = new THREE.MeshBasicMaterial({
            color: 0xff3355,
            transparent: true,
            opacity: 0.4
        });
        const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        outerRing.rotation.x = Math.PI / 2;
        outerRing.position.y = -1.18;
        this.scene.add(outerRing);
    }

    buildDishesCarousel() {
        this.dishesGroup = new THREE.Group();
        this.scene.add(this.dishesGroup);

        const radius = 3.2;
        const totalDishes = 6;

        // Dish Data Specs for 3D procedural modeling
        const dishSpecs = [
            { name: 'Imperial Dragon Nigiri Platter', type: 'sushi', color: 0xff4b2b },
            { name: 'Signature Tonkotsu Black Ramen', type: 'ramen', color: 0xf59e0b },
            { name: 'Miyazaki A5 Wagyu Robata', type: 'wagyu', color: 0xef4444 },
            { name: 'Ceremonial Matcha Mousse Dome', type: 'matcha', color: 0x10b981 },
            { name: 'Crispy Truffle Gyoza Dumplings', type: 'gyoza', color: 0xfbbf24 },
            { name: 'Junmai Daiginjo Sake Tokkuri', type: 'sake', color: 0x60a5fa }
        ];

        for (let i = 0; i < totalDishes; i++) {
            const angle = (i / totalDishes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const dishWrapper = new THREE.Group();
            dishWrapper.position.set(x, 0, z);
            dishWrapper.rotation.y = -angle - Math.PI / 2; // Face outwards

            const dishModel = this.createProceduralDish(dishSpecs[i]);
            dishWrapper.add(dishModel);

            // Add subtle floating glow base beneath each dish
            const glowPlateGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.05, 32);
            const glowPlateMat = new THREE.MeshStandardMaterial({
                color: 0x0f0f18,
                roughness: 0.3,
                metalness: 0.8
            });
            const glowPlate = new THREE.Mesh(glowPlateGeo, glowPlateMat);
            glowPlate.position.y = -0.05;
            glowPlate.receiveShadow = true;
            dishWrapper.add(glowPlate);

            this.dishesGroup.add(dishWrapper);
            this.dishObjects.push({
                group: dishWrapper,
                spec: dishSpecs[i],
                initialAngle: angle,
                index: i
            });
        }
    }

    createProceduralDish(spec) {
        const group = new THREE.Group();

        if (spec.type === 'sushi') {
            // Dark ceramic sushi slate
            const slateGeo = new THREE.BoxGeometry(1.5, 0.08, 0.9);
            const slateMat = new THREE.MeshStandardMaterial({
                color: 0x1c1c24,
                roughness: 0.4,
                metalness: 0.6
            });
            const slate = new THREE.Mesh(slateGeo, slateMat);
            slate.castShadow = true;
            slate.receiveShadow = true;
            group.add(slate);

            // Sushi Nigiri pieces (Rice + Salmon / Tuna + Nori ribbon)
            const sushiColors = [0xff5733, 0xd81159, 0xff7b25];
            for (let s = -1; s <= 1; s++) {
                const nigiriGroup = new THREE.Group();
                nigiriGroup.position.set(s * 0.42, 0.1, 0);

                // Rice Base
                const riceGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.28, 16);
                riceGeo.rotateZ(Math.PI / 2);
                const riceMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.9 });
                const rice = new THREE.Mesh(riceGeo, riceMat);
                rice.scale.set(1.2, 0.9, 0.75);
                nigiriGroup.add(rice);

                // Sashimi Topping
                const fishGeo = new THREE.SphereGeometry(0.16, 16, 16);
                fishGeo.scale(1.4, 0.35, 0.8);
                const fishMat = new THREE.MeshStandardMaterial({
                    color: sushiColors[s + 1],
                    roughness: 0.25,
                    metalness: 0.15
                });
                const fish = new THREE.Mesh(fishGeo, fishMat);
                fish.position.y = 0.11;
                nigiriGroup.add(fish);

                // Nori strip
                const noriGeo = new THREE.BoxGeometry(0.08, 0.24, 0.28);
                const noriMat = new THREE.MeshStandardMaterial({ color: 0x09140e, roughness: 0.9 });
                const nori = new THREE.Mesh(noriGeo, noriMat);
                nori.position.y = 0.05;
                nigiriGroup.add(nori);

                // Gold flake accent
                const goldGeo = new THREE.SphereGeometry(0.025, 8, 8);
                const goldMat = new THREE.MeshStandardMaterial({
                    color: 0xffd700,
                    metalness: 0.95,
                    roughness: 0.1
                });
                const gold = new THREE.Mesh(goldGeo, goldMat);
                gold.position.set(0, 0.18, 0);
                nigiriGroup.add(gold);

                group.add(nigiriGroup);
            }

            // Wasabi dollop & Pickled ginger
            const wasabiGeo = new THREE.ConeGeometry(0.08, 0.12, 16);
            const wasabiMat = new THREE.MeshStandardMaterial({ color: 0x76b852, roughness: 0.8 });
            const wasabi = new THREE.Mesh(wasabiGeo, wasabiMat);
            wasabi.position.set(0.6, 0.1, -0.25);
            group.add(wasabi);

        } else if (spec.type === 'ramen') {
            // Dark ceramic Ramen Bowl
            const bowlGeo = new THREE.CylinderGeometry(0.75, 0.35, 0.55, 32, 1, true);
            const bowlMat = new THREE.MeshStandardMaterial({
                color: 0x181822,
                roughness: 0.3,
                metalness: 0.7,
                side: THREE.DoubleSide
            });
            const bowl = new THREE.Mesh(bowlGeo, bowlMat);
            bowl.position.y = 0.25;
            bowl.castShadow = true;
            group.add(bowl);

            // Golden Tonkotsu Broth Surface
            const brothGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.05, 32);
            const brothMat = new THREE.MeshStandardMaterial({
                color: 0xb45309,
                roughness: 0.1,
                metalness: 0.3,
                emissive: 0x78350f,
                emissiveIntensity: 0.3
            });
            const broth = new THREE.Mesh(brothGeo, brothMat);
            broth.position.y = 0.42;
            group.add(broth);

            // Ramen Noodles mesh texture
            const noodlesGeo = new THREE.TorusGeometry(0.4, 0.07, 8, 24);
            const noodlesMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
            const noodles = new THREE.Mesh(noodlesGeo, noodlesMat);
            noodles.rotation.x = Math.PI / 2;
            noodles.position.set(0, 0.44, 0);
            group.add(noodles);

            // Ajitsuke Soft-boiled Egg Halves
            const eggGeo = new THREE.SphereGeometry(0.14, 16, 16);
            eggGeo.scale(1, 0.6, 0.8);
            const eggWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfefefe, roughness: 0.5 });
            const egg = new THREE.Mesh(eggGeo, eggWhiteMat);
            egg.position.set(-0.25, 0.46, 0.15);

            const yolkGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const yolkMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.2 });
            const yolk = new THREE.Mesh(yolkGeo, yolkMat);
            yolk.position.set(-0.25, 0.49, 0.15);
            group.add(egg);
            group.add(yolk);

            // Chashu Pork Slices
            const porkGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16);
            const porkMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
            const pork = new THREE.Mesh(porkGeo, porkMat);
            pork.position.set(0.2, 0.45, -0.15);
            pork.rotation.z = 0.2;
            group.add(pork);

            // Nori sheet standing in bowl
            const noriSheetGeo = new THREE.BoxGeometry(0.02, 0.4, 0.3);
            const noriSheetMat = new THREE.MeshStandardMaterial({ color: 0x081c15, roughness: 0.9 });
            const noriSheet = new THREE.Mesh(noriSheetGeo, noriSheetMat);
            noriSheet.position.set(0.48, 0.48, 0);
            noriSheet.rotation.z = -0.3;
            group.add(noriSheet);

            // Chopsticks resting across bowl
            const stickGeo = new THREE.CylinderGeometry(0.015, 0.008, 1.4, 8);
            const stickMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4 });
            const stick1 = new THREE.Mesh(stickGeo, stickMat);
            stick1.rotation.z = Math.PI / 2.2;
            stick1.position.set(0, 0.58, -0.2);
            const stick2 = stick1.clone();
            stick2.position.set(0, 0.58, -0.26);
            group.add(stick1);
            group.add(stick2);

        } else if (spec.type === 'wagyu') {
            // Hot Stone / Iron Robata Skillet
            const skilletGeo = new THREE.CylinderGeometry(0.75, 0.7, 0.1, 32);
            const skilletMat = new THREE.MeshStandardMaterial({
                color: 0x111116,
                roughness: 0.8,
                metalness: 0.4
            });
            const skillet = new THREE.Mesh(skilletGeo, skilletMat);
            skillet.position.y = 0.06;
            group.add(skillet);

            // Wagyu Beef Cubes on bamboo skewers
            const cubeMat = new THREE.MeshStandardMaterial({
                color: 0x7f1d1d,
                roughness: 0.4,
                metalness: 0.2
            });

            for (let k = -0.3; k <= 0.3; k += 0.3) {
                const skewerGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.1, 8);
                skewerGeo.rotateZ(Math.PI / 2);
                const skewerMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
                const skewer = new THREE.Mesh(skewerGeo, skewerMat);
                skewer.position.set(0, 0.22, k);
                group.add(skewer);

                for (let c = -0.25; c <= 0.25; c += 0.25) {
                    const cubeGeo = new THREE.BoxGeometry(0.16, 0.14, 0.16);
                    const cube = new THREE.Mesh(cubeGeo, cubeMat);
                    cube.position.set(c, 0.22, k);
                    group.add(cube);
                }
            }

            // Truffle glaze sheen & scallion garnish
            const scallionGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8);
            const scallionMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
            for (let g = 0; g < 6; g++) {
                const scallion = new THREE.Mesh(scallionGeo, scallionMat);
                scallion.position.set(
                    (Math.random() - 0.5) * 0.6,
                    0.32,
                    (Math.random() - 0.5) * 0.6
                );
                group.add(scallion);
            }

        } else if (spec.type === 'matcha') {
            // White Porcelain Minimalist Plate
            const plateGeo = new THREE.CylinderGeometry(0.7, 0.6, 0.06, 32);
            const plateMat = new THREE.MeshStandardMaterial({
                color: 0x1f1f2e,
                roughness: 0.15,
                metalness: 0.4
            });
            const plate = new THREE.Mesh(plateGeo, plateMat);
            plate.position.y = 0.04;
            group.add(plate);

            // Ceremonial Matcha Mousse Dome
            const domeGeo = new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const domeMat = new THREE.MeshStandardMaterial({
                color: 0x15803d,
                roughness: 0.4,
                metalness: 0.1,
                emissive: 0x14532d,
                emissiveIntensity: 0.3
            });
            const dome = new THREE.Mesh(domeGeo, domeMat);
            dome.position.y = 0.07;
            group.add(dome);

            // Edible 24k Gold leaf on top
            const goldCrownGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.06, 8);
            const goldCrownMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.95,
                roughness: 0.1
            });
            const goldCrown = new THREE.Mesh(goldCrownGeo, goldCrownMat);
            goldCrown.position.y = 0.44;
            group.add(goldCrown);

            // Azuki Red Bean Mochi spheres
            const mochiGeo = new THREE.SphereGeometry(0.09, 16, 16);
            const mochiMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.5 });
            const mochi1 = new THREE.Mesh(mochiGeo, mochiMat);
            mochi1.position.set(-0.38, 0.12, 0.2);
            const mochi2 = new THREE.Mesh(mochiGeo, mochiMat);
            mochi2.position.set(-0.25, 0.12, 0.36);
            group.add(mochi1);
            group.add(mochi2);

        } else if (spec.type === 'gyoza') {
            // Cast iron Pan
            const panGeo = new THREE.CylinderGeometry(0.7, 0.65, 0.08, 32);
            const panMat = new THREE.MeshStandardMaterial({ color: 0x15151b, roughness: 0.8 });
            const pan = new THREE.Mesh(panGeo, panMat);
            pan.position.y = 0.04;
            group.add(pan);

            // Gyoza Dumplings arranged radially
            for (let d = 0; d < 5; d++) {
                const dAngle = (d / 5) * Math.PI * 2;
                const gyozaGeo = new THREE.TorusGeometry(0.18, 0.07, 8, 16, Math.PI);
                const gyozaMat = new THREE.MeshStandardMaterial({
                    color: 0xfef08a,
                    roughness: 0.5
                });
                const gyoza = new THREE.Mesh(gyozaGeo, gyozaMat);
                gyoza.rotation.x = Math.PI / 2;
                gyoza.rotation.z = dAngle;
                gyoza.position.set(Math.cos(dAngle) * 0.35, 0.14, Math.sin(dAngle) * 0.35);
                group.add(gyoza);
            }

            // Dip bowl in center
            const dipGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.1, 16);
            const dipMat = new THREE.MeshStandardMaterial({ color: 0x3b0764 });
            const dip = new THREE.Mesh(dipGeo, dipMat);
            dip.position.y = 0.09;
            group.add(dip);

        } else if (spec.type === 'sake') {
            // Japanese Sake Carafe (Tokkuri)
            const tokkuriGeo = new THREE.CylinderGeometry(0.14, 0.28, 0.7, 32);
            const tokkuriMat = new THREE.MeshStandardMaterial({
                color: 0x2e384d,
                roughness: 0.2,
                metalness: 0.7,
                emissive: 0x1e293b,
                emissiveIntensity: 0.3
            });
            const tokkuri = new THREE.Mesh(tokkuriGeo, tokkuriMat);
            tokkuri.position.set(-0.15, 0.4, 0);
            group.add(tokkuri);

            // Neck & mouth of Tokkuri
            const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.25, 32);
            const neck = new THREE.Mesh(neckGeo, tokkuriMat);
            neck.position.set(-0.15, 0.8, 0);
            group.add(neck);

            // Ochoko Sake Cups
            const cupGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.18, 16);
            const cupMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.3 });
            const cup1 = new THREE.Mesh(cupGeo, cupMat);
            cup1.position.set(0.3, 0.12, 0.15);
            const cup2 = new THREE.Mesh(cupGeo, cupMat);
            cup2.position.set(0.35, 0.12, -0.2);
            group.add(cup1);
            group.add(cup2);
        }

        return group;
    }

    buildSakuraParticleSystem() {
        const particleCount = 120;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const rotations = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = Math.random() * 8 + 1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

            rotations[i * 3] = Math.random() * Math.PI;
            rotations[i * 3 + 1] = Math.random() * Math.PI;
            rotations[i * 3 + 2] = Math.random() * Math.PI;

            scales[i] = Math.random() * 0.12 + 0.06;
            speeds[i * 3] = (Math.random() - 0.5) * 0.01;
            speeds[i * 3 + 1] = -Math.random() * 0.015 - 0.008; // Falling speed
            speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // Create Sakura Petal Instanced Meshes for high performance and realism
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.quadraticCurveTo(0.1, 0.15, 0.08, 0.3);
        petalShape.quadraticCurveTo(0, 0.35, -0.08, 0.3);
        petalShape.quadraticCurveTo(-0.1, 0.15, 0, 0);

        const petalGeo = new THREE.ShapeGeometry(petalShape);
        const petalMat = new THREE.MeshStandardMaterial({
            color: 0xffa8ba,
            emissive: 0xff4071,
            emissiveIntensity: 0.3,
            roughness: 0.4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85
        });

        this.sakuraMesh = new THREE.InstancedMesh(petalGeo, petalMat, particleCount);
        this.sakuraMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.sakuraData = { positions, rotations, scales, speeds, count: particleCount };

        const dummy = new THREE.Object3D();
        for (let i = 0; i < particleCount; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            dummy.rotation.set(rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2]);
            dummy.scale.setScalar(scales[i]);
            dummy.updateMatrix();
            this.sakuraMesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(this.sakuraMesh);
    }

    buildSteamParticles() {
        const steamCount = 40;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(steamCount * 3);

        for (let i = 0; i < steamCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 0.5;
            pos[i * 3 + 1] = Math.random() * 1.5 + 0.4;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        // Create glowing soft particle points
        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });

        this.steamParticles = new THREE.Points(geo, mat);
        this.scene.add(this.steamParticles);
    }

    rotateToDish(index) {
        if (index < 0 || index >= this.dishObjects.length) return;
        this.currentDishIndex = index;
        const targetAngle = -(index / this.dishObjects.length) * Math.PI * 2;
        this.targetRotationY = targetAngle;
        this.isOrbiting = false;

        // Trigger micro camera focus pulse
        if (this.camera) {
            this.camera.position.z = 6.8;
            setTimeout(() => {
                if (this.camera) this.camera.position.z = 7.5;
            }, 600);
        }
    }

    nextDish() {
        const nextIdx = (this.currentDishIndex + 1) % this.dishObjects.length;
        this.rotateToDish(nextIdx);
        return nextIdx;
    }

    prevDish() {
        const prevIdx = (this.currentDishIndex - 1 + this.dishObjects.length) % this.dishObjects.length;
        this.rotateToDish(prevIdx);
        return prevIdx;
    }

    toggleOrbit() {
        this.isOrbiting = !this.isOrbiting;
        return this.isOrbiting;
    }

    setCameraMode(mode) {
        this.cameraMode = mode;
        if (mode === 'topdown') {
            this.camera.position.set(0, 7.5, 0.1);
            this.camera.lookAt(0, 0, 0);
        } else if (mode === 'focus') {
            this.camera.position.set(0, 1.8, 4.5);
            this.camera.lookAt(0, 0.4, 0);
        } else {
            // cinematic default
            this.camera.position.set(0, 2.8, 7.5);
            this.camera.lookAt(0, 0.2, 0);
        }
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    onResize() {
        if (!this.camera || !this.renderer) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // 1. Mouse interpolation with smooth inertia
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // 2. Parallax Camera motion
        if (this.cameraMode === 'cinematic') {
            this.camera.position.x = this.mouseX * 0.8;
            this.camera.position.y = 2.8 - this.mouseY * 0.5;
            this.camera.lookAt(0, 0.2, 0);
        }

        // 3. Carousel Rotation & Dish Floating Animation
        if (this.isOrbiting) {
            this.targetRotationY += this.orbitSpeed;
        }

        // Smoothly interpolate carousel rotation
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.06;
        if (this.dishesGroup) {
            this.dishesGroup.rotation.y = this.currentRotationY;

            // Subtle bobbing / floating animation for each dish
            this.dishObjects.forEach((dish, idx) => {
                const bobOffset = Math.sin(elapsedTime * 1.8 + idx * 1.2) * 0.08;
                dish.group.position.y = bobOffset;
                dish.group.rotation.x = Math.sin(elapsedTime * 1.2 + idx) * 0.04;
            });
        }

        // 4. Update Sakura Petals Falling & Wind
        if (this.sakuraMesh && this.sakuraData) {
            const dummy = new THREE.Object3D();
            const { positions, rotations, scales, speeds, count } = this.sakuraData;

            for (let i = 0; i < count; i++) {
                // Apply wind + mouse influence
                positions[i * 3] += speeds[i * 3] + Math.sin(elapsedTime + i) * 0.008 + this.mouseX * 0.01;
                positions[i * 3 + 1] += speeds[i * 3 + 1];
                positions[i * 3 + 2] += speeds[i * 3 + 2] + Math.cos(elapsedTime + i) * 0.008;

                // Tumble rotation
                rotations[i * 3] += 0.015;
                rotations[i * 3 + 1] += 0.02;
                rotations[i * 3 + 2] += 0.01;

                // Reset petal if fallen below ground
                if (positions[i * 3 + 1] < -2.0) {
                    positions[i * 3 + 1] = 8.0;
                    positions[i * 3] = (Math.random() - 0.5) * 16;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
                }

                dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                dummy.rotation.set(rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2]);
                dummy.scale.setScalar(scales[i]);
                dummy.updateMatrix();
                this.sakuraMesh.setMatrixAt(i, dummy.matrix);
            }
            this.sakuraMesh.instanceMatrix.needsUpdate = true;
        }

        // 5. Update Steam Rising
        if (this.steamParticles) {
            const posAttr = this.steamParticles.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                let y = posAttr.getY(i) + 0.006;
                if (y > 2.2) y = 0.4;
                posAttr.setY(i, y);
            }
            posAttr.needsUpdate = true;
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Robust stage instantiation when DOM is ready or already loaded
function initJapanese3DStage() {
    if (window.stage3D) return;
    const container = document.getElementById('webgl-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
        setTimeout(initJapanese3DStage, 80);
        return;
    }

    try {
        window.stage3D = new Japanese3DStage();
    } catch (e) {
        console.error('Failed to initialize 3D Stage:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJapanese3DStage);
} else {
    initJapanese3DStage();
}

