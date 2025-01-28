const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importa il modulo cors

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Usa il middleware cors
app.use(express.json()); // Middleware per leggere il JSON

// Percorso per leggere il file delle Monster
const dataPath = path.join(__dirname, 'data.json');

// Endpoint per ottenere la lista delle Monster
app.get('/api/monsters', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nel recupero dei dati');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint per aggiornare la lista delle Monster
app.post('/api/monsters', (req, res) => {
    const { category, monster, owned } = req.body;

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nel recupero dei dati');
        }

        const jsonData = JSON.parse(data);

        // Verifica che la categoria esista
        if (jsonData[category]) {
            const index = jsonData[category].findIndex(item => item.name === monster);
            if (index !== -1) {
                // Aggiorna lo stato della Monster nella categoria corretta
                jsonData[category][index].owned = owned;
                console.log(`Monster aggiornata: ${monster}, Owned: ${owned}`); // Log per debug
            } else {
                return res.status(404).send('Monster non trovata nella categoria');
            }
        } else {
            return res.status(404).send('Categoria non trovata');
        }

        // Salva i nuovi dati nel file
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio dei dati');
            }
            res.status(200).send('Dati salvati correttamente');
        });
    });
});

// **Nuovo endpoint**: Ottieni il numero totale di Monster possedute
app.get('/api/monsters/count', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nel recupero dei dati');
        }

        const jsonData = JSON.parse(data);
        let totalOwned = 0;

        // Somma tutte le Monster possedute
        for (const category in jsonData) {
            totalOwned += jsonData[category].filter(monster => monster.owned).length;
        }

        res.json({ totalOwned });
    });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
