
'use strict'

var blockStart = [ [0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];

function generateNum(num) {
	if (num ==='0' || num ===0 ) {
		return '123456789';
	} else {
		return num;
	}
}


function getNumberInRow(cells,row) {
	var numStr ='';
	for (var i=0;i<9;i++) {
		if (cells[row][i].length === 1) {
			numStr +=cells[row][i];
		}
	}
	return numStr;
}

function getNumberInCol(cells,col) {
	var numStr ='';
	for (var i=0;i<9;i++) {
		if (cells[i][col].length === 1) {
			numStr +=cells[i][col];
		}
	}
	return numStr;
}

function cells2Str(cells,possiblity) {
	var str = '';
	for (var i=0;i<9;i++) {
		for (var j=0;j<9;j++) {
			// if (cells[i][j].length===1) {
			// 	str+=cells[i][j]+':';
			// } else {
			// 	str+=;
			// }
			str += cells[i][j]+":";
		}
	}
	return str.substr(0,str.length-1);
	// body...
}



var Sudoku = function(cfg){	
		this.cells = [];
		this.solution = [];		
		if (typeof cfg === 'string') {
			var index = 0;
			for (var i=0;i<9;i++) {
				  this.cells[i] = [];
				for (var j=0;j<9;j++){

						this.cells[i][j] = generateNum(cfg.charAt(index++));
					}
				}
		} else {
			var index = 0;
			for (var i=0;i<9;i++) {
				  this.cells[i] = [];
				for (var j=0;j<9;j++){
						this.cells[i][j] = generateNum(cfg[index++]);
					}
				}
		}		
};

Sudoku.prototype.add = function(coord,number) {
	if (coord && coord[0] < 9 && coord[0]>=0 && coord[1]<9 && coord[1]>=0) {
	 	this.cells[coord[0]][coord[1]] = number;
	 } else {
	 	console.log("coord err");
	 }
}


Sudoku.prototype.clearRow = function(coord) {
	if (coord && coord[0] < 9 && coord[0]>=0 && coord[1]<9 && coord[1]>=0) {
		var number = this.cells[coord[0]][coord[1]];
		var match = 0;

	 	if (number.length ===1) {
	 		for (var j=0;j<9;j++) {

	 			if (j!==coord[1] && this.cells[coord[0]][j].length !==1) {
	 				var str = this.cells[coord[0]][j].replace(number,'');
	 				match += this.cells[coord[0]][j]===str?0:1;
	 				this.cells[coord[0]][j] =str;
	 				if (str.length === 1) {this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'clearRow',
	 					row: coord[0],
	 					col: j,
	 					num:str }
	 					)}	 				
	 			}
	 		}
	 	}
	 } else {
	 	console.log("clearRow:ord err");
	 }
	 return match;
}


Sudoku.prototype.clearCol = function(coord) {
	if (coord && coord[0] < 9 && coord[0]>=0 && coord[1]<9 && coord[1]>=0) {
		var match =0
		var number = this.cells[coord[0]][coord[1]];

	 	if (number.length ===1) {
	 		for (var j=0;j<9;j++) {

	 			if (j!==coord[0] && this.cells[j][coord[1]].length !==1) {
	 				var str = this.cells[j][coord[1]].replace(number,'');
	 				match += str==this.cells[j][coord[1]]?0:1;
	 				this.cells[j][coord[1]] =str;
	 				if (str.length === 1) {this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'clearCol',
	 					row: j,
	 					col: coord[1],
	 					num:str }
	 					)}
	 			}
	 		}
	 	}
	 } else {
	 	console.log("clearCol:ord err");
	 }
	 return match;
}

Sudoku.prototype.clearBlock = function(coord) {
	if (coord && coord[0] < 9 && coord[0]>=0 && coord[1]<9 && coord[1]>=0) {
		var match =0 ;
		var number = this.cells[coord[0]][coord[1]];

	 	if (number.length ===1) {
	 		var rowStart = coord[0]-coord[0]%3;
	 		var colStart = coord[1]-coord[1]%3;
	 		for (var i=rowStart;i<rowStart+3;i++) {
	 			for(var j=colStart;j<colStart+3;j++) {

	 			if (  (i!==coord[0] || j!=coord[1]) && this.cells[i][j].length !==1) {
	 				var str = this.cells[i][j].replace(number,'');
	 				match += str==this.cells[i][j]?0:1;
	 				this.cells[i][j] = str;
	 				if (str.length === 1) {this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'clearBlock',
	 					col: j,
	 					row: i,
	 					num:str }
	 					)}	 				
	 				}
				}	 		
	 		}
	 	}
	 } else {
	 	console.log("clearBlock:ord err");
	 }
	 return match;
}

Sudoku.prototype.reverseRow = function(row) {
	var match;
	var change =0;
	// console.log("row:"+row);
	if (row < 9 && row>=0) {
		for(var i=1;i<=9;i++) { //Test whether number is unique in a row 
			match = [];
			for (var j=0;j<9;j++) {

				if (this.cells[row][j].length !==1 ) {	
					// console.log(this.cells[row][j]);				
					this.cells[row][j].indexOf(i)>=0?match.push(j):null;
				}
			}
		// console.log("match:"+i+":"+match);
		if ( match.length===1) { this.cells[row][match[0]] = ""+i; change ++;return change;}	
		}
	} else {
	 	console.log("reverseRow:row err");		
	}
	return change;
};

Sudoku.prototype.reverseCol = function(col) {
	var match;
	var change =0;
	if (col < 9 && col>=0) {
		for(var i=1;i<=9;i++) { //Test whether number is unique in a col 
			match = [];
			for (var j=0;j<9;j++) {
				if (this.cells[j][col].length !==1 ) {					
					this.cells[j][col].indexOf(i)>=0?match.push(j):null;
				}
			}
		if ( match.length===1) { this.cells[match[0]][col] = ""+i; change ++;return change;}	
		}
	} else {
	 	console.log("reverseCol:col err");		
	}
	return change;
};

Sudoku.prototype.reverseBlock = function(block,debug) {
	var match,exist;
	var change =0;
	if (block < 9 && block>=0) {
		for (var num=1;num<=9;num++) {
			match= []; exist = '';

			for (var i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
				for (var j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
					if (this.cells[i][j].length!==1) {

						this.cells[i][j].indexOf(num)>=0?match.push([i,j]):null;
					} else {
						exist += this.cells[i][j];	
					}
				}
			}

			if (debug) { console.log(num+' :'+match+ '    = '+ exist);	}				

			if (match.length===1 && exist.indexOf(num)<0) {

				if ( getNumberInRow(this.cells,match[0][0]).indexOf(num) < 0 && getNumberInCol(this.cells,match[0][1]).indexOf(num)<0 ) {

					this.cells[match[0][0]][match[0][1]] = ""+num;
	 			    this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'reverseBlock',
	 					col: match[0][1],
	 					row: match[0][0],
	 					num: num+""}
	 					);
					change++;return change;
				}
			}	
		}
		// for(var i=1;i<=9;i++) { //Test whether number is unique in a row 
		// 	match = [];
		// 	for (var j=0;j<9;j++) {
		// 		if (this.cells[j][col].length !==1 ) {					
		// 			this.cells[j][col].indexOf(i)>=0?match.push(j):null;
		// 		}
		// 	}
		// if ( match.length===1) { this.cells[match[0]][col] = i; change ++;}	
		// }
	} else {
	 	console.log("reverseBlock:block err");		
	}
	return change;
};


Sudoku.prototype.reverse2Row = function(row) {
		var match;
	var change =0;
	var i='';
	if (row < 9 && row>=0) {
		for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
			for (var num2=num1;num2<=9;num2++ ) {
				i= num1+''+num2;
				match = [];
				for (var j=0;j<9;j++) {
					if (this.cells[row][j] === i ) {			
						match.push(j);
					}
				}
				if ( match.length===2) { 
					for (var j=0;j<9;j++) {
						if (this.cells[row][j].length > 1 && j!==match[0] && j!=match[1]) {			
			 				var str = this.cells[row][j].replace(num1,'');
			 				str = str.replace(num2,'');
	 						change += str==this.cells[row][j]?0:1;
	 						this.cells[row][j] =str;
			 				if (str.length === 1) {this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'reverse2Row',
			 					col: j,
			 					row: row,
			 					num:str }
			 					)}	
						}
				}
					return change;
				}	
			}
		}	
	} else {
	 	console.log("reverse2Row:row err");		
	}
	return change;

}


Sudoku.prototype.reverse2Col = function(col) {
	var match;
	var change =0;
	var i='';
	if (col < 9 && col>=0) {
		for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
			for (var num2=num1;num2<=9;num2++ ) {
				i= num1+''+num2;
				match = [];
				for (var j=0;j<9;j++) {
					if (this.cells[j][col] === i ) {			
						match.push(j);
					}
				}
				if ( match.length===2) { 
					for (var j=0;j<9;j++) {
						if (this.cells[j][col].length > 1 && j!==match[0] && j!=match[1]) {			
			 				var str = this.cells[j][col].replace(num1,'');
			 				str = str.replace(num2,'');
	 						change += str==this.cells[j][col]?0:1;
	 						this.cells[j][col] =str;
			 				if (str.length === 1) {this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'reverse2Col',
			 					col: col,
			 					row: j,
			 					num:str }
			 					)}		 						
						}
				}
					return change;
				}	
			}
		}	
	} else {
	 	console.log("reverse2Col:row err");		
	}
	return change;

}

Sudoku.prototype.reverse2Block = function(block) {
	var match;
	var change =0;
	var i='';
	if (block < 9 && block>=0) {
		for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
			for (var num2=num1;num2<=9;num2++ ) {
				i= num1+''+num2;
				match = [];
				for (var j=blockStart[block][0];j<blockStart[block][0]+3;j++) {
					for (var t=blockStart[block][1];t<blockStart[block][1]+3;t++) {
						if (this.cells[j][t] === i ) {			
							match.push([j,t]);
						}
					}	
				}
				if ( match.length===2) { 
					for (var j=blockStart[block][0];j<blockStart[block][0]+3;j++) {
						for (var t=blockStart[block][1];t<blockStart[block][1]+3;t++) {
							if (this.cells[j][t].length > 1 &&  j+''+t !== match[0].join('') && j+''+t !== match[1].join(''))  {			
				 				var str = this.cells[j][t].replace(num1,'');
				 				str = str.replace(num2,'');
		 						change += str==this.cells[j][t]?0:1;
		 						this.cells[j][t] =str;
				 				if (str.length === 1) {this.solution.push({
				 					cellsStr: cells2Str(this.cells),
				 					method: 'reverse2Block',
				 					col: t,
				 					row: j,
				 					num:str }
				 					)}			 						
							}
						}
					}	
					return change;
				}	
			}
		}	
	} else {
	 	console.log("reverse2Block:row err");		
	}
	return change;

}

Sudoku.prototype.checkValid= function() {
	var all ;
	for (var i=0;i<9;i++) { //row
		all = "123456789";
		for (var j=0;j<9;j++) {
		all = all.replace(this.cells[i][j],'');
		}
		if (all !=='') return false;
	}

	for (var i=0;i<9;i++) { //col
		all = "123456789";
		for (var j=0;j<9;j++) {
		all = all.replace(this.cells[j][i],'');
		}
		if (all !=='') return false;
	}

	for (var block=0;block<9;block++){
		all = "12345678"
		for (i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
			for (j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
				all = all.replace(this.cells[i][j],'');
			}
		}
		if (all !=='') return false;
	}
	return true;
	// body...
};
/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Sudoku = Sudoku;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Sudoku;  });