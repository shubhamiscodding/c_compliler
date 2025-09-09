import { 
  Program,
  PreprocessorDirective,
  FunctionDeclaration,
  ReturnStatement,
  FunctionCall,
  StringLiteral,
  NumberLiteral,
  VariableDeclaration,
  Identifier,
  IfStatement,
  BinaryExpression,
  BlockStatement,
  ForStatement,
  AssignmentStatement
} from './ast.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  consume(type, value = null) {
    const token = this.tokens[this.pos];
    if (!token) throw new Error('Unexpected end of input');
    if (token.type !== type) throw new Error(`Expected ${type} but got ${token.type}`);
    if (value !== null && token.value !== value) throw new Error(`Expected ${value} but got ${token.value}`);
    this.pos++;
    return token;
  }

  peek() {
    return this.tokens[this.pos];
  }

  parse() {
    const statements = [];
    while (this.pos < this.tokens.length) {
      const token = this.peek();
      
      if (token.type === 'preprocessor') {
        statements.push(this.parsePreprocessor());
      } else if (token.type === 'keyword') {
        if (token.value === 'int') {
          statements.push(this.parseFunctionOrVariable());
        } else {
          statements.push(this.parseStatement());
        }
      } else {
        throw new Error(`Unexpected token: ${token.value}`);
      }
    }
    return new Program(statements);
  }

  parsePreprocessor() {
    const directive = this.consume('preprocessor').value;
    return new PreprocessorDirective(directive);
  }

  parseFunctionOrVariable() {
    this.consume('keyword', 'int');
    const name = this.consume('identifier').value;
    
    // Check if it's a function
    if (this.peek().type === 'operator' && this.peek().value === '(') {
      this.consume('operator', '(');
      const params = [];
      
      // Parse parameters
      while (this.peek().type !== 'operator' || this.peek().value !== ')') {
        if (params.length > 0) {
          this.consume('operator', ',');
        }
        // Handle typed parameters like "int n"
        if (this.peek().type === 'keyword') {
          this.consume('keyword'); // consume type (int, void, etc.)
        }
        if (this.peek().type === 'identifier') {
          params.push(this.consume('identifier').value);
        }
      }
      this.consume('operator', ')');
      
      // Parse function body
      this.consume('operator', '{');
      const body = [];
      while (this.peek().type !== 'operator' || this.peek().value !== '}') {
        body.push(this.parseStatement());
      }
      this.consume('operator', '}');
      
      return new FunctionDeclaration(name, params, body);
    }
    
    // It's a variable declaration
    return this.parseVariableDeclaration(name);
  }

  parseStatement() {
    const token = this.peek();
    
    if (token.type === 'keyword') {
      switch (token.value) {
        case 'return':
          return this.parseReturnStatement();
        case 'if':
          return this.parseIfStatement();
        case 'for':
          return this.parseForStatement();
        case 'int':
          return this.parseVariableDeclarationStatement();
        default:
          throw new Error(`Unsupported keyword: ${token.value}`);
      }
    } else if (token.type === 'identifier') {
      // Check if it's a function call statement (with semicolon) or expression
      const name = this.consume('identifier').value;
      if (this.peek().type === 'operator' && this.peek().value === '(') {
        this.consume('operator', '(');
        const args = [];
        while (this.peek().type !== 'operator' || this.peek().value !== ')') {
          if (args.length > 0) {
            this.consume('operator', ',');
          }
          args.push(this.parseExpression());
        }
        this.consume('operator', ')');
        this.consume('operator', ';');
        return new FunctionCall(name, args);
      } else if (this.peek().type === 'operator' && this.peek().value === '=') {
        // Handle assignment statements like "sum = sum + i;"
        this.consume('operator', '=');
        const value = this.parseExpression();
        this.consume('operator', ';');
        return new AssignmentStatement(new Identifier(name), value);
      }
      throw new Error(`Unexpected identifier: ${name}`);
    }
    
    throw new Error(`Unexpected token in statement: ${token.value}`);
  }

  parseReturnStatement() {
    this.consume('keyword', 'return');
    const value = this.parseExpression();
    this.consume('operator', ';');
    return new ReturnStatement(value);
  }


  parseExpression() {
    let left = this.parsePrimary();
    
    // Handle binary operators
    while (this.peek() && this.peek().type === 'operator' && 
           ['<', '>', '<=', '>=', '==', '!=', '+', '-', '*', '/', '%'].includes(this.peek().value)) {
      const operator = this.consume('operator').value;
      const right = this.parsePrimary();
      left = new BinaryExpression(left, operator, right);
    }
    
    return left;
  }

  parsePrimary() {
    if (this.peek().type === 'string') {
      return new StringLiteral(this.consume('string').value);
    } else if (this.peek().type === 'number') {
      return new NumberLiteral(this.consume('number').value);
    } else if (this.peek().type === 'identifier') {
      const name = this.consume('identifier').value;
      // Check if it's a function call (not followed by semicolon)
      if (this.peek() && this.peek().type === 'operator' && this.peek().value === '(') {
        this.consume('operator', '(');
        const args = [];
        while (this.peek().type !== 'operator' || this.peek().value !== ')') {
          if (args.length > 0) {
            this.consume('operator', ',');
          }
          args.push(this.parseExpression());
        }
        this.consume('operator', ')');
        return new FunctionCall(name, args);
      }
      return new Identifier(name);
    }
    
    throw new Error(`Unexpected token in expression: ${this.peek().value}`);
  }

  parseIfStatement() {
    this.consume('keyword', 'if');
    this.consume('operator', '(');
    const condition = this.parseExpression();
    this.consume('operator', ')');
    
    const consequent = this.parseBlockOrStatement();
    
    let alternate = null;
    if (this.peek() && this.peek().type === 'keyword' && this.peek().value === 'else') {
      this.consume('keyword', 'else');
      alternate = this.parseBlockOrStatement();
    }
    
    return new IfStatement(condition, consequent, alternate);
  }

  parseBlockOrStatement() {
    if (this.peek().type === 'operator' && this.peek().value === '{') {
      this.consume('operator', '{');
      const statements = [];
      while (this.peek().type !== 'operator' || this.peek().value !== '}') {
        statements.push(this.parseStatement());
      }
      this.consume('operator', '}');
      return new BlockStatement(statements);
    } else {
      return this.parseStatement();
    }
  }

  parseVariableDeclarationStatement() {
    this.consume('keyword', 'int');
    const name = this.consume('identifier').value;
    this.consume('operator', '=');
    const value = this.parseExpression();
    this.consume('operator', ';');
    return new VariableDeclaration(new Identifier(name), value);
  }

  parseForStatement() {
    this.consume('keyword', 'for');
    this.consume('operator', '(');
    
    // Parse initialization (int i=1)
    let init = null;
    if (this.peek().type === 'keyword' && this.peek().value === 'int') {
      this.consume('keyword', 'int');
      const name = this.consume('identifier').value;
      this.consume('operator', '=');
      const value = this.parseExpression();
      init = new VariableDeclaration(new Identifier(name), value);
    }
    this.consume('operator', ';');
    
    // Parse condition (i<=10)
    const condition = this.parseExpression();
    this.consume('operator', ';');
    
    // Parse update (i=i+1)
    let update = null;
    if (this.peek().type === 'identifier') {
      const name = this.consume('identifier').value;
      this.consume('operator', '=');
      const value = this.parseExpression();
      update = new AssignmentStatement(new Identifier(name), value);
    }
    
    this.consume('operator', ')');
    
    // Parse body
    const body = this.parseBlockOrStatement();
    
    return new ForStatement(init, condition, update, body);
  }

  parseVariableDeclaration(name) {
    this.consume('operator', '=');
    const value = this.parseExpression();
    this.consume('operator', ';');
    return new VariableDeclaration(new Identifier(name), value);
  }
}
