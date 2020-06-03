var caseList = document.querySelector('.case-list');
var caseTemplate = document.querySelector('#case-template');
var navList = document.querySelector('.nav-list');
var navTemplate = document.querySelector('#nav-template')
var title = document.querySelector('#title');
var description = document.querySelector('#description');
var highlighting = document.getElementById('highlighting');
var editor = document.getElementById('editor');
var progressBarStrip = document.getElementById('progress-bar').querySelector('div');
var progressBarText = progressBarStrip.querySelector('#progress-bar-text');
var fab = document.querySelector('.fab-btn');
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

  textElem.innerText = element.title;
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
      loadLevel();
    }
    document.querySelector('body').setAttribute('faded', 'false');
  }
}

function loadLevel() {
  while (caseList.lastChild && caseList.lastChild.tagName != 'TEMPLATE') {
    caseList.removeChild(caseList.lastChild);
  }

  var caseArray = [];

  var currentIdx = quickRegex.savedState.currentLevel;
  var currentLevel = quickRegex.levels[currentIdx];
  var levelState = quickRegex.savedState.levelStates[currentIdx];

  fab.setAttribute('enabled', 'false');
  editor.value = levelState.regex;
  highlighting.innerText = levelState.regex;
  updateHighlighting();
  editor.focus();

  title.innerHTML = 'Lesson ' + (currentIdx + 1) + ' - ' + currentLevel.title;
  description.innerHTML = currentLevel.description;

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
  if (verifyRegex(editor.value)) {
    var inputRegex = new RegExp(editor.value, 'g');
    var targetRegex = quickRegex.levels[quickRegex.savedState.currentLevel].targetRegex;
    var numPassed = 0;
    var total = 0;
    await Promise.all(cases.map(async element => {
      await unmarkAsync(element.markjs, {});
      await markRegExpAsync(element.markjs, inputRegex, { "className": "input-highlight", "acrossElements": "true" });
      await markRegExpAsync(element.markjs, targetRegex, { "className": "target-highlight", "acrossElements": "true" });

      const caseText = element.text.innerText;
      const matchesA = Array.from(caseText.matchAll(targetRegex));
      const matchesB = Array.from(caseText.matchAll(inputRegex));
      var passedCases = matchesA.reduce((accumulator, currentValue) => {
        return accumulator +
          ((matchesB.find(x => x.index === currentValue.index && x[0] === currentValue[0])) ? 1 : 0);
      }, 0) +
        matchesB.reduce((accumulator, currentValue) => {
          return accumulator +
            ((matchesA.find(x => x.index === currentValue.index && x[0] === currentValue[0])) ? 1 : 0);
        }, 0);

      if (passedCases === matchesA.length + matchesB.length) {
        element.caseElement.setAttribute('passed', 'true');
      }
      else {
        element.caseElement.setAttribute('passed', 'false');
      }
      numPassed += passedCases;
      total += matchesA.length + matchesB.length;
    }));
    progressBarStrip.style.width = Math.round(numPassed * 100 / total) + '%';
    progressBarText.innerText = Math.round(numPassed * 100 / total) + '%';
    if (numPassed === total) {
      fab.setAttribute('enabled', 'true');
    }
    else {
      fab.setAttribute('enabled', 'false');
    }
  }
  else {
    await Promise.all(cases.map(async element => {
      await unmarkAsync(element.markjs, {});
      await markRegExpAsync(element.markjs, targetRegex, { "className": "target-highlight", "acrossElements": "true" });
      element.caseElement.setAttribute('passed', 'false');
    }));
    progressBarStrip.style.width = '0%';
    progressBarText.innerText = '0%';
    fab.setAttribute('enabled', 'false');
  }
}

function verifyRegex(regex) {
  var isValid = true;
  try {
    new RegExp(regex, 'g');
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