# Listening Exam II — 11th Grade

Colegio Nocturno de Cariari · Second Semester 2026
Teacher: Saiden Ortiz Gómez · 10 points (5%) · October 13, 2026

Same design and behaviour as the 8th grade exam, adapted to this test:
**3 audios, 10 multiple choice questions** (3 + 3 + 4), each audio playable
**up to 3 times**, auto-graded and saved to Google Sheets.

## Files

| File | What it is |
|---|---|
| `index.html` | The exam page |
| `script.js` | Questions, answer key, audio control, grading, sending to Sheets |
| `style.css` | "Night School Aurora" theme (same as 8th grade) |
| `audio1.mp3` | Audio 1 — Floods in Bangladesh |
| `audio2.mp3` | Audio 2 — The science of natural disasters |
| `audio3.mp3` | Audio 3 — Mount St. Helens |
| `apps-script.gs` | Code to paste in the NEW Google Sheet |

## Answer key

| Q | Ans | Q | Ans |
|---|---|---|---|
| 1 | B — Heavy rains and flooding | 6 | C — More storms, droughts, and wildfires |
| 2 | B — 3,000 | 7 | D — A mountain |
| 3 | A — Food, medicines, and tents | 8 | A — Washington State |
| 4 | C — An exhibit about natural disasters | 9 | B — Ten |
| 5 | A — Earthquakes, volcanoes, hurricanes, tornadoes | 10 | C — Hot ash and gas |

## Setup (2 steps)

1. **Google Sheet** — create a new sheet, `Extensions ▸ Apps Script`, paste
   `apps-script.gs`, deploy as Web app (*Execute as: Me*, *Who has access: Anyone*),
   copy the `/exec` URL. Full instructions are in the comments at the top of that file.
2. **Website** — paste that URL into line 8 of `script.js`:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/..../exec";
```

Then upload the folder to a new GitHub repo (for example `11-th`) and turn on
GitHub Pages: `Settings ▸ Pages ▸ Branch: main ▸ /(root)`.

## Sheet columns

`Fecha y hora · Examen · Nombre del estudiante · Grupo · Puntaje · Porcentaje ·
Nota (5%) · Correctas · Incorrectas · Detalle por pregunta`
