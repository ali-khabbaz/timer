(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('loginCtrl', loginCtrl);

		loginCtrl.$inject = ['$http', 'mainViewFactory'];

		function loginCtrl($http, mainFac) {
			var vm = this;
			vm.login = login;
			vm.authenticated = mainFac.isAuthenticated();
			vm.logOut = logOut;
			vm.user = '';

			function logOut() {
				mainFac.removeToken();
				vm.authenticated = mainFac.isAuthenticated();
			}
			if (mainFac.isAuthenticated()) {
				vm.user = mainFac.getUser();
			}

			function login(email, password) {
				var url = "http://127.0.0.1/app/login";
				var data = {
					"email": email,
					"password": password
				};

				$http.post(url, data)
					.success(function (res) {
						console.log('>>>>>>>', res);
						mainFac.setToken(res.token);
						mainFac.setUser([
							res.user,
							res.id
						]);
						console.log('get user', mainFac.getUser());
						vm.user = mainFac.getUser();
						vm.authenticated = mainFac.isAuthenticated();
					}).error(function (err) {
						console.log('error is', err);
					});
			}
		}

	});
}());