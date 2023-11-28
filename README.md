# HT2023 DT162G Datateknik GR (B), Javascriptbaserad webbutveckling, 7,5 hp (distans) - PROJEKT - WebbKodsLärlingen (maka2207)

## KOM IGÅNG LOKALT

- REST API-SERVER KÖRS PÅ: localhost:5000
- BFF-SERVER KÖRS PÅ: localhost:5001
- KLIENT KÖRS PÅ: localhost:3000

0. Konfigurera så att MongoDB är redo att köras lokalt (på mongodb://localhost:27017).

   - Döp om `.envTEMPLATE` till `.env` för att konfigurera parametrar där (t.ex. lösenord för testkonton och olika slags JWTs). Parametrar för MongoDB databas och dess kollektioner är redan färdigkonfigurerade. _VIKTIGT:_ Kör `npm install dotenv -g` så att dotenv-paketet installeras globalt. Annars kanske det "krånglar" med att hitta .env-variablerna.

1. Öppna VSCode och välj mapp, öppna sedan Terminal och skriv:`git clone https://github.com/WebbkodsLarlingen/dt162g-projekt-maka2207.git`.

2. Skriv sedan i samma Terminal:`npm run installall` i mappen där repo klonades (både server & frontend installeras nu).

3. Skriv också i samma Terminal:`npm run startserver` för att starta lokalserver (körs på localhost:5000). Skriv sen i ny Terminal: `npm run startbff` (körs på localhost:5001).

4. Öppna nu ny Terminal och skriv i den:`npm run startclient` så startas ReactJS-appen (körs på localhost:3000).

5. Besök nu http://localhost:3000/ för fullständig MERN-upplevelse!

6. Skriv i Terminal i klonade huvudmappen:`npm run installimages` för att återställa/kopiera nya bilder från backup-mappen (sker på serversidan). Dessa hamnar då i `/server/images/components`.

7. Skriv i Terminal i klonade huvudmappen:`npm run installmongodb` för att återställa/skapa testdata i MongoDB-databasen (sker på serversidan). Databasen heter då:`maka2207` och dess kollektion:`pccomponents`.

8. Skriv i valfri Terminal där ingen server körs `npm run generatetokens` för att generera en "access token" och en "refresh token" som bör klistras in i `.env`-filen (den som döpts om från `.envTEMPLATE`-filen).

## ENDPOINTS

Alla REST API endpoints följer formatet `localhost:5000/api/{CRUD endpoint}`.

Mer uppdateras snart.
