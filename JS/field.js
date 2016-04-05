/* Класс поле (шашечная доска) */
var Field = function(element, isPlayer) {

	var deck = this; // замена this на deck т.к возникают ситуации, когда this является document или другим объектом
	deck.isPlayer = isPlayer; // либо комп, либо реальный игрок против тебя
	deck.element = element; // сам элемент таблицы (в данном случае $('.field')), для удобства доступа
	deck.isUp = false; // Поднята ли шашка (выбрана для совершения хода)

    /* 	По сути конструктор, создаем поле 8x8, даем каждой ячейке <td> класс white или black и уникальный id
	 * 	tableRow и tableCell - переменные для удобства доступа к последнему созданному элементу 
	 *	строки и ячейки таблицы соответственно
	 */
	deck.initialize = function() {
		var tableRow;
		var tableCell;
		for(var i = 8; i > 0; i--) {
			deck.element.append('<tr>');
			tableRow = $('tr:last');
			for(var j = 1; j < 9; j++) {
				tableRow.append('<td>');
				tableCell = $('td:last');
				deck.setCellSelectors(i, j, tableCell);
			}
		}
		$('#5-5').addClass('enemy');
		$('#7-5').addClass('enemy');
		$('#6-2').addClass('enemy');
		deck.setPlayerChips();
		deck.setOnClick();
	}

    /*	Задаем ячейке таблицы свой уникальный id и класс, который окрасит в белый или "черный" цвет =) */
	deck.setCellSelectors = function(row, col, tableCell) {
		tableCell.attr('id', row + '-' + col);
		tableCell.addClass((row + col) % 2 == 0 ? 'black' : 'white');
	}

    /*	Обработчик событий нажатия на определенную клетку доски
	 *	free - свободная ячейка, на которую можно перейти
	 * 	kill - ячейка, на которую можно перейти, убив шашку противника, (работает вместе с free)
	 * 	me - ячейка, на которой находится шашка игрока (далее "моя шашка, наша и т.д")
	 */
	deck.setOnClick = function() {
		deck.element.on('click', '.me', function() {
			if(!deck.isUp) {
				current = $(this).attr('id');
				deck.findAllPossibleWays(current);
			} else {
				$('.free').removeClass('free');
			}
			deck.isUp = !deck.isUp;
		});
		deck.element.on('click', '.free', function() {
			$(this).addClass('me');
			if($(this).hasClass('kill')) {
				$(this).removeClass('kill');
				$('#' + ((deck.getRow($(this).attr('id')) + deck.getRow(current))/2) + '-' 
					+ ((deck.getCol($(this).attr('id')) + deck.getCol(current))/2)).removeClass('enemy');
			}
			$('#' + current).removeClass('me');
			current = $(this).attr('id');
			$('.free').removeClass('free');
			deck.isUp = false;
		});
	}

	/*	Задаем начальное положение "нашим" шашкам*/
	deck.setPlayerChips = function() {
		for (var i = 1; i < 4; i++) {
			for (var j = 1; j < 9; j+=2) {
				if(i == 2 && j == 1) {
					j = 2;
				}
				$('#' + i + '-' + j).addClass('me');
			}
		}
	}

	/*	Находим все возможные пути для шашки
	 *	chipId - id клетки, в которой находится выбранная шашка
	 */
	deck.findAllPossibleWays = function(chipId) {
		var isKill = false;
		var frontRight = '#' + (deck.getRow(chipId) + 1) + '-' + (deck.getCol(chipId) + 1);
		var frontLeft = '#' + (deck.getRow(chipId) + 1) + '-' + (deck.getCol(chipId) - 1);
		isKill = deck.isKill(chipId, frontRight, frontLeft);
		if(!isKill) {
			if(!$(frontRight).hasClass('me') && !$(frontRight).hasClass('enemy')) {
				$(frontRight).addClass('free');
			}
			if(!$(frontLeft).hasClass('me') && !$(frontLeft).hasClass('enemy')) {
				$(frontLeft).addClass('free');
			}
		}
	}

	/*	Выясняем, можем ли мы убить шашку оппонента
	 * 	chipId - id нашей шашки
	 *	frontRight - передняя правая клетка
	 *	frontLeft - передняя левая клетка
	 */
	deck.isKill = function(chipId, frontRight, frontLeft) {
		var kill = false;
		if($(frontRight).hasClass('enemy') && 
			!deck.isBusy('#' + (deck.getRow(chipId) + 2) + '-' + (deck.getCol(chipId) + 2))) { //Если спереди справа
			kill = deck.addKillCell('#' + (deck.getRow(chipId) + 2) + '-' + (deck.getCol(chipId) + 2));
		}
		if($(frontLeft).hasClass('enemy') && 
			!deck.isBusy('#' + (deck.getRow(chipId) + 2) + '-' + (deck.getCol(chipId) - 2))) { //Если спереди слева
			kill = deck.addKillCell('#' + (deck.getRow(chipId) + 2) + '-' + (deck.getCol(chipId) - 2));
		}
		if($('#' + (deck.getRow(chipId) - 1) + '-' + (deck.getCol(chipId) + 1)).hasClass('enemy') && 
			!deck.isBusy('#' + (deck.getRow(chipId) - 2) + '-' + (deck.getCol(chipId) + 2))) { //Если сздаи справа
			kill = deck.addKillCell('#' + (deck.getRow(chipId) - 2) + '-' + (deck.getCol(chipId) + 2));
		}
		if ($('#' + (deck.getRow(chipId) - 1) + '-' + (deck.getCol(chipId) - 1)).hasClass('enemy') && 
			!deck.isBusy('#' + (deck.getRow(chipId) - 2) + '-' + (deck.getCol(chipId) - 2))) { //Если сзади слева
			kill = deck.addKillCell('#' + (deck.getRow(chipId) - 2) + '-' + (deck.getCol(chipId) - 2));
		}
		return kill;
	}

	/*	Добавляем к свободной ячейке за противником класс kill
	 *	kill - класс, при нажатии на который, шашка противника уничтожается
	 * 	behindFront - id ячейки за шашкой противника
	 */
	deck.addKillCell = function(behind) {
		$(behind).addClass('free');
		$(behind).addClass('kill');
		return true;
	}

    /* 	Получаем номер строки у ячейки в виде целого числа
	 * 	cellId - id ячейки, номер строки которой необходимо получить
	 */
	deck.getRow = function(cellId) {
		return parseInt(cellId[0]);
	}

    /*	Получаем номер столбца ячейки в виде целого числа
	 *	cellId - id ячейки, номер столбца которой необходимо получить
	 */
	deck.getCol = function(cellId) {
		return parseInt(cellId[2])
	}

	/*	Проверка ячейки на занятость шашкой
	 * 	cellId - id ячейки, которую проверяем
	 */	
	deck.isBusy = function (cellId) {
		return $(cellId).hasClass('me') || $(cellId).hasClass('enemy');
	}

	deck.initialize(); // Заполняем поле при создании объекта
}