import * as PIXI from 'pixi.js';
import * as React from 'react';

import { ScenesManager } from './scenes/scene.manager'
import { ViewportService } from './services/viewport.service'

export interface AppProps {
    width: number,
    height: number,
    transparent: boolean,
    backgroundColor: number,
    resolution: number
}

export interface AppState {
    app: PIXI.Application
}

export class App extends React.Component<AppProps, AppState> {
    private pixiContainer: HTMLDivElement;

    private _sceneManger: ScenesManager;
    private _viewport = new ViewportService();

    constructor(props: AppProps) {
        super(props); 
        this.state = {
            app: new PIXI.Application(props),
        };
    };

    public componentDidMount() {
        this._viewport.updateAspect();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    private handleResize() {
        this._viewport.updateAspect();
        this.state.app.renderer.resize(window.innerWidth, window.innerHeight);
        this._sceneManger.redraw();
    }

    updatePixiContainer = (element: HTMLDivElement) => {
        this.pixiContainer = element;
        if (this.pixiContainer == null || this.pixiContainer.children.length > 0) {
            return;
        }
        this.pixiContainer.appendChild(this.state.app.view);
        this._sceneManger = ScenesManager.instance(this.state.app);
        this._viewport.updateAspect();
        this._sceneManger.setScene('MAIN');
    };

    render() {
        return <div ref={this.updatePixiContainer} />;
    };

}