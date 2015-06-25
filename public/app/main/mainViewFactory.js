define(['app'], function (app) {
	app.factory('mainViewFactory', mainViewFactory);
	mainViewFactory.$inject = ['$window'];

	function mainViewFactory($window) {
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
				toTime : toTime
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
			return ( (parts[0] * 3600) + (parts[1] * 60) + parts[2]*1 );
		}


		function toTime( a ) {
			var result = [Math.floor(a/3600) , Math.floor ((a%3600) /60) , (a%60) ];
			return [result[0] , ':' , result[1] , ':' , result[2]].join('');
		}
	}

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('mainViewFactory');
	}]);
});