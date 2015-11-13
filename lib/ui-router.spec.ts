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

        injector = bootstrap(MyApp, ['ui.router']);

    });

    it('bundles up an angular module', () => {
        //noinspection BadExpressionStatementJS
        angular.module('my-app').should.exist;
    });

    it('returns the injector', () => {
        console.log(injector);
        injector.should.respondTo('get');
        injector.get('myAppDirective')[0].should.have.property('name', 'myApp');
    });

    it('have a state config', () => {
        let $state = injector.get('$state');
        let stateObj = $state.get()[1];
        $state.get().length.should.eq(2);
        console.log($state.get());
        stateObj.name.should.eqls('Home');
        stateObj.controller.name.should.eqls('MyApp');
        stateObj.url.should.eqls('/');
        stateObj.template.should.eqls(templateStr);
    });
});
