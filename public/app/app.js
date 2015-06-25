define(['routes', 'dependencyResolverFor'], function (routes, dependencyResolverFor) {
	var app = angular.module('app', ['ngRoute']);
	app.config(
		[
			'$routeProvider',
			'$locationProvider',
			'$controllerProvider',
			'$compileProvider',
			'$filterProvider',
			'$provide',
			function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
				app.controller = $controllerProvider.register;
				app.directive = $compileProvider.directive;
				app.filter = $filterProvider.register;
				app.factory = $provide.factory;
				app.service = $provide.service;

				if (routes.routes !== undefined) {
					angular.forEach(routes.routes, function (route, path) {
						$routeProvider.when(path, {
							templateUrl: route.templateUrl,
							resolve: dependencyResolverFor(route.dependencies)
						});
					});
				}
				if (routes.defaultRoutePath !== undefined) {
					$routeProvider.otherwise({
						redirectTo: routes.defaultRoutePath
					});
				}
				//$httpProvider.interceptors.push('mainViewFactory');
				//$httpProvider.responseInterceptors.push('httpInterceptor');
			}
		]
	);
	return app;
});