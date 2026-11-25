#!/usr/bin/env node
/**
 * The Moon Finally Answers Back — make.fun bounty entry.
 *
 * Writes one fixed line to /output/entry.txt: the Moon, after four
 * billion years of being wished on, howled at, and promised a better
 * tomorrow, finally answers back — and points out that in all that
 * time nobody has ever wished the Moon itself a good night.
 *
 * The line is a constant, so every run writes byte-identical output.
 * It is 134 characters: one line, no trailing newline, no control
 * characters, well inside the 240-character gate.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "You howl, you wish, you promise you'll change tomorrow. Four billion years of it — and not one of you has ever wished ME a good night.";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;
const MAX_CHARS = 240;

function main(): void {
  const text = LINE.trim();

  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters (other than none here) so the gate sees
  // plain UTF-8 text only.
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("entry holds a control character");
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, text, "utf8");
  // Read-back verification: what landed on disk is exactly the line.
  if (readFileSync(OUT_FILE, "utf8") !== text) {
    throw new Error("read-back mismatch: /output/entry.txt differs from the entry");
  }
}

main();
