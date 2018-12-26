let SCENE;
let CAMERA;
let RENDERER;
let LOADING_MANAGER;
let OBJ_LOADER;
let CONTROLS;
let MOUSE;
let OBJECT;
let GUI;

main();

function main() {
    init();
    animate();
}

function init() {
    initScene();
    initCamera();
    initRenderer();
    initLoaders();
    //initControls();
    initGui();
    loadModel();
    initEventListeners();
    document.querySelector('.canvas-container').appendChild(RENDERER.domElement);
}

function initScene() {
    SCENE = new THREE.Scene();
    _initLights();
}

function _initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    SCENE.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1);
    SCENE.add(directionalLight);
}

function initCamera() {
    CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    CAMERA.position.z = 100;
}

function initRenderer() {
    RENDERER = new THREE.WebGLRenderer({ alpha: true });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}


function initLoaders() {
    LOADING_MANAGER = new THREE.LoadingManager();
    OBJ_LOADER = new THREE.GLTFLoader(LOADING_MANAGER);
}

function initControls() {
    CONTROLS = new THREE.OrbitControls(CAMERA);
    CONTROLS.minPolarAngle = Math.PI * 1 / 4;
    CONTROLS.maxPolarAngle = Math.PI * 3 / 4;
    CONTROLS.update();
}

function initGui() {
    GUI = new dat.GUI();
}

function loadModel() {
    OBJ_LOADER.load('./eva-rigged.glb', (object) => {
        let folder;
        object.scene.traverse(function(bone) {
            if (bone.type === 'Bone') {
                folder = GUI.addFolder(bone.name);

					folder.add( bone.rotation, 'x', - Math.PI * 0.5, Math.PI * 0.5 );
					folder.add( bone.rotation, 'y', - Math.PI * 0.5, Math.PI * 0.5 );
					folder.add( bone.rotation, 'z', - Math.PI * 0.5, Math.PI * 0.5 );

					folder.add( bone.scale, 'x', 0, 2 );
					folder.add( bone.scale, 'y', 0, 2 );
					folder.add( bone.scale, 'z', 0, 2 );

					folder.__controllers[ 0 ].name( "rotation.x" );
					folder.__controllers[ 1 ].name( "rotation.y" );
					folder.__controllers[ 2 ].name( "rotation.z" );

					folder.__controllers[ 3 ].name( "scale.x" );
					folder.__controllers[ 4 ].name( "scale.y" );
					folder.__controllers[ 5 ].name( "scale.z" );
            }
        });

        object.scene.scale.x = 30;
        object.scene.scale.y = 30;
        object.scene.scale.z = 30;
        object.scene.position.y = -20;
        OBJECT = object;
        SCENE.add(OBJECT.scene);
        var helper = new THREE.SkeletonHelper( OBJECT.scene );
        SCENE.add( helper );
        //console.log(object);
    });
}


function animate() {
    requestAnimationFrame(animate);
    //CONTROLS.update();
    render();
}

function render() {
    CAMERA.lookAt(SCENE.position);
    RENDERER.render(SCENE, CAMERA);
}

function initEventListeners() {
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

function onWindowResize() {
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();

    RENDERER.setSize(window.innerWidth, window.innerHeight);
}
