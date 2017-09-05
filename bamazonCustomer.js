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
    // selectAllProducts();
    selectAllProducts();
});
userChooseProduct();

function selectAllProducts() {
    connection.query("SELECT * FROM  products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + "$" + " | " + res[i].stock_quantity+" In stock|");
        }

        console.log('----------------------');
    });
}

function userChooseProduct() {
    inquirer.prompt([{
            name: "id",
            message: "What is the ID of the product you would like to purchase?: "
        }, {
            name: "numUnits",
            message: "How many would you like to purchase?: "
        }

    ]).then(function(answers) {
        // var update = connection.query("UPDATE products SET? ")
        connection.query("SELECT * FROM  products WHERE id=" + parseInt(answers.id), function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + "$" + " | X" + parseInt(answers.numUnits));
                updateStock(res[i].stock_quantity, answers.numUnits, answers.id,res[i].price);
                console.log("Your total is: " + res[i].price * parseInt(answers.numUnits) + "$");
            }
        });
    });
}

function updateStock(stock, userPurchase, id,price) {
	var sale = 0;
	sale += price;
    var result = stock - userPurchase;
    if (result <= 0) {
        console.log("Insufficient stock");
        setTimeout(userChooseProduct(), 1000 * 3);
    } else {
        connection.query("UPDATE products SET stock_quantity=" + result +", product_sales="+sale+ " WHERE id=" + id),
            function(err, res) {
                return console.log(res[0].stock_quantity);
            }

        // return console.log(result);
    }
}