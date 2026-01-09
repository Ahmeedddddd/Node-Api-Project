# Node.js API - Users & Categories Management

Een database-driven REST API gebouwd met Node.js en Express voor het beheren van gebruikers en categorieën met validatie en zoekmogelijkheden.

---

## Overzicht

Dit project implementeert een volledige REST API met CRUD-operaties voor twee entiteiten:

- **Users** - Gebruikersgegevens beheer (voornaam, achternaam, email)
- **Categories** - Categorieën beheer (naam)

De API voldoet aan alle functionele en technische requirements met volgende features:

- Volledige CRUD-operaties voor beide entiteiten
- Inputvalidatie op alle endpoints
- Zoekmogelijkheden op meerdere velden
- Pagination met limit en offset
- Sorting en filtering
- SQLite database
- Gedetailleerde API-documentatie op root endpoint

---

## Installatie en Setup

### Vereisten

- Node.js versie 20.0.0 of hoger
- npm package manager

### Stap 1: Dependencies installeren

```bash
npm install
```

### Stap 2: Server starten

```bash
npm run dev
```

De API wordt gestart op: http://localhost:3001

### Stap 3: Database seeden (optioneel)

```bash
npm run seed
```

---

## API Documentatie

Bezoek http://localhost:3001 in je browser voor de volledige interactieve API documentatie met alle endpoints en voorbeelden.

### Health Check

Controleer of de API online is:

```bash
curl http://localhost:3001/health
```

---

## Functionele Requirements

### Twee CRUD Interfaces

#### Categories - /api/categories

| Methode | Endpoint | Beschrijving |
|---------|----------|-------------|
| GET | /api/categories | Haal alle categorieën op |
| GET | /api/categories/:id | Haal een specifieke categorie op |
| POST | /api/categories | Maak een nieuwe categorie aan |
| PUT | /api/categories/:id | Update een bestaande categorie |
| DELETE | /api/categories/:id | Verwijder een categorie |

#### Users - /api/users

| Methode | Endpoint | Beschrijving |
|---------|----------|-------------|
| GET | /api/users | Haal alle gebruikers op |
| GET | /api/users/:id | Haal een specifieke gebruiker op |
| POST | /api/users | Maak een nieuwe gebruiker aan |
| PUT | /api/users/:id | Update een bestaande gebruiker |
| DELETE | /api/users/:id | Verwijder een gebruiker |

### Basisvalidatie

Alle endpoints valideren de invoer. Validatiefouten retourneren een 400-response met gedetailleerde foutmeldingen.

#### Categories validatie

- **Name**: Verplicht veld, maximum 100 karakters, mag geen cijfers bevatten

#### Users validatie

- **FirstName**: Verplicht veld, maximum 100 karakters, mag geen cijfers bevatten
- **LastName**: Verplicht veld, maximum 100 karakters, mag geen cijfers bevatten
- **Email**: Verplicht veld, moet geldig email-formaat zijn

Voorbeeld van validatiefout:

```json
{
  "error": "ValidationError",
  "details": {
    "firstName": "First name is required.",
    "email": "Email must be a valid email address."
  }
}
```

### Pagination

Alle LIST endpoints ondersteunen paginering met volgende parameters:

```
GET /api/users?limit=10&offset=0
GET /api/categories?limit=5&offset=20
```

Queryparameters:

- `limit` (integer, standaard: 10, maximum: 50) - Aantal items per pagina
- `offset` (integer, standaard: 0) - Startpositie

Response-format met metadata:

```json
{
  "data": [
    { "id": 1, "firstName": "John", "lastName": "Doe", "email": "john@example.com", "created_at": "2025-01-09 12:00:00", "updated_at": "2025-01-09 12:00:00" }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "total": 42
  }
}
```

### Search Functionaliteit

Search op meerdere velden wordt ondersteund:

**Users zoeken:**

```bash
curl "http://localhost:3001/api/users?search=john&limit=5&offset=0"
```

Zoekt in: firstName, lastName, email

**Categories zoeken:**

```bash
curl "http://localhost:3001/api/categories?search=tech&limit=10&offset=0"
```

Zoekt in: name



---

## Extra Features

### Geavanceerde Validatie

- Email-formaat validatie (RFC 5322 compatible)
- Geen cijfers in namen
- Maximale lengte per veld
- Trimmen van whitespace
- Type-checking

### Sorting Support

```bash
curl "http://localhost:3001/api/users?sort=firstName&order=asc"
curl "http://localhost:3001/api/users?sort=email&order=desc"
curl "http://localhost:3001/api/categories?sort=name&order=asc"
```

Allowed sort fields:

- **Users**: id, firstName, lastName, email
- **Categories**: id, name

### Sorteer + Search + Pagination gecombineerd

```bash
curl "http://localhost:3001/api/users?search=john&sort=lastName&order=asc&limit=10&offset=0"
```

---

## Gebruiksvoorbeelden

### Categorieën

Alle categorieën ophalen:

```bash
curl http://localhost:3001/api/categories
```

Zoeken naar categorieën:

```bash
curl "http://localhost:3001/api/categories?search=tech"
```

Categorie aanmaken:

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Technology"}'
```

Categorie updaten:

```bash
curl -X PUT http://localhost:3001/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Category"}'
```

Categorie verwijderen:

```bash
curl -X DELETE http://localhost:3001/api/categories/1
```

### Gebruikers

Alle gebruikers ophalen:

```bash
curl http://localhost:3001/api/users
```

Gebruikers zoeken:

```bash
curl "http://localhost:3001/api/users?search=john"
```

Gebruiker aanmaken:

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }'
```

Gebruiker updaten:

```bash
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  }'
```

Gebruiker verwijderen:

```bash
curl -X DELETE http://localhost:3001/api/users/1
```

---

## Technische Requirements

| Requirement | Waarde |
|------------|--------|
| Node.js | 20.0.0 of hoger |
| Package Manager | npm |
| Framework | Express 5.2.1 |
| Database | SQLite (better-sqlite3) |
| HTTP Verbs | GET, POST, PUT, DELETE |
| REST Principles | Volledig geïmplementeerd |

---

## Gebruikte Technologieën

| Technologie | Versie | Doel |
|------------|--------|------|
| Node.js | 20.0.0+ | JavaScript runtime |
| Express | 5.2.1 | Web framework |
| better-sqlite3 | 12.5.0 | SQLite database driver |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 17.2.3 | Environment variables |

---

## Projectstructuur

```
.
├── app.js                           # Main application entry point
├── package.json                     # Dependencies en scripts
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── database/
│   └── node.sqlite                 # SQLite database bestand
├── scripts/
│   └── seed.js                     # Database seeding script
└── src/
    ├── controllers/
    │   ├── users.controller.js     # User business logic
    │   └── categories.controller.js # Category business logic
    ├── routes/
    │   ├── users.routes.js         # User endpoints
    │   └── categories.routes.js    # Category endpoints
    ├── validators/
    │   ├── users.validator.js      # User input validation
    │   └── categories.validator.js # Category input validation
    └── db/
        └── database.js              # SQLite connection setup
```

---

## Environment Variables

Maak een .env bestand in de root directory:

```env
PORT=3001
DB_PATH=./database/node.sqlite
NODE_ENV=development
```

Beschrijving:

- PORT - Server port (standaard: 3001)
- DB_PATH - Pad naar SQLite database bestand
- NODE_ENV - Omgeving (development/production)

---

## Testing van de API

De API kan getest worden met:

### Browser

Voor GET requests:

```
http://localhost:3001
http://localhost:3001/api/users
http://localhost:3001/api/categories
```

### cURL (Command-line)

```bash
curl http://localhost:3001/api/users
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d '{...}'
```

### Postman

API endpoints importeren en alle HTTP methods testen

### Thunder Client

VS Code extension voor API testing

---

## HTTP Status Codes

| Status | Beschrijving |
|--------|-------------|
| 200 | OK - Request succesvol |
| 201 | Created - Resource aangemaakt |
| 204 | No Content - Succesvol verwijderd |
| 400 | Bad Request - Validatiefout |
| 404 | Not Found - Resource niet gevonden |
| 500 | Internal Server Error - Server fout |

---

## Error Handling

### Validatiefout (400)

```json
{
  "error": "ValidationError",
  "details": {
    "firstName": "First name must not contain digits."
  }
}
```

### Not Found (404)

```json
{
  "error": "NotFound",
  "details": "User with id 999 not found"
}
```

### Database Error (500)

```json
{
  "error": "DatabaseError",
  "details": "Error message..."
}
```

---

## Bronvermelding

Dit project is volledig origineel geschreven en geïmplementeerd. Gebruikte bronnen:

### Officiële Documentatie

- Node.js Documentation (https://nodejs.org/docs/) - Server runtime
- Express.js Guide (https://expressjs.com/) - Web framework
- SQLite Documentation (https://www.sqlite.org/docs.html) - Database
- better-sqlite3 (https://github.com/WiseLibs/better-sqlite3) - SQLite driver

### HTTP en REST Standaarden

- HTTP Methods (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) - REST API best practices
- HTTP Status Codes (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) - Status code reference

### Validatie

- Email Validation - RFC 5322 email format standard
- Input Validation Best Practices - OWASP guidelines

### Security

- Node.js Security (https://nodejs.org/en/docs/guides/security/)
- CORS (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Auteur

Backend Web API Project - EHB 2026

---

## Licentie

ISC

---

## Checklist - Voldaan aan Requirements

### Functionele Requirements

- Twee CRUD interfaces (Users & Categories)
- Basisvalidatie (verplichte velden, types, formats)
- Pagination met limit en offset
- Search op meerdere velden
- API documentatie op root endpoint

### Technische Requirements

- Node.js (versie 20+)
- Express framework
- SQLite database
- Correcte HTTP verbs (GET, POST, PUT, DELETE)
- README.md met installatie, bronnen, informatie
- .gitignore met node_modules
- Git repository

### Extra Features

- Geavanceerde validatie (email format, geen cijfers in namen)
- Sorting support
- Multi-field search
- Timestamp tracking (created_at, updated_at)