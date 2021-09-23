window.saveDataAcrossSessions = true;

const screenHeight  = window.innerHeight
const screenWidth   = window.innerWidth 
const heightzones   = [screenHeight/3.0, screenHeight*2.0/3.0, screenHeight]
const widthzones    = [screenWidth/3.0, screenWidth*2.0/3.0, screenWidth]
const session_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(" >>> ", session_id)
document.getElementById("session_info").innerHTML = session_id;


let TAG = "GAZESTREAM";


const height_zone_names = {
    "-1": "N/A",
    "0" : "UPPER",
    "1" : "MID",
    "2" : "LOWER"
}

const width_zone_names = {
    "-1": "N/A",
    "0" : "LEFT",
    "1" : "MID",
    "2" : "RIGHT"
}

let ver_pos = [3, 48, 95];
let hor_pos = [3, 48, 95];

const calibration_points = [
    {"x": -0.45, "y": -0.45}, {"x": -0.15, "y": -0.45}, {"x": 0.15, "y": -0.45}, 
    {"x": 0.45, "y": -0.45}, {"x": -0.45, "y": -0.15}, {"x": -0.15, "y": -0.15}, 
    {"x": 0.15, "y": -0.15}, {"x": 0.45, "y": -0.15}, {"x": -0.45, "y": 0.15}, 
    {"x": -0.15, "y": 0.15}, {"x": 0.15, "y": 0.15}, {"x": 0.45, "y": 0.15}, 
    {"x": -0.45, "y": 0.45}, {"x": -0.15, "y": 0.45}, {"x": 0.15, "y": 0.45}, 
    {"x": 0.45, "y": 0.45}, {"x": -0.45, "y": -0.45}, {"x": 0.45, "y": -0.45}, 
    {"x": 0.45, "y": 0.45}, {"x": -0.45, "y": 0.45}
]

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(calibration_points);

console.log(calibration_points)

let pos_cnt = 0;
let click_count = 0;
const calibration_click_count = 2;

// function changeFocusPosition(){
//     console.log("Changing Focus position called");
//     var el = document.getElementById("container");
//     // el.style.top = "10px";
//     // el.style.left = "10px";
//     el.style.top  = ver_pos[Math.floor(pos_cnt/3)].toString()+"%"
//     el.style.left = hor_pos[pos_cnt%3].toString() + "%"

//     pos_cnt = (pos_cnt+1)%9;
//     click_count = 0;
// }


function changeFocusPosition(){
    click_count = 0;
    console.log("Changing Focus position called >> ", click_count, "<><>", pos_cnt);
    var el = document.getElementById("container");
    // el.style.top = "10px";
    // el.style.left = "10px";
    el.style.top  = (48 + calibration_points[pos_cnt]['x']*100).toString()+"%"
    el.style.left = (48 + calibration_points[pos_cnt]['y']*100).toString() + "%"

    pos_cnt = (pos_cnt+1);
    if(pos_cnt == calibration_points.length){
        console.log("finished calibration!!!");
        pushCalibrationCompleteNotification();
        hideCalibrationFocus();
    }
    // pos_cnt = (pos_cnt+1)%calibration_points.length;
}

let calibration_element = document.getElementById("container");
let calibration_active = true;
function showCalibrationFocus(){
    shuffleArray(calibration_points);
    calibration_element.style.display = "block";
    calibration_active = true;
    click_count = 0;
    pos_cnt = 0;
}

function hideCalibrationFocus(){
    calibration_element.style.display = "none";
    calibration_active = false;
    click_count = 0;
}
function toggleCalibration(){
    // console.log("before >> ", calibration_active);
    if(calibration_active) hideCalibrationFocus();
    else showCalibrationFocus();
    // console.log("after >> ", calibration_active);
}

document.body.addEventListener('click', function (event) {
    if(calibration_active == false) return;

    if (calibration_element.contains(event.target)) {
        click_count += 1;
        console.log('calibrating >> clicked inside >> ', click_count);
        if(click_count == calibration_click_count) changeFocusPosition();
    } else {
        console.log('calibrating >> clicked outside');
    }
});

let accuracy_measurement_active = false;
const accuracy_focus_element = document.getElementById("accuracy_focus");
const accuracy_btn = document.getElementById("accuracy_btn");
let accuracy_position = 0;

function showAccuracyFocus(){
    accuracy_focus_element.style.display = "block";
    accuracy_measurement_active = true;
}

function hideAccuracyFocus(){
    accuracy_focus_element.style.display = "none";
    accuracy_measurement_active = false;
    accuracy_position = 0;
}

const accuracy_cords = [
    {'x': 50, 'y': 50},
    {'x': 10, 'y': 10},
    {'x': 80, 'y': 10},
    {'x': 80, 'y': 80},
    {'x': 10, 'y': 80},
]

function setAccuracyFocusPosition(posidx){
    accuracy_focus_element.style.top  = (accuracy_cords[posidx-1]['x']).toString() + "%"
    accuracy_focus_element.style.left = (accuracy_cords[posidx-1]['y']).toString() + "%"
}

function startAccuracyMeasurement(){

    if(reporting == true){
        console.log("... ... ... resetting background reporting");
        stopBackendReporting();
        startBackendReporting();
    }

    if(accuracy_measurement_active == false){
        console.log("started accuracy measurement");
        accuracy_measurement_active = true;
        hideCalibrationFocus();
        showAccuracyFocus();  
        accuracy_position = 1  
        accuracy_btn.innerHTML = "Position " + accuracy_position;
        TAG = "ACCURACY CHECK >> " + accuracy_position;
        setAccuracyFocusPosition(accuracy_position);
        console.log("disable webgazer gaze dot");
        document.getElementById("webgazerGazeDot").style.opacity = "0.0";
    }
    else{
        accuracy_position += 1;
        if(accuracy_position > accuracy_cords.length){
            hideAccuracyFocus();
            accuracy_btn.innerHTML = "Accuracy Check";
            accuracy_position = 0;
            TAG = "GAZESTREAM";
            console.log("enable webgazer gaze dot");
            document.getElementById("webgazerGazeDot").style.opacity = "0.5";
        }
        else{
            accuracy_btn.innerHTML = "Position " + accuracy_position;
            TAG = "ACCURACY CHECK >> " + accuracy_position;
            setAccuracyFocusPosition(accuracy_position);
        }
    }
}

function getZoneInformation(data){
    if(data == null) return ["-1", "-1"]
    let h = data.y
    let w = data.x
    h = Math.max(0, h)
    h = Math.min(h, screenHeight)
    w = Math.max(0, w)
    w = Math.min(w, screenWidth)

    let h_zone = "-1"
    let w_zone = "-1"
    for(let z = 0; z < heightzones.length; z++){
        if(h <= heightzones[z]) {
            h_zone = z.toString()
            break
        }
    }
    for(let z = 0; z < widthzones.length; z++){
        if(w <= widthzones[z]) {
            w_zone = z.toString()
            break
        }
    }
    return [h_zone, w_zone]
}

function getRoundedValues(data){
    if(data == null) return [-1,-1];
    let h = data.y
    let w = data.x
    // h = Math.max(0, h)
    // h = Math.min(h, screenHeight)
    // w = Math.max(0, w)
    // w = Math.min(w, screenWidth)
    return [Math.round(w), Math.round(h)];
}


let gazestream = [];

function updateGazeStream(data){
    if(data == null) return;
    const cord = getRoundedValues(data);
    const x = cord[0], y = cord[1];
    const t = new Date()
    gazestream.push({
        gaze        : {
            x           : x, 
            y           : y, 
            'face'      : roundFaceKeypoints(data['face'])
            // 'face'      : data['face']
        },
        timestamp   : {
            hour        : t.getHours(),
            minute      : t.getMinutes(),
            seconds     : t.getSeconds(),
            milliseconds: t.getMilliseconds(), 
        }
    })
}

// data = {"name": "api"}
// var xhr = new XMLHttpRequest();
// xhr.open("POST", "http://localhost:5000/post_gaze", true);
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.send(JSON.stringify(data));

const local_url_root = "https://localhost:3005";
const erdos_url_root = "https://erdos.dsm.fordham.edu:3005";

const url_root = erdos_url_root;

function postData2InstructorBackend(){
    const post_url = url_root + "/api/post_gazestream";
    fetch(post_url, {
        method: "POST", 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
            {
                "session"     : session_id,
                "TAG"         : TAG,
                "screenHeight": screenHeight,
                "screenWidth" : screenWidth, 
                "gaze"        : gazestream
            })
    }).then(res => {
        console.log("Request complete! response:", res);
    });
    // console.log("refresing gaze data")
    // gazedata = {}
    gazestream = []
}
let reporting_interval = setInterval(postData2InstructorBackend, 10*1000);
let reporting = true;
const stat_button = document.getElementById("button_stat");

function startBackendReporting(){
    console.log("... starting background reporting to " + url_root)
    reporting = true;
    reporting_interval = setInterval(postData2InstructorBackend, 10*1000)
    stat_button.style.background = "green";
    stat_button.innerHTML = "ON";

    console.log(" ... resetting a gazestream");
    gazestream = []
}

function stopBackendReporting(){
    console.log("xxx stoping background reporting to " + url_root)
    reporting = false;
    clearInterval(reporting_interval);
    // reporting_interval = null;
    stat_button.style.background = "#b30000";
    stat_button.innerHTML = "OFF";  

    console.log(" ... resetting a gazestream");
    gazestream = []
}

function toggleBackendReporting(){
    if(reporting == true) stopBackendReporting();
    else startBackendReporting();
}


function pushCalibrationCompleteNotification(){
    const post_url = url_root + "/api/register_calibration";
    fetch(post_url, {
        method: "POST", 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
            {
                "session"     : session_id,
                "screenHeight": screenHeight,
                "screenWidth" : screenWidth, 
            })
    }).then(res => {
        console.log("Request complete! response:", res);
    });
    // console.log("refresing gaze data")
    // gazedata = {}
    gazestream = []
}

function roundFaceKeypoints(face){
    let ret = []
    face.forEach(keypoint => {
        ret.push([
            Math.round(keypoint[0]),
            Math.round(keypoint[1]),
            Math.round(keypoint[2])
        ]);
    });
    return ret;
}

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

// console.log(">>>>>>>>>", sessionStorage.getItem("SessionName"));
webgazer
    .setGazeListener( (data, timestamp) => {
        // if(data != null) {
        //     // console.log(data, timestamp);
        //     let eye = getRoundedValues(data)
        //     let obj = {
        //         'x': eye[0],
        //         'y': eye[1],
        //         'face': data['face']
        //         // 'face': roundFaceKeypoints(data['face'])
        //     }
        //     console.log(roughSizeOfObject(obj), obj);
        // }
        let zones = getZoneInformation(data)
        let cord = getRoundedValues(data)
        updateGazeStream(data)
        // let x = cord[0], y = cord[1]
        // let h_zone = zones[0], w_zone = zones[1] 
        // console.log(screenWidth, screenHeight, " >>>> ", x,y, " <><><> ", height_zone_names[h_zone], width_zone_names[w_zone])
        // await new Promise(r => setTimeout(r, 2000));
    })
    .begin()


let videoStatus = true;
let continuousVideo = true;

function turnOnVideo()
{
    console.log("turning on video feedback");
    document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
    document.getElementById('webgazerVideoFeed').style.display = 'block';
    document.getElementById('webgazerFaceOverlay').style.display = 'block';
    videoStatus = true;
}


function turnOffVideo()
{
    console.log("turning off video feedback");
    document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
    document.getElementById('webgazerVideoFeed').style.display = 'none';
    document.getElementById('webgazerFaceOverlay').style.display = 'none';
    videoStatus = false;
}

function toggleVideo(){
    console.log("toggle video feedback called")
    continuousVideo ^= true;
    if(continuousVideo == false){
        turnOffVideo();
    }
    else{
        turnOnVideo()
    }
    // let el = document.getElementById("webgazerFaceFeedbackBox");
    // let col = window.getComputedStyle(el).getPropertyValue("border");
    // console.log(" <>>>> ", col)
}

window.onload = function() {
    setTimeout(loadAfterTime, 3000);
 }; 

function loadAfterTime(){
    console.log("function executing after some time");
    bindEventListener_2_FaceBoundBox();
    changeGazeTrackerStyle()
};

function bindEventListener_2_FaceBoundBox(){
    try{
        let faceborder = document.getElementById("webgazerFaceFeedbackBox");
        var observer = new MutationObserver(function(mutations) {
            let color_map = {
                "rgb(255, 0, 0)": "RED",
                "rgb(0, 128, 0)": "GREEN",
                "rgb(0, 0, 0)"  : "BLACK"
            }
            mutations.forEach(function(mutationRecord) {
                let color_code = window.getComputedStyle(faceborder).getPropertyValue("border");
                color_code = color_code.substring(color_code.indexOf("rgb"), color_code.length)
                let color_now = color_map[color_code];
                console.log('border color changed!! >> ', color_code, color_map[color_code]);
                if(continuousVideo == false){
                    if(color_now != "GREEN") turnOnVideo();
                    else turnOffVideo();
                }
            });    
        });
        
        observer.observe(faceborder, { attributes : true, attributeFilter : ['style'] });
        console.log("listener bound to face bounding box successfully!!!")
    }catch(err){
        console.log("face bounding box not yet loaded -- trying again");
        setTimeout(bindEventListener_2_FaceBoundBox, 2000);
    }
}

function changeGazeTrackerStyle(){
    try{
        let dot = document.getElementById("webgazerGazeDot");
        dot.style.background = "red";
        dot.style.opacity = 0.5;
        dot.style.width = "20px";
        dot.style.height = "20px";
        console.log("tracker dot style changed")
    }catch(err){
        console.log("tracker dot not yet initialized -- trying again");
        setTimeout(changeGazeTrackerStyle, 2000);
    }
}