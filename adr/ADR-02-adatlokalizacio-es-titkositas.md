# ADR-02: Adatlokalizáció és Titkosítás – On-premise üzemeltetés, AES-256 at-rest encryption

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## Kontextus

A MundaMail egy állami tulajdonú, közszolgáltatási infrastruktúra, amely Zamunda összes állampolgárának személyes levelezését kezeli – beleértve az egészségügyi, jogi és szociális tárgyú hivatalos üzeneteket is. A rendszer által kezelt adatok rendkívül érzékenyek: ha egy állampolgár egészségügyi kezelésről értesítést kap, annak tartalmát csak a jogosult felek ismerhetik meg.

A ZDR program egyik sarokköve az, hogy Zamunda digitális szuverenitást szerez: a ZDR keretében épített rendszerek adatait az ország határain belül kell tárolni és feldolgozni. Ez nem csupán politikai preferencia, hanem az esettanulmányban explicit követelményként megjelölt műszaki és jogi elvárás.

Ezen felül az adatvédelmi megfontolások "kimagasló fontossággal" bírnak a projekt meghatározása szerint – ez a legmagasabb prioritású minőségi attribútum az egész rendszerben.

---

## Kihívás

Szembesülve azzal, hogy:

- A felhőszolgáltatók (AWS, Azure, GCP) kényelmes, gyorsan bevethető infrastruktúrát kínálnak, de adatközpontjaik jellemzően nem Zamunda területén találhatók, és a szolgáltató saját adatvédelmi feltételei érvényesülnek, amelyek ütközhetnek a zamundai állampolgárok érdekeivel.
- Egy kompromittált levelezési rendszer – ahol az állam és az állampolgár közötti bizalmas kommunikáció kitudódik – súlyos politikai és jogi következményekkel járna, és aláásná a ZDR program hitelességét.
- A titkosítás nélkül tárolt emailek adatbázis-szivárgás esetén teljes egészükben olvashatóvá válnának, ami 10 millió állampolgár levelezésének közvetlen kompromittálódását jelentené.
- A "tárolt adatok titkosítása" követelmény (NF-SEC-02, NF-SEC-04) teljesítése önmagában nem elegendő, ha a titkosítási kulcsokat egy külföldi felhőszolgáltató Key Management Service-e tárolja – ekkor az adat ugyan titkosított, de nem Zamunda kontrollja alatt áll.

---

## Döntés

**On-premise üzemeltetést** választottunk Zamunda területén belül elhelyezett szerverparkkal, kombinálva kötelező **AES-256 server-side titkosítással** és **zamundai kulcskezelő rendszerrel (KMS)**:

1. **On-premise infrastruktúra:** A teljes MundaMail rendszer (számítás, tárolás, hálózat) kizárólag Zamunda területén elhelyezett, állami tulajdonú vagy államilag bérelt adatközpontban üzemel. Külső felhőszolgáltató igénybevétele adatkezelési célra nem megengedett.

2. **AES-256 at-rest titkosítás:** A Mailbox Store-ban tárolt összes email tartalom (tárgy, törzs, mellékletek) AES-256 algoritmusal titkosítva kerül tárolásra. A titkosítás az alkalmazásrétegben vagy az adatbázismotor szintjén valósul meg.

3. **Zamundai KMS:** A titkosítási kulcsokat dedikált, Zamundán belül üzemelő kulcskezelő rendszer (Key Management System) tárolja, amelyhez kizárólag az erre felhatalmazott rendszerkomponensek férhetnek hozzá.

4. **In-transit titkosítás:** Minden hálózati kommunikáció (frontend ↔ backend, szerver ↔ szerver, kliens ↔ IMAP/SMTP) TLS 1.2 vagy magasabb verzión keresztül zajlik.

---

## Elvetett alternatívák

**Publikus felhő (AWS / Azure / GCP):** Kényelmes, azonnal skálázható, és kiváló beépített titkosítási megoldásokat kínál. Azonban az adatok fizikailag elhagynák Zamundát, és a szolgáltató saját adatvédelmi irányelvei érvényesülnének. Ez politikailag és jogilag elfogadhatatlan a ZDR program keretében.

**Privát felhő külföldi adatközpontban (pl. bérelt dedikált szerverek):** A fizikai kontroll jobban megőrzhető, de a zamundai jogrend szerinti hatósági felügyelet nem érvényesíthető hatékonyan. Az adatszolgáltatási kötelezettség a befogadó ország joghatósága alá eshet.

**Titkosítás nélküli tárolás, erős hozzáférés-kontrolra alapozva:** A hozzáférés-kontroll önmagában nem elegendő: belső fenyegetések (kompromittált rendszergazda), adatbázis-biztonsági rések vagy fizikai adathordozók ellopása esetén az adatok azonnal olvashatók lennének. A 10 millió állampolgár adatainak védelme ennél magasabb védelmi szintet követel.

**Kizárólag end-to-end titkosítás (E2EE):** Az E2EE maximális védelmet nyújtana, de inkompatibilis az auditálási követelménnyel: ha a szerver nem fér hozzá a tartalmakhoz, nem tudja naplózni a megnyitási és törlési eseményeket, és nem tudja a tracking-et elvégezni. Az F-TRK-01–F-TRK-04 követelmények teljesítése server-side hozzáférést feltételez.

---

## Elérendő célok

- Zamunda teljes adatszuverenitást gyakorol a polgárai levelezési adatai felett: semmiféle külföldi entitásnak nincs jogalapja az adatokhoz való hozzáférésre.
- Adatbázis-szivárgás esetén a nyers adatok olvashatatlanok maradnak a kulcs nélkül.
- Az állampolgárok megalapozottan bízhatnak abban, hogy levelezésüket az állam a saját érdekükben, nem pedig profitorientált szempontból kezeli.
- Az NF-SEC-02 és NF-SEC-04 biztonsági követelmények teljesülnek.

---

## Elfogadott kompromisszumok

- **Magasabb kezdeti és üzemeltetési költség:** Az on-premise infrastruktúra kiépítése (szerverparkterem, hűtés, UPS, hálózat) és fenntartása lényegesen drágább, mint egy felhőszolgáltatás havonta fizetett díja. A ZDR program ezt tudatosan vállalja a szuverenitásért cserébe.
- **Skálázási rugalmasság csökkentése:** Felhőszolgáltatásnál percek alatt lehetne új kapacitást hozzáadni; on-premise esetén a fizikai hardverbeszerzés heteket vagy hónapokat vehet igénybe. Gondos kapacitástervezés és kellő tartalék előre kiosztása szükséges.
- **Az üzemeltetési kompetencia-igény megnövekszik:** Egy dedikált infrastruktúra-csapatot kell fenntartani, amely fizikai és virtualizált környezetben egyaránt kompetens. Ez rekrutálási és bérköltség-kihívást jelent.
- **KMS mint single point of failure:** Ha a kulcskezelő rendszer elérhetetlenné válik, a titkosított emailek nem olvashatók. A KMS saját magas rendelkezésre állását (HA) és biztonsági mentési stratégiáját külön kell megtervezni.
