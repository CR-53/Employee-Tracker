const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const app = require("../../app");
const connection = require("./connection");

function viewPrompt() {
    inquirer.prompt({
        name: "viewOptions",
        type: "list",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees",
            "BACK",
            "EXIT"
        ]
    }).then(function (data = {viewOptions}) {
        switch(data.viewOptions) {
            case "Departments":
                viewDepartments();
                break;
            
            case "Roles":
                viewRoles();
                break;

            case "Employees":
                viewEmployees();
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

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        app.mainPrompt();
    });    
}        

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        app.mainPrompt();
    });    
}        

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        app.mainPrompt();
    });    
}           

module.exports = {
    viewPrompt,
    viewDepartments,
    viewRoles,
    viewEmployees
};