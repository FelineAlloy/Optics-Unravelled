# Optics Unravelled

## Informații generale

-   Categorie: Web
-   Surse: https://github.com/FelineAlloy/Optics-Unravelled
-   Pagina princială: http://opticsunravelled.com

## Descriere

Optics Unravelled este o platforma ce facilitează procesul de învățare și predare a opticii geometrice, ajutănd în formarea unei mai bune intuiții a elevilor.

## Tehnologii

-   html, CSS, JavaScript pentru realizarea interfeței
-   [Node.js](https://nodejs.org/en) - completarea template-urilor pe partea de server
-   [Nunjucks](https://mozilla.github.io/nunjucks/) - crearea și utilizarea de template-uri pentru construcția eficientă a lecțiilor
-   [Mathjax](https://www.mathjax.org/) - Redarea formulelor matematice
-   [ray-optics](https://github.com/ricktu288/ray-optics) - proiect open source bazat pe elementul `<canvas>` pentru funcționalitatea de simulări optice (folosit ca inspiratie pentru implementarea proprie)

## Realizatori

### Luxin Gabriel Mătăsaru

-   Școala: Colegiul Național de Informatică „Tudor Vianu”
-   Clasa a 11-a

## Contribuții Originale

Simularile interactive sunt implementate de autor, cu cateva concepte preluate din modululu ray-optics cu liceență open-source. \
Toate materialele sunt originale și create de autor, inclusiv exemplele de simulări din fiecare lecție.

## Instructiuni

Compilare pentru Windows:

```
pkg index.js -t node18-win-x64 --config package.json
```

Compilare pentru toate platformele:

```
pkg package.json
```
