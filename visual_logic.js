/**
 * Generated by Verge3D Puzzles v.3.9.1
 * Tue Apr 09 2024 18:44:52 GMT+0530 (India Standard Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};


    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["drag1"] = drag1;
this.procedures["drag2"] = drag2;
this.procedures["drag3"] = drag3;
this.procedures["drag4"] = drag4;

var PROC = {
    "drag1": drag1,
    "drag2": drag2,
    "drag3": drag3,
    "drag4": drag4,
};

var clonedred, clonedyellow, clonedblue, clonedviolet;



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// show and hide puzzles
function changeVis(objSelector, bool) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
    }
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// addHTMLElement puzzle
function addHTMLElement(elemType, id, mode, targetId, isParent) {

    var win = isParent ? window.parent : window;

    var elem = win.document.createElement(elemType);
    if (id !== '')
        elem.id = id;

    var targetElem = getElement(targetId, isParent);
    if (targetElem instanceof win.Element) {
        switch (mode) {
            case 'TO':
                targetElem.appendChild(elem);
                break;
            case 'BEFORE':
                targetElem.insertAdjacentElement('beforebegin', elem);
                break;
            case 'AFTER':
                targetElem.insertAdjacentElement('afterend', elem);
                break;
        }
    }
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, eventType, callback]);
    }
}




/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && "v3d" in scene.userData && "coordSystem" in scene.userData.v3d) {
        return scene.userData.v3d.coordSystem;
    } else {
        // COMPAT: <2.17, consider replacing to 'Y_UP_RIGHT' for scenes with unknown origin
        return 'Z_UP_RIGHT';
    }
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();




function intersectPlaneCSS(plane, cssX, cssY, dest) {
    var coords = _pGlob.vec2Tmp;
    var rc = _pGlob.raycasterTmp;
    coords.x = (cssX / appInstance.getWidth()) * 2 - 1;
    coords.y = - (cssY / appInstance.getHeight()) * 2 + 1;
    rc.setFromCamera(coords, appInstance.getCamera(true));
    return rc.ray.intersectPlane(plane, dest);
}



// dragMove puzzle
_pGlob.dragMoveOrigins = {};

function dragMove(objSelector, mode, blockId, parentDragOverBlockId) {
    var camera = appInstance.getCamera();
    if (!camera)
        return;

    if (!_pGlob.objDragOverInfoByBlock)
        return;

    var objNames = retrieveObjectNames(objSelector);

    var info = _pGlob.objDragOverInfoByBlock[parentDragOverBlockId];
    if (!info) return;

    var draggedObj = getObjectByName(info.draggedObjName);
    if (!draggedObj) return;

    if (!(blockId in _pGlob.dragMoveOrigins)) {
        _pGlob.dragMoveOrigins[blockId] = [];
    }
    var posOrigins = _pGlob.dragMoveOrigins[blockId];
    var lenDiff = objNames.length - posOrigins.length;
    for (var i = 0; i < lenDiff; i++) {
        posOrigins.push(new v3d.Vector3());
    }

    for (var i = 0; i < objNames.length; i++) {
        var obj = getObjectByName(objNames[i]);
        if (!obj) {
            continue;
        }

        var posOrigin = posOrigins[i];

        if (!info.isMoved) {
            // the object position before the first move is used as an initial value
            posOrigin.copy(obj.position);
        }

        var coordSystem = getCoordSystem();

        if (mode == "X" || mode == "Y" || mode == "Z") {

            if (coordSystem == 'Z_UP_RIGHT') {
                var axis = mode == "X" ? _pGlob.AXIS_X : (mode == "Y" ? _pGlob.AXIS_Z : _pGlob.AXIS_Y);
                var coord = mode == "X" ? "x" : (mode == "Y" ? "z" : "y");
            } else {
                var axis = mode == "X" ? _pGlob.AXIS_X : (mode == "Y" ? _pGlob.AXIS_Y : _pGlob.AXIS_Z);
                var coord = mode == "X" ? "x" : (mode == "Y" ? "y" : "z");
            }

            var planeNor = camera.getWorldDirection(_pGlob.vec3Tmp);
            planeNor.cross(axis).cross(axis);
            var plane = _pGlob.planeTmp.setFromNormalAndCoplanarPoint(planeNor, draggedObj.position);

            var p0 = intersectPlaneCSS(plane, info.downX, info.downY, _pGlob.vec3Tmp);
            var p1 = intersectPlaneCSS(plane, info.currX, info.currY, _pGlob.vec3Tmp2);
            if (p0 && p1) {
                obj.position[coord] = posOrigin[coord] + p1[coord] - p0[coord];
            }
        } else if (mode == "XY" || mode == "XZ" || mode == "YZ") {
            if (coordSystem == 'Z_UP_RIGHT') {
                var normal = mode == "XY" ? _pGlob.AXIS_Y : (mode == "XZ" ? _pGlob.AXIS_Z : _pGlob.AXIS_X);
                var coord0 = mode == "XY" ? "x" : (mode == "XZ" ? "x" : "y");
                var coord1 = mode == "XY" ? "z" : (mode == "XZ" ? "y" : "z");
            } else {
                var normal = mode == "XY" ? _pGlob.AXIS_Z : (mode == "XZ" ? _pGlob.AXIS_Y : _pGlob.AXIS_X);
                var coord0 = mode == "XY" ? "x" : (mode == "XZ" ? "x" : "y");
                var coord1 = mode == "XY" ? "y" : (mode == "XZ" ? "z" : "z");
            }

            var plane = _pGlob.planeTmp.setFromNormalAndCoplanarPoint(normal, draggedObj.position);

            var p0 = intersectPlaneCSS(plane, info.downX, info.downY, _pGlob.vec3Tmp);
            var p1 = intersectPlaneCSS(plane, info.currX, info.currY, _pGlob.vec3Tmp2);
            if (p0 && p1) {
                obj.position[coord0] = posOrigin[coord0] + p1[coord0] - p0[coord0];
                obj.position[coord1] = posOrigin[coord1] + p1[coord1] - p0[coord1];
            }
        } else if (mode == "XYZ") {
            var planeNor = camera.getWorldDirection(_pGlob.vec3Tmp);
            var plane = _pGlob.planeTmp.setFromNormalAndCoplanarPoint(planeNor, draggedObj.position);

            var p0 = intersectPlaneCSS(plane, info.downX, info.downY, _pGlob.vec3Tmp);
            var p1 = intersectPlaneCSS(plane, info.currX, info.currY, _pGlob.vec3Tmp2);
            if (p0 && p1) {
                obj.position.addVectors(posOrigin, p1).sub(p0);
            }
        }
        obj.updateMatrixWorld(true);
    }
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



function eventGetOffsetCoords(e, touchId, dest) {
    if (e instanceof MouseEvent) {
        dest.set(e.offsetX, e.offsetY);
    } else if (window.TouchEvent && e instanceof TouchEvent) {
        var rect = e.target.getBoundingClientRect();
        var touches = e.touches;
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            touches = e.changedTouches;
        }

        var touch = touches[0];
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier == touchId) {
                touch = touches[i];
                break;
            }
        }

        dest.set(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    return dest;
}



function eventTouchIdGetFirst(e) {
    if (e instanceof MouseEvent) {
        return -1;
    } else if (window.TouchEvent && e instanceof TouchEvent) {
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            return e.changedTouches[0].identifier;
        } else {
            return e.touches[0].identifier;
        }
    }
    return -1;
}



/**
 * For "touchstart", "touchend" and "touchmove" events returns true if a touch
 * object with the provided touch id is in the changedTouches array, otherwise
 * - false. For other events returns true.
 */
function eventTouchIdChangedFilter(e, touchId) {
    if (window.TouchEvent && e instanceof TouchEvent) {
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            var isChanged = false;
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier == touchId) {
                    isChanged = true;
                    break;
                }
            }
            return isChanged;
        }
    }

    return true;
}



function initDragOverInfo() {
    return {
        draggedObjName: '',
        downX: 0, downY: 0,
        prevX: 0, prevY: 0,
        currX: 0, currY: 0,
        isDowned: false,
        isMoved: false,
        touchId: -1
    };
}



// whenDraggedOver puzzle
_pGlob.objDragOverInfoGlobal = [];
_pGlob.objDragOverInfoByBlock = {}

initObjectPicking(function(intersects, downEvent) {

    _pGlob.objDragOverInfoGlobal.forEach(function(el) {

        if (downEvent instanceof MouseEvent)
            if (el.mouseButtons.indexOf(downEvent.button) == -1)
                return;

        var maxIntersects = el.xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);

            if (objectsIncludeObj([el.objName], objName)) {
                el.callback({ downEvent: downEvent, draggedObjName: objName });
            }

        }

    });

}, 'mousedown', true);



// whenDraggedOver puzzle
function registerOnDrag(objSelector, xRay, mouseButtons, cbStart, cbMove, cbDrop, blockId) {

    var cb = function(cbParam) {

        if (appInstance.controls) {
            appInstance.controls.enabled = false;
        }

        if (!(blockId in _pGlob.objDragOverInfoByBlock)) {
            _pGlob.objDragOverInfoByBlock[blockId] = initDragOverInfo();
        }
        var info = _pGlob.objDragOverInfoByBlock[blockId];

        // NOTE: don't use more than one pointing event, e.g. don't process
        // some events related to multitouch actions
        if (info.isDowned) {
            return;
        }

        var touchId = eventTouchIdGetFirst(cbParam.downEvent);
        var coords = eventGetOffsetCoords(cbParam.downEvent, touchId,
                _pGlob.vec2Tmp);

        info.downX = info.prevX = info.currX = coords.x;
        info.downY = info.prevY = info.currY = coords.y;
        info.touchId = touchId;
        info.isDowned = true;
        info.isMoved = false;
        info.draggedObjName = cbParam.draggedObjName;

        cbStart(cbParam.downEvent);

        var elem = appInstance.container;

        var moveCb = function(e) {
            if (!eventTouchIdChangedFilter(e, info.touchId)) {
                // don't handle events not intended for this particular touch
                return;
            }

            var coords = eventGetOffsetCoords(e, info.touchId, _pGlob.vec2Tmp);
            info.prevX = info.currX;
            info.prevY = info.currY;
            info.currX = coords.x;
            info.currY = coords.y;
            cbMove(e);
            info.isMoved = true;
        }
        var upCb = function(e) {
            if (!eventTouchIdChangedFilter(e, info.touchId)) {
                // don't handle events not intended for this particular touch
                return;
            }

            var coords = eventGetOffsetCoords(e, info.touchId, _pGlob.vec2Tmp);
            info.currX = coords.x;
            info.currY = coords.y;
            info.prevX = info.currX;
            info.prevY = info.currY;
            cbDrop(e);
            info.isDowned = false;

            elem.removeEventListener('mousemove', moveCb);
            elem.removeEventListener('touchmove', moveCb);
            elem.removeEventListener('mouseup', upCb);
            elem.removeEventListener('touchend', upCb);
            if (appInstance.controls) {
                appInstance.controls.enabled = true;
            }
        }

        elem.addEventListener('mousemove', moveCb);
        elem.addEventListener('touchmove', moveCb);
        elem.addEventListener('mouseup', upCb);
        elem.addEventListener('touchend', upCb);
    }

    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        _pGlob.objDragOverInfoGlobal.push({
            objName: objName,
            callback: cb,
            xRay: xRay,
            mouseButtons: mouseButtons
        });
    }
}



function findUniqueObjectName(name) {
    function objNameUsed(name) {
        return Boolean(getObjectByName(name));
    }
    while (objNameUsed(name)) {
        var r = name.match(/^(.*?)(\d+)$/);
        if (!r) {
            name += "2";
        } else {
            name = r[1] + (parseInt(r[2], 10) + 1);
        }
    }
    return name;
}



// cloneObject puzzle
function cloneObject(objName) {
    if (!objName)
        return;
    var obj = getObjectByName(objName);
    if (!obj)
        return;
    var newObj = obj.clone();
    newObj.name = findUniqueObjectName(obj.name);
    appInstance.scene.add(newObj);
    return newObj.name;
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



// objConstraintAddLimit puzzle
function objConstraintAddLimit(constraintName, objSelector, mode, min, max, targetObjName, dist, distLimitMode) {
    var objNames;
    if (mode == 'DISTANCE') {
        if (!targetObjName) return;
        var targetObj = getObjectByName(targetObjName);
        if (!targetObj) return;
    }

    objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj || !obj.constraints) continue;

        for (var j = obj.constraints.length - 1; j >= 0; j--) {
            if (obj.constraints[j].name == constraintName) {
                obj.constraints.splice(j, 1);
            }
        }

        var coordSystem = getCoordSystem();

        switch (mode) {
            case 'POS_X':
            case 'POS_Y':
            case 'POS_Z':
                var cons = new v3d.LimitLocationConstraint();
                cons.name = constraintName;

                if (coordSystem == 'Z_UP_RIGHT')
                    var compIndex = mode == 'POS_X' ? 0 : (mode == 'POS_Y' ? 2 : 1);
                else
                    var compIndex = mode == 'POS_X' ? 0 : (mode == 'POS_Y' ? 1 : 2);

                // swizzle sign and limits order
                if (coordSystem == 'Z_UP_RIGHT' && mode == 'POS_Y') {
                    cons.min.setComponent(compIndex, -max);
                    cons.max.setComponent(compIndex, -min);
                } else {
                    cons.min.setComponent(compIndex, min);
                    cons.max.setComponent(compIndex, max);
                }
                obj.constraints.push(cons);
                break;

            case 'ROT_X':
            case 'ROT_Y':
            case 'ROT_Z':
                var cons = new v3d.LimitRotationConstraint();
                cons.name = constraintName;

                if (coordSystem == 'Z_UP_RIGHT')
                    cons.axis = mode == 'ROT_X' ? 'X' : (mode == 'ROT_Y' ? 'Z' : 'Y');
                else
                    cons.axis = mode == 'ROT_X' ? 'X' : (mode == 'ROT_Y' ? 'Y' : 'Z');

                // swizzle sign and limits order
                if (coordSystem == 'Z_UP_RIGHT' && mode == 'ROT_Y') {
                    cons.min = v3d.MathUtils.degToRad(-max);
                    cons.max = v3d.MathUtils.degToRad(-min);
                } else {
                    cons.min = v3d.MathUtils.degToRad(min);
                    cons.max = v3d.MathUtils.degToRad(max);
                }

                obj.constraints.push(cons);
                break;

            case 'SCALE_X':
            case 'SCALE_Y':
            case 'SCALE_Z':
                var cons = new v3d.LimitScaleConstraint();
                cons.name = constraintName;

                if (coordSystem == 'Z_UP_RIGHT')
                    var compIndex = mode == 'SCALE_X' ? 0 : (mode == 'SCALE_Y' ? 2 : 1);
                else
                    var compIndex = mode == 'SCALE_X' ? 0 : (mode == 'SCALE_Y' ? 1 : 2);

                cons.min.setComponent(compIndex, min);
                cons.max.setComponent(compIndex, max);
                obj.constraints.push(cons);
                break;

            case 'DISTANCE':
                var cons =  new v3d.LimitDistanceConstraint(targetObj);
                cons.name = constraintName;
                cons.distance = dist;
                cons.limitMode = distLimitMode;
                obj.constraints.push(cons);
                break;
        }
    }
}


// Describe this function...
function drag1() {
  registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
    registerOnDrag(clonedred, false, [0,1,2], function() {}, function() {
      dragMove(_pGlob.pickedObject, 'XYZ', 'T(BJO_^v+ILwQ]ay23b(', '-,I||V;(Ny(@y,L^?xVK');
    }, function() {}, '-,I||V;(Ny(@y,L^?xVK');
  }, function() {});
  objConstraintAddLimit('myConst1', clonedred, 'POS_Z', 1.70602, 12, '', 0, 'LIMITDIST_ONSURFACE');
}

// Describe this function...
function drag2() {
  registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
    registerOnDrag(clonedyellow, false, [0,1,2], function() {}, function() {
      dragMove(_pGlob.pickedObject, 'XYZ', 'l,;IXfwxsL=~41nTq`2_', 'Lvm(Dp9aR4xL1^B~84wD');
    }, function() {}, 'Lvm(Dp9aR4xL1^B~84wD');
  }, function() {});
  objConstraintAddLimit('myConst2', clonedyellow, 'POS_Z', 2.30584, 12, '', 0, 'LIMITDIST_ONSURFACE');
}

// Describe this function...
function drag3() {
  registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
    registerOnDrag(clonedblue, false, [0,1,2], function() {}, function() {
      dragMove(_pGlob.pickedObject, 'XYZ', '*S@~Othl}kC[6zf+NpTL', 'w(m..R^N{QYs/N,9O#79');
    }, function() {}, 'w(m..R^N{QYs/N,9O#79');
  }, function() {});
  objConstraintAddLimit('myConst3', clonedblue, 'POS_Z', 1.16385, 12, '', 0, 'LIMITDIST_ONSURFACE');
}

// Describe this function...
function drag4() {
  registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
    registerOnDrag(clonedviolet, false, [0,1,2], function() {}, function() {
      dragMove(_pGlob.pickedObject, 'XYZ', '{`308=Sv-%o$}wF1X4I.', 'Ul};En`;PsDjY?KPG}/U');
    }, function() {}, 'Ul};En`;PsDjY?KPG}/U');
  }, function() {});
  objConstraintAddLimit('myConst4', clonedviolet, 'POS_Z', 2.15767, 12, '', 0, 'LIMITDIST_ONSURFACE');
}


// createCSSRule puzzle
function createCSSRule(cssRule, cssRuleCont, isParent) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssRule + ' { ' + cssRuleCont + ' } ';

    var styles = (isParent) ? parent.document.getElementsByTagName('head')[0] :
                              document.getElementsByTagName('head')[0];
    styles.appendChild(style)
}



// setCSSRuleStyle puzzle
function setCSSRuleStyle(prop, value, id, isParent, mediaRule) {
    var styles = (isParent) ? parent.document.styleSheets : document.styleSheets;
    for (var i = 0; i < styles.length; i++) {
        /**
         * workaround for "DOMException: Failed to read the 'cssRules' property
         * from 'CSSStyleSheet': Cannot access rules"
         */
        try { var cssRules = styles[i].cssRules; }
        catch (e) { continue; }

        for (var j = 0; j < cssRules.length; j++) {
            var cssRule = cssRules[j];
            if (!mediaRule && cssRule.selectorText == id)
                cssRule.style[prop] = value;
            else if (mediaRule && cssRule.media && cssRule.media.mediaText == mediaRule) {
                var cssRulesMedia = cssRule.cssRules;
                for (var k = 0; k < cssRulesMedia.length; k++) {
                    if (cssRulesMedia[k].selectorText == id)
                        cssRulesMedia[k].style[prop] = value;
                }
            }
        }
    }
}



// setHTMLElemAttribute puzzle
function setHTMLElemAttribute(attr, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem) continue;

        if (attr === 'style') {
            // NOTE: setting an attribute 'style' instead of a property 'style'
            // fixes IE11 wrong behavior
            elem.setAttribute(attr, value);
        } else if ((attr == 'href' || attr == 'src') && value instanceof Promise) {
            // resolve promise value for url-based attributes
            value.then(function(response) {
                elem[attr] = response;
            });
        } else {
            elem[attr] = value;
        }
    }
}



changeVis(['ALL_OBJECTS'], false);
changeVis('Cube.002', true);
changeVis('Plane', true);

addHTMLElement('button', 'Red', 'TO', ['CONTAINER'], false);
setHTMLElemStyle('position', 'absolute', 'Red', false);
setHTMLElemStyle('backgroundColor', 'red', 'Red', false);
setHTMLElemStyle('height', '60px', 'Red', false);
setHTMLElemStyle('width', '60px', 'Red', false);
setHTMLElemStyle('bottom', '15px', 'Red', false);
setHTMLElemStyle('left', '31%', 'Red', false);
eventHTMLElem('dblclick', 'Red', false, function(event) {
  changeVis('Cylinder.021', true);
});
registerOnDrag('Cylinder.021', false, [0,1,2], function() {}, function() {
  dragMove('Cylinder.021', 'XY', 'C6wclZ(:oW|LL85lb7=s', 'djf%37jpw3Em(+VSuo}u');
}, function() {}, 'djf%37jpw3Em(+VSuo}u');

addHTMLElement('button', 'Yellow', 'TO', ['CONTAINER'], false);
setHTMLElemStyle('position', 'absolute', 'Yellow', false);
setHTMLElemStyle('backgroundColor', 'yellow', 'Yellow', false);
setHTMLElemStyle('height', '60px', 'Yellow', false);
setHTMLElemStyle('width', '60px', 'Yellow', false);
setHTMLElemStyle('bottom', '15px', 'Yellow', false);
setHTMLElemStyle('left', '41%', 'Yellow', false);
eventHTMLElem('dblclick', 'Yellow', false, function(event) {
  changeVis('Cylinder.006', true);
});
registerOnDrag('Cylinder.006', false, [0,1,2], function() {}, function() {
  dragMove('Cylinder.006', 'XY', 'D5+%9k7jLoPo2cX@3fBH', 'j/9}9cB#1#w/2HXyNiC9');
}, function() {}, 'j/9}9cB#1#w/2HXyNiC9');

addHTMLElement('button', 'Blue', 'TO', ['CONTAINER'], false);
setHTMLElemStyle('position', 'absolute', 'Blue', false);
setHTMLElemStyle('backgroundColor', 'blue', 'Blue', false);
setHTMLElemStyle('height', '60px', 'Blue', false);
setHTMLElemStyle('width', '60px', 'Blue', false);
setHTMLElemStyle('bottom', '15px', 'Blue', false);
setHTMLElemStyle('left', '51%', 'Blue', false);
eventHTMLElem('dblclick', 'Blue', false, function(event) {
  changeVis('Cylinder.013', true);
});
registerOnDrag('Cylinder.013', false, [0,1,2], function() {}, function() {
  dragMove('Cylinder.013', 'XY', 'cI1En0h^QX@,]TgvDidA', ',yEj#1.uRJLWIfN=Mg0q');
}, function() {}, ',yEj#1.uRJLWIfN=Mg0q');

addHTMLElement('button', 'Violet', 'TO', ['CONTAINER'], false);
setHTMLElemStyle('position', 'absolute', 'Violet', false);
setHTMLElemStyle('backgroundColor', 'violet', 'Violet', false);
setHTMLElemStyle('height', '60px', 'Violet', false);
setHTMLElemStyle('width', '60px', 'Violet', false);
setHTMLElemStyle('bottom', '15px', 'Violet', false);
setHTMLElemStyle('left', '61%', 'Violet', false);
eventHTMLElem('dblclick', 'Violet', false, function(event) {
  changeVis('Cylinder.001', true);
});
registerOnDrag('Cylinder.001', false, [0,1,2], function() {}, function() {
  dragMove('Cylinder.001', 'XY', '.UIsX74XW`{M_x/v+r;_', 'j(+=8$Aeb!h7p7o8I[Y%');
}, function() {}, 'j(+=8$Aeb!h7p7o8I[Y%');

eventHTMLElem('click', 'Red', false, function(event) {
  clonedred = cloneObject('Cylinder.021');
  changeVis(clonedred, true);
  drag1();
});

eventHTMLElem('click', 'Yellow', false, function(event) {
  clonedyellow = cloneObject('Cylinder.006');
  changeVis(clonedyellow, true);
  drag2();
});

eventHTMLElem('click', 'Blue', false, function(event) {
  clonedblue = cloneObject('Cylinder.013');
  changeVis(clonedblue, true);
  drag3();
});

eventHTMLElem('click', 'Violet', false, function(event) {
  clonedviolet = cloneObject('Cylinder.001');
  changeVis(clonedviolet, true);
  drag4();
});

createCSSRule('.save_load', '', false);
setCSSRuleStyle('position', 'absolute', '.save_load', false, '');
setCSSRuleStyle('backgroundColor', 'orange', '.save_load', false, '');
setCSSRuleStyle('width', '160px', '.save_load', false, '');
setCSSRuleStyle('height', '65px', '.save_load', false, '');
setCSSRuleStyle('bottom', '50%', '.save_load', false, '');
setCSSRuleStyle('marginBottom', '-200px', '.save_load', false, '');
setCSSRuleStyle('right', '10px', '.save_load', false, '');
addHTMLElement('div', 'save_load', 'TO', ['CONTAINER'], false);
setHTMLElemAttribute('className', 'save_load', 'save_load', false);

createCSSRule('.save_input', '', false);
setCSSRuleStyle('position', 'static', '.save_input', false, '');
setCSSRuleStyle('backgroundColor', 'white', '.save_input', false, '');
setCSSRuleStyle('width', '152', '.save_input', false, '');
setCSSRuleStyle('height', '25px', '.save_input', false, '');
setCSSRuleStyle('borderRadius', '4px', '.save_input', false, '');
setCSSRuleStyle('border', 'solid 1px black', '.save_input', false, '');

addHTMLElement('input', 'save_input', 'TO', 'save_load', false);
setHTMLElemAttribute('className', 'save_input', 'save_input', false);



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
