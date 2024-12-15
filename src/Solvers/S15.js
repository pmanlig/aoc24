// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const colors = {
	'#': "#000000",
	'O': "#009F00",
	'[': "#009F00",
	']': "#009F00",
	'.': "#DFDFDF",
	'@': "#FF0000"
}

const directions = {
	'^': { x: 0, y: -1 },
	'v': { x: 0, y: 1 },
	'<': { x: -1, y: 0 },
	'>': { x: 1, y: 0 }
}

const box = 'O';
const free = '.';

function GPS(map) {
	let gps = 0;
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === box) {
				gps += 100 * r + c;
			}
		}
	}
	return gps;
}

function findRobot(map) {
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === '@') {
				return { x: c, y: r }
			}
		}
	}
	throw new Error("404 not found");
}

function move(robot, map, dir) {
	let v = directions[dir];
	let dist = 1;
	while (map[robot.y + dist * v.y][robot.x + dist * v.x] === box) { dist++; }
	if (map[robot.y + dist * v.y][robot.x + dist * v.x] === free) {
		if (dist > 1) { map[robot.y + dist * v.y][robot.x + dist * v.x] = box; }
		map[robot.y][robot.x] = free;
		robot.x += v.x;
		robot.y += v.y;
		map[robot.y][robot.x] = '@';
	}
}

const wide1 = {
	'#': '#',
	'.': '.',
	'O': '[',
	'@': '@'
}

const wide2 = {
	'#': '#',
	'.': '.',
	'O': ']',
	'@': '.'
}

function wide(map) {
	let w = [];
	for (let r = 0; r < map.length; r++) {
		w[r] = [];
		for (let c = 0; c < map[r].length; c++) {
			w[r][2 * c] = wide1[map[r][c]];
			w[r][2 * c + 1] = wide2[map[r][c]];
		}
	}
	return w;
}

function findBoxes(map) {
	let boxes = [];
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === '[') {
				boxes.push({ x: c, y: r });
			}
		}
	}
	return boxes;
}

function wideMove(robot, map, boxes, dir) {
	let v = directions[dir];
	let target = [{ x: robot.x + v.x, y: robot.y + v.y }];
	let moveSet = [];
	while (target.length > 0) {
		let t = target.pop();
		console.log("wideMove", robot.x, robot.y, t, target, moveSet);
		if (map[t.y][t.x] === '#') { return false; }
		for (let i = 0; i < boxes.length; i++) {
			if (boxes[i].y === t.y && (boxes[i].x === t.x || boxes[i].x + 1 === t.x)) {
				if (!moveSet.includes(boxes[i])) { moveSet.push(boxes[i]); }
				if (dir === '^' || dir === 'v') {
					target.push({ x: boxes[i].x, y: boxes[i].y + v.y });
					target.push({ x: boxes[i].x + 1, y: boxes[i].y + v.y });
				} else if (dir === '<') {
					target.push({ x: boxes[i].x - 1, y: boxes[i].y });
				} else {
					target.push({ x: boxes[i].x + 2, y: boxes[i].y });
				}
			}
		}
	}
	moveSet.forEach(b => {
		map[b.y][b.x] = '.';
		map[b.y][b.x + 1] = '.';
	});
	map[robot.y][robot.x] = '.';
	robot.x += v.x;
	robot.y += v.y;
	map[robot.y][robot.x] = '@';
	moveSet.forEach(b => {
		b.x += v.x;
		b.y += v.y;
		map[b.y][b.x] = '[';
		map[b.y][b.x + 1] = ']';
	});
}

export class S15 extends Solver {
	solve(input) {
		// input = "##########\n#..O..O.O#\n#......O.#\n#.OO..O.O#\n#..O@..O.#\n#O#..O...#\n#O..O..O.#\n#.OO.O.OO#\n#....O...#\n##########\n\n<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^\nvvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v\n><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<\n<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^\n^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><\n^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^\n>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^\n<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>\n^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>\nv^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^";
		input = input.split("\n\n");
		let map = input[0].split('\n').map(l => l.split(''));
		let wideMap = wide(map);
		let boxes = findBoxes(wideMap);
		console.log(boxes);
		let instructions = input[1].split('\n').join('').split('');
		let robot = findRobot(map);
		let wideRobot = findRobot(wideMap);
		for (let i = 0; i < instructions.length; i++) {
			move(robot, map, instructions[i]);
			// if (i < 22)
			wideMove(wideRobot, wideMap, boxes, instructions[i]);
		}
		let x = "<vv>^<v^>v>^vv^v>v<>.v^v.<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^\nvvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v\n><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<\n<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^\n^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><\n^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^\n>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^\n<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>\n^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>\nv^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^";
		let a = GPS(map);
		let b = boxes.map(b => 100 * b.y + b.x).reduce((a, b) => a + b, 0);
		console.log(boxes);
		return {
			solution: `Sum of GPS coordinates: ${a}\nSum of wide coordinates: ${b}`,
			bmp: wideMap,
			renderer: new BitmapRenderer(col => colors[col] || "#FFFFFF", wideMap, 6)
		};
	}
}