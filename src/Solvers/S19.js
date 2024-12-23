// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

// const white = 'w';
// const blue = 'u';
// const black = 'b';
// const red = 'r';
// const green = 'g';

export class S19 extends Solver {
	solve(input) {
		function possible(pattern, towels) {
			if (pattern.length === 0) return true;
			for (let i = 0; i < towels.length; i++) {
				if (pattern.startsWith(towels[i]) && possible(pattern.substr(towels[i].length), towels)) { return true; }
			}
			return false;
		}

		function createTree(towels) {
			let tree = {}
			towels.forEach(t => {
				let n = tree;
				for (let i = 0; i < t.length; i++) {
					if (n[t[i]] === undefined) { n[t[i]] = {} }
					n = n[t[i]];
				}
				n.loop = tree;
			});
			return tree;
		}

		function count(pattern, index, tree) {
			if (index === pattern.length) { return tree.loop ? 1 : 0; }
			let combos = 0;
			if (tree.loop) { combos += count(pattern, index, tree.loop); }
			if (tree[pattern[index]]) { combos += count(pattern, index + 1, tree[pattern[index]]); }
			return combos;
		}

		// input = "r, wr, b, g, bwu, rb, gb, br\n\nbrwrr\nbggr\ngbbr\nrrbgbr\nubwu\nbwurrg\nbrgr\nbbrgwb";
		// "grrg, buwuurr, w, bguwu, uuuu, wr, wuw, brbug, buwrg, wwr, uwr, buu, gurw, ubrgg, wggww, urgbr, wur, urur, wguw, buurb, ugbrwwb, gbr, gb, wurww, wgruw, rrwgbur, wrg, wru, urr, wwbgru, bb, rrr, gwurbgb, bgguur, rurru, rwggru, uwbuwbr, rwww, grbbrr, uuw, ubgwu, rwrrr, rwgrbu, rbu, ub, buubgrr, ruu, rggwgr, bgwgwu, wuwgbg, bgugg, bbb, gbwur, buwrubb, uwgr, grrggug, brgu, ubg, ggur, uuwr, gbuu, bwwgrb, wbu, bbrbb, ubbrr, rrwrggb, urbu, ubrb, grb, brww, uuu, uuwg, bbwr, wwgg, buwubg, gwuuru, bguugrwu, rwwugr, rwru, rwwwwg, bgug, urru, bwuug, bugrr, wggr, buw, gub, gwgrgg, brugwg, wug, grbrw, bgbbb, ubwrg, rubr, grrubug, rubuugwr, gbgw, rwgwgg, ubw, bwbwwrb, brbwg, gbgg, rgwrur, guwg, grg, rwwubg, ugu, urbwrg, urg, gugbwbr, gwg, gbg, rruwug, wuwwug, gwgbg, wuuubu, rwuwbb, urrwur, rrgbubw, rub, rgr, uuuww, wrgu, ggg, brwb, rgrwg, bwr, ugwggwb, wggbguw, rwwgb, ubr, gbwg, rubug, bwg, bru, uwu, wbwggbr, ggu, guuub, uur, bww, ruguwgg, wbwrb, brwg, rrw, r, wgrb, ggrb, uwb, uuugbbr, brubb, bggb, urwubrgg, bgbw, rbgrrrgg, ubbg, rww, uuruggrw, rugw, uug, bgbgr, uwrb, wg, gubr, wbb, gwr, wwrw, wu, wwrgu, ugrrgu, bbguu, uwwwg, rrg, uuuwgu, grbbuwg, gguu, gugg, gurg, bgg, bug, ugb, rwr, wgbbg, gwgwuu, wuwbbbw, wgbr, wuggur, gwgr, bbuubuww, uub, br, bggwu, brg, rbg, rwb, brwwwg, ruwrg, wbr, ubwwww, gbww, rbww, rwuwbu, wbuburw, rrgg, uugbub, urrbb, wwgrb, wrub, guu, rgugb, wrubu, rbwgwg, gbgwubr, uwbrbu, wuru, rbbgu, wwg, rbguugr, brb, wbgbrr, guw, rguw, rbrgub, bgu, gurrrg, ggrbg, guwr, bwbb, wbgg, ugggb, rrrbggb, rurg, gug, rwg, urrrb, wbubg, wrbbubw, bwgu, bwurw, urrg, gbw, rrbr, rbrg, brwbww, rbgb, uurb, bwwgwgrg, wrwbuu, bwbgw, rug, ww, grr, rg, rbwbrbrr, rgrg, wwb, rurr, ubwu, rgu, www, gbb, bbw, rbw, gbgbwbw, ur, gguwuggr, gru, uru, rbuw, rrbgr, wuu, wgg, bg, wbuu, rwbggb, uggbg, gbu, bbgruuuw, rb, rggb, ubbuub, ruwubgbr, bub, guuru, ugg, uuggbuw, rbuur, gbrw, gu, wbuugwr, ubb, urbuuwu, wrgub, rwu, uuww, wgwgbg, uww, rwwb, rbbubggg, bgb, rrwuwwg, ubugw, brw, gww, bgr, rbur, rr, buwg, wub, wbwwuu, wuruuwr, wbur, rgbwu, rbgwurg, uwg, uwrrg, bruuw, rgg, gubu, bbbubbb, bgrw, urb, wgw, rrgwu, wubbgr, bbr, bwuwu, rbbu, rrb, wuuwggww, ubwg, uwgub, bgubgru, rwubu, wuwgbgg, ggb, g, bbrwrgwu, wbg, wwru, rbwugr, urwwuu, wwwgug, gbur, bbggw, gwbrru, wrbr, ggr, ubu, gbwugw, u, grur, rgub, bggr, bwrw, wurb, ggggw, gwurrwrw, bgrubw, wgr, rrbrrwb, urwbubgr, grw, rgw, bbrbr, urbrr, brrbruuu, uwbbw, rur, ggw, ruw, uu, ubrw, rurgb, gbrr, gwwbu, ugr, brwubuub, bwb, wuugr, wrrub, uugrbr, bgwr, gwu, gwbw, wbru, gwb, rgrwur, wrwur, bw, bbu, wwu, uwwb, gbbb, grrb, uwuwbwrw, gur, rgbbu, gbwbgg, bbrur, gw, ru, guwwbr, wgubb, ggug, ugw, wwgwugg, wgrw, grrw, uuggb, rwbgbr, wrb, wbw, bbg, rw, uwgbgu, bwgw, gr, rgwb, rbr, rugubb, gwuggbb, ruww, bwu, rwuggr, bubrb, rbbub, uggr, brwugur, wgu, bbwb, gbwbu, rwbubu, ug, wb, rrruu, bwbbrb, rbb, uwwgu, bgw, rwwr, urw, wgb, gg, bruwrbr, uugwgbgu, rru"
		// "buruggbwgrbwbrbrrrururbwrbburwuwwbrubrbgwgurrguggruubururr"

		input = input.split("\n\n");
		let towels = input[0].split(', ').sort((a, b) => b.length - a.length);;
		let towelTree = createTree(towels);
		let patterns = input[1].split('\n');
		let a = patterns.filter(p => possible(p, towels)).length;
		let b = 0;
		b = patterns.slice(0, 2).map(p => count(p, 0, towelTree)).reduce((a, b) => a + b, 0);
		return { solution: `# of possible designs: ${a}\n# of possible combinations: ${b}` };
	}
}