const ions = [
  { name: "acetate", formula: "C₂H₃O₂⁻", image: "acetate.png" },
  { name: "carbonate", formula: "CO₃²⁻", image: "carbonate.png" },
  { name: "hydrogen carbonate", formula: "HCO₃⁻", image: "bicarbonate.png" },
  { name: "hydroxide", formula: "OH⁻", image: "hydroxide.png" },
  { name: "nitrate", formula: "NO₃⁻", image: "nitrate.png" },
  { name: "nitrite", formula: "NO₂⁻", image: "nitrite.png" },
  { name: "chromate", formula: "CrO₄²⁻", image: "chromate.png" },
  { name: "dichromate", formula: "Cr₂O₇²⁻", image: "dichromate.png" },
  { name: "phosphate", formula: "PO₄³⁻", image: "phosphate.png" },
  { name: "hydrogen phosphate", formula: "HPO₄²⁻", image: "hydrogen_phosphate.png" },
  { name: "ammonium", formula: "NH₄⁺", image: "ammonium.png" },
  { name: "hypochlorite", formula: "ClO⁻", image: "hypochlorite.png" },
  { name: "chlorite", formula: "ClO₂⁻", image: "chlorite.png" },
  { name: "chlorate", formula: "ClO₃⁻", image: "chlorate.png" },
  { name: "perchlorate", formula: "ClO₄⁻", image: "perchlorate.png" },
  { name: "permanganate", formula: "MnO₄⁻", image: "permanganate.png" },
  { name: "sulfate", formula: "SO₄²⁻", image: "sulfate.png" },
  { name: "sulfite", formula: "SO₃²⁻", image: "sulfite.png" },
  { name: "hydrogen sulfite", formula: "HSO₃⁻", image: "bisulfite.png" },
  { name: "hydrogen sulfate", formula: "HSO₄⁻", image: "bisulfate.png" },
  { name: "peroxide", formula: "O₂²⁻", image: "peroxide.png" },
  { name: "cyanide", formula: "CN⁻", image: "cyanide.png" }
];

let currentMode = "";
let roundIndex = 0;
let currentSet = [];
const roundsCompleted = { name: 0, formula: 0 };

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startMode(mode) {
  currentMode = mode;
  roundIndex = 0;
  currentSet = shuffle([...ions]);

  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-area").style.display = "block";
  document.getElementById("feedback").textContent = "";
  updateProgress();
  nextCard();
}

function startFlashcard() { startMode("flashcard"); }
function startFormulaMode() { startMode("formula"); }
function startNameMode() { startMode("name"); }

function nextCard() {
  const container = document.getElementById("game-area");

  if (roundIndex >= currentSet.length) {
    if (currentMode === "name" || currentMode === "formula") {
      roundsCompleted[currentMode]++;
      updateCompletionRings();

      if (roundsCompleted.name >= 5 && roundsCompleted.formula >= 5) {
        markAssignmentComplete();
        return;
      }
    }

    container.innerHTML = `
      <h2>Round Complete!</h2>
      <button onclick="start${capitalize(currentMode)}Mode()">Play Again</button><br>
      <button onclick="returnHome()">Main Menu</button>
    `;
    return;
  }

  const ion = currentSet[roundIndex];
  container.innerHTML = `<div class="question">${
    currentMode === "flashcard" ? ion.name :
    currentMode === "name" ? ion.formula :
    `What is the formula for ${ion.name}?`
  }</div>`;

  if (currentMode === "flashcard") {
    container.innerHTML += `
      <button onclick="showImage('${ion.image}')">Show Answer</button><br>
      <button onclick="roundIndex++; updateProgress(); nextCard();">Next</button>
    `;
  } else if (currentMode === "name") {
    container.innerHTML += `
      <input id="nameInput" type="text" placeholder="Enter ion name"
        onkeydown="if(event.key==='Enter') checkNameAnswer()" />
      <br><button onclick="checkNameAnswer()">Submit</button>
    `;
    document.getElementById("nameInput").focus();
  } else if (currentMode === "formula") {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "formula-buttons";

    const choices = shuffle([
      ion.formula,
      ...shuffle(ions.filter(i => i.formula !== ion.formula)).slice(0, 3).map(i => i.formula)
    ]);

    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = choice;
      btn.onclick = () => {
        if (choice === ion.formula) {
          btn.classList.add("correct");
          document.getElementById("feedback").textContent = "Correct!";
          showImage(ion.image);
          disableButtons(buttonContainer, choice);
          setTimeout(() => { roundIndex++; updateProgress(); nextCard(); }, 1500);
        } else {
          btn.classList.add("incorrect");
          document.getElementById("feedback").textContent = "Please try again!";
        }
      };
      buttonContainer.appendChild(btn);
    });

    container.appendChild(buttonContainer);
  }

  updateProgress();
}

function checkNameAnswer() {
  const userInput = document.getElementById("nameInput").value.trim().toLowerCase();
  const correct = currentSet[roundIndex].name.toLowerCase();

  if (userInput === correct) {
    document.getElementById("feedback").textContent = "Correct!";
    showImage(currentSet[roundIndex].image);
    setTimeout(() => {
      roundIndex++;
      updateProgress();
      nextCard();
    }, 1500);
  } else {
    document.getElementById("feedback").textContent = "Please try again!";
  }
}

function showImage(filename) {
  document.getElementById("game-area").innerHTML += `
    <div class="image-container">
      <img src="${filename}" alt="Ion structure">
    </div>
  `;
}

function updateProgress() {
  const percent = (roundIndex / ions.length) * 100;
  const fill = document.getElementById("progressFill");
  fill.style.width = `${percent}%`;

  document.getElementById("progressCount")?.remove();
  const count = document.createElement("div");
  count.id = "progressCount";
  count.style.marginTop = "10px";
  count.style.fontSize = "16px";
  count.style.fontWeight = "bold";
  count.textContent = `${roundIndex}/${ions.length} Completed`;
  document.querySelector(".progress-bar").after(count);
}

function updateCompletionRings() {
  ["name", "formula"].forEach(mode => {
    const total = roundsCompleted[mode];
    const ring = document.getElementById(`${mode}Ring`);
    const percent = Math.min((total / 5) * 100, 100);
    ring.setAttribute("data-rounds", `${total}/5`);
    ring.style.background = `conic-gradient(#4CAF50 ${percent}%, #ccc ${percent}%)`;
  });

  if (roundsCompleted.name >= 5 && roundsCompleted.formula >= 5) {
    markAssignmentComplete();
  }
}

function markAssignmentComplete() {
  console.log("✔ markAssignmentComplete() triggered");

  const gameArea = document.getElementById("game-area");
  if (!gameArea) {
    console.error("❌ game-area not found in DOM.");
    return;
  }

  gameArea.style.display = "block";

  const mainMenu = document.getElementById("main-menu");
  if (mainMenu) mainMenu.style.display = "none";

  gameArea.innerHTML = `
    <div class="certificate" style="border: 2px dashed #4CAF50; padding: 20px;">
      <h2>🎓 Certificate of Completion</h2>
      <p>Congratulations! You have completed both the Name and Formula rounds for Polyatomic Ions.</p>
      <p><strong>Excellent work!</strong></p>
      <button onclick="downloadCertificate()">Download Certificate</button><br><br>
      <button onclick="returnHome()">Return to Main Menu</button>
    </div>
  `;
}

function disableButtons(container, correctChoice) {
  container.querySelectorAll("button").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent !== correctChoice) {
      btn.classList.add("incorrect");
    }
  });
}

function returnHome() {
  document.getElementById("main-menu").style.display = "block";
  document.getElementById("game-area").style.display = "none";
  document.getElementById("feedback").textContent = "";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function downloadCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const name = document.getElementById("learnerName")?.value || "Student";

  doc.setFontSize(22);
  doc.text("Certificate of Completion", 105, 40, null, null, "center");

  doc.setFontSize(16);
  doc.text(`This certifies that ${name}`, 105, 60, null, null, "center");
  doc.text("has successfully completed the", 105, 70, null, null, "center");
  doc.text("Polyatomic Ion Study Tool.", 105, 80, null, null, "center");

  doc.setFontSize(14);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 100, null, null, "center");

  doc.setFontSize(12);
  doc.text("Generated by Polyatomic Ion Study Tool", 105, 115, null, null, "center");

  doc.save(`Certificate_${name.replace(/\s+/g, "_")}.pdf`);
}
