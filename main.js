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
		white: '&#9814'
		// move: function() {}
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
			var target = $(event.target).parent();
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = colums.indexOf(fieldData[1])+1;
			var possibleMoves = [];
			for (var i = 1; i <= 3; i++ ) {
				if (colums[(colum - i) - 1] === undefined) {
					var leftField = null;
				} else {
					var leftField = '#' + (row - i) + colums[(colum - i) - 1];
					possibleMoves.push(leftField);
				}

				if (colums[(colum + i) - 1] === undefined) {
					var rightField = null;
				} else {
					var rightField = '#' + (row - i) + colums[(colum + i) - 1];
					possibleMoves.push(rightField);
				}
			}
			// return possibleMoves;
			for (var i = 0; i < possibleMoves.length; i++) {
				$(possibleMoves[i]).addClass('possibleMove');
			}
		}
	};

	queen = {
		name: 'queen',
		black: '&#9818',
		white: '&#9812',
		// move: function() {}
		checkFields: function(event) {
			var target = $(event.target).parent();
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

			for (var i = 0; i < possibleMoves.length; i++) {
				$(possibleMoves[i]).addClass('possibleMove');
			}
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

	$('#8a').html('<a class="figure" name=' + rook.name + '>'+ rook.black +'</a>');
	$('#8b').html('<a class="figure" name=' + knight.name + '>'+ knight.black +'</a>');
	$('#8c').html('<a class="figure" name=' + bishop.name + '>'+ bishop.black +'</a>');
	$('#8d').html('<a class="figure" name=' + king.name + '>'+ king.black +'</a>');
	$('#8e').html('<a class="figure" name=' + queen.name + '>'+ queen.black +'</a>');
	$('#8f').html('<a class="figure" name=' + bishop.name + '>'+ bishop.black +'</a>');
	$('#8g').html('<a class="figure" name=' + knight.name + '>'+ knight.black +'</a>');
	$('#8h').html('<a class="figure" name=' + rook.name + '>'+ rook.black +'</a>');

	for (i=0; i<colums.length; i++) {
		$('#7'+colums[i]).html('<a class="figure" name=' + pawn.name + '>'+ pawn.black +'</a>');
	}

	$('#1a').html('<a class="figure" name=' + rook.name + '>'+ rook.white +'</a>');
	$('#1b').html('<a class="figure" name=' + knight.name + '>'+ knight.white +'</a>');
	$('#1c').html('<a class="figure" name=' + bishop.name + '>'+ bishop.white +'</a>');
	$('#1d').html('<a class="figure" name=' + king.name + '>'+ king.white +'</a>');
	$('#1e').html('<a class="figure" name=' + queen.name + '>'+ queen.white +'</a>');
	$('#1f').html('<a class="figure" name=' + bishop.name + '>'+ bishop.white +'</a>');
	$('#1g').html('<a class="figure" name=' + knight.name + '>'+ knight.white +'</a>');
	$('#1h').html('<a class="figure" name=' + rook.name + '>'+ rook.white +'</a>');

	for (i=0; i<colums.length; i++) {
		$('#2'+colums[i]).html('<a class="figure" data="pawn">&#9817</a>');
	}
}

// Figur secilende ishiglandirilir ve objectin checkFields metodu vasitesi ile gede bileceyi yerler ishiglandirilmalidi
// Burada - var figure = window[$(this).children().attr('name')]; - kodu vasitesi ile taxtda olan html figurun name atributu (js objectlerin adi ile eynidi)
// 'figure'-ya variable olaraq yazilir ve belelikle figure vasitesi ile objectlerin istenilen metodunu cagirmaq olar.

function selectSolder() {

	activeCounter = 0;
	
	$('td').click(function(event){
		$('td').removeClass('possibleMove');
		if ($(this).length > 0 && $(this).attr('data') !== 'active' && activeCounter === 0) {
			$(this).attr('data','active');
			$(this).addClass('active');
			activeCounter = 1;
			var  figure = window[$(this).children().attr('name')];
			console.log(figure.checkFields(event));
		} else if ($(this).attr('data') === 'active') {
			$(this).removeAttr('data','active');
			$(this).removeClass('active');
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
			$('#' + target.id).html(activeFigure.html());
			activeFigure.removeClass('active');
			activeFigure.removeAttr('data','active');
			activeFigure.html(' ');
			activeCounter = 0;
		}
	});
}

// Secilmish figurun gede bileceyi yerleri ishiqlandirmalidi. Uzerinde ishlemek lazimdi, bunu ya her bir objectin daxilinde checkFileds
// metodunun icinde istifade etmek lazimdi, yada bashqa bir yerde

// function showMoves() {
//	for (var i = 0; i < possibleMoves.length; i++) {
//		$(possibleMoves[i]).addClass('possibleMove');
//	}
//	console.log(possibleMoves);
// }
// showMoves();




$(document).ready(function(){

	createDesk();
	createSolders();
	selectSolder();
	move();
	// showMoves();

});