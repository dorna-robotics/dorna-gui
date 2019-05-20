var graphic = true
// frame object
var frame = {
        "fps": 30,
        "delay": 0.5,
        "busy": false,
        "frames" : [],
        "last" : null,
}

var f_dsp

var scale_factor = 0.01
if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var container, stats;
var camera, scene, renderer, controls, ah;
var particleLight;
var dae;
var anime_id;
var kinematics;
var loader = new THREE.ColladaLoader();

/**div**/
container = document.createElement( 'div' );
document.getElementById("3d_div").appendChild( container );

function init_scene(){
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "#aaaaaa" );
}


function init_collada(){
  loader.load( "./static/assets/dorna.dae", function ( collada ) {
    graphic = true
    
    // collada
    dae = collada.scene;
    dae.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        // model does not have normals
        //child.material.flatShading = true;
      }
    } );
    dae.scale.x = dae.scale.y = dae.scale.z = scale_factor;
    dae.updateMatrix();
    kinematics = collada.kinematics;
    scene.add( dae );

    /*************/
    f_dsp = setInterval(frame_display, 1000/frame["fps"])

    //animate();
  })

}

function graphic_on() {

    /*********************/
    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 8, 8, 8 );

    // Grid
    var grid = new THREE.GridHelper( 20, 20, 0x444444, 0x888888 );
    scene.add( grid );
    

    particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    var pointLight = new THREE.PointLight( 0xffffff, 0.3 );
    particleLight.add( pointLight );
        
    // Lights
    var light = new THREE.HemisphereLight( 0xffeeee, 0x111122 );
    scene.add( light );
    
    // renderer
    renderer = new THREE.WebGLRenderer( { antialias : true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1);
    container.appendChild( renderer.domElement );
    
    // stats
    stats = new Stats();
    //container.appendChild( stats.dom );

    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 1.0;
    controls.enableZoom    = true;
    controls.enableKeys = false;
    controls.addEventListener( 'change', render );

    // Axis
    ah = new THREE.AxesHelper(1);
    ah.rotateX( -Math.PI / 2 )
    ah.material.linewidth = 20
    scene.add( ah );


    window.addEventListener( 'resize', onWindowResize, false );
}

function graphic_off(node){
  disposeHierarchy (node, disposeNode) 
  
  while(node.children.length > 0){ 
    node.remove(node.children[0]);
    
  } 

  clearInterval(f_dsp)
  graphic = false
  frame = {
          "fps": 60,
          "delay": 0.5,
          "busy": false,
          "frames" : [],
          "last" : null,
  }  
}

function destroy_scene(){
  //cancelAnimationFrame(anime_id);// Stop the animation
  renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
  scene = null;
  projector = null;
  camera = null;
  controls = null;
  empty(container);
}

function set_frame(joint){
  let i = 0

  for ( let prop in kinematics.joints ) {
    if ( kinematics.joints.hasOwnProperty( prop ) ) {
      if ( ! kinematics.joints[ prop ].static ) {
        kinematics.setJointValue( prop, joint[i] );
        i ++
        if (i == 5) {
          break;
        }
      }
    }

  }

}



function frame_display(){
    let l = frame["frames"].length
    if(l == 0 ){
      return -1
    }
    let time = +new Date / 1000
    time = time - frame["delay"]

    let joint = []

    // find the interval
    let i = -1
    while( i+1 < l && time >= frame["frames"][i+1]["time"]){
        i = i+1
    }
    
    // interpolate
    if(i === -1){
      return -1  
    }else if( i === l-1){
        joint = frame["frames"][l-1]["joint"]
        frame["frames"][l-1]["time"] = time
    }else{
        for (let j = 0;  j < frame["frames"][i]["joint"].length  ; j++) {
            joint.push(
            frame["frames"][i]["joint"][j] + (frame["frames"][i+1]["joint"][j]-frame["frames"][i]["joint"][j])*(time- frame["frames"][i]["time"])/(frame["frames"][i+1]["time"]- frame["frames"][i]["time"])
            )
        }
    }

    // remove old frames
    for (let k = 0; k < i ; k++) {
        frame["frames"].shift()
    }
    


    // set_frame
    if(frame["last"] != joint){
      set_frame(joint)
      frame["last"] = joint
      render()
    }

}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
  anime_id = requestAnimationFrame( animate );
  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  //render();
  //stats.update();
  //TWEEN.update();
}

function render() {
  renderer.render( scene, camera );
}

function disposeNode (node){
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode

function disposeHierarchy (node, callback){
    for (var i = node.children.length - 1; i >= 0; i--)
    {

        var child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
}

function empty(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
}

