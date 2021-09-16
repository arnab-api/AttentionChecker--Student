window.saveDataAcrossSessions = false

const screenHeight  = window.innerHeight
const screenWidth   = window.innerWidth 
const heightzones   = [screenHeight/3.0, screenHeight*2.0/3.0, screenHeight]
const widthzones    = [screenWidth/3.0, screenWidth*2.0/3.0, screenWidth]
const session_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(" >>> ", session_id)
document.getElementById("session_info").innerHTML = session_id;

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
        pushClibrationCompleteNotification();
        hideFocusPoint();
    }
    // pos_cnt = (pos_cnt+1)%calibration_points.length;
}

let calibration_element = document.getElementById("container");
let calibration_active = true;
function showFocusPoint(){
    shuffleArray(calibration_points);
    calibration_element.style.display = "block";
    calibration_active = true;
    click_count = 0;
    pos_cnt = 0;
}

function hideFocusPoint(){
    calibration_element.style.display = "none";
    calibration_active = false;
    click_count = 0;
}
function toggleCalibration(){
    // console.log("before >> ", calibration_active);
    if(calibration_active) hideFocusPoint();
    else showFocusPoint();
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
    h = Math.max(0, h)
    h = Math.min(h, screenHeight)
    w = Math.max(0, w)
    w = Math.min(w, screenWidth)
    return [Math.round(w), Math.round(h)];
}


let gazestream = [];

function updateGazeStream(data){
    if(data == null) return;
    const cord = getRoundedValues(data);
    const x = cord[0], y = cord[1];
    const t = new Date()
    gazestream.push({
        gaze        : {x: x, y: y},
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
setInterval(postData2InstructorBackend, 10*1000)

function pushClibrationCompleteNotification(){
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

// console.log(">>>>>>>>>", sessionStorage.getItem("SessionName"));
webgazer
    .setGazeListener( (data, timestamp) => {
        // console.log(data, timestamp)
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