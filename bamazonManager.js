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
            name: "products",
            type: 'list',
            message: "Select one of the following choices: ",
            choices: ['view products for sale','view low inventory']
        }

    ]).then(function(answers) {
        runResults(answers.products);

    });
}

function selectAllProducts() {
    connection.query("SELECT * FROM  products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + "$" + " | " + res[i].stock_quantity + " In stock|");
        }

        console.log('----------------------');
    });
}

function selectLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + "$" + " | " + res[i].stock_quantity + " In stock|");
        }
    });
}

function runResults(userAnswers) {
    switch (userAnswers) {
        case 'view products for sale':
            selectAllProducts()
            break;
        case 'view low inventory':
            selectLowInventory()
            break;
    }
}