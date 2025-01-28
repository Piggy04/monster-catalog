const express = require('express');
const cors = require('cors'); // Importa il modulo cors
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Usa il middleware cors

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

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
                console.log(`Monster aggiornata: ${monster}, Owned: ${owned}`);  // Log per debug
            } else {
                return res.status(404).send('Monster non trovata nella categoria');
            }
        } else {
            return res.status(404).send('Categoria non trovata');
        }

        // Log per vedere i dati che stiamo salvando
        console.log('Dati aggiornati:', JSON.stringify(jsonData, null, 2));

        // Salva i nuovi dati nel file
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio dei dati');
            }
            console.log('Dati salvati correttamente nel file!');  // Log per confermare
            res.status(200).send('Dati salvati correttamente');
        });
    });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
