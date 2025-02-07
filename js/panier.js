function displayCart() {
    const cartContainer = document.getElementById("caroussel-panier");
    cartContainer.innerHTML = "";
    if (panier.length === 0) {
        cartContainer.innerHTML = `
            <div id="panier-vide">
                Votre panier est vide.
            </div>
        `;
        document.getElementById("total-commande").style.display = "none";
        return;
    }
    let total = 0;
    panier.forEach((product, index) => {
        const quantity = product.quantity || 1;
        const subTotal = product.price * quantity;
        total += subTotal;
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.innerHTML = `
            <h4>${product.nom}</h4>
            <div class="produit-image" style="background-image: url('images/produits/${product.image}')"></div>
            <table>
                <tr>
                    <td class="gauche">Prix unitaire</td>
                    <td class="droit">${product.price} €</td>
                </tr>
                <tr>
                    <td class="gauche">Quantité</td>
                    <td class="panier-quantite">
                        <button class="moins" onclick="decreaseQuantity(${index})"></button>
                        <span>${quantity}</span>
                        <button class="plus" onclick="increaseQuantity(${index}, ${product.stock})"></button>
                    </td>
                </tr>
                <tr>
                    <td class="gauche">Sous-Total</td>
                    <td class="droit">${subTotal.toFixed(2)} €</td>
                </tr>
            </table>
        `;
        cartContainer.appendChild(productCard);
    });
    document.getElementById("total-commande").querySelector("div").textContent = `Total à payer : ${total.toFixed(2)} €`;
}

function increaseQuantity(index, stock) {
    if ((panier[index].quantity || 1) < stock) {
        panier[index].quantity = (panier[index].quantity || 1) + 1;
        localStorage.setItem("panier", JSON.stringify(panier));
        displayCart();
    } else {
        alert("Vous ne pouvez pas ajouter plus de produits que le stock disponible.");
    }
}

function decreaseQuantity(index) {
    if (panier[index].quantity > 1) {
        panier[index].quantity -= 1;
    } else {
        panier.splice(index, 1);
    }
    localStorage.setItem("panier", JSON.stringify(panier));
    displayCart();
}

function addToCart(product) {
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
    displayCart();
}
function acheter(valeur){
    const fenetrePaiement = document.getElementById("paiement");
    const fenetreValiderPanier = document.getElementById("total-commande");
    if (valeur){
        fenetrePaiement.style.display = "block";
        fenetreValiderPanier.style.display = "none";
    } else {
        fenetrePaiement.style.display = "none";
        fenetreValiderPanier.style.display = "block";
    }
}

function paiement(accept) {
    if (accept == true) {
        if (activerPaiement()){
            alert("Merci d'avoir complété la simulation de commande ! Nous espérons que vous avez apprécié l'expérience.");
            clearCartAndForm();
        } else {
            alert("Veuillez remplir les champs obligatoires manquants avant de valider votre commande !");
        }
    } else {
        alert("Votre demande d'annulation a bien été prise en compte !");
        clearCartAndForm();
    }
}

function clearCartAndForm() {
    panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
    displayCart();
    document.querySelectorAll('#paiement form input').forEach(input => input.value = '');
}

function toggleDeliveryAddress() {
    const adresseLivraison = document.getElementById("adresse-livraison");
    const checkbox = document.getElementById("facturation-is-diferent");
    const livraisonAndFacturation = document.getElementById("adresse-factur");
    if (checkbox.checked) {
        adresseLivraison.style.display = "block";
        adresseLivraison.innerHTML = `
        <h5>Adresse de livraison</h5>
        <div class="container">
            <div class="group-vertical">
                <label for="nom">Nom<span class="danger">*</span></label>
                <input type="text" id="livraison-nom" name="livraison-nom" placeholder="Smith" required>
            </div>
            <div class="group-vertical">
                <label for="prenom">Prénom<span class="danger">*</span></label>
                <input type="text" id="livraison-prenom" name="livraison-prenom" placeholder="John" required>
            </div>
        </div>
        <div class="container">
            <div class="group-vertical">
                <label for="adresse">Adresse<span class="danger">*</span></label>
                <input type="text" id="livraison-adresse" name="livraison-adresse" placeholder="1 rue de Paris" required>
            </div>
            <div class="group-vertical">
                <label for="complement">Complément</label>
                <input type="text" id="livraison-complement" name="livraison-complement" placeholder="Appartement 123">
            </div>
        </div>
        <div class="container">
            <div class="group-vertical">
                <label for="code-portal">Code postal<span class="danger">*</span></label>
                <input type="text" id="livraison-code-portal" name="livraison-code-portal" placeholder="75000" required>
            </div>
            <div class="group-vertical">
                <label for="ville">Ville<span class="danger">*</span></label>
                <input type="text" id="livraison-ville" name="livraison-ville" placeholder="Paris" required>
            </div>
        </div>
        `;
        livraisonAndFacturation.innerText = "Adresse de facturation";
    } else {
        adresseLivraison.style.display = "none";
        document.getElementById("adresse-livraison").innerHTML = "";
        livraisonAndFacturation.innerText = "Adresse de facturation et de livraison";
    }
}

/* va tout controler avant d'activer le paiement */
function activerPaiement(){
    let etat = true;
    let listIdentifiants = ["email", "facturation-nom", "facturation-prenom", "facturation-adresse", "facturation-code-portal", "facturation-ville", "cb-titulaire", "cb-numero", "cb-expire", "cb-code"];
    let listLivraison = ["livraison-nom", "livraison-prenom", "livraison-adresse", "livraison-code-portal", "livraison-ville"];
    const checkboxLivraisonDifferente = document.getElementById("facturation-is-diferent");
    const conditions = document.getElementById("conditions-utilisations");
    for (let i=0; i<listIdentifiants.length; i++){
        if (!verifEtat(listIdentifiants[i])){
            etat = false;
        }
    }
    if(checkboxLivraisonDifferente.checked){
        for (let i = 0; i < listLivraison.length; i++){
            if(!verifEtat(listLivraison[i])){
                etat = false;
            }
        }
    }
    if (!conditions.checked){
        etat = false;
        document.getElementById("label-conditions").style = "color: #db4f2c";
    }
    return etat;
}

function verifEtat(id){
    if (document.getElementById(id).value != ""){
        document.getElementById(id).style = "border: 1px solid #818274";
        return true;
    }else{
        document.getElementById(id).style = "border: 1px solid #db4f2c";
        return false;
    }
}