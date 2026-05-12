---
title: "Architekturális karakterisztikák"
description: "Az azonosított architekturális karakterisztikák."
---

# Architekturális karakterisztikák

## Skálázhatóság (Scalability)
**Mit jelent?**
A rendszer azon képessége, hogy a terhelés növekedésével párhuzamosan (pl. több felhasználó vagy üzenet) az erőforrások bővítésével fenntartsa az elvárt teljesítményszintet.
- https://quality.arc42.org/qualities/scalability

**Miért fontos?**
A rendszernek a teljes zamundai lakosságot, mintegy 10 millió felhasználót kell kiszolgálnia. Amikor az állami hivatalok tömeges tájékoztatókat (pl. adóbevallási határidők, országos vészhelyzet) küldenek ki, a másodpercenkénti kérések (request) száma drasztikusan megnőhet. A rendszernek képesnek kell lennie a feldolgozó kapacitás dinamikus növelésére, hogy a levelek sorba állítása és kiküldése ilyenkor se okozzon lassulást vagy szolgáltatás-kiesést.

## Biztonság (Security)
**Mit jelent?**
Annak a mértéke, ameddig egy termék vagy rendszer megvédi az információkat és az adatokat, hogy a személyek vagy más rendszerek a jogosultsági szintjüknek megfelelő adathozzáféréssel rendelkezzenek.
- https://quality.arc42.org/qualities/security

**Miért fontos?**
A MundaMail nemcsak privát levelezéseket, hanem rendkívül szenzitív állami adatokat (pl. egészségügyi kezelések, adóügyek, nyugdíj) továbbít és tárol. Egy sikeres támadás vagy adatszivárgás a teljes államigazgatásba vetett bizalmat megrengetné.

## Adatvédelem (Privacy)
**Mit jelent?**
Azon képesség, amellyel a rendszer biztosítja, hogy a személyes adatok kezelése megfeleljen a vonatkozó adatvédelmi törvényeknek és szabályozásoknak.
- https://quality.arc42.org/qualities/privacy

**Miért fontos?**
A rendszer a mindennapi levelezés mellett olyan érzékeny állami információkat is kezel, mint az egészségügyi értesítők vagy a nyugdíjjal kapcsolatos ügyek. Ezeket erős titkosítással kell védeni az illetéktelen hozzáféréstől vagy adatszivárgástól.

## Bizalmasság (Confidentiality)
**Mit jelent?**
Annak biztosítása, hogy az adatokhoz csak az arra felhatalmazott személyek vagy rendszerek férhessenek hozzá.
- https://quality.arc42.org/qualities/confidentiality

**Miért fontos?**
A rendszernek biztosítania kell, hogy a privát és akár kényes levelezéshez és annak adataihoz, csak az arra felhatalmazott, megfelelő személy fér hozzá.

## Adatlokalizáció (Data Localization)
**Mit jelent?**
Szakmai szempontból a Megfelelőség (Compliance) része: azon követelmények összessége, amelyek előírják az adatok meghatározott földrajzi vagy joghatósági területen belüli tárolását.
- https://quality.arc42.org/qualities/data-localization

**Miért fontos?**
Kimagasló fontossággal bír a rendszer által kezelt adatokat Zamunda területén belül kell tárolni, üzemeltetni.

## Robusztusság (Robustness)
**Mit jelent?**
A rendszer azon képessége, hogy érvénytelen bemenetek vagy stresszes környezeti körülmények között is megőrizze működőképességét.
- https://quality.arc42.org/qualities/robustness

**Miért fontos?**
A ZDR program figyelembe veszi, hogy Zamunda bizonyos területein az internetlefedettség hiányos, a sávszélesség alacsony, a késleltetés pedig magas lehet.

## Hibatűrés (Fault Tolerance)
**Mit jelent?**
A rendszer azon képessége, hogy szoftver- vagy hardverhibák (pl. egy szerver kiesése) esetén is folytatni tudja a rendeltetésszerű működését.
- https://quality.arc42.org/qualities/fault-tolerance

**Miért fontos?**
Ha egy állampolgár épp egy hivatali ügyet intéz, vagy egy hivatal kiküld egy fontos levelet, egy pillanatnyi hálózati szakadás vagy egy szerver-node leállása miatt az üzenet nem veszhet el a semmiben.

## Bővíthetőség (Extensibility)
**Mit jelent?**
Az architektúra azon tulajdonsága, amely lehetővé teszi új funkciók vagy komponensek hozzáadását a meglévő szerkezet jelentős módosítása nélkül.
- https://quality.arc42.org/qualities/extensibility

**Miért fontos?**
A jelenlegi követelmény az állami rendszerek (egészségügy, nyugdíj) kiszolgálása, de a távlati célok között szerepel az API megnyitása külső vállalkozások (pl. csomagküldők) felé is, kikerülve a klasszikus email protokollokat.

## Tartósság (Durability)
**Mit jelent?**
Az adatok hosszú távú megőrzésének és integritásának biztosítása, beleértve a mentési és visszaállítási képességeket (Recoverability).
- https://quality.arc42.org/qualities/durability

**Miért fontos?**
A leveleket a felhasználó által kezdeményezett explicit törlésig meg kell őrizni, ami azt jelenti, hogy potenciálisan örökké tárolni kell őket.

## Auditálhatóság (Auditability)
**Mit jelent?**
A rendszer azon képessége, hogy rögzítse és visszakereshetővé tegye a végrehajtott műveleteket és eseményeket (Traceability).
- https://quality.arc42.org/qualities/auditability

**Miért fontos?**
A hivatalos kommunikáció során (pl. határidős felszólítások) jogi alapfeltétel, hogy az állami szervek hitelt érdemlően, megváltoztathatatlan módon tudják bizonyítani egy adott levél sikeres kézbesítését, megnyitását vagy törlését.

## Irányíthatóság (Governability)
**Mit jelent?**
A rendszer felügyelhetőségének és irányíthatóságának mértéke, beleértve az adminisztrációt és a szabályok betartatását (Manageability).
- https://quality.arc42.org/qualities/governability

**Miért fontos?**
Az államigazgatás számára elengedhetetlen a felhasználók biztonságos, központi regisztrációja, valamint a különböző csatlakozó hivatalok API hozzáféréseinek és jogosultságainak menedzselése.

## Hatékonyság (Efficiency)
**Mit jelent?**
Az erőforrások (pl. CPU, memória, sávszélesség) optimális és minimális felhasználása a feladatok elvégzése során (Performance Efficiency).
- https://quality.arc42.org/qualities/performance-efficiency

**Miért fontos?**
ZDR program kifejezett célkitűzése a költséghatékony és klímabarát működés. A szerverparknak a lehető legkevesebb hardveres erőforrást (CPU, memória) kell pazarolnia, minimalizálva az ökológiai lábnyomot.

## Rendelkezésre állás (Availability)
**Mit jelent?**
Annak az időnek az aránya, amíg a rendszer működőképes és a felhasználók számára elérhető.
- https://quality.arc42.org/qualities/availability

**Miért fontos?**
A 10 millió lakos mindennapi élete, valamint az állami szolgáltatások (felsőoktatás, egészségügy) működése is erre a rendszerre támaszkodik. Egy esetleges leállás szó szerint megbéníthatja az országot.

## Használhatóság (Usability)
**Mit jelent?**
Annak mértéke, hogy a felhasználók milyen hatékonysággal és elégedettséggel tudják használni a rendszert céljaik elérésére.
- https://quality.arc42.org/qualities/usability

**Miért fontos?**
Ahhoz, hogy az állampolgárok önként és szívesen használják a MundaMailt a mindennapi magánlevelezésükre is, ahhoz valós, letisztult és vonzó alternatívát kell kínálnia a nagy profitorientált szolgáltatókkal szemben.

## Funkcionális teljesség (Functional Completeness)
**Mit jelent?**
Annak mértéke, hogy a szoftver funkcióinak készlete mennyire fedi le az összes meghatározott feladatot és felhasználói célt.
- https://quality.arc42.org/qualities/functional-completeness

**Miért fontos?**
Egy levelezőrendszer csak akkor tekinthető versenyképes, "valós alternatívának", ha maradéktalanul teljesíti a modern email-kliensektől elvárt alapfunkciókat, például a szabványos IMAP/SMTP protokollok támogatását és a spamek kezelését.

## Üzemeltethetőség (Operability)
**Mit jelent?**
Annak a mértéke, hogy a rendszert mennyire könnyű és hatékony üzemeltetni, monitorozni és frissíteni éles környezetben.
- https://quality.arc42.org/qualities/operability

**Miért fontos?**
Egy 10 millió állampolgárt és a teljes államigazgatást (egészségügy, felsőoktatás, nyugdíj) kiszolgáló nemzeti infrastruktúra esetében nem elég, ha a szoftver fejlesztői környezetben hibátlanul működik. Az állami IT-csapatnak képesnek kell lennie azt élesben, leállások nélkül fenntartani, frissíteni és felügyelni.

## Alkalmasság (Suitability)
**Mit jelent?**
Annak mértéke, hogy a funkciók mennyire felelnek meg a felhasználók és a különböző szektorok specifikus igényeinek (Functional Suitability).
- https://quality.arc42.org/qualities/functional-suitability

**Miért fontos?**
Meg kell hogy feleljen mind a céges, mind az állami szektor igényeinek és ezen felül a felhasználók igényeit is kielégitség, hogy megfelelő alternatíva legyen. Ahhoz, hogy valós alternatíva legyen a piacon a többi levelezési rendszerhez képest.

## Megbízhatóság (Reliability)
**Mit jelent?**
Annak a valószínűsége, hogy a rendszer egy meghatározott időtartamig hiba nélkül látja el a funkcióit az adott környezetben.
- https://quality.arc42.org/qualities/reliability

**Miért fontos?**
Mivel a MundaMail egy országos szintű állami alapinfrastruktúra, a megbízhatóság a rendszer alapköve. 10 millió állampolgár hivatalos és személyes kommunikációja függ a szoftver folyamatos és hibamentes működésétől.
