document.addEventListener("DOMContentLoaded", () => {
    let cart = []; // Array to store selected pizzas with quantities

    async function fetchMenuData() {
        try {
            const response = await fetch('data/menu.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            populateWebsite(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            document.getElementById("headerTitle").textContent = "Error loading menu. Please try again later.";
        }
    }

    function populateWebsite(data) {
        const pizzaOptionsContainer = document.getElementById("pizzaOptions");
        pizzaOptionsContainer.innerHTML = ""; // Clear any existing content

        data.menu.forEach(pizza => {
            const pizzaItem = document.createElement("div");
            pizzaItem.classList.add("pizza-item");
            pizzaItem.setAttribute("data-pizza", pizza.name);

            pizzaItem.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.name}">
                <p>${pizza.name}</p>
                <p>$${pizza.price.toFixed(2)}</p>
            `;

            // Add event listener to add pizza to the cart when clicked
            pizzaItem.addEventListener("click", () => {
                addToCart(pizza);
            });

            pizzaOptionsContainer.appendChild(pizzaItem);
        });
    }

    function addToCart(pizza) {
        // Check if the pizza is already in the cart
        const existingPizza = cart.find(item => item.name === pizza.name);
        if (existingPizza) {
            existingPizza.quantity += 1; // Increment the quantity
        } else {
            cart.push({ ...pizza, quantity: 1 }); // Add new pizza with quantity 1
        }
        updateCart(); // Update the cart display
    }

    function updateCart() {
        const cartContainer = document.getElementById("cart");
        const totalContainer = document.getElementById("cartTotal");

        // Clear the cart display
        cartContainer.innerHTML = "";

        // Calculate the total price
        let total = 0;
        cart.forEach((pizza, index) => {
            total += pizza.price * pizza.quantity;

            // Add each pizza to the cart display
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <p>${pizza.name} x${pizza.quantity} - $${(pizza.price * pizza.quantity).toFixed(2)}</p>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;

            // Add event listener to remove the pizza from the cart
            cartItem.querySelector(".remove-from-cart").addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cart.splice(index, 1); // Remove the pizza from the cart
                updateCart(); // Update the cart display
            });

            cartContainer.appendChild(cartItem);
        });

        // Update the total price
        totalContainer.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Handle checkout button click
    function handleCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add some pizzas before checking out.");
        } else {
            alert("Thank you for your order! Your pizzas will be delivered soon.");
            cart = []; // Clear the cart
            updateCart(); // Update the cart display
        }
    }

    // Add event listener to the checkout button
    document.getElementById("checkoutButton").addEventListener("click", handleCheckout);

    fetchMenuData();
});

