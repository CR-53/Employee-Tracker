const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const app = require("../../app");
const connection = require("./connection");

function addPrompt() {
    inquirer.prompt({
        name: "viewOptions",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee",
            "BACK",
            "EXIT"
        ]
    }).then(function (data = { viewOptions }) {
        switch (data.viewOptions) {
            case "Department":
                addDepartment();
                break;

            case "Role":
                addRole();
                break;

            case "Employee":
                addEmployee();
                break;

            case "BACK":
                app.mainPrompt();
                break;

            case "EXIT":
                console.log(`Exiting... Thank you for using Employee Tracker v1.0`);
                connection.end();
                break;

            default:
                console.log(`Error, could not determine valid selection. \n Exiting... Thank you for using Employee Tracker v1.0 `);
                connection.end();
        }
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "What is the name of the new Department?"
        }
    ]).then(function (data = { newDepartment }) {
        connection.query("INSERT INTO department (name) VALUES (?)", [data.newDepartment],
            function (err, res) {
                if (err) throw err;
                console.log(`Added ${data.newDepartment} to Departments.`);
                app.mainPrompt();
            });
    });
}

function addRole() {
    var departmentName = [];
    var allDepartments = [];
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        res.forEach(department => {
            departmentName.push(department.name);
            var thisDepartment = {departmentTitle: department.name, departmentId: department.id};
            allDepartments.push(thisDepartment);
        })
        inquirer.prompt([
            {
                name: "newRoleDepartment",
                type: "list",
                message: "Which Department does the Role go into?",
                choices: departmentName
            },
            {
                name: "newRole",
                type: "input",
                message: "What is the name of the new Role?"
            },
            {
                name: "newRoleSalary",
                type: "input",
                message: "How much is the Salary for this Role?"
            }
        ]).then(function (data = { newRoleDepartment, newRole, newRoleSalary }) {
            var matchingDepartmentId;
            allDepartments.forEach(department => {
                if (data.newRoleDepartment === department.departmentTitle) {
                    matchingDepartmentId = department.departmentId;
                }
            });
            connection.query("INSERT INTO role SET ?",
            {
                title: data.newRole,
                salary: data.newRoleSalary,
                department_id: matchingDepartmentId
            },
            function (err, res) {
                if (err) throw err;
                console.log(`Added ${data.newRole} to Roles.`);
                app.mainPrompt();
            });
        });
    });
}

function addEmployee() {
    var roleName = [];
    var allRoles = [];
    var managerName = [];
    var allManagers = [];
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        res.forEach(role => {
            roleName.push(role.title);
            var thisRole = {roleTitle: role.title, roleId: role.id};
            allRoles.push(thisRole);
        })
        connection.query("SELECT employee.id, employee.first_name, employee.last_name FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title LIKE '%Manager%'", 
        function (err, res) {
            if (err) throw err;
            res.forEach(manager => {
                thisManagerName = manager.first_name + " " + manager.last_name;
                managerName.push(thisManagerName);
                var thisManager = {managerId: manager.id, managerName: thisManagerName};
                allManagers.push(thisManager);
            })
            managerName.push("NO MANAGER");
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the new employee's first name?",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the new employee's last name?"
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "What is the new employee's role?",
                    choices: roleName
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Who is the new employee's manager?",
                    choices: managerName
                }    
            ]).then(function (data = { firstName, lastName, employeeRole, employeeManager }) {
                console.log(data);
                var matchingRoleId;
                allRoles.forEach(role => {
                    if (data.employeeRole === role.roleTitle) {
                        matchingRoleId = role.roleId;
                    }
                });
                var matchingManagerId = "null";
                allManagers.forEach(manager => {
                    if (data.employeeManager === manager.managerName) {
                        matchingManagerId = manager.managerId;
                    }
                });
                connection.query("INSERT INTO employee SET ?",
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: matchingRoleId,
                    manager_id: matchingManagerId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Added ${data.firstName} ${data.lastName} to Employees.`);
                    app.mainPrompt();
                });
            });
        });
    });
};

module.exports = {
    addPrompt,
    addDepartment,
    addRole,
    addEmployee
};