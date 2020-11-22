function load() {
    clearHTML('WebGL-output');

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    configRenderer(renderer, 0xEEFFEE, 1.0);
    configCamera(scene, camera, -90, 120, 120);

    var controls = new function() {
        this.radius = 25;
        this.objects = 25;
        this.angleStep = Math.PI * 2 / this.objects;
        this.heightStep = 1;
      }

    var gui = new dat.GUI();
    gui.add(controls, 'radius', 0, 50);
    gui.add(controls, 'objects', 0, 50);
    gui.add(controls, 'angleStep', 0.05, 0.25);
    gui.add(controls, 'heightStep', 0, 3);
    
    addListeners(gui, scene, renderer, camera);


    drawA(scene, controls.radius, 1, controls.objects, controls.angleStep, controls.heightStep);

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

    var cilinderGeometry = new THREE.BoxGeometry(1, 8, 1);
    var cilinderMaterial = new THREE.MeshPhongMaterial({ color: 0xB2B4B5 });

    for (let i = 0; i < turns * objPerTurn; i++) {
    const group = new THREE.Group();
    var stair;
    var bStair;

    if (i % 2 != 0) {
        stair = drawStairB();
    } else {
        stair = drawStairA();
        let path = new HolderCurver(stair.position.x, stair.position.y, stair.position.z);
        let geo = new THREE.TubeGeometry( path, 20, 1, 20, false );
        let cilinder = new THREE.Mesh( geo, cilinderMaterial );
        cilinder.castShadow = true;

        cilinder.position.z += stair.position.z + 10;
        cilinder.position.y += stair.position.y + 0.4;
        cilinder.position.x += stair.position.x + 1.5;
        cilinder.rotation.y += Math.PI;
        cilinder.scale.x = 0.5;
        cilinder.scale.z = 0.5;

        group.add(cilinder);
    }
    stair.castShadow = true;

    underStairBox = drawUnderBox(heightStep);
    underStairBox.castShadow = true;

    if (i != 0) {
        underStairBoxCylinder = drawUnderBoxCylinder(heightStep, angleStep, radius);
        underStairBoxCylinder.castShadow = true;
        group.add(underStairBoxCylinder);
    }
    group.add(stair);
    group.add(underStairBox);

    group.position.set(
        Math.cos(angleStep * i) * radius,
        heightStep * i,
        Math.sin(angleStep * i) * radius
    );

    group.rotation.y = - angleStep * i + 1.43;
    group.position.y += 1;

    const path = new LineCurver(i , group.position.z, angleStep, radius, heightStep);
    const geometry = new THREE.TubeGeometry( path, 20, 0.3, 8, false );
    const material = new THREE.MeshPhongMaterial( { color: 0xB2B4B5 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;

    scene.add(mesh);

    scene.add(group);
    }
}



class LineCurver extends THREE.SplineCurve {


    constructor(y, z, angle, radius, heightStep) {

        super();
        
        this.y = y;
        this.z = z;
        this.angle = angle;
        this.radius = radius;
        this.heightStep = heightStep;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {
        let tx = Math.cos(this.angle * this.y * t) * (this.radius + 10.5);
        let tz = Math.sin(this.angle * this.y * t) * (this.radius + 10.5);
        let ty = this.y * t * this.heightStep + 9;

        return optionalTarget.set( tx, ty, tz );

    }
}

function drawStairA() {
    const stair = new THREE.Shape();

    stair.bezierCurveTo( 4, 4, 10, 5, 10, 0 );

    const extrudeSettings = { amount: 1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
    
    let stairGeometry = new THREE.ExtrudeGeometry( stair, extrudeSettings );
    var stairMaterial = new THREE.MeshLambertMaterial({ color: 0xdead5f });

    const mesh = new THREE.Mesh( stairGeometry, stairMaterial );
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    mesh.rotation.y = Math.PI;
    return mesh;
}

function drawStairB() {
    const stair = new THREE.Shape();

    stair.bezierCurveTo( 4, 4, 10, 5, 10, 0 );


    const extrudeSettings = { amount: 1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
    
    const stairGeometry = new THREE.ExtrudeGeometry( stair, extrudeSettings );
    var stairMaterial = new THREE.MeshLambertMaterial({ color: 0xdead5f });

    const mesh = new THREE.Mesh( stairGeometry, stairMaterial );
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    mesh.rotation.y = Math.PI;
    mesh.scale.x = -1;
    mesh.position.z += 10;
    return mesh;
}

function drawUnderBox(heightStep) {
    var geometry = new THREE.CylinderGeometry( 0.5, 0.5, heightStep, 32 );
    var material = new THREE.MeshPhongMaterial({ color: 0xB2B4B5 });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.z += 5;
    mesh.position.x += 1;
    mesh.position.y -= heightStep / 2;
    return mesh;
}

function drawUnderBoxCylinder(heightStep, angleStep, radius) {

    var geometry = new THREE.CylinderGeometry( 0.3, 0.3, heightStep*0.9 + 6, 32 );
    var material = new THREE.MeshPhongMaterial({ color: 0xB2B4B5 });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.z += 4;
    mesh.position.x += 4.8;
    mesh.position.y -= heightStep;

    mesh.rotation.x += Math.cos(angleStep);
    mesh.rotation.z -= Math.sin(angleStep);
    mesh.rotation.z += Math.PI/2;
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

        const tx = this._baseX;

        let tz = -Math.cos(Math.PI * t);
        let ty = -Math.sin(Math.PI * t);

        if (t == 0)
            ty = (t+1) * this._baseY + 7.8;

        return optionalTarget.set( tx, ty, tz );

    }
}

function addListeners(gui, scene) {
    gui.__controllers.forEach(c => {
        c.onChange(() => {
            while(scene.children.length > 0){ 
                scene.remove(scene.children[0]); 
            }            

            drawA(scene, c.object.radius, 1, c.object.objects, c.object.angleStep, c.object.heightStep);
            addSpotlight(scene);
        });
    })
}