import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { canvas } from './config/canvas.js';
import { cameraObj } from './config/camera.js';
import { ground } from './config/ground.js';
import { light } from './config/light.js';
import { houses } from './config/houses.js';
import { roads } from './config/roads.js';
import $ from 'jquery';

var PrismGeometry = function (vertices, height) {
	var Shape = new THREE.Shape();

    (function f(ctx) {

        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (var i=1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);

    })(Shape);

    var settings = { };
    settings.depth = height;
    settings.bevelEnabled = false;
    THREE.ExtrudeGeometry.call(this, Shape, settings);
};

PrismGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype);

var scene = new THREE.Scene();
scene.background = new THREE.Color(canvas.background);

var camera = new THREE.PerspectiveCamera(50, canvas.size.x / canvas.size.y, 0.1, 10000);

var renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});

renderer.setSize(canvas.size.x, canvas.size.y);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

$(canvas.selector).append(renderer.domElement);

var directionalLight = new THREE.DirectionalLight(light.color, light.intensivety, 100);
var hemisphereLight = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.3);
scene.add(hemisphereLight);

directionalLight.position.set(light.position.x, light.position.y, light.position.z);
directionalLight.target.position.set(light.target.x, light.target.y, light.target.z);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.bias = -0.00001;

var groundGeometry = new THREE.BoxGeometry(ground.size.width, 1, ground.size.length);
var groundMaterial = new THREE.MeshStandardMaterial({
	color: ground.color,
	side: THREE.DoubleSide
});

var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

groundMesh.receiveShadow = true;
scene.add(groundMesh);

var controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(cameraObj.position.x, cameraObj.position.y, cameraObj.position.z);
controls.update();
scene.add(directionalLight.target);
camera.lookAt(groundMesh.position);

houses.forEach((item) => {
	var houseGeometry = new THREE.BoxGeometry(item.size.x, item.size.y, item.size.z);
	var houseMaterial = new THREE.MeshStandardMaterial({
		color: item.color
	});
	var cube = new THREE.Mesh(houseGeometry, houseMaterial);

	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.position.set(item.position.x, item.size.y / 2, item.position.y);

	var A = new THREE.Vector2(item.size.x / 2, item.size.y / 2);
	var B = new THREE.Vector2(-item.size.x / 2, item.size.y / 2);
	var C = new THREE.Vector2(0, (item.size.x / 2) + item.roof.height);

	var prismGeometry = new PrismGeometry([ A, B, C ], item.size.z);

	var prismMaterial = new THREE.MeshPhongMaterial({
		color: item.roof.color
	});

	var prism = new THREE.Mesh(prismGeometry, prismMaterial);
	prism.position.z = -item.size.z / 2;
	prism.castShadow = true;
	prism.receiveShadow = true;

	cube.add(prism);
	groundMesh.add(cube);
});

roads.x.forEach((item) => {
	var roadGeometry = new THREE.PlaneBufferGeometry(10, ground.size.width);
	var roadMaterial = new THREE.MeshStandardMaterial({
		color: 0x000000
	});
	var road = new THREE.Mesh(roadGeometry, roadMaterial);
	road.rotation.x = -1.5708;
	road.position.y = 0.6;
	road.position.x = item;
	groundMesh.add(road);
});

roads.y.forEach((item) => {
	var roadGeometry = new THREE.PlaneBufferGeometry(ground.size.length, 10);
	var roadMaterial = new THREE.MeshStandardMaterial({
		color: 0x000000
	});
	var road = new THREE.Mesh(roadGeometry, roadMaterial);
	road.rotation.x = -1.5708;
	road.position.y = 0.6;
	road.position.z = item;
	groundMesh.add(road);
});

var animate;

if (cameraObj.autoRotation) {
	var clock = new THREE.Clock();
	var angle = cameraObj.angle;
	var angularSpeed = THREE.Math.degToRad(cameraObj.speed);
	var delta = 0;
	var radius = cameraObj.radius;

	animate = () => {
		delta = clock.getDelta();
		requestAnimationFrame(animate);

		camera.position.x = Math.cos(angle) * radius;
		camera.position.z = Math.sin(angle) * radius;
		angle -= angularSpeed * delta;

		camera.lookAt(groundMesh.position);

		renderer.render(scene, camera);
	}
} else {
	animate = () => {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
}
}



animate();