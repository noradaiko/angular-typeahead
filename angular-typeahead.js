'use strict';

angular.module('typeahead.directives', []);

angular.module('typeahead.directives', []).directive('ngTypeahead', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            filter: '&',
            ngModel: '=',
            selectedItem: '=',
            limit: '=',
            rateLimitWait: '='
        },
        link: function (scope, element, attrs) {
            var construct = {
                valueKey: attrs.valueKey,
                remote: {
                    url: attrs.url,
                    cache: false,
                    filter: function (parsedResponse) {
                        if (attrs.filter) {
                            return scope.filter({ parsedResponse: parsedResponse });
                        }

                        return parsedResponse;
                    }
                }
            };

            if (attrs.jsonp) {
                construct.dataType = 'jsonp';
            }

            if (attrs.limit) {
                construct.limit = attrs.limit;
            }

            if (attrs.rateLimitWait) {
                construct.remote.rateLimitWait = attrs.rateLimitWait;
            }

            element.typeahead(construct);

            scope.$watch('selectedItem', function (newValue) {
                if (newValue === '') {
                    element.typeahead('setQuery', '');
                }
            }, true);

            element.on('change', function (event) {
                if (attrs.ngModel) {
                    scope.ngModel = $(event.target).val();
                }

                scope.$apply();
            });

            element.on('typeahead:selected', function (event, datum, dataset) {
                scope.selectedItem = datum;

                if (attrs.ngModel) {
                    scope.ngModel = $(event.target).val();
                }

                scope.$apply();
            });

            element.on('typeahead:autocompleted', function (event, datum, dataset) {
                scope.selectedItem = datum;

                if (attrs.ngModel) {
                    scope.ngModel = $(event.target).val();
                }

                scope.$apply();
            });

            scope.$on('$destroy', function () {
                element.typeahead('destroy');
            });
        }
    };
});
