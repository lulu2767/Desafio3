document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    slider: document.getElementById("character-length"),
    sliderValueDisplay: document.getElementById("character-range"),
    submitBtn: document.getElementById("submitForm"),
    form: document.getElementById("form"),
    passwordField: document.getElementById("password"),
    passwordStrengthEl: document.getElementById("password-strength"),
    passwordStrengthIndicator: document.getElementById("password-strength-indicator"),
    copyButton: document.querySelector(".button-container"),
    copyAlert: document.querySelector(".alert"),
    checkboxes: [...document.querySelectorAll("input[type=checkbox]")],
  };

  elements.sliderValueDisplay.innerText = elements.slider.value;

  const getFormData = () => ({
    passwordStrengthValue: parseInt(elements.slider.value),
    checkedCheckboxes: elements.checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.name),
  });

  const createBars = () => {
    const barElements = [];
    for (let i = 0; i < 4; i++) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      elements.passwordStrengthIndicator.appendChild(bar);
      barElements.push(bar);
    }
    return barElements;
  };

  const applyBarColoring = (bars, numColoredBars, className) => {
    bars.forEach((bar, index) => {
      bar.className = "bar";
      if (index < numColoredBars) bar.classList.add(className);
    });
  };

  const passwordStrengthVisualization = (strength) => {
    elements.passwordStrengthIndicator.innerHTML = "";
    const bars = createBars();
    let numColoredBars = 0;
    let className = "";

    if (strength < 3) {
      elements.passwordStrengthEl.innerText = "TOO WEAK!";
      [numColoredBars, className] = [1, "too-weak"];
    } else if (strength < 5) {
      elements.passwordStrengthEl.innerText = "WEAK";
      [numColoredBars, className] = [2, "weak"];
    } else if (strength < 10) {
      elements.passwordStrengthEl.innerText = "MEDIUM";
      [numColoredBars, className] = [3, "medium"];
    } else {
      elements.passwordStrengthEl.innerText = "STRONG";
      [numColoredBars, className] = [4, "strong"];
    }

    applyBarColoring(bars, numColoredBars, className);
  };

  const generatePasswordCharacters = (length, types) => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "@!%$&*?#$^",
    };

    const selectedChars = types.reduce((acc, type) => {
      if (charSets[type]) acc[type] = charSets[type];
      return acc;
    }, {});

    return Object.entries(selectedChars).reduce((result, [key, set]) => {
      result[key] = Array.from({ length }, () =>
        set.charAt(Math.floor(Math.random() * set.length))
      );
      return result;
    }, {});
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const combinePasswordSegments = (length, segments) => {
    const segmentValues = Object.values(segments);
    const charsPerSegment = Math.floor(length / segmentValues.length);
    let remaining = length % segmentValues.length;

    const combined = segmentValues.flatMap((segment) =>
      segment.slice(0, charsPerSegment + (remaining-- > 0 ? 1 : 0))
    );

    return shuffleArray(combined).join("");
  };

  const updatePasswordDisplay = (password) => {
    if (password && password !== "Select character length") {
      elements.passwordField.value = password;
      elements.passwordField.style.fontSize = "initial";
      elements.passwordField.style.color = "#fff"; // Branco para senhas válidas
    } else {
      elements.passwordField.value = "Select character length";
      elements.passwordField.style.fontSize = "18px";
      elements.passwordField.style.color = "#fff"; // Branco também para o texto padrão
    }
  };
  

  const copyToClipboard = () => {
    if (elements.passwordField.value !== "" && elements.passwordField.value !== "Select character length") {
      elements.passwordField.select();
      document.execCommand("copy");

      elements.copyAlert.textContent = "Copied!";
      elements.copyAlert.style.visibility = "visible";
      elements.copyAlert.style.opacity = "1";
    } else {
      elements.copyAlert.textContent = "Generate password first!";
      elements.copyAlert.style.visibility = "visible";
      elements.copyAlert.style.opacity = "1";
    }

    setTimeout(() => {
      elements.copyAlert.style.visibility = "hidden";
      elements.copyAlert.style.opacity = "0";
    }, 2000);
  };

  elements.submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const { passwordStrengthValue, checkedCheckboxes } = getFormData();

    passwordStrengthVisualization(passwordStrengthValue);

    const charData = generatePasswordCharacters(passwordStrengthValue, checkedCheckboxes);
    const password = combinePasswordSegments(passwordStrengthValue, charData);
    updatePasswordDisplay(password);
  });

  elements.slider.addEventListener("input", () => {
    elements.sliderValueDisplay.innerText = elements.slider.value;
    const percentage = (elements.slider.value / elements.slider.max) * 100;
    elements.slider.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, var(--background-color) ${percentage}%)`;
  });

  elements.copyButton.addEventListener("click", copyToClipboard);
});
