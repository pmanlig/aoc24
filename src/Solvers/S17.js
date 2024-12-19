// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

// adv(c) => reg A = trunc(reg A / 2^c)
// bxl(l) => reg B = reg B XOR l
// bst(c) => reg B = c % 8
// jnz(l) => if (reg A) ip = l
// bxc(x) => reg B = reg B XOR reg C
// out()

export class Computer {
	combo() {
		let c = this.prg[++this.ip];
		switch (c) {
			case 4:
				return this.a;
			case 5:
				return this.b;
			case 6:
				return this.c;
			case 7:
				throw new Error("Invalid operator");
			default:
				return c;
		}
	}

	literal() {
		return this.prg[++this.ip];
	}

	adv() {
		this.a = Math.floor(this.a / 2 ** this.combo());
		this.ip++;
	}

	bxl() {
		this.b = (this.b % 1024) ^ this.literal();
		this.ip++;
	}

	bst() {
		this.b = this.combo() % 8;
		this.ip++;
	}

	jnz() {
		if (this.a) {
			this.ip = this.literal();
		} else {
			this.ip += 2;
		}
	}

	bxc() {
		this.b = (this.b % 1024) ^ (this.c % 1024);
		this.ip += 2;
	}

	out() {
		this.output.push(this.combo() % 8);
		this.ip++;
	}

	bdv() {
		this.b = Math.floor(this.a / 2 ** this.combo());
		this.ip++;
	}

	cdv() {
		this.c = Math.floor(this.a / 2 ** this.combo());
		this.ip++;
	}

	run(a, b, c, prg) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.prg = prg;
		this.ip = 0;
		this.output = [];
		while (this.ip < this.prg.length) {
			switch (this.prg[this.ip]) {
				case 0:
					this.adv();
					break;
				case 1:
					this.bxl();
					break;
				case 2:
					this.bst();
					break;
				case 3:
					this.jnz();
					break;
				case 4:
					this.bxc();
					break;
				case 5:
					this.out();
					break;
				case 6:
					this.bdv();
					break;
				case 7:
					this.cdv();
					break;
				default:
					throw new Error("Impossible!");
			}
		}
		return this.output;
	}

	diagnose(prg, a, i) {
		function eq(a, b) {
			for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; }
			return true;
		}

		if (i === undefined) { return this.diagnose(prg, 0, prg.length); }
		if (i === 0) { return a; }
		i--;
		for (let j = 0; j < 8; j++) {
			let o = this.run(a * 8 + j, 0, 0, prg);
			if (eq(o, prg.slice(i))) {
				// console.log(i, j, a, o);
				let A = this.diagnose(prg, a * 8 + j, i);
				if (A > 0) { return A; }
			}
		}
		return 0;
	}
}

export class S17 extends Solver {
	solve(input) {
		input = {
			a: parseInt(/Register A: (\d+)/.exec(input)[1], 10),
			b: parseInt(/Register B: (\d+)/.exec(input)[1], 10),
			c: parseInt(/Register C: (\d+)/.exec(input)[1], 10),
			prg: /Program: ([,\d]+)/.exec(input)[1].split(',').map(n => parseInt(n, 10))
		}
		let comp = new Computer();
		let a = comp.run(input.a, input.b, input.c, input.prg);
		let b = comp.diagnose(input.prg);
		return { solution: `Output: ${a.join(',')}\nDiagnostic value: ${b}` };
	}
}

