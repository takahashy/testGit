/******** VALIDATION ********/
var letters = /^[A-Za-z]+$/;
var phone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
var address = /^[#.0-9a-zA-Z\s,-]+$/;
/* Checks whether all inputs by the user are valid  */
function validate_submit() {
    var valid = true;
    if (!validate("lname", regularexp, letters, "NAME"))
        valid = false;
    if (!validate("phone", regularexp, phone, "PHONE NUMBER"))
        valid = false;
    if (is_delivery() && !validate("Address", regularexp, address, "ADDRESS"))
        valid = false;
    if (!please_order("no_order"))
        valid = false;
    return valid;
}
/* Abstracted regular expression checker */
function regularexp(text, tester) {
    return tester.test(text);
}
/* Abstracted validation for phone number and last name.
   id, regularexpression function, and text are passed as parameters */
function validate(id, regexp, tester, text) {
    var input = document.getElementsByName(id)[0];
    var error_message = document.getElementById(id);
    error_message.style.color = "rgb(255,0,0)";
    error_message.innerHTML = "";
    if (input.value == "") {
        error_message.innerHTML = text + " IS REQUIRED";
        input.select();
        return false;
    }
    if (!regexp(input.value, tester)) {
        error_message.innerHTML = "INVALID " + text;
        input.select();
        return false;
    }
    return true;
}
/* Check if delivery is checked */
function is_delivery() {
    var delivery = document.getElementsByName("pick_delivery")[1];
    return delivery.checked;
}
/* Requires the address if the pickup/delivery radio button is delivery */
function show_address() {
    var address = document.getElementById("address");
    if (is_delivery()) {
        address.style.display = "block";
    }
    else {
        address.style.display = "none";
    }
}
function please_order(id) {
    var error_message = document.getElementById(id);
    error_message.style.color = "rgb(255,0,0)";
    error_message.innerHTML = "";
    if (subtotal() == 0) {
        error_message.innerHTML = "PLEASE ORDER";
        return false;
    }
    return true;
}
/******** MENU CLASS ********/
var menu = /** @class */ (function () {
    function menu(name, cost, orders) {
        if (orders === void 0) { orders = 0; }
        this.name = name;
        this.cost = cost;
        this.orders = orders;
    }
    menu.prototype.set_orders = function (id) {
        var orders = document.getElementById(id);
        this.orders = parseInt(orders.value);
    };
    menu.prototype.return_orders = function () {
        return this.orders;
    };
    menu.prototype.Name = function () {
        return this.name;
    };
    menu.prototype.Cost = function () {
        return this.cost;
    };
    /* Calculate total cost in table at each event */
    menu.prototype.each_total_cost = function () {
        return this.cost * this.orders;
    };
    return menu;
}());
/* Array of items */
var items = [new menu("Onigiri", 1.25),
    new menu("Sarada Chicken", 2.50),
    new menu("Carbonara", 4.00),
    new menu("Nakamoto Ramen", 6.50),
    new menu("Potato Chips", 1.00),
    new menu("Shu-Cream", 2.50)];
var items_size = items.length;
/* Make the select input for table */
function make_input(id) {
    var input = "<input type='number' name='orders' id='" +
        id +
        "' min='0' max='10'>";
    return input;
}
/* Create the menu table */
function create_table() {
    var table = "<tr>" +
        "<th>Orders</th>" +
        "<th>Item Name</th>" +
        "<th>Cost Each</th>" +
        "<th>Total Cost</th>" +
        "</tr>";
    var iterate = 0;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        table += "<tr><td>" + make_input(item.Name()) + "</td>" +
            "<td>" + item.Name() + "</td>" +
            "<td>$ " + item.Cost().toFixed(2) + "</td>" +
            "<td><div id='totalcost" + iterate + "'>$0.00 </div></td>" +
            "</tr>";
        iterate++;
    }
    document.getElementById("table_info").innerHTML = table;
}
/* Calculate total cost of each item and display */
function display_each_cost(index) {
    var item = items[index];
    item.set_orders(item.Name());
    var value = "$" + item.each_total_cost().toFixed(2);
    document.getElementById("totalcost" + index).innerHTML = value;
}
/******** CALCULATION OF TOTAL COSTS ********/
function subtotal() {
    var subtotal = 0;
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
        var item = items_2[_i];
        subtotal += item.each_total_cost();
    }
    return subtotal;
}
function tax() {
    return 0.1 * subtotal();
}
function total() {
    return subtotal() + tax();
}
/******** DISPLAY NEW WINDOW AFTER SUBMISSION ********/
function printOrders(file) {
    var new_window = window.open("");
    window.location.href = file;
    window.document.write("<h1>Order Details</h1>" +
        "Thank you for ordering!<br><br>" +
        listOrders() + "<br>");
}
function listOrders() {
    var list = "";
    list += "<table id='display'><tr><th>Items</th><th>Quantity</th></tr>";
    for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
        var item = items_3[_i];
        if (item.return_orders() != 0) {
            list += "<tr><td>" + item.Name() +
                "</td><td>" + item.return_orders() +
                "</td></tr>";
        }
    }
    list += "</table>";
    return list;
}
/******** MAIN FUNCTIONS WHERE ABOVE ARE BEING ARE CALLED ********/
var submitted = document.querySelector("form");
var pick_delivery = document.querySelectorAll("input[name = pick_delivery]");
var file = "file:///C:/Users/takah/Documents/COMPSCI/web_dev/test/forms/window.html";
/* if form is submitted check for validation and calculate cost */
submitted.addEventListener("submit", function (event) {
    if (!validate_submit()) {
        event.preventDefault();
    }
    else {
        printOrders(file);
    }
});
/* Change to show address if radio button delivery is pressed */
pick_delivery.forEach(function (choose) {
    choose.addEventListener("change", function () {
        show_address();
    });
});
/* Create the menu table */
create_table();
/* When changing the number of orders update the following */
var order_number = document.querySelectorAll("input[name = orders]");
var subtotalHTML = document.getElementById("subtotal");
var taxHTML = document.getElementById("tax");
var totalHTML = document.getElementById("total");
var _loop_1 = function (i) {
    order_number[i].addEventListener("input", function () {
        display_each_cost(i);
        subtotalHTML.innerHTML = "$" + subtotal().toFixed(2);
        taxHTML.innerHTML = "$" + tax().toFixed(2);
        totalHTML.innerHTML = "$" + total().toFixed(2);
    });
};
for (var i = 0; i < order_number.length; i++) {
    _loop_1(i);
}
