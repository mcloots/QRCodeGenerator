# Vaste QR

Een Nederlandstalige, mobielvriendelijke website die een URL omzet naar een downloadbare QR-code. Geen account, database, API-sleutel of doorstuurdienst nodig. De URL wordt alleen in de browser verwerkt en wordt niet opgeslagen of verstuurd.

## Lokaal gebruiken

Installeer Node.js 22.12 of nieuwer en voer in deze map uit:

```sh
npm ci
npm run dev
```

Open de lokale URL die Vite toont. Met `npm test` controleer je URL-validatie en of een gegenereerde QR-code naar de oorspronkelijke URL decodeert. `npm run build` maakt de productieversie in `dist`.

## Via GitHub naar Netlify

1. Maak een GitHub-repository en upload dit project, inclusief `package-lock.json` en `netlify.toml`. Upload `node_modules` en `dist` niet.
2. Kies in Netlify voor het importeren van een bestaand project en verbind je GitHub-repository.
3. Netlify leest de instellingen uit `netlify.toml`: build command `npm run build`, publish directory `dist`, Node.js 22. De projectmap is de hoofdmap van de repository.
4. Start de deployment. Latere pushes naar de gekoppelde productiebranch worden automatisch opnieuw gebouwd en gepubliceerd.

Er zijn geen omgevingsvariabelen nodig. Zie ook de [Netlify-documentatie over buildconfiguratie](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Wat betekent zonder vervaldatum?

Dit is een **statische QR-code**: de ingevulde URL staat rechtstreeks in de afbeelding. Er zit geen abonnement, vervaldatum of afhankelijkheid van deze generator in de gedownloade code. Hij blijft werken als deze website later offline gaat.

De bestemming moet wel blijven bestaan en bereikbaar zijn. Een QR-code kan niet garanderen dat een domein of pagina voor altijd online blijft. De bestemming van een bestaande QR-code kun je niet wijzigen; bij een andere URL maak je een nieuwe code.

PNG-downloads zijn 1200 × 1200 pixels; SVG is schaalbaar voor drukwerk. Beide gebruiken zwarte modules op een witte achtergrond, foutcorrectie M en een witte rand van vier modules. Test je code na het afdrukken met een telefoon en houd de witte rand intact.

## Techniek

Vanilla JavaScript en CSS, Vite voor de build en de [qrcode-bibliotheek](https://github.com/soldair/node-qrcode) voor PNG/SVG. Alle benodigde runtime-code wordt lokaal meegebundeld; er worden geen externe fonts of QR-diensten geladen.
