(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('viewCtrl', viewCtrl);
		viewCtrl.$inject = ['$http', 'mainViewFactory'];

		function viewCtrl($http, mainFac) {
			var vm = this;
			vm.getMonth = getMonth;
			vm.changeDirty = changeDirty;
			vm.chngMonth = chngMonth;
			vm.items_in_row = [];

			function changeDirty(inp1, inp2) {
				console.log('>>>>>>>>', inp1, inp2);
				vm.items_in_row[inp1 - 1].times[inp2 - 1].dirty = true;
			}

			/*function createItemInRow() {
				var salam = new Date().getTime();
				salam = mainFac.timestamp_ToShamsi(salam, 'Array');
				var i = 26;
				while(i !== 25){
					vm.items_in_row.push({"date" : salam[0].toString()+});
				}
			}*/

			var salam = new Date().getTime();

			function chngMonth() {
				vm.items_in_row = [] ;
				var current = 0;
				var month = +vm.sel_month;
				var minus_month = month - 1;
				minus_month = minus_month.toString();
				if (minus_month.length === 1) {
					minus_month = '0' + minus_month;
				}
				if (minus_month === 0) {
					minus_month = '12';
				}
				var begin_date = '1394' + minus_month + '26';
				var end_date = '1394' + vm.sel_month + '25';
				console.log('>>>>>>>', begin_date, end_date);
				for (var i = 1; i <= 31; i++) {
					if (i === 1) {
						vm.items_in_row.push({
							"date": +begin_date,
							"times": [{
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}]
						});
					} else if (i === 31) {
						vm.items_in_row.push({
							"date": +end_date,
							"times": [{
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}]
						});
					} else {
						current = mainFac.shamsi_num_to_timestamp(begin_date) + (84600000 * (i - 1));
						current = mainFac.timestamp_ToShamsi(current, 'int');
						vm.items_in_row.push({
							"date": current,
							"times": [{
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}, {
								"begin": '00:00:00',
								"end": '00:00:00',
								"dirty": false
							}]
						});
					}
				}
				console.log('>>>>>>>>>>', vm.items_in_row);
			}

			vm.months = [{
				"id": '01',
				"name": 'فروردین'
			}, {
				"id": '02',
				"name": 'اردیبهشت'
			}, {
				"id": '03',
				"name": 'خرداد'
			}, {
				"id": '04',
				"name": 'تیر'
			}, {
				"id": '05',
				"name": 'مرداد'
			}, {
				"id": '06',
				"name": 'شهریور'
			}, {
				"id": '07',
				"name": 'مهر'
			}, {
				"id": '08',
				"name": 'آبان'
			}, {
				"id": '09',
				"name": 'آذر'
			}, {
				"id": '10',
				"name": 'دی'
			}, {
				"id": '11',
				"name": 'بهمن'
			}, {
				"id": '12',
				"name": 'اسفند'
			}];

			function getMonth() {
				console.log('>>>>', vm.sel_month);
				var ok = true;
				vm.add_day.forEach(function (val) {
					if (mainFac.toSeconds(val.begin) >= mainFac.toSeconds(val.end)) {
						val.wrong = true;
						ok = false;
					}
					if (ok) {
						console.log('send');
						var url = "http://127.0.0.1/app/view-get-month";
						$http.post(url, vm.add_day).success(function (res) {
							console.log('add_update', res);
						}).error(function (err) {
							console.log('error is', err);
							vm.last_data = err;
						});
					}
				});
			}
		}
	});
}());