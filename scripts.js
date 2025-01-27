// frontend/scripts.js

// Funzione per ottenere i dati delle Monster dal backend
function getMonsters() {
    fetch('http://localhost:3000/api/monsters')
        .then(response => response.json())
        .then(data => {
            // Verifica che i dati siano correttamente recuperati
            console.log('Dati recuperati:', data);
            
            displayMonsters(data);
            updateOwnedCount(data); // Aggiungi il calcolo del numero di possedute
        })
        .catch(error => console.error('Errore nel recupero dei dati:', error));
}

// Funzione per visualizzare le Monster
function displayMonsters(data) {
    for (const category in data) {
        const categoryList = document.getElementById(category);
        categoryList.innerHTML = ''; // Reset della lista esistente

        data[category].forEach(monster => {
            const ownedStatus = monster.owned ? 'Posseduta' : 'Non posseduta';
            const buttonText = monster.owned ? 'Segna come non posseduta' : 'Segna come posseduta';
            categoryList.innerHTML += `
                <li>
                    ${monster.name} - ${ownedStatus}
                    <button onclick="toggleMonster('${category}', '${monster.name}', ${!monster.owned})">${buttonText}</button>
                </li>
            `;
        });
    }
}

// Funzione per segnare una Monster come posseduta o non posseduta
function toggleMonster(category, monster, owned) {
    fetch('http://localhost:3000/api/monsters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, monster, owned })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dati salvati:', data);
        getMonsters(); // Ricarica la lista dopo l'aggiornamento
    })
    .catch(error => console.error('Errore nel salvataggio dei dati:', error));
}

// Funzione per calcolare e aggiornare il numero di Monster possedute
function updateOwnedCount(data) {
    let ownedCount = 0;
    for (let category in data) {
        // Conta quante Monster in ogni categoria sono possedute
        ownedCount += data[category].filter(monster => monster.owned).length;
    }

    // Verifica che l'elemento esista
    const ownedNumberElement = document.getElementById('owned-number');
    if (ownedNumberElement) {
        // Mostra il numero di Monster possedute nel DOM
        ownedNumberElement.textContent = ownedCount;
    } else {
        console.error('Elemento "owned-number" non trovato nel DOM');
    }
}

// Carica le Monster all'avvio della pagina
window.onload = function() {
    getMonsters();
};
