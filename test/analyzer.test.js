import assert from "assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as core from "../src/core.js";

const goodPrograms = [
  ["comparisons", "print(3 < 5);"],
  ["additions", "print(7 - 2 + 5);"],
  ["exponentiations", "print(7 ** 3 ** 2.5 ** 5);"],
  ["negations", "print(7 * (-3));"],
  ["declared variables", "let x = 3; print(x * 5);"],
  ["assign nums", "let x = 3; x = 10 ** (7-2);"],
  ["assign bools", "let x = 3; x = 10 ** (7-2);"],
  ["assign arrays", "let x = [3,1]; x = [10];"],
  ["subscripts", "let a=[true, false]; print(a[0]);"],
  ["subscripted is a number", "let a=[1,2,3]; print(a[0]-5);"],
  ["subscripted is a bool", "let a=[false]; while a[0] {}"],
];

const badPrograms = [
  ["bad types in addition", "print(false + 1);", /Number expected/],
  ["bad types in multiplication", 'print("x" * 5);', /Number expected/],
  ["non-boolean while test", "while 3 {}", /Boolean expected/],
  ["undeclared in print", "print(x);", /x not declared/],
  ["undeclared in add", "print(x + 5);", /x not declared/],
  ["undeclared in negate", "print(-z);", /z not declared/],
  ["assign bool to a number", "let x = 1; x = false;", /Type mismatch/],
  ["arrays of mixed types", `let a = [2, "dog"];`, /Mixed types in array/],
  ["subscripting a number", "let a=2; print(a[1]);", /Array expected/],
  ["non-numeric sub", "let a=[1,2,3]; print(a[false]);", /Number expected/],
];

describe("The analyzer", () => {
  for (const [scenario, source] of goodPrograms) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)));
    });
  }

  for (const [scenario, source, errorMessagePattern] of badPrograms) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern);
    });
  }

  it("builds a proper representation of the simplest program", () => {
    const rep = analyze(parse("print 0;"));
    assert.deepEqual(rep, new core.Program([new core.PrintStmt(0)]));
  });
});
