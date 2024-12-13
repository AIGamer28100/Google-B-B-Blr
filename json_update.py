import json
import datetime
import time

data = None

with open("/home/hari-16245/Personal/Banglore/Google-B-B-Blr/dataset.json", "r") as f:
    data = json.load(f)
    
for dic in data:
    dic["input"] = dic["input"]
    dic["output"] = json.dumps(dic["output"])
    
inputs = []
outputs = []

for dic in data:
    inputs.append(f'{datetime.datetime.now().timestamp()} : {dic["input"]}')
    outputs.append(dic["output"])
    
    time.sleep(2)
    
final_data = [
    {
        "inputs": inputs,
        "outputs": outputs
    }
]
    
with open("/home/hari-16245/Personal/Banglore/Google-B-B-Blr/dataset_final.json", "w") as f:
    json.dump(final_data, f, indent=4)