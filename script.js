// ============================================
// PIYAYY - SCRIPT AVEC PRODUITS.JSON
// ============================================

let produits = [];

// Charger les produits depuis le fichier JSON (visible pour tous)
async function chargerProduits() {
    try {
        const response = await fetch("produits.json");
        if (!response.ok) throw new Error("Fichier produits.json introuvable");
        produits = await response.json();
        console.log("✅ Produits chargés depuis produits.json:", produits.length);
        
        // Rafraîchir l’affichage si la fonction existe
        if (typeof appliquerFiltres === "function") {
            appliquerFiltres();
        }
    } catch (error) {
        console.error("❌ Erreur chargement produits:", error);
        produits = [];
        if (typeof appliquerFiltres === "function") {
            appliquerFiltres();
        }
    }
}

// Sauvegarde (optionnelle, pour utilisation hors ligne)
function sauvegarderProduits() {
    localStorage.setItem("piyayy_produits_backup", JSON.stringify(produits));
}

// Charger depuis le backup (si pas de réseau)
function chargerProduitsBackup() {
    const saved = localStorage.getItem("piyayy_produits_backup");
    if (saved) {
        produits = JSON.parse(saved);
        console.log("📦 Produits chargés depuis backup local");
        if (typeof appliquerFiltres === "function") appliquerFiltres();
    }
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

// Initialisation : on charge depuis le fichier JSON
chargerProduits();

// Exposer globalement
window.produits = produits;
window.sauvegarderProduits = sauvegarderProduits;
