import re

with open("seed_postgres.sql", "r") as f:
    lines = f.readlines()

with open("seed_postgres.sql", "w") as f:
    for line in lines:
        if line.startswith("INSERT INTO employees_team"):
            # Replace the column name
            line = line.replace('"department_id", "team_lead_id", "description"', '"department_id", "team_lead_id", "description"')
            
            # Use regex to find the values inside VALUES (...)
            match = re.search(r'VALUES \((.*)\);', line)
            if match:
                vals_str = match.group(1)
                
                # Split by comma, but be careful with strings containing commas
                # Luckily, our description is the last field and team_lead_id is the second to last.
                # Actually, team_lead_id is an integer (or NULL), so it's just before the description string.
                
                # Let's just do a simpler string replace since we know team_lead_id is an integer
                # "department_id", "team_lead_id", "description" -> department_id is 7th, team_lead_id is 8th.
                # Just replacing team_lead_id with NULL is safer and satisfies the constraint!
                # I will replace the column name back to include team_lead_id but force the value to NULL.
                
                # We can just change the column name to NOT include team_lead_id and remove the value, or keep the column and set value to NULL.
                pass
                
            # A safer regex to replace the team_lead_id value with NULL:
            # We know it looks like: , 3, 113, 'Responsible
            # where 3 is department_id, 113 is team_lead_id.
            # We can match: , \d+, (\d+|NULL), '
            line = re.sub(r'(, \d+, )(\d+|NULL)(, \')', r'\g<1>NULL\g<3>', line)
            
        f.write(line)

print("Fixed seed_postgres.sql")
