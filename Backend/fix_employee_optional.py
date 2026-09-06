import re


def split_values(s):
    # Splits by comma, respecting single quotes
    result = []
    current = ""
    in_quotes = False
    for char in s:
        if char == "'":
            in_quotes = not in_quotes
            current += char
        elif char == ',' and not in_quotes:
            result.append(current.strip())
            current = ""
        else:
            current += char
    result.append(current.strip())
    return result

with open("seed_postgres.sql", "r") as f:
    lines = f.readlines()

with open("seed_postgres.sql", "w") as f:
    for line in lines:
        if line.startswith("INSERT INTO employees_employee"):
            match = re.search(r'VALUES \((.*)\);', line)
            if match:
                vals_str = match.group(1)
                vals = split_values(vals_str)
                
                # Optional fields: 
                # 8: personal_email
                # 11: date_of_birth
                # 18: team_id
                # 19: manager_id
                
                if len(vals) >= 20:
                    vals[8] = "NULL"
                    vals[11] = "NULL"
                    vals[18] = "NULL"
                    vals[19] = "NULL"
                    
                new_vals_str = ", ".join(vals)
                line = line[:match.start()] + f"VALUES ({new_vals_str});\n"
        f.write(line)

print("Nulled optional values for employee table.")
