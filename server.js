const express = require('express');
const app = express();
app.use(express.json());
const { Pool } = require('pg');
const pool = new Pool({ database: 'finance_tracker' });

function validate(body) {
  if (!body.description) {
    return 'Your description field is empty.'
  }

  if (typeof (body.amount) !== 'number') {
    return 'Your amount field is not a number.'
  }

  if (body.amount <= 0) {
    return 'Your amount field is lower or equal to 0.'
  }

  if (body.type !== 'income' && body.type !== 'expense') {
    return 'Your type field is not income or expense'
  }

  return null
}


function parseId(value) {
  if (Number.isInteger(value) && value > 0) {
    return value
  } else { return null }
}


app.get('/transactions', async (req, res) => {
  const result = await pool.query('SELECT id, description, CAST(amount AS FLOAT) AS amount, type FROM transactions ORDER BY id ASC');
  res.json(result.rows);
});

app.post('/transactions', async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const description = req.body.description;
  const amount = req.body.amount;
  const type = req.body.type;
  const result = await pool.query(
    'INSERT INTO transactions(description, amount, type) VALUES ($1, $2, $3) RETURNING id, description, CAST(amount AS FLOAT) AS amount, type',
    [description, amount, type],

  );
  res.status(201).json(result.rows[0]);
});

app.put('/transactions/:id', async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const id = Number(req.params.id)
  if (!parseId(id)){
    return res.status(400).json({error: 'Insert a valid ID number.'})
  }
  const result = await pool.query('UPDATE transactions SET description = $1, amount = $2, type = $3 WHERE id = $4 RETURNING id, description, CAST(amount AS FLOAT) AS amount, type',
    [
      req.body.description,
      req.body.amount,
      req.body.type,
      id,
    ])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Transaction not found.' })
  } else { return res.status(200).json(result.rows[0]) }
})

app.delete('/transactions/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!parseId(id)){
    return res.status(400).json({error: 'Please insert a valid ID number.'})
  }
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Nothing matched, try again with another id.' })
  }
  res.status(204).send()
});

app.get('/transactions/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (!parseId(id)) {
    return res.status(400).json({ error: 'Please insert a valid ID transaction.' })
  }
  const result = await pool.query(
    'SELECT id, description, CAST(amount AS FLOAT) AS amount, type FROM transactions WHERE id = $1',
    [id]
  );
  if (result.rows.length) {
    res.status(200).json(result.rows[0])
    return;
  } else { res.status(404).json({ error: 'Transaction not found' }) }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});