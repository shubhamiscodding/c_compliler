export class Program {
  constructor(statements) {
    this.type = 'Program';
    this.statements = statements;
  }
}

export class VariableDeclaration {
  constructor(identifier, value) {
    this.type = 'VariableDeclaration';
    this.identifier = identifier;
    this.value = value;
  }
}

export class BinaryExpression {
  constructor(operator, left, right) {
    this.type = 'BinaryExpression';
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class Identifier {
  constructor(name) {
    this.type = 'Identifier';
    this.name = name;
  }
}

export class NumberLiteral {
  constructor(value) {
    this.type = 'NumberLiteral';
    this.value = value;
  }
}
