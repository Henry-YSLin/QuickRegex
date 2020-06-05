import quickRegex from './modules/levels.js';
import MultiRegExp2 from './modules/multiRegExp2.esm.js';

var caseList = document.querySelector('.case-list');
var caseTemplate = document.querySelector('#case-template');
var navList = document.querySelector('.nav-list');
var navTemplate = document.querySelector('#nav-template')
var title = document.querySelector('#title');
var description = document.querySelector('#description');
var highlighting = document.getElementById('highlighting');
var editor = document.getElementById('editor');
var main = document.querySelector('main');
var progressBar = document.getElementById('progress-bar');
var progressBarStrip = document.getElementById('progress-bar').querySelector('div');
var progressBarText = progressBarStrip.querySelector('#progress-bar-text');
var fab = document.querySelector('.fab-btn');
var message = document.querySelector('.message');
var cases = [];

if (String.prototype.splice === undefined) {
  /**
   * Splices text within a string.
   * @param {int} offset The position to insert the text at (before)
   * @param {string} text The text to insert
   * @param {int} [removeCount=0] An optional number of characters to overwrite
   * @returns {string} A modified string containing the spliced text.
   */
  String.prototype.splice = function (offset, text, removeCount = 0) {
    let calculatedOffset = offset < 0 ? this.length + offset : offset;
    return this.substring(0, calculatedOffset) +
      text + this.substring(calculatedOffset + removeCount);
  };
}

if (localStorage.getItem('savedState') === null) {
  quickRegex.savedState.levelStates = [...Array(quickRegex.levels.length)].map((_, i) => { return { passed: false, unlocked: false, regex: '' } });
  quickRegex.savedState.levelStates[0].unlocked = true;
}
else {
  quickRegex.savedState = JSON.parse(localStorage.savedState);
  for (var i = 0; i < quickRegex.levels.length; i++) {
    if (!quickRegex.savedState.levelStates[i]) {
      quickRegex.savedState.levelStates[i] = { passed: false, unlocked: false, regex: '' };
    }
  }
}

// auto-save
setInterval(function () { saveState() }, 5000);

// set up editor
editor.addEventListener("input", async function () {
  updateHighlighting();
  await updateCases();
  quickRegex.savedState.levelStates[quickRegex.savedState.currentLevel].regex = editor.value;
}, false);
RegexColorizer.colorizeAll();

//set up nav bar
while (navList.lastChild && navList.lastChild.tagName != 'TEMPLATE') {
  navList.removeChild(navList.lastChild);
}

quickRegex.levels.forEach((element, index) => {
  var clone = navTemplate.content.cloneNode(true);
  var textElem = clone.querySelector('.nav-title');
  var navItem = clone.querySelector('.nav-item');

  navItem.setAttribute('passed', quickRegex.savedState.levelStates[index].passed);
  navItem.setAttribute('unlocked', quickRegex.savedState.levelStates[index].unlocked);
  navItem.setAttribute('current', index === quickRegex.savedState.currentLevel);
  navItem.setAttribute('index', index);
  navItem.addEventListener('click', navItem_onclick);

  textElem.innerHTML = element.title;
  element.navElement = navItem;

  navList.appendChild(clone);
});

// load level
loadLevel();

// transition
document.querySelector('body').setAttribute('faded', 'false');

function saveState() {
  localStorage.savedState = JSON.stringify(quickRegex.savedState);
}

async function navItem_onclick(listener) {
  if (listener.currentTarget.getAttribute('unlocked') === 'true') {
    var newIndex = Number(listener.currentTarget.getAttribute('index'));
    if (newIndex !== quickRegex.currentLevel) {
      quickRegex.savedState.currentLevel = newIndex;
      document.querySelector('body').setAttribute('faded', 'true');
      await sleep(300);
      loadLevel();
      quickRegex.levels.forEach((element, index) => {
        var navItem = element.navElement;

        navItem.setAttribute('passed', quickRegex.savedState.levelStates[index].passed);
        navItem.setAttribute('unlocked', quickRegex.savedState.levelStates[index].unlocked);
        navItem.setAttribute('current', index === quickRegex.savedState.currentLevel);
        navItem.setAttribute('index', index);
      });
      document.querySelector('body').setAttribute('faded', 'false');
    }
  }
}
window.navItem_onclick = navItem_onclick;


async function nextlevel_onclick() {
  if (fab.getAttribute('enabled') === 'true') {
    document.querySelector('body').setAttribute('faded', 'true');
    await sleep(300);
    var currentLevel = quickRegex.levels[quickRegex.savedState.currentLevel];
    quickRegex.savedState.levelStates[quickRegex.savedState.currentLevel].passed = true;
    currentLevel.navElement.setAttribute('current', 'false');
    currentLevel.navElement.setAttribute('passed', 'true');
    if (quickRegex.savedState.currentLevel === quickRegex.levels.length - 1) {
      document.querySelector('#grid').style.display = 'none';
      document.querySelector('#endscreen').style.display = 'flex';
      document.querySelector('#endscreen').classList.add('endscreen');
    }
    else {
      quickRegex.savedState.currentLevel++;
      currentLevel = quickRegex.levels[quickRegex.savedState.currentLevel];
      quickRegex.savedState.levelStates[quickRegex.savedState.currentLevel].unlocked = true;
      currentLevel.navElement.setAttribute('current', 'true');
      currentLevel.navElement.setAttribute('unlocked', 'true');
      currentLevel.navElement.scrollIntoView();
      loadLevel();
    }
    document.querySelector('body').setAttribute('faded', 'false');
  }
}
window.nextlevel_onclick = nextlevel_onclick;

function loadLevel() {
  while (caseList.lastChild && caseList.lastChild.tagName != 'TEMPLATE') {
    caseList.removeChild(caseList.lastChild);
  }

  var caseArray = [];

  var currentIdx = quickRegex.savedState.currentLevel;
  var currentLevel = quickRegex.levels[currentIdx];
  var levelState = quickRegex.savedState.levelStates[currentIdx];

  if (currentIdx === 0)
    title.innerHTML = currentLevel.title;
  else
    title.innerHTML = 'Lesson ' + currentIdx + ' - ' + currentLevel.title;
  description.innerHTML = currentLevel.description;

  fab.setAttribute('enabled', 'false');
  editor.value = levelState.regex;
  highlighting.innerText = levelState.regex;
  updateHighlighting();
  editor.focus();

  if (currentLevel.cases.length === 0) {
    main.style.display = 'none';
    progressBar.style.display = 'none';
  }
  else {
    main.style.display = 'grid';
    progressBar.style.display = 'block';
  }

  currentLevel.cases.forEach(element => {
    var clone = caseTemplate.content.cloneNode(true);
    var textElem = clone.querySelector('.case-text');

    textElem.innerText = element;
    caseArray.push({
      caseElement: clone.querySelector('.case'),
      text: textElem,
      checkmark: clone.querySelector('.checkmark'),
      markjs: new Mark(textElem)
    });

    caseList.appendChild(clone);
  });

  cases = caseArray;

  updateCases();

  saveState();
}

function updateHighlighting() {
  highlighting.innerText = editor.value;
  RegexColorizer.colorizeAll();
}

async function updateCases() {
  var targetRegex = quickRegex.levels[quickRegex.savedState.currentLevel].targetRegex;
  var flags = (targetRegex === null) ? 'g' : targetRegex.flags;
  if (verifyRegex(editor.value, flags)) {
    var matchTooMany = false;
    var matchTooFew = false;
    var wrongCaptureGroup = false;
    var inputRegex = new RegExp(editor.value, flags);
    var numPassed = 0;
    var total = 0;
    await Promise.all(cases.map(async element => {
      await unmarkAsync(element.markjs, {});
      await markRegExpAsync(element.markjs, inputRegex, { "className": "input-highlight", "acrossElements": "true" });
      if (targetRegex !== null)
        await markRegExpAsync(element.markjs, targetRegex, { "className": "target-highlight", "acrossElements": "true" });

      const caseText = element.text.innerText;
      const matchesA = (targetRegex === null) ? [] : Array.from(caseText.matchAll(targetRegex));
      const matchesB = Array.from(caseText.matchAll(inputRegex));

      let matches2A = [];
      if (targetRegex !== null) {
        let regex2A = new MultiRegExp2(targetRegex);
        matches2A = (() => {
          var arr = [];
          var pos = regex2A.regexp.lastIndex;
          var res = regex2A.execForAllGroups(caseText, true);
          while (res) {
            if (regex2A.regexp.lastIndex === pos) {
              regex2A.regexp.lastIndex++;
            }
            arr.push(...res.slice(1));
            pos = regex2A.regexp.lastIndex;
            res = regex2A.execForAllGroups(caseText, true);
          }
          return arr;
        })();

        if (matches2A)
          await markRangesAsync(element.markjs, matches2A.map(x => {
            if (x.start !== 0) {
              return {
                start: x.start,
                length: x.end - x.start
              };
            }
            else {   // dirty patch
              if (caseText.substring(x.start, x.end) === x.match) {
                return {
                  start: x.start,
                  length: x.end - x.start
                };
              }
              else {
                return {
                  start: caseText.indexOf(x.match),
                  length: x.match.length
                };
              }
            }
          }), { "className": "target-group-highlight" });
      }

      let regex2B = new MultiRegExp2(inputRegex);
      let matches2B = (() => {
        var arr = [];
        var pos = regex2B.regexp.lastIndex;
        var res = regex2B.execForAllGroups(caseText, true);
        while (res) {
          if (regex2B.regexp.lastIndex === pos) {
            regex2B.regexp.lastIndex++;
          }
          arr.push(...res.slice(1));
          pos = regex2B.regexp.lastIndex;
          res = regex2B.execForAllGroups(caseText, true);
        }
        return arr;
      })();

      if (matches2B)
        await markRangesAsync(element.markjs, matches2B.map(x => {
          if (x.start !== 0) {
            return {
              start: x.start,
              length: x.end - x.start
            };
          }
          else {   // dirty patch
            if (caseText.substring(x.start, x.end) === x.match) {
              return {
                start: x.start,
                length: x.end - x.start
              };
            }
            else {
              return {
                start: caseText.indexOf(x.match),
                length: x.match.length
              };
            }
          }
        }), { "className": "input-group-highlight" });


      var matchesAPass = matchesA.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matchesB.find(x => x.index === currentValue.index && x[0] === currentValue[0])) ? 1 : 0);
      }, 0);
      var matchesBPass = matchesB.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matchesA.find(x => x.index === currentValue.index && x[0] === currentValue[0])) ? 1 : 0);
      }, 0);
      var matches2APass = matches2A.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matches2B.find(x => x.start === currentValue.start && x.end === currentValue.end && x.match === currentValue.match)) ? 1 : 0);
      }, 0);

      if (targetRegex === null) {
        element.caseElement.setAttribute('passed', 'true');
      }
      else if (matchesAPass + matchesBPass + matches2APass === matchesA.length + matchesB.length + matches2A.length) {
        element.caseElement.setAttribute('passed', 'true');
      }
      else {
        element.caseElement.setAttribute('passed', 'false');
        if (matchesAPass < matchesA.length) {
          matchTooFew = true;
        }
        else if (matchesBPass < matchesB.length) {
          matchTooMany = true;
        }
        else if (matches2APass < matches2A.length) {
          wrongCaptureGroup = true;
        }
      }
      numPassed += matchesAPass + matchesBPass + matches2APass;
      total += matchesA.length + matchesB.length + matches2A.length;
    }));
    if (targetRegex === null) {
      progressBarStrip.style.width = '100%';
      progressBarText.innerText = '100%';
    } else {
      progressBarStrip.style.width = Math.round(numPassed * 100 / total) + '%';
      progressBarText.innerText = Math.round(numPassed * 100 / total) + '%';
    }
    if (targetRegex === null) {
      fab.setAttribute('enabled', 'true');
      updateMessage('Click continue when you are ready');
    }
    else if (numPassed === total) {
      fab.setAttribute('enabled', 'true');
      updateMessage('Congrats! Problem solved.');
    }
    else {
      fab.setAttribute('enabled', 'false');
      if (editor.value) {
        if (matchTooMany) {
          updateMessage('Your regex has too many matches');
        }
        else if (matchTooFew) {
          updateMessage('Your regex doesn\'t match all targets');
        }
        else if (wrongCaptureGroup) {
          updateMessage('Your regex matches correctly, but the capture groups are wrong');
        }
        else {
          updateMessage('Some test cases failed');
        }
      }
      else {
        updateMessage('Type something to get started');
      }
    }
  }
  else {
    if (targetRegex !== null) {
      await Promise.all(cases.map(async element => {
        await unmarkAsync(element.markjs, {});
        await markRegExpAsync(element.markjs, targetRegex, { "className": "target-highlight", "acrossElements": "true" });

        const caseText = element.text.innerText;

        let regex2A = new MultiRegExp2(targetRegex);
        let matches2A = regex2A.execForAllGroups(caseText);

        if (matches2A)
          await markRangesAsync(element.markjs, matches2A.map(x => {
            if (x.start !== 0) {
              return {
                start: x.start,
                length: x.end - x.start
              };
            }
            else {   // dirty patch
              if (caseText.substring(x.start, x.end) === x.match) {
                return {
                  start: x.start,
                  length: x.end - x.start
                };
              }
              else {
                return {
                  start: caseText.indexOf(x.match),
                  length: x.match.length
                };
              }
            }
          }), { "className": "target-group-highlight" });

        element.caseElement.setAttribute('passed', 'false');
      }));
      progressBarStrip.style.width = '0%';
      progressBarText.innerText = '0%';
      fab.setAttribute('enabled', 'false');
    }
    else {
      progressBarStrip.style.width = '100%';
      progressBarText.innerText = '100%';
      fab.setAttribute('enabled', 'true');
    }
    if (editor.value) {
      updateMessage('Your regex is invalid!');
    }
    else {
      updateMessage('Type something to get started');
    }
  }
}

function updateMessage(msg) {
  if (message.innerText !== msg)
    setTimeout(async () => {
      message.classList.remove('fade-in');
      message.classList.add('fade-out');
      await sleep(250);
      message.innerText = msg;
      message.classList.remove('fade-out');
      message.classList.add('fade-in');
    }, 0);
}

function verifyRegex(regex, flags) {
  var isValid = true;
  try {
    new RegExp(regex, flags);
  } catch (e) {
    isValid = false;
  }
  return isValid;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createRange(node, chars, range) {
  if (!range) {
    range = document.createRange()
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (var lp = 0; lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range);

        if (chars.count === 0) {
          break;
        }
      }
    }
  }

  return range;
};

function setCurrentCursorPosition(elementId, chars) {
  if (chars >= 0) {
    var selection = window.getSelection();

    range = createRange(document.getElementById(elementId).parentNode, { count: chars });

    if (range) {
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

function isChildOf(node, parentId) {
  while (node !== null) {
    if (node.id === parentId) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};

function getCurrentCursorPosition(parentId) {
  var selection = window.getSelection(),
    charCount = -1,
    node;

  if (selection.focusNode) {
    if (isChildOf(selection.focusNode, parentId)) {
      node = selection.focusNode;
      charCount = selection.focusOffset;

      while (node) {
        if (node.id === parentId) {
          break;
        }

        if (node.previousSibling) {
          node = node.previousSibling;
          charCount += node.textContent.length;
        } else {
          node = node.parentNode;
          if (node === null) {
            break
          }
        }
      }
    }
  }

  return charCount;
};

function unmarkAsync(markInstance, options) {
  return new Promise(function (resolve, reject) {
    markInstance.unmark({
      ...options,
      done: resolve
    });
  });
}

function markRegExpAsync(markInstance, regex, options) {
  return new Promise(function (resolve, reject) {
    markInstance.markRegExp(regex, {
      ...options,
      done: resolve
    });
  });
}

function markRangesAsync(markInstance, ranges, options) {
  return new Promise(function (resolve, reject) {
    markInstance.markRanges(ranges, {
      ...options,
      done: resolve
    });
  });
}