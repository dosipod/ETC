const effectForm = document.getElementById('effectForm');
const effectListContainer = document.querySelector('.effect-list'); 
const effectsFile = 'alleffects.json';
const toggleAllButton = document.getElementById('toggleAllButton');

fetch(effectsFile)
 .then(response => response.json()) 
 .then(effects => generateFormFromJSON(effects)) 
 .catch(error => console.error('Error loading effects:', error));

function generateFormFromJSON(effects) {
    effects.forEach(effect => createEffectItem(effect.id, effect.name));
}

function createEffectItem(effectId, effectName) {
  const div = document.createElement('div');
  div.classList.add('effect-item');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.id = `effect${effectId}`;
  checkbox.name = 'effects';
  checkbox.value = `${effectId}`;

  const label = document.createElement('label');
  label.htmlFor = `effect${effectId}`;
  label.textContent = effectName;

  div.appendChild(checkbox);
  div.appendChild(label);
  effectListContainer.appendChild(div);
}

toggleAllButton.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('input[name="effects"]');
  let allChecked = true; // Start assuming all are checked

  // Check if any checkbox is *not* checked
  for (let i = 0; i < checkboxes.length; i++) {
    if (!checkboxes[i].checked) {
      allChecked = false;
      break; // No need to continue the loop
    }
  }

  // Toggle all checkboxes based on the current state
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = !allChecked;  
  }
});

effectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedEffects = [];
    const checkboxes = document.querySelectorAll('input[name="effects"]:not(:checked)');

    checkboxes.forEach(checkbox => {
       selectedEffects.push(checkbox.value);
    });

    const generatedCSS = generateCSS(selectedEffects);
    downloadCSSFile(generatedCSS); 
});

function generateCSS(effects) {
  let css = '';
  effects.forEach(effect => {
    css += `div#fxlist [data-id="${effect}"] { display: none; }\n`; 
  });
  return css;
}

function downloadCSSFile(css) {
  const file = new Blob([css], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'hide_effects.css';
  link.click(); 
}
