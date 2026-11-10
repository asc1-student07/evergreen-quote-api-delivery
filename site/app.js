// Evergreen Quote - Live Estimate (provided).
// ------------------------------------------
// This is the completed reference implementation.

// --- Base monthly rates by coverage type (an object used as a lookup table) ---
const BASE_RATES = {
  auto: 80,
  home: 120,
  life: 60,
};

// --- Grab the DOM elements we need (Step 2) ---
const form = document.querySelector("#quote-form");
const typeEl = document.querySelector("#coverage-type");
const ageEl = document.querySelector("#age");
const amountEl = document.querySelector("#coverage-amount");
const estimateEl = document.querySelector("#estimate-amount");
const messageEl = document.querySelector("#message");
const recentList = document.querySelector("#recent-list");

// --- Step 3: Calculate the premium -------------------------------------------
function calculatePremium(type, age, coverageAmount) {
  const base = BASE_RATES[type] ?? 100;
  const ageFactor = age < 25 ? 1.4 : age > 60 ? 1.25 : 1.0;
  const coverageFactor = coverageAmount / 10000;
  return base * ageFactor * coverageFactor;
}

// --- Step 4: Validate the inputs ---------------------------------------------
function validateInputs(age, coverageAmount) {
  if (Number.isNaN(age) || age < 18 || age > 100) {
    throw new Error("Please enter an age between 18 and 100.");
  }
  if (Number.isNaN(coverageAmount) || coverageAmount < 10000) {
    throw new Error("Coverage amount must be at least $10,000.");
  }
}

// --- Step 5: Format a number as US currency ----------------------------------
function formatCurrency(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// --- Step 6: Update the live estimate ----------------------------------------
function updateEstimate() {
  const type = typeEl.value;
  const age = Number(ageEl.value);
  const coverageAmount = Number(amountEl.value);

  try {
    validateInputs(age, coverageAmount);
    const premium = calculatePremium(type, age, coverageAmount);
    estimateEl.textContent = formatCurrency(premium);
    messageEl.textContent = "";
    messageEl.classList.remove("success");
  } catch (error) {
    estimateEl.textContent = "-";
    messageEl.textContent = error.message;
    messageEl.classList.remove("success");
  }
}

// --- Step 7: Load recent quotes asynchronously -------------------------------
async function loadRecentQuotes() {
  try {
    const response = await fetch("quotes.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    renderRecentQuotes(data);
  } catch (error) {
    recentList.innerHTML = `<li class="error">Could not load recent quotes.</li>`;
    console.error("Failed to load recent quotes:", error.message);
  }
}

// --- Step 8: Render the recent quotes list -----------------------------------
function renderRecentQuotes(quotes) {
  recentList.innerHTML = "";
  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="quote-type">${quote.type}</span> -
      <span class="quote-premium">${formatCurrency(quote.monthlyPremium)}/mo</span>
    `;
    recentList.appendChild(li);
  });
}

// --- Wire everything up (Step 9) ---------------------------------------------
updateEstimate();

form.addEventListener("input", updateEstimate);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateEstimate();
  if (!messageEl.textContent) {
    messageEl.textContent = "Quote saved. An agent will follow up shortly.";
    messageEl.classList.add("success");
  }
});

loadRecentQuotes();
