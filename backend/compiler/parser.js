import { 
  Program, 
  VariableDeclaration, 
  BinaryExpression, 
  Identifier, 
  NumberLiteral 
} from './ast.js';

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse() {
    const statements = [];
    while (this.pos < this.tokens.length) {
      if (this.tokens[this.pos].type === 'keyword' && this.tokens[this.pos].value === 'int') {
        statements.push(this.parseVariableDeclaration());
      } else {
        throw new Error(`Unexpected token: ${this.tokens[this.pos].value}`);
      }
    }
    return new Program(statements);
  }

  parseVariableDeclaration() {
    this.consume('keyword', 'int');
    const identifier = this.consume('identifier').value;
    this.consume('operator', '=');
    const value = this.parseExpression();
    this.consume('operator', ';');
    return new VariableDeclaration(new Identifier(identifier), value);
  }

  parseExpression() {
    let left = this.parseTerm();
    while (this.pos < this.tokens.length && ['+', '-'].includes(this.tokens[this.pos].value)) {
      const operator = this.tokens[this.pos++].value;
      const right = this.parseTerm();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }

  parseTerm() {
    let left = this.parseFactor();
    while (this.pos < this.tokens.length && ['*', '/'].includes(this.tokens[this.pos].value)) {
      const operator = this.tokens[this.pos++].value;
      const right = this.parseFactor();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }

  parseFactor() {
    const token = this.tokens[this.pos];

    // Parentheses
    if (token.value === '(') {
      this.pos++;
      const expr = this.parseExpression();
      this.consume('operator', ')');
      return expr;
    }

    // Unary minus
    if (token.value === '-') {
      this.pos++;
      const factor = this.parseFactor();
      return new BinaryExpression('*', new NumberLiteral(-1), factor);
    }

    // Number literal
    if (token.type === 'number') {
      this.pos++;
      return new NumberLiteral(token.value);
    }

    // Identifier
    if (token.type === 'identifier') {
      this.pos++;
      return new Identifier(token.value);
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }

  consume(type, value) {
    const token = this.tokens[this.pos];
    if (!token || token.type !== type || (value && token.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ''}, got ${token ? token.value : 'EOF'}`);
    }
    this.pos++;
    return token;
  }
}

export default Parser;
