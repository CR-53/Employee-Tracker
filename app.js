const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const connection = require("./Develop/js/connection");
const view = require("./Develop/js/viewPrompts");
const add = require("./Develop/js/addPrompts");
const update = require("./Develop/js/updatePrompts");

function init() {
    console.log(`Employee Tracker v1.0`);
    mainPrompt();
}    

function mainPrompt() {
    inquirer.prompt({
        name: "mainOptions",
        type: "list",
        message: "Please select an option below to proceed.",
        choices: [
            "Add",
            "View",
            "Update",
            "Delete",
            "EXIT"
        ]
    }).then(function (data = {mainOptions}) {
        switch(data.mainOptions) {
            case "Add":
                // Add inquirier func here
                add.addPrompt();
                break;
            
            case "View":
                console.log(`view selected`);
                view.viewPrompt();
                break;
            
            case "Update":
                update.updatePrompt();
                break;
            
            case "Delete":
                console.log(`This functionality will be available in future updates.`);
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

init();

module.exports.mainPrompt = mainPrompt;