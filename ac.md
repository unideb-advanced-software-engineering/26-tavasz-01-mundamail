---
title: "Architekturális karakterisztikák"
description: "Az azonosított architekturális karakterisztikák."
---

# Architekturális karakterisztikák

## Skálázhatóság

**Mit jelent?**
-

**Miért fontos?**
- A rendszernek a teljes zamundai lakosságot, mintegy 10 millió felhasználót kell kiszolgálnia. Amikor az állami hivatalok tömeges tájékoztatókat (pl. adóbevallási határidők, országos vészhelyzet) küldenek ki, a másodpercenkénti kérések (request) száma drasztikusan megnőhet. A rendszernek képesnek kell lennie a feldolgozó kapacitás dinamikus növelésére, hogy a levelek sorba állítása és kiküldése ilyenkor se okozzon lassulást vagy szolgáltatás-kiesést.

## Biztonság 

**Mit jelent?**
-

**Miért fontos?**
- A MundaMail nemcsak privát levelezéseket, hanem rendkívül szenzitív állami adatokat (pl. egészségügyi kezelések, adóügyek, nyugdíj) továbbít és tárol. Egy sikeres támadás vagy adatszivárgás a teljes államigazgatásba vetett bizalmat megrengetné.

## Adatvédelem

**Mit jelent?**
-

**Miért fontos?**
- A rendszer a mindennapi levelezés mellett olyan érzékeny állami információkat is kezel, mint az egészségügyi értesítők vagy a nyugdíjjal kapcsolatos ügyek. Ezeket erős titkosítással kell védeni az illetéktelen hozzáféréstől vagy adatszivárgástól.

## Confidentiality

**Mit jelent?**
- https://quality.arc42.org/qualities/confidentiality

**Miért fontos?**
- A rendszernek biztosítania kell, hogy a privát és akár kényes levelezéshez és annak adataihoz, csak az arra felhatalmazott, megfelelő személy fér hozzá. 

## Adat lokalizáció

**Mit jelent?**
-

**Miért fontos?**
- Kimagasló fontossággal bír a rendszer által kezelt adatokat Zamunda területén belül kell tárolni, üzemeltetni

## Robusztusság

**Mit jelent?**
-

**Miért fontos?**
- A ZDR program figyelembe veszi, hogy Zamunda bizonyos területein az internetlefedettség hiányos, a sávszélesség alacsony, a késleltetés pedig magas lehet.

## Hibatűrés

**Mit jelent?**
-

**Miért fontos?**
- Ha egy állampolgár épp egy hivatali ügyet intéz, vagy egy hivatal kiküld egy fontos levelet, egy pillanatnyi hálózati szakadás vagy egy szerver-node leállása miatt az üzenet nem veszhet el a semmiben.

## Bővíthetőség

**Mit jelent?**
-

**Miért fontos?**
- A jelenlegi követelmény az állami rendszerek (egészségügy, nyugdíj) kiszolgálása, de a távlati célok között szerepel az API megnyitása külső vállalkozások (pl. csomagküldők) felé is, kikerülve a klasszikus email protokollokat.

## Tartósság

**Mit jelent?**
-

**Miért fontos?**
- A leveleket a felhasználó által kezdeményezett explicit törlésig meg kell őrizni, ami azt jelenti, hogy potenciálisan örökké tárolni kell őket.

## Auditálhatóság

**Mit jelent?**
-

**Miért fontos?**
- A hivatalos kommunikáció során (pl. határidős felszólítások) jogi alapfeltétel, hogy az állami szervek hitelt érdemlően, megváltoztathatatlan módon tudják bizonyítani egy adott levél sikeres kézbesítését, megnyitását vagy törlését.

## Governability

**Mit jelent?**
-

**Miért fontos?**
- Az államigazgatás számára elengedhetetlen a felhasználók biztonságos, központi regisztrációja, valamint a különböző csatlakozó hivatalok API hozzáféréseinek és jogosultságainak menedzselése.

## Efficient

**Mit jelent?**
-

**Miért fontos?**
- ZDR program kifejezett célkitűzése a költséghatékony és klímabarát működés. A szerverparknak a lehető legkevesebb hardveres erőforrást (CPU, memória) kell pazarolnia, minimalizálva az ökológiai lábnyomot.

## Availability

**Mit jelent?**
-

**Miért fontos?**
- A 10 millió lakos mindennapi élete, valamint az állami szolgáltatások (felsőoktatás, egészségügy) működése is erre a rendszerre támaszkodik. Egy esetleges leállás szó szerint megbéníthatja az országot

## Fault tolerance

**Mit jelent?**
-

**Miért fontos?**
- Rendszer-újraindulás vagy hálózati komponensek meghibásodása esetén is garantálni kell, hogy a kiküldés alatt lévő vagy úton lévő hivatalos levelek nem vesznek el az éterben.

## Usability

**Mit jelent?**
-

**Miért fontos?**
- Ahhoz, hogy az állampolgárok önként és szívesen használják a MundaMailt a mindennapi magánlevelezésükre is, ahhoz valós, letisztult és vonzó alternatívát kell kínálnia a nagy profitorientált szolgáltatókkal szemben.

## Functional completeness

**Mit jelent?**
-

**Miért fontos?**
- Egy levelezőrendszer csak akkor tekinthető versenyképes, "valós alternatívának", ha maradéktalanul teljesíti a modern email-kliensektől elvárt alapfunkciókat, például a szabványos IMAP/SMTP protokollok támogatását és a spamek kezelését.

## Operability

**Mit jelent?**
-

**Miért fontos?**
- Egy 10 millió állampolgárt és a teljes államigazgatást (egészségügy, felsőoktatás, nyugdíj) kiszolgáló nemzeti infrastruktúra esetében nem elég, ha a szoftver fejlesztői környezetben hibátlanul működik. Az állami IT-csapatnak képesnek kell lennie azt élesben, leállások nélkül fenntartani, frissíteni és felügyelni.

## Suitability 

**Mit jelent?**
-

**Miért fontos?**
- Meg kell hogy feleljen mind a céges, mind az állami szektor igényeinek és ezen felül a felhasználók igényeit is kielégitség, hogy megfelelő alternatíva legyen. Ahhoz, hogy valós alternatíva legyen a piacon a többi levelezési rendszerhez képest

## Reliability 

**Mit jelent?**
- 

**Miért fontos?**
- Mivel a MundaMail egy országos szintű állami alapinfrastruktúra, a megbízhatóság a rendszer alapköve. 10 millió állampolgár hivatalos és személyes kommunikációja függ a szoftver folyamatos és hibamentes működésétől.