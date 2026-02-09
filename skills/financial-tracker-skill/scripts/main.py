import sys
import json
import os
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "transactions.json"

def ensure_data_file():
    if not DATA_FILE.parent.exists():
        DATA_FILE.parent.mkdir(parents=True)
    if not DATA_FILE.exists():
        with open(DATA_FILE, "w") as f:
            json.dump([], f)

def load_transactions():
    ensure_data_file()
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_transactions(transactions):
    ensure_data_file()
    with open(DATA_FILE, "w") as f:
        json.dump(transactions, f, indent=2)

def add_transaction(amount, category, description):
    transactions = load_transactions()
    transaction = {
        "id": len(transactions) + 1,
        "date": datetime.now().isoformat(),
        "amount": float(amount),
        "category": category,
        "description": description
    }
    transactions.append(transaction)
    save_transactions(transactions)
    return transaction

def get_balance():
    transactions = load_transactions()
    total = sum(t["amount"] for t in transactions)
    return total

def list_history():
    transactions = load_transactions()
    return transactions[-10:] if transactions else []

# Only run CLI logic if executed directly
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py <command> [args]")
    else:
        command = sys.argv[1]
        if command == "add":
            if len(sys.argv) < 5:
                print("Usage: add <amount> <category> <description>")
            else:
                add_transaction(sys.argv[2], sys.argv[3], " ".join(sys.argv[4:]))
        elif command == "balance":
            print(f"Current Balance: ${get_balance():.2f}")
        elif command == "history":
            for t in list_history():
                print(f"{t['id']} | {t['amount']} | {t['description']}")
        else:
            print(f"Unknown command: {command}")
