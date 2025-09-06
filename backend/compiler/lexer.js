class Lexer {
  constructor(code) {
    this.code = code;
    this.pos = 0;
    this.tokens = [];
    this.keywords = ['int'];
    this.operators = ['+', '-', '*', '/', '=', ';', '(', ')'];
  }

  tokenize() {
    while (this.pos < this.code.length) {
      let char = this.code[this.pos];

      // Skip whitespace
      if (/\s/.test(char)) {
        this.pos++;
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

      // Operators
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
