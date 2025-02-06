function displayCart() {
    const cartContainer = document.getElementById("caroussel-panier");
    cartContainer.innerHTML = "";
    panier.forEach((product, index) => {
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
                        <span>${product.quantity || 1}</span>
                        <button class="plus" onclick="increaseQuantity(${index})"></button>
                    </td>
                </tr>
                <tr>
                    <td class="gauche">Sous-Total</td>
                    <td class="droit">${(product.price * (product.quantity || 1)).toFixed(2)} €</td>
                </tr>
            </table>
        `;
        cartContainer.appendChild(productCard);
    });
}

function increaseQuantity(index) {
    panier[index].quantity = (panier[index].quantity || 1) + 1;
    localStorage.setItem("panier", JSON.stringify(panier));
    displayCart();
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