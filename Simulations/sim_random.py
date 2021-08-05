import random
import threading
import logging
import time
import json
import requests
from requests.models import Response
import math


screenHeight = 768
screenWidth = 1366

def getZones(screenWidth, screetHeight, widthFrac = 3, heightFrac = 3):
    zones = {}
    zone_cnt = 0
    for h in range(heightFrac):
        for w in range(widthFrac):
            zones[zone_cnt] = {
                "start_x"   : w*screenWidth/widthFrac,
                "end_x"     : (w+1)*screenWidth/widthFrac,
                "start_y"   : h*screetHeight/heightFrac,
                "end_y"     : (h+1)*screetHeight/heightFrac
            }
            zone_cnt += 1
    return zones 

def getRandomGaze(limit = 50):
    userid = random.getrandbits(64)
    gazedata = []
    while(limit>0):
        x = random.randint(0, screenWidth)
        y = random.randint(0, screenHeight)
        x /= screenWidth
        y /= screenHeight
        gazedata.append({
            "x"     : x,
            "y"     : y,
            "value" : random.randint(0,10)
        })
        limit -= 1
    return {
        "userid"    : userid,
        "gazedata"  : gazedata
    }


def getRandomZoneGaze(zones, filterzones=[], limit=50, leak = .2):
    if filterzones == []:
        raise "filterzones attribute must have at least one element"

    leakzones = []
    for z in list(zones.keys()):
        if(z not in filterzones):
            leakzones.append(z)

    det_arr = random.choices(["hit", "leak"], [1-leak, leak], k=limit)
    userid = random.getrandbits(64)
    gazedata = []
    for d in det_arr:
        if(d == "hit"):
            z = random.choice(filterzones)
        else:
            z = random.choice(leakzones)

        print(" >>>> ", z)
        x = random.randint(math.ceil(zones[z]["start_x"]), math.ceil(zones[z]["end_x"]))
        y = random.randint(math.ceil(zones[z]["start_y"]), math.ceil(zones[z]["end_y"]))
        x /= screenWidth
        y /= screenHeight
        gazedata.append({
            "x"     : x,
            "y"     : y,
            "value" : random.randint(0,10)
        })
        
    return {
        "userid"    : userid,
        "gazedata"  : gazedata
    }



zones = getZones(screenWidth=screenWidth, screetHeight=screenHeight)

def thread_function(name):
    logging.info("Thread %s: starting", name)
    # time.sleep(2)

    gaze = getRandomZoneGaze(zones=zones, filterzones=[1,3,4])
    url = "http://localhost:5000/api/post_gaze_sim"
    # url = "https://httpbin.org/post"
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    response = requests.post(url, json = gaze, headers= headers)
    print(response.text)
    
    logging.info("Thread %s: done", name)

def thread_function_test(name):
    logging.info("Thread %s: starting", name)

    for i in range(5):
        print("Thread {}  >>  {}".format(name, i+1))
        time.sleep(1)

    logging.info("Thread %s: finishing", name)


# print(json.dumps(zones, indent=4))

format = "%(asctime)s: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")
logging.info("Main Thread    : starting simulation")

threads = []
N = 7
for i in range(N):
    threads.append(threading.Thread(target=thread_function, args=(i+1,)))

logging.info("Main Thread   : running threads")

for t in threads:
    t.start()

for t in threads:
    t.join()
logging.info("Main Thread    : ending done")