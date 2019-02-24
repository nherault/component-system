export default class Loop {
    private static stepBind: any;

    private lastTime: number | undefined;
    private requestAnimationFrameId: number | undefined;
    private updateFct: Array<(elapsedTime: number) => void>;
    private drawFct: Array<() => void>;

    constructor() {
        Loop.stepBind = this.step.bind(this);
        this.updateFct = [];
        this.drawFct = [];
    }

    public addUpdate(fct: (elapsedTime: number) => void): Loop {
        this.updateFct.push(fct);
        return this;
    }

    public addDraw(fct: () => void): Loop {
        this.drawFct.push(fct);
        return this;
    }

    public start(): Loop {
        this.lastTime = undefined;
        this.requestAnimationFrameId = requestAnimationFrame(Loop.stepBind);
        return this;
    }

    public stop(): Loop {
        if (this.requestAnimationFrameId !== undefined) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }

        return this;
    }

    private step(timestamp: number) {
        if (this.lastTime === undefined) {
            this.lastTime = timestamp;
        }
        const elapsedTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        this.updateFct.forEach(updateFct => updateFct(elapsedTime));
        this.drawFct.forEach(drawFct => drawFct());
        requestAnimationFrame(Loop.stepBind);
    }
}
