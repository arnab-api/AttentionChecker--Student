import requests
from requests.models import Response


# url = "http://localhost:3005/api/cors"
url = "http://150.108.64.64:3005//api/cors"

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
response = requests.post(url, json = {"msg": "pushed from python file -- cross origin"}, headers= headers)
print(response.text)