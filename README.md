# HT2023 DT162G Datateknik GR (B), Javascriptbaserad webbutveckling, 7,5 hp (distans) - PROJEKT - WebbKodsLärlingen (maka2207)

# VIKTIGT: Ja, du ska ALDRIG ladda upp .env i rotmappen i detta repo. Detta är bara för "angelägenhetens skull" denna gång också.

## KOM IGÅNG LOKALT

- SÄKER REST API-SERVER KÖRS PÅ: localhost:5000
- KLIENT KÖRS PÅ: localhost:3000

1. Öppna VSCode och välj mapp, öppna sedan Terminal och skriv:`git clone https://github.com/WebbkodsLarlingen/dt162g-projekt-maka2207.git`.

2. Konfigurera så att MongoDB är redo att köras lokalt (på mongodb://localhost:27017).

   - Döp om `.envTEMPLATE` till `.env` för att konfigurera parametrar där (t.ex. lösenord för testkonton och olika slags JWTs). Parametrar för MongoDB databas och dess kollektioner är redan färdigkonfigurerade. _VIKTIGT:_ Kör `npm install dotenv -g` så att dotenv-paketet installeras globalt. Annars kanske det "krånglar" med att hitta .env-variablerna.

3. GÅ IN I RÄTT MAPP: Skriv sedan i samma Terminal:`npm run installall` i mappen där repo klonades (både server & frontend installeras nu).

4. Skriv sen i samma Terminal `npm run generatetokens` för att generera en "access token" och en "refresh token" som bör klistras in i `.env`-filen (den som döpts om från `.envTEMPLATE`-filen). _VIKTIGT:_ Dessa MÅSTE klistras in annars kan det "krångla".

5. Skriv i Terminal i klonade huvudmappen:`npm run installimages` för att återställa/kopiera nya bilder från backup-mappen (sker på serversidan). Dessa hamnar då i `/server/images/{componentid}`.

6. Skriv i Terminal i klonade huvudmappen:`npm run installmongodb` för att återställa/skapa testdata i MongoDB-databasen (sker på serversidan). Databasen heter då:`maka2207` och deras kollektioner:`pccomponents` (för datorkomponenter + bilder), `users` (användare + deras tokens), `blacklists` (blockerade användare via IP-adresser).

7. Skriv också i samma Terminal:`npm run startserver` för att starta lokalserver (körs på localhost:5000).

8. Öppna nu ny Terminal (kontrollera ) och skriv i den:`npm run startclient` så startas ReactJS-appen (körs på localhost:3000).

9. Besök nu http://localhost:3000/ för fullständig MERN-upplevelse!

## ENDPOINTS

Alla REST API endpoints följer formatet `localhost:5000/api/{CRUD endpoint}`.

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

#### GET - Users

#### POST - Users

#### PUT - Users

#### DELETE - Users
