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
                mainPrompt();
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
            var newDepartment = {departmentTitle: department.name, departmentId: department.id};
            allDepartments.push(newDepartment);
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
                    console.log(matchingDepartmentId);
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
    console.log(`This functionality will be available in future updates`);
    app.mainPrompt;
}

module.exports = {
    addPrompt,
    addDepartment,
    addRole,
    addEmployee
};