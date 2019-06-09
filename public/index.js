
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

function getNumberInBlk(cells,blk) {
	var numStr=''
	for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
		for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {
			if (cells[j][k].length==1) {
				numStr +=cells[j][k];
			}
		}	
	}
	return numStr;
}

function clearNum_incol(cells,block,col,num) {
	var rows =[];
	for(var i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
		if (cells[i][col].length>1) {
			cells[i][col] = cells[i][col].replace(num,'');
			if(cells[i][col].length ==1) {
				rows.push(i);
			}
		}
	}
	return rows;   // 返回移除这个数字的行的列表
}

function clearNum_inrow(cells,block,row,num) {
	var cols =[];
	for(var j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
		if (cells[row][j].length>1) {
			cells[row][j] = cells[row][j].replace(num,'');
			if(cells[row][j].length ==1) {
				cols.push(j);
			}			
		}
	}
	return cols;  // 返回移除这个数字的列的列表
}

function cells2Str(cells,possiblity) {
	var str = '';
	for (var i=0;i<9;i++) {
		for (var j=0;j<9;j++) {
			str += cells[i][j]+":";
		}
	}
	return str.substr(0,str.length-1);
}

function rmNuminBlock(cells,block,x,y,num) { // remove a number in block
	var celllist= [];
	// console.log(cells)
	for (var i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
		for (var j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
			if (x==i || y == j) {
				continue;
			}
			if (cells[i][j].length>1 && cells[i][j].indexOf(num)>=0) {
				celllist.push([i,j]);
			}
		}
	}
	return celllist;	// 被移除这个数字的格子
}

function getBlkfromPos(x,y) {
	if (x<0 || x> 8 || y<0 || y>8) {
		return -1;
	}
	return 3*parseInt(x/3)+parseInt(y/3);
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


Sudoku.prototype.clearRow = function(row) {
	var freenums = getNumberInRow(this.cells,row);
	// console.log('free:'+freenums);
	var match = 0;
	if (freenums.length >=9) return 0  //获得在这个列表中已经成解的数字
	for (var i=0;i<freenums.length;i++) {  //遍历所有可能的数字

		for (var j=0;j<9;j++) {
			// if (row==0 && j==1) {
				// console.log('cell::'+this.cells[row][j]);
			// }
			if ( this.cells[row][j].length>1 && this.cells[row][j].indexOf(freenums[i])>=0 ) {  //在这列中的格子如果有这个数字就删除
				// console.log('cell::'+this.cells[row][j]);
				this.cells[row][j]=this.cells[row][j].replace(freenums[i],'');
				if (this.cells[row][j].length==1) {
				    this.solution.push({
					cellsStr: cells2Str(this.cells),
					method: 'Clear Resolved Number- Row',
					row: row,
					col: j,
					num: freenums[i]+""
					});	
				}
				match++;
			}
		}
	}
    return match;
}


Sudoku.prototype.clearCol = function(col) {
	var freenums = getNumberInCol(this.cells,col);
	var match = 0;
	if (freenums.length<1) return 0  //获得在这个行中已经成解的数字
	for (var i=0;i<freenums.length;i++) {  //遍历所有可能的数字
		for (var j=0;j<9;j++) {
			if ( this.cells[j][col].length>1 && this.cells[j][col].indexOf(freenums[i])>=0 ) {  //在这行中的格子如果有这个数字就删除
				this.cells[j][col]=this.cells[j][col].replace(freenums[i],'');
				if (this.cells[j][col].length==1) {
				    this.solution.push({
					cellsStr: cells2Str(this.cells),
					method: 'Clear Resolved Number- Col',
					row: j,
					col: col,
					num: freenums[i]+""
					});	
				}
				match++;
			}
		}
	}
    return match;
}

Sudoku.prototype.clearBlk = function(blk) {
	var freenums = getNumberInBlk(this.cells,blk);
	var match = 0;
	if (freenums.length<1) return 0  //获得在这个行中已经成解的数字
	for (var i=0;i<freenums.length;i++) {  //遍历所有可能的数字
		for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
			for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {

				if ( this.cells[j][k].length>1 && this.cells[j][k].indexOf(freenums[i])>=0 ) {  //在这行中的格子如果有这个数字就删除
					this.cells[j][k]=this.cells[j][k].replace(freenums[i],'');
					if (this.cells[j][k].length==1) {
					    this.solution.push({
						cellsStr: cells2Str(this.cells),
						method: 'Clear Resolved Number- Blk',
						row: j,
						col: k,
						num: freenums[i]+""
						});	
					}					
					match++;
				}
			}	
		}
	}
	 return match;
}

// Sudoku.prototype.nakdedOne = function() {
// 	var result=0;
// 	for (var i=0;)
// };

Sudoku.prototype.hideOneRow = function(row) {
	var match=0,quantity=[];
	var change =0;
	var freenums = getFreeNumRow(this.cells,row);	
	for (var i=0;i<freenums.length;i++) {
		quantity[i]=[];
		for (var j=0;j<9;j++) {	
			if (this.cells[row][j].indexOf(freenums[i])>=0) {
				quantity[i].push(j);
			}		
		if (quantity[i].length>1) continue;
		}
	}

	for (var i=0;i<freenums.length;i++) {
		if (quantity[i].length==1) {
				this.cells[row][quantity[i][0]]=freenums[i];
			    this.solution.push({
				cellsStr: cells2Str(this.cells),
				method: 'HideOne Row',
				row: row,
				col: j,
				num: freenums[i]});				
				change++;
		}
	}
	return change;
};	

Sudoku.prototype.hideOneCol = function(col) {
	var match=0,quantity=[];
	var change =0;
	var freenums = getFreeNumCol(this.cells,col);	
	for (var i=0;i<freenums.length;i++) {
		quantity[i]=[];
		for (var j=0;j<9;j++) {	
			if (this.cells[j][col].indexOf(freenums[i])>=0) {
				quantity[i]++;
			}		
		if (quantity[i]>1) continue;
		}
	}

	for (var i=0;i<freenums.length;i++) {
		if (quantity[i].length==1) {
				this.cells[quantity[i]][col]=freenums[i];
			    this.solution.push({
				cellsStr: cells2Str(this.cells),
				method: 'HideOne Col',
				row: j,
				col: col,
				num: freenums[i]});
				change++;		
		}
	}
	return change;
};

Sudoku.prototype.hideOneBlk = function(blk) {
	var match=0,quantity=[];
	var change =0;
	var freenums = getFreeNumBlk(this.cells,blk);	
	for (var i=0;i<freenums.length;i++) {
		quantity[i] = []; 
		for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
			for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {
				if (this.cells[j][k].indexOf(freenums[i])>=0) {  //遍历这列找出有这个数字格子
				quantity[i].push(j,k);  //把行列保存一下
				}
			}			
		}
		if (quantity[i].length>2) continue;
	}

	for (var i=0;i<freenums.length;i++) {
		if (quantity[i].length==2) {   // 有且仅有一个格子有这个可能解
			this.cells[quantity[i][0]][quantity[i][1]]=freenums[i];
		    this.solution.push({
			cellsStr: cells2Str(this.cells),
			method: 'HideOne Blk',
			row: quantity[i][0],
			col: quantity[i][1],
			num: freenums[i]});
			change++;
		}	
	}
	return change;
};


Sudoku.prototype.nakedPairRow = function(row) {
	var match;
	var change =0;
	var i='';

	for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
		for (var num2=num1+1;num2<=9;num2++ ) {
			i= num1+''+num2;
			match = [];
			for (var j=0;j<9;j++) {
				if (this.cells[row][j] == i ) {			
					match.push(j);
				}
			}
			if ( match.length==2) { 
				for (var j=0;j<9;j++) {
					if (this.cells[row][j].length >1 && this.cells[row][j] != i) {	
						var len= this.cells[row][j].length
		 				this.cells[row][j] = this.cells[row][j].replace(num1,'').replace(num2,'');
	 				 	if (len== this.cells[row][j].length) continue;
		 				if (this.cells[row][j].length  ==1) {this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'NakedPair Row',
		 					row: row,
		 					col: j,
		 					num: num1+''+num2 }
	 					)} else {
		 					this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'NakedPair Row-Candidate reomve',
		 					row: row,
		 					col: j,
		 					num: num1+''+num2 }
		 					)
	 					}	
					}
					change++
				}

			}	
		}
	}		 
	return change;
}


Sudoku.prototype.nakedPairCol = function(col) {
	var match;
	var change =0;
	var i='';

	for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
		for (var num2=num1+1;num2<=9;num2++ ) {
			i= num1+''+num2;
			match = [];
			for (var j=0;j<9;j++) {
				if (this.cells[j][col] == i ) {			
					match.push(j);
				}
			}
			if ( match.length===2) { 
				for (var j=0;j<9;j++) {
					if (this.cells[j][col].length >1 && this.cells[j][col] != i) {
					// console.log('cell'+match+j);			
						var len = this.cells[j][col].length;
		 				this.cells[j][col] = this.cells[j][col].replace(num1,'').replace(num2,'');
		 				if (len==this.cells[j][col].length) continue;
		 				if (this.cells[j][col].length==1) {this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'NakedPair Col',
		 					row: j,
		 					col: col,
		 					num: num1+''+num2 }
	 						)
		 				} else {
		 					this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'NakedPair Col-Candidate reomve',
		 					row: j,
		 					col: col,
		 					num: num1+''+num2 }
	 						)		 					
		 				}
		 				change++;	
					}
				}
			}	
		}
	}	
	 
	return change;
}


Sudoku.prototype.nakedPairBlk = function(blk) {
	var match;
	var change =0;
	var i='';
	for(var num1=1;num1<=8;num1++) { //Test whether number is unique in a row 
		for (var num2=num1+1;num2<=9;num2++ ) {
			i= num1+''+num2;
			match = [];
			for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
				for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {
					if (this.cells[j][k] == i ) {			
						match.push(j,k);
					}
				}	
			}
			if ( match.length===4) { 
				// console.log(m)
				for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
					for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {
						if (this.cells[j][k].length >1 && this.cells[j][k] != i)  {	
							var len= this.cells[j][k].length;	
			 				this.cells[j][k] = this.cells[j][k].replace(num1,'').replace(num2,'');
			 				if (len==this.cells[j][k].length ) continue;
			 				if (this.cells[j][k].length == 1) {
			 					this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'NakedPair Block',
			 					row: j,
			 					col: k,
			 					num: num1+''+num2 }
			 					)
		 					} else {
			 					this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'NakedPair Block-candidate remove',
			 					row: j,
			 					col: k,
			 					num: num1+''+num2 }
			 					)		 						
		 					}
			 				change++;		
		 				}
	 						
					}
				}
			}	
		}	
	}
	return change;
}	


Sudoku.prototype.naked3Row = function(row) {
	var match;
	var change =0;
	var freenums= getFreeNumRow(this.cells,row);
	tripletList = genTripletFromList(freenums);
	if (tripletList.length == 0) return 0;
	// for ()
//
	if (row < 9 && row>=0) {
		for(var num1=1;num1<=7;num1++) { //Test whether number is unique in a row 
			for (var num2=num1+1;num2<=8;num2++ ) {
				for (var num3=num3+1;num3<=9;numb3++) {


					i= num1+''+num2+num3;
					match = [];
					for (var j=0;j<9;j++) {
						if (this.cells[row][j] === i ) {			
							match.push(j);
						}
					}
					if ( match.length===3) { 
						for (var j=0;j<9;j++) {
							if (this.cells[row][j].length > 1 && j!==match[0] && j!=match[1] && j!==match[2]) {			
				 				var str = this.cells[row][j].replace(num1,'');
				 				str = str.replace(num2,'');
				 				str = str.replace(num3,'');
		 						change += str==this.cells[row][j]?0:1;
		 						this.cells[row][j] =str;
				 				if (str.length === 1) {this.solution.push({
				 					cellsStr: cells2Str(this.cells),
				 					method: 'reverse3Row',
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
		}	
	} else {
	 	console.log("reverse2Row:row err");		
	}
	return change;

}

Sudoku.prototype.naked3Row = function(row) {
	var match=0,cellspos;
	var change =0;
	var freenums= getFreeNumRow(this.cells,row);
	var tripletList = genTripletFromList(freenums);
	if (tripletList.length == 0) return 0;
	// console.log('Triplet'+tripletList[2]);
	for (var k=0;k<tripletList.length;k++) {
		match = 0;
		cellspos =[];

		for (var j=0;j<9;j++) {
			if (tripletList[k].indexOf(this.cells[row][j])>=0) {
				match++;
				cellspos.push(''+i);					
			}		
		}
		if (match == 3) {
			for (var j=0;j<9;j++) {
				var originlen=this.cells[row][j].length;
				if (this.cells[row][j].length>1  &&  cellspos.indexOf(''+i)<0) {
					var tripes=tripletList[k][3].split('');// [3]是3个数（triplet组成的一个字符串
					for (var l=0;l<3;l++) {
						this.cells[row][j] = this.cells[row][j].replace(tripes[l],'');
					}
					if (this.cells[row][j].length != originlen) {
						change++;
		 				if (this.cells[row][j].length ==1) {this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'Nake Triplet - Row',
		 					col: j,
		 					row: row,
		 					num: tripletList[k] }
		 					)}								
					}
				}	
			}
		}
	}
	return change;
}

Sudoku.prototype.naked3Col = function(col) {
	var match=0,cellspos;
	var change =0;
	var freenums= getFreeNumCol(this.cells,col);
	var tripletList = genTripletFromList(freenums);
	if (tripletList.length == 0) return 0;
	// console.log('Triplet'+tripletList[2]);
	for (var k=0;k<tripletList.length;k++) {
		match = 0;
		cellspos =[];

		for (var i=0;i<9;i++) {
			if (tripletList[k].indexOf(this.cells[i][col])>=0) {
				match++;
				cellspos.push(''+i);					
			}		
		}
		if (match == 3) {
			for (var i=0;i<9;i++) {
				var originlen=this.cells[i][col].length;
				if (this.cells[i][col].length>1  &&  cellspos.indexOf(''+i)<0) {
					var tripes=tripletList[k][3].split('');// [3]是3个数（triplet组成的一个字符串
					for (var l=0;l<3;l++) {
						this.cells[i][col] = this.cells[i][col].replace(tripes[l],'');
					}
					if (this.cells[i][col].length != originlen) {
						change++;
		 				if (this.cells[i][col].length ==1) {this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'Nake Triplet - Col',
		 					col: col,
		 					row: i,
		 					num: tripletList[k] }
		 					)}								
					}
				}	
			}
		}
	}
	return change;
}

Sudoku.prototype.naked3Blk = function(blk) {
	var match=0,cellspos;
	var change =0;
	var freenums= getFreeNumBlk(this.cells,blk);
	var tripletList = genTripletFromList(freenums);
	if (tripletList.length == 0) return 0;
	var x=blockStart[blk][0],y=blockStart[blk][1];
	for (var k=0;k<tripletList.length;k++) {
		match = 0;
		cellspos =[];

		for (var i=x;i<x+3;i++) {
			for (var j=y;j<y+3;j++) {

				if (tripletList[k].indexOf(this.cells[i][j])>=0) {
					match++;
					cellspos.push(''+i+j);					
				}
			}
		}
		if (match == 3) {
			for (var i=x;i<x+3;i++) {
				for (var j=y;j<y+3;j++) {
					var originlen=this.cells[i][j].length;
					if (this.cells[i][j].length>1  &&  cellspos.indexOf(''+i+j)<0) {
						var tripes=tripletList[k][3].split('');// [3]是3个数（triplet组成的一个字符串

						for (var l=0;l<3;l++) {
							this.cells[i][j] = this.cells[i][j].replace(tripes[l],'');
						}
						if (this.cells[i][j].length != originlen) {
							change++;
			 				if (this.cells[i][j].length ==1) {this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'Nake Triplet - Block',
			 					col: i,
			 					row: j,
			 					num: tripletList[k] }
			 					)}								
						}
					}
				}
			}
		}
	}

	return change;

}

// 在一个Block中的，某个数字指示存在一列中，那在这一列的其他的2个Block中，这是数字是已经被占用的了
Sudoku.prototype.lcBlk_col = function (block) { //lc = locked candidates 
	// 检查这个Number是仅仅存在于这个Block的这列中
	var cols=[],num,change=0,match=0;
	for (num=1;num<10;num++) {  // 加让这个数字是否只存在这一列中
		if (isREsolveinBlk(this.cells,block,num)) {
			return 0;			
		}
		var celllist = getPosbyNum(this.cells,block,num)
		if (celllist.length>1) {
			var col = celllist[0][1];
			for (var i=1;i<celllist.length;i++) {
				if (col!=celllist[i][1]) {
					match = 0;
					break;
				}
				match=1;
			}
			if (match==1) {
				cols =clearNum_incol(this.cells,(block+3)%9,col,num);
				cols.concat(clearNum_incol(this.cells,(block+6)%9,col,num));
				for (var l=0;l<cols.length;l++) {
					this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'Remove num in col by a unique number in block',
	 					col: col,
	 					row: cols[l],
	 					num: num }
	 					)
				change += 1;
				}									
			}

		}

	}		
	return change;
}

// 在一个Block中的，某个数字指示存在一行中，那在这一行的其他的2个Block中，这是数字不是一个解
Sudoku.prototype.lcBlk_row = function (block) { //lc = locked candidates 
	// 检查这个Number是仅仅存在于这个Block的这行中
	var cols=[],num,change=0,match=0;
	for (num=1;num<10;num++) {  // 加让这个数字是否只存在这一列中
		if (isREsolveinBlk(this.cells,block,num)) {
			return 0;			
		}
		var celllist = getPosbyNum(this.cells,block,num)
		if (celllist.length>1) {
			var row = celllist[0][0];
			for (var i=1;i<celllist.length;i++) {
				if (row!=celllist[i][0]) {
					match = 0;
					break;
				}
				match=1;
			}
			if (match==1) {
				cols = clearNum_inrow(this.cells,(block+1)%3+3*parseInt(block/3),row,num);
				cols.concat(clearNum_inrow(this.cells,(block+2)%3+3*parseInt(block/3),row,num));
				for (var l=0;l<cols.length;l++) {
					this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'Remove num in row by a unique number in block',
	 					col: cols[l],
	 					row: row,
	 					num: num }
	 					)
				change += 1;
				}										
			}

		}

	}
	return change;
}

// 在一行中的，某个数字只是存在一个block中，那在这一Block的其他位置上，这个数字就不是解了
Sudoku.prototype.lcRow = function (row) { //lc = locked candidates 
	var match,blk,change=0;
	for (var num=1;num<10;num++) { // treaver all number
		if (isResolveinRow(this.cells,row,num)) {
			continue;
		}
		var cols = getColsbynum(this.cells,row,num)  // 获得所有有这个数字的列 ，已经有解的格子除外
		if (cols.length>1) {  //
			blk = getBlkfromPos(row,cols[0]);  //获得第一个列所在的格子
			for (var i=1;i<cols.length;i++) {
				if (blk != getBlkfromPos(row,cols[i])) {  //如果不在同一个格子中，直接退出循环
					match = 0;
					break;
				}
				match = 1;
			}
			if (match==1) { // match 代表同一个数字出现在同一个格子中，其他2个格子没有出现这个数字
				var celllist = rmNuminBlock(this.cells,blk,row,-1,num) //-1 的是x，
				for (i=0;i<celllist.length;i++) {
					this.cells[celllist[i][0]][celllist[i][1]] = this.cells[celllist[i][0]][celllist[i][1]].replace(num,'');
					if (this.cells[celllist[i][0]][celllist[i][1]].length==1) {
						this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'Remove num in block by a unique row number',
		 					col: celllist[i][1],
		 					row: celllist[i][0],
		 					num: num+'' }
		 					)							
					}
					change +=1;
				}
			}
		}
	}
	return change;
}




// 在一列中的，某个数字只是存在一个block中，那在这一Block的其他位置上，这个数字就不是解了
Sudoku.prototype.lcCol = function (col) { //lc = locked candidates 
	var match,blk,change=0;
	for (var num=1;num<10;num++) { // treaver all number
		if (isResolveinCol(this.cells,col,num)) {
			continue;
		}
		var rows = getRowsbynum(this.cells,col,num)  // 获得所有有这个数字的列 ，已经有解的格子除外
		// console.log("num:"+num+"rows"+rows+"length:"+rows.length);
		if (rows.length>1) {  //
			blk = getBlkfromPos(rows[0],col);  //获得第一个列所在的格子
			for (var i=1;i<rows.length;i++) {
				// if (num=='7') {console.log(blk+':')}
				if (blk != getBlkfromPos(rows[i],col)) {  //如果不在同一个格子中，直接退出循环
					match =0;
					break;
				}
				match = 1;
				// console.log("number:"+num)
			}

			if (match==1) { // match 代表同一个数字出现在同一个格子中，其他2个格子没有出现这个数字

				var celllist = rmNuminBlock(this.cells,blk,-1,col,num);
				// console.log(celllist);
				for (i=0;i<celllist.length;i++) {
					this.cells[celllist[i][0]][celllist[i][1]] = this.cells[celllist[i][0]][celllist[i][1]].replace(num,'');
					if (this.cells[celllist[i][0]][celllist[i][1]].length==1) {
						this.solution.push({
		 					cellsStr: cells2Str(this.cells),
		 					method: 'Remove num in block by a unique col number',
		 					col: celllist[i][1],
		 					row: celllist[i][0],
		 					num: num }
		 					)							
					}
					change +=1;
				}
			}
		}
	}
	if (this.cells[0][8]=='4589') {
		console.log(this.cells);
	}
	return change;	
}

// hidenpair是指有一对数字只在一个列的两个格子中出现，但是这两个格子中的可能解不止这两个数字
// 如果有这样的HidenPair，在相应的行，列，块中的其他格子中，需要移除这两个数字的可能性
Sudoku.prototype.hidePairsCol = function(col) {
	// 首先需要确定2个数字排列的可能性，已经解决的格子的数字可以排除；
	var quantity = [],candiate =[],match=0;
	var freenums = getFreeNumCol(this.cells,col);
	// 如果剩下的数字小于3 ，只存在3个数字需要解决，不可能存在HidenPair
	// console.log("free"+freenums);
	if (freenums.length<4) {
		return 0;
	}
	
	for (var i=0;i<freenums.length;i++) {
		quantity[i] = ''; 
		for (var j=0;j<9;j++) {
			if (this.cells[j][col].indexOf(freenums[i])>=0) {  //遍历这列找出有这个数字格子
				quantity[i] +=j
				// if (quantity[i]>2) continue;   //如果有2个以上的格子有这个数的可能性，这个数就不是HidenPair，继续找下一个数字				
			}			
		}
		// if （(quantity[i]<2)  continue;  // 如果只有1个格子有这个数的可能性，那就是HidenSingle 的方法，所以也跳过
		// candidate.push(freenums[i]);  // 所有有且仅有的在2个格子存在可能性的数字储存起来
	}

	for (i=0;i<freenums.length-1;i++) {
		if (quantity[i].length != 2) continue;
		for (j=i+1;j<freenums.length;j++) {

			if (quantity[i]==quantity[j]) {


				var row1 = parseInt(quantity[i][0]);
				var row2 = parseInt(quantity[i][1]);
				// console.log('row:'+row1+':'+row2)
				if (this.cells[row1][col].length+this.cells[row2][col].length>5)	{// 获得这两个格子的位置，并且判断这2个格子的可能解至少有一个是超过2个的，不然就不是hiden了
					match ++;
					this.cells[row1][col] = freenums[i]+''+freenums[j];
					this.cells[row2][col] = freenums[i]+''+freenums[j];
					this.solution.push({
			 					cellsStr: cells2Str(this.cells),
			 					method: 'HidePair col-Candidate remove',
			 					row: row1+' '+row2,
			 					col: col,
			 					num: freenums[i]+''+freenums[j]}
			 					);
				}			
			}
		}

	}
	return match;
}


Sudoku.prototype.hidePairsRow = function(row) {
	// 首先需要确定2个数字排列的可能性，已经解决的格子的数字可以排除；
	var quantity = [],candiate =[],match=0;
	var freenums = getFreeNumRow(this.cells,row);
	// 如果剩下的数字小于3 ，只存在3个数字需要解决，不可能存在HidenPair
	// console.log("free"+freenums);
	if (freenums.length<4) {
		return 0;
	}
	
	for (var i=0;i<freenums.length;i++) {
		quantity[i] = ''; 
		for (var j=0;j<9;j++) {
			if (this.cells[row][j].indexOf(freenums[i])>=0) {  //遍历这列找出有这个数字格子
				quantity[i] +=j
				// if (quantity[i]>2) continue;   //如果有2个以上的格子有这个数的可能性，这个数就不是HidenPair，继续找下一个数字				
			}			
		}
		// if （(quantity[i]<2)  continue;  // 如果只有1个格子有这个数的可能性，那就是HidenSingle 的方法，所以也跳过
		// candidate.push(freenums[i]);  // 所有有且仅有的在2个格子存在可能性的数字储存起来
	}

	for (i=0;i<freenums.length-1;i++) {
		if (quantity[i].length != 2) continue;
		for (j=i+1;j<freenums.length;j++) {

			if (quantity[i]==quantity[j]) {


				var col1 = parseInt(quantity[i][0]);
				var col2 = parseInt(quantity[i][1]);
				// console.log('row:'+row1+':'+row2)
				if (this.cells[row][col1].length+this.cells[row][col2].length>5)	{// 获得这两个格子的位置，并且判断这2个格子的可能解至少有一个是超过2个的，不然就不是hiden了
					match +=1;
					this.cells[row][col1] = freenums[i]+''+freenums[j];
					this.cells[row][col2] = freenums[i]+''+freenums[j];
					this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'HidePair in row-Candidate remove',
	 					col: col1+' '+col2,
	 					row: row,
	 					num: freenums[i]+''+freenums[j] }
	 					)	
				}			
			}
		}

	}
	return match;
}

Sudoku.prototype.hidePairsBlk = function(blk) {  
	// 首先需要确定2个数字排列的可能性，已经解决的格子的数字可以排除；
	var quantity = [],candiate =[],match=0;
	var freenums = getFreeNumBlk(this.cells,blk);
	// 如果剩下的数字小于3 ，只存在3个数字需要解决，不可能存在HidenPair
	// console.log("free"+freenums);
	console.log(freenums);
	if (freenums.length<4) {
		return 0;
	}
	
	for (var i=0;i<freenums.length;i++) {
		quantity[i] = ''; 
		for (var j=blockStart[blk][0];j<blockStart[blk][0]+3;j++) {
			for (var k=blockStart[blk][1];k<blockStart[blk][1]+3;k++) {
				if (this.cells[j][k].indexOf(freenums[i])>=0) {  //遍历这列找出有这个数字格子
				quantity[i] += j +''+ k;  //把行列保存一下
				}
			}			
		}
		// if （(quantity[i]<2)  continue;  // 如果只有1个格子有这个数的可能性，那就是HidenSingle 的方法，所以也跳过
		// candidate.push(freenums[i]);  // 所有有且仅有的在2个格子存在可能性的数字储存起来
	}
	console.log('quantity'+quantity);
	for (i=0;i<freenums.length-1;i++) {
		if (quantity[i].length != 4) continue;  // 长度4代表有2个格子
		for (j=i+1;j<freenums.length;j++) {

			if (quantity[i]==quantity[j]) {


				var row1 = parseInt(quantity[i][0]);
				var col1 = parseInt(quantity[i][1]);
				var row2 = parseInt(quantity[i][2]);
				var col2 = parseInt(quantity[i][3]);
				// console.log('row:'+row1+':'+row2)
				if (this.cells[row1][col1].length+this.cells[row2][col2].length>5)	{// 获得这两个格子的位置，并且判断这2个格子的可能解至少有一个是超过2个的，不然就不是hiden了
					match +=1;
					this.cells[row1][col1] = freenums[i]+''+freenums[j];
					this.cells[row2][col2] = freenums[i]+''+freenums[j];
					this.solution.push({
	 					cellsStr: cells2Str(this.cells),
	 					method: 'HidePair in blk - Candidate remove',
	 					col: col1+' '+col2,
	 					row: row1+' '+row2,
	 					num: freenums[i]+''+freenums[j] }
	 					)	
				}			
			}
		}

	}
	return match;
}

function getFreeNumBlk(cells,blk) {
	var cell= '123456789';
	for (var i=blockStart[blk][0];i<blockStart[blk][0]+3;i++) {
		for (var j=blockStart[blk][1];j<blockStart[blk][1]+3;j++) {
			// console.log('cell:'+i+j);
			if (cells[i][j].length ==1 ) {
				// console.log('cell:'+cells[i][j]);
				cell=cell.replace(cells[i][j],'');
			}
		}
		// console.log('cell'+cell)
	}
	// if (blk==0) console.log(cell)
	return cell.split('');
}



function getFreeNumCol(cells,col) {
	var cell= '123456789';
	for (var i=0;i<9;i++) {
		if (cells[i][col].length ==1 ) {
			// console.log('cell:'+cells[i][col]);
			cell=cell.replace(cells[i][col],'');
		}
		// console.log('cell'+cell)
	}
	return cell.split('');
}

function getFreeNumRow(cells,row) {
	var cell= '123456789';
	for (var i=0;i<9;i++) {
		if (cells[row][i].length ==1 ) {
			// console.log('cell:'+cells[i][col]);
			cell=cell.replace(cells[row][i],'');
		}
		// console.log('cell'+cell)
	}
	return cell.split('');
}

function isResolveinCol(cells,col,num){
	for (var i=0;i<9;i++) {
		if (cells[i][col]==num) {
			return 1;
		}
	}
	return 0;
}

function isResolveinRow(cells,row,num){
	for (var i=0;i<9;i++) {
		if (cells[row][i]==num) {
			return 1;
		}
	}
	return 0;
}

function isREsolveinBlk(cells,blk,num){
	for (var i=blockStart[blk][0];i<blockStart[blk][0]+3;i++) {
		for (var j=blockStart[blk][1];j<blockStart[blk][1]+3;j++) {
			if (cells[i][j]==num) {
				return 1;
			}
		}
	}
	return 0;
}

function getRowsbynum(cells,col,num) {
	var rows =[];
	for (var i=0;i<9;i++) {
		if (cells[i][col].length > 1 && cells[i][col].indexOf(num)>=0) {
			rows.push(i)
		}
	}
	return rows;
}

function getColsbynum(cells,row,num) {
	var cols =[];
	for (var i=0;i<9;i++) {
		if (cells[row][i].length > 1 && cells[row][i].indexOf(num)>=0) {
			cols.push(i);
		}
	}
	return cols;
}

function getPosbyNum(cells,blk,num) {
	var list =[];
	for (var i=blockStart[blk][0];i<blockStart[blk][0]+3;i++) {
		for (var j=blockStart[blk][1];j<blockStart[blk][1]+3;j++) {
			if (cells[i][j].length>1 && cells[i][j].indexOf(num)>=0) {
				list.push([i,j])
			}
		}
	}
	return list;	

}

function genTripletFromList(nums) {
	var tripletList = [];
	var numslen = nums.length;
	if (numslen<4) return tripletList;
	
	for (var i=0;i<numslen-2;i++) {
		for (var j=i+1;j<numslen-1;j++) {
			for (var k=j+1;k<numslen;k++) {
				tripletList.push([''+nums[i]+nums[j],''+nums[i]+nums[k],''+nums[j]+nums[k],''+nums[i]+nums[j]+nums[k]]);
			}
		}
	}
	return tripletList;
}

function checkmulnum_inarow(cells,block,x,num) {   // x是行,Number 具体数字
	 var match = 0;
	 if (isResolveinRow(cells,x,num)) {
	 	return 0;
	 }
     for (var i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
 		if (i==x) {  // 如何和J是同一行，需要Check有没有这个Num，如果没有返回False，如果有就继续		
     		for (var j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
     			if (cells[i][j].length>1) {
     				if (cells[i][j].indexOf(num)>=0) {
     					match = 1;
     					break;
     				}
     			}
     		}
     		// console.log("Match:"+match)
     		if (match==0) {
     			return 0;
     		} else {
     			continue;
     		}
     		
     	}
     	for (j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
     		if (cells[i][j].indexOf(num) >=0) {return 0;}
     	}

     }
     return 1;
}

function checkmulnum_inacol(cells,block,y,num) {   // y是列，Number 具体数字
	 var match = 0;
	 // console.log('block:'+block);
	 // console.log(y+'--'+num)
	 if (isResolveinCol(cells,y,num)) {
	 	return 0;
	 }
     for (var j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
 		if (j==y) {  // 如何和J是同一列，需要Check有没有这个Num，如果没有返回False，如果有就继续		
     		for (var i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
     			if (cells[i][j].length>1) {
     				if (cells[i][j].indexOf(num)>=0) {
     					match = 1;
     					break;
     				}
     			}
     		}
     		// console.log("Match:"+match)
     		if (match==0) {
     			return 0;
     		} else {
     			continue;
     		}
     		
     	}
     	for (i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
     		if (cells[i][j].indexOf(num) >=0) {return 0;}
     	}

     }
     return 1;
}


Sudoku.prototype.testvalid = function() {
	var stack = [2,3,4];
	var solution =[];
	var result = [];
	tr(stack,solution,result);

} 




Sudoku.prototype.bruteresolve = function() {
	var cellstack = [];
	for (var i=0;i<9;i++) {
		for (var j=0;j<9;j++) {
			if (this.cells[i][j].length>1) {				
				cellstack.push([i,j,this.cells[i][j]])
			}
		}
	}
	var results =[];
	var solutions = [];
	var match = 0;
	var pos;
	var result =traverse(this.cells,cellstack,solutions,results);
	if (result.length==1) {
		for (i=0;i<result[0].length;i++) {
			var pos = cellstack[i];
			this.cells[pos[0]][pos[1]] = pos[2][parseInt(result[0][i])];
		}
		this.solution.push({
				cellsStr: cells2Str(this.cells),
				method: 'Brtute Resolve',
				col: 0,
				row: 0,
				num: "Final" }
				)		
		return 1;
	}
	// console.log(this.cells)
	return 0;
}

function traverse(cell,stack,solution,results) {
	var pos;
	var end;
	var newcell=[];
	// console.log("st:"+stack.length+'sl:'+solution.length)
	if (stack.length > solution.length) {
		// if (solution.length>18) {
		// 	console.log("st:"+stack.length+'sl:'+solution.length)
		// }

		for (var k=0;k<stack[solution.length][2].length;k++) {
			// console.log(cell);
			pos=stack[solution.length];
			// console.log(pos);

			newcell = copy(cell);
			newcell[pos[0]][pos[1]]=pos[2][k];
			for (var l=0;l<solution.length;l++) {
				var pos1 = stack[l];
				newcell[pos1[0]][pos1[1]]=pos1[2][solution[l]];
			}
			newcell[pos[0]][pos[1]]=pos[2][k];
			// }
			if (!checkValids(newcell)) {
				continue;
			}			
			solution.push(k); 		
			results=traverse(cell,stack,solution,results);
			// if (results.length >0) {
			// 	console.log('answer:'+results[0]);
			// }
		} 
		solution.pop();	
		return results;
	} else {

		console.log("Good!")
		// console.log("st:"+stack.length+'sl:'+solution.length)	

		// RESULT.push(solution);
		results.push(solution.join(''));
		solution.pop();	
		console.log(results)
		// console.log(RESULT);

		return results;
	}
}

function copy(cell) {
	var newcell=[];
   	for (var i=0;i<9;i++) {
   		newcell.push([]);
   		for (var j=0;j<9;j++) {
   			newcell[i].push(cell[i][j]);
	   	}
    }

    return newcell; 
}



function checkValids(cells) {
	var all;
	var x,y,k,l;
	for (var i=0;i<9;i++){
		for (var j=0;j<9;j++){
			if (cells[i][j].length>1) {
				continue;
			}

			// check row
			for (var k=0;k<9;k++) {
				if (k!=j) {
					if (cells[i][j] == cells[i][k]) {
						// console.log('row'+i+j+k+':'+cells[i][j]);
						return 0;
					}
				}
			}
			// check col
			for (var k=0;k<9;k++) {
				if (k!=i) {
					if (cells[i][j] == cells[k][j]) {
						// console.log('col'+i+j+k+':'+cells[i][j]);
						return 0;
					}
				}
			}			
			// check block
			x = [i,(i+1)%3+parseInt(i/3)*3,(i+2)%3+parseInt(i/3)*3] 
			y = [j,(j+1)%3+parseInt(j/3)*3,(j+2)%3+parseInt(j/3)*3]
			for (k=0;k<3;k++) {
				for (l=0;l<3;l++) {
					if (x[k] !=i && y[l]!=j && cells[i][j]==cells[x[k]][y[l]]) {
						// console.log('block:'+i+j+k+l+':'+cells[i][j]);
						return 0;
					}
				}
			}


		}
	}

	return 1;

};


Sudoku.prototype.checkValid= function() {
	var all;
	for (var i=0;i<9;i++) { //row
		all = "123456789";
		for (var j=0;j<9;j++) {
			if (this.cells[i][j].length==1) {
				all = all.replace(this.cells[i][j],'');
			}	
		}
		if (all !=='') return false;
	}

	for (var i=0;i<9;i++) { //col
		all = "123456789";
		for (var j=0;j<9;j++) {
			if (this.cells[i][j].length==1) {
				all = all.replace(this.cells[i][j],'');
			}
		}
		if (all !=='') return false;
	}

	for (var block=0;block<9;block++){
		all = "12345678"
		for (i=blockStart[block][0];i<blockStart[block][0]+3;i++) {
			for (j=blockStart[block][1];j<blockStart[block][1]+3;j++) {
				if (this.cells[i][j].length==1) {
					all = all.replace(this.cells[i][j],'');
				}	
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