export class Program {
  constructor(statements) {
    this.type = 'Program';
    this.statements = statements;
  }
}

export class PreprocessorDirective {
  constructor(directive) {
    this.type = 'PreprocessorDirective';
    this.directive = directive;
  }
}

export class FunctionDeclaration {
  constructor(name, params, body) {
    this.type = 'FunctionDeclaration';
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

export class ReturnStatement {
  constructor(argument) {
    this.type = 'ReturnStatement';
    this.argument = argument;
  }
}

export class FunctionCall {
  constructor(name, args) {
    this.type = 'FunctionCall';
    this.name = name;
    this.arguments = args;
  }
}

export class StringLiteral {
  constructor(value) {
    this.type = 'StringLiteral';
    this.value = value;
  }
}

export class NumberLiteral {
  constructor(value) {
    this.type = 'NumberLiteral';
    this.value = value;
  }
}

export class VariableDeclaration {
  constructor(identifier, value) {
    this.type = 'VariableDeclaration';
    this.identifier = identifier;
    this.value = value;
  }
}

export class Identifier {
  constructor(name) {
    this.type = 'Identifier';
    this.name = name;
  }
}

export class IfStatement {
  constructor(condition, consequent, alternate = null) {
    this.type = 'IfStatement';
    this.condition = condition;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class BinaryExpression {
  constructor(left, operator, right) {
    this.type = 'BinaryExpression';
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class BlockStatement {
  constructor(body) {
    this.type = 'BlockStatement';
    this.body = body;
  }
}
