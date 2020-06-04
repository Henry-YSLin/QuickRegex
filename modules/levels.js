export let quickRegex = {
  savedState: {
    currentLevel: 0,
    levelStates: []
  },
  levels: [
    {
      title: 'Introduction',
      description: 'Regular expressions are patterns used to match character combinations in strings. Without special characters, Regex simply search for matching strings. Type <code class="regex">apple</code> below to search for all instances of "apple".',
      targetRegex: /apple/g,
      cases: [
        'This is an apple.',
        'They want apples.',
        'Do you like apples?',
        'Put the orange on the table.',
      ]
    },
    {
      title: 'Character Classes I',
      description: '<code>[...]</code> specifies a range of characters that can be matched. For example, <code class="regex">[a-z]</code> matches a character from a to z and <code class="regex">[A-E]</code> matches "A", "B", "C", "D" and "E".',
      targetRegex: /[A-Z]/g,
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'Do You Like Apples?',
        'Put The Orange On The Table.',
      ]
    },
    {
      title: 'Character Classes II',
      description: '<coderegex>[...]</code> can also specify characters other than alphabets. Simply put all the characters that you want to match inside the brackets. E.g. <code class="regex">[.!?]</code> matches ".", "!" and "?". <code class="regex">[a-zA-Z0-9]</code> matches all alphanumeric characters. <code class="regex">[A-Z?!]</code> matches "A" to "Z" and "!", "?"',
      targetRegex: /[a-eF-I!@]/g,
      cases: [
        '0123456789',
        'abcdefghi',
        'ABCDEFGHI',
        '!@#$%^&*',
      ]
    },
    {
      title: 'Inverted Character Classes',
      description: 'You can also invert character classes by using <code>[^...]</code>. <code class="regex">[^abc]</code> means not "a" or "b" or "c", while <code class="regex">[^0-9]</code> matches all characters except digits.',
      targetRegex: /[^a-z ]/g,
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'Do You Like Apples?',
        'Put The Orange On The Table.',
      ]
    },
    {
      title: 'Character Shorthands I',
      description: 'Shorthands are available for commonly used character classes. For example, <code class="regex">\\d</code> represents any digit, which is equivalent to <code class="regex">[0-9]</code>. <code class="regex">\\w</code> represents any alphanumeric character, which is <code class="regex">[a-zA-Z0-9]</code>.',
      targetRegex: /\d\w/g,
      cases: [
        '1A',
        '3D',
        '4$',
        '@5',
      ]
    },
    {
      title: 'Character Shorthands II',
      description: 'Another useful one is <code class="regex">\\s</code>. It matches any whitespace character. Note that whitespace character includes all kinds of whitespace, not just the normal space character that is typed with the spacebar.<br><br>If you simply type a space in the regex box, you will notice that not all spaces are matched. This is because some space characters are special.',
      targetRegex: /\s/g,
      cases: [
        'Apple apple apple',
        'Orange orange orange orange ?',
        'Banana banana banana banana',
        'Berry berry berry berry',
      ]
    },
    {
      title: 'Inverted Character Shorthands',
      description: 'These shorthands can also be inverted. Simply write them in upper case for the inverted version. E.g. <code class="regex">\\D</code> matches anything that is not a digit. <code class="regex">\\W</code> matches any non-alphanumeric character. <code class="regex">\\S</code> matches any non-whitespace character.',
      targetRegex: /\w\W/g,
      cases: [
        'a$',
        'b@ c*',
        'dh',
        'e/',
      ]
    },
    {
      title: 'The Dot',
      description: 'There is an important token that you should know - the dot <code class="regex">.</code>. It simply matches any character.',
      targetRegex: /a.c/g,
      cases: [
        'abc',
        'aec',
        'a9c',
        'a?c',
      ]
    },
    {
      title: 'Escaping Tokens',
      description: 'You may have noticed by now that, since <code class="regex">.</code> has a special meaning, we cannot match a fullstop just by typing <code>.</code>. To fix this problem, prepend a backslash <code>\\</code> to the dot to escape the <code class="regex">.</code> token. i.e. <code class="regex">\\.</code> matchs a fullstop only. To match the backslash itself, prepend it with another backslash.',
      targetRegex: /\\\./g,
      cases: [
        'C:\\Users\\...',
        'C:\\...',
        '......',
        'Nope.',
      ]
    },
    {
      title: 'Quantifiers I',
      description: 'Quantifiers specify how many times a phrase repeats. It is useful for denoting optional phrases or matching repeating phrases. To specify a quantifier, add <code>{...}</code> after a phrase. Write a number inside <code>{}</code> to specify the number of times the phrase repeats. E.g. <code class="regex">a{3}</code> matches "aaa".',
      targetRegex: /a{3}b{2}c{4}/g,
      cases: [
        'aaabbcccc',
        'aaaabbccccccc',
        'aaabcccc',
        'aaabbbbcccc',
      ]
    },
    {
      title: 'Quantifiers II',
      description: 'You can also specify 2 numbers, separated by a comma, inside <code>{}</code> to denote a range of possible number of times a phrase can repeat. E.g. <code class="regex">#{1,5}</code> matches anything from "#" to "#####". Omit the second number to allow the phrase to repeat an infinite number of times. E.g. <code class="regex">@{1,}</code> matches "@@@" or "@@@@@@@@@@".<br><br>Note that you cannot put a space anywhere inside <code>{}</code>',
      targetRegex: /!{1,3}@{3,}/g,
      cases: [
        '!@@@',
        '!!@@@',
        '!!@@',
        '!!!!!@@@@@@@@@@',
      ]
    },
    {
      title: 'Quantifier Shorthands',
      description: '<code>?</code> is equivalent to <code>{0,1}</code><br><code>*</code> is equivalent to <code>{0,}</code><br><code>+</code> is equivalent to <code>{1,}</code><br>E.g. <code class="regex">a+b?</code> matches "ab", "aab" and "aa"<br><code class="regex">a*b*</code> matches "aaa", "aaabbb" and "bbb".',
      targetRegex: /a*b+c?/g,
      cases: [
        'aaaaaabbbbbbc',
        'bbbbbcccc',
        'abc',
        'ac',
      ]
    },
  ]
};

export {quickRegex as default};