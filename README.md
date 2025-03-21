# (A) HT2023 DT162G Datateknik GR (B), Javascriptbaserad webbutveckling, 7,5 hp (distans) - PROJEKT - WebbKodsFrilansaren (tidigare WebbKodsLärlingen) (maka2207)

# VIKTIGT: Ja, du ska ALDRIG ladda upp .env-filer eller liknande "secrets"-filer. Nu är det för att "enkelt kunna testköra lokalt" av rekryterare.

## Vad är detta?

- Techstack = MERN (MongoDB, ExpressJS, ReactJS, NodeJS) där MongoDB+ExressJS+NodeJS är backend och ReactJS är frontend.
- Projektet är ett internt inventeringssystem för det fiktiva bolaget AI Datorer AB.
- Användaren "sysadmin" (skapas automatiskt efter du stegen nedan följts) kan skapa användare med olika behörigheter för att CRUDa inventering av datorkomponenter.
- CRUDa användare och/eller datorkomponenter. Det går även att söka/filtrera på datorkomponent namn.

## KOM IGÅNG LOKALT

- SÄKER REST API-SERVER KÖRS PÅ: localhost:5000
- KLIENT KÖRS PÅ: localhost:3000

1. Öppna VSCode och välj mapp, öppna sedan Terminal och skriv:`git clone https://github.com/WebbKodsFrilansaren/MERN_AI_Datorer_AB.git`.

2. Konfigurera så att MongoDB på din dator är redo att köras lokalt (på mongodb://localhost:27017).

   - Parametrar för MongoDB databas och dess kollektioner är redan färdigkonfigurerade. _VIKTIGT:_ Kör `npm install dotenv -g` så att dotenv-paketet installeras globalt. Annars kanske det "krånglar" med att hitta .env-variablerna. ExpressJS-servern använder nämligen de hårdkodade parametrarna i .env-filen!

3. _GÅ IN I RÄTT MAPP:_ Skriv sedan i samma Terminal:`npm run installall` i mappen där repo klonades (både server & frontend installeras nu).

4. Skriv i Terminal i klonade huvudmappen:`npm run installimages` för att återställa/kopiera nya bilder från backup-mappen (sker på serversidan). Dessa hamnar då i `/server/images/{componentid}`.

5. Skriv i Terminal i klonade huvudmappen:`npm run installmongodb` för att återställa/skapa testdata i MongoDB-databasen (sker på serversidan). Databasen heter då:`maka2207` och deras kollektioner:`pccomponents` (för datorkomponenter + bilder), `users` (användare + deras tokens), `blacklists` (blockerade användare via IP-adresser).

6. Skriv också i samma Terminal:`npm run startserver` för att starta lokalserver (körs på localhost:5000).

7. Öppna nu ny Terminal (kontrollera ) och skriv i den:`npm run startclient` så startas ReactJS-appen (körs på localhost:3000).

8. Besök nu http://localhost:3000/ för fullständig MERN-upplevelse och/eller kör i Thunderclient/POSTMAN om så istället önskas!

### Inloggning

Kontot med fullständig åtkomst som kan skapa nya användare utöver vanlig registrering har följande inloggningsuppgifter (efter att `npm run installmongodb` framgångsrikt har körts):

- Användare: sysadmin
- Lösenord: superAdmin1337

## ENDPOINTS

Alla REST API endpoints följer formatet `localhost:5000/api/{CRUD endpoint}`. Dessa går att använda direkt i ThunderClient/POSTMAN och/eller så används de på samma sätt inuti ReactJS-klienten.

### Public

- GET `localhost:5000/api/refreshatoken/` - Uppdatera access_token med hjälp av refresh_token

- POST `localhost:5000/api/register/` - Registrera ny användare (konto är inaktiverat efteråt, 'sysadmin' måste aktivera det först)

- POST `localhost:5000/api/login/` - Logga in användare (nekas om konto är inaktiverat innan 'sysadmin' har aktiverat det)

- POST `localhost:5000/api/logout/` - Logga ut inloggad användare

### Components

#### GET - Components

- GET `localhost:5000/api/pccomponents/` - Hämta alla komponenter

- GET `localhost:5000/api/pccomponents/{id}` - Hämta komponent med componentid {id}

#### POST - Components

- POST `localhost:5000/api/pccomponents/` - Lägg till ny komponent

#### PUT - Components

- PUT `localhost:5000/api/pccomponents/{id}` - Ändra komponent med componentid {id} (bilder ändras separat men på samma UI-sida)

- PUT `localhost:5000/api/pccomponents/{id}/images/{img_id}` - Ändra bild med {img_id} i komponent med componentid {id}

#### DELETE - Components

- DELETE `localhost:5000/api/pccomponents/{id}` - Radera komponent med componentid {id} (dess bildmapp med alla bilder raderas också)

- DELETE `localhost:5000/api/pccomponents/{id}/images/{img_id}` - Radera bild med {img_id} i komponent med componentid {id}

### Users

_OBS:_ Endast användaren _'sysadmin'_ kan använda dessa endpoints nedan!

#### GET - Users

- GET `localhost:5000/api/users/` - Hämta alla användare

- GET `localhost:5000/api/users/{id}` - Hämta användare med userid {id}

#### POST - Users

- POST `localhost:5000/api/users/` - Skapa ny användare (via sysadmin)

#### PUT - Users

- PUT `localhost:5000/api/users/{id}` - Uppdatera användare med userid {id}

#### DELETE - Users

- DELETE `localhost:5000/api/users/{id}` - Radera användare med userid {id}
