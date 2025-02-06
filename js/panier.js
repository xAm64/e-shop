function displayCart(){
    const cartContainer = document.getElementById("caroussel-panier");
    cartContainer.innerHTML = "";
    panier.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.innerHTML = `
            <h4>${product.nom}</h4>
            <div class="produit-image" style="background-image: url('images/produits/${product.image}')"></div>
            <table>
                <tr>
                    <td class="gauche">Prix unutaire</td>
                    <td class="droit">${product.price} €</td>
                </tr>
                <tr>
                    <td class="gauche">Quantité</td>
                    <td class="panier-quantite"><button class="moins"></button>1<button class="plus"></button></td>
                </tr>
                <tr>
                    <td class="gauche">Sous-Total</td>
                    <td class="droit">${product.price} €</td>
                </tr>
            </table>
        `;
        cartContainer.appendChild(productCard);
    });
}