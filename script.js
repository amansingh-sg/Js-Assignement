let products = [];
let isEditing = false;
let editProductId = null;

async function getData(){
    const url = "https://dummyjson.com/products?limit=10";

    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new error(`Response is: ${response.status}`);
        }
        const data = await response.json();
        products = data.products;
        saveProducts();
        displayProduct(products);
    }
    catch(error){
        console.log("The error is", error.message);
    }
    
}

function displayProduct(products){
    
    const tbody = document.getElementById("productBody");
    const itemCount = document.getElementById("itemCount");
    tbody.innerHTML="";
    itemCount.textContent=`${products.length} items`;
     products.forEach(product => {
         tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.sku}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                    <button class="delete-btn"  onclick="deleteProduct(${product.id})">
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
         
        `;
    });
    if (products.length === 0) {
    fetchBtn.style.display = "block";
} else {
    fetchBtn.style.display = "none";
}
}



function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

const heading = document.getElementById("formHeading");
const submitbtn = document.getElementById("submitBtn");

const addtab = document.getElementById("addTab");
const edittab = document.getElementById("updateTab");

// const edit = document.getElementById("editbtn1");

const titleInput = document.getElementById("title");
const stockInput = document.getElementById("stock");
const priceInput = document.getElementById("price");
const skuInput = document.getElementById("sku");

const titleDropdown = document.getElementById("titleDropdown");

const clearCacheBtn = document.getElementById("clearCacheBtn");

const fetchBtn = document.getElementById("fetchBtn");
loadProducts();

function addProduct(){
    const title = titleInput.value;
    const stock = stockInput.value;
    const price = priceInput.value;
    const sku = skuInput.value;

    if(!title || !stock || !price || !sku){
        alert("Fill all the inputs please");
        return;
    }

    

    const newProduct = {
        id: products.length + 1,
        stock: stock,
        title:title,
        price: price,
        sku:sku

}
  console.log("New Product:", newProduct);
     
    products.push(newProduct);
saveProducts();
    displayProduct(products);

    // local storage thing

     titleInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    skuInput.value = "";

    alert("Products added Successfully");


}

edittab.addEventListener("click", function () {

    heading.textContent = "UPDATE PRODUCT";
    submitbtn.textContent = "Update Product";

    addtab.classList.remove("active");
    edittab.classList.add("active");

    titleInput.style.display = "none";
    titleDropdown.style.display = "block";

    loadDropdown();

});

addtab.addEventListener("click", function () {

    heading.textContent = "ADD NEW PRODUCT";
    submitbtn.textContent = "Add Product";

    edittab.classList.remove("active");
    addtab.classList.add("active");

   
    titleInput.style.display = "block";

   
    titleDropdown.style.display = "none";

    
    titleInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    skuInput.value = "";

    
    isEditing = false;
    editProductId = null;

});

function deleteProduct(id) {

    products = products.filter(function(product){
        return product.id !== id;
    });

    saveProducts();

    displayProduct(products);

    alert("Product Deleted Successfully!");
}

function loadProducts() {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        displayProduct(products);
    } else {
        getData();
    }
}


function editProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

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

function updateProduct() {

    const product = products.find(function(product) {
        return product.id === editProductId;
    });

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

submitbtn.addEventListener("click", function () {
    if (isEditing) {
        updateProduct();
    } else {
        addProduct();
    }
});


function loadDropdown() {

    titleDropdown.innerHTML = `<option value="">Select Product</option>`;

    products.forEach(function(product) {

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


function clearCache() {
console.log("Clear Cache Clicked");
    const confirmClear = confirm("Are you sure?");
    if (!confirmClear) return;
    localStorage.removeItem("products");
    products = [];
    displayProduct(products);
    alert("Cache Cleared Successfully!");
}

clearCacheBtn.addEventListener("click", clearCache);

fetchBtn.addEventListener("click", function () {
    getData();
});