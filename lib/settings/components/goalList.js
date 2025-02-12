import {localize} from "../../helpers/localization.js";
import {fromHtml} from "../../helpers/fromHtml.js";

const template = ({ version, numberOfGoals, mode }) => `
  <div class="goal-list-container">
    <h1>Goal List</h1>
    <span>Version <strong>${version}</strong> contains ${numberOfGoals} goals (mode <strong>${mode}</strong>):</span>
    <ul class="goal-list"></ul>
  </div>
`;

export const renderGoalList = (goalsData, version, mode) => {
  const localizedGoalNames = goalsData.map(goal => localize(goal.name)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const el = fromHtml(template({version, numberOfGoals: localizedGoalNames.length, mode}))
  const goalList = el.querySelector("ul");
  
  for (const goalName of localizedGoalNames) {
    goalList.appendChild(fromHtml(`<li class="goal">${goalName}</li>`));
  }

  return el;
};