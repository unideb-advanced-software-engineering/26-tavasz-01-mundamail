---
title: "ADR-04: Szabványos IMAP és SMTP Protokollok Támogatása"
description: "Döntés a nyílt IMAP/SMTP szabványok teljes körű implementációja mellett, egyedi protokoll helyett, a széles klienskompatibilitás és az instabil hálózati körülmények kezelése érdekében."
---

# ADR-04: Szabványos IMAP és SMTP Protokollok Támogatása – Nyílt szabványok az egyedi protokoll helyett

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## Kontextus

Az esettanulmány egyik kulcsos nem funkcionális elvárása, hogy a MundaMail "valós alternatívát kínáljon a népszerű szolgáltatókhoz képest" – ez az egyetlen módja annak, hogy az állampolgárok ne kizárólag állami kommunikációs csatornának tekintsék, hanem valóban személyes levelezésre is használják. Ennek eléréséhez a rendszernek kompatibilisnek kell lennie a már meglévő eszközökkel, szokásokkal és ökoszisztémával.

Zamunda 10 millió állampolgára nem homogén felhasználói csoport: vannak, akik mobilon leveleznek, mások asztali kliensen (pl. Thunderbird, Outlook), megint mások webes felületen. Az esettanulmány explicit követelménye, hogy webes és mobil felület is legyen, de a szabványos protokollok ennél tágabb klienskompatibilitást tesznek lehetővé.

---

## Kihívás

Szembesülve azzal, hogy:

- Egy saját, egyedi protokoll fejlesztése technikai szempontból teljes körű kontrollt adna (optimalizálás, tömörítés, offline szinkronizáció), de az összes klienst (web, mobil, asztali) a mi saját implementációnkra szorítaná, és megszüntetné a harmadik féltől származó kliensekkel való kompatibilitást.
- Az IMAP/SMTP protokoll az 1980-as évek óta érett, széles körben implementált szabvány. Az ökoszisztéma hatalmas: minden operációs rendszerre és eszközre elérhetők ingyenes, bevált kliensek – ezek "ingyen" megoldják a kliensoldali fejlesztési terhet.
- Zamundában az internetlefedettség egyenetlen, és előfordulhatnak magas késleltetések. Az IMAP protokoll – különösen az IMAP IDLE mechanizmus és az offline szinkronizáció – kifejezetten arra lett tervezve, hogy instabil vagy lassú kapcsolaton is jól működjön.
- Az esettanulmány megjegyzi: "Ne gondoljuk túl az email protokollokat" – ez egyértelműen a szabványos megoldás irányába mutat, és a tervezési egyszerűség melletti érv.

---

## Döntés

**Teljeskörű IMAP és SMTP protokolltámogatást** implementálunk (F-MAIL-01), a következő elvekkel:

1. **IMAP a levelek elérésére:** Az IMAP protokoll szerver oldali mappakezelést biztosít, így az állampolgár bármely eszközről szinkronizált állapotot lát. Támogatjuk az IMAP4rev1 (RFC 3501) szabványt, beleértve az IMAP IDLE kiterjesztést (RFC 2177) a valós idejű értesítésekhez.

2. **SMTP a levelek küldésére:** Az SMTP (RFC 5321) és a SMTP AUTH (RFC 4954) mechanizmus biztosítja az autentikált levelezést. A kiszolgáló felé irányuló SMTP submission port (587) TLS-sel védett.

3. **STARTTLS / implicit TLS kötelező:** Titkosítás nélküli IMAP/SMTP kapcsolat nem engedélyezett (NF-SEC követelmény).

4. **Saját webes és mobil felület a protokoll tetején:** A MundaMail saját webes (böngésző) és mobil alkalmazása szintén az IMAP/SMTP réteget használja – nem egy párhuzamos, egyedi API-t. Ez garantálja, hogy a belső és a külső kliensek ugyanazt a tapasztalatot nyújtják, és a protokoll implementáció egységesen tesztelhető.

---

## Elvetett alternatívák

**Saját, egyedi bináris protokoll:** Maximális teljesítmény és tömörítési lehetőségek, de nulláról kell minden klienst megírni (web, iOS, Android, asztali). Az ökoszisztéma előnyei elvesznek, a fejlesztési és karbantartási teher megnő, és a harmadik feles kliensek kompatibilitása megszűnik.

**Kizárólag webAlapú hozzáférés (saját REST/WebSocket API):** Egyszerűbb szerver oldali implementáció, de kizárja az IMAP-kompatibilis klienseket. Az állampolgárok, akik Thunderbirdöt vagy Outlook-ot használnak, a MundaMailt nem tudnák integrálni. Ez szembemegy az "érdemi alternatíva" elvárással.

**ActiveSync (Microsoft Exchange protokoll):** Jó mobiltámogatás, de licencelési korlátok és komplexitás miatt nem javasolt. A nyílt szabvány (IMAP/SMTP) előnye az ingyenes implementálhatóság.

**Csak SMTP (küldés), IMAP nélkül (POP3 helyette):** A POP3 letölti és törli a szerveren a leveleket – ez inkompatibilis az "örök megőrzés" (F-MAIL-02) követelménnyel, és a több-eszközös szinkronizált hozzáférést nem támogatja.

---

## Elérendő célok

- Az állampolgárok kedvenc levelezőkliensüket (Thunderbird, Outlook, Apple Mail stb.) konfigurálhatják a MundaMail-hez anélkül, hogy új szoftvert kellene telepíteniük.
- A webes és mobil alkalmazás fejlesztési terhe csökken: a protokoll biztosítja az adathozzáférési réteget, a frontend csapat az UX-re koncentrálhat.
- Az instabil hálózati körülmények kezelésére nem kell egyedi megoldást fejleszteni: az IMAP protokoll offline-szinkronizáció képességeit a kliensek natívan támogatják.
- A hosszú távú klienskompatibilitás garantált: az IMAP/SMTP évtizedek óta stabil szabvány, nem fog eltűnni.

---

## Elfogadott kompromisszumok

- **Az IMAP/SMTP protokoll nem a leghatékonyabb:** Szöveges, fejléc-nehéz protokollok, amelyek bináris protokollhoz képest nagyobb sávszélességet igényelnek. Zamunda gyenge internetlefedettségű területein ez érezhető lehet, bár a modern IMAP implementációk tömörítéssel (COMPRESS kiterjesztés) enyhíthetik ezt.
- **Korlátozott push értesítési támogatás mobilon:** Az IMAP IDLE nem minden mobilkliensben működik megbízhatóan alacsony sávszélességen. A natív push értesítések (APNs, FCM) megvalósítása a saját mobilalkalmazásban plusz fejlesztési munkát igényel.
- **A tracking mechanizmus protokollszinten nem érhető el:** Az IMAP nem tartalmaz beépített olvasottság-visszajelzési mechanizmust, amelyet a szerver logolhatna. A tracking pixel megoldás (F-TRK-02) ezért HTML emailekbe ágyazott módon valósul meg, ami nem működik azon klienseknél, amelyek letiltják a képbetöltést.
