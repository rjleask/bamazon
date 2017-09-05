var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected to MySql: ' + connection.threadId);
    userInput();
});

function userInput() {
    inquirer.prompt([{
            name: "dptm",
            type: 'list',
            message: "Select one of the following choices: ",
            choices: ['view product sales by department', 'create new department']
        }

    ]).then(function(answers) {
        runUserInput(answers.dptm);
    });
}

function joinTables() {

    connection.query('SELECT departments.department_id,departments.department_name,products.product_sales FROM departments LEFT JOIN products ON (departments.department_id = products.id)', function(err, res) {
        // console.log(res);
        for(var i=0; i<res.length;i++){
        	console.log(res[i].department_id+" | "+res[i].department_name+" | "+res[i].product_sales);
        }

    });
}

function runUserInput(userAnswers) {
    switch (userAnswers) {
        case 'view product sales by department':
            joinTables();
            break;
        case 'create new department':
            break;
    }
}