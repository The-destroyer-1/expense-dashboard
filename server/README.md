# Expenses Dashboard Backup Server

This is a tiny Express server used by the Expenses Dashboard app to push/pull backups.

Endpoints:
- `POST /backup` - accepts JSON body and saves it to `backup.json` in the server folder
- `GET /backup` - returns the saved `backup.json` if present

Quick start:

1. Open a terminal and change to this directory:

```powershell
cd "c:\Users\HUSSAMTECH.LTD\Downloads\EXPENSES DASHBOARD\server"
```

2. Install dependencies and start server:

```powershell
npm install
npm start
```

3. In the app Backup tab, set the remote URL to `http://localhost:4000/backup` and use Push/Pull.

Optional: enable API key protection

If you want to protect the backup endpoint, set an `API_KEY` environment variable before starting the server. When `API_KEY` is set the server requires the header `x-api-key` (or query param `?api_key=...`) matching the value on every request.

Example (PowerShell):

```powershell
$env:API_KEY = "my-secret-key"
npm start
```

Then in the app Backup tab set Remote URL to `http://localhost:4000/backup` and in the app use the same key by appending `?api_key=my-secret-key` to the URL or ensure your client sends `x-api-key` headers.

