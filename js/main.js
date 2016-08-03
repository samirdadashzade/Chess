CheckMatePositions = {
    cornerMate: function() {

        $('#8h').attr('name', Soldiers.queen.name).attr('data-side', 'dark').html(Soldiers.queen.black);
        $('#7h').attr('name', Soldiers.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.pawn.black);

        $('#6h').attr('name', Soldiers.knight.name).attr('data-side', 'light').html(Soldiers.knight.white);
        $('#1g').attr('name', Soldiers.rook.name).attr('data-side', 'light').html(Soldiers.rook.white);
    },
    doubleBishopMate: function() {
        $('#8h').attr('name', Soldiers.queen.name).attr('data-side', 'dark').html(Soldiers.queen.black);
        $('#7h').attr('name', Soldiers.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.pawn.black);
        $('#8g').attr('name', Soldiers.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.pawn.black);


        $('#5d').attr('name', Soldiers.bishop.name).attr('data-side', 'light').html(Soldiers.bishop.white);
        $('#4b').attr('name', Soldiers.king.name).attr('data-side', 'light').html(Soldiers.king.white);
    },
    doubleRookMate: function() {
        $('#8h').attr('name', Soldiers.queen.name).attr('data-side', 'dark').html(Soldiers.queen.black);
        $('#7h').attr('name', Soldiers.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.pawn.black);
        $('#7g').attr('name', Soldiers.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.pawn.black);
        $('#7f').attr('name', Soldiers.bishop.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(Soldiers.bishop.black);

        // $('#7b').attr('name', Soldiers.rook.name).attr('data-side', 'light').html(Soldiers.rook.white);
        $('#6a').attr('name', Soldiers.rook.name).attr('data-side', 'light').html(Soldiers.rook.white);
        $('#1a').attr('name', Soldiers.bishop.name).attr('data-side', 'light').html(Soldiers.bishop.white);
    }
}

// Board object
Board = {

    // General Data
    rows: [8, 7, 6, 5, 4, 3, 2, 1],
    colums: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
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
        var killedSoldiers = document.createElement('div');
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
        if ($(activeFigure).attr('data-firstMove') == 0) {
            $(target).attr('data-firstMove', 1);
        } else if ($(activeFigure).attr('data-firstMove')) {
            $(target).attr('data-firstMove', $(activeFigure).attr('data-firstMove'));
        }
        activeFigure.removeClass('active');
        activeFigure.removeAttr('data-firstMove');
        activeFigure.removeAttr('data-side');
        activeFigure.removeAttr('data', 'active');
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
        var newMove = '<li class="' + $(target).attr('data-side') + '">[' + $(target).attr('data-side') + 's] : ' +
            $(target).attr('name') + ' moved from ' + $(activeFigure).attr('id') + ' to ' + $(target).attr('id') + ' at ' + currentTime + '</li>';
        Board.log.push(newMove);
        Board.createSideBar();
    },
    select: function(event) {
        var target = event.target;
        $(target).attr('data', 'active');
        $(target).addClass('active');
        activeCounter = 1;
        var figure = $(target).attr('name');
        moves = Soldiers[figure].checkFields(event, undefined);
        // if (figure === 'queen') {
        	
        // }
        for (var i = 0; i < moves.length; i++) {
            $(moves[i]).addClass('possibleMove');
        }
        switch (figure) {
            case ('rook'):
                var directions = Soldiers[figure].windRose(target);
                break;
            case ('bishop'):
                var directions = Soldiers[figure].windRose(target);
                break;
            case ('king'):
                var directions = Soldiers[figure].windRose(target);
                break;
            default:
                break;
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
            for (var i = 0; i < fields.length; i++) {
                $('#' + fields[i].id).empty();
                $('#' + fields[i].id).removeClass('active');
                $('#' + fields[i].id).removeAttr('data-side');
                $('#' + fields[i].id).removeAttr('data-firstMove');
                $('#' + fields[i].id).removeAttr('data', 'active');
                $('#' + fields[i].id).removeAttr('name');
            }
            Board.turn = 0;
            Board.log = [];
            Soldiers.createSoldiers();
            Board.createSideBar();
        }
    },
    checkType: function(target, id) {
        if ($(id).attr('data-side') === target.attr('data-side')) {
            return false;
        } else if ($(id).attr('data-side') == undefined) {
            return null;
        } else {
            return true;
        }
    },
    windRoseDirections: function(array, target, row, colum, xy) {
        var moves = [];
        for (var i = 0; i < array.length; i++) {

            if (xy === 'y -y') {
                var checkCol = null;
                var cell = '#' + array[i] + Board.colums[colum];
            } else if (xy === 'x -x') {
                var checkCol = null;
                var cell = '#' + row + array[i];
            } else if (xy === 'y x') {
                var checkCol = Board.colums[colum + (Math.abs(row - array[i]))];
                if (checkCol !== undefined) {
                    var cell = '#' + array[i] + checkCol;
                }
            } else if (xy === 'y -x') {
                var checkCol = Board.colums[colum - (Math.abs(row - array[i]))];
                if (checkCol !== undefined) {
                    var cell = '#' + array[i] + checkCol;
                }
            }
            if (this.checkType(target, cell) == null && checkCol !== undefined) {
                moves.push(cell);
            } else if (this.checkType(target, cell) == true && checkCol !== undefined) {
                moves.push(cell);
                break;
            } else {
                break;
            }
        }
        return moves;
    },
    checkmate: function(enemies, friends) {
        // function data
        var queenKillers = [];
        var queen = undefined;
        var queenEscape = undefined;
        var queenMoves = undefined;
        var checkmate = false;

        // Enemies, check if some one can kill the queen
        for (var i = 0; i < enemies.length; i++) {
            var enemyFigure = $('#' + enemies[i].id).attr('name');
            var enemyFieldData = document.getElementById(enemies[i].id);
            enemyFigureMoves = Soldiers[enemyFigure].checkFields(undefined, enemyFieldData);
            enemyFigureMoves.forEach(function(entry) {
                if ($(entry).attr('name') === 'queen' && $(entry).attr('data-side') != $('#' + enemies[i].id).attr('data-side')) {
                    queenKillers.push(enemies[i]);
                    queen = $(entry);
                    console.log('Dangar detected');
                }
            });
        }
        // Friends, if there are queenKiller, check can some friend help
        if (queenKillers.length > 0) {

            for (var i = 0; i < friends.length; i++) {
                var friendFigure = $('#' + friends[i].id).attr('name');
                var friendFieldData = document.getElementById(friends[i].id);
                friendFigureMoves = Soldiers[friendFigure].checkFields(undefined, friendFieldData);
                friendFigureMoves.forEach(function(entry) {
                    for (var x = 0; x < queenKillers.length; x++) {
                        if (entry === ('#' + $(queenKillers[x]).attr('id'))) {
                            queenKillers.splice(x, 1);
                            console.log('Someone can help');
                        }
                    }
                });
            }

            // if no one can help check can queen move
            if (queen !== undefined && queenKillers.length > 0) {

                var queenTarget = document.getElementById($(queen).attr('id'));
                queenMoves = Soldiers[$(queen).attr('name')].checkFields(undefined, queenTarget);

                // if queen can move, creat an array with all enemie moves and check is there escape
                if (queen !== undefined && queenMoves.length > 0) {

                    var enemiesTotalMoves = [];

                    for (var i = 0; i < enemies.length; i++) {
                        var enemyFigure = $('#' + enemies[i].id).attr('name');
                        var enemyFieldData = document.getElementById(enemies[i].id);
                        enemyFigureMoves = Soldiers[enemyFigure].checkFields(undefined, enemyFieldData);
                        enemiesTotalMoves = enemiesTotalMoves.concat(enemyFigureMoves);
                    }
                    for (var i = 0; i < queenMoves.length; i++) {
                        queenEscape = enemiesTotalMoves.indexOf(queenMoves[i]);
                        if (queenEscape < 0) {
                            queenEscape = true;
                            console.log('Queen can escape ' + queenEscape);
                            break;
                        }
                    }
                }

                // if queenKiller is knight and there are no figure for help and queenEscape = false, than it is chackmate
                if (queen !== undefined && queenEscape !== true && queenKillers.length > 0) {
                    for (var i = 0; i < queenKillers.length; i++) {
                        var killerName = $(queenKillers[i]).attr('name');
                        // ???? windRose ?
                        var windRose = undefined;
                        if (killerName === 'knight') {
                            checkmate = true;
                        }
                    }
                }

                // if checkmate is still false check can some friend block the queen
                if (checkmate !== true && queen !== undefined && queenEscape !== true && queenKillers.length > 0) {
                    for (var i = 0; i < queenKillers.length; i++) {
                        var queenKillerTarget = document.getElementById($(queenKillers[i]).attr('id'));
                        var killerName = $(queenKillers[i]).attr('name');
                        if (killerName === 'bishop' || killerName === 'king' || killerName === 'rook') {
                            var directions = Soldiers[killerName].windRose(queenKillerTarget);
                            var terra = undefined;
                            for (var y = 0; y < directions.length; y++) {
                                for (var x = 0; x < directions[y].length; x++) {
                                    var queenIndex = directions[y].indexOf('#' + $(queen).attr('id'));
                                    if (queenIndex >= 0) {
                                        terra = y;
                                    }
                                }
                            }
                            if (terra !== undefined) {
                                for (var m = 0; m < friends.length; m++) {
                                    var friendFigure = $('#' + friends[m].id).attr('name');
                                    var friendFieldData = document.getElementById(friends[m].id);
                                    friendFigureMoves = Soldiers[friendFigure].checkFields(undefined, friendFieldData);
                                    friendFigureMoves.forEach(function(entry) {
                                        if ($(queenKillers[i]).attr('id') !== undefined) {
                                            var kilelrFieldDate = document.getElementById($(queenKillers[i]).attr('id'));
                                            var killerDirections = Soldiers[killerName].windRose(kilelrFieldDate);
                                            killerDirections = killerDirections[terra];
                                            for (z = 0; z < killerDirections.length; z++) {
                                                if (entry === killerDirections[z] && $('#' + friends[m].id).attr('name') !== 'queen' && $(entry).attr('name') !== 'queen') {
                                                    queenKillers.splice(x, 1);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        if (queenKillers.length > 0) {
          checkmate = true;
        }
        if (checkmate === true) {
            alert('This is chackmate!');
        }

    },
    allSoldiers: function(side, rel) {
        if (rel === 'friend') {
            switch (side) {
                case ('dark'):
                    var dataSide = 'dark';
                    break;
                case ('light'):
                    var dataSide = 'light';
                    break;
            }
        } else if (rel === 'enemy') {
            switch (side) {
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
            var possibleMoves = [];
            var directions = this.windRose(target);
            directions.forEach(function(entry) {
                for (var i = 0; i < entry.length; i++) {
                    possibleMoves.push(entry[i]);
                }
            });
            return possibleMoves;
        },
        windRose: function(field) {
            var target = $(field);
            var fieldData = target.attr('id').split('');
            var row = Number(fieldData[0]);
            var colum = Board.colums.indexOf(fieldData[1]);
            var upRows = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
            var downRows = Board.rows.slice($.inArray(row, Board.rows) + 1);
            var leftColums = Board.colums.slice(0, colum).reverse();
            var rightColums = Board.colums.slice(colum + 1);
            var possibleMoves = [];
            var n = Game.windRoseDirections(upRows, target, row, colum, 'y -y');
            var s = Game.windRoseDirections(downRows, target, row, colum, 'y -y');
            var w = Game.windRoseDirections(leftColums, target, row, colum, 'x -x');
            var e = Game.windRoseDirections(rightColums, target, row, colum, 'x -x');

            var directions = [n, s, e, w];

            return directions;
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
            var count = 1;
            var addRow;
            var addCol;
            //row up&down
            for (var i = 0; i <= 3; i++) {
                switch (true) {
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
                if ((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum + addCol] != undefined) {
                    var cell = '#' + (row + addRow) + Board.colums[colum + addCol];
                    if (Game.checkType(target, cell) == true || Game.checkType(target, cell) == null)
                        possibleMoves.push(cell);
                }
                if ((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum - addCol] != undefined) {
                    var cell = '#' + (row + addRow) + Board.colums[colum - addCol];
                    if (Game.checkType(target, cell) == true || Game.checkType(target, cell) == null)
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
            var possibleMoves = [];
            var directions = this.windRose(target);
            directions.forEach(function(entry) {
                for (var i = 0; i < entry.length; i++) {
                    possibleMoves.push(entry[i]);
                }
            });
            return possibleMoves;
        },
        windRose: function(field) {
            var target = $(field);
            var fieldData = target.attr('id').split('');
            var row = Number(fieldData[0]);
            var colum = Board.colums.indexOf(fieldData[1]);
            var upRows = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
            var downRows = Board.rows.slice($.inArray(row, Board.rows) + 1);
            var leftColums = Board.colums.slice(0, colum).reverse();
            var rightColums = Board.colums.slice(colum + 1);

            var ne = Game.windRoseDirections(upRows, target, row, colum, 'y x');
            var nw = Game.windRoseDirections(upRows, target, row, colum, 'y -x');
            var se = Game.windRoseDirections(downRows, target, row, colum, 'y x');
            var sw = Game.windRoseDirections(downRows, target, row, colum, 'y -x');

            var directions = [ne, nw, se, sw];
            return directions;
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
                if ((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum] != undefined) {
                    var cell = '#' + (row + addRow) + Board.colums[colum];
                    if (Game.checkType(target, cell) == null || Game.checkType(target, cell) == true) {
                        possibleMoves.push(cell);
                    }
                }
                if ((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum + 1] != undefined) {
                    var cell = '#' + (row + addRow) + Board.colums[colum + 1];
                    if (Game.checkType(target, cell) == null || Game.checkType(target, cell) == true) {
                        possibleMoves.push(cell);
                    }
                }
                if ((row + addRow) > 0 && (row + addRow) <= 8 && Board.colums[colum - 1] != undefined) {
                    var cell = '#' + (row + addRow) + Board.colums[colum - 1];
                    if (Game.checkType(target, cell) == null || Game.checkType(target, cell) == true) {
                        possibleMoves.push(cell);
                    }
                }
                addRow = -1;
            }
            if (Board.colums[colum - 1] != undefined) {
                var cell = '#' + row + Board.colums[colum - 1];
                if (Game.checkType(target, cell) == null || Game.checkType(target, cell) == true) {
                    possibleMoves.push(cell);
                }
            }
            if (Board.colums[colum + 1] != undefined) {
                var cell = '#' + row + Board.colums[colum + 1];
                if (Game.checkType(target, cell) == null || Game.checkType(target, cell) == true) {
                    possibleMoves.push(cell);
                }
            }

            //check if which queen is clicked and if it's its first move
            if(target.attr('data-firstmove')==0 && target.attr('data-side')==='light'){
            	//check if there is something on its right sides till rook
            	if($('#1f').html()=='' && $('#1g').html()=='' && $('#1h').attr('data-firstmove')==0){
            		possibleMoves.push('#1g');
            	}	
            	//check if there is something on its left sides till rook
            	if($('#1d').html()=='' && $('#1c').html()=='' && $('#1b').html()=='' && $('#1a').attr('data-firstmove')==0){
            		possibleMoves.push('#1c');
            	}

            }else if(target.attr('data-firstmove')==0 && target.attr('data-side')==='dark'){
            	//check if there is something on its right sides till rook
            	if($('#8f').html()=='' && $('#8g').html()=='' && $('#8h').attr('data-firstmove')==0){
            		possibleMoves.push('#8g');
            	}	
            	//check if there is something on its left sides till rook
            	if($('#8d').html()=='' && $('#8c').html()=='' && $('#8b').html()=='' && $('#8a').attr('data-firstmove')==0){
            		possibleMoves.push('#8c');
            	}
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
            var possibleMoves = [];
            var directions = this.windRose(target);
            directions.forEach(function(entry) {
                for (var i = 0; i < entry.length; i++) {
                    possibleMoves.push(entry[i]);
                }
            });
            return possibleMoves;
        },
        windRose: function(field) {
            var target = $(field);
            var fieldData = target.attr('id').split('');
            var row = Number(fieldData[0]);
            var colum = Board.colums.indexOf(fieldData[1]);
            var upRows = Board.rows.slice(0, $.inArray(row, Board.rows)).reverse();
            var downRows = Board.rows.slice($.inArray(row, Board.rows) + 1);
            var leftColums = Board.colums.slice(0, colum).reverse();
            var rightColums = Board.colums.slice(colum + 1);

            var ne = Game.windRoseDirections(upRows, target, row, colum, 'y x');
            var nw = Game.windRoseDirections(upRows, target, row, colum, 'y -x');
            var se = Game.windRoseDirections(downRows, target, row, colum, 'y x');
            var sw = Game.windRoseDirections(downRows, target, row, colum, 'y -x');

            var n = Game.windRoseDirections(upRows, target, row, colum, 'y -y');
            var s = Game.windRoseDirections(downRows, target, row, colum, 'y -y');
            var w = Game.windRoseDirections(leftColums, target, row, colum, 'x -x');
            var e = Game.windRoseDirections(rightColums, target, row, colum, 'x -x');

            var directions = [n, s, e, w, ne, nw, se, sw];
            return directions;
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
                for (var i = 1; i < moveRange; i++) {
                    var cell = '#' + (row - i) + Board.colums[colum];
                    if ($(cell).html().length != 0) {
                        break;
                    }
                    possibleMoves.push(cell);
                }
                var rightField = '#' + (row - 1) + Board.colums[colum + 1];
                var leftField = '#' + (row - 1) + Board.colums[colum - 1];
            } else if (target.attr('data-side') === 'light') {
                for (var i = 1; i < moveRange; i++) {
                    var cell = '#' + (row + i) + Board.colums[colum];
                    if ($(cell).html().length != 0) {
                        break;
                    }
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
                    switch (userChoice) {
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
        $('#8a').attr('name', this.rook.name).attr({'data-side' : 'dark', 'data-firstMove' : 0}).html(this.rook.black);
        $('#8b').attr('name', this.knight.name).attr('data-side', 'dark').html(this.knight.black);
        $('#8c').attr('name', this.bishop.name).attr('data-side', 'dark').html(this.bishop.black);
        $('#8d').attr('name', this.king.name).attr('data-side', 'dark').html(this.king.black);
        $('#8e').attr('name', this.queen.name).attr({'data-side' : 'dark', 'data-firstMove' : 0}).html(this.queen.black);
        $('#8f').attr('name', this.bishop.name).attr('data-side', 'dark').html(this.bishop.black);
        $('#8g').attr('name', this.knight.name).attr('data-side', 'dark').html(this.knight.black);
        $('#8h').attr('name', this.rook.name).attr({'data-side' : 'dark', 'data-firstMove' : 0}).html(this.rook.black);
        for (var i = 0; i < Board.colums.length; i++) {
            $('#7' + Board.colums[i]).attr('name', this.pawn.name).attr('data-side', 'dark').attr('data-firstMove', 0).html(this.pawn.black);
        }

        $('#1a').attr('name', this.rook.name).attr({'data-side' : 'light', 'data-firstMove' : 0}).html(this.rook.white);
        $('#1b').attr('name', this.knight.name).attr('data-side', 'light').html(this.knight.white);
        $('#1c').attr('name', this.bishop.name).attr('data-side', 'light').html(this.bishop.white);
        $('#1d').attr('name', this.king.name).attr('data-side', 'light').html(this.king.white);
        $('#1e').attr('name', this.queen.name).attr({'data-side' : 'light', 'data-firstMove' : 0}).html(this.queen.white);
        $('#1f').attr('name', this.bishop.name).attr('data-side', 'light').html(this.bishop.white);
        $('#1g').attr('name', this.knight.name).attr('data-side', 'light').html(this.knight.white);
        $('#1h').attr('name', this.rook.name).attr({'data-side' : 'light', 'data-firstMove' : 0}).html(this.rook.white);
        for (var i = 0; i < Board.colums.length; i++) {
            $('#2' + Board.colums[i]).attr('name', this.pawn.name).attr('data-side', 'light').attr('data-firstMove', 0).html(this.pawn.white);
        }
    },
    selectSoldier: function() {
        activeCounter = 0;
        $('td').click(function(event) {
            var target = event.target;
            if ($(target).html().length > 0 && $(target).attr('data') !== 'active' && activeCounter === 0) {

                if (Board.turn % 2 != 0 && $(target).attr('data-side') === 'dark') {
                    Board.select(event);
                } else if (Board.turn % 2 === 0 && $(target).attr('data-side') === 'light') {
                    Board.select(event);
                }

            } else if ($(target).attr('data') === 'active') {

                $(target).removeAttr('data', 'active');
                $(target).removeClass('active');
                $('td').removeClass('possibleMove');
                activeCounter = 0;

            }
        });
    },
    move: function() {

        var clickCounter = 0;

        $('td').click(function(event) {
            var target = event.target;
            clickCounter = 1;
            var activeFigure = $('#chessDesk').find('[data="active"]');

            if (activeFigure.length > 0 && clickCounter === 1 && $(target).html().length === 0 && moves.indexOf('#' + target.id) > -1) {
            	//castling
            	if(activeFigure.attr('name')=='queen'){
            		var currentQueenPos = activeFigure.attr('id').split('');
		            var currentQueenColum = Board.colums.indexOf(currentQueenPos[1]);
		            var currentQueenRow = currentQueenPos[0];

		            var nextQueenPos = $(target).attr('id').split('');
		            var nextQueenColum = Board.colums.indexOf(nextQueenPos[1]);

		            if(Math.abs(currentQueenColum - nextQueenColum)==2){
		            	if(currentQueenColum - nextQueenColum == -2){
			            	// right castling
			            	var rookTarget=$('#chessDesk').find('#' + currentQueenRow + Board.colums[currentQueenColum+1])[0];
			            	var rookActive=$('#chessDesk').find('#' + currentQueenRow + Board.colums[7]);
			            }else if(currentQueenColum - nextQueenColum == 2){
			            	// left castling
			            	var rookTarget=$('#chessDesk').find('#' + currentQueenRow + Board.colums[currentQueenColum-1])[0];
			            	var rookActive=$('#chessDesk').find('#' + currentQueenRow + Board.colums[0]);
			            }
			            Board.rewriteField(rookTarget, rookActive);
	            		Board.turn++;
		            }            		
            	}

                Board.rewriteField(target, activeFigure);
                var enemies = Game.allSoldiers($('#' + target.id).attr('data-side'), 'friend');
                var friends = Game.allSoldiers($('#' + target.id).attr('data-side'), 'enemy');
                Game.checkmate(enemies, friends);
                Game.checkmate(friends, enemies);
            } else if (activeFigure.length > 0 && $(target).html().length !== 0 && $(target).attr('data-side') !== activeFigure.attr('data-side') && moves.indexOf('#' + target.id) > -1) {

                if ($(target).attr('data-side') === 'dark') {
                    Game.solderDead(target.innerHTML, 'darks');
                } else if ($(target).attr('data-side') === 'light') {
                    Game.solderDead(target.innerHTML, 'lights');
                }

                Board.rewriteField(target, activeFigure);
                var enemies = Game.allSoldiers($('#' + target.id).attr('data-side'), 'friend');
                var friends = Game.allSoldiers($('#' + target.id).attr('data-side'), 'enemy');
                Game.checkmate(enemies, friends);
                Game.checkmate(friends, enemies);

            }
        });
    }
}

$(document).ready(function() {

    Board.createDesk();
    Board.createSideBar();
    Soldiers.createSoldiers();
    // CheckMatePositions.doubleBishopMate();
    // CheckMatePositions.doubleRookMate();

    Soldiers.selectSoldier();
    Soldiers.move();

});
