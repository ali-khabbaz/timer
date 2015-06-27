define(['app'], function (app) {
	app.factory('mainViewFactory', mainViewFactory);
	mainViewFactory.$inject = ['$window'];

	function mainViewFactory($window) {

		var grgSumOfDays = [
			[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
			[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
		];
		var hshSumOfDays = [
			[0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365],
			[0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366]
		];

		var factory = {
				getToken: getToken,
				setToken: setToken,
				getUser: getUser,
				setUser: setUser,
				isAuthenticated: isAuthenticated,
				removeToken: removeToken,
				request: request,
				response: response,
				toSeconds: toSeconds,
				toTime: toTime,
				timestamp_ToShamsi: timestamp_ToShamsi,
				shamsi_num_to_timestamp: shamsi_num_to_timestamp
			},
			storage = $window.localStorage,
			cached_token;
		return factory;



		function setToken(token) {
			cached_token = token;
			storage.setItem('userToken', token);
		}

		function getToken() {
			if (!cached_token) {
				cached_token = storage.getItem('userToken');
			}
			return cached_token;
		}

		function isAuthenticated() {
			return !!getToken();
		}

		function setUser(user) {
			if (isAuthenticated()) {
				storage.setItem('userInfo', user);
			}
		}

		function getUser() {
			return storage.getItem('userInfo');
		}

		function removeToken() {
			cached_token = null;
			storage.removeItem('userToken');
			storage.removeItem('userInfo');
		}

		function request(config) {
			var token = getToken();
			if (token) {
				config.headers.authorization = 'ali is just' + token;
			}
			return config;
		}

		function response(res) {
			return res;
		}

		function toSeconds(time_str) {
			var parts = time_str.split(':');
			return ((parts[0] * 3600) + (parts[1] * 60) + parts[2] * 1);
		}


		function toTime(a) {
			var result = [Math.floor(a / 3600), Math.floor((a % 3600) / 60), (a % 60)];
			return [result[0], ':', result[1], ':', result[2]].join('');
		}



		function calNames(calendarName, monthNo) {
			switch (calendarName) {
			case "hf":
				return ["فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"][monthNo];
			case "ge":
				return [" January ", " February ", " March ", " April ", " May ", " June ", " July ", " August ", " September ", " October ", " November ", " December "][monthNo];
			case "gf":
				return ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوثن", "ژوییه", "اوت", "سپتامبر", "اكتبر", "نوامبر", "دسامبر"][monthNo];
			case "df":
				return ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"][monthNo];
			case "de":
				return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][monthNo];
			}
		}

		function timestamp_ToShamsi(date, Format) {
			var date = new Date(date);
			var grgYear = date.getFullYear(),
				grgMonth = date.getMonth() + 1,
				grgDay = date.getDate();
			var hshYear = grgYear - 621;
			var hshMonth, hshDay;
			var grgLeap = grgIsLeap(grgYear);
			var hshLeap = hshIsLeap(hshYear - 1);
			var hshElapsed;
			var grgElapsed = grgSumOfDays[(grgLeap ? 1 : 0)][grgMonth - 1] + grgDay;
			var XmasToNorooz = (hshLeap && grgLeap) ? 80 : 79;
			if (grgElapsed <= XmasToNorooz) {
				hshElapsed = grgElapsed + 286;
				hshYear--;
				if (hshLeap && !grgLeap)
					hshElapsed++;
			} else {
				hshElapsed = grgElapsed - XmasToNorooz;
				hshLeap = hshIsLeap(hshYear);
			}
			for (var i = 1; i <= 12; i++) {
				if (hshSumOfDays[(hshLeap ? 1 : 0)][i] >= hshElapsed) {
					hshMonth = i;
					hshDay = hshElapsed - hshSumOfDays[(hshLeap ? 1 : 0)][i - 1];
					break;
				}
			}
			if (Format == "int") {
				if (hshMonth.toString().length == 1)
					hshMonth = "0" + hshMonth;
				if (hshDay.toString().length == 1)
					hshDay = "0" + hshDay;
				return hshYear + "" + hshMonth + "" + hshDay;
			}
			if (Format == "Long")
				return hshDay + " " + calNames("hf", hshMonth - 1) + " " + hshYear;
			//        return hshDayName(hshDayOfWeek(hshYear, hshMonth, hshDay)) + "  " + hshDay + " " + calNames("hf", hshMonth - 1) + " " + hshYear;
			if (Format == "Array")
				return [hshYear, hshMonth, hshDay];
			else
				return hshYear + " /" + hshMonth + " /" + hshDay;
		}

		function grgIsLeap(Year) {
			return ((Year % 4) === 0 && ((Year % 100) !== 0 || (Year % 400) === 0));
		}

		function hshIsLeap(Year) {
			Year = (Year - 474) % 128;
			Year = ((Year >= 30) ? 0 : 29) + Year;
			Year = Year - Math.floor(Year / 33) - 1;
			return ((Year % 4) === 0);
		}

		function hshDayOfWeek(hshYear, hshMonth, hshDay) {
			var value;
			value = hshYear - 1376 + hshSumOfDays[0][hshMonth - 1] + hshDay - 1;
			for (var i = 1380; i < hshYear; i++)
				if (hshIsLeap(i)) value++;
			for (i = hshYear; i < 1380; i++)
				if (hshIsLeap(i)) value--;
			value = value % 7;
			if (value < 0) value = value + 7;
			return (value);
		}

		function ToGregorian(hshYear, hshMonth, hshDay) {
			var grgYear = hshYear + 621;
			var grgMonth, grgDay;
			var hshLeap = hshIsLeap(hshYear);
			var grgLeap = grgIsLeap(grgYear);
			var hshElapsed = hshSumOfDays[hshLeap ? 1 : 0][hshMonth - 1] + hshDay;
			var grgElapsed;
			if (hshMonth > 10 || (hshMonth == 10 && hshElapsed > 286 + (grgLeap ? 1 : 0))) {
				grgElapsed = hshElapsed - (286 + (grgLeap ? 1 : 0));
				grgLeap = grgIsLeap(++grgYear);
			} else {
				hshLeap = hshIsLeap(hshYear - 1);
				grgElapsed = hshElapsed + 79 + (hshLeap ? 1 : 0) - (grgIsLeap(grgYear - 1) ? 1 : 0);
			}
			for (var i = 1; i <= 12; i++) {
				if (grgSumOfDays[grgLeap ? 1 : 0][i] >= grgElapsed) {
					grgMonth = i;
					grgDay = grgElapsed - grgSumOfDays[grgLeap ? 1 : 0][i - 1];
					break;
				}
			}
			var res = [];
			res.push(grgYear);
			res.push(grgMonth);
			res.push(grgDay);
			return res;
			//return grgYear+"-"+grgMonth+"-"+grgDay;
		}

		function shamsi_num_to_timestamp(shamsinum) {
			var y = Math.floor(shamsinum / 10000);
			shamsinum = shamsinum % 10000;
			var m = Math.floor(shamsinum / 100);
			var d = shamsinum % 100;
			var date = ToGregorian(y, m, d);
			return Date.UTC(date[0], date[1] - 1, date[2]);
		}
	}

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('mainViewFactory');
	}]);
});