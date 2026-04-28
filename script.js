// ============================================
// PIYAYY - SCRIPT ULTRA SOLIDE (sans bibliothèque)
// ============================================

// ---------- PRODUITS ----------
let produits = [];

function initialiserProduits() {
    const saved = localStorage.getItem("piyayy_produits");
    if (saved) {
        try {
            produits = JSON.parse(saved);
            if (!Array.isArray(produits)) produits = [];
        } catch(e) {
            produits = [];
        }
    }
    if (!produits.length) {
        produits = [];
        sauvegarderProduits();
    }
}

function sauvegarderProduits() {
    localStorage.setItem("piyayy_produits", JSON.stringify(produits));
}

function ajouterProduit(produit) {
    if (!produit || !produit.nom) return false;
    produits.push(produit);
    sauvegarderProduits();
    return true;
}

function supprimerProduit(id) {
    produits = produits.filter(p => p.id != id);
    sauvegarderProduits();
}

// ---------- UTILITAIRES ----------
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Initialisation
initialiserProduits();

// Exposer globalement
window.produits = produits;
window.sauvegarderProduits = sauvegarderProduits;
window.ajouterProduit = ajouterProduit;
window.supprimerProduit = supprimerProduit;