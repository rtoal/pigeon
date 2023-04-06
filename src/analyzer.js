import * as core from "./core.js";

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

function mustBeANumber(e) {
  must(e.type === core.Type.NUMBER, "Number expected");
}

function mustBeABoolean(e) {
  must(e.type === core.Type.BOOLEAN, "Boolean expected");
}

function mustBeAnArray(e) {
  must(e.type instanceof core.ArrayType, "Array expected");
}

function mustBeDeclared(e, id) {
  must(!!e, `${id.sourceString} not declared`);
}

function mustBeAssignable(source, targetType) {
  must(
    source.type === targetType ||
      (source.type instanceof core.ArrayType &&
        targetType instanceof core.ArrayType &&
        source.type.baseType === targetType.baseType),
    "Type mismatch"
  );
}

function mustAllBeSameType(elements) {
  const firstType = elements[0].type;
  const allSameType = elements.slice(1).every((e) => e.type === firstType);
  must(allSameType, "Mixed types in array");
}

class Context {
  constructor() {
    this.locals = new Map();
  }
  add(name, entity) {
    this.locals.set(name, entity);
  }
  lookup(name) {
    return this.locals.get(name);
  }
}

export default function analyzer(match) {
  const context = new Context();

  const analyzer = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(stmts) {
      return new core.Program(stmts.children.map((s) => s.rep()));
    },
    PrintStmt(_print, exp, _semi) {
      return new core.PrintStmt(exp.rep());
    },
    AssignStmt(variable, _eq, exp, _semi) {
      const target = variable.rep();
      const source = exp.rep();
      mustBeAssignable(source, target.type);
      return new core.AssignStmt(target, source);
    },
    VarDec(_let, id, _eq, exp, _semi) {
      const initializer = exp.rep();
      const variable = new core.Variable(id.sourceString, initializer.type);
      context.add(variable.name, variable);
      return new core.VarDec(variable, initializer);
    },
    WhileStmt(_while, exp, block) {
      const test = exp.rep();
      mustBeABoolean(test);
      const body = block.rep();
      return new core.WhileStmt(test, body);
    },
    FunDec(_fun, id, params, _colons, types, block) {
      const returnType =
        types.children.length === 0 ? core.Type.VOID : types[0].rep();
      const fun = new core.Fun(id.sourceString, params.rep(), returnType);
      return new core.FunDec(fun, block.rep());
    },
    ReturnStmt(_return, exps, _semi) {
      if (exps.children.length === 0) {
        return new core.ShortReturnStmt();
      }
      return new core.ReturnStmt(exps.children[0].rep());
    },
    Params(_open, params, _close) {
      return params.asIteration().children.map((p) => p.rep());
    },
    Param(id, _colon, type) {
      return new core.Variable(id.sourceString, type.rep());
    },
    Block(_open, stmts, _close) {
      return stmts.children.map((s) => s.rep());
    },
    Type_array(type, _brackets) {
      return new core.ArrayType(type.rep());
    },
    Exp_binary(cond1, relop, cond2) {
      const left = cond1.rep();
      mustBeANumber(left);
      const operator = relop.sourceString;
      const right = cond2.rep();
      mustBeANumber(right);
      return new core.BinaryExp(left, operator, right, core.Type.BOOLEAN);
    },
    Condition_binary(exp, op, term) {
      const left = exp.rep();
      mustBeANumber(left);
      const operator = op.sourceString;
      const right = term.rep();
      mustBeANumber(right);
      return new core.BinaryExp(left, operator, right, core.Type.NUMBER);
    },
    Term_binary(term, op, factor) {
      const left = term.rep();
      mustBeANumber(left);
      const operator = op.sourceString;
      const right = factor.rep();
      mustBeANumber(right);
      return new core.BinaryExp(left, operator, right, core.Type.NUMBER);
    },
    Factor_binary(primary, op, factor) {
      const left = primary.rep();
      mustBeANumber(left);
      const operator = op.sourceString;
      const right = factor.rep();
      mustBeANumber(right);
      return new core.BinaryExp(left, operator, right, core.Type.NUMBER);
    },
    Factor_negation(op, primary) {
      const operator = op.sourceString;
      const operand = primary.rep();
      mustBeANumber(operand);
      return new core.UnaryExp(operator, operand, core.Type.NUMBER);
    },
    Primary_parens(_open, exp, _close) {
      return exp.rep();
    },
    Primary_array(_open, exps, _close) {
      const elements = exps.asIteration().children.map((e) => e.rep());
      mustAllBeSameType(elements);
      const arrayType = new core.ArrayType(elements[0].type);
      return new core.ArrayExp(elements, arrayType);
    },
    Var_subscript(variable, _open, exp, _close) {
      const array = variable.rep();
      mustBeAnArray(array);
      const subscript = exp.rep();
      mustBeANumber(subscript);
      return new core.SubscriptExp(array, subscript, array.type.baseType);
    },
    Var_id(id) {
      const entity = context.lookup(id.sourceString);
      mustBeDeclared(entity, id);
      return entity;
    },
    Call(id, _open, exps, _close) {},
    num(_int, _dot, _frac, _e, _sign, _exp) {
      return Number(this.sourceString);
    },
    strlit(_open, chars, _close) {
      return this.sourceString;
    },
    true(_) {
      return true;
    },
    false(_) {
      return false;
    },
  });

  return analyzer(match).rep();
}
