class Program {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

class PrintStmt {
  constructor(argument) {
    Object.assign(this, { argument });
  }
}

class AssignStmt {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class VarDec {
  constructor(variable, initializer) {
    Object.assign(this, { variable, initializer });
  }
}

class Variable {
  constructor(name, type) {
    Object.assign(this, { name, type });
  }
}

class WhileStmt {
  constructor(test, body) {
    Object.assign(this, { test, body });
  }
}

class FunDec {
  constructor(fun, body) {
    Object.assign(this, { fun, body });
  }
}

class Fun {
  constructor(name, params, returnType) {
    Object.assign(this, { name, params, returnType });
  }
}

class ReturnStmt {
  constructor(expression) {
    Object.assign(this, { expression });
  }
}

class Block {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

class ArrayType {
  constructor(baseType) {
    Object.assign(this, { baseType });
  }
}

class BasicType {
  constructor(name) {
    Object.assign(this, { name });
  }
}

class BinaryExp {
  constructor(op, left, right, type) {
    Object.assign(this, { op, left, right, type });
  }
}

class UnaryExp {
  constructor(op, operand, type) {
    Object.assign(this, { op, operand, type });
  }
}

class ArrayExp {
  constructor(elements) {
    Object.assign(this, elements);
  }
}

class SubscriptExp {
  constructor(array, subscript) {
    Object.assign(this, { array, subscript });
  }
}

class Call {
  constructor(fun, args) {
    Object.assign(this, { fun, args });
  }
}
