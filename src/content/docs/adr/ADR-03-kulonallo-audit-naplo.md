---
title: "ADR-03: Password Hashing Algorithm"
description: "A felhasználói jelszavak biztonságos tárolásához használt kriptográfiai algoritmust rögzítő ADR."
---

# ADR-03: Password Hashing Algorithm

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## A következő kontextusban:

- a 10 millió zamundai állampolgár hitelesítési adatait kezelő autentikációs modul

---

## szembesülve a

- a masszívan párhuzamosított modern GPU-k és ASIC hardverek által vezérelt offline brute-force támadások egyre növekvő fenyegetésével

---

## a következő mellett döntöttünk:

**Különálló, append-only Audit Log alrendszert** hozunk létre, amely fizikailag és logikailag elkülönül a Mailbox Store-tól és a User Database-től:

- az Argon2id memory-hard password hashing algoritmus használata

---

## és elvetettük:

- a régebbi, tisztán számításigényes szabványokat, mint a bcrypt vagy a PBKDF2

---

## annak érdekében, hogy elérjük:

- a robusztus ellenállást a párhuzamosított hardveres támadásokkal szemben a kötelezően magas, egyedi hashelésenkénti memóriafogyasztás kikényszerítésével,
- és a legmodernebb kriptográfiai threat model-eknek való megfelelést a személyes adatok védelme érdekében

---

## elfogadva a

- hitelesítő szerverek megnövekedett memory footprintjét és pénzügyi költségeit,
- némileg lassabb egyéni felhasználói hitelesítési időt,
- és a precíz, hardverspecifikus paraméterhangolás (cost factors, iterations, parallelism) szükségességét.
