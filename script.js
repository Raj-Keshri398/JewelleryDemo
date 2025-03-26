document.addEventListener("DOMContentLoaded", function () {
    // Initialize elements
    const productImages = document.querySelectorAll(".product img");
    const cartButtons = document.querySelectorAll(".cart-btn");
    const buyButtons = document.querySelectorAll(".buy-btn");
    const cartLink = document.querySelector('a[href="cart.html"]');
    const scrollLeftButtons = document.querySelectorAll(".scroll-left");
    const scrollRightButtons = document.querySelectorAll(".scroll-right");
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const allProducts = document.querySelectorAll('.product');
    
    // Create no results message element
    const noResultsMessage = document.createElement('div');
    noResultsMessage.className = 'no-results';
    noResultsMessage.textContent = 'No products found matching your search.';
    document.querySelector('main').appendChild(noResultsMessage);
    noResultsMessage.style.display = 'none';

    // Create product detail modal
    const detailModal = document.createElement("div");
    detailModal.classList.add("detail-modal");
    detailModal.innerHTML = `
        <div class="detail-content">
            <span class="close-btn">&times;</span>
            <img src="" id="detail-image" alt="Jewelry Image">
            <h2 id="detail-title">Jewelry Name</h2>
            <p id="detail-description">Jewelry Description</p>
            <div class="detail-actions">
                <button id="modal-cart-btn" class="cart-btn">Add to Cart</button>
                <button id="modal-buy-btn" class="buy-btn">Buy Now</button>
            </div>
        </div>
    `;
    document.body.appendChild(detailModal);

    // Select modal elements
    const modalCartBtn = document.getElementById("modal-cart-btn");
    const modalBuyBtn = document.getElementById("modal-buy-btn");
    const closeBtn = detailModal.querySelector(".close-btn");

    // Initialize cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let selectedProduct = {};

    // Update cart count display
    function updateCartCount() {
        if (cartLink) {
            const cartCount = cart.length;
            cartLink.innerHTML = cartCount > 0 ? `Cart (${cartCount})` : "Cart";
        }
    }

    // Add product to cart
    function addToCart(product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} added to cart!`);
    }

    // Buy product (redirect to payment)
    function buyProduct(product) {
        localStorage.setItem("checkoutProduct", JSON.stringify(product));
        window.location.href = "payment.html";
    }

    // Open product detail modal
    function openProductModal(productElement) {
        selectedProduct = {
            name: productElement.querySelector("p").textContent,
            image: productElement.querySelector("img").src,
            category: productElement.dataset.category
        };

        document.getElementById("detail-image").src = selectedProduct.image;
        document.getElementById("detail-title").textContent = selectedProduct.name;
        document.getElementById("detail-description").textContent = 
            `This is a beautiful ${selectedProduct.category} jewelry piece. Perfect for any occasion!`;

        detailModal.style.display = "flex";
    }

    // Close modal
    function closeModal() {
        detailModal.style.display = "none";
    }

    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasResults = false;
        
        if (searchTerm === '') {
            // If search is empty, show all products
            allProducts.forEach(product => {
                product.style.display = 'block';
            });
            noResultsMessage.style.display = 'none';
            return;
        }
        
        allProducts.forEach(product => {
            const productName = product.querySelector('p').textContent.toLowerCase();
            const productCategory = product.dataset.category.toLowerCase();
            
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                product.style.display = 'block';
                hasResults = true;
            } else {
                product.style.display = 'none';
            }
        });

        noResultsMessage.style.display = hasResults ? 'none' : 'block';
    }

    // Event listeners for search
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Event listeners for product images (open modal)
    productImages.forEach(img => {
        img.addEventListener("click", function() {
            const productElement = this.closest(".product");
            openProductModal(productElement);
        });
    });

    // Event listeners for cart buttons
    cartButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productElement = this.closest(".product");
            const product = {
                name: productElement.querySelector("p").textContent,
                image: productElement.querySelector("img").src,
                category: productElement.dataset.category
            };
            addToCart(product);
        });
    });

    // Event listeners for buy buttons
    buyButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productElement = this.closest(".product");
            const product = {
                name: productElement.querySelector("p").textContent,
                image: productElement.querySelector("img").src,
                category: productElement.dataset.category
            };
            buyProduct(product);
        });
    });

    // Modal button events
    modalCartBtn.addEventListener("click", () => addToCart(selectedProduct));
    modalBuyBtn.addEventListener("click", () => buyProduct(selectedProduct));
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside
    detailModal.addEventListener("click", (e) => {
        if (e.target === detailModal) closeModal();
    });

    // Horizontal scrolling for product grids
    scrollLeftButtons.forEach(button => {
        button.addEventListener("click", () => {
            const container = button.nextElementSibling;
            container.scrollBy({ left: -300, behavior: 'smooth' });
        });
    });

    scrollRightButtons.forEach(button => {
        button.addEventListener("click", () => {
            const container = button.previousElementSibling;
            container.scrollBy({ left: 300, behavior: 'smooth' });
        });
    });

    // Add this to your existing JavaScript
    document.getElementById('refreshButton').addEventListener('click', function() {
        this.classList.add('refreshing');
        setTimeout(() => {
            location.reload();
        }, 1000); // Wait for 1 second to show the animation
    });

    // Initialize cart count on page load
    updateCartCount();
});