function load() {
    clearHTML('WebGL-output');

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    configRenderer(renderer, 0xEEFFEE, 1.0);
    configCamera(scene, camera, -90, 120, 120);

    drawA(scene);

    addSpotlight(scene);
    render(scene, renderer, camera);
}

function drawA(scene) {
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


    var radius = 15;
    var turns = 1;
    var objPerTurn = 20;

    var angleStep = (Math.PI * 2) / objPerTurn;
    var heightStep = 1;


    for (let i = 0; i < turns * objPerTurn; i++) {

            
    line = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cilinderMaterial);

    const path = new LineCurver(1, angleStep, radius, i);
    const geometry = new THREE.TubeGeometry( path, 20, 0.3, 8, false );
    const material = new THREE.MeshPhongMaterial( { color: 0xB2B4B5 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    //box = drawStair();
    box = new THREE.Mesh(stairGeometry, stairMaterial);
    cilinder = new THREE.Mesh(cilinderGeometry, cilinderMaterial);
    box.castShadow = true;
    cilinder.castShadow = true;
    const group = new THREE.Group();
    cilinder.position.z += 4.5;
    cilinder.position.y += 4;


    group.add(box);
    group.add(cilinder);
    // position
    group.position.set(
        Math.cos(angleStep * i) * radius,
        heightStep * i,
        Math.sin(angleStep * i) * radius
    );

    // rotation
    group.rotation.y = - angleStep * i;
    group.position.y += 1;
    group.rotation.y += 1;

    mesh.position.y += 9;
    mesh.rotation.y -= 1.7;
    scene.add(group);
    scene.add(mesh);
    }
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

    constructor( scale = 1, baseX = 0, baseY = 0, baseZ = 0 ) {

        super();
        
        this._baseX = baseX;
        this._baseY = baseY;
        this._baseZ = baseZ;
        this.scale = scale;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {

        const tx = this._baseX + 1;

        let tz = -Math.cos(Math.PI * t) - 5;
        let ty = -Math.sin(Math.PI * t) + 3.5 + this._baseY;

        if (t == 0)
            ty = (t+1) * this._baseY + 10;

        return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

    }
}

class LineCurver extends THREE.SplineCurve {


    constructor( scale = 1, angle, radius, index ) {

        super();
        
        this.scale = scale;
        this.angle = angle;
        this.radius = radius;
        this.index = index;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {

        const tx = Math.sin(this.angle * t * this.index) * this.radius * 1.27;
        let tz = -Math.cos(-this.angle * t * this.index) * this.radius * 1.27;
        let ty = t * this.index;


        return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

    }
}



    
var ballGeometry = new THREE.BoxGeometry(2, 2, 2);
var ballMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

/*    
for (i = 0; i < 15; i++) {
    cilinder = new THREE.Mesh(cilinderGeometry, cilinderMaterial);
    cilinder.castShadow = true;
    cilinder.position.y = (i) * height + 2 * i + 2;
    cilinder.position.x = width;
    scene.add(cilinder);

    box = new THREE.Mesh(stairGeometry, stairMaterial);
    box.castShadow = true;
    box.position.y = cilinder.position.y + 1.9;
    box.position.x = cilinder.position.x;
    box.rotation.y = i * 0.2;

    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.position.y = box.position.y + 1.9;
    ball.position.x = box.position.x;
    ball.position.z = box.position.z - 4;
    ball.rotation.y = i * 0.2;

    const group = new THREE.Group();
    group.add(box);
    group.add(ball);
    scene.add(group);

    const path = new HolderCurver(1, i * 3, i * 3);
    const geometry = new THREE.TubeGeometry( path, 20, 0.3, 8, false );
    const material = new THREE.MeshPhongMaterial( { color: 0xB2B4B5 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    scene.add( mesh );
}
*/