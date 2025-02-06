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
        alert("Merci d'avoir complété la simulation de commande ! Nous espérons que vous avez apprécié l'expérience.");
        clearCartAndForm();
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