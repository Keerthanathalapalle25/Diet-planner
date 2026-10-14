const form = document.querySelector('#planner-form');
const submitButton = form.querySelector('button[type="submit"]');
const errorBox = document.querySelector('#form-error');
const welcomePanel = document.querySelector('#welcome-panel');
const planContent = document.querySelector('#plan-content');

const mealDetails = [
  ['breakfast', '☀', 'Breakfast'],
  ['lunch', '◉', 'Lunch'],
  ['snacks', '✳', 'Snacks'],
  ['dinner', '☾', 'Dinner'],
];

function addText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function showPlan(plan) {
  planContent.replaceChildren();
  const topLine = document.createElement('div');
  topLine.className = 'plan-topline';
  addText(topLine, 'span', '', 'YOUR DAILY MENU');
  addText(topLine, 'span', '', plan.generated_by === 'ollama' ? '✳ LOCAL AI' : 'GENERAL STARTER');
  planContent.append(topLine);
  addText(planContent, 'h2', 'plan-title', 'A day, well balanced.');

  const mealList = document.createElement('div');
  mealList.className = 'meal-list';
  for (const [key, icon, title] of mealDetails) {
    const card = document.createElement('article');
    card.className = 'meal-card';
    const heading = addText(card, 'h3', '', '');
    addText(heading, 'span', '', icon);
    heading.append(document.createTextNode(title));
    addText(card, 'p', '', plan[key]);
    mealList.append(card);
  }
  planContent.append(mealList);

  const tipsBlock = document.createElement('div');
  tipsBlock.className = 'tips-block';
  addText(tipsBlock, 'h3', '', 'HYDRATION & EVERYDAY TIPS');
  const tips = document.createElement('ul');
  for (const tip of plan.tips) addText(tips, 'li', '', tip);
  tipsBlock.append(tips);
  planContent.append(tipsBlock);
  addText(planContent, 'p', 'plan-source', plan.notice);
  welcomePanel.hidden = true;
  planContent.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.hidden = true;
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'Putting your day together…';

  const formData = new FormData(form);
  const answers = Object.fromEntries(formData.entries());
  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Please check your answers and try again.');
    showPlan(result);
  } catch (error) {
    errorBox.textContent = error.message || 'Something went wrong. Please try again.';
    errorBox.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = 'Create my day';
  }
});
