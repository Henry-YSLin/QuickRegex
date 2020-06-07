/*
Copyright (c) 2019 Steven A Muchow
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Enhanced RegEx JS processing
Adds position information for capture groups (nested ones too) AND named group items.
*/
class RegexContainer {

    static _findCaptureGroupsInRegexTemplate(re, input) {
        let refCount = 0; let matches = []; let res; let data;
        re.lastIndex = 0;
        while ((res = re.exec(input)) !== null) {
            if (input.charAt(res.index) === ')') {
                let idx = matches.length;
                while (idx--) {
                    if (matches[idx].end === undefined) {
                        matches[idx].end = re.lastIndex;
                        matches[idx].source = input.substring(matches[idx].start, matches[idx].end);
                        break;
                    }
                }
                refCount--;
                let writeIdx = idx;
                while (idx--) {
                    if (matches[idx].refCount === refCount) {
                        matches[writeIdx].parent = idx + 1;
                        break;
                    }
                }
            }
            else {
                refCount++;
                data = { parent: 0, refCount: refCount, start: res.index };
                if (res.groups.name) { data.name = res.groups.name; }
                matches.push(data);
            }
        }
        matches.unshift({ start: 0, end: input.length, source: input });
        return matches;
    }

    static execFull(re, input, foundCaptureItems) {
        let result; let foundIdx; let groupName; let lastPos = 0; const matches = [];
        re.lastIndex = 0;
        while ((result = re.exec(input)) !== null) {
            let array = createCustomResultArray(result);
            array.forEach((match, idx) => {
                if (!idx) {
                    match.startPos = match.endPos = result.index;
                    match.endPos += result[0].length;
                    delete match.parent;
                    return;
                }
                let parentStr = array[match.parent].data;
                let gpIdx = getGroupMappingIndex(idx, foundCaptureItems);
                let lookAroundParent;
                if (lookAroundParent = getLookaroundParent(gpIdx, foundCaptureItems)) {
                    if (lookAroundParent.startsWith('(?<')) {
                        foundIdx = input.substring(0, array[match.parent].endPos).lastIndexOf(match.data) - array[match.parent].startPos;
                    }
                    else {
                        foundIdx = input.slice(array[match.parent].startPos).indexOf(match.data);
                    }
                }
                else {
                    foundIdx = (match.parent < idx - 1) ? parentStr.lastIndexOf(match.data) : parentStr.indexOf(match.data);
                }
                match.startPos = match.endPos = foundIdx + array[match.parent].startPos;
                match.endPos += match.data.length;
                if ((groupName = foundCaptureItems[gpIdx].name)) { match.groupName = groupName; }
            });
            matches.push(array);
            if (result[0].length === 0) { re.lastIndex++; }
            lastPos = re.lastIndex;
            if (re.flags.indexOf('g') === -1) return matches;
        }
        return matches;

        function getGroupMappingIndex(idx, foundCaptureItems) {
            let mapping = [];
            foundCaptureItems.forEach((item, idx) => {
                if (idx === 0 || !/^\(\?(?!<\w)/.test(item.source)) {
                    mapping.push(idx);
                }
            });
            return mapping[idx];
        }

        function getLookaroundParent(idx, foundCaptureItems) {
            while (foundCaptureItems[idx].parent) {
                idx = foundCaptureItems[idx].parent;
                if (/^\(\?[=!<]/.test(foundCaptureItems[idx].source)) {
                    return foundCaptureItems[idx].source;
                }
                else if (/^\((?!:)/.test(foundCaptureItems[idx].source)) {
                    return null;
                }
            }
            return null;
        }

        function createCustomResultArray(result) {
            let captureVar = 0;
            return Array.from(result, (data) => {
                return { data: data || '', parent: foundCaptureItems[captureVar++].parent, };
            });
        }
    }

    static mapCaptureAndNameGroups(inputRegexSourceString) {
        let REGEX_CAPTURE_GROUPS_ANALYZER = /(?:(?<!\\)|^)\((?:\?(?:<(?<name>\w+)>|<=|<!|!|=))?|(?:(?<!\\)\)(?:(?:[*+?]\??)?|{\d+,?(?:\d+)?}\??))/gm;
        return RegexContainer._findCaptureGroupsInRegexTemplate(REGEX_CAPTURE_GROUPS_ANALYZER, inputRegexSourceString);
    }

    static exec(re, input) {
        let foundCaptureItems = RegexContainer.mapCaptureAndNameGroups(re.source);
        let res = RegexContainer.execFull(re, input, foundCaptureItems);
        return { captureItems: foundCaptureItems, results: res };
    }

}

export default RegexContainer;
