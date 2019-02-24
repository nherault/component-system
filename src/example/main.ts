import { ComponentSystemDefault } from '../component';
import { componentKeepInRectangle, componentPositionUpdater, componentShake, componentTimerEvent } from '../component/components';
import Loop from './loop';
const actionBar: HTMLCanvasElement = document.getElementById('actionBar') as HTMLCanvasElement;
const canvas: HTMLCanvasElement = document.getElementById('display') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const loop = new Loop();

const REF_ENTITY: any = { position: { x: 250, y: 250}, velocity: { x: 20, y: 20 }, size: { x: 20, y: 20 }, render: 'rectangle' };
let gEntity: any = JSON.parse(JSON.stringify(REF_ENTITY));
const componentSystem = new ComponentSystemDefault();

const componentTest: any[] = [
    { id: 'componentPositionUpdater', title: 'componentPositionUpdater', components: [{ id: componentPositionUpdater }] },
    {
        components: [{
            id: componentKeepInRectangle,
            inits: {
                position: { x: 200, y: 200 },
                size: { x: 100, y: 100 },
            },
        },
        { id: componentPositionUpdater }],
        id: 'componentKeepInRectangle',
        title: 'componentKeepInRectangle',
    },
    { id: 'componentShake', title: 'componentShake', components: [{ id: componentShake }] },
    {
        components: [{
            id: componentTimerEvent, inits: { eventType: 'myEvent', timer: 1 },
        }],
        id: 'componentTimerEvent', title: 'componentTimerEvent' },
];

componentTest.forEach(currComponentToTest => {
    const button = document.createElement('button');
    button.value = currComponentToTest.id;
    button.innerText = currComponentToTest.title;
    actionBar.appendChild(button);

    button.addEventListener('click', () => {
        loop.stop();
        gEntity = JSON.parse(JSON.stringify(REF_ENTITY));
        currComponentToTest.components.forEach((component: any) => {
            componentSystem.registerComponentHandler(component.id);
            componentSystem.addComponentToEntity(gEntity, component.id.type, component.inits);
        });
    });
});

loop.addUpdate(elapsedTime => {
        componentSystem.updateEntityComponents(gEntity, elapsedTime);
    })
    .addUpdate(() => {
        componentSystem.handleEvents(() => gEntity.position = {x : 0, y: 0});
        componentSystem.clearEvents();
    })
    .addDraw(() => context.clearRect(0, 0, 512, 512))
    .addDraw(() => drawEntity(context, gEntity))
    .start();

function drawEntity(ctx: CanvasRenderingContext2D, entity: any) {
    ctx.beginPath();
    if (entity.render === 'circle') {
        ctx.arc(entity.position.x, entity.position.y, entity.size.x, 0, 2 * Math.PI);
    } else if (entity.render === 'rectangle') {
        ctx.rect(entity.position.x, entity.position.y, entity.size.x, entity.size.y);
    }
    ctx.stroke();
}
