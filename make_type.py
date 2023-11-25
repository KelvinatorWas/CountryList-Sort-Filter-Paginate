import json

file_path = "./db.json"

with open(file_path, 'r') as file:
    data_base = json.load(file)

c:dict = data_base['countries'][0]

def parse(data_base, tabs = 1, first = 1):
    if first: print("type name = {")

    for data in data_base:
        if type(data_base[data]) == str:
            print("  "*tabs+f'{data}: string;')

        if type(data_base[data]) == int or type(data_base[data]) == float:
            print("  "*tabs+f'{data}: number;')

        if type(data_base[data]) == dict:
            print("  "*tabs+f'{data}: '+'{')
            parse(data_base[data], tabs+1, 0)
            print("  "*tabs+"};")

    if first: print("};")
    
parse(c)