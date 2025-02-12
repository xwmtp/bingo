import {waitForLoad} from "./helpers/localization.js";
import {fetchGoalList, flattenGoalList, getVersionData} from "./helpers/generateBoard.js";
import {fromHtml} from "./helpers/fromHtml.js";
import {renderGoalList} from "./settings/components/goalList.js";

const supportedModes = ["normal", "short", "blackout"]

const renderPage = async () => {
  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const searchParams = new URLSearchParams(location.search);
  const originalVersion = searchParams.get("version") ?? undefined;
  const mode =  searchParams.get("mode") ?? undefined;
  const goalListMode = getGoalListMode(mode);

  try {
    const {path, version} = await getVersionData(originalVersion);
    const goalListData = await fetchGoalList(path);
    if (!(goalListMode in goalListData)) {
      throw Error(`Could not find mode ${goalListMode} in goal list.`);
    }
    const goalsData = flattenGoalList(goalListData[goalListMode]);
    container.appendChild(renderGoalList(goalsData, version, mode));
  } catch (e) {
    console.error(e);
    container.appendChild(fromHtml(`<span>Displaying the goal list for version ${originalVersion} (${mode} cards) is not supported.</span>`));
  }
};

const getGoalListMode = (originalMode) => {
  if (!(supportedModes.includes(originalMode))) {
    return undefined;
  }
  if (originalMode === "short") {
    return "short";
  }
  return "normal";
}

waitForLoad().then(renderPage);
