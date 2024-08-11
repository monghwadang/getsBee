let selection = null;
const RANGE_DATA_ARR = [];
const RANGE_ARR = [];
const RECOMMEND_DATA_ARR = [];
let SELECTED_ID = 0;

function getDomain() {
  // url return
  return window.location.hostname;
}
function getURL() {
  // url return
  return window.location.href;
}

function getThumbnailUrl() {
  const ogImageMetaTag = document.querySelector('meta[property="og:image"]');

  // 이미지 URL 추출
  return ogImageMetaTag ? ogImageMetaTag.getAttribute("content") : null;
}

function getTitle() {
  // title 메타 태그 찾기
  const titleMetaTag = document.querySelector("title");

  // title 속성 값 추출
  return titleMetaTag ? titleMetaTag.textContent : null;
}

function insertHighLight(data) {
  RANGE_DATA_ARR.push(data);
}

function createRangeData({
  content,
  startIndex,
  startOffset,
  lastIndex,
  lastOffset,
  color,
}) {
  const data = {
    url: getURL(),
    thumbnailUrl: getThumbnailUrl(),
    title: getTitle(),
    content,
    color,
    startIndex,
    startOffset,
    lastIndex,
    lastOffset,
    type: "TEXT",
  };
  return data;
}

// function createRangeObject(rangeData) {
//   const startpos = getPixelPosition(Number(rangeData.startIndex));
//   const endpos = getPixelPosition(Number(rangeData.lastIndex));

//   const startInfo = findNodeAtPosition(startpos, rangeData, false);
//   const endInfo = findNodeAtPosition(endpos, rangeData, true);

//   let startIdx = 0;
//   let endIdx = 0;
//   // for (let i = 0; i < startNodeArr.length; i++) {
//   //   const startNode = startNodeArr[i];
//   //   for (let j = 0; j < endNodeArr.length; j++) {
//   //     const endNode = endNodeArr[j];

//   //     const highlightRange = document.createRange();
//   //     highlightRange.setStart(startNode, rangeData.startOffset);
//   //     highlightRange.setEnd(endNode, rangeData.lastOffset);
//   //     if (highlightRange.toString().trim() === rangeData.content.trim()) {
//   //       startIdx = i;
//   //       endIdx = j;
//   //     }
//   //   }
//   // }
//   console.log(startInfo, endInfo);

//   const tmp = document.createRange();
//   tmp.setStart(startInfo.node, startInfo.offset);
//   tmp.setEnd(endInfo.node, 0);

//   // Create a range for highlighting
//   const highlightRange = document.createRange();
//   highlightRange.setStart(startInfo.node, startInfo.offset);
//   highlightRange.setEnd(
//     endInfo.node,
//     rangeData.content.length - tmp.toString().length
//   );
//   console.log(endInfo.node.toString());
//   console.log(highlightRange.toString());
//   return highlightRange;
// }

function createRangeObject(rangeData) {
  const startNode = getReverseTrack(
    document.documentElement,
    JSON.parse(rangeData.startIndex)
  );

  const endNode = getReverseTrack(
    document.documentElement,
    JSON.parse(rangeData.lastIndex)
  );

  // Create a range for highlighting
  const highlightRange = document.createRange();
  highlightRange.setStart(startNode, rangeData.startOffset);
  highlightRange.setEnd(endNode, rangeData.lastOffset);
  return highlightRange;
}

function findRangeDataById() {
  // 배열에서 id가 일치하는 객체를 찾습니다
  return RANGE_DATA_ARR.find((obj) => obj.id === SELECTED_ID) || null;
}

function findRecommendDataById() {
  // 배열에서 id가 일치하는 객체를 찾습니다
  return RECOMMEND_DATA_ARR.find((obj) => obj.id === SELECTED_ID) || null;
}

function getHoverColor(color) {
  if (color === "rgb(255, 255, 131)") return YELLOW_COLOR_H;
  else if (color === "rgb(166, 255, 233)") return BLUE_COLOR_H;
  else if (color === "rgb(198, 198, 198)") return GRAY_COLOR_H;
  else return RED_COLOR_H;
}
