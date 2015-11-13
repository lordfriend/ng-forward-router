#ng-forward-router

A plugin for ng-forward which enables using ui-router with decorator

##Usage

```
import {bootstrap, StateConfig} from 'ng-forward-router';

// define state config just like ui-router,
// but you don't need to specify the controller property,
// StateConfig decorator will bind the controller with the decorated class
// if you don't specify the controllerAs property, 'vm' will be used as default
@StateConfig('main', {
    url: '/main'
    template: '<example></example>'
}
@Inject('SomeService')
class MainCtrl {
    constructor(SomeService) {
        this.someValue = SomeService();
    }
}

// bootstrap angular app using the bootstrap method from ng-forward-router instead of ng-forward.

bootstrap(MainCtrl);
```
