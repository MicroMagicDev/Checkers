var current; //текущая шашка
var up = false; //поднял ли шашку

$(document).ready(function() {
	$('#8-5').addClass('me');
	$('#4-3').addClass('enemy');
	$('#6-7').addClass('enemy');
	$('#3-6').addClass('enemy');
	$('.field').on('click', '.me', function() {
		if(!up) {
			current = $(this).attr('id');
			findAllPossibleWays(current);
		} else {
			$('.free').removeClass('free');
		}
		up = !up;
	});
	$('.field').on('click', '.free', function() {
		$(this).addClass('me');
		if($(this).hasClass('kill')) {
			$(this).removeClass('kill');
			$('#' + ((getRow($(this).attr('id')) + getRow(current))/2) + '-' + ((getCol($(this).attr('id')) + getCol(current))/2)).removeClass('enemy');
		}
		$('#' + current).removeClass('me');
		current = $(this).attr('id');
		$('.free').removeClass('free');
		up = false;
	});
});


/************ Находит все возможные варианты хода для шашки ***************/

function findAllPossibleWays(id) {
	var isKill = false;
	var frontRight = '#' + (getRow(id) - 1) + '-' + (getCol(id) + 1);
	var behindFrontRight = '#' + (getRow(id) - 2) + '-' + (getCol(id) + 2);
	var frontLeft = '#' + (getRow(id) - 1) + '-' + (getCol(id) - 1);
	var behindFrontLeft = '#' + (getRow(id) - 2) + '-' + (getCol(id) - 2	);
	var backRight = '#' + (getRow(id) + 1) + '-' + (getCol(id) + 1);
	var behindBackRight = '#' + (getRow(id) + 2) + '-' + (getCol(id) + 2);
	var backLeft = '#' + (getRow(id) + 1) + '-' + (getCol(id) - 1);
	var behindBackLeft = '#' + (getRow(id) + 2) + '-' + (getCol(id) - 2	);
	if($(frontRight).hasClass('enemy') && !isBusy(behindFrontRight)) {
		$(behindFrontRight).addClass('free');
		$(behindFrontRight).addClass('kill');
		isKill = true;
	}
	if($(frontLeft).hasClass('enemy') && !isBusy(behindFrontLeft)) {
		$(behindFrontLeft).addClass('free');
		$(behindFrontLeft).addClass('kill');
		isKill = true;
	}
	if($(backRight).hasClass('enemy') && !isBusy(behindBackRight)) {
		$(behindBackRight).addClass('free');
		$(behindBackRight).addClass('kill');
		isKill = true;
	}
	if($(backLeft).hasClass('enemy') && !isBusy(behindBackLeft)) {
		$(behindBackLeft).addClass('free');
		$(behindBackLeft).addClass('kill');
		isKill = true;
	}
	if(!isKill) {
		if(!$(frontRight).hasClass('me') && !$(frontRight).hasClass('enemy')) {
			$(frontRight).addClass('free');
		}
		if(!$(frontLeft).hasClass('me') && !$(frontLeft).hasClass('enemy')) {
			$(frontLeft).addClass('free');
		}
	}
}

function getRow(id) {
	return parseInt(id[0]);
}

function getCol(id) {
	return parseInt(id[2]);
}


function isBusy(id) {
	return $(id).hasClass('me') || $(id).hasClass('enemy');
}

/**************** Получаем id ячеек по диагоналям *************/
/**************** */


/************ Расставляем шашки на доске ***************/

function setCheckers() {
	for (var i = 1; i <= 3; i++) {
		for (var j = 2; j <=8; j+=2) {
			if(i == 2 && j == 2) {
				j=1;
			}
			$('#' + i + '-' + j).addClass('enemy');
		}
	}
	for (var i = 6; i <= 8; i++) {
		for (var j = 1; j <=8; j+=2) {
			if(i == 7 && j == 1) {
				j++
			}
			$('#' + i + '-' + j).addClass('me');
		}
	}
}

/************ Поднятие шашки **********/

function up(id) {

}