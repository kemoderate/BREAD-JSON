const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let data = [];

// Read data from data.json file
fs.readFile('data.json', 'utf8', (err, jsonData) => {
  if (err) throw err;
  if (jsonData) {
    data = JSON.parse(jsonData);
  }
});

app.get('/', (req, res) => {
    res.render('index', { data });
  });
  

app.get('/browse', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice(startIndex, endIndex);
  
    res.render('browse', { data: paginatedData, totalPages });
  });
  

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const newData = {
    id: data.length + 1,
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean === 'true',
  };

  data.push(newData);

  fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    res.redirect('/browse');
  });
});

app.get('/delete/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  const itemIndex = data.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    res.send('Data entry not found');
  } else {
    data.splice(itemIndex, 1);
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) throw err;
      res.redirect('/browse');
    });
  }
});


app.get('/edit/:id', (req, res) => {
  const entryId = parseInt(req.params.id);
  const entry = data.find((item) => item.id === entryId);

  if (!entry) {
    res.send('Data entry not found');
  } else {
    res.render('edit', { entry });
  }
});

app.post('/edit/:id', (req, res) => {
  const entryId = parseInt(req.params.id);
  const entryIndex = data.findIndex((item) => item.id === entryId);

  if (entryIndex === -1) {
    res.send('Data entry not found');
  } else {
    data[entryIndex] = {
      id: entryId,
      string: req.body.string,
      integer: parseInt(req.body.integer),
      float: parseFloat(req.body.float),
      date: req.body.date,
      boolean: req.body.boolean === 'true',
    };

    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) throw err;
      res.redirect('/browse');
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
