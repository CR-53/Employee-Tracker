USE employees_db;

INSERT INTO department (name)
VALUES ("Operations"), ("Compliance"), ("Training"), ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Operations Manager", 80000.00, 1), ("Data Processor", 40000.00, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Compliance Manager", 75000.00, 2), ("HR Officer", 50000.00, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Training Manager", 70000.00, 3), ("Administrator", 45000.00, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("IT Manager", 90000.00, 4), ("Network Administrator", 70000.00, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Oscar", "Orlow", 1, null), ("Carole", "Clarke", 2, null), ("Tammy", "Thompson", 3, null), ("Isaac", "Irwing", 4, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Oliver", "Ortin", 1, 1), ("Chad", "Cameron", 2, 2), ("Tim", "Tretchin", 3, 3), ("India", "Isling", 4, 4);