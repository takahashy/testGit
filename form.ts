/******** VALIDATION ********/
const letters:RegExp = /^[A-Za-z]+$/;
const phone:RegExp = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const address:RegExp = /^[#.0-9a-zA-Z\s,-]+$/;

/* Checks whether all inputs by the user are valid  */
function validate_submit(): Boolean
{
    let valid:Boolean = true;

    if (!validate("lname", regularexp, letters, "NAME")) valid = false;
    if (!validate("phone", regularexp, phone, "PHONE NUMBER")) valid = false;
    if (is_delivery() && !validate("Address", regularexp, address, "ADDRESS")) valid = false;
    if (!please_order("no_order")) valid = false;

    return valid;
}

/* Abstracted regular expression checker */
function regularexp(text:string, tester:RegExp):Boolean
{
    return tester.test(text);
}

/* Abstracted validation for phone number and last name. 
   id, regularexpression function, and text are passed as parameters */
function validate(id:string, regexp:Function, tester:RegExp, text:string):Boolean
{
    const input = document.getElementsByName(id)[0] as HTMLInputElement;
    const error_message = document.getElementById(id);
    error_message!.style.color = "rgb(255,0,0)";
    error_message!.innerHTML = "";
    
    if (input.value == "") {
        error_message!.innerHTML = text + " IS REQUIRED";
        input.select();
        return false;
    }

    if (!regexp(input.value, tester)) {
        error_message!.innerHTML = "INVALID " + text;
        input.select();
        return false;
    }

    return true;
}

/* Check if delivery is checked */
function is_delivery():Boolean
{
    const delivery = document.getElementsByName("pick_delivery")[1] as HTMLInputElement;
    return delivery.checked;
}

/* Requires the address if the pickup/delivery radio button is delivery */
function show_address():void
{
    const address = document.getElementById("address");

    if (is_delivery()) {
        address!.style.display = "block";
    } else {
        address!.style.display = "none";
    }
}

function please_order(id:string):Boolean
{
    const error_message = document.getElementById(id);
    error_message!.style.color = "rgb(255,0,0)";
    error_message!.innerHTML = "";

    if (subtotal() == 0) {
        error_message!.innerHTML = "PLEASE ORDER";
        return false;
    }
    return true;
}

/******** MENU CLASS ********/
class menu {
    private name:string;
    private cost:number;
    private orders:number;

    constructor(name:string, cost:number, orders:number = 0)
    {
        this.name = name;
        this.cost = cost;
        this.orders = orders;
    }

    public set_orders(id:string):void
    {
        let orders = document.getElementById(id) as HTMLInputElement; 
        this.orders = parseInt(orders.value);
    }

    public return_orders():number
    {
        return this.orders;
    }

    public Name():string 
    {
        return this.name;
    }

    public Cost():number
    {
        return this.cost;
    }

    /* Calculate total cost in table at each event */
    public each_total_cost():number
    {
        return this.cost * this.orders;
    }

}

/* Array of items */
const items:menu[]=[new menu("Onigiri", 1.25), 
                    new menu("Sarada Chicken", 2.50),
                    new menu("Carbonara", 4.00),
                    new menu("Nakamoto Ramen", 6.50),
                    new menu("Potato Chips", 1.00),
                    new menu("Shu-Cream", 2.50)];
const items_size:number = items.length;

/* Make the select input for table */
function make_input(id:string)
{
    let input:string = "<input type='number' name='orders' id='" +
                        id +
                        "' min='0' max='10'>";
    return input;          
}

/* Create the menu table */
function create_table():void
{
    let table:string =  "<tr>" + 
                        "<th>Orders</th>" +
                        "<th>Item Name</th>" +
                        "<th>Cost Each</th>" +
                        "<th>Total Cost</th>" +
                        "</tr>";

    let iterate:number = 0;
    for (let item of items) {
        table += "<tr><td>" + make_input(item.Name()) + "</td>" +
                "<td>" + item.Name() + "</td>" + 
                "<td>$ " + item.Cost().toFixed(2) + "</td>" +
                "<td><div id='totalcost" + iterate +"'>$0.00 </div></td>" +
                "</tr>";
        iterate++;
    }
    document.getElementById("table_info")!.innerHTML = table;
}

/* Calculate total cost of each item and display */
function display_each_cost(index:number):void
{
    let item:menu = items[index];
    item.set_orders(item.Name());
    let value:string = "$" + item.each_total_cost().toFixed(2);
    document.getElementById("totalcost" + index)!.innerHTML = value;
}


/******** CALCULATION OF TOTAL COSTS ********/
function subtotal():number
{
    let subtotal:number = 0;
    for (let item of items) {
        subtotal += item.each_total_cost();
    }

    return subtotal;
}

function tax():number
{
    return 0.1 * subtotal();
}

function total():number
{
    return subtotal() + tax();
}

/******** DISPLAY NEW WINDOW AFTER SUBMISSION ********/
function printOrders(file:string):void
{
    let new_window = window.open(file);
    new_window!.document.write("<h1>Order Details</h1>" + 
                                "Thank you for ordering!<br><br>" +
                                listOrders() + "<br>");
}

function listOrders():string
{
    let list:string = "";
    list += "<table id='display'><tr><th>Items</th><th>Quantity</th></tr>";

    for (let item of items) {
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
const submitted = document.querySelector("form");
const pick_delivery = document.querySelectorAll("input[name = pick_delivery]");
const file:string = "https://takahashyhttps://takahashy.github.io/testGit/window.html/";

/* if form is submitted check for validation and calculate cost */
submitted!.addEventListener("submit", function(event:SubmitEvent) {
    if (!validate_submit()) {
        event.preventDefault();
    } else {
        printOrders(file);
    }
});

/* Change to show address if radio button delivery is pressed */
pick_delivery.forEach(choose => {
    choose.addEventListener("change", function() {
        show_address();
    })
})

/* Create the menu table */
create_table()

/* When changing the number of orders update the following */
const order_number = document.querySelectorAll("input[name = orders]");
const subtotalHTML = document.getElementById("subtotal");
const taxHTML      = document.getElementById("tax");
const totalHTML    = document.getElementById("total");
for (let i = 0; i < order_number.length; i++) {
    order_number[i].addEventListener("input", function() {
        display_each_cost(i);
        subtotalHTML!.innerHTML = "$" + subtotal().toFixed(2);
        taxHTML!.innerHTML      = "$" + tax().toFixed(2);
        totalHTML!.innerHTML    = "$" + total().toFixed(2);
    })
}
