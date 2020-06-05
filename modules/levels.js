export let quickRegex = {
  savedState: {
    currentLevel: 0,
    levelStates: []
  },
  levels: [
    {
      title: 'Introduction',
      description: 'Regular expressions (Regex) are patterns used to match character combinations in strings. Regex itself is not a programming language. Rather, regex is commonly used in many programming languages as a convenient way to handle strings and extract information from them. Regex also has the advantage of being faster than custom-coded string functions when matching complex patterns since regex engines usually have good optimizations.<br><br>This is what regex looks like (with fancy highlighting):<br><code class="regex">^([a-z0-9_\\.-]+)@([\\da-z\.-]+)\\.([a-z\\.]{2,6})$</code><br>The regex shown above validates email addresses.<br><br>Regex may look complex and unreadable at first glance, but its syntax is actually relatively simple. In the following lessons, you will learn the different rules and tokens of regex and go from a complete newbie to a regex master in no time.',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Simple Strings',
      description: 'Without special characters, regex simply search for matching strings. Type <code class="regex">apple</code> below to search for all instances of "apple".',
      targetRegex: /apple/g,
      cases: [
        'This is an apple.',
        'They want apples.',
        'Do you like apples?',
        'Put the orange on the table.',
      ]
    },
    {
      title: 'Character Classes I - <code>[...]</code>',
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
      title: 'Character Classes II - <code>[...]</code>',
      description: '<code>[...]</code> can also specify characters other than alphabets. Simply put all the characters that you want to match inside the brackets. E.g. <code class="regex">[.!?]</code> matches ".", "!" and "?". <code class="regex">[a-zA-Z0-9]</code> matches all alphanumeric characters. <code class="regex">[A-Z?!]</code> matches "A" to "Z" and "!", "?"',
      targetRegex: /[a-eF-I!@]/g,
      cases: [
        '0123456789',
        'abcdefghi',
        'ABCDEFGHI',
        '!@#$%^&*',
      ]
    },
    {
      title: 'Inverted Character Classes - <code>[^...]</code>',
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
      title: 'Character Shorthands I - <code class="regex">\\d</code> <code class="regex">\\w</code>',
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
      title: 'Character Shorthands II - <code class="regex">\\s</code>',
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
      title: 'Inverted Character Shorthands - <code class="regex">\\D</code> <code class="regex">\\W</code> <code class="regex">\\S</code>',
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
      title: 'The Dot - <code class="regex">.</code>',
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
      title: 'Escaping Tokens - <code class="regex">\\.</code> <code class="regex">\\\\</code>',
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
      title: 'Quantifiers I - <code>{#}</code>',
      description: 'Quantifiers specify how many times a phrase repeats. It is useful for denoting optional phrases or matching repeating phrases. To specify a quantifier, add <code>{...}</code> after a phrase. Write a number inside <code>{}</code> to specify the number of times the phrase repeats. E.g. <code class="regex">a{3}</code> matches "aaa".<br><br>Note that quantifiers only apply to as few tokens as possible, which means <code class="regex">ab{2}</code> matches "abb", not "aabb" or "abab"',
      targetRegex: /a{3}b{2}c{4}/g,
      cases: [
        'aaabbcccc',
        'aaaabbccccccc',
        'aaabcccc',
        'aaabbbbcccc',
      ]
    },
    {
      title: 'Quantifiers II - <code>{#,#}</code>',
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
      title: 'Quantifier Shorthands - <code>?</code> <code>*</code> <code>+</code>',
      description: '<code>?</code> is equivalent to <code>{0,1}</code><br><code>*</code> is equivalent to <code>{0,}</code><br><code>+</code> is equivalent to <code>{1,}</code><br>E.g. <code class="regex">a+b?</code> matches "ab", "aab" and "aa"<br><code class="regex">a*b*</code> matches "aaa", "aaabbb" and "bbb".',
      targetRegex: /a*b+c?/g,
      cases: [
        'aaaaaabbbbbbc',
        'bbbbbcccc',
        'abc',
        'ac',
      ]
    },
    {
      title: 'Greedy/Lazy Match - <code>{#,#}?</code> <code>??</code> <code>*?</code> <code>+?</code>',
      description: 'When you specify a range of possible numbers for a quantifier, the regex engine can sometimes choose to match a longer or shorter phrase. For example, running <code class="regex">a{2,3}</code> on the string "aaa" can return "aa" or "aaa" as a match. By default, the regex engine is "greedy", which means it tries to match as long as possible. To change this behavior to "lazy" (match as short as possible), add a <code>?</code> after quantifiers. E.g. for the string "aaabbb", <code class="regex">a*b+</code> matches "aaabbb" while <code class="regex">a*b+?</code> matches "aaab".<br><br>Note that one <code>?</code> will be treated as a <code>{0,1}</code> quantifier. Use <code>??</code> for the lazy <code>{0,1}</code> quantifier.',
      targetRegex: /<.*?>/g,
      cases: [
        '<FEWG$#%EV>',
        '<F$G#REVFVT><RFG#%HGRE>',
        '<fr4t3grwv><vrb3h53tg><R%Y^$HTGE>',
        '<><>',
      ]
    },
    {
      title: 'Anchors I - <code class="regex">^</code> <code class="regex">$</code>',
      description: 'Up until this point, your regex expression can match phrases in any part of a string. To limit where the matches occur, anchors can be added to the expression to sepcify positions in a string. For example, <code>^</code> anchors the match to the start of the string and <code>$</code> anchors the match to the end. i.e. <code class="regex">^aaa</code> matches "aaabbb" but not "bbbaaa", while <code class="regex">aaa$</code> matches "bbbaaa" but not "aaabbb". <code class="regex">^aaa$</code> only matches "aaa".',
      targetRegex: /abc$/g,
      cases: [
        'abccc',
        'abcabc',
        'ababc',
        'aaabc',
      ]
    },
    {
      title: 'Anchors II - <code class="regex">\\b</code>',
      description: 'Another anchor is <code class="regex">\\b</code>. It specifies a word boundary position in the string, defined as a position in the string between a character matched by <code class="regex">\\w</code> (alphanumeric character) and a character not matched by <code class="regex">\\w</code>. For the string "hello world", the <code class="regex">\\b</code> positions are <code>|hello| |world|</code> (denoted by <code>|</code>)<br><br>Note that where you put an anchor in your regex matters. With the string "Odd dot", <code class="regex">\\bd</code> matches the "d" in "dot" (because the regex means "word boundary followed by a \'d\'") while <code class="regex">d\\b</code> matches the "d" in "Odd" ("d" followed by a word boundary).',
      targetRegex: /\bword\b/g,
      cases: [
        'words are odd',
        'word boundaries',
        'not-a-word',
        'not a buzzword',
      ]
    },
    {
      title: 'Anchors III - <code class="regex">\\B</code>',
      description: 'Conventionally, <code class="regex">\\B</code> is the inverted version of <code class="regex">\\b</code>. <code class="regex">\\B</code> anchors to positions that is not a word boundary (either positions between two alphanumeric characters or two non-alphanumeric characters).',
      targetRegex: /\Bo/g,
      cases: [
        'words are odd',
        'word boundaries',
        'not-a-word',
        'not a buzzword',
      ]
    },
    {
      title: 'Capture Groups I - <code class="regex">()</code>',
      description: '<code class="regex">()</code> is a useful token that does 2 things: capturing and grouping. We will first cover grouping. Grouping means combining multiple units into one so that you can use quantifiers on that unit as a whole. For example, <code class="regex">abc+</code> matches "abccc" while <code class="regex">(abc)+</code> matches "abcabcabc".<br><br>Ignore the <mark class="target-highlight"><mark class="target-group-highlight">capture groups</mark></mark> markup for now. They are related to capturing.',
      targetRegex: /(aaab)+/g,
      cases: [
        'aaabaaab',
        'aaabaaa',
        'aaaaaabaaabaaab',
        'baaabaaa',
      ]
    },
    {
      title: 'Capture Groups II - <code class="regex">(())</code>',
      description: '<code class="regex">()</code> is very versatile. You can use any tokens (character classes, quantifiers, etc) inside <code class="regex">()</code>. You can even nest <code class="regex">()</code>. For example, <code class="regex">(a{3}b){2}</code> matches "aaabaaab" and <code class="regex">((a{3}b){2}#){2}</code> matches "aaabaaab#aaabaaab#".',
      targetRegex: /((<\w+>)+#)+/g,
      cases: [
        '<apple><orange>#<banana><berry>#',
        '<berry><banana><apple>#<orange>#',
        '<abc>#<def><ghi>#<jkl>#',
        '#<berrybanana>#<appleorange>',
      ]
    },
    {
      title: 'Capture Groups III - <code>()</code>',
      description: 'Now let\'s explore the capturing property of <code class="regex">()</code>. Sometimes when you are matching a string, besides the entire match, you may also want to extract subpatterns in the match. For example, besides matching an entire URL, you may also want to extract the protocol, domain name and path of each URL. You can match the entire URL with a regex expression and extract these subpatterns with capture groups <code class="regex">()</code>.<br><br>More accurately, when there are capture groups in the regex expression, the regex engine returns what is matched in each <code class="regex">()</code> in addition to the entire match. For example, with the string "apple juice", <code class="regex">(\\w+) (juice)</code> matches the entire string "apple juice" and also returns "apple" and "juice" for the two <code class="regex">()</code> in the expression.<br><br>In this app, capture groups are marked with <mark class="target-highlight"><mark class="target-group-highlight">dotted lines and a darker shade</mark></mark>. Your regex expression not only has to match the entire pattern, but also has to match the correct capture groups to pass (by matching the locations of the <mark class="input-highlight"><mark class="input-group-highlight">dotted line markups</mark></mark>).',
      targetRegex: /(\w+) has (\w+)\./g,
      cases: [
        'Tom has something.',
        'Jerry has everything.',
        'Peter has nothing.',
        'Mary has a thing.',
      ]
    },
  ]
};

export { quickRegex as default };