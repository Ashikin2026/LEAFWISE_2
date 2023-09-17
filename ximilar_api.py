import requests
import json 
import base64 

# Define all variables
image_file_path = r"C:\Users\lingz\Downloads\licensed-image.jpeg"
task_id         = "bf1ecfa8-0ad8-4538-9d6a-c2d0834adb26"
api_token       = "c35050ee0ee71e838891d5cf75b95046d0a8a73f"

# Set the API endpoint URL and parameters
endpoint = 'https://api.ximilar.com/recognition/v2/classify/' 

headers = { 
    'Authorization': f"Token {api_token}", 
    'Content-Type': 'application/json' 
} 
with open(image_file_path, "rb") as image_file: 
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8') 
    print(encoded_string)

data = { 
    'task_id': task_id, 
    'records': [ {'_url': image_file_path }, {"_base64": encoded_string } ] 
} 

# Make the API request
response = requests.post(endpoint, headers=headers, data=json.dumps(data)) 
results = response.json()
print(response)

# Print the API response
# print(json.dumps(results, indent=2))

# Print out all the probability of diff category
for i in (results["records"][1]["labels"]):
    print(f"{i['name']}: {i['prob']:.2%}")

# Print out the result with highest probabilities
j = results["records"][1]["best_label"]
print(f"{j['name']}: {j['prob']:.2%}")
