import { _decorator, Component, Node, director, Vec3, UITransform } from 'cc';
import { GameConfig } from './config/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
    @property(Node)
    node1: Node;
    @property(Node)
    node2: Node;
    start() {
        let uiTransform1 = this.node1.getComponent(UITransform);
        let uiTransform2 = this.node2.getComponent(UITransform);
        let bound1 = uiTransform1.getBoundingBox();
        let bound2 = uiTransform2.getBoundingBox();
        if (bound1.intersects(bound2)) {
            console.log('overlap');
        } else {
            console.log('not overlap');
        }

    }

    startGame() {
        director.loadScene(GameConfig.GAME_SCENE);
    }
}


