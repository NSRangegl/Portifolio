---
name: financial-tracker-skill
description: Tracks expenses and income, and generates simple financial reports. Use this skill when the user wants to add an expense, check balance, or see spending history.
---

# Financial Tracker Skill

## When to use
Use this skill when you need to:
- "Add a new expense" or "Record spending"
- "Show my balance"
- "List recent transactions"
- "How much did I spend on [Category]?"

## Usage
### Scripts
All scripts are located in `scripts/`.

#### `main.py`
The entry point for the skill.

**Commands:**
- `add <amount> <category> <description>`: Adds a transaction.
- `balance`: Shows total balance.
- `history`: Helper to list recent transactions.

**Example:**
```bash
python scripts/main.py add 50.0 Food "Lunch at McDonald's"
python scripts/main.py balance
```

## Data
Data is stored in `data/transactions.json` (or a database in production).
