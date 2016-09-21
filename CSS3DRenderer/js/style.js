/**
 * Created by Administrator on 2016/9/8.
 */
var camera, scene, renderer,deg2rad;
var geometry, material, mesh;
var target = new THREE.Vector3();

var lon = 90, lat = 0;
var phi = 0, theta = 0;

var touchX, touchY;

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.eulerOrder = "ZXY";
    scene = new THREE.Scene();
    var sides = [
        {
            url: 'img/posx.jpg',
            position: new THREE.Vector3( -255, 0, 0 ),
            rotation: new THREE.Vector3( 0, Math.PI / 2, 0 )
        },
        {
            url: 'img/negx.jpg',
            position: new THREE.Vector3( 255, 0, 0 ),
            rotation: new THREE.Vector3( 0, -Math.PI / 2, 0 )
        },
        {
            url: 'img/posy.jpg',
            position: new THREE.Vector3( 0,  255, 0 ),
            rotation: new THREE.Vector3( Math.PI / 2, 0, Math.PI )
        },
        {
            url: 'img/negy.jpg',
            position: new THREE.Vector3( 0, -255, 0 ),
            rotation: new THREE.Vector3( - Math.PI / 2, 0, Math.PI )
        },
        {
            url: 'img/posz.jpg',
            position: new THREE.Vector3( 0, 0,  255 ),
            rotation: new THREE.Vector3( 0, Math.PI, 0 )
        },
        {
            url: 'img/negz.jpg',
            position: new THREE.Vector3( 0, 0, -255 ),
            rotation: new THREE.Vector3( 0, 0, 0 )
        }
    ];
    for ( var i = 0; i < sides.length; i ++ ) {

        var side = sides[ i ];

        var element = document.createElement( 'img' );
        element.width = 512; // 2 pixels extra to close the gap.
        element.src = side.url;

        var object = new THREE.CSS3DObject( element );
        object.position = side.position;
        object.rotation = side.rotation;
        scene.add( object );

    }
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.getElementById( 'container' ).appendChild( renderer.domElement );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('deviceorientation', ondeviceorientation, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth,window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    lon -= movementX * 0.1;
    lat += movementY * 0.1;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
}

/**
 * 鼠标滚轮改变相机焦距
 */
function onDocumentMouseWheel(event) {
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();
}

//监听触摸事件
function onDocumentTouchStart(event) {
    event.preventDefault();
    var touch = event.touches[0];
    touchX = touch.screenX;
    touchY = touch.screenY;
}

function onDocumentTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];
    lon -= (touch.screenX - touchX) * 0.1;
    lat += (touch.screenY - touchY) * 0.1;
    touchX = touch.screenX;
    touchY = touch.screenY;
}

function ondeviceorientation( e ){
    deg2rad = Math.PI / 180;
    camera.rotation.set (
        !e.beta  ? 0 : (e.beta) * deg2rad,
        !e.gamma ? 0 : (e.gamma)* deg2rad,
        !e.alpha ? 0 : (e.alpha) * deg2rad
    );
    document.getElementById('a').innerText =e.beta* deg2rad;
    document.getElementById('b').innerText = e.alpha* deg2rad;
    document.getElementById('c').innerText = e.alpha* deg2rad;
}

function animate() {
    requestAnimationFrame( animate );
    //lon = Math.max(-180, Math.min(180, lon));//限制固定角度内旋转
    //lon +=  0.1;//自动旋转
    //lat = Math.max( - 85, Math.min( 85, lat ) );
    //phi = ( 90 - lat ) * Math.PI / 180;
    //theta = lon * Math.PI / 55;
    //target.x = Math.sin( phi ) * Math.cos( theta );
    //target.y = Math.cos( phi );
    //target.z = Math.sin( phi ) * Math.sin( theta );
    //camera.lookAt( target );
    renderer.render( scene, camera );
}
var basePath = "img/";
var loader = new PxLoader();
var fileList = [
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg"
];
for (var i = 0; i < fileList.length; i++) {
    var pxImage = basePath + fileList[i];
    pxImage.imageNumber = i + 1;
    loader.addImage(pxImage);
}
loader.addCompletionListener(function() {
    init();
    animate();
});
loader.addProgressListener(function(e) {

});
loader.start();
