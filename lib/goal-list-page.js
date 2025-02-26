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
  const mode = searchParams.get("mode") ?? "normal";
  const goalListMode = getGoalListMode(mode);

  try {
    const {path, version} = await getVersionData(originalVersion);
    const goalListData = await fetchGoalList(path);

    let goalsData;
    if (isOlderVersion(version)) {
      if (goalListMode !== "normal") {
        container.appendChild(fromHtml(`<span>For versions older than v9, only <strong>normal</strong> card goals can be displayed (because the generator used custom logic to determine which goals are used in short/blackout mode).</span>`));
        return;
      }
      goalsData = flattenGoalList(goalListData)
    } else {
      goalsData = flattenGoalList(goalListData[goalListMode])
    }
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
};

const isOlderVersion = (version) => {
  const versionNumber = parseFloat(version);
  if (versionNumber) {
    return versionNumber < 9;
  }
  return false;
}

waitForLoad().then(renderPage);
