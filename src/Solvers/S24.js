// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S24 extends Solver {
	solve(input) {
		function readWires(input) {
			let out = {};
			input.split('\n').forEach(w => {
				let x = /^([^:]+): (\d)$/.exec(w).slice(1);
				out[x[0]] = parseInt(x[1], 10);
			});
			return out;
		}

		function readGates(input) {
			let out = [];
			input.split('\n').forEach(g => {
				out.push(/^(\S+) (XOR|AND|OR) (\S+) -> (\S+)$/.exec(g).slice(1));
			});
			return out;
		}

		function electrify(wires, gates) {
			for (let done = false; !done;) {
				// console.log([...Object.keys(wires)].length);
				done = true;
				for (const g of gates) {
					if (wires[g[3]] === undefined) {
						// console.log(`Output ${g[3]} is undefined and depends on inputs ${g[0]}=${wires[g[0]]} and ${g[2]}=${wires[g[2]]}`)
						if ((wires[g[0]] !== undefined) && (wires[g[2]] !== undefined)) {
							// console.log(`Set wire ${g[3]}`);
							switch (g[1]) {
								case "AND":
									wires[g[3]] = wires[g[0]] & wires[g[2]];
									break;
								case "OR":
									wires[g[3]] = wires[g[0]] | wires[g[2]];
									break;
								case "XOR":
									wires[g[3]] = wires[g[0]] ^ wires[g[2]];
									break;
								default:
									throw new Error("Cést impossible!");
							}
						} else done = false;
					}
				}
			}
			// console.log(wires);
		}

		function readOutput(wires) {
			let r = 0, i = 0;
			for (let w = `z${("00" + i).slice(-2)}`; wires[w] !== undefined; w = `z${("00" + ++i).slice(-2)}`) {
				r += wires[w] * 2 ** i;
			}
			return r;
		}

		function findSwitches(gates) {
			let switched = [];

			const findGate = (a, b, op) => gates.find(g => ((g[0] === a && g[2] === b) || (g[0] === b && g[2] === a)) && (g[1] === op));
			const findInput = a => gates.filter(g => g[0] === a || g[2] === a);
			const findInputAndOp = (a, op) => gates.find(g => (g[0] === a || g[2] === a) && g[1] === op);
			const findOutput = o => gates.find(g => g[3] === o);
			const switchOutput = (a, b) => {
				let x = gates.find(g => g[3] === a);
				gates.find(g => g[3] === b)[3] = a;
				x[3] = b;
				switched.push(a);
				switched.push(b);
				console.log(`Switched "${a}" and "${b}"`);
			}

			let xor = findGate("x00", "y00", "XOR");
			if (xor[3] !== "z00") {
				// z00 is switched
				switchOutput("z00", xor[3]);
			}
			let carry = findGate("x00", "y00", "AND");
			for (let i = 1; i < 45; i++) {
				let x = `x${("00" + i).slice(-2)}`;
				let y = `y${("00" + i).slice(-2)}`;
				let z = `z${("00" + i).slice(-2)}`;
				let xor = findGate(x, y, "XOR");
				let res = findOutput(z);
				if (res[1] !== "XOR") {
					// zXX is switched
					let sw = findGate(xor[3], carry[3], "XOR");
					switchOutput(z, sw[3]);
				} else if (carry[3] !== res[0] && carry[3] !== res[2]) {
					if (xor[3] === res[0]) {
						switchOutput(carry[3], res[2]);
					} else {
						switchOutput(carry[3], res[0]);
					}
				} else if (xor[3] !== res[0] && xor[3] !== res[2]) {
					if (carry[3] === res[0]) {
						switchOutput(xor[3], res[2]);
					} else {
						switchOutput(xor[3], res[0]);
					}
				}
				let ca = findGate(xor[3], carry[3], "AND");
				if (ca === undefined) {
					console.log(`${x} \\`);
					console.log(`      XOR \\`);
					console.log(`${y} /     undefined`);
					console.log(`carry (${carry[3]}) /`);
					break;
				}
				let and = findGate(x, y, "AND");
				carry = findGate(and[3], ca[3], "OR");
				if (carry === undefined) {
					console.log(`${x} \\`);
					console.log(`      AND \\`);
					console.log(`${y} /     undefined`);
					console.log(`AND (${and[3]}) /`);
					break;
				}
			}
			// Remaining test is carry.output === z45, but if that was wrong we'd found and switched already
			return switched;
		}

		// input = "x00: 1\nx01: 0\nx02: 1\nx03: 1\nx04: 0\ny00: 1\ny01: 1\ny02: 1\ny03: 1\ny04: 1\n\nntg XOR fgs -> mjb\ny02 OR x01 -> tnw\nkwq OR kpj -> z05\nx00 OR x03 -> fst\ntgd XOR rvg -> z01\nvdt OR tnw -> bfw\nbfw AND frj -> z10\nffh OR nrd -> bqk\ny00 AND y03 -> djm\ny03 OR y00 -> psh\nbqk OR frj -> z08\ntnw OR fst -> frj\ngnj AND tgd -> z11\nbfw XOR mjb -> z00\nx03 OR x00 -> vdt\ngnj AND wpb -> z02\nx04 AND y00 -> kjc\ndjm OR pbm -> qhw\nnrd AND vdt -> hwm\nkjc AND fst -> rvg\ny04 OR y02 -> fgs\ny01 AND x02 -> pbm\nntg OR kjc -> kwq\npsh XOR fgs -> tgd\nqhw XOR tgd -> z09\npbm OR djm -> kpj\nx03 XOR y03 -> ffh\nx00 XOR y04 -> ntg\nbfw OR bqk -> z06\nnrd XOR fgs -> wpb\nfrj XOR qhw -> z04\nbqk OR frj -> z07\ny03 OR x01 -> nrd\nhwm AND bqk -> z03\ntgd XOR rvg -> z12\ntnw OR pbm -> gnj";
		input = input.split("\n\n");
		let wires = readWires(input[0]);
		let gates = readGates(input[1]);
		electrify(wires, gates);
		let a = readOutput(wires);
		let b = findSwitches(gates).sort().join(',');
		return { solution: `Result: ${a}\nSwitched wires: ${b}` };
	}
}