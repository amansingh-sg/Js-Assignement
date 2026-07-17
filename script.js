// ===============================
// Global Variables
// ===============================

let products = [];
let isEditing = false;
let editProductId = null;

// ===============================
// DOM Elements
// ===============================

const emptyState = document.getElementById("emptyState");
const tableContainer = document.querySelector(".table-container");

const heading = document.getElementById("formHeading");
const submitbtn = document.getElementById("submitBtn");

const addtab = document.getElementById("addTab");
const edittab = document.getElementById("updateTab");

const titleInput = document.getElementById("title");
const stockInput = document.getElementById("stock");
const priceInput = document.getElementById("price");
const skuInput = document.getElementById("sku");

const titleDropdown = document.getElementById("titleDropdown");

const clearCacheBtn = document.getElementById("clearCacheBtn");

// ===============================
// Fetch Products From API
// ===============================

async function getData() {

    const url = "https://dummyjson.com/products?limit=10";

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const data = await response.json();

        products = data.products;

        saveProducts();
        displayProduct(products);

    } catch (error) {

        console.log("The error is:", error.message);

    }

}

// ===============================
// Display Products
// ===============================

function displayProduct(products) {

    const tbody = document.getElementById("productBody");
    const itemCount = document.getElementById("itemCount");

    tbody.innerHTML = "";
    itemCount.textContent = `${products.length} items`;

    // Show Empty State

    if (products.length === 0) {

        tableContainer.style.display = "none";
        emptyState.style.display = "flex";

        return;
    }

    tableContainer.style.display = "block";
    emptyState.style.display = "none";

    // Render Products

    products.forEach(product => {

        tbody.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.sku}</td>

            <td class="actions">

                <button
                    class="edit-btn"
                    onclick="editProduct(${product.id})">

                    <i class="fa-solid fa-pen"></i>
                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${product.id})">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>

            </td>

        </tr>
        `;

    });

}

// ===============================
// Save Products to Local Storage
// ===============================

function saveProducts() {

    localStorage.setItem("products", JSON.stringify(products));

}

// ===============================
// Load Products
// ===============================

function loadProducts() {

    const storedProducts = localStorage.getItem("products");

    if (storedProducts) {

        products = JSON.parse(storedProducts);
        displayProduct(products);

    } else {

        getData();

    }

}

loadProducts();

// ===============================
// Add Product
// ===============================

function addProduct() {

    const title = titleInput.value;
    const stock = stockInput.value;
    const price = priceInput.value;
    const sku = skuInput.value;

    if (!title || !stock || !price || !sku) {

        alert("Fill all the inputs please");
        return;

    }

    const newProduct = {

        id: products.length + 1,
        title,
        stock,
        price,
        sku

    };

    products.push(newProduct);

    saveProducts();
    displayProduct(products);

    // Clear Form

    titleInput.value = "";
    stockInput.value = "";
    priceInput.value = "";
    skuInput.value = "";

    alert("Product Added Successfully!");

}

// ===============================
// Delete Product
// ===============================

function deleteProduct(id) {

    products = products.filter(product => product.id !== id);

    saveProducts();
    displayProduct(products);

    alert("Product Deleted Successfully!");

}

// ===============================
// Edit Product
// ===============================

function editProduct(id) {

    const product = products.find(product => product.id === id);

    titleInput.value = product.title;
    priceInput.value = product.price;
    stockInput.value = product.stock;
    skuInput.value = product.sku;

    editProductId = id;
    isEditing = true;

    heading.textContent = "UPDATE PRODUCT";
    submitbtn.textContent = "Update Product";

    addtab.classList.remove("active");
    edittab.classList.add("active");

}

// ===============================
// Update Product
// ===============================

function updateProduct() {

    const product = products.find(product => product.id === editProductId);

    product.title = titleInput.value;
    product.price = Number(priceInput.value);
    product.stock = Number(stockInput.value);
    product.sku = skuInput.value;

    saveProducts();
    displayProduct(products);

    titleInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    skuInput.value = "";

    isEditing = false;
    editProductId = null;

    heading.textContent = "ADD NEW PRODUCT";
    submitbtn.textContent = "Add Product";

    edittab.classList.remove("active");
    addtab.classList.add("active");

    titleInput.style.display = "block";
    titleDropdown.style.display = "none";

    alert("Product Updated Successfully!");

}

// ===============================
// Submit Button
// ===============================

submitbtn.addEventListener("click", function () {

    if (isEditing) {

        updateProduct();

    } else {

        addProduct();

    }

});

// ===============================
// Switch To Update Mode
// ===============================

edittab.addEventListener("click", function () {

    heading.textContent = "UPDATE PRODUCT";
    submitbtn.textContent = "Update Product";

    addtab.classList.remove("active");
    edittab.classList.add("active");

    titleInput.style.display = "none";
    titleDropdown.style.display = "block";

    loadDropdown();

});

// ===============================
// Switch To Add Mode
// ===============================

addtab.addEventListener("click", function () {

    heading.textContent = "ADD NEW PRODUCT";
    submitbtn.textContent = "Add Product";

    edittab.classList.remove("active");
    addtab.classList.add("active");

    titleInput.style.display = "block";
    titleDropdown.style.display = "none";

    titleInput.value = "";
    stockInput.value = "";
    priceInput.value = "";
    skuInput.value = "";

    isEditing = false;
    editProductId = null;

});

// ===============================
// Populate Dropdown
// ===============================

function loadDropdown() {

    titleDropdown.innerHTML = `<option value="">Select Product</option>`;

    products.forEach(product => {

        titleDropdown.innerHTML += `
            <option value="${product.id}">
                ${product.title}
            </option>
        `;

    });

}

titleDropdown.addEventListener("change", function () {

    const id = Number(titleDropdown.value);

    if (!id) return;

    editProduct(id);

});

// ===============================
// Clear Local Storage
// ===============================

function clearCache() {

    const confirmClear = confirm("Are you sure?");

    if (!confirmClear) return;

    localStorage.removeItem("products");

    products = [];

    displayProduct(products);

    alert("Cache Cleared Successfully!");

}

clearCacheBtn.addEventListener("click", clearCache);