// Taxt yaradilir
function createDesk() {

	rows = [8,7,6,5,4,3,2,1];
	colums = ['a','b','c','d','e','f','g','h'];

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
			var totalRows=$.grep(rows,function(item){
				return item!=row;
			});
			var totalCols=$.grep(colums,function(item,index){
				return index!=colum;
			});
			
			totalRows.forEach(function(item,index){
				if(colum!=-1){
					possibleMoves.push('#'+item+colums[colum]);
					possibleMoves.push('#'+row+totalCols[index]);
				}
			});
			return possibleMoves;
		}
	};
	knight = {
		name: 'knight',
		black: '&#9822',
		white: '&#9816'
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
				if(colum!=-1){
					if(colums[colum-(Math.abs(row-item))]!==undefined){
						var cell='#'+item+colums[colum-(Math.abs(row-item))];
						possibleMoves.push(cell);
					}
					if(colums[colum+(Math.abs(row-item))]!==undefined){
						var cell='#'+item+colums[colum+(Math.abs(row-item))];
						possibleMoves.push(cell);
					}
				}
			});
			return possibleMoves;
		}
	};

	queen = {
		name: 'queen',
		black: '&#9818',
		white: '&#9812',
		// move: function() {}
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
				if(colum!=-1){
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
				}
			});
			return possibleMoves;
		}
	};

	king = {
		name: 'king',
		black: '&#9819',
		white: '&#9813'
		// move: function() {}

	};

	pawn = {
		name: 'pawn',
		black: '&#9823',
		white: '&#9817'
		// move: function() {}

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
		$('#7'+colums[i]).attr('name',pawn.name).attr('data-side', 'dark').html(pawn.black);
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
		$('#2'+colums[i]).attr('name',pawn.name).attr('data-side', 'light').html(pawn.white);
	}
}

// Figur secilende ishiglandirilir ve objectin checkFields metodu vasitesi ile gede bileceyi yerler ishiglandirilmalidi
// Burada - var figure = window[$(this).children().attr('name')]; - kodu vasitesi ile taxtda olan html figurun name atributu (js objectlerin adi ile eynidi)
// 'figure'-ya variable olaraq yazilir ve belelikle figure vasitesi ile objectlerin istenilen metodunu cagirmaq olar.

function selectSolder() {

 	activeCounter = 0;
 	
 	$('td').click(function(event){
 		if ($(this).length > 0 && $(this).attr('data') !== 'active' && activeCounter === 0) {
 			$(this).attr('data','active');
 			$(this).addClass('active');
 			activeCounter = 1;
 			var figure = window[$(this).attr('name')];
 			moves = figure.checkFields(event);
 			for (var i = 0; i < moves.length; i++) {
 				$(moves[i]).addClass('possibleMove');
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

		if (activeFigure.length > 0 && clickCounter === 1 && $(this).html().length === 0) {
			if (moves.indexOf('#' + target.id) > -1) {
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
			}
		} else if ($(this).html().length !== 0 && $(this).attr('data-side') !== activeFigure.attr('data-side')) {
			$('#' + target.id).html(activeFigure.html());
			$('#' + target.id).attr('name', activeFigure.attr('name'));
			$('#' + target.id).attr('data-side', activeFigure.attr('data-side'));
			activeFigure.removeClass('active');
			activeFigure.removeAttr('data','active');
			activeFigure.removeAttr('name');
			$(activeFigure).empty();
			$('td').removeClass('possibleMove');
			activeCounter = 0;
		}
		// console.log($(this).attr('data-side') !== activeFigure.attr('data-side'));
	});
}


$(document).ready(function(){

	createDesk();
	createSolders();
	selectSolder();
	move();

});