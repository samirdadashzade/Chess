// Taxt yaradilir

function createDesk() {

	rows = [8,7,6,5,4,3,2,1];
	colums = ['a','b','c','d','e','f','g','h'];
	turn = 0;

	for (i = 0; i < rows.length; i++) {
	 	var tr = document.createElement('tr');
	 	$(tr).attr('id', rows[i]);
	 	$('#chessDesk').append(tr);
	 	if (i%2 !== 1) {
	 		var firstCol = 'white';
	 		var secondCol = 'black';
	 	} else {
	 		var firstCol = 'black';
	 		var secondCol = 'white';
	}	
	for (x = 0; x < colums.length; x++) {
		var td = document.createElement('td');
		var rowId = '#' + rows[i];	
		if (x%2 !== 1) {
			$(td).attr('class', firstCol);
		} else {
			$(td).attr('class', secondCol);
		}
		$(td).attr('id', rows[i] + colums[x]);
		$(rowId).append(td);
	}}

}

function createSideBar() {

	$('.tablo').remove();
	var tablo = document.createElement('div');
	$(tablo).addClass('tablo');
	if (turn%2 === 0) {
		$(tablo).html("White's turn");
	} 
	if (turn%2 != 0) {
		$(tablo).html("Black's turn");
	}
	$('#left-side').append(tablo);

}

// Object olaraq figurlar formallashdirilir ve taxta yazilir, her figurun oz checkFields metodu olmalidi
function createSolders() {

	rook = {
		name: 'rook',
		black: '&#9820',
		white: '&#9814',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var upMoves=rows.slice(0,$.inArray(row,rows)).reverse();
			var downMoves=rows.slice($.inArray(row,rows)+1);
			var leftMoves=colums.slice(0,colum).reverse();
			var rightMoves=colums.slice(colum+1);
			pushPossibleMove(upMoves,target,possibleMoves,'colum',colum);
			pushPossibleMove(downMoves,target,possibleMoves,'colum',colum);
			pushPossibleMove(leftMoves,target,possibleMoves,'row',row);
			pushPossibleMove(rightMoves,target,possibleMoves,'row',row);
			return possibleMoves;
		}
	};
	knight = {
		name: 'knight',
		black: '&#9822',
		white: '&#9816',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [], count=1, addRow, addCol;
			//row up&down
			for(var i=0;i<=3;i++){
				switch(true){
					case (i==0):
						addRow=2;
						addCol=1;
						break;
					case (i==1):
						addRow=-2;
						addCol=1;
						break;
					case (i==2):
						addRow=1;
						addCol=2;
						break;	
					case (i==3):
						addRow=-1;
						addCol=2;
						break;
				}
				if((row+addRow)>0&&(row+addRow)<=8&&colums[colum+addCol]!=undefined){
					var cell='#'+(row+addRow)+colums[colum+addCol];
					if(checkType(target,cell)==true||checkType(target,cell)==null)
						possibleMoves.push(cell);
				}
				if((row+addRow)>0&&(row+addRow)<=8&&colums[colum-addCol]!=undefined){
					var cell='#'+(row+addRow)+colums[colum-addCol];
					if(checkType(target,cell)==true||checkType(target,cell)==null)
						possibleMoves.push(cell);
				}
			}

			return possibleMoves;
		}
		// move: function() {}
	};
	bishop = {
		name: 'bishop',
		black: '&#9821',
		white: '&#9815',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var totalRows=$.grep(rows,function(item){
			   	return item!=row;
			});			
			totalRows.forEach(function(item,index){
				if(colums[colum-(Math.abs(row-item))] !== undefined){
					var cell='#'+item+colums[colum-(Math.abs(row-item))];
					possibleMoves.push(cell);
				}
				if(colums[colum+(Math.abs(row-item))] !== undefined){
					var cell='#'+item+colums[colum+(Math.abs(row-item))];
					possibleMoves.push(cell);
				}
			});
			return possibleMoves;
		}
	};

	queen = {
		name: 'queen',
		black: '&#9818',
		white: '&#9812',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [], addRow=1;;
			for(var i=1;i<=2;i++){
				if((row+addRow)>0&&(row+addRow)<=8&&colums[colum]!=undefined){
					var cell='#'+(row+addRow)+colums[colum];
					if(checkType(target,cell) == null || checkType(target,cell) == true )
						possibleMoves.push(cell);
				}
				if((row+addRow)>0&&(row+addRow)<=8&&colums[colum+1]!=undefined){
					var cell='#'+(row+addRow)+colums[colum+1];
					if(checkType(target,cell) == null || checkType(target,cell) == true )
						possibleMoves.push(cell);
				}
				if((row+addRow)>0&&(row+addRow)<=8&&colums[colum-1]!=undefined){
					var cell='#'+(row+addRow)+colums[colum-1];
					if(checkType(target,cell) == null || checkType(target,cell) == true )
						possibleMoves.push(cell);
				}
				addRow=-1;
			}
			if(colums[colum-1]!=undefined){
				var cell='#'+row+colums[colum-1];
				if(checkType(target,cell) == null || checkType(target,cell) == true )
						possibleMoves.push(cell);
			}
			if(colums[colum+1]!=undefined){
				var cell='#'+row+colums[colum+1];
				if(checkType(target,cell) == null || checkType(target,cell) == true )
						possibleMoves.push(cell);
			}
			return possibleMoves;
		}
		// move: function() {}
	};

	king = {
		name: 'king',
		black: '&#9819',
		white: '&#9813',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [];

			var totalRows=$.grep(rows,function(item){
				return item!=row;
			});

			var totalCols=$.grep(colums,function(item,index){
				return index!=colum;
			});
			
			totalRows.forEach(function(item,index){
				// Queen xMoves	
				if(colums[colum-(Math.abs(row-item))]!==undefined){
					var cell='#'+item+colums[colum-(Math.abs(row-item))];
					possibleMoves.push(cell);
				}
				if(colums[colum+(Math.abs(row-item))]!==undefined){
					var cell='#'+item+colums[colum+(Math.abs(row-item))];
					possibleMoves.push(cell);
				}
				// Queen plus moves
				possibleMoves.push('#'+item+colums[colum]);
				possibleMoves.push('#'+row+totalCols[index]);
			});
			return possibleMoves;
		}
	};

	pawn = {
		name: 'pawn',
		black: '&#9823',
		white: '&#9817',
		checkFields: function(event) {
			var target = $(event.target);
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			if (target.attr('data-firstMove') == 0) {
				var moveRange = 3;
			} else {
				var moveRange = 2;
			}
			if (target.attr('data-side') === 'dark') {
				for(var i = 1; i < moveRange; i++) {
					var cell = '#'+ (row - i) + colums[colum];
					if ($(cell).html().length != 0) {break;}	
					possibleMoves.push(cell);
				}
				var rightField = '#' + (row - 1) + colums[colum + 1];
				var leftField = '#' + (row - 1) + colums[colum - 1];
			} else if (target.attr('data-side') === 'light') {
				for(var i = 1; i < moveRange; i++) {
					var cell = '#'+ (row + i) + colums[colum];
					if ($(cell).html().length != 0) {break;}	
					possibleMoves.push(cell);
				}
				var rightField = '#' + (row + 1) + colums[colum + 1];
				var leftField = '#' + (row + 1) + colums[colum - 1];
			}

			if ($(rightField).attr('data-side') != target.attr('data-side') && $(rightField).attr('data-side') != undefined) {
				possibleMoves.push(rightField);
			}
			if ($(leftField).attr('data-side') != target.attr('data-side') && $(leftField).attr('data-side') != undefined) {
				possibleMoves.push(leftField);
			}

			return possibleMoves;
		}
	};

	$('#8a').attr('name',rook.name).attr('data-side', 'dark').html(rook.black);
	$('#8b').attr('name',knight.name).attr('data-side', 'dark').html(knight.black);
	$('#8c').attr('name',bishop.name).attr('data-side', 'dark').html(bishop.black);
	$('#8d').attr('name',king.name).attr('data-side', 'dark').html(king.black);
	$('#8e').attr('name',queen.name).attr('data-side', 'dark').html(queen.black);
	$('#8f').attr('name',bishop.name).attr('data-side', 'dark').html(bishop.black);
	$('#8g').attr('name',knight.name).attr('data-side', 'dark').html(knight.black);
	$('#8h').attr('name',rook.name).attr('data-side', 'dark').html(rook.black);
	for (i=0; i<colums.length; i++) {
		$('#7'+colums[i]).attr('name',pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(pawn.black);
	}

	$('#1a').attr('name',rook.name).attr('data-side', 'light').html(rook.white);
	$('#1b').attr('name',knight.name).attr('data-side', 'light').html(knight.white);
	$('#1c').attr('name',bishop.name).attr('data-side', 'light').html(bishop.white);
	$('#1d').attr('name',king.name).attr('data-side', 'light').html(king.white);
	$('#1e').attr('name',queen.name).attr('data-side', 'light').html(queen.white);
	$('#1f').attr('name',bishop.name).attr('data-side', 'light').html(bishop.white);
	$('#1g').attr('name',knight.name).attr('data-side', 'light').html(knight.white);
	$('#1h').attr('name',rook.name).attr('data-side', 'light').html(rook.white);
	for (i=0; i<colums.length; i++) {
		$('#2'+colums[i]).attr('name',pawn.name).attr('data-side', 'light').attr('data-firstMove', 0).html(pawn.white);
	}
}

// Figur secilende ishiglandirilir ve objectin checkFields metodu vasitesi ile gede bileceyi yerler ishiglandirilmalidi
// Burada - var figure = window[$(this).children().attr('name')]; - kodu vasitesi ile taxtda olan html figurun name atributu (js objectlerin adi ile eynidi)
// 'figure'-ya variable olaraq yazilir ve belelikle figure vasitesi ile objectlerin istenilen metodunu cagirmaq olar.

function selectSolder() {

	activeCounter = 0;
	
	$('td').click(function(event){
		if ($(this).html().length > 0 && $(this).attr('data') !== 'active' && activeCounter === 0) {

			if (turn%2 != 0 && $(this).attr('data-side') === 'dark') {
				$(this).attr('data','active');
				$(this).addClass('active');
				activeCounter = 1;
				var figure = window[$(this).attr('name')];
				moves = figure.checkFields(event);
				for (var i = 0; i < moves.length; i++) {
					$(moves[i]).addClass('possibleMove');
				}
			} else if (turn%2 === 0 && $(this).attr('data-side') === 'light') {
				$(this).attr('data','active');
				$(this).addClass('active');
				activeCounter = 1;
				var figure = window[$(this).attr('name')];
				moves = figure.checkFields(event);
				for (var i = 0; i < moves.length; i++) {
					$(moves[i]).addClass('possibleMove');
				}
			}

 		} else if ($(this).attr('data') === 'active') {

 			$(this).removeAttr('data','active');
 			$(this).removeClass('active');
 			$('td').removeClass('possibleMove');
 			activeCounter = 0;

 		}
 	});
}		

// Secilmish figuru hereket etdirir
function move() {

	var clickCounter = 0;

	$('td').click(function(event){
		var target = event.target;
		clickCounter = 1;
		var activeFigure = $('#chessDesk').find('[data="active"]');

		if (activeFigure.length > 0 && clickCounter === 1 && $(this).html().length === 0 && moves.indexOf('#' + target.id) > -1) {
			$('#' + target.id).html(activeFigure.html());
			$('#' + target.id).attr('name', activeFigure.attr('name'));
			$('#' + target.id).attr('data-side', activeFigure.attr('data-side'));
			activeFigure.removeClass('active');
			activeFigure.removeAttr('data-side');
			activeFigure.removeAttr('data','active');
			activeFigure.removeAttr('name');
			$(activeFigure).empty();
			$('td').removeClass('possibleMove');
			activeCounter = 0;
			if(typeof($(target).attr('data-firstMove')) != undefined) {
				$(target).attr('data-firstMove',1);
			}
			turn++;
			console.log('Top func');
			createSideBar();
		} else if ($(this).html().length !== 0 && activeFigure.length > 0 && $(this).attr('data-side') !== activeFigure.attr('data-side') && moves.indexOf('#' + target.id) > -1) {
			$('#' + target.id).html(activeFigure.html());
			$('#' + target.id).attr('name', activeFigure.attr('name'));
			$('#' + target.id).attr('data-side', activeFigure.attr('data-side'));
			activeFigure.removeClass('active');
			activeFigure.removeAttr('data','active');
			activeFigure.removeAttr('name');
			$(activeFigure).empty();
			$('td').removeClass('possibleMove');
			activeCounter = 0;
			if($(target).attr('data-firstMove')) {
				$(target).attr('data-firstMove', 1);
			}
			turn++;
			console.log('bottom func');
			createSideBar();
		}
	});
}

function checkType(target,id){
	if($(id).attr('data-side')===target.attr('data-side')){
		return false;
	} else if($(id).attr('data-side')==undefined){
		return null;
	} else{
		return true;
	}
}

function pushPossibleMove(array,target,possibleMoves,columOrRow,number){
	for(var i=0;i<array.length;i++){
		if(arguments[3]==='colum'){
			var cell='#'+array[i]+colums[number];
		}else{
			var cell='#'+number+array[i];
		}
		if(checkType(target,cell)==null){
			possibleMoves.push(cell);
		}else if(checkType(target,cell)==true){
			possibleMoves.push(cell);
			break;
		}else{
			break;
		}
	};
}

$(document).ready(function(){
	createDesk();
	createSideBar();
	createSolders();
	selectSolder();
	move();
	console.log(turn);

});