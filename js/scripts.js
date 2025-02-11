var panier = JSON.parse(localStorage.getItem("panier")) || []; //J'utilise ici var car il porte partout.

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

/* Mettre à jour le compteur du panier */
function updateCartCount() {
    const cartCount = panier.reduce((total, product) => total + (product.quantity || 1), 0);
    document.getElementById('cart-count').textContent = cartCount;
}

/* charger les produits */
async function loadProducts() {
    try {
        let response = await fetch('js/produits.json');
        let data = await response.json();
        if (window.location.pathname.includes("produits.html")){
            displayProducts(data);
        }
        if (window.location.pathname.includes("panier.html")){
            displayCart();
        }
        updateCartCount();
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
    const existingProduct = panier.find(p => p.nom === product.nom);
    if (existingProduct) {
        if (existingProduct.quantity < product.stock) {
            existingProduct.quantity += 1;
        } else {
            alert("Vous ne pouvez pas ajouter plus de produits que le stock disponible.");
        }
    } else {
        product.quantity = 1;
        panier.push(product);
    }
    localStorage.setItem("panier", JSON.stringify(panier));
    alert(`${product.nom} a été ajouté au panier`);
    document.getElementById("details-produit").style.display = "none";
    updateCartCount();
}

/* vérifier si une case obligatoire est remplit */
function verifEtat(id){
    if (document.getElementById(id).value != ""){
        document.getElementById(id).style = "border: 1px solid #818274";
        return true;
    }else{
        document.getElementById(id).style = "border: 1px solid #db4f2c";
        return false;
    }
}

/* vérifier contact */
function verifierContact(){
    let idFormulaire = ["contact-nom", "contact-prenom", "contact-email", "contact-objet", "contact-message"];
    let statut = true;
    for (let i = 0; i < idFormulaire.length; i++){
        if (!verifEtat.idFormulaire[i]){
            statut = false;
        }
    }
    if (statut){
        alert(`Merci pour votre message.
            Afin de me contacter, veuillez utilser l'adresse email ci joint avec mon CV.
            Pour des raisons de sécurité, ce site n'envoie pas d'email.`);
    } else {
        alert(`Certains champs obligatoires ne sont pas remplis, veuillez les remplir avant de cliquer sur envoyer`);
    }
}

/* générer un mot de passe aléatoire et sécurisé */
function gereateRandomPassword(){
    let nombreChar = Math.floor(Math.random() *3) +12;
    let pass = "";
    let char = "AÁÀÂÄBCÇDEÉÈÊËFGHIÍÌÎÏHJKLMNÑOÓÒÔÖPQRSTUÚÙÛÜVWXYZaáàâäbcdeéèêëfghiíìîïjklmnñoóòôöpqrstuúùûüvwxyz0123456789_-*!?,.%"
    let long = char.length;
    for (let i = 0; i< nombreChar; i++){
        pass += char.charAt(Math.floor(Math.random() * long));
    }
    return pass;
}
function genererHtmlMotPasse(){
    let pass = gereateRandomPassword();
    document.getElementById("zone-passwords").innerHTML =
        '<div class="group-vertical">'+
        '<label for="inscription-password">Mot de passe<span class="danger">*</span></label>'+
        '<input type="password" name="inscription-password" id="inscription-password" placeholder="'+pass+'" value="" required>'+
        '<label for="inscription-password-confirm">Confirmer votre mot de passe<span class="danger">*</span></label>'+
        '<input type="password" name="inscription-password-confirm" id="inscription-password-confirm" placeholder="'+pass+'" value="" required></input>'+
        '</div>';

    let htmlSuggest = '<ul>';
    for (let i = 0; i < 5 ; i++){
        htmlSuggest += '<li>'+gereateRandomPassword()+'</li>';
    }
    htmlSuggest += '</ul>';
    document.getElementById("suggestion-passwords").innerHTML = htmlSuggest;
}

