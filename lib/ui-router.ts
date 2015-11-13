/**
 * Created by bob on 11/11/15.
 */

import { bundle, bundleStore } from 'ng-forward';

let stateConfigStore: any = {};

export function bootstrap(component: any, otherProviders?: any[] = []): any {
    let selector = bundleStore.get('selector', component);

    let rootElement = document.querySelector(selector);

    let decoratedModule = bundle(selector, component, otherProviders);

    decoratedModule.config(['$stateProvider', '$controllerProvider', ($stateProvider: any, $controllerProvider: any) => {
        Object.keys(stateConfigStore).forEach((stateName: string) => {
            $stateProvider.state(stateName, stateConfigStore[stateName]);
            $controllerProvider.register(stateConfigStore[stateName].controller.name, stateConfigStore[stateName]);
        });
    }]);

    return angular.bootstrap(rootElement, [selector]);
}

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
