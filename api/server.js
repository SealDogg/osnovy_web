const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

let songs = [
  { id: 1, title: 'Звезда по имени Солнце', chords: 'C Am F G' },
  { id: 2, title: 'Группа крови', chords: 'Em C D Bm' },
];

app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.listen(port, () => console.log(`Server listening on ${port}`));