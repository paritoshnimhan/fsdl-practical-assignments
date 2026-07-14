let isLoggedIn = false;
let cartCount = 0;
let selectedProduct = "";

function handleAddToCart(product) {
    if (!isLoggedIn) {
        selectedProduct = product;
        let modal = new bootstrap.Modal(document.getElementById("loginModal"));
        modal.show();
    } else {
        addToCart(product);
    }
}

function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "user" && pass === "1234") {
        isLoggedIn = true;
        addToCart(selectedProduct);
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        alert("Login Successful!");
    } else {
        alert("Invalid credentials");
    }
}

function addToCart(product) {
    cartCount++;
    document.getElementById("cart-count").innerText = cartCount;
}

function filterCategory(category, element) {
    let products = document.querySelectorAll(".product");
    let categories = document.querySelectorAll(".category-card");

    categories.forEach(cat => cat.classList.remove("active"));
    element.classList.add("active");

    products.forEach(product => {
        if (category === "all" || product.classList.contains(category)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
