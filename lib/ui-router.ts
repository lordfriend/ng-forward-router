/**
 * # ui-router support for ng-forward, you can use decorator to register new state
 */

import { bundle, bundleStore } from 'ng-forward';

let stateConfigStore: any = {};

/**
 * # Bootstrap function
 * Bootstrap angular module with dependency, this is almost the same function of ng-forward bootstrap,
 * it add a config call to register state and controllers.
 * ## Usage
 * Just like ng-forward bootstrap function.
 *
 * ```js
 * import {Component} from 'ng-forward';
 * import {bootstrap} from 'ng-forward-router';
 *
 * @Component({
 *   selector: 'app',
 * })
 * class MyApp {
 * }
 * bootstrap(MyApp, ['ui.router']);
 * ```
 * @param component  the component created by @Component decorator, is your root component
 * @param otherProviders  can be providers and strings which represent other angular 1.x modules
 * @returns {auto.IInjectorService}  an angular injector instance of your app module.
 */
export function bootstrap(component: any, otherProviders?: any[] = []): any {
    let selector = bundleStore.get('selector', component);

    let rootElement = document.querySelector(selector);

    let decoratedModule = bundle(selector, component, otherProviders);

    // config $stateProvider and register controller from state config.
    decoratedModule.config(['$stateProvider', '$controllerProvider', ($stateProvider: any, $controllerProvider: any) => {
        Object.keys(stateConfigStore).forEach((stateName: string) => {
            $stateProvider.state(stateName, stateConfigStore[stateName]);
            if(stateConfigStore[stateName].controller) {
                $controllerProvider.register(stateConfigStore[stateName].controller.name, stateConfigStore[stateName]);
            }
        });
    }]);

    return angular.bootstrap(rootElement, [selector]);
}

/**
 * # StateConfig function
 * Register a state of ui-router for later usage.
 * registered state will stored in a map and get registered by $stateProvider when using bootstrap from this module.
 *
 * ## Usage
 * You need use this decorator above your controller class. and specify the state name and state config object.
 * But leave the controller property to this decorator, it will automatically write the controller property using your
 * decorated class.
 * ```js
 * import {Component} from 'ng-forward';
 * import {bootstrap, StateConfig} from 'ng-forward-router';
 *
 * @StateConfig('home', {
 *   url: '/';
 *   template: '<ui-view/>'
 * })
 * @Component({
 *   selector: 'my-app'
 * })
 * class MyApp {}
 *
 * bootstrap(MyApp, ['ui.router']);
 *
 * @param stateName  the state name of your state config object, see ui-router wiki
 * @param configObject  the state config except the name and controller (controllerAs will be add automatically as 'vm')
 */
export function StateConfig(stateName: string, configObject: any) {
    return function decorator(t: any):any {
        let extendObject: any = {};
        if(!configObject.controller) {
            extendObject.controller = t;
        }
        if(!configObject.controllerAs) {
            extendObject.controllerAs = 'vm';
        }
        stateConfigStore[stateName] = Object.assign(extendObject, configObject);
    }
}
