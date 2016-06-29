Board = {
	rows: [8,7,6,5,4,3,2,1],
	colums: ['a','b','c','d','e','f','g','h'],
	turn: 0,
	log: [],
	newBoard: function() {
		for (var i = 0; i < this.rows.length; i++) {
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
		}
		for (x = 0; x < this.colums.length; x++) {
			var td = document.createElement('td');
			var rowId = '#' + rows[i];	
			if (x%2 !== 1) {
				$(td).attr('class', firstCol);
			} else {
				$(td).attr('class', secondCol);
			}
			$(td).attr('id', rows[i] + this.colums[x]);
			$(rowId).append(td);
		}
	}
}