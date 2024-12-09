// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S9 extends Solver {
	solve(input) {
		function createMap(input) {
			let mem = [];
			let m = 0, fileID = 0;
			for (let i = 0; i < input.length; i++) {
				let v = i % 2 === 0 ? fileID++ : -1;
				for (let n = input[i]; n > 0; n--) { mem[m++] = v; }
			}
			return mem;
		}

		function createMap2(input) {
			let mem = { size: input[0], id: 0, next: null, prev: null };
			let curr = mem;
			let fileID = 1;
			for (let i = 1; i < input.length; i++) {
				let n = { size: input[i], id: i % 2 === 0 ? fileID++ : -1, prev: curr, next: null }
				curr.next = n;
				curr = n;
			}
			return mem;
		}

		function compact(mem) {
			let i = 0, j = mem.length - 1;
			while (i < j) {
				while (mem[i] > -1) { i++; }
				while (mem[j] === -1) { j--; }
				if (i < j) {
					mem[i] = mem[j];
					mem[j] = -1;
				}
			}
		}

		function compact2(mem) {
			let tail = mem;
			while (tail.next !== null) { tail = tail.next; }
			while (tail.prev !== null) {
				while (tail.id === -1) { tail = tail.prev; }
				let head = mem;
				while (head !== tail && (head.id !== -1 || head.size < tail.size)) { head = head.next; }
				if (head !== tail) {
					// console.log("moving", head, tail);
					let empty = { size: tail.size, id: -1, prev: tail.prev, next: tail.next }
					tail.prev.next = empty;
					if (tail.next !== null) { tail.next.prev = empty; }
					head.prev.next = tail;
					tail.prev = head.prev;
					tail.next = head;
					head.prev = tail;
					head.size -= tail.size;
					tail = empty;
				}
				if (tail.prev !== null) { tail = tail.prev; }
			}
		}

		function checksum(mem) {
			let c = 0;
			for (let i = 1; i < mem.length; i++) {
				if (mem[i] > -1) { c += i * mem[i]; }
			}
			return c;
		}

		function checksum2(mem) {
			let c = 0;
			let p = 0;
			for (let head = mem; head !== null; head = head.next){
				if (head.id > -1) {
					for (let i = 0; i < head.size; i++) {
						c += (p + i) * head.id;
					}
				}
				p += head.size;
			}
			return c;
		}

		// input = "12345";
		// input = "2333133121414131402";
		input = input.split('').map(n => parseInt(n, 10));
		let mem = createMap(input);
		compact(mem);
		let a = checksum(mem);

		let mem2 = createMap2(input);
		compact2(mem2);
		// console.log(mem2);
		let b = checksum2(mem2);
		return { solution: `Checksum: ${a}\nOptimized checksum: ${b}` };
	}
}