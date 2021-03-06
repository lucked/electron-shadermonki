// 'use strict';
// const path      = require("path")
// const logger    = require("./lib/gk-logger.js");
// const glw       = require("./lib/gk-glwrap.js");
// const mouse     = require("./lib/gk-mouseorbit.js");
// const resMgr    = require("./lib/gk-resmgr.js");
// const math    = require("gl-matrix");
//
// var renderer = renderer || {};
//
// renderer.bgMesh = null;
// renderer.bgProgram = null;
// renderer.noiseProgram = null;
//
// renderer.quadMesh = null;
// renderer.quadProgram = null;
// renderer.quadTexture = null;
//
// renderer.timer = 0;
// renderer.modelrotation = 0;
// renderer.camerarotation = 0;
//
// renderer.autoRotate = false;
// renderer.simBackBuffer = null;
//
// renderer.init = function() {
//
//     //math.glMatrix.setMatrixArrayType(Array);
//
//     // abs time of start
//     this.timer = Date.now();
//
//     // test for quad vertex data
//     const quadPosition = [
//         -1.0,  1.0,  1.0,   1.0, 0.0, 0.0,       0.0, 0.0,
//         1.0,  1.0,  1.0,    1.0, 0.0, 0.0,       0.0, 1.0,
//         -1.0, -1.0,  1.0,   1.0, 0.0, 0.0,       1.0, 0.0,
//         1.0, -1.0,  1.0,    1.0, 0.0, 0.0,       1.0, 1.0,
//     ];
//
//     const quadIndex = [
//         0, 1, 2, 2, 1, 3
//     ];
//
//     let res = [];
//     let ibo = {};
//     ibo.trilist =  quadIndex;
//     res[0] = {vbo: quadPosition, ibo: ibo };
//
//     this.bgMesh = glw.createMeshObject(res, [glw.VERTEX_LAYOUT_P, glw.VERTEX_LAYOUT_T0, glw.VERTEX_LAYOUT_N]);
//     this.bgProgram = glw.createProgramObject(quadvsp, quadfsp);//glw._create_program(vs, ps);
//     this.noiseProgram = glw.createProgramObject(quadvsp, noisefsp);//glw._create_program(vs, ps);
//
//     this.simBackBuffer = resMgr.gResmgr.create_render_texture(1024, 1024);
//     this.simBackBuffer.load();
//
//     //his.updateMesh( 'res/mesh/head.fbx' );
// }
//
// renderer.lastFrameTime = 0;
//
// renderer.render = function() {
//
//     // time calc
//     var runTime = Date.now() - this.timer;
//     var deltaTime = runTime - this.lastFrameTime;
//     this.lastFrameTime = runTime;
//
//     glw.gl.bindFramebuffer(glw.gl.FRAMEBUFFER,  this.simBackBuffer.fbo );
//
//     // clear with a grey color
//     glw.clear([0.15, 0.15, 0.15, 1.0], 1.0);
//     glw.viewport(0, 0, this.simBackBuffer.width, this.simBackBuffer.height);
//
//     // set z enable
//     glw.gl.enable(glw.gl.DEPTH_TEST);
//     glw.gl.depthFunc(glw.gl.LEQUAL);
//     glw.gl.disable(glw.gl.CULL_FACE);
//
//     this.noiseProgram.use();
//     glw.set_uniform1f("_TIME", runTime * 0.001);
//
//     this.bgMesh.bind();
//     this.bgMesh.draw(0,0);
//
//     if (this.quadProgram != null) {
//         // use program
//         this.quadProgram.use();
//     }
//     else {
//         // use error shader
//     }
//
//
//     // global time uniform
//     glw.set_uniform1f("_TIME", runTime * 0.001);
//
//
//
//     // setup mvp frame
//     let mMatrix = math.mat4.identity(math.mat4.create());
//     let mvpMatrix = math.mat4.identity(math.mat4.create());
//     let projMatrix = math.mat4.create();
//     let viewMatrix = math.mat4.create();
//     let vpMatrix = math.mat4.create();
//
//     var relDelta = mouse.frameUpdate();
//
//     this.modelrotation += relDelta.x * 0.005;
//
//     if(this.autoRotate)
//     {
//         this.modelrotation += deltaTime * 0.001;
//     }
//
//     this.camerarotation += relDelta.y * 0.005;
//     this.camerarotation = Math.max( -glw.PI * 0.5, Math.min(glw.PI * 0.5, this.camerarotation) );
//
//     var sinx = Math.sin(this.camerarotation) * 150.0;
//     var cosz = Math.cos(this.camerarotation) * 150.0;
//
//     math.mat4.rotate(mMatrix, mMatrix, this.modelrotation, [0,1,0] );
//
//     var cameraPosition = math.vec3.fromValues(0.0, 0.0 + sinx, cosz);
//     var cameraUpDirection = math.vec3.fromValues(0.0, 1.0, 0.0);
//     var centerPoint = math.vec3.fromValues(0.0, 0.0, 0.0);
//
//
//
//     math.mat4.perspective(projMatrix, 45, 1.0, 0.5, 5000.0);
//     math.mat4.lookAt(viewMatrix, cameraPosition, centerPoint, cameraUpDirection);
//
//
//     math.mat4.multiply(vpMatrix, projMatrix, viewMatrix);
//
//     math.mat4.multiply(mvpMatrix, vpMatrix, mMatrix);
//
//     glw.set_uniform4x4fv("_MVP", mvpMatrix);
//     glw.set_uniform4x4fv("_M2W", mMatrix);
//
//     // set a lightdir
//     var lightDir = math.vec3.fromValues(-0.3,0.8,0.1,1);
//     lightDir = math.vec3.normalize(lightDir,lightDir);
//     glw.set_uniform4f("_LIGHTDIR", lightDir);
//
//     if( this.quadTexture !== null && this.quadTexture.gltextureobject !== null )
//     {
//         glw.bind_texture( this.quadTexture.gltextureobject, 0 );
//     }
//     else
//     {
//         glw.bind_texture( null, 0 );
//     }
//
//     // mesh draw
//     if( this.quadMesh !== null && this.quadMesh.glmeshobject !== null )
//     {
//         this.quadMesh.glmeshobject.bind();
//         this.quadMesh.glmeshobject.draw( mMatrix, vpMatrix );
//     }
//
//     glw.gl.bindFramebuffer(glw.gl.FRAMEBUFFER, null );
//     // clear with a grey color
//     glw.clear([0.15, 0.15, 0.15, 1.0], 1.0);
//     glw.viewport(0, 0, glw.canvas.width, glw.canvas.height);
//
//     this.bgProgram.use();
//     glw.set_uniform1f("_TIME", runTime * 0.001);
//     glw.bind_texture( this.simBackBuffer.gltextureobject, 0 );
//     this.bgMesh.bind();
//     this.bgMesh.draw(0, 0);
// }
//
// renderer.cached_vsp = null;
// renderer.cached_fsp = null;
//
// renderer.updateShader = function (vsp, fsp) {
//
//     if(vsp !== null)
//     {
//         renderer.cached_vsp = vsp;
//     }
//
//     if(fsp !== null)
//     {
//         renderer.cached_fsp = fsp;
//     }
//
//
//     this.quadProgram = glw.createProgramObject(renderer.cached_vsp, renderer.cached_fsp);//glw._create_program(vs, ps);
//     if(this.quadProgram !== null)
//     {
//         logger.info('shader update successfully.');
//     }
// }
//
// renderer.updateMesh = function ( meshresobj ) {
//     if( meshresobj !== null )
//     {
//         meshresobj.load();
//         this.quadMesh = meshresobj;
//     }
// }
//
// renderer.updateTexure = function ( texobj ) {
//     if( texobj !== null )
//     {
//         texobj.load();
//         this.quadTexture = texobj;
//     }
// }
//
//
// /**
//  * Created by kaimingyi on 2016/11/7.
//  */
