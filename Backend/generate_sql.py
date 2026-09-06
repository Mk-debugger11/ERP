import json


def format_value(v):
    if v is None:
        return "NULL"
    elif isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    elif isinstance(v, (int, float)):
        return str(v)
    else:
        # string
        s = str(v).replace("'", "''")
        return f"'{s}'"

with open("db_backup.json") as f:
    data = json.load(f)

# Group data by model
models_data = {}
for item in data:
    if not item['model'].startswith('employees.'):
        continue
    model = item['model']
    if model not in models_data:
        models_data[model] = []
    models_data[model].append(item)

# Order of insertion to respect foreign keys
order = [
    'employees.department',
    'employees.branch',
    'employees.employmenttype',
    'employees.designation',
    'employees.team',
    'employees.employee'
]

# Mapping field names from Django models to database columns
fk_fields = {
    'department',
    'designation',
    'employment_type',
    'branch',
    'team',
    'manager',
    'team_lead'
}

with open("seed_postgres.sql", "w") as f:
    f.write("-- PostgreSQL Seed Data\n")
    f.write("BEGIN;\n")
    f.write("SET CONSTRAINTS ALL DEFERRED;\n\n")
    
    for model in order:
        if model not in models_data:
            continue
            
        f.write(f"-- Table: {model.replace('.', '_')}\n")
        table_name = model.replace(".", "_")
        
        for item in models_data[model]:
            pk = item['pk']
            fields = item['fields']
            
            # Combine pk and fields
            cols = ['id']
            vals = [pk]
            
            for field_name, value in fields.items():
                col_name = field_name
                if col_name in fk_fields:
                    col_name += '_id'
                    
                cols.append(col_name)
                vals.append(value)
            
            cols_str = ", ".join([f'"{c}"' for c in cols])
            vals_str = ", ".join([format_value(v) for v in vals])
            
            sql = f"INSERT INTO {table_name} ({cols_str}) VALUES ({vals_str});\n"
            f.write(sql)
        f.write("\n")
        
    f.write("COMMIT;\n")

print("Generated updated seed_postgres.sql with transactions")
