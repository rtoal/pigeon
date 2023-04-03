import assert from "assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as core from "../src/core.js";

describe("The analyzer", () => {
  it("builds a proper representation of the simplest program", () => {
    const rep = analyze(parse("print 0;"));
    assert.deepEqual(rep, new core.Program([new core.PrintStmt(0)]));
  });
});
