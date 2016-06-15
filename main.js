function createDesk() {

	rows = [8,7,6,5,4,3,2,1];
	colums = ['a','b','c','d','e','f','g','h'];

	for (i = 0; i < rows.length; i++) {
	 	var tr = document.createElement('tr');
	 	$(tr).attr('id', i);
	 	$('#chessDesk').append(tr);
	 	if (i%2 != 1) {
	 		var firstCol = 'white';
	 		var secondCol = 'black';
	 	} else {
	 		var firstCol = 'black';
	 		var secondCol = 'white';
	}	
	for (x = 0; x < colums.length; x++) {
		var td = document.createElement('td');
		var rowId = '#' + i;	
		if (x%2 != 1) {
			$(td).attr('class', firstCol);
		} else {
			$(td).attr('class', secondCol);
		}
		$(td).attr('id', rows[i] + colums[x])
		$(rowId).append(td);
	}}
}

function createSolders() {

	rook = {
		name: 'Rook',
		black: '&#9820',
		white: '&#9814'
		// move: function() {}

	}

	knight = {
		name: 'Rook',
		black: '&#9822',
		white: '&#9816'
		// move: function() {}

	}

	bishop = {
		name: 'Rook',
		black: '&#9821',
		white: '&#9815'
		// move: function() {}

	}

	queen = {
		name: 'Rook',
		black: '&#9818',
		white: '&#9812'
		// move: function() {}

	}

	king = {
		name: 'Rook',
		black: '&#9819',
		white: '&#9813'
		// move: function() {}

	}

	pawn = {
		name: 'Rook',
		black: '&#9823',
		white: '&#9817'
		// move: function() {}

	}

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

function selectSolder() {

	activeCounter = 0;
	
	$('td').click(function(){

		if ($(this).length > 0 && $(this).attr('data') != 'active' && activeCounter === 0) {
			$(this).attr('data','active');
			$(this).addClass('active');
			activeCounter = 1;
		} else if ($(this).attr('data') === 'active') {
			$(this).removeAttr('data','active');
			$(this).removeClass('active');
			activeCounter = 0;
		}

 	})
}	

function move() {

	var clickCounter = 0;

	$('td').click(function(event){
		var target = event.target;
		console.log(target.id);
		
		clickCounter = 1;
		var activeFigure = $('#chessDesk').find('[data="active"]');
		if (activeFigure.length > 0 && clickCounter === 1 && $(this).html().length == 0) {
			$('#' + target.id).html(activeFigure.html());
			activeFigure.removeClass('active');
			activeFigure.removeAttr('data','active');
			activeFigure.html(' ');
			activeCounter = 0;
		}
	})
}

$(document).ready(function(){

	createDesk();
	createSolders();
	selectSolder();
	move();

});