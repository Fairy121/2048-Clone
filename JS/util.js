let utils = (function() {
  let GameOverUtil = function(arr, cellArr) {
    for (let r = 0; r < arr.length; r++) {
      if (r < arr.length) {
        if (arr[r] === arr[r + 1]) {
          cellArr.push(arr[r]);
        }
      }
    }
  };

  let mergeUtil = function(x, y, a, b) {
    //utility func to help merge func
    let cells = [];
    let isMerged = false;
    let result = false;
    if (x !== y) {
      if (a[x] !== "") {
        if (a[x] === a[x + b]) {
          a[x] = a[x] + a[x + b];
          a[x + b] = "";
          isMerged = true;
          console.log("we merged");
        } else {
          isMerged = false;
        }
      }
    }
    return isMerged;
  };

  return {
    GameOverUtil,
    mergeUtil
  };
})();
