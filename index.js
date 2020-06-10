import quickRegex from './levels.js';
import RegexContainer from './extern/RegexContainer.js';
import Mark from './extern/mark.es6.js';
import Queue from './extern/FunctionQueue.js';
import RegexColorizer from './extern/RegexColorizer.js';

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
const q = new Queue(true);


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

editor.addEventListener("keydown", function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
})

function setEditorHeight() {
  editor.style.height = 'auto';
  editor.style.height = (editor.scrollHeight) + 'px';
  highlighting.style.height = editor.offsetHeight + 'px';
}

editor.style.overflowY = 'hidden';
setEditorHeight();

// set up editor
editor.addEventListener("input", async function () {
  editor.value = editor.value.replace(/\r\n|\r|\n/,'');
  setEditorHeight();
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

setTimeout(() => q.next(), 300);

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

  setEditorHeight();

  saveState();
}

function updateHighlighting() {
  highlighting.innerText = editor.value;
  RegexColorizer.colorizeAll();
}

async function updateCases() {
  var currentLevel = quickRegex.levels[quickRegex.savedState.currentLevel];
  var targetRegex = currentLevel.targetRegex;
  var flags = currentLevel.hasOwnProperty('explicitFlags') ? currentLevel.explicitFlags : ((targetRegex === null) ? 'g' : targetRegex.flags);
  var errMsg;
  if (editor.value && !(errMsg = verifyRegex(editor.value, flags))) {
    var matchTooMany = false;
    var matchTooFew = false;
    var wrongCaptureGroup = false;
    var inputRegex = new RegExp(editor.value, flags);
    var numPassed = 0;
    var total = 0;
    await Promise.all(cases.map(async element => {
      element.text.innerHTML = escapeHtml(element.text.innerText);

      inputRegex.lastIndex = 0;
      if (targetRegex !== null)
        targetRegex.lastIndex = 0;

      const caseText = element.text.innerText;
      let dataA;
      let matchesA = [];
      if (targetRegex !== null) {
        dataA = RegexContainer.exec(targetRegex, caseText);
        matchesA = dataA.results;
      }
      const dataB = RegexContainer.exec(inputRegex, caseText);
      const matchesB = dataB.results;

      const fullMatchesA = matchesA.map(item => {
        return item[0];
      }).filter(x => {
        return x.startPos !== x.endPos;
      }).map(x => {
        return {
          start: x.startPos,
          length: x.endPos - x.startPos
        };
      });

      if (fullMatchesA.length)
        await markRangesAsync(element.markjs, fullMatchesA, { "className": "target-highlight" });


      const fullMatchesB = matchesB.map(item => {
        return item[0];
      }).filter(x => {
        return x.startPos !== x.endPos;
      }).map(x => {
        return {
          start: x.startPos,
          length: x.endPos - x.startPos
        };
      });

      if (fullMatchesB.length)
        await markRangesAsync(element.markjs, fullMatchesB, { "className": "input-highlight" });


      const groupMarkersA = matchesA.map(item => {
        return item.slice(1);
      }).flat().filter(x => {
        return x.startPos !== x.endPos;
      }).map(x => {
        return {
          start: x.startPos,
          length: x.endPos - x.startPos
        };
      });

      if (groupMarkersA.length)
        await markRangesAsync(element.markjs, groupMarkersA, { "className": "target-group-highlight" });

      const groupMarkersB = matchesB.map(item => {
        return item.slice(1);
      }).flat().filter(x => {
        return x.startPos !== x.endPos;
      }).map(x => {
        return {
          start: x.startPos,
          length: x.endPos - x.startPos
        };
      });

      if (groupMarkersB.length)
        await markRangesAsync(element.markjs, groupMarkersB, { "className": "input-group-highlight" });

      markZeroLengths(element.text, matchesA.map(x => x[0]).filter(x => x.startPos === x.endPos).map(x => x.startPos), { "className": "target-zero-highlight" });
      markZeroLengths(element.text, matchesB.map(x => x[0]).filter(x => x.startPos === x.endPos).map(x => x.startPos), { "className": "input-zero-highlight" });


      var matchesAPass = matchesA.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matchesB.find(x => x[0].startPos === currentValue[0].startPos && x[0].endPos === currentValue[0].endPos)) ? 1 : 0);
      }, 0);
      var matchesBPass = matchesB.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matchesA.find(x => x[0].startPos === currentValue[0].startPos && x[0].endPos === currentValue[0].endPos)) ? 1 : 0);
      }, 0);
      var matches2APass = groupMarkersA.reduce((accumulator, currentValue) => {
        return accumulator +
          ((groupMarkersB.find(x => x.start === currentValue.start && x.length === currentValue.length)) ? 1 : 0);
      }, 0);

      if (targetRegex === null) {
        element.caseElement.setAttribute('passed', 'true');
      }
      else if (matchesAPass + matchesBPass + matches2APass === matchesA.length + matchesB.length + groupMarkersA.length) {
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
        else if (matches2APass < groupMarkersA.length) {
          wrongCaptureGroup = true;
        }
      }
      numPassed += matchesAPass + matchesBPass + matches2APass;
      total += matchesA.length + matchesB.length + groupMarkersA.length;
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
          updateMessage('Your regex matches correctly, but you are missing some capturing groups');
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
        element.text.innerHTML = escapeHtml(element.text.innerText);

        targetRegex.lastIndex = 0;

        const caseText = element.text.innerText;

        const matchesA = RegexContainer.exec(targetRegex, caseText).results;

        const fullMatchesA = matchesA.map(item => {
          return item[0];
        }).filter(x => {
          return x.startPos !== x.endPos;
        }).map(x => {
          return {
            start: x.startPos,
            length: x.endPos - x.startPos
          };
        });

        if (fullMatchesA.length)
          await markRangesAsync(element.markjs, fullMatchesA, { "className": "target-highlight" });


        const groupMarkersA = matchesA.map((item) => {
          return item.slice(1);
        }).flat().filter(x => {
          return x.startPos !== x.endPos;
        }).map(x => {
          return {
            start: x.startPos,
            length: x.endPos - x.startPos
          }
        });

        if (groupMarkersA)
          await markRangesAsync(element.markjs, groupMarkersA, { "className": "target-group-highlight" });

        markZeroLengths(element.text, matchesA.map(x => x[0]).filter(x => x.startPos === x.endPos).map(x => x.startPos), { "className": "target-zero-highlight" });

        element.caseElement.setAttribute('passed', 'false');
      }));
      progressBarStrip.style.width = '0%';
      progressBarText.innerText = '0%';
      fab.setAttribute('enabled', 'false');
    }
    else {
      cases.forEach(element => {
        element.text.innerHTML = escapeHtml(element.text.innerText);
        element.caseElement.setAttribute('passed', 'true');
      });
      progressBarStrip.style.width = '100%';
      progressBarText.innerText = '100%';
      fab.setAttribute('enabled', 'true');
    }
    if (editor.value) {
      if (errMsg)
        updateMessage('Your regex is invalid! - ' + errMsg.match(/: ([^:]*?)$/)[1]);
      else
        updateMessage('Your regex is invalid!');
    }
    else {
      if (targetRegex === null) {
        updateMessage('Type something to get started or click next to move on');
      }
      else {
        updateMessage('Type something to get started');
      }
    }
  }
}

function updateMessage(msg) {
  q.add(async () => {
    if (message.innerText !== msg) {
      message.classList.remove('fade-in');
      message.classList.add('fade-out');
      await sleep(250);
      message.innerText = msg;
      message.classList.remove('fade-out');
      message.classList.add('fade-in');
    }
  });
}

function verifyRegex(regex, flags) {
  var err = null;
  try {
    new RegExp(regex, flags);
  } catch (e) {
    err = e.message;
  }
  return err;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function markZeroLengths(element, positions, options) {
  let code = element.innerHTML;
  const addition = '<mark class="' + options.className + '"></mark>';
  positions.forEach(pos => {
    let i = 0;
    let len = 0;
    let skip = '';
    while (i < code.length) {
      if (skip) {
        if (code[i] === skip) skip = '';
      }
      else {
        if (len === pos) {
          code = code.splice(i, addition);
          return;
        }
        if (code[i] === '<') {
          skip = '>';
        }
        else if (code[i] === '&') {
          skip = ';';
          len++;
        }
        else {
          len++;
        }
      }
      i++;
    }
    if (len === pos) {
      code = code + addition;
    }
    else {
      throw pos + ' is out of bounds';
    }
  });
  element.innerHTML = code;
}

function markRangesAsync(markInstance, ranges, options) {
  return new Promise(function (resolve, reject) {
    markInstance.markRanges(ranges, {
      ...options,
      done: resolve
    });
  });
}