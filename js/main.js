// Board object
Board = {

	// General Data
	rows: [8,7,6,5,4,3,2,1],
	colums: ['a','b','c','d','e','f','g','h'],
	turn: 0,
	log: [],
	killedDarks: [],
	killedLights: [],
	// Creat new board
	createDesk: function() {
		// creating tr for each board row
		for (i = 0; i < this.rows.length; i++) {
			var tr = document.createElement('tr');
			$(tr).attr('id', this.rows[i]);
			$('#chessDesk').append(tr);
			// variables for field colors (alternation)
			if (i % 2 !== 1) {
				var firstCol = 'white';
				var secondCol = 'black';
			} else {
				var firstCol = 'black';
				var secondCol = 'white';
			}
			// creating td for each colum with different colors
			for (x = 0; x < this.colums.length; x++) {
			 	var td = document.createElement('td');
			 	var rowId = '#' + this.rows[i];	
			 	if (x % 2 !== 1) {
			 		$(td).attr('class', firstCol);
			 	} else {
			 		$(td).attr('class', secondCol);
			 	}
			 	$(td).attr('id', this.rows[i] + this.colums[x]);
			 	$(rowId).append(td);
			}	
		}
	},
	// Board side bar
	createSideBar: function() {
		// Show turn
		$('#turn').empty();
		var turnHeader = document.getElementById('#turn');
		if (this.turn % 2 === 0) {
			$(turnHeader).html("White's turn");
		} 
		if (this.turn % 2 != 0) {
			$(turnHeader).html("Black's turn");
		}
		// Show log
		$('#log').empty();
		for (var i = 0; i < Board.log.length; i++) {
			$('#log').prepend(Board.log[i]);
		}
		// Reset button
		$('#reset').remove();
		var reset = document.createElement('button');
		$(reset).attr('id', 'reset');
		$(reset).html('Restart game');
		$(reset).attr('onclick', 'Game.resetGame()');
		$('#left-side').append(reset);

		// Killed soldiers
		$('.darks').remove();
		$('.lights').remove();
		$('.killedSoldiers').remove();
		var killedSoldiers =document.createElement('div');
		$(killedSoldiers).addClass('killedSoldiers');
		$('#left-side').append(killedSoldiers);
		var darks = document.createElement('ul');
		$(darks).addClass('darks');
		var lights = document.createElement('ul');
		$(lights).addClass('lights');
		$('.killedSoldiers').append(darks, lights);
		$('.darks').append('<li>Black soldiers</li>');
		$('.lights').append('<li>White soldiers</li>');
		for (var i = 0; i < this.killedDarks.length; i++) {
			$('.darks').append('<li>' + this.killedDarks[i] + '</li>');
		}
		for (var i = 0; i < this.killedLights.length; i++) {
			$('.lights').append('<li>' + this.killedLights[i] + '</li>');
		} 
	},
	rewriteField: function(target, activeFigure) {

		$('#' + target.id).html(activeFigure.html());
		$('#' + target.id).attr('name', activeFigure.attr('name'));
		$('#' + target.id).attr('data-side', activeFigure.attr('data-side'));
		if($(activeFigure).attr('data-firstMove') == 0) {
			$(target).attr('data-firstMove', 1);
		} else if ($(activeFigure).attr('data-firstMove')) {
			$(target).attr('data-firstMove', $(activeFigure).attr('data-firstMove'));
		}

		if ($(activeFigure).attr('name') == 'queen') {
			//if queen is playing check that if it moves 2 cells right or left
			var kingCol=Board.colums.indexOf($(activeFigure).attr('id').split('')[1]);
			var targetCol=Board.colums.indexOf($(target).attr('id').split('')[1]);
			var diff = kingCol-targetCol;
			var castlingRook=$('#chessDesk').find('[data-castling=1]');
			if(diff==2){
				//left castling
				var kingLeftCell=$(activeFigure).prev()[0];
				Board.rewriteField(kingLeftCell,castlingRook);
			}else if(diff==-2){
				//right castling
				var kingRightCell=$(activeFigure).next()[0];
				Board.rewriteField(kingRightCell,castlingRook);	
			}
			Board.turn++;	
			$('#chessDesk').find('[data-castling=1]').removeAttr('data-castling');
		}

		activeFigure.removeClass('active');
		activeFigure.removeAttr('data-firstMove');
		activeFigure.removeAttr('data-side');
		activeFigure.removeAttr('data','active');
		activeFigure.removeAttr('name');
		$(activeFigure).empty();
		$('td').removeClass('possibleMove');
		activeCounter = 0;

		if ($(target).attr('name') === 'pawn') {
			Soldiers.pawn.promotion(target);
		}

		Board.turn++;
		var t = new Date();
		var currentTime = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
		var newMove = '<li class="' + $(target).attr('data-side') + '">['+ $(target).attr('data-side') + 's] : ' + 
		$(target).attr('name') + ' moved from ' + $(activeFigure).attr('id') + ' to ' + $(target).attr('id') + ' at ' + currentTime + '</li>';
		Board.log.push(newMove);
		Board.createSideBar();
	},
	select: function(event) {
		var target = event.target;
		$(target).attr('data','active');
		$(target).addClass('active');
		activeCounter = 1;
		var figure = $(target).attr('name');
		moves = Soldiers[figure].checkFields(event);
		for (var i = 0; i < moves.length; i++) {
			$(moves[i]).addClass('possibleMove');
		}
	}
}

// Game object
Game = {
	solderDead: function(figureCode, side) {
		if (side === 'darks') {
			Board.killedDarks.push(figureCode);
		} else if (side === 'lights') {
			Board.killedLights.push(figureCode);
		} 
	},
	resetGame: function() {
		var danger = confirm('Worning, you will lose your progress');
		if (danger) {
			var fields = $('#chessDesk').find('td');
			for (var i = 0; i < fields.length; i++ ) {
				$('#' + fields[i].id).empty();
				$('#' + fields[i].id).removeClass('active');
				$('#' + fields[i].id).removeAttr('data-side');
				$('#' + fields[i].id).removeAttr('data-firstMove');
				$('#' + fields[i].id).removeAttr('data','active');
				$('#' + fields[i].id).removeAttr('name');
			}
			Board.turn = 0;
			Board.log = [];
			Soldiers.createSoldiers();
			Board.createSideBar();
		}
	},
	checkType: function(target,id){
		if($(id).attr('data-side') === target.attr('data-side')) {
			return false;
		} else if($(id).attr('data-side') == undefined){
			return null;
		} else{
			return true;
		}
	},
	checkmate: function(enemies, friends) {
		queenKillers = [];
		queenHelpers = [];
		queen = undefined;
		// Enemies
		for( var i = 0; i < enemies.length; i++) {
			var enemyFigure = $('#' + enemies[i].id).attr('name');
			var enemyFieldData = document.getElementById(enemies[i].id);
			enemyFigureMoves = Soldiers[enemyFigure].checkFields(undefined, enemyFieldData);
			enemyFigureMoves.forEach(function(entry){
				if ($(entry).attr('name') === 'queen' && $(entry).attr('data-side') != $('#' + enemies[i].id).attr('data-side')) {
					queenKillers.push(enemies[i]);
					queen = $(entry);
				}
			}); 
		}
		if (queenKillers.length > 0) {
			// Friends
			for( var i = 0; i < friends.length; i++) {
				var friendFigure = $('#' + friends[i].id).attr('name');
				var friendFieldData = document.getElementById(friends[i].id);
				friendFigureMoves = Soldiers[friendFigure].checkFields(undefined, friendFieldData);
				friendFigureMoves.forEach(function(entry){
					for (var x = 0; x < queenKillers.length; x++) {
						if (entry === ('#' + $(queenKillers[x]).attr('id'))) {
							queenHelpers.push(friends[i]);
						}
					}
				}); 
			}
		}
		// Check if queen can move
		if (queen != undefined) {
			var queenTarget = document.getElementById($(queen).attr('id'));
			var queenMoves = Soldiers[$(queen).attr('name')].checkFields(undefined, queenTarget);
			// if queen cant move and where are no queenHelpers
			if (queenMoves.length === 0 && queenHelpers.length === 0) {
				console.log('checkmate');
			}
		}
	},
	allSoldiers: function(side, rel) {
		if (rel === 'friend') {
			switch(side){
				case ('dark'):
					var dataSide = 'dark';
					break;
				case ('light'):
					var dataSide = 'light';
					break;
			}
		} else if (rel === 'enemy') {
			switch(side){
				case ('dark'):
					var dataSide = 'light';
					break;
				case ('light'):
					var dataSide = 'dark';
					break;
			}
		}
		var soldiers = document.querySelectorAll('[data-side = ' + dataSide + ']');
		return soldiers;
	}
}

// Solders object
Soldiers = {
	rook: {
		name: 'rook',
		black: '&#9820',
		white: '&#9814',
		checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var upMoves = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
			var downMoves = Board.rows.slice($.inArray(row, Board.rows) + 1);
			var leftMoves = Board.colums.slice(0, colum).reverse();
			var rightMoves = Board.colums.slice(colum + 1);
			this.rookPushMove(upMoves, target, possibleMoves, 'colum', colum);
			this.rookPushMove(downMoves, target, possibleMoves, 'colum', colum);
			this.rookPushMove(leftMoves, target, possibleMoves, 'row', row);
			this.rookPushMove(rightMoves, target, possibleMoves, 'row', row);
			return possibleMoves;
		},
		rookPushMove: function(array, target, possibleMoves, columOrRow, number){
			for(var i = 0; i < array.length; i++){
				if(arguments[3] === 'colum'){
					var cell = '#' + array[i] + Board.colums[number];
				}else{
					var cell = '#' + number + array[i];
				}
				if(Game.checkType(target, cell) == null){
					possibleMoves.push(cell);
				}else if(Game.checkType(target, cell) == true){
					possibleMoves.push(cell);
					break;
				}else{
					break;
				}
			};
		},
		saveQueen: function(soldierPosition, queenPosition, enemyPosition) {

		}
	},
	knight: {
		name: 'knight',
		black: '&#9822',
		white: '&#9816',
		checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var count=1;
			var addRow;
			var addCol;
			//row up&down
			for(var i = 0; i <= 3; i++){
				switch(true){
					case (i == 0):
						addRow = 2;
						addCol = 1;
						break;
					case (i == 1):
						addRow = -2;
						addCol = 1;
						break;
					case (i == 2):
						addRow = 1;
						addCol = 2;
						break;	
					case (i == 3):
						addRow = -1;
						addCol = 2;
						break;
				}
				if((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum + addCol] != undefined) {
					var cell = '#'+ (row + addRow) + Board.colums[colum + addCol];
					if(Game.checkType(target, cell) == true || Game.checkType(target, cell) == null)
						possibleMoves.push(cell);
				}
				if((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum - addCol] != undefined){
					var cell = '#' + (row + addRow) + Board.colums[colum - addCol];
					if(Game.checkType(target, cell) == true || Game.checkType(target, cell) == null)
						possibleMoves.push(cell);
				}
			}

			return possibleMoves;
		}
	},
	bishop: {
		name: 'bishop',
		black: '&#9821',
		white: '&#9815',
		checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var upMoves = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
			var downMoves = Board.rows.slice($.inArray(row, Board.rows) + 1);
			
			this.bishopPushMove(upMoves, target, possibleMoves, row, colum, 'left');
			this.bishopPushMove(upMoves, target, possibleMoves, row, colum, 'right');
			this.bishopPushMove(downMoves, target, possibleMoves, row, colum, 'left');
			this.bishopPushMove(downMoves, target, possibleMoves, row, colum, 'right');
			return possibleMoves;
		},
		bishopPushMove: function(array, target, possibleMoves, row, colum, leftOrRight){
			for(var i = 0; i < array.length; i++){
				if(leftOrRight == 'left'){
					$checkCol = Board.colums[colum - (Math.abs(row - array[i]))];
				}else{
					$checkCol = Board.colums[colum + (Math.abs(row - array[i]))];
				}
				if($checkCol !== undefined){
					var cell= '#' + array[i] + $checkCol;
					if(Game.checkType(target, cell) == null){
						possibleMoves.push(cell);
					}else if(Game.checkType(target, cell) == true){
						possibleMoves.push(cell);
						break;
					}else{
						break;
					}
				}
			}
		}
	},
	queen: {
		name: 'queen',
		black: '&#9818',
		white: '&#9812',
		checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var addRow = 1;;
			for (var i = 1; i <= 2; i++) {
				kingRow(colum);
				kingRow(colum+1);
				kingRow(colum-1);
				addRow =- 1;
			}
			function kingRow(columIndex){
				if((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[columIndex] != undefined) { 
					var cell= '#' + (row + addRow) + Board.colums[columIndex];
					if(Game.checkType(target, cell) == null || Game.checkType(target, cell) == true ) {
						possibleMoves.push(cell);
					}
				}
			}
			if(Board.colums[colum - 1] != undefined) {
				var cell = '#' + row + Board.colums[colum - 1];
				if(Game.checkType(target, cell) == null || Game.checkType(target, cell) == true ) {
					possibleMoves.push(cell);
				}
			}
			if(Board.colums[colum + 1] != undefined) {
				var cell= '#' + row + Board.colums[colum + 1];
				if(Game.checkType(target,cell) == null || Game.checkType(target,cell) == true ) {
					possibleMoves.push(cell);
				}
			}

			if($(target).attr('data-firstMove')==0){
				//if king's firstMove is zero get all friends
				var friends = document.querySelectorAll('[data-side = ' + $(target).attr('data-side') + ']');
				Array.prototype.forEach.call(friends,function(item){
					if($(item).attr('name')=='rook' && $(item).attr('data-firstMove')==0){
						//if any rook has firstMove==0 check if it is left rook or right rook
						var splitted = $(item).attr('id').split('');
						var rookColumn = Board.colums.indexOf(splitted[1]);
						if(rookColumn<colum){
							var leftCastling=true;
							for(var i=1;i<=3;i++){
								//if rook is left then check that there is no elements between them for castling
								if($('#'+row+Board.colums[colum-i]).html()!='')
									leftCastling=false;
							}
							if(leftCastling){
								var cell='#'+row+Board.colums[colum-2];
								//append 2 cells left of the king to possibleMoves and add that rook temporary castling attribute
								possibleMoves.push(cell);
								$(item).attr('data-castling',1);
							}
						}else{
							// if rook is not left so it is surely right one
							var rightCastling=true;
							for(var i=1;i<=2;i++){
								//check that there is no elements between rook on the right and the king for castling
								if($('#'+row+Board.colums[colum+i]).html()!='')
									rightCastling=false;
							}
							if(rightCastling){
								var cell='#'+row+Board.colums[colum+2];
								//append 2 cells left of the king to possibleMoves and add that rook temporary castling attribute
								possibleMoves.push(cell);
								$(item).attr('data-castling',1);
							}
						}
					}
				});
			}
			return possibleMoves;
		}
	},
	king: {
		name: 'king',
		black: '&#9819',
		white: '&#9813',
			checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			var upMoves = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
			var downMoves = Board.rows.slice($.inArray(row, Board.rows) + 1);
			var leftMoves = Board.colums.slice(0, colum).reverse();
			var rightMoves = Board.colums.slice(colum + 1);
			Soldiers.rook.rookPushMove(upMoves, target, possibleMoves,'colum', colum);
			Soldiers.rook.rookPushMove(downMoves, target, possibleMoves,'colum', colum);
			Soldiers.rook.rookPushMove(leftMoves, target, possibleMoves,'row', row);
			Soldiers.rook.rookPushMove(rightMoves, target, possibleMoves,'row',row);
			Soldiers.bishop.bishopPushMove(upMoves, target, possibleMoves,row, colum, 'left');
			Soldiers.bishop.bishopPushMove(upMoves, target, possibleMoves,row, colum, 'right');
			Soldiers.bishop.bishopPushMove(downMoves, target, possibleMoves,row, colum, 'left');
			Soldiers.bishop.bishopPushMove(downMoves, target, possibleMoves,row, colum, 'right');
			return possibleMoves;
		}
	},
	pawn: {
		name: 'pawn',
		black: '&#9823',
		white: '&#9817',
		checkFields: function(event, field) {
			if (event === undefined) {
				var target = field;
				var target = $(target);
			} else {
				var target = $(event.target);
			}
			var fieldData = target.attr('id').split('');
			var row = Number(fieldData[0]);
			var colum = Board.colums.indexOf(fieldData[1]);
			var possibleMoves = [];
			if (target.attr('data-firstMove') == 0) {
				var moveRange = 3;
			} else {
				var moveRange = 2;
			}
			if (target.attr('data-side') === 'dark') {
				for(var i = 1; i < moveRange; i++) {
					var cell = '#'+ (row - i) + Board.colums[colum];
					if ($(cell).html().length != 0) {break;}
					possibleMoves.push(cell);
				}
				var rightField = '#' + (row - 1) + Board.colums[colum + 1];
				var leftField = '#' + (row - 1) + Board.colums[colum - 1];
			} else if (target.attr('data-side') === 'light') {
				for(var i = 1; i < moveRange; i++) {
					var cell = '#'+ (row + i) + Board.colums[colum];
					if ($(cell).html().length != 0) {break;}
					possibleMoves.push(cell);
				}
				var rightField = '#' + (row + 1) + Board.colums[colum + 1];
				var leftField = '#' + (row + 1) + Board.colums[colum - 1];
			}

			if ($(rightField).attr('data-side') != target.attr('data-side') && $(rightField).attr('data-side') != undefined) {
				possibleMoves.push(rightField);
			}
			if ($(leftField).attr('data-side') != target.attr('data-side') && $(leftField).attr('data-side') != undefined) {
				possibleMoves.push(leftField);
			}

			return possibleMoves;
		},
		promotion: function(target) {
			var fieldData = target.id.split('');
			var row = Number(fieldData[0]);
			var side = $('#' + target.id).attr('data-side');
			if ((row === 8 && side === 'light') || (row === 1 && side === 'dark')) {
				var confirmPromotion = confirm('Do you wont to promote your pawn?');
				if (confirmPromotion) {
					var userChoice = prompt('Please write figure you wont replace with - "Rook", "Knight", "Bishop", "King"');
					switch(userChoice) {
						case ('Rook'):
						var replacePawn = 'rook';
						break; 
						case ('Knight'):
						var replacePawn = 'knight';
						break;
						case ('Bishop'):
						var replacePawn = 'bishop';
						break;
						case ('King'):
						var replacePawn = 'king';
						break;
					}
					if (side === 'light') {
						$('#' + target.id).html(Soldiers[replacePawn].white);
					} else if (side === 'dark') {
						$('#' + target.id).html(Soldiers[replacePawn].black);
					}
					$('#' + target.id).removeAttr('data-firstMove');
					$('#' + target.id).attr('name', replacePawn);
				}
			} 
		}
	},
	createSoldiers: function() {
		$('#8a').attr('name', this.rook.name).attr('data-side', 'dark').html(this.rook.black).attr('data-firstMove', 0);
		$('#8b').attr('name', this.knight.name).attr('data-side', 'dark').html(this.knight.black);
		$('#8c').attr('name', this.bishop.name).attr('data-side', 'dark').html(this.bishop.black);
		$('#8d').attr('name', this.king.name).attr('data-side', 'dark').html(this.king.black);
		$('#8e').attr('name', this.queen.name).attr('data-side', 'dark').html(this.queen.black).attr('data-firstMove', 0);
		$('#8f').attr('name', this.bishop.name).attr('data-side', 'dark').html(this.bishop.black);
		$('#8g').attr('name', this.knight.name).attr('data-side', 'dark').html(this.knight.black);
		$('#8h').attr('name', this.rook.name).attr('data-side', 'dark').html(this.rook.black).attr('data-firstMove', 0);
		for (var i = 0; i < Board.colums.length; i++) {
			$('#7' + Board.colums[i]).attr('name', this.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(this.pawn.black);
		}

		$('#1a').attr('name', this.rook.name).attr('data-side', 'light').html(this.rook.white).attr('data-firstMove', 0);
		$('#1b').attr('name', this.knight.name).attr('data-side', 'light').html(this.knight.white);
		$('#1c').attr('name', this.bishop.name).attr('data-side', 'light').html(this.bishop.white);
		$('#1d').attr('name', this.king.name).attr('data-side', 'light').html(this.king.white);
		$('#1e').attr('name', this.queen.name).attr('data-side', 'light').html(this.queen.white).attr('data-firstMove', 0);
		$('#1f').attr('name', this.bishop.name).attr('data-side', 'light').html(this.bishop.white);
		$('#1g').attr('name', this.knight.name).attr('data-side', 'light').html(this.knight.white);
		$('#1h').attr('name', this.rook.name).attr('data-side', 'light').html(this.rook.white).attr('data-firstMove', 0);
		for (var i = 0; i < Board.colums.length; i++) {
			$('#2' + Board.colums[i]).attr('name', this.pawn.name).attr('data-side', 'light').attr('data-firstMove', 0).html(this.pawn.white);
		}
	},
	selectSoldier: function() {
		activeCounter = 0;
		$('td').click(function(event){
			var target = event.target;
			if ($(target).html().length > 0 && $(target).attr('data') !== 'active' && activeCounter === 0) {

				if (Board.turn % 2 != 0 && $(target).attr('data-side') === 'dark') {
					Board.select(event);
				} else if (Board.turn % 2 === 0 && $(target).attr('data-side') === 'light') {
					Board.select(event);
				}

			} else if ($(target).attr('data') === 'active') {

				$(target).removeAttr('data','active');
				$(target).removeClass('active');
				$('td').removeClass('possibleMove');
				activeCounter = 0;

			}
		});
	},
	move: function() {

		var clickCounter = 0;

		$('td').click(function(event){
			var target = event.target;
			clickCounter = 1;
			var activeFigure = $('#chessDesk').find('[data="active"]');

			if (activeFigure.length > 0 && clickCounter === 1 && $(target).html().length === 0 && moves.indexOf('#' + target.id) > -1) {
				
				Board.rewriteField(target, activeFigure);
				var enemies = Game.allSoldiers($('#' + target.id).attr('data-side'),'friend'); 
				var friends = Game.allSoldiers($('#' + target.id).attr('data-side'),'enemy'); 
				Game.checkmate(enemies, friends);
			} else if (activeFigure.length > 0 && $(target).html().length !== 0 && $(target).attr('data-side') !== activeFigure.attr('data-side') && moves.indexOf('#' + target.id) > -1) {
				
				if ($(target).attr('data-side') === 'dark') {
					Game.solderDead(target.innerHTML, 'darks'); 
				} else if ($(target).attr('data-side') === 'light') {
					Game.solderDead(target.innerHTML, 'lights'); 
				}

				Board.rewriteField(target, activeFigure);
				var enemies = Game.allSoldiers($('#' + target.id).attr('data-side'),'friend'); 
				var friends = Game.allSoldiers($('#' + target.id).attr('data-side'),'enemy'); 
				Game.checkmate(enemies, friends);

	 		}
	 	});
	}		
}

$(document).ready(function(){

	Board.createDesk();
	Board.createSideBar();
	Soldiers.createSoldiers();
	Soldiers.selectSoldier();
	Soldiers.move();

});

