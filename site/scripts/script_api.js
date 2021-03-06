window.saveDataAcrossSessions = true

const screenHeight  = window.innerHeight
const screenWidth   = window.innerWidth 
const heightzones   = [screenHeight/3.0, screenHeight*2.0/3.0, screenHeight]
const widthzones    = [screenWidth/3.0, screenWidth*2.0/3.0, screenWidth]

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

let ver_pos = [10, 45, 85];
let hor_pos = [10, 45, 85];

let pos_cnt = 0;

function changeFocusPosition(){
    console.log("Changing Focus position called");
    var el = document.getElementById("container");
    // el.style.top = "10px";
    // el.style.left = "10px";
    el.style.top  = ver_pos[Math.floor(pos_cnt/3)].toString()+"%"
    el.style.left = hor_pos[pos_cnt%3].toString() + "%"

    pos_cnt = (pos_cnt+1)%9;
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
    h = Math.max(0, h)
    h = Math.min(h, screenHeight)
    w = Math.max(0, w)
    w = Math.min(w, screenWidth)
    return [Math.round(w), Math.round(h)];
}


let gazedata = {};
let gazestream = [];

function saveGazeData(data){
    if(data == null) return;
    const cord = getRoundedValues(data);
    gazestream.push(cord);
    const x = cord[0], y = cord[1];
    if(!(x in gazedata)) gazedata[x] = {};
    if(!(y in gazedata[x])) gazedata[x][y] = 1;
    else gazedata[x][y] += 1;
}

// data = {"name": "api"}
// var xhr = new XMLHttpRequest();
// xhr.open("POST", "http://localhost:5000/post_gaze", true);
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.send(JSON.stringify(data));

const local_url_root = "https://localhost:3005/api/post_gazestream";
const erdos_url_root = "https://erdos.dsm.fordham.edu:3005/api/post_gazestream";

const url_root = erdos_url_root;

function postData2InstructorBackend(){
    fetch(url_root + "api/post_gazestream", {
        method: "POST", 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
            {
                "screenHeight": screenHeight,
                "screenWidth" : screenWidth, 
                "gaze"        : gazedata
            })
    }).then(res => {
        console.log("Request complete! response:", res);
    });
    // console.log("refresing gaze data")
    gazedata = {}
}
setInterval(postData2InstructorBackend, 10*1000)


// console.log(">>>>>>>>>", sessionStorage.getItem("SessionName"));
webgazer
    .setGazeListener( (data, timestamp) => {
        // console.log(data, timestamp)
        let zones = getZoneInformation(data)
        let cord = getRoundedValues(data)
        saveGazeData(data)
        let x = cord[0], y = cord[1]
        let h_zone = zones[0], w_zone = zones[1] 
        // console.log(screenWidth, screenHeight, " >>>> ", x,y, " <><><> ", height_zone_names[h_zone], width_zone_names[w_zone])
        // await new Promise(r => setTimeout(r, 2000));
    })
    .begin()