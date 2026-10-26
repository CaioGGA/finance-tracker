const express = require('express');
const app = express();
app.use(express.json());
const { Pool, Result } = require('pg');
const pool = new Pool({ database: 'finance_tracker' });

let transactions = [
  { id: 1, description: 'Groceries', amount: 45.5, type: 'expense' },
  { id: 2, description: 'Salary', amount: 1500, type: 'income' },

];


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


app.get('/transactions', async (req, res) => {
  const result = await pool.query('SELECT id, description, CAST(amount AS FLOAT) AS amount, type FROM transactions ORDER BY id ASC');
  res.json(result.rows);
});


app.post('/transactions', (req, res) => {
  let id;
  if (transactions.length !== 0) {
    id = transactions[transactions.length - 1].id + 1
  } else { id = 1 }

  const transaction = req.body
  const error = validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const new_transaction = { id: id, description: transaction.description, amount: transaction.amount, type: transaction.type }


  transactions.push(new_transaction)
  res.status(201).json(new_transaction)
});

app.put('/transactions/:id', (req, res) => {
  var found = transactions.find((element) => element.id === Number(req.params.id));
  if (found) {
    const error = validate(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    found.description = req.body.description
    found.amount = req.body.amount
    found.type = req.body.type
    res.status(200).json(found)
  } else { res.status(404).json({ error: 'Transaction not found' }) }
});


app.delete('/transactions/:id', (req, res) => {

  const index = transactions.findIndex(t => t.id === Number(req.params.id));
  if (index !== -1) {
    transactions.splice(index, 1)
    res.status(200).json(transactions)
  } else {
    res.status(404).json({ error: 'Transaction not found' })
  }
});


app.get('/transactions/:id', async (req, res) => {
  const id = Number(req.params.id);
  const result = await pool.query(
    'SELECT id, description, CAST(amount AS FLOAT) AS amount, type FROM transactions WHERE id = $1',
    [id]
  );
  if (result.rows.length) {
    res.status(200).json(result.rows[0])
    return
  } else { res.status(404).json({ error: 'Transaction not found' }) }
  // 1. If result.rows is empty, answer 404 with your error message and return.
  // 2. Otherwise, send the first row: result.rows[0]
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});