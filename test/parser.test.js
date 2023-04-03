import assert from "node:assert/strict";
import parse from "../src/parser.js";

const syntaxChecks = [
  ["printing hello", `print "hello";`],
  ["numbers", "print 8 * 8.3 + 8.2e-10 / 3e5;"],
  ["arithmetic operators", "let x = 2 + 4 - 7.3 * 8 ** 13 / 1;"],
  ["relational operators", "let x = 1<(2<=(3==(4!=(5 >= (6>7)))));"],
  ["multiple statements", "print 1;\nx=5; return; return;"],
  ["variable declarations", "let e=99*1;"],
  ["function with no params, no return type", "function f(): int {}"],
  ["function with one param", "function f(x: int): int {}"],
  ["function with two params", "function f(x: int, y: boolean): void {}"],
  ["array type for param", "function f(x: boolean[][]): void {}"],
  ["array type returned", "function f(): int[] {}"],
  ["assignments", "abc=9*3; a=1;"],
  ["array var assignment", "c[2] = 100;"],
  ["call", "print 5 * f(x, y, 2 * y);"],
  ["negation", "print -2;"],
  ["negation can come second", "print 2 ** -2;"],
  ["while with empty block", "while true {}"],
  ["while with one statement block", "while true { let x = 1; }"],
  ["nonempty array literal", "print [1, 2, 3];"],
  ["non-Latin letters in identifiers", "let コンパイラ = 100;"],
  ["a simple string literal", 'print("hello😉😬💀🙅🏽‍♀️—`");'],
];

const syntaxErrors = [
  ["a non-letter in an identifier", "let a$b = 1;", /Line 1, col 6/],
  ["malformed number", "x = 2.;", /Line 1, col 7/],
  ["a float with an E but no exponent", "let x = 5E * 11;", /Line 1, col 11:/],
  ["a missing right operand", "print(5 -);", /Line 1, col 10:/],
  ["a non-operator", "print(7 * ((2 _ 3));", /Line 1, col 15:/],
  ["an expression starting with a )", "return );", /Line 1, col 8:/],
  ["a statement starting with expression", "x * 5;", /Line 1, col 3:/],
  ["an illegal statement on line 2", "print(5);\nx * 5;", /Line 2, col 3:/],
  ["a statement starting with a )", "print(5);\n)", /Line 2, col 1:/],
  ["an expression starting with a *", "let x = * 71;", /Line 1, col 9:/],
  ["associating relational operators", "print(1 < 2 < 3);", /Line 1, col 16:/],
  ["while without braces", "while true\nprint(1);", /Line 2, col 1/],
  ["while as identifier", "let while = 3;", /Line 1, col 5/],
  ["return as identifier", "let return = 8;", /Line 1, col 5/],
  ["bad array literal", "print([1,2,]);", /Line 1, col 12/],
  ["empty subscript", "print(a[]);", /Line 1, col 9/],
  ["true is not assignable", "true = 1;", /Line 1, col 1/],
  ["false is not assignable", "false = 1;", /Line 1, col 1/],
  ["numbers cannot be subscripted", "print(500[x]);", /Line 1, col 10/],
  ["numbers cannot be called", "print(500(x));", /Line 1, col 10/],
  ["string lit with newline", 'print("ab\ndef");', /col 10/],
  ["string lit with quote", 'print("ab"cdef");', /col 11/],
  ["negation can not come first", "print -2 ** 2;", /col 11/],
];

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`accepts ${scenario}`, () => {
      assert.ok(parse(source));
    });
  }
  for (const [scenario, source, errorPattern] of syntaxErrors) {
    it(`rejects ${scenario}`, () => {
      assert.throws(() => parse(source), errorPattern);
    });
  }
});
