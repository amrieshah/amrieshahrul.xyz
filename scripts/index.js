import * as THREE from './three/build/three.module.js';

import { TWEEN } from './three/examples/jsm/libs/tween.module.min.js';
import { TrackballControls } from './three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from './three/examples/jsm/renderers/CSS3DRenderer.js'

var peoples = [
	"Joan", "25", "M", 1, 1,
	"Helen", "26", "F", 2, 1,
	"Meera", "24", "F", 3, 1,
	"Nurul", "27", "F", 4, 1,
	"Ahmad", "27", "M", 5, 1,
	"Afiqah", "27", "F", 6, 1,
	"Fatin", "27", "F", 7, 1,
	"Azam", "24", "M", 8, 1,
	"Aida", "22", "F", 9, 1,
	"Nini", "23", "F", 10, 1,
	"Fid", "27", "M", 11, 1,
	"Yee", "29", "F", 12, 1,
	"Jaira", "25", "F", 13, 1,
	"Andy", "26", "M", 1, 2,
	"Syafiq", "25", "M", 2, 2,
	"Kenneth", "32", "M", 3, 2,
	"Rachel", "25", "F", 4, 2,
	"Chea", "34", "M", 5, 2,
	"Chan", "28", "M", 6, 2,
	"Amir", "28", "M", 7, 2,
	"Yasheni", "25", "F", 8, 2,
	"David", "28", "M", 9, 2,
	"Maryam", "25", "F", 10, 2,
	"Azwa", "24", "F", 11, 2,
	"Aimy", "24", "F", 12, 2,
	"Ummu", "27", "F", 13, 2,
	"Kamarul", "29", "M", 1, 3,
	"Faez", "26", "M", 2, 3,
	"Amalina", "26", "F", 3, 3,
	"Sharmila", "25", "F", 4, 3,
	"Chea", "34", "M", 5, 3,
	"Maria", "28", "F", 6, 3,
	"Ali", "29", "M", 1, 4,
	"Firdaus", "26", "M", 2, 4,
	"Najmi", "26", "M", 3, 4,
	"Intan", "26", "F", 4, 4,
	"Sharifah", "27", "F", 5, 4,
	"Fabian", "25", "M", 6, 4,
];

var camera, scene, renderer;
var controls;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
init();
animate();
function init() {
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 4000;
	scene = new THREE.Scene();
	// table
	for ( var i = 0; i < peoples.length; i += 5 ) {
		var element = document.createElement( 'div' );
		element.className = 'element';
		if ('M' === peoples[ i + 2 ]) {
			element.style.backgroundColor = "#007f7fa6";
		} else {
			element.style.backgroundColor = "#ff6cb6";
		}
		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = ( i / 5 ) + 1;
		element.appendChild( number );
		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.textContent = peoples[ i ];
		element.appendChild( symbol );
		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = peoples[ i + 1 ] + '<br>' + peoples[ i + 2 ];
		element.appendChild( details );
		var object = new CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );
		objects.push( object );
		//
		var object = new THREE.Object3D();
		object.position.x = ( peoples[ i + 3 ] * 160 ) - 1330;
		object.position.y = - ( peoples[ i + 4 ] * 220 ) + 990;
		targets.table.push( object );
	}

	// sphere
	var vector = new THREE.Vector3();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = Math.acos( - 1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;
		var object = new THREE.Object3D();
		object.position.setFromSphericalCoords( 800, phi, theta );
		vector.copy( object.position ).multiplyScalar( 2 );
		object.lookAt( vector );
		targets.sphere.push( object );
	}
	// helix
	var vector = new THREE.Vector3();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var theta = i * 0.175 + Math.PI;
		var y = - ( i * 8 ) + 450;
		var object = new THREE.Object3D();
		object.position.setFromCylindricalCoords( 900, theta, y );
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt( vector );
		targets.helix.push( object );
	}
	// grid
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
		targets.grid.push( object );
	}
	//
	renderer = new CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'container' ).appendChild( renderer.domElement );
	//
	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener( 'change', render );
	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function () {
		transform( targets.table, 2000 );
	}, false );
	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function () {
		transform( targets.sphere, 2000 );
	}, false );
	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function () {
		transform( targets.helix, 2000 );
	}, false );
	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function () {
		transform( targets.grid, 2000 );
	}, false );
	transform( targets.table, 2000 );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function transform( targets, duration ) {
	TWEEN.removeAll();
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = objects[ i ];
		var target = targets[ i ];
		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
	}
	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
}
function render() {
	renderer.render( scene, camera );
}
