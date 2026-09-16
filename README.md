# Inventory Application

A CRUD app where you can store games, and edit, remove or add related categories to them.

## Tech Stack

- **Node.js**
- **Express**
- **EJS**
- **PostgreSQL**

## How to Run Locally

### Dependencies
- dotenv
- EJS
- Express
- express-validator
- pg

### Installation

1. Clone the repository

   ```bash
   git clone git@github.com:Lancer385/Inventory-Application.git
   cd Inventory-Application
   ```

2. Install dependencies

   ```bash
   npm install
   ```

4. Set up the database

   You need to create a local database first or host one through a provider (e.g Neon). Then run the Populate Script:

   ```bash
   Usage: node ./db/populatedb.js [OPTION]
   -c, --create
   Create your tables(only once or after reset)

   -d, --drop
   drop all of the tables and start over(run --create)
   
   -s, --seed
   Seed your tables with random data
   ```

5. Start the server

   ```bash
   node app.js
   ```
