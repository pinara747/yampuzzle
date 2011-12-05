//************************* Preload images and make an array of images *******************

var imagedir="images/";
function preload(){
	this.length=preload.arguments.length;
	for (var i=0;i<this.length;i++){
		this[i]=new Image();
		this[i].src=imagedir+preload.arguments[i];
	}
}


var pics=new preload(

"blankyam.jpg",//0 
"blankyam.jpg",//1 
"blankyam.jpg",//2 
"blankyam.jpg",//3 
"blankyam.jpg",//4 
"yammer_01.jpg",//5
"yammer_02.jpg",//6
"yammer_03.jpg",//7
"yammer_04.jpg",//8
"yammer_05.jpg",//9
"yammer_06.jpg",//10
"yammer_07.jpg",//11
"yammer_08.jpg",//12
"yammer_09.jpg",//13
"yammer_10.jpg",//14
"yammer_11.jpg",//15
"yammer_12.jpg",//16
"yammer_13.jpg",//17
"yammer_14.jpg",//18
"yammer_15.jpg",//19
"blankyam.jpg",//20 
"blankyam.jpg",//21 
"blankyam.jpg"//22

);



//************************* My Global Variables *******************
var position = new Array ();
var maxheight = 4;         //maximum height of board
var maxwidth = 4;        //maximum width of board
var height = 4;            //height of board; 2-maxheight
var wid = 4;            //width of board; 2-maxwidth
var numTiles = 15;           //Number of tiles, = wid*height-1. Only have provision for 2-digit numbers on display
var mode = 0;           //0=normal  1=solving scrambled  3=solving 4=pause playback solving
var sequence = new Array();  //solving sequenceuence...this array stores the tiles as the puzzle solves itself
var blankx,blanky;        //position of blank space

//************************* Display the Board *******************

function initiateBoard(){
	blankx=wid-1;
	blanky=height-1;
	for(i=0;i<=numTiles;i++) position[i]=i;
}

function displayBoard(k){
	var nameImage=0;  //name of screen image
	var numPositionBoard=0;  //position number on actual board
	var i,j;
	for (i=0;i<height;i++){
		for (j=0;j<wid;j++){
			if(position[nameImage]>=0 && position[nameImage]<numTiles){
				document.images["yam"+numPositionBoard].src=pics[4+((1+position[nameImage])%19)].src;
			}else{
				document.images["yam"+numPositionBoard].src=pics[22].src;
			}
			nameImage++;
			numPositionBoard++;
		}
		if(k){
			for (;j<4;j++){
				document.images["yam"+numPositionBoard].src=pics[22].src;
				numPositionBoard++;
			}
		}else{
			numPositionBoard+=4-j;
		}
	}
	if(k){
		for (;i<maxheight;i++){
			for (var j=0;j<maxwidth;j++){
				document.images["yam"+numPositionBoard].src=pics[22].src;
				numPositionBoard++;
			}
		}
	}
}
function display(k){
	displayBoard(k);
}

//************Make a Custom Alert Box*********************

function DisplayAlert(id) {
document.getElementById(id).style.display='block';
}


//************************* Construct the table for the Images *******************

document.writeln("<table cellpadding=0 cellspacing=0 border=0>");
var nameImage=0;
for(var i=0;i<maxheight;i++){
	document.writeln("<tr>");
	for(var j=0;j<maxwidth;j++){
		document.writeln("  <td width=20><a href='javascript:clicked("+i+","+j+");focus();'>"+
			"<img src='"+pics[22].src+"' height=158 width=158 border=1 style='border-color:#ffffff;' name='yam"+nameImage+"'>"+
			"<\/a><\/td>");
		nameImage++;
	}
	document.writeln("<\/tr>");
}
document.writeln("<\/table>");

//************************* Reset to original state *******************

function resetme(){
	initiateBoard();
	mode=0;
	display(0);
}

resetme();

function place(y,x){
	if(height+y>=2 && height+y<=maxheight && wid+x>=2 && wid+x<=maxwidth){
		height+=y;
		wid+=x;
		place=height*wid-1;
		initiateBoard();
		mode=0;
		display(1);
	}
}

function solved(){
	for (var i=numTiles;i>=0;i--){
		if(position[i]!=i) return(false);
	}
	return(true);
}

//*********************|\/| | \ / *******************************
//*********************|  | | / \ *******************************   

function scramble(){
	var i,j,nameImage=0;
	var tiles=new Array();
	for(i=0;i<=numTiles;i++) tiles[i]=i;
	tiles[numTiles-1]=-1;tiles[numTiles-2]=-1;
	for(i=0;i<height;i++){
		for(j=0;j<wid;j++){
			k=Math.floor(Math.random()*tiles.length);
			position[nameImage]=tiles[k];
			if(tiles[k]==numTiles) { blankx=j; blanky=i; }
			tiles[k]=tiles[tiles.length-1];
			tiles.length--;
			nameImage++;
		}
	}
	mode=1;
	filltwo();
}


function filltwo(){
	//since most tile puzzles are 50% unsolvable (a mathematical proof), this function prevents the last two tiles from ever being switched (which makes them unsolvable http://en.wikipedia.org/wiki/Fifteen_puzzle). 
	//First fill in last two tiles.
	var s1=-1;
	var s2=-1;
	for(var i=0;i<=numTiles;i++){
		if(position[i]==-1){
			if(s1<0) {
				s1=i;
				position[s1]=numTiles-1;
			}else{
				s2=i;
				position[s2]=numTiles-2;
				break;
			}
		}
	}
	//check permutation parity
	var c=0;
	for(var i=1;i<=numTiles;i++){
		for(var j=0;j<i;j++){
			if(position[j]>position[i])c++;
		}
	}
	//Check positionion of blank space; move to bottom right
	c+=(wid-1)-blankx+(height-1)-blanky;

	//if parity odd then swap
	if(c&1){
		position[s1]=numTiles-2;
		position[s2]=numTiles-1;
	}
	display(0);
}

//****************************** Make tiles Clickable **************************

function clicked(y,x){
	if (Math.abs(x - blankx) > 1 || Math.abs(y - blanky) > 1) {
		return;
	}
	var c=y*wid+x;
	if(mode!=4){  //do move
		if      (x==blankx && y<height){
			while(y>blanky) { move(2); show(blanky-1,blankx);}
			while(y<blanky) { move(1); show(blanky+1,blankx);}
		}else if (y==blanky && x<wid){
			while(x>blankx) { move(3); show(blanky,blankx-1);}
			while(x<blankx) { move(0); show(blanky,blankx+1);}
		}
		if(mode==3) { mode=0;}
		show(blanky,blankx);
		if(mode==1 && solved()){
			if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))){
			iPhoneAlertSolve();
		}
		else {
			DisplayAlert('Solve');
		}
			mode=0;
		}
	}

}
function show(y,x){
	// Use this to update display of just one tile; quicker than updating all with display.
	var c=y*wid+x;
	var d=y*maxwidth+x;
	if(position[c]>=0 && position[c]<numTiles){
		document.images["yam"+d].src=pics[4+((1+position[c])%19)].src;
	}else{
		document.images["yam"+d].src=pics[21].src;
	}
}

//*********************Puzzle Solves Itself (GASP!!!)***************

function push(){
	//push list onto list of moves for solution. Also does moves without showing them.
	for (var i=0;i<push.arguments.length;i++){
		var c=push.arguments[i];
		if(sequence.length && sequence[sequence.length-1]+c==3) sequence.length--;
		else sequence[sequence.length]=c;
		move(c);
	}
}

function move(m){  //0=right, 1=down, 2=up, 3=left
	//does move without showing it.
	var d=blankx+blanky*wid;
	if(m==0)     { position[d]=position[d-1  ]; position[d-1  ]=numTiles; blankx--; }
	else if(m==1){ position[d]=position[d-wid]; position[d-wid]=numTiles; blanky--; }
	else if(m==2){ position[d]=position[d+wid]; position[d+wid]=numTiles; blanky++; }
	else if(m==3){ position[d]=position[d+1  ]; position[d+1  ]=numTiles; blankx++; }
}


//Play back solution
var solvertimer;
function solverplay(){
	if(mode==4){
		// stop the play in progress
		clearTimeout(solvertimer);
		mode=3;

	}else if(mode!=2){
		// start play
		solve();
		if(mode==3){
			mode=4;
			solvertimer=setTimeout("play()", 10);

		}
	}
}
function play(){
	if(mode>=3){
		mode=4;
		solve();
		if(mode>=3) solvertimer=setTimeout("play()", 10);
	}else{

	}
}


var blocksolve=0;

function solve(){
	if(mode==0||mode==1){
		mode=3;blocksolve=1;
		sequence.length=0;

		//no solution set up yet. Construct it!
		//save pieces;
		var back = new Array();
		for(var i=0;i<=numTiles;i++) back[i]=position[i];
		back[numTiles+1]=blankx;
		back[numTiles+2]=blanky;

		//restore top rows
		var restoreRows=0;
		for(var r=0; r<height-2;r++){
			for(var c=0;c<wid;c++) movepiece(restoreRows+c,r,c);
			restoreRows+=wid;
		}

		//restore left columns
		for(c=0;c<wid-2;c++){
			//restore top tile of column.
			movepiece(restoreRows,height-2,c);
			//restore bottom tile of column
			if(blankx==c) push(3);  //fill destination spot
			if(position[restoreRows+wid]!=restoreRows+wid){
				movepiece(restoreRows+wid,height-1,c+1);
				if(blanky!=height-1) {    //0=right, 1=down, 2=up, 3=left
					//A.X or AX.
					//XBX    XBX
					if( blankx==c+1 ) push(3);
					push(2);
				}
				//AXX
				//XB.
				while( blankx>c+2 ) push(0);
				push(0, 0, 1, 3, 2, 3, 1, 0, 0, 2, 3);
			}
			restoreRows++;
		}
		//last 2x2 square
		if(blankx < wid-1) push(3);
		if(blanky<height-1) push(2);
		restoreRows=numTiles-wid-1;
		if(position[restoreRows]==restoreRows+1)   push(1,0,2,3);
		if(position[restoreRows]==restoreRows+wid) push(0,1,3,2);
		//restore pieces;
		for(var i=0;i<=numTiles;i++) position[i]=back[i];
		blankx=back[numTiles+1];
		blanky=back[numTiles+2];
		blocksolve=0;
	}

	if(mode>=3 && blocksolve==0){
		blocksolve=1;
		//do next move of prerecorded sequenceuence
		if(sequence.length){
			// var c=sequence.shift();
			var c=sequence[0];
			for(var i=1;i<sequence.length;i++) sequence[i-1]=sequence[i];
			sequence.length--;
			move(c);
			if(c==0) show(blanky,blankx+1);
			else if(c==1) show(blanky+1,blankx);
			else if(c==2) show(blanky-1,blankx);
			else if(c==3) show(blanky,blankx-1);
			show(blanky,blankx);
		}
		if(sequence.length==0) { mode=0;
			if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))){
			iPhoneAlert();
		}
		else {
			DisplayAlert('AutoSolve');
		}		
	}
		blocksolve=0;
	}
}
function movepiece(p,y,x){
	//moves piece p to positionion y,x without disturbing previously placed pieces.
	var c=-1;
	for(var i=0;i<height;i++){
		for(var j=0;j<wid;j++){
			c++;
			if(position[c]==p) break;
		}
		if(position[c]==p) break;
	}
	//Move piece to same column		    //0=right, 1=down, 2=up, 3=left
	if(j<x && blanky==y) push(2);	// move blank down if it might disturb solved pieces.
	while(j>x){
		//move piece to left
		//First move blank to left hand side of it
		if(blanky==i && blankx>j){	//if blank on wrong side of piece
			if(i==height-1) push(1); else push(2);	//then move it to other row
		}
		while(blankx>=j) push(0);	// move blank to column left of piece
		while(blankx<j-1) push(3);
		while(blanky<i) push(2);		// move blank to same row as piece
		while(blanky>i) push(1);
		push(3);					// move piece to left.
		j--;
	}
	while(j<x){
		//move piece to right
		//First move blank to right hand side of it
		if(blanky==i && blankx<j){
			if(i==height-1) push(1); else push(2);
		}
		while(blankx<=j) push(3);
		while(blankx>j+1) push(0);
		while(blanky<i) push(2);
		while(blanky>i) push(1);
		push(0);
		j++;
	}

	//Move piece up to same row		    //0=right, 1=down, 2=up, 3=left
	while(i>y){
		if(y<i-1){
			while(blanky<i-1) push(2);
			if(blankx==j) push( j==wid-1? 0:3);
			while(blanky>i-1) push(1);
			while(blankx<j) push(3);
			while(blankx>j) push(0);
			push(2);
		}else{
			if(j!=wid-1){
				if(blanky==i) push(2);
				while(blankx<j+1) push(3);
				while(blankx>j+1) push(0);
				while(blanky>i-1) push(1);
				while(blanky<i-1) push(2);
				push(0,2);
			}else{
				if(blanky<i && blankx==j){
					while(blanky<i) push(2);
				}else{
					while(blanky>i+1) push(1);
					while(blanky<i+1) push(2);
					while(blankx<j) push(3);
					while(blankx>j) push(0);
					push(1,1,0,2,3,2,0,1,1,3,2);
				}
			}
		}
		i--;
	}
	while(i<y){
		//move piece downwards
		//First move blank below tile
		if(blankx==j && blanky<i){
			if(j==wid-1) push(0); else push(3);
		}
		while(blanky>i+1) push(1);
		while(blanky<i+1) push(2);
		while(blankx<j) push(3);
		while(blankx>j) push(0);
		push(1);
		i++;
	}
}

// ********** For the iPhone *********//

function iPhoneAlert() {
if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))){
var message = alert("The program has solved the puzzle for you. Try to solve it yourself :) ");
    }
}

function iPhoneAlertSolve() {
if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))){
var message = alert("Congratulations! You solved the puzzle all by yourself! ^_^ ");
    }
}
