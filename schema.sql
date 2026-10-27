CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
);