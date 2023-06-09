export class Program {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

export class PrintStmt {
  constructor(argument) {
    Object.assign(this, { argument });
  }
}

export class AssignStmt {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

export class VarDec {
  constructor(variable, initializer) {
    Object.assign(this, { variable, initializer });
  }
}

export class Variable {
  constructor(name, type) {
    Object.assign(this, { name, type });
  }
}

export class WhileStmt {
  constructor(test, body) {
    Object.assign(this, { test, body });
  }
}

export class FunDec {
  constructor(fun, body) {
    Object.assign(this, { fun, body });
  }
}

export class Fun {
  constructor(name, params, returnType) {
    Object.assign(this, { name, params, returnType });
  }
}

export class ReturnStmt {
  constructor(expression) {
    Object.assign(this, { expression });
  }
}

export class ShortReturnStmt {
  constructor() {
    // Intentionally empty
  }
}

export class Block {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

export class ArrayType {
  constructor(baseType) {
    Object.assign(this, { baseType });
  }
}

export class Type {
  static VOID = new Type("void");
  static BOOLEAN = new Type("boolean");
  static NUMBER = new Type("number");
  static STRING = new Type("string");
  constructor(description) {
    Object.assign(this, { description });
  }
}

export class BinaryExp {
  constructor(op, left, right, type) {
    Object.assign(this, { op, left, right, type });
  }
}

export class UnaryExp {
  constructor(op, operand, type) {
    Object.assign(this, { op, operand, type });
  }
}

export class ArrayExp {
  constructor(elements, type) {
    Object.assign(this, { elements, type });
  }
}

export class SubscriptExp {
  constructor(array, subscript, type) {
    Object.assign(this, { array, subscript, type });
  }
}

export class Call {
  constructor(fun, args) {
    Object.assign(this, { fun, args });
  }
}

Number.prototype.type = Type.NUMBER;
Boolean.prototype.type = Type.BOOLEAN;
String.prototype.type = Type.STRING;
