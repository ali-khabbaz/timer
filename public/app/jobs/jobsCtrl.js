(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('jobsCtrl', jobsCtrl);
		jobsCtrl.$inject = ['$http', 'mainViewFactory'];

		function jobsCtrl($http, mainFac) {
			var vm = this;
			vm.last_data = '';
			vm.last_day_time = '';
			vm.add_day = [{
				"date": 13940404,
				"begin": "08:00:00",
				"end": "09:00:00",
				"wrong": false
			}];
			vm.addNewDayInput = addNewDayInput;
			vm.addUpdateDays = addUpdateDays;
			getJobs();

			function getJobs() {
				var url = "http://127.0.0.1/app/jobs";
				$http.post(url).success(function (res) {
					vm.last_data = res;
					var temp_int = 0,
						temp_str = '';

					res.forEach(function (val) {
						val.diff = mainFac.toTime(mainFac.toSeconds(val.end) - mainFac.toSeconds(val.begin));
						temp_int = temp_int + mainFac.toSeconds(val.diff);
					});

					vm.last_day_time = mainFac.toTime(temp_int);

				}).error(function (err) {
					console.log('error is', err);
					vm.last_data = err;
				});
			}

			function addNewDayInput() {
				vm.add_day.push({
					"date": 13940404,
					"begin": "08:00:00",
					"end": "09:00:00",
					"wrong": false
				});
			}

			function addUpdateDays(inp1, inp2, inp3) {
				var ok = true;
				vm.add_day.forEach(function (val) {
					if (mainFac.toSeconds(val.begin) >= mainFac.toSeconds(val.end)) {
						val.wrong = true;
						ok = false;
					}
					if (ok) {
						console.log('send');
						var url = "http://127.0.0.1/app/add-update";
						$http.post(url, vm.add_day).success(function (res) {
							console.log('add_update', res);
						}).error(function (err) {
							console.log('error is', err);
							vm.last_data = err;
						});
					}
				});
				console.log('******', vm.add_day);
			}
		}
	});
}());