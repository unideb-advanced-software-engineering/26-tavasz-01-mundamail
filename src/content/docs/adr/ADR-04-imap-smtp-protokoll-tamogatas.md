---
title: "ADR-04: Data-at-Rest Encryption Mode"
description: "Az adatbázisok és e-mailek tárolásakor alkalmazott szimmetrikus titkosítási módot rögzítő ADR."
---

# ADR-04: Data-at-Rest Encryption Mode

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## A következő kontextusban:

- felhasználói e-mailek petabájtjait és érzékeny állami adatbázisokat tároló infrastruktúra

---

## szembesülve a

- ZDR program szigorú adatvédelmi törvényeivel és az aktív adatbázis-manipuláció kritikus kockázatával

---

## a következő mellett döntöttünk:

- az AES-256-GCM (Galois/Counter Mode) alkalmazása

---

## és elvetettük:

- az AES-256-CBC (Cipher Block Chaining) használatát

---

## annak érdekében, hogy elérjük:

- az Authenticated Encryption with Associated Data (AEAD) megvalósítását,
- az Authentication Tags révén beépített integritás-ellenőrzést, amely kriptográfiailag garantálja, hogy az e-mailek és adatbázissorok nem módosultak a tárolás során,
- és a nagymértékben párhuzamosítható, hardveresen gyorsított (AES-NI) titkosítási teljesítményt az x86-64 szervereken

---

## elfogadva a

- szigorú kriptográfiai követelményt, miszerint ugyanazzal a titkosítási kulccsal soha nem szabad újrahasználni az Initialization Vectors-t,
- és az Associated Data (AAD) kezelésének kisebb fejlesztési komplexitását a storage layer implementációjában.
