const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data.json');

let data = [];

// Load data from the JSON file
function loadData() {
  try {
    const dataJson = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(dataJson);
  } catch (err) {
    data = [];
  }
}

// Save data to the JSON file
function saveData() {
  const dataJson = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataFilePath, dataJson, 'utf8');
}

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { data: data });
});

app.post('/data', (req, res) => {
  const newData = req.body;
  data.push(newData);
  saveData();
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const item = data[id];
  res.render('edit', { item: item, id: id });
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  data[id] = updatedData;
  saveData();
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  data.splice(id, 1);
  saveData();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Load initial data
loadData();
