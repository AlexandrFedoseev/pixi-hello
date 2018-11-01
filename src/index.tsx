import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app.component';

ReactDOM.render(
    <App 
        width={window.innerWidth}
        height={window.innerHeight}
        transparent={false}
        backgroundColor={0xd6cfcb}
        resolution={window.devicePixelRatio ? window.devicePixelRatio : 1}/>,
    document.getElementById('app')
);