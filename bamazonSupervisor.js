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

    connection.query('SELECT departments.department_id,products.department_name,SUM(products.product_sales) AS department_sales,departments.over_head_costs, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM products INNER JOIN departments ON(products.department_name = departments.department_name) GROUP BY products.department_name', function(err, res) {
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].department_id + " | " + res[i].department_name + " | " + res[i].over_head_costs + " over head | " + res[i].department_sales +" dept sales | " + res[i].total_profit+" in net sales");
        }

    });
}

function createDepartment() {
    inquirer.prompt([{

            name: 'department',
            message: 'what department are you adding? '
        },
        {
            name: 'over',
            message: 'what are the over head costs of the new department? '
        }

    ]).then(function(answers) {
        var query = connection.query('INSERT INTO departments SET?', {
            department_name: answers.department,
            over_head_costs: answers.over
        }, function(err, res) {
        });
        console.log(query.sql);
    });
}

function runUserInput(userAnswers) {
    switch (userAnswers) {
        case 'view product sales by department':
            joinTables();
            break;
        case 'create new department':
            createDepartment();
            break;
    }
}