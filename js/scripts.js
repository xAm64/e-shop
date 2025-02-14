var panier = JSON.parse(localStorage.getItem("panier")) || []; //J'utilise ici var car il porte partout.
var compte = {
    "email" : "",
    "pass" : "",
    "token" : ""
}

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

/* génère le message d'erreur compréhensible par l'utilisateur */
function errMessage(message, type){
    const zone = document.getElementById("err-message");
    zone.innerText = message;
    zone.style.display = "block";
    if (type){
        zone.style.color = "#A3AB78";
    } else {
        zone.style.color = "#db4f2c";
    }
    setTimeout (function(){
        zone.style.display = "none";
    }, 120000);
}

/* ajouter un produit au panier */
function addToCart(product){
    const existingProduct = panier.find(p => p.nom === product.nom);
    if (existingProduct) {
        if (existingProduct.quantity < product.stock) {
            existingProduct.quantity += 1;
        } else {
            errMessage("Vous ne pouvez pas ajouter plus de produits que le stock disponible.", false);
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
        errMessage(`Merci pour votre message.<br>
            Afin de me contacter, veuillez utilser l'adresse email ci joint avec mon CV.<br>
            Pour des raisons de sécurité, ce site n'envoie pas d'email.`, true);
    } else {
        errMessage(`Certains champs obligatoires ne sont pas remplis, veuillez les remplir avant de cliquer sur envoyer`, false);
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
/* générer un token auth */
function generateToken(){
    let nombreChar = Math.floor(Math.random() *5) +8;
    let token = "";
    let char = "bcdfghjklmnpqrstvwxz0123456789";
    let long = char.length;
    for (let i = 0; i<nombreChar; i ++){
        token += char.charAt(Math.floor(Math.random() * long));
    }
    return token;
}

/* Gestion cookies */
function createCookie(token){
    let dateExpire = new Date();
    dateExpire.setDate(dateExpire.getDate()+700);
    document.cookie = "token="+token+"; expires="+dateExpire.toGMTString()+"; path=/";
}
function deleteCookie(){
    let dateExpire = new Date();
    document.cookie = "token= ;expires="+dateExpire.toGMTString()+" ; path=/";
}
function readCookie(){
    let tableCookie = document.cookie.split(";"),
        nomCookie = "token",
        valeurCookie = "";
    for (let i = 0; i < tableCookie.length; i++){
        if(tableCookie[i].indexOf(nomCookie) != -1){
            valeurCookie = tableCookie[i].substring(nomCookie.length + tableCookie[i].indexOf(nomCookie), tableCookie[i].length);
        }
    }
    return valeurCookie;
}

/* créer un compte */
function créerCompte(){
    let elements = ["inscription-email", "inscription-password", "inscription-password-confirm"],
        status = true;
    for (let i = 0; i < elements.length; i++){
        if (!verifEtat(elements[i])){
            status = false;
        }
    }
    if (status){
        if (document.getElementById("inscription-password").value === document.getElementById("inscription-password-confirm").value){
            compte.email = document.getElementById("inscription-email").value;
            compte.pass = document.getElementById("inscription-password").value;
            errMessage("votre compte a été créer, vous pouvez à présent vous conencter", true);
        } else {
            document.getElementById("inscription-password").style = "border: 1px solid #db4f2c";
            document.getElementById("inscription-password-confirm").style = "border: 1px solid #db4f2c";
            errMessage("Les mot de passes ne sont pas identiques !", false);
        }
    } else {
        errMessage("Veuillez remplir les éléments obligatoires pour pouvoir créer votre compte", false);
    }
}
/* se connecter */
function connexion(){
    let elements = ["conexion-email", "connexion-password"],
        status = true;
    for (let i = 0; i < elements.length; i++){
        if (!verifEtat(elements[i])){
            status = false;
        }
    }

    if (status){
        if (compte.email != "" && compte.pass != ""){
            if ((document.getElementById(`conexion-email`).value == compte.email) && (document.getElementById(`connexion-password`).value == compte.pass)){
                let jeton = generateToken();
                compte.token = jeton;
                createCookie(jeton);
                errMessage("Bientôt vous pourrez vous connecter", true);
            } else {
                errMessage(`L'adresse email et/ou le mot de passe sont incorrect`, false);
            }
        } else {
            errMessage(`Vous n'avez pas de compte !`, false);
        }
    } else {
        errMessage(`Veuillez remplir les chams obligatoires`, false);
    }
}
