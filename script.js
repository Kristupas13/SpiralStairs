function load() {
    clearHTML('WebGL-output');

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    configRenderer(renderer, 0xEEFFEE, 1.0);
    configCamera(scene, camera, -90, 120, 120);

    var controls = new function() {
        this.radius = 25;
        this.turns = 1;
        this.objPerTurn = 45;
        this.angleStep = Math.PI * 2 / (this.objPerTurn * this.turns);
        this.heightStep = 1;
      }

    var gui = new dat.GUI();
    gui.add(controls, 'radius', 0, 50);
    gui.add(controls, 'turns', 0, 4);
    gui.add(controls, 'objPerTurn', 0, 40);
    gui.add(controls, 'angleStep', 0, Math.PI * 2);
    gui.add(controls, 'heightStep', 0, 3);

    drawA(scene, controls.radius, controls.turns, controls.objPerTurn, controls.angleStep, controls.heightStep);

    addSpotlight(scene);
    render(scene, renderer, camera);
}

function drawA(scene, radius, turns, objPerTurn, angleStep, heightStep) {
    var plane = createPlane(80, 80, 0xffffff);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0

    scene.add(plane);

    var width = 3;
    var depth = 10;
    var height = 1;

    var stairGeometry = new THREE.BoxGeometry(width, height, depth);
    var stairMaterial = new THREE.MeshLambertMaterial({ color: 0xdead5f });

    var cilinderGeometry = new THREE.BoxGeometry(1, 8, 1);
    var cilinderMaterial = new THREE.MeshPhongMaterial({ color: 0xB2B4B5 });


    for (let i = 0; i < turns * objPerTurn; i++) {
    box = new THREE.Mesh(stairGeometry, stairMaterial);
    cilinder = new THREE.Mesh(cilinderGeometry, cilinderMaterial);

    box.castShadow = true;
    cilinder.castShadow = true;

    cilinder.position.z += box.position.z + 4.5;
    cilinder.position.y += box.position.y + 4;

    const group = new THREE.Group();
    group.add(box);
    group.add(cilinder);
    
    group.position.set(
        Math.cos(angleStep * i) * radius,
        heightStep * i,
        Math.sin(angleStep * i) * radius
    );

    group.rotation.y = - angleStep * i + 1.6;
    group.position.y += 1;

    const path = new LineCurver(i , group.position.z, angleStep, radius);
    const geometry = new THREE.TubeGeometry( path, 20, 0.3, 8, false );
    const material = new THREE.MeshPhongMaterial( { color: 0xB2B4B5 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    scene.add(mesh);

    scene.add(group);
    }
}



class LineCurver extends THREE.SplineCurve {


    constructor(y, z, angle, radius) {

        super();
        
        this.y = y;
        this.z = z;
        this.angle = angle;
        this.radius = radius;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {
        let tx = Math.cos(this.angle * this.y * t) * (this.radius + 4.5);
        let tz = Math.sin(this.angle * this.y * t) * (this.radius + 4.5);
        let ty = this.y * t + 9;

        return optionalTarget.set( tx, ty, tz );

    }
}



















function drawCilinder() {
    
}

function drawStair() {
    const length = 4, width = 2;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshBasicMaterial( { color: 0xD2B48C } );
    const mesh = new THREE.Mesh( geometry, material ) ;

    return mesh;
}



function render(scene, renderer, camera) {
    $("#WebGL-output").append(renderer.domElement);
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    render();

    function render() {
        // render
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        controls.update();
    }
}

function addSpotlight(scene) {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function clearHTML(element) {
    document.getElementById(element).innerHTML = "";
}

function configRenderer(renderer, color, opacity) {
    renderer.setClearColor(color, opacity);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
}

function configCamera(scene, camera, x, y, z) {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

function createPlane(height, width, color) {
    var planeGeometry = new THREE.PlaneGeometry(height, width);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: color });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    return plane;
}


class HolderCurver extends THREE.SplineCurve {

    _baseX;
    _baseY;
    _baseZ;

    constructor( baseX = 0, baseY = 0, baseZ = 0 ) {

        super();
        
        this._baseX = baseX;
        this._baseY = baseY;
        this._baseZ = baseZ;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {

        const tx = this._baseX + 1;

        let tz = -Math.cos(Math.PI * t) - 5;
        let ty = -Math.sin(Math.PI * t) + 3.5 + this._baseY;

        if (t == 0)
            ty = (t+1) * this._baseY + 10;

        return optionalTarget.set( tx, ty, tz );

    }
}
