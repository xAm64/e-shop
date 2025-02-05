var panier = []; //J'utilise ici var car il porte partout.

/*met heure en temps réel toutes les 15 secondes. */
function updateTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let currentTime = `${hours}:${minutes}`;
    let year = now.getFullYear();
    document.getElementById('current-time').textContent = currentTime;
    document.getElementById("get-current-year").textContent = year;
}
setInterval(updateTime, 15000);
updateTime();

/* charger les produits */
async function loadProducts() {
    try {
        let response = await fetch('js/produits.json');
        let data = await response.json();
        if (window.location.pathname.includes("produits.html")){
            displayProducts(data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}
function displayProducts(data) {
    const productsContainer = document.getElementById('produits');
    data.forEach(product => {
        let productCard = document.createElement('div');
        productCard.className = 'card';
        productCard.innerHTML = `
            <h4>${product.nom}</h4>
            <p class="description">${product.description}</p>
            <p class="category">${product.categiorie.join(', ')}</p>
            <div class="produit-image" style="background-image: url('../images/produits/${product.image}')"></div>
            <p class="prix">${product.price} €</p>
        `;
        productCard.addEventListener('click', () => showProductDetails(product));
        productsContainer.appendChild(productCard);
    });
}

/*afficher les détails quand je clic sur un produit */
function showProductDetails(product){
    let detailsContainer = document.getElementById("details-produit");
    detailsContainer.querySelector("h2").textContent = `Détails de : ${product.nom}`;
    detailsContainer.querySelector("#produit-long-description").innerHTML = `<p>${product.details}</p>`;
    detailsContainer.querySelector("#image-produit img").src = `../images/produits/${product.image}`;
    detailsContainer.querySelector("#prix-produit").textContent = `Prix : ${product.price} €`;
    detailsContainer.querySelector("#add-panier").addEventListener("click", () => addToCart(product));
    detailsContainer.style.display = "block";
}

/* ajouter un produit au panier */
function addToCart(product){
    panier.push(product);
    alert(`${product.nom} a été ajouté au panier`);
}