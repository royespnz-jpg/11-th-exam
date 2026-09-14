/* =========================================
   LISTENING EXAM II — 11TH GRADE
   Colegio Nocturno de Cariari · Second Semester 2026
   ========================================= */

/* PASTE HERE the /exec URL of the NEW Apps Script deployment
   for the 11th grade Google Sheet (see apps-script.gs). */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyFxBkEf45_fAqRjGj71lTX2Zy7SwQqZO-kHitmO_m8YG6jEP2QhibLBMr1fpj0dPE/exec";

let examLocked = false;

/* =========================================
   AUDIO CONTROLLER
   - Max 3 plays per audio
   - Button disabled WHILE playing (no wasted plays)
   - Equalizer + pulse ring while playing
========================================= */
class AudioController {
    constructor(audioId, buttonId, counterId, maxPlays = 3) {
        this.audio = document.getElementById(audioId);
        this.button = document.getElementById(buttonId);
        this.counter = document.getElementById(counterId);
        this.card = this.button ? this.button.closest(".audio-card") : null;
        this.maxPlays = maxPlays;
        this.plays = 0;

        if (this.button) {
            this.button.addEventListener("click", () => this.play());
        }
        if (this.audio) {
            this.audio.addEventListener("ended", () => this.onEnded());
            this.audio.addEventListener("error", () => this.onError());
            const src = this.audio.querySelector("source");
            if (src) src.addEventListener("error", () => this.onError());
        }
    }

    play() {
        if (examLocked) return;
        if (this.plays >= this.maxPlays) return;
        if (!this.audio) return;

        this.audio.currentTime = 0;
        this.audio.play();

        this.plays++;
        this.button.disabled = true;
        this.button.classList.add("is-playing");
        if (this.card) this.card.classList.add("playing");
        this.setLabel("Playing...");
        this.updateUI();
    }

    onEnded() {
        this.button.classList.remove("is-playing");
        if (this.card) this.card.classList.remove("playing");

        if (examLocked) {
            this.button.disabled = true;
            return;
        }
        if (this.plays >= this.maxPlays) {
            this.button.disabled = true;
            this.setLabel("No More Plays");
        } else {
            this.button.disabled = false;
            this.setLabel("Play Again");
        }
    }

    onError() {
        // Only react if an actual play attempt failed (e.g. wrong filename on GitHub)
        if (!this.button.classList.contains("is-playing")) return;
        this.plays = Math.max(0, this.plays - 1); // refund the play
        this.button.classList.remove("is-playing");
        if (this.card) this.card.classList.remove("playing");
        this.button.disabled = examLocked;
        this.setLabel("Audio not found");
        this.updateUI();
    }

    setLabel(text) {
        const label = this.button.querySelector(".btn-label");
        if (label) label.textContent = text;
    }

    updateUI() {
        if (this.counter) {
            const dots = this.counter.querySelectorAll(".play-dot");
            dots.forEach((d, idx) => d.classList.toggle("used", idx < this.plays));
            const num = this.counter.querySelector(".plays-num");
            if (num) num.textContent = this.maxPlays - this.plays;
        }
    }
}

/* =========================================
   ANSWER KEY — 11TH GRADE · LISTENING EXAM II
========================================= */
const answers = {
    // Audio 1 — Floods in Bangladesh (news report)
    q1: "b",  // Heavy rains and flooding
    q2: "b",  // 3,000
    q3: "a",  // Food, medicines, and tents

    // Audio 2 — The science of natural disasters (museum talk)
    q4: "c",  // An exhibit about natural disasters
    q5: "a",  // Earthquakes, volcanoes, hurricanes, tornadoes
    q6: "c",  // More storms, droughts, and wildfires

    // Audio 3 — Mount St. Helens (news report)
    q7: "d",  // A mountain
    q8: "a",  // Washington State
    q9: "b",  // Ten
    q10: "c"  // Hot ash and gas
};

/* =========================================
   AUDIO-SPECIFIC DIRECTIONS
========================================= */
const audioInstructions = [
    "Directions: You will hear a news report. Choose the best answer to each question.",
    "Directions: You will hear a talk about natural disasters. Choose the best answer to each question.",
    "Directions: You will hear a news report. Choose the best answer to each question."
];

/* How many questions belong to each audio: 3 + 3 + 4 = 10 */
const questionsPerAudio = [3, 3, 4];

/* =========================================
   QUESTIONS — 10 in total
========================================= */
const questions = [

    // Audio 1 — Floods in Bangladesh
    ["What has happened in Bangladesh this week?",
        ["A big earthquake", "Heavy rains and flooding", "A strong windstorm", "A fire in the city"]],
    ["According to the report, how many people have died?",
        ["300", "3,000", "30,000", "300,000"]],
    ["What kind of help is being sent to the area?",
        ["Food, medicines, and tents", "Cars and trucks", "Money only", "Books and clothes"]],

    // Audio 2 — The science of natural disasters
    ["What is the Museum presenting?",
        ["A sports event", "A new movie", "An exhibit about natural disasters", "A concert"]],
    ["Which of these are natural disasters mentioned in the listening?",
        ["Earthquakes, volcanoes, hurricanes, tornadoes", "Floods, snow, rain, sun", "Planets, stars, moons, comets", "Cars, buses, trains, planes"]],
    ["What may happen as the climate warms?",
        ["More sports events", "More shops and houses", "More storms, droughts, and wildfires", "More mountains and rivers"]],

    // Audio 3 — Mount St. Helens
    ["What is Mount St. Helens?",
        ["A forest", "A river", "A city", "A mountain"]],
    ["Where is Mount St. Helens?",
        ["Washington State", "New York", "Texas", "Florida"]],
    ["How many people died in the disaster (at least)?",
        ["One", "Ten", "One hundred", "One thousand"]],
    ["What came out of the mountain?",
        ["Water and fish", "Ice and snow", "Hot ash and gas", "Sand and stones"]]
];

const TOTAL_QUESTIONS = questions.length;

/* =========================================
   BUILD EXAM
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    buildExam();

    for (let i = 1; i <= questionsPerAudio.length; i++) {
        new AudioController(`audio${i}`, `playBtn${i}`, `counter${i}`);
    }

    document.getElementById("quizForm").addEventListener("submit", checkAnswers);

    enableSelectionStyling();
    enableTilt();
    enableReveal();
    updateProgress();
});

function buildExam() {
    const container = document.getElementById("questions-container");
    const letters = ["a", "b", "c", "d"];
    let html = "";
    let q = 1;
    let index = 0;

    for (let audio = 1; audio <= questionsPerAudio.length; audio++) {

        html += `
<section class="card audio-card reveal" data-tilt>
    <div class="audio-head">
        <span class="audio-num">Audio ${audio}</span>
        <span class="audio-line"></span>
    </div>
    <p class="directions">${audioInstructions[audio - 1]}</p>
    <audio id="audio${audio}" preload="auto">
        <source src="audio${audio}.mp3" type="audio/mpeg">
    </audio>
    <div class="audio-controls">
        <button type="button" class="play-btn" id="playBtn${audio}">
            <span class="btn-ring" aria-hidden="true"></span>
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            <span class="btn-label">Play Audio</span>
        </button>
        <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="counter" id="counter${audio}">
            <span class="play-dot"></span><span class="play-dot"></span><span class="play-dot"></span>
            <span class="plays-text">Plays left: <b class="plays-num">3</b></span>
        </span>
    </div>
</section>`;

        for (let j = 0; j < questionsPerAudio[audio - 1]; j++) {
            const current = questions[index];
            let opts = "";

            for (let k = 0; k < 4; k++) {
                opts += `
        <label class="option">
            <input type="radio" name="q${q}" value="${letters[k]}">
            <span class="opt-key">${letters[k].toUpperCase()}</span>
            <span class="opt-text">${current[1][k]}</span>
        </label>`;
            }

            html += `
<article class="card question reveal" data-q="${q}" data-tilt>
    <div class="q-head">
        <span class="q-num">${q}</span>
        <h2 class="q-text">${current[0]}</h2>
    </div>
    <div class="options">${opts}
    </div>
</article>`;

            q++;
            index++;
        }
    }

    container.innerHTML = html;
}

/* =========================================
   SELECTED OPTION STYLING + PROGRESS
========================================= */
function enableSelectionStyling() {
    document.addEventListener("change", e => {
        if (!e.target.matches('input[type="radio"]')) return;
        document.querySelectorAll(`input[name="${e.target.name}"]`).forEach(inp => {
            inp.closest(".option").classList.toggle("selected", inp.checked);
        });
        updateProgress();
    });
}

function updateProgress() {
    const total = TOTAL_QUESTIONS;
    let answered = 0;
    for (let i = 1; i <= total; i++) {
        if (document.querySelector(`input[name="q${i}"]:checked`)) answered++;
    }
    const fill = document.getElementById("progFill");
    const txt = document.getElementById("progText");
    if (fill) fill.style.width = ((answered / total) * 100) + "%";
    if (txt) txt.textContent = `Answered ${answered}/${total}`;
}

/* =========================================
   3D TILT (desktop only)
========================================= */
function enableTilt() {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach(card => {
        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* =========================================
   SCROLL REVEAL
========================================= */
function enableReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        els.forEach(el => el.classList.add("visible"));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add("visible");
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
}

/* =========================================
   CHECK ANSWERS
========================================= */
function checkAnswers(event) {
    event.preventDefault();
    if (examLocked) return;

    const nameInput = document.getElementById("studentName");
    const groupInput = document.getElementById("studentGroup");
    const nameError = document.getElementById("nameError");
    const studentName = nameInput.value.trim();
    const studentGroup = groupInput ? groupInput.value.trim() : "";

    if (!studentName) {
        nameInput.classList.remove("input-error");
        void nameInput.offsetWidth; // restart shake animation
        nameInput.classList.add("input-error");
        nameError.hidden = false;
        nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInput.focus({ preventScroll: true });
        return;
    }
    nameInput.classList.remove("input-error");
    nameError.hidden = true;

    let score = 0;
    const total = TOTAL_QUESTIONS;
    const detalleArray = [];
    const correctList = [];
    const wrongList = [];

    for (let n = 1; n <= total; n++) {
        const key = "q" + n;
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        const studentAnswer = selected ? selected.value.toUpperCase() : "—";
        const correctAnswer = answers[key].toUpperCase();
        const isCorrect = selected && selected.value === answers[key];

        if (isCorrect) {
            score++;
            correctList.push(`Q${n}`);
            detalleArray.push(`Q${n}: ${studentAnswer} ✓`);
        } else {
            wrongList.push(`Q${n}`);
            detalleArray.push(`Q${n}: ${studentAnswer} ✗ (correct: ${correctAnswer})`);
        }
    }

    const detalle = detalleArray.join("  |  ");
    const score100 = Math.round((score / total) * 100);
    const examPercent = ((score / total) * 5).toFixed(1);   // exam is worth 5%

    guardarEnGoogleSheets({
        exam: "11th",
        nombre: studentName,
        seccion: studentGroup || "—",
        puntaje: `${score}/${total}`,
        porcentaje: `${score100}%`,
        nota5: `${examPercent}/5`,
        correctas: correctList.join(", ") || "none",
        incorrectas: wrongList.join(", ") || "none",
        detalle: detalle
    });

    bloquearExamen();
}

/* =========================================
   LOCK EXAM
========================================= */
function bloquearExamen() {
    examLocked = true;

    document.getElementById("quizForm").classList.add("locked");
    document.querySelectorAll("input").forEach(el => el.disabled = true);
    document.querySelectorAll(".play-btn").forEach(btn => {
        btn.disabled = true;
        btn.classList.remove("is-playing");
    });
    document.querySelectorAll(".audio-card").forEach(c => c.classList.remove("playing"));

    const btn = document.querySelector(".submit-btn");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Exam Submitted";
}

/* =========================================
   SAVE TO GOOGLE SHEETS
========================================= */
function guardarEnGoogleSheets(datos) {
    const statusEl = document.getElementById("saveStatus");

    statusEl.className = "save-status saving";
    statusEl.textContent = "Submitting exam...";

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(datos)
    })
    .then(r => {
        console.log("HTTP status:", r.status);
        return r.text();
    })
    .then(raw => {
        console.log("Raw server response:", raw);
        let result;
        try { result = JSON.parse(raw); }
        catch (e) { throw new Error("Not JSON: " + raw.substring(0, 200)); }

        if (result.success) {
            statusEl.className = "save-status saved";
            statusEl.innerHTML =
                `✓ Exam submitted successfully.<br>Thank you, <strong>${datos.nombre}</strong>.`;
            statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            throw new Error(result.error || "Unknown error");
        }
    })
    .catch(err => {
        console.error("SEND ERROR:", err);
        statusEl.className = "save-status error";
        statusEl.textContent = "Could not submit: " + err.message;
    });
}
