(function() {
  // ---------- helper: safe number parsing ----------
  function parseNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;   // null means invalid (NaN, Infinity etc)
  }

  // ---------- update first calculator: What is X% of Y? ----------
  function updateCalc1() {
    const xInput = document.getElementById('p1-x');
    const yInput = document.getElementById('p1-y');
    const resultDiv = document.getElementById('p1-result');

    const x = parseNumber(xInput.value);
    const y = parseNumber(yInput.value);

    // if either is invalid (empty string, non-numeric) → show a prompt
    if (x === null || y === null) {
      resultDiv.innerHTML = `<div class="result-main">—</div><div class="result-sub">enter numbers for X and Y</div>`;
      resultDiv.classList.remove('error-msg');
      return;
    }

    // multiplication is safe: no division by zero here
    const result = (x / 100) * y;

    // format nicely: remove trailing zeros, avoid scientific notation for normal ranges
    const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

    // show also the equation
    const displayX = Number.isInteger(x) ? x : parseFloat(x.toFixed(6));
    const displayY = Number.isInteger(y) ? y : parseFloat(y.toFixed(6));

    resultDiv.innerHTML = `
      <div class="result-main">${formattedResult}</div>
      <div class="result-sub">${displayX}% of ${displayY} = ${formattedResult}</div>
    `;
    resultDiv.classList.remove('error-msg');
  }

  // ---------- update second calculator: X is what % of Y? ----------
  function updateCalc2() {
    const xInput = document.getElementById('p2-x');
    const yInput = document.getElementById('p2-y');
    const resultDiv = document.getElementById('p2-result');

    const x = parseNumber(xInput.value);
    const y = parseNumber(yInput.value);

    // Check invalid input
    if (x === null || y === null) {
      resultDiv.innerHTML = `<div class="result-main">—</div><div class="result-sub">enter numbers for X and Y</div>`;
      resultDiv.classList.remove('error-msg');
      return;
    }

    // ---- division by zero guard ----
    if (y === 0) {
      resultDiv.innerHTML = `
        <div class="result-main">⚠️ cannot divide by zero</div>
        <div class="result-sub">Y (the whole) must not be zero</div>
      `;
      resultDiv.classList.add('error-msg');
      return;
    }

    const percentage = (x / y) * 100;
    const formattedPercent = Number.isInteger(percentage) ? percentage : parseFloat(percentage.toFixed(6));

    const displayX = Number.isInteger(x) ? x : parseFloat(x.toFixed(6));
    const displayY = Number.isInteger(y) ? y : parseFloat(y.toFixed(6));

    resultDiv.innerHTML = `
      <div class="result-main">${formattedPercent}%</div>
      <div class="result-sub">${displayX} is ${formattedPercent}% of ${displayY}</div>
    `;
    resultDiv.classList.remove('error-msg');
  }

  // ---------- update third calculator: % change from X to Y ----------
  function updateCalc3() {
    const xInput = document.getElementById('p3-x');
    const yInput = document.getElementById('p3-y');
    const resultDiv = document.getElementById('p3-result');

    const x = parseNumber(xInput.value);
    const y = parseNumber(yInput.value);

    // invalid input
    if (x === null || y === null) {
      resultDiv.innerHTML = `<div class="result-main">—</div><div class="result-sub">enter numbers for X and Y</div>`;
      resultDiv.classList.remove('error-msg', 'increase', 'decrease');
      return;
    }

    // ---- division by zero: X (initial) zero ----
    if (x === 0) {
      // Special case: if both zero? we still can't compute % change from zero.
      resultDiv.innerHTML = `
        <div class="result-main">⚠️ cannot compute change</div>
        <div class="result-sub">initial value X must not be zero</div>
      `;
      resultDiv.classList.add('error-msg');
      resultDiv.classList.remove('increase', 'decrease');
      return;
    }

    // normal case
    const change = ((y - x) / x) * 100;

    // Format change: if integer, show integer; else 6 decimals max, remove trailing zeros
    let formattedChange;
    if (Number.isInteger(change)) {
      formattedChange = change;
    } else {
      formattedChange = parseFloat(change.toFixed(6));
    }

    // Determine sign and direction
    const isIncrease = change > 0;
    const isDecrease = change < 0;
    const sign = isIncrease ? '+' : (isDecrease ? '' : ''); // negative already has minus

    const direction = isIncrease ? 'increase' : (isDecrease ? 'decrease' : 'no change');

    // Build message
    let changeText = '';
    if (change > 0) changeText = `+${formattedChange}%`;
    else if (change < 0) changeText = `${formattedChange}%`;  // already has minus
    else changeText = `0%`;

    const displayX = Number.isInteger(x) ? x : parseFloat(x.toFixed(6));
    const displayY = Number.isInteger(y) ? y : parseFloat(y.toFixed(6));

    resultDiv.innerHTML = `
      <div class="result-main ${isIncrease ? 'increase' : (isDecrease ? 'decrease' : '')}">${changeText}</div>
      <div class="result-sub">${direction} from ${displayX} to ${displayY}</div>
    `;

    // manage classes for colors
    resultDiv.classList.remove('error-msg', 'increase', 'decrease');
    if (isIncrease) resultDiv.classList.add('increase');
    if (isDecrease) resultDiv.classList.add('decrease');
  }

  // ---------- attach event listeners for live updates ----------
  function attachListeners() {
    // Calculator 1
    document.getElementById('p1-x').addEventListener('input', updateCalc1);
    document.getElementById('p1-y').addEventListener('input', updateCalc1);

    // Calculator 2
    document.getElementById('p2-x').addEventListener('input', updateCalc2);
    document.getElementById('p2-y').addEventListener('input', updateCalc2);

    // Calculator 3
    document.getElementById('p3-x').addEventListener('input', updateCalc3);
    document.getElementById('p3-y').addEventListener('input', updateCalc3);
  }

  // ---------- initial render (so results are correct on load) ----------
  function initialRender() {
    updateCalc1();
    updateCalc2();
    updateCalc3();
  }

  // start everything
  attachListeners();
  initialRender();

  // small extra: if someone clears an input, it shows "enter numbers" (handled inside)
  // also ensures no infinity or NaN ever appears.
})();