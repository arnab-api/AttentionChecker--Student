import requests
from requests.models import Response


url = "http://localhost:3005/api/cors"
# url = "https://httpbin.org/post"
headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
response = requests.post(url, json = {"msg": "pushed from python file -- cross origin"}, headers= headers)
print(response.text)