// window.saveDataAcrossSessions = true

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

function saveGazeData(data){
    if(data == null) return;
    const cord = getRoundedValues(data);
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

function postData2InstructorBackend(){
    fetch("http://localhost:5000/api/post_gaze", {
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