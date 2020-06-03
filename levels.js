var quickRegex = {
  savedState: {
    currentLevel: 0,
    levelStates: []
  },
  levels: [
    {
      title: 'Introduction',
      description: 'Regular expressions are patterns used to match character combinations in strings. Without special characters, Regex simply search for matching strings. Type <code>apple</code> below to search for all instances of "apple".',
      targetRegex: /apple/g,
      cases: [
        'This is an apple.',
        'They want apples.',
        'Do you like apples?',
        'Put the apple on the table.',
      ]
    },
    {
      title: 'Character Classes',
      description: '<code>[]</code> specifies a range of characters that can be matched. For example, <code>[a-z]</code> matches a character from a to z and <code>[A-E]</code> matches "A", "B", "C", "D" and "E".',
      targetRegex: /[A-Z]/g,
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'Do You Like Apples?',
        'Put The Apple On The Table.',
      ]
    },
    {
      title: 'Character Classes II',
      description: '<code>[]</code> can also specify characters other than alphabets. Simply put all the characters that you want to match inside the brackets. E.g. <code>[.!?]</code> matches ".", "!" and "?". <code>[a-zA-Z0-9]</code> matches all alphanumeric characters.',
      targetRegex: /[a-z.?]/g,
      cases: [
        'This Is An Apple.',
        'They Want Apples.',
        'Do You Like Apples?',
        'Put The Apple On The Table.',
      ]
    },
  ]
};