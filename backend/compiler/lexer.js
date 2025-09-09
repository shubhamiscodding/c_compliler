class Lexer {
  constructor(code) {
    this.code = code;
    this.pos = 0;
    this.tokens = [];
    this.keywords = ['int', 'return', 'void', 'if', 'else', 'while', 'for'];
    this.operators = ['+', '-', '*', '/', '=', ';', '(', ')', '{', '}', '<', '>', ',', '#'];
    this.current_line = 1;
  }

  tokenize() {
    while (this.pos < this.code.length) {
      let char = this.code[this.pos];

      // Handle newlines for line counting
      if (char === '\n') {
        this.current_line++;
        this.pos++;
        continue;
      }

      // Skip whitespace
      if (/\s/.test(char)) {
        this.pos++;
        continue;
      }

      // Handle preprocessor directives
      if (char === '#') {
        let directive = '';
        this.pos++; // Skip the #
        while (this.pos < this.code.length && this.code[this.pos] !== '\n') {
          directive += this.code[this.pos++];
        }
        this.tokens.push({ type: 'preprocessor', value: '#' + directive.trim() });
        continue;
      }

      // Identifiers or keywords
      if (/[a-zA-Z]/.test(char)) {
        let word = '';
        while (this.pos < this.code.length && /[a-zA-Z0-9]/.test(this.code[this.pos])) {
          word += this.code[this.pos++];
        }
        if (this.keywords.includes(word)) {
          this.tokens.push({ type: 'keyword', value: word });
        } else {
          this.tokens.push({ type: 'identifier', value: word });
        }
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        let num = '';
        while (this.pos < this.code.length && /[0-9]/.test(this.code[this.pos])) {
          num += this.code[this.pos++];
        }
        this.tokens.push({ type: 'number', value: parseInt(num) });
        continue;
      }

      // String literals
      if (char === '"') {
        let str = '';
        this.pos++; // Skip opening quote
        while (this.pos < this.code.length && this.code[this.pos] !== '"') {
          if (this.code[this.pos] === '\\') {
            this.pos++; // Skip escape character
            switch(this.code[this.pos]) {
              case 'n': str += '\\n'; break;
              case 't': str += '\\t'; break;
              case '"': str += '\\"'; break;
              default: str += this.code[this.pos];
            }
          } else {
            str += this.code[this.pos];
          }
          this.pos++;
        }
        this.pos++; // Skip closing quote
        this.tokens.push({ type: 'string', value: str });
        continue;
      }

      // Operators and punctuation
      if (this.operators.includes(char)) {
        this.tokens.push({ type: 'operator', value: char });
        this.pos++;
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }
    return this.tokens;
  }
}

export default Lexer;
