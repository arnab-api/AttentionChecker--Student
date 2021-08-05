import random
import threading
import logging
import time
import json
import requests
from requests.models import Response
import math


with open("Simulations/saved_gazedata/gaze_2021-08-05T22:26:59.018878.json", "r") as f:
    gazedata = json.load(f)

gaze = {
        "userid"    : "API",
        "gazedata"  : gazedata
    }
url = "http://localhost:5000/api/post_gaze_sim"
# url = "https://httpbin.org/post"
headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
response = requests.post(url, json = gaze, headers= headers)
print(response.text)