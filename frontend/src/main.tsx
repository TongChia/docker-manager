import {render} from 'preact';
import {App} from './app';
import './style.css';

if (!('go' in window)) {
    location.replace('/');
}

render(<App/>, document.getElementById('app')!);
