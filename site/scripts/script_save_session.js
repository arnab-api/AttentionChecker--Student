window.saveDataAcrossSessions = true

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

let pos_cnt = 0;
let click_count = 0;

function changeFocusPosition(){
    console.log("Changing Focus position called");
    var el = document.getElementById("container");
    // el.style.top = "10px";
    // el.style.left = "10px";
    el.style.top  = ver_pos[Math.floor(pos_cnt/3)].toString()+"%"
    el.style.left = hor_pos[pos_cnt%3].toString() + "%"

    pos_cnt = (pos_cnt+1)%9;
    click_count = 0;
}

let calibration_element = document.getElementById("container")

document.body.addEventListener('click', function (event) {
    if (calibration_element.contains(event.target)) {
        click_count += 1;
        console.log('clicked inside >> ', click_count);
        if(click_count == 10) changeFocusPosition();
    } else {
        console.log('clicked outside');
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

const local_url_root = "http://localhost:3005/";
const erdos_url_root = "http://150.108.64.64:3005/";

const url_root = erdos_url_root;

function postData2InstructorBackend(){
    fetch(url_root + "api/post_gazestream", {
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