# HT2023 DT162G Datateknik GR (B), Javascriptbaserad webbutveckling, 7,5 hp (distans) - PROJEKT - WebbKodsLärlingen (maka2207)

## KOM IGÅNG LOKALT

- SERVER KÖRS PÅ: localhost:5000
- KLIENT KÖRS PÅ: localhost:3000

0. Konfigurera så att MongoDB är redo att köras lokalt (på mongodb://localhost:27017).

1. Öppna VSCode och välj mapp, öppna sedan Terminal och skriv:`git clone https://github.com/WebbkodsLarlingen/dt162g-projekt-maka2207.git`.

2. Skriv sedan i samma Terminal:`npm run installall` i mappen där repo klonades (både server & frontend installeras nu).

3. Skriv också i samma Terminal:`npm run startserver` för att starta lokalserver (körs på localhost:5000).

4. Öppna nu ny Terminal och skriv i den:`npm run startclient` så startas ReactJS-appen (körs på localhost:3000).

5. Besök nu http://localhost:3000/ för fullständig MERN-upplevelse!

6. Skriv i Terminal i klonade huvudmappen:`npm run installimages` för att återställa/kopiera nya bilder från backup-mappen (sker på serversidan). Dessa hamnar då i `/server/images/components`.

7. Skriv i Terminal i klonade huvudmappen:`npm run installmongodb` för att återställa/skapa testdata i MongoDB-databasen (sker på serversidan). Databasen heter då:`maka2207` och dess kollektion:`pccomponents`.

## ENDPOINTS

Alla REST API endpoints följer formatet `localhost:5000/api/{CRUD endpoint}`.

Mer uppdateras snart.
