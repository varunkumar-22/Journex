# My Journals

A dark-theme personal journaling platform. Write entries with a rich editor (bold, italic, lists, links) and emoji support. All entries are stored in MySQL with date and time so you can browse and search them anytime.

## Features

- **Dark theme** – Easy on the eyes
- **Rich editor** – Bold, italic, underline, strikethrough, lists, links
- **Emoji support** – Use the 😀 button to insert emojis (or type them with your keyboard)
- **MySQL storage** – All entries saved with date and time
- **List view** – See all journals sorted by date; click to read or edit

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MySQL

Create a `.env` file (copy from `.env.example`) and set your MySQL credentials:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=my_journals
```

### 3. Create the database and table

Make sure MySQL is running, then:

```bash
npm run init-db
```

This creates the `my_journals` database (if it doesn’t exist) and the `journals` table.

### 4. Start the server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

## Usage

- **New entry** – Click “New entry”, add a title (optional), write in the editor, use the toolbar for formatting and the 😀 button for emojis, then **Save**.
- **View entries** – From “All entries”, click any card to read it. Use **Edit** to change it.
- Dates and times are shown on each entry and in the list.

Enjoy journaling.
