import {Component} from 'ng-forward';
import {bootstrap, StateConfig} from './ui-router';

chai.should();

describe('Bootstrap and state configuration', () => {
    let myAppEl, injector;
    const templateStr = '<div class="home"></div>';
    before(() => {

        myAppEl = document.createElement('my-app');
        document.body.appendChild(myAppEl);

        @StateConfig('Home', {
            url: '/',
            template: templateStr
        })
        @Component({
            selector: 'my-app',
            template: '<div></div>'
        })
        class MyApp {}

        injector = bootstrap(MyApp);

    });

    it('bundles up an angular module', () => {
        //noinspection BadExpressionStatementJS
        angular.module('my-app').should.exist;
    });

    it('returns the injector', () => {
        injector.should.respondTo('get');
        injector.get('myAppDirective')[0].should.have.property('name', 'myApp');
    });

    it('have a state config', () => {
        let $state = injector.get('$state');
        $state.get().name.should.eqls('Home');
        $state.get().controller.name.should.eqls('MyApp');
        $state.get().url.should.eqls('/');
        $state.get().template.should.eqls(templateStr);
    });
});
