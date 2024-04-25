### Webvision

#### Introductie
Webvision is een app waarmee je een tv ervaring op het internet kan hebben! doormiddel van Gifjes en nieuwsartikelen verkleed als teletekst. Deze applicatie maakt gebruik van verschillende externe API's om een ​​interactieve televisie-ervaring te bieden.

#### Functionaliteiten
1. **Afstandsbediening:**
   - Gebruikers kunnen door verschillende kanalen "zappen" met behulp van een afstandsbediening (of door de geheime manier).
   - Met de afstandsbediening kan je switchen tussen tv en teletekst, maar je kan ook zelf nog prompts invullen.
   
2. **Het web doorzoeken:**
   - Door de input fields kan je alles opzoeken en de je favoriete 'zenders' kijken
   - Browse vooruit en achteruit door de categorieen

3. **Teletekstlezing:**
   - Door het ophalen van een nieuws API zijn er verschillende artikelen te lezen
   -de nieuws API geeft ook veel opties om te bepalen wat je wilt laten zien

#### Technologieën
- **Frontend:**
  - HTML, CSS en JavaScript worden gebruikt met Express templating.

  
- **Backend:**
  - Node.js wordt gebruikt als backend-framework voor het verwerken van verzoeken en het routen.
  
- **API's:**
  - Giphy API: Voor het ophalen van GIF's op basis van verschillende categorieën.
  - TheNewsApi: Voor het ophalen van nieuwsartikelen en hun inhoud.
  - Gamepad API voor een speciale functionaliteit

#### Installatie
1. Clone de GitHub-repository van het project naar uw lokale machine.
2. Installeer de vereiste Node.js-modules met behulp van `npm install`.
3. Maak een bestand `.env` aan en configureer de benodigde API-sleutels.
4. Start de server met behulp van `npm run dev`.

#### Gebruik
1. Open de applicatie in uw webbrowser door naar het adres `http://localhost:<port>` te navigeren (standaardport is 3000).
2. Blader door de beschikbare kanalen en selecteer het gewenste kanaal.
3. Gebruik de afstandsbediening of knoppen op het scherm om door GIF's te bladeren of teletekstartikelen te lezen.

#### Toekomstige Verbeteringen
- Implementatie van gebruikersprofielen en favorietenfunctionaliteit.
- Integratie van meer kanalen en inhoudstypen, zoals films, muziekvideo's, enz.
- Verbeterde gebruikersinterface en visuele ervaring.
- Ondersteuning voor spraakgestuurde bediening.

#### Licentie
Dit project wordt vrijgegeven onder de MIT-licentie. Zie het `LICENSE`-bestand voor meer informatie.
