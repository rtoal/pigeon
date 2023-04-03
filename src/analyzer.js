import * as core from "./core.js";

export default function analyzer(match) {
  const analyzer = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(stmts) {
      return new core.Program(stmts.children.map((s) => s.rep()));
    },
    PrintStmt(_print, exp, _semi) {
      return new core.PrintStmt(exp.rep());
    },
    AssignStmt(variable, _eq, exp, _semi) {
      return new core.AssignStmt(variable.rep(), exp.rep());
    },
    VarDec(_let, id, _eq, exp, _semi) {
      const initializer = exp.rep();
      const variable = new core.Variable(id.sourceString);
      return new core.VarDec(variable, initializer);
    },
    WhileStmt(_while, exp, block) {
      const test = exp.rep();
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
      operator = relop.sourceString;
      const right = cond2.rep();
      return new core.BinaryExp(left, operator, right);
    },
    Condition_binary(exp, op, term) {
      const left = exp.rep();
      operator = op.sourceString;
      const right = term.rep();
      return new core.BinaryExp(left, operator, right);
    },
    Term_binary(term, op, factor) {
      const left = term.rep();
      operator = op.sourceString;
      const right = factor.rep();
      return new core.BinaryExp(left, operator, right);
    },
    Factor_binary(primary, op, factor) {
      const left = primary.rep();
      operator = op.sourceString;
      const right = factor.rep();
      return new core.BinaryExp(left, operator, right);
    },
    Factor_negation(op, primary) {
      const operator = op.sourceString;
      const operand = primary.rep();
      return new core.UnaryExp(operator, operand);
    },
    Var_subscript(variable, _open, exp, _close) {
      return new core.SubscriptExp(variable.rep(), exp.rep());
    },
    Var_id(id) {
      // TODO: LOOKUP!
      return id.sourceString;
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
