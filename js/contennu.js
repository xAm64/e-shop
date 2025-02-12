function afficheHeader(){
    const header = document.getElementById("header");
    let contenu = 
        '<nav>'+
            '<ul>'+
                '<li><a href="produits.html"><img id="logoSite" src="images/logo.svg"></a></li>'+
                '<li>';
                    if (window.location.pathname.includes("index.html")){
                        contenu += '<a href="#"  class="curent-page" onclick="alert(`Vous êtes déjà sur la page d\'accueil`);">';
                    } else {
                        contenu += '<a href="index.html">';
                    }
                contenu +=  'Accueil</a></li>'+
                '<li>';
                    if (window.location.pathname.includes("produits.html")){
                        contenu += '<a href="#" class="curent-page" onclick="alert(`Vous êtes déjà sur la page des produits`);">';
                    } else {
                        contenu += '<a href="produits.html">';
                    }
                contenu += 'Produits</a></li>'+
                '<li>';
                    if (window.location.pathname.includes("panier.html")){
                        contenu += '<a href="#" class="current-page" onclick="alert(`Vous êtes déjà sur la page du panier`);">';
                    } else {
                        contenu += '<a href="panier.html">';
                    }
                contenu += 'Panier <span id="cart-count"></span></a></li>'+
            '</ul>'+
        '</nav>'+
        '<div id="banner-header">'+
            '<div id="current-time">00:00</div>'+
            '<div class="search-bar"><input type="researsh" placeholder="Prochainement disponible"></div>'+
            '<div class="user-login" id="navbar-login">'+
                '<a href="connexion.html">'+
                    '<img src=" images/user.svg " alt="Utilisateur ">'+
                '</a>'+
            '</div>'+
        '</div>';

    header.innerHTML = contenu;
}

function afficheFooter(){
    const footer = document.getElementById("footer");
    let contenu =
        '<div class="center">©Max Thirioux 2025 - <span id="get-current-year">2025</span></div>'+
        '<nav>'+
            '<ul>'+
                '<li><a href="conditions.html" target="_blanc">Conditions d\'utilisation</a></li>'+
                '<li><a href="contact.html">Me contacter</a></li>'+
            '</ul>'+
        '</nav>';
    footer.innerHTML = contenu;
}

function genererHtmlMotPasse(){
    let pass = gereateRandomPassword();
    document.getElementById("zone-passwords").innerHTML =
        '<div class="group-vertical">'+
        '<label for="inscription-password">Mot de passe<span class="danger">*</span></label>'+
        '<input type="password" name="inscription-password" id="inscription-password" placeholder="'+pass+'" value="" required>'+
        '<label for="inscription-password-confirm">Reécrivez, votre mot de passe<span class="danger">*</span></label>'+
        '<input type="password" name="inscription-password-confirm" id="inscription-password-confirm" placeholder="'+pass+'" value="" required></input>'+
        '</div>';

    let htmlSuggest = '<ul>';
    for (let i = 0; i < 5 ; i++){
        htmlSuggest += '<li>'+gereateRandomPassword()+'</li>';
    }
    htmlSuggest += '</ul>';
    document.getElementById("suggestion-passwords").innerHTML = htmlSuggest;
}