import json

file_path = "./db.json"
flag_type = 'shiny' # could also be 'shiny'
size = 24 # flag size pixels aka 64px by 64px indeed

with open(file_path, 'r') as file:
    data_base = json.load(file)

for data in data_base['countries']:

    link_end = f'{data["code"]}/{flag_type}/{size}.png'
    data['flag'] = f'https://flagsapi.com/{link_end}'

    print("Succsessfully Added:", data['name'])

data = json.dumps(data_base, indent=2)

with open(file_path, 'w') as updated_file:
    updated_file.write(data)