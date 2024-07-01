
import _ from "lodash";

const comparePositionOrder = (position1, position2) => {
  if (position1.order < position2.order) return -1;
  if (position1.order > position2.order) return 1;
  return 0;
};

const getContentAudioVideoImageTextFromIconActData = (
  iconList = [],
  focusId = ""
) => {
  const focusedIcon =
    (iconList || []).find(
      (icon) => String(_.get(icon, "icon_id")) === String(focusId)
    ) || {};

  const tracing = _.isEmpty(focusedIcon.tracing)
    ? {}
    : JSON.parse(focusedIcon.tracing);
  if (tracing.position) {
    tracing.position = [...tracing.position].sort(comparePositionOrder);
  }

  return {
    srcAudio: _.get(focusedIcon, "props[0].audio[0].path"),
    srcVideo: focusedIcon.path,
    srcImage: focusedIcon.path,
    contentText: _.get(focusedIcon, "props[0].text"),
    positions: tracing.position || [],
  };
};

const getIconsListByLanguage = (iconListData) => {
  const iconsList = (
    iconListData.find((iconItem) => iconItem) || {}
  ).icons;
  return iconsList;
};

const handleTrackingErrorActivity = (formatActivityData) => (activity) => {
  try {
    return formatActivityData(activity);
  } catch (error) {
    return { error };
  }
};

const htmlDecode = (text) => {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
};

const getWidthOfText = (text, fontSize, className) => {
  const newElement = document.createElement('span');
  newElement.setAttribute("id", "calculate-width-text");
  document.body.appendChild(newElement);

  newElement.style.fontSize = `${parseInt(fontSize) || 26}px`;
  newElement.style.height = 'auto';
  newElement.style.width = 'auto';
  newElement.style.position = 'absolute';
  newElement.style.whiteSpace = 'no-wrap';
  newElement.className = className;
  newElement.innerHTML = text;

  const width = newElement.clientWidth;
  document.body.removeChild(newElement);
  return width;
};

export {
  comparePositionOrder,
  getContentAudioVideoImageTextFromIconActData,
  getIconsListByLanguage,
  handleTrackingErrorActivity,
  htmlDecode,
  getWidthOfText,
};
