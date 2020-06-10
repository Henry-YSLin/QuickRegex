let quickRegex = {
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
      title: 'Character Classes I - <code class="regex">[ ]</code>',
      description: '<code class="regex">[ ]</code> specifies a range of characters that can be matched. For example, <code class="regex">[a-z]</code> matches a character from a to z and <code class="regex">[A-E]</code> matches "A", "B", "C", "D" and "E".',
      targetRegex: /[A-Z]/g,
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'Do You Like Apples?',
        'Put The Orange On The Table.',
      ]
    },
    {
      title: 'Character Classes II - <code class="regex">[ ]</code>',
      description: '<code class="regex">[ ]</code> can also specify characters other than alphabets. Simply put all the characters that you want to match inside the brackets. e.g. <code class="regex">[.!?]</code> matches ".", "!" and "?". <code class="regex">[a-zA-Z0-9]</code> matches all alphanumeric characters. <code class="regex">[A-Z?!]</code> matches "A" to "Z" and "!", "?"',
      targetRegex: /[a-eF-I!@]/g,
      cases: [
        '0123456789',
        'abcdefghi',
        'ABCDEFGHI',
        '!@#$%^&*',
      ]
    },
    {
      title: 'Inverted Character Classes - <code class="regex">[^ ]</code>',
      description: 'You can also invert character classes by using <code class="regex">[^ ]</code>. <code class="regex">[^abc]</code> means not "a" or "b" or "c", while <code class="regex">[^0-9]</code> matches all characters except digits.',
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
      description: 'Another useful shorthand is <code class="regex">\\s</code>. It matches any whitespace character. Note that whitespace character includes all kinds of whitespace, not just the normal space character that is typed with the spacebar.<br><br>If you simply type a space in the regex box, you will notice that not all spaces are matched. This is because some space characters are special.',
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
      description: 'These shorthands can also be inverted. Simply write them in upper case for the inverted version. e.g. <code class="regex">\\D</code> matches anything that is not a digit. <code class="regex">\\W</code> matches any non-alphanumeric character. <code class="regex">\\S</code> matches any non-whitespace character.',
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
      description: 'You may have noticed by now that, since <code class="regex">.</code> has a special meaning, you cannot match a fullstop just by typing <code>.</code>. To fix this problem, prepend a backslash <code>\\</code> to the dot to escape the <code class="regex">.</code> token. i.e. <code class="regex">\\.</code> matchs a fullstop only. To match the backslash itself, prepend it with another backslash.',
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
      description: 'Quantifiers specify how many times a phrase repeats. It is useful for denoting optional phrases or matching repeating phrases. To specify a quantifier, add <code>{...}</code> after a phrase. Write a number inside <code>{}</code> to specify the number of times the phrase repeats. e.g. <code class="regex">a{3}</code> matches "aaa".<br><br>Note that quantifiers only apply to as few tokens as possible, which means <code class="regex">ab{2}</code> matches "abb", not "aabb" or "abab"',
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
      description: 'You can also specify 2 numbers, separated by a comma, inside <code>{}</code> to denote a range of possible number of times a phrase can repeat. e.g. <code class="regex">#{1,5}</code> matches anything from "#" to "#####". Omit the second number to allow the phrase to repeat an infinite number of times. e.g. <code class="regex">@{1,}</code> matches "@@@" or "@@@@@@@@@@".<br><br>Note that you cannot put a space anywhere inside <code>{}</code>',
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
      description: '<code>?</code> is equivalent to <code>{0,1}</code><br><code>*</code> is equivalent to <code>{0,}</code><br><code>+</code> is equivalent to <code>{1,}</code><br>e.g. <code class="regex">a+b?</code> matches "ab", "aab" and "aa"<br><code class="regex">a*b*</code> matches "aaa", "aaabbb" and "bbb".',
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
      description: 'When you specify a range of possible numbers for a quantifier, the regex engine can sometimes choose to match a longer or shorter phrase. For example, running <code class="regex">a{2,3}</code> on the string "aaa" can return "aa" or "aaa" as a match. By default, the regex engine is "greedy", which means it tries to match as long as possible. To change this behavior to "lazy" (match as short as possible), add a <code>?</code> after quantifiers. e.g. for the string "aaabbb", <code class="regex">a*b+</code> matches "aaabbb" while <code class="regex">a*b+?</code> matches "aaab".<br><br>Note that one <code>?</code> will be treated as a <code>{0,1}</code> quantifier. Use <code>??</code> for the lazy <code>{0,1}</code> quantifier.',
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
      description: 'Up until this point, your regex can match phrases in any part of a string. To limit where the matches occur, anchors can be added to the expression to sepcify positions in a string. For example, <code>^</code> anchors the match to the start of the string and <code>$</code> anchors the match to the end. i.e. <code class="regex">^aaa</code> matches "aaabbb" but not "bbbaaa", while <code class="regex">aaa$</code> matches "bbbaaa" but not "aaabbb". <code class="regex">^aaa$</code> only matches "aaa".<br><br>Type any anchors into the regex box below to see where they anchors to.',
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
      title: 'Capturing Groups I - <code class="regex">( )</code>',
      description: '<code class="regex">()</code> is a useful token that does 2 things: capturing and grouping. We will first cover grouping. Grouping means combining multiple units into one so that you can use quantifiers on that unit as a whole. For example, <code class="regex">abc+</code> matches "abccc" while <code class="regex">(abc)+</code> matches "abcabcabc".<br><br>Ignore the <mark class="target-highlight"><mark class="target-group-highlight">capturing groups</mark></mark> markup for now. They are related to capturing.',
      targetRegex: /(?:aaab)+/g,
      cases: [
        'aaabaaab',
        'aaabaaa',
        'aaaaaabaaabaaab',
        'baaabaaa',
      ]
    },
    {
      title: 'Capturing Groups II - <code class="regex">(( ))</code>',
      description: '<code class="regex">()</code> is very versatile. You can use any tokens (character classes, quantifiers, etc) inside <code class="regex">()</code>. You can even nest <code class="regex">()</code>. For example, <code class="regex">(a{3}b){2}</code> matches "aaabaaab" and <code class="regex">((a{3}b){2}#){2}</code> matches "aaabaaab#aaabaaab#".',
      targetRegex: /(?:(?:<\w+>)+#)+/g,
      cases: [
        '<apple><orange>#<banana><berry>#',
        '<berry><banana><apple>#<orange>#',
        '<abc>#<def><ghi>#<jkl>#',
        '#<berrybanana>#<appleorange>',
      ]
    },
    {
      title: 'Capturing Groups III - <code class="regex">( )</code>',
      description: 'Now let\'s explore the capturing property of <code class="regex">()</code>. Sometimes when you are matching a string, besides the entire match, you may also want to extract subpatterns in the match. For example, besides matching an entire URL, you may also want to extract the protocol, domain name and path of each URL. You can match the entire URL with a regex and extract these subpatterns with capturing groups <code class="regex">()</code>.<br><br>More accurately, when there are capturing groups in the regex, the regex engine returns what is matched in each <code class="regex">()</code> in addition to the entire match. For example, with the string "apple juice", <code class="regex">(\\w+) (juice)</code> matches the entire string "apple juice" and also returns "apple" and "juice" for the two <code class="regex">()</code> in the expression.<br><br>In this app, capturing groups are marked with <mark class="target-highlight"><mark class="target-group-highlight">dotted lines and a darker shade</mark></mark>. Your regex not only has to match the entire pattern, but also has to match the correct capturing groups to pass (by matching the locations of the <mark class="input-highlight"><mark class="input-group-highlight">dotted line markups</mark></mark>).',
      targetRegex: /(\w+) has (\w+)\./g,
      cases: [
        'Tom has something.',
        'Jerry has everything.',
        'Peter has nothing.',
        'Mary has a thing.',
      ]
    },
    {
      title: 'Capturing Groups IV - <code class="regex">( )</code>',
      description: 'If you are using quantifiers to repeat a capturing group, only the last match of the capturing group will be returned. For example, with the string "a b c ", <code class="regex">(\\w )+</code> only returns "c " for the capturing group. To return the entire repeated match, wrap the regex with another <code class="regex">()</code>, i.e. <code class="regex">((\\w )+)</code>. The outer <code class="regex">()</code> will then return "a b c ".',
      targetRegex: /\^((?:\w )+)\$/g,
      cases: [
        '^a b c $',
        '^x y z $',
        '^1 4 3 6 8 $',
        '^g $',
      ]
    },
    {
      title: 'Non-capturing Groups - <code class="regex">(?: )</code>',
      description: 'It takes extra computation for the regex engine to return data captured by capturing groups. If you only wants to group several units and don\'t care about the data captured, you can use a non-capturing group <code class="regex">(?: )</code> instead. Simply add <code>?:</code> right after the opening bracket <code>(</code> for a non-capturing group. Strings matched in non-capturing groups will not be returned by the engine, but these groups are otherwise the same as capturing groups. e.g. you can still use quantifiers on these groups.',
      targetRegex: /(?:aaab)+/g,
      cases: [
        'aaabaaab',
        'aaabaaa',
        'aaaaaabaaabaaab',
        'baaabaaa',
      ]
    },
    {
      title: 'Alternation I - <code class="regex"> |</code>',
      description: 'The alternation operator <code class="regex"> |</code> allows multiple options to be specified when matching a string. It essentially functions as an "or" operator. e.g. <code class="regex">a|b</code> matches "a" or "b", while <code class="regex">apple|banana|orange</code> matches "apple", "banana" or "orange". You can chain as many options as you want.<br><br>Note that the operator applies to as many units as possible on both sides, which is different from quantifiers which apply to one unit only. e.g. <code class="regex">foo|bar</code> matches "foo" or "bar", but doesn\'t match "fooar" or "fobar". To limit the operator\'s range, enclose it with a group. e.g. <code class="regex">fo(o|b)ar</code> matches "fooar" and "fobar". Of course, you can also use a non-capturing group to do so: <code class="regex">fo(?:o|b)ar</code>.',
      targetRegex: /(?:ftp|http|smtp):\/\//g,
      cases: [
        'ftp://',
        'http://',
        'smtp://',
        'weird://',
      ]
    },
    {
      title: 'Alternation II - <code class="regex"> |</code>',
      description: 'When multiple options specified by the <code class="regex"> |</code> can be matched, the regex engine will choose one to match. For example, with the string "foobar", <code class="regex">foo|foobar</code> can match either "foo" or "foobar".<br><br>Different regex flavors have different rules for choosing an option in this case. Some follow the "greedy" rule, which means that these flavors will choose the option that will result in the longest match (i.e. these flavors will choose to match "foobar" since it\'s longer). Others may follow the order specified in the expression, which means that when multiple options are available, the leftmost one will be chosen (i.e. "foo" will be matched since it comes first). Check the documentation of the regex engine you use for details.<br><br>In this app, which uses the JavaScript regex flavor, the latter rule is followed, which means that the leftmost option will be chosen.',
      targetRegex: /www\.abc\.com:(8080|80|443)/g,
      cases: [
        'www.abc.com:80',
        'www.abc.com:8080',
        'www.abc.com:443',
        'www.abc.com:20',
      ]
    },
    {
      title: 'Lookaround',
      description: 'The default anchors provided (<code class="regex">\\b</code> <code class="regex">\\B</code> <code class="regex">^</code> <code class="regex">$</code> and a few other custom ones provided by different regex flavors) are very general and may not suit specific needs. Lookaround allows you to create more specific custom anchors. "Lookaround" is a collective term for positive/negative lookahead and positive/negative lookbehind. Since lookaround can be complex at times and have several caveats, its explanation will be split into several lessons.',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Lookaround - Positive/Negative Lookahead I - <code class="regex">(?= )</code> <code class="regex">(?! )</code>',
      description: 'We will first cover positive/negative lookahead.<br>Positive lookahead <code class="regex">(?= )</code> instructs the regex engine to only match the rest of the expression if what\'s in front matches the expression inside <code class="regex">(?= )</code>. For example, <code class="regex">app(?=le)</code> matches "app" in "apple" since "le" is in front of "app", but it doesn\'t match "app" in "apply" since the string in front of "app" this time is "ly", not "le".<br>Conversely, negative lookbehind only matches the rest of the expression if what\'s in front does not match the expression inside <code class="regex">(?! )</code>. Using the same example above, <code class="regex">app(?!le)</code> matches "app" in "apply" but not "app" in "apple".<br><br>See lookahead in action by trying out some regexes below. You may try <code class="regex">[a-z]+(?= juice)</code>&emsp;<code class="regex">[a-z]+( juice)</code>&emsp;<code class="regex">[a-z]+(?: juice)</code>&emsp;<code class="regex">(?!juice)</code> or some other regexes you can think of. Click next when you are ready to move on.',
      targetRegex: null,
      cases: [
        'apple juice',
        'orange juice',
        'juice and water',
        'juicy apple',
      ]
    },
    {
      title: 'Lookaround - Positive/Negative Lookahead II - <code class="regex">(?= )</code> <code class="regex">(?! )</code>',
      description: 'In the previous lesson, you may notice that <code class="regex">[a-z]+(?= juice)</code>&emsp;<code class="regex">[a-z]+(?: juice)</code> both matches "apple juice" and "orange juice", but the former matches "apple" and "orange" only while the latter matches the entire phrase. This is because a non-capturing group <code class="regex">(?: )</code> does not return group captures, but still counts towards the full match, causing "juice" to also be highlighted. In contrast, a lookaround (positive lookahead <code class="regex">(?= )</code> in this case) is not only non-capturing, but also doesn\'t count towards a full match. The regex engine executes the expression inside <code class="regex">(?= )</code> and then simply throw away the match, only storing whether the match is successful for further processing.',
      targetRegex: /\w+ (?!pie)/g,
      cases: [
        'apple pie',
        'strawberry pie',
        'apple juice',
        'banana cake',
      ]
    },
    {
      title: 'Lookaround - Positive/Negative Lookahead III - <code class="regex">(?= )</code> <code class="regex">(?! )</code>',
      description: 'Here are a few points to note regarding lookahead:<br><br>Capturing: Although lookahead is non-capturing by itself, you can capture what\'s being matched in a lookahead by nesting a <code class="regex">()</code> inside a lookahead. i.e. <code class="regex">apple (?=(juice))</code> will return "juice" as a capture when the regex matches. Note that in this case, the full match is "apple ", and the capture group is "juice", which lies outside the full match. Also be aware of the nesting order - <code class="regex">((?=juice))</code> will not return a capture since the match inside the lookahead is already discarded by the time it reaches the capturing group <code class="regex">()</code>.<br><br>Nesting: You can nest lookarounds. For example, <code class="regex">\\w+(?= (?!pie))</code> matches any word where the next word isn\'t "pie" (e.g. it matches "apple" in "apple juice").<br><br>Quantifying: Depending on the regex flavor, lookarounds can sometimes be considered quantifiable (i.e. you may use quantifiers after lookarounds). The JavaScript flavor that this app uses allows quantifying lookarounds in some browsers. Note that, since lookarounds do not match strings themselves, repeating them with quantifiers like <code>+</code> is meaningless. The only useful quantifiers are <code>?</code> and <code>*</code>, which behave the same and make the lookarounds optional. This behavior is not consistent though. You should check the documentation of the regex engine before using it.<br><br>Hint: In the exercise below, match the first word only if the third word doesn\'t contain "apple".',
      targetRegex: /^\w+(?= \w+ (?!\w*apple\w*))/g,
      cases: [
        'two more apples',
        'one new pineapple incoming',
        'seven oranges in the box',
        'a box of apples',
      ]
    },
    {
      title: 'Lookaround - Positive/Negative Lookbehind I - <code class="regex">(?&lt;= )</code> <code class="regex">(?&lt;! )</code>',
      description: 'Positive and negative lookbehind works in a similar way as a lookahead. They are both non-capturing and do not contribute towards the full match. As the name suggests, lookbehind instructs the regex engine to look behind the current position to test for the presence or absence of a match specified by the expression inside the brackets.<br><br>Simply put, use <code class="regex">(?&lt;= )</code> to assert the presence of something behind current position. Use <code class="regex">(?&lt;! )</code> to assert the absence of it.',
      targetRegex: /(?<=^apple )pie/g,
      cases: [
        'apple pie',
        'strawberry pie',
        'pineapple pie',
        'banana pie',
      ]
    },
    {
      title: 'Lookaround - Positive/Negative Lookbehind II - <code class="regex">(?&lt;= )</code> <code class="regex">(?&lt;! )</code>',
      description: 'Similar to lookaheads, lookbehinds are non-capturing but their contents can be captured with <code class="regex">()</code>. They can also be nested and quantified in some cases.<br><br>However, there is a big difference between what you can put inside lookbehinds and lookaheads. In lookaheads <code class="regex">(?= )</code> <code class="regex">(?! )</code>, you are free to put anything inside them, but in lookbehinds <code class="regex">(?&lt;= )</code> <code class="regex">(?&lt;! )</code>, many regex flavors impose a restriction that what\'s inside must have a fixed length. This is because most engines need to figure out how many characters to step back before executing the expression inside the lookbehind. This means that quantifiers like <code>*</code> <code>?</code> are not allowed, and if you are using alternation <code class="regex"> |</code>, all options must be of the same length.<br><br>This fixed-length lookbehind rule applies to flavors such as PCRE and python re. For some other flavors, such as Java regex, a finite maximum length must be known (e.g. by specifying the second number in <code>{#,#}</code>). For a few flavors, like the JavaScript flavor implemented by most browsers and the .NET Framework Regex, full variable-length expression is allowed in lookbehind, so you can use quantifiers like <code>*</code> and <code>+</code> freely.',
      targetRegex: /(?<=\(\?:).+(?=\))/g,
      cases: [
        '^(?:test)$',
        'one(?: more )apple',
        'one(?! more )apple',
        'one(?:)apple',
      ]
    },
    {
      title: 'Named Capturing Group - <code class="regex">(?&lt;name&gt; )</code>',
      description: 'As introduced before, the regex engine returns data from capturing groups in addition to the full match. Usually, the engine returns an array for each match, with the zeroth element being the full match and the rest being capturing groups. For example, with the string "a b c", <code class="regex">(\\w) (\\w) (\\w)</code> returns ["a b c","a","b","c"]. Each capturing group is given a number, counting from 1, corresponding to the index of their data in the array. This number is decided by the location of the capturing group\'s opening bracket <code>(</code>. The group with the leftmost <code>(</code> gets the smallest number, 1. e.g. in <code class="regex">(a(bc)d)e(f)</code>, the first group returns "abcd", the second one "bc", and the third one "f".<br><br>This numbering scheme can be confusing when the regex is complex, and editing groups may cause all group numbers to be changed. To avoid this situation, you may use names to identify groups. Named capturing groups <code class="regex">(?&lt;name&gt; )</code> function the same as normal capturing groups, but their capture results can be accessed through their names instead of their group index. For example, in JavaScript, instead of using <code>match[1]</code>, you may use <code>match.groups.groupName</code>. Group names must consist of alphanumeric characters and underscore <code>_</code> only. Named capturing groups still count towards the group index, so you can still access them with indices if necessary.<br><br>Try naming the capturing group below "areaCode".',
      targetRegex: /(\+\d+)\D.*/g,
      cases: [
        '+1-202-555-0122',
        '+44 1632 960982',
        '+1-613-555-0167',
        '+999876543',
      ]
    },
    {
      title: 'Backreferences I - <code class="regex">( )\\1</code> <code class="regex">(?&lt;name&gt; )\\k&lt;name&gt;</code>',
      description: 'Sometimes, you may want the regex to only match a string if the same phrase appears twice in the string. For example, you may want an HTML tag to only be matched if the end tag matches the start tag. This can be achieved by backreferencing. A backreferencing token can be created by specifying the group index n: <code>\\n</code> or specifying the group name for named capturing groups: <code>\\k&lt;name&gt;</code>. This token matches the exact same string as what is most recently matched by the referenced capturing group. For example, with the regex <code class="regex">(\\w)\\1</code>, if <code class="regex">(\\w)</code> matches "a", then <code class="regex">\\1</code> will also match "a", causing the regex to always match pairs of the same character. Note that the token only matches the exact string of what is recently matched by the capturing group. It does not reevaluate the expression inside the group, so <code class="regex">(\\w)\\1</code> matches "aa" but not "ab", even though "b" can be matched with <code class="regex">\\w</code>.',
      targetRegex: /<(\w+)>\.\.\.<\/\1>/g,
      cases: [
        '<a>...</a>',
        '<html>...</html>',
        '<div>...</div>',
        '<p>...</a>',
      ]
    },
    {
      title: 'Backreferences II - <code class="regex">( )\\1</code> <code class="regex">(?&lt;name&gt; )\\k&lt;name&gt;</code>',
      description: 'You can use multiple backreferencing tokens referring to the same capturing group in the regex. e.g. <code class="regex">(\\w)\\1\\1\\1</code><br><br>If you are using the group index syntax <code class="regex">\\1</code>, make sure that the number is referring to an existing group, or else the regex engine will interpret it as a special character sequence, producing unexpected results.<br><br>Although you can place a backreferencing token anywhere in the regex, it is meaningless to put it before the referenced capturing group. Since the token matches what is most recently matched by the group, and the group hasn\'t even been executed once when the regex engine sees the backreferencing token, the token always matches an empty string, which succeeds every time. e.g. <code class="regex">\\1(\\w)</code> matches "a" since <code class="regex">\\1</code> matches an empty string and <code class="regex">(\\w)</code> matches "a".<br><br>Quantifiers can "cooperate" with backreferencing tokens when matching. For example, with the string "aaaaaa" and the regex <code class="regex">(\\w+)\\1</code>, the <code>+</code> inside the capturing group wants to match as much as possible, hence it should try to match "aaaaaa", causing <code class="regex">\\1</code> to also try and match "aaaaaa" and fail the whole match (since the regex should be matching 12 "a"s in total). However, the regex actually successfully matches the string, since the <code>+</code> quantifier cooperates with the token and matches "aaa" only, allowing <code class="regex">\\1</code> to also match "aaa", resulting in a successful match.',
      targetRegex: /\w+\.(?:\w+)(?:,\w+\.(?:txt|png)){2}/g,
      cases: [
        'a.txt,b.txt,c.txt',
        'pic.png,pic2.png,pic3.png',
        'pic.jpg,pic2.bmp,pic3.gif',
        'doc.doc,doc2.docx,doc3.gdoc',
      ]
    },
    {
      title: 'Flags',
      description: 'Besides editing the regex, you can also specify different toggles, or "flags", to change how the regex engine behaves. Common flags include:<br><code>g</code> - global<br><code>m</code> - multiline<br><code>i</code> - insensitive<br><code>s</code> - singleline<br><br>There are different ways to specify these flags, depending on the programming language you use. For instance, in JavaScript, you may append these flags after the regex, which is wrapped in <code>/</code>. e.g. <code>/</code><code class="regex">^\\w+$</code><code>/gm</code>. In C#, you may specify the flags verbosely: <code>RegexOptions.IgnoreCase | RegexOptions.Multiline</code>, or append them in front of the regex: <code>(?im)</code><code class="regex">^\\w+$</code><br><br>The commonly-used flags will be introduced in the following lessons.',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Flags - Global - <code>g</code>',
      description: 'The first flag is global <code>g</code>. This simply tells the regex engine to continue searching for matches after it finds the first one. Without the <code>g</code> flag, the engine will only return at most 1 match for each string input.<br><br>This app has been using the <code>g</code> flag for all exercises. The testing area below has the <code>g</code> flag disabled for you to experiment with it. Click next when you are done.',
      targetRegex: null,
      explicitFlags: '',
      cases: [
        'a.txt,b.txt,c.txt',
        'pic.png,pic2.png,pic3.png',
        'pic.jpg,pic2.bmp,pic3.gif',
        'doc.doc,doc2.docx,doc3.gdoc',
      ]
    },
    {
      title: 'Flags - Multiline - <code>m</code>',
      description: 'The second flag is multiline <code>m</code>. This makes the anchors <code class="regex">^</code> and <code class="regex">$</code> match the start and end of a line instead of the start and end of the whole string. This is particularly useful when you are dealing with some multiline text like logs where each line is a separate entry.<br><br>The testing area below has the flags <code>gm</code>.',
      targetRegex: null,
      explicitFlags: 'gm',
      cases: [
        'First line\nSecond line\nThird line',
        '1st line\n2nd line\n3rd line',
        'Line 1\nLine 2',
        '1:\n2:\n3:',
      ]
    },
    {
      title: 'Flags - Insensitive - <code>i</code>',
      description: 'The third flag is insensitive <code>i</code>. This simply makes the entire regex case-insensitive.<br><br><code>gi</code> flags are enabled here.',
      targetRegex: null,
      explicitFlags: 'gi',
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'DO YOU LIKE APPLES?',
        'PuT ThE oRaNGe oN thE TaBlE.',
      ]
    },
    {
      title: 'Flags - Singleline - <code>s</code>',
      description: 'The fourth flag is singleline <code>s</code>. This makes the dot <code class="regex">.</code> match newline characters. When combined with the <code>m</code> flag, <code class="regex">^.*$</code> matches the entire string across multiple lines.<br><br><code>gs</code> is set here.',
      targetRegex: null,
      explicitFlags: 'gs',
      cases: [
        'First line\nSecond line\nThird line',
        '1st line\n2nd line\n3rd line',
        'Line 1\nLine 2',
        '1:\n2:\n3:',
      ]
    },
    {
      title: 'Additional Flags',
      description: 'There are also other flags provided by individual regex flavors. e.g.:<br><br>The Javascript flavor provides the sticky flag <code>y</code> which only proceeds to the next match if it immediately follows the previous match.<br>The PCRE flavor provides a <code>U</code> flag which makes all quantifiers lazy by default.<br>The Python flavor provides an ascii flag <code>a</code> which matches ASCII characters only.<br><br>There are a lot more flags in each flavor that are not covered here. Check their documentations for details.',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Additional Features',
      description: 'Recursion: Some regex flavors, such as PCRE, have a recursion token that takes the expression from another capturing group and reevaluate it at the token\'s position. This is like using a backreferencing token, but actually reevaluating the expression instead of simply matching the resulting capture.<br>For example, in PCRE, the token <code>(?R)</code> reevaluate the entire regex at the token\'s position. This enables some advanced matching, such as matching strings with balanced opening and closing brackets and finding the corresponding end tag given the start tag in HTML.<br>In PCRE, with the regex <code>&lt;(?&lt;tag&gt;\\w+)&gt;((?R)|\\w+)&lt;\\/(\\k&lt;tag&gt;)&gt;</code>, the outer starting and closing "div" in "&lt;div&gt;&lt;div&gt;abc&lt;/div&gt;&lt;/div&gt;" can be captured.<br><br>Balancing groups: The .NET flavor has a unique function called balancing groups which can achieve similar goals as the recursion token in PCRE. The documentation of balancing groups can be found <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/grouping-constructs-in-regular-expressions?redirectedfrom=MSDN#balancing_group_definition" target="_blank">here</a>.<br><br>Conditional statements: Some flavors implements conditional statements <code>(?(condition)yes|no)</code>, which means if "condition" matches, use "yes" to match the rest of the string, otherwise use "no".<br><br>Substitution: Many regex flavors also provide a "replace" function in addition to "match". The replace function uses a regex to find parts of the string and then replaces them with a specified expression. That expression can use captured data from the regex to make smart replacements. e.g. <code class="regex">"(\\w+)"</code> searches for words wrapped with <code>"</code>, then <code>\'$1\'</code> replaces the double quotes with single quotes while keeping the word intact.<br><br>Atomic groups: As mentioned in Backreferences II, quantifiers can cooperate with other tokens to yield a match by giving back characters or expanding their matches as needed. This behavior can be disabled by putting the quantifiers inside an atomic group <code>(?&gt; )</code>, which is a unique syntax in some regex flavors. The atomic group allows quantifiers inside to take the highest priority, ignoring the other tokens outside the atomic group. e.g. <code>(?&gt;(\\w+))\\1</code> does not match "aaaaaa" since <code>(\\w+)</code> is inside an atomic group, causing <code>+</code> to match the entire string, ignoring the fact that it causes <code>\\1</code> to fail.<br>In fact, lookarounds are also atomic. If you wrap a capturing group inside a lookaround, the capturing group will ignore tokens outside the lookaround. e.g. <code class="regex">(\\d+)\\w+\\1</code> matches "123x12" but <code class="regex">(?=(\\d+))\\w+\\1</code> does not, since <code class="regex">\\d+</code> now matches "123", ignoring the fact that <code class="regex">\\1</code> can match "12" only, not "123".',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Useful Sites',
      description: 'Regex is notorious for its low readability, but there are great tools online that can help you build, test and debug regex painlessly.<br><br><a href="https://regex101.com/" target="_blank"><h3>Regex101</h3></a>Features:<br>PCRE, JavaScript, Python and Golang flavors supported<br>Regex explanation<br>Quick reference<br>Regex quiz<br>Cloud save<br><br><a href="https://regexr.com/" target="_blank"><h3>RegExr</h3></a>Features:<br>PCRE and JavaScript flavors supported<br>Regex explanation<br>Quick reference<br>Community regex database<br>Cloud save<br><br><a href="https://www.debuggex.com/" target="_blank"><h3>Debuggex</h3></a>Features:<br>PCRE, JavaScript and Python flavors supported<br>Graphical regex representation<br>Quick reference<br>Regex library',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Challenges',
      description: 'You have learned most, if not all, of the common regex tokens. Now it\'s time to put the knowledge to good use in the following series of challenges. Some of these challenges may require you to write relatively complex regex, but none requires knowledge outside of what is taught here. If you need a quick refresher of the meaning of some tokens, click on the related lesson on the navigation bar on the left. Good luck and don\'t give up!',
      targetRegex: null,
      cases: []
    },
    {
      title: 'Challenge I - Logs',
      description: 'Logs are messages auto-generated by an application to record certain events. Logs usually have a fixed structure, hence it is very easy to extract info from logs using regex.<br><br>In the example below, capture the timestamp, category and message of each line of the log. The format is <code>[timestamp] category: message</code>.',
      targetRegex: /^\[(.+)\] ([\w ]+): (.*)$/g,
      cases: [
        '[2020.06.10 08:40:44] App Info: reading settings...',
        '[2020.06.10 08:40:44] Font: laoded from \':/gui/fonts/font.ttf\'',
        '[2020.06.10 08:40:48] Message Info: bad message notification received, msgId 748923649781236, error_code 33',
        '[2020.06.10 08:40:45] Audio Capture Devices: Microphone (Example Audio)',
        '[2020.06.10 08:40:45] Export Info: Destroy top bar by controller removal',
        '[2020.06.10 08:40:43] App Info: Log started',
      ]
    },
    {
      title: 'Challenge II - URLs',
      description: 'URLs may look complex to the human eye, but it is actually very easy to extrat information from URLs using regex due to its clear format.<br><br>Write a regex that matches valid URLs and capture the protocol, domain name, port, path and queries. The format of a URL is <code>protocol://domain.name:port/path/to/file.html?query</code>',
      targetRegex: /^(https?|ftp):\/\/([\w._-]+?)(?::(\d+))?\/(.+?)?(?:\?(.*))?$/g,
      cases: [
        'https://www.google.com/',
        'ftp://www.amazingftp.net/path/to/your/file.txt',
        'http://unsafe-website99.io:8080/index.html?password=pas$word',
        'abc://no_such_protocol.com/',
        'http://invalid$char.com/',
        'http://wrong-port.com:abc123/',
        'not a url at all',
        'nope http://abc.com/',
      ]
    },
    {
      title: 'Challenge III - Number Formats',
      description: 'Numbers can be a lot more complex than simply a bunch of digits. In this challenge, you need a regex that can match numbers in decimal (e.g. 123,456.78), scientific notation (e.g. 1.2e-9) and hexadecimal forms (0x####).',
      targetRegex: /^(?:-?(?:\d+,)?\d+(?:\.\d+)?(?:e-?\d+)?|0x[0-9a-f]+)$/g,
      cases: [
        '123,456.78',
        '123.456',
        '0.123',
        '12e3',
        '-12e-4',
        '-32.5e-3',
        '0x5aed3c',
        '0x33492d',
        '0x3kd3o5',
        '12E34',
        '12A34',
        '123.456,123',
      ]
    },
    {
      title: 'Challenge IV - Date Formats',
      description: 'Many programming languages provide parsers to convert a string into a date, but if there is no such thing provided or if the date is buried in a ton of unrelated text, regex can help you quickly locate and match the date.<br><br>In the exercise below, match all dates in the format dd-mm-yyyy or dd/mm/yyyy and capture the day, month and year. Note that the two date separators must match and the day and month must be within range, which is the hard part since regex can\'t verify a numeric range directly.',
      targetRegex: /^(?:([0-2]?[0-9]|3[01])\/(1[0-2]|[0-9])\/(\d+)|([0-2]?[0-9]|3[01])-(1[0-2]|[0-9])-(\d+))$/g,
      cases: [
        '31/12/2099',
        '12/31/2099',
        '1/8/1934',
        '31-12-2013',
        '6/7/2020',
        '2-3/1946',
        '33-1-2000',
        '2/1-2000',
      ]
    },
    {
      title: 'Challenge V - Email Addresses',
      description: 'Email addresses may seem simple, but their specification is actually pretty complex. One feature in email addresses that you may not know about is plus addressing. You may use <code>username+filter@email.com</code> instead of <code>username@email.com</code> to refer to the same address, with the part after <code>+</code> functioning as a filter or a tag.<br><br>Capture the username and domain for valid email addresses in the following exercise.',
      targetRegex: /^([^ .+]+(?:\.[^ .+]+)*)(?:\+[^ +]*)?@([^ ]*)$/g,
      cases: [
        'tom.e@mail.net',
        'maryC092@mail.co.uk',
        'tom.e+spam@mail.org',
        'maryC092+filter@mail.co.uk',
        'support @company.com',
        'support@a bc.com',
        'abc..def@mail.com',
        'abc+fil ter@def.org',
      ]
    },
    {
      title: 'Challenge VI - HTML Tags',
      description: 'Because of the complex tree structure of HTML, it\'s usually not a suitable job for regex to parse HTML. However, if you don\'t want to install heavy HTML parsing library for a very small file, it is perfectly fine to use regex.<br><br>In the following exercise, capture the tag name, class list and content of valid HTML tags.',
      targetRegex: /^<(?<tag>\w+)(?: class="([\w -]+)"| \w+="[\w -]+"| \w+)*>(.*)<\/\k<tag>>$/g,
      cases: [
        '<h1>Welcome!</h1>',
        '<span class="regex editor center"><b>Click</b></span>',
        '<div contenteditable spellcheck="false" class="container"><div class="row"></div></div>',
        '<p hidden class="caption-large">Text</p>',
        '<i>Tag mismatch</b>',
        '<span class="xz>e">Invalid class</span>',
        '<i>No end tag',
        'No tag at all',
      ]
    },
    {
      title: 'Challenge VII - Regex',
      description: 'What\'s a better tool to parse regex than regex itself? Of course, balancing parentheses isn\'t a suitable job for regex without recursion or balancing groups, but there are still some tasks that regex can do.<br><br>In the following challenge, match all character classes, including their quantifiers if there are any. All cases provided are valid regexes so you don\'t need to worry about invalid syntax. Do watch out for escaped square brackets <code class="regex">\\[</code> <code class="regex">\\]</code>. You shouldn\'t treat those as openings and closings of character classes.',
      targetRegex: /(?<!\\)(?:\[.*?(?<!\\)\](?:(?:\?|\+|\*)\??)?)/g,
      cases: [
        '([--:\\w?@%&+~#=]*\\.[a-z]{2,4}\\/{0,2})((?:[?&](?:\\w+)=(?:\\w+))+|[--:\\w?@%&+~#=]+)?',
        '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
        '\\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\\b',
        '#?([\\da-fA-F]{2})([\\da-fA-F]{2})([\\da-fA-F]{2})',
        ',(?=(?:[^\\"]*\\"[^\\"]*\\")*(?![^\\"]*\\"))',
        '\\[[^\\[\\]]*?\\]',
        '\\[\\[?[^\\[\\]]*\\]?\\]',
        '.*^(?!.*www.*).*(\\n)',
      ]
    },
  ]
};

export default quickRegex;