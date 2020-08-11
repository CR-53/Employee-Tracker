const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const app = require("../../app");
const connection = require("./connection");

async function updatePrompt() {
    var employeeInfo = [];
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id=role.id",
        function (err, res) {
            if (err) throw err;
            res.forEach(employee => {
                employeeData = employee.id + " " + employee.first_name + " " + employee.last_name + " - " + employee.title;
                employeeInfo.push(employeeData);
                employeeInfo.sort();
            });
            var roleInfo = [];
            connection.query("SELECT * FROM role", function (err, res) {
                if (err) throw err;
                res.forEach(role => {
                    roleData = role.id + " " + role.title;
                    roleInfo.push(roleData);
                    roleInfo.sort();
                });
            })
            inquirer.prompt([
                {
                    name: "selectEmployee",
                    type: "list",
                    message: "Which employee would you like to update their role?",
                    choices: employeeInfo
                },
                {
                    name: "selectRole",
                    type: "list",
                    message: "Which role would you like to assign to the employee?",
                    choices: roleInfo
                }
            ]).then(function (data = { selectEmployee, selectRole }) {
                var employeeId = (data.selectEmployee).replace(/(^\d+)(.+$)/i, '$1'); //=> '123'
                console.log(employeeId);
                var roleId = (data.selectRole).replace(/(^\d+)(.+$)/i, '$1'); //=> '123'
                console.log(roleId);
                connection.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", [roleId, employeeId],
                function (err, res) {
                    if (err) throw err;
                    console.log(`Updated ${data.selectEmployee}'s role to ${data.selectRole}.`);
                    app.mainPrompt();
                });
            });
        });
}

module.exports = {
    updatePrompt
};