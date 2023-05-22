import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EventTouch, Input, instantiate, IPhysics2DContact, ITriggerEvent, Label, Node, Prefab, Quat, Tween, tween, Vec3 } from 'cc';
import { GameConfig } from '../config/GameConfig';
import { BulletController1 } from './BulletController1';
const { ccclass, property } = _decorator;

@ccclass('TankController')
export class TankController extends Component {

    @property(Node)
    UI: Node;

    @property(Prefab)
    bulletTank: Prefab

    @property(Node)
    labelEndGame: Node

    start() {
        //check collision
        this.node.getComponent(BoxCollider2D).on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);

        //get on touch background
        this.UI.on(Input.EventType.TOUCH_START, this.onTouchBackground, this);
    }

    update(deltaTime: number) {

    }

    onTriggerEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name.includes(GameConfig.BULLET_ENERMY)) {
            console.log("hit bullet enermy");
            this.labelEndGame.active = true;
        }
        if (otherCollider.node.name.includes(GameConfig.SHIP)) {
            console.log("hit ship");
            this.labelEndGame.active = true;
        }
    }

    onTouchBackground(events: EventTouch) {
        //move Tank
        let tankLocation = this.node.getPosition();
        //console.log("tanklocation: " + tankLocation);
        let touchScreen = events.getUILocation();
        let backgroundLocation = new Vec3(touchScreen.x - GameConfig.HALF_SCREEN_W, touchScreen.y - GameConfig.HALF_SCREEN_H, 0);
        //calculate length
        let lengthVec = Vec3.distance(backgroundLocation, tankLocation);
        //console.log("length vec: " + lengthVec);
        //console.log("backgroundLocation: " + backgroundLocation);
        let dist = this.getDistance(backgroundLocation, tankLocation);
        //console.log("distance: " + dist);

        dist.normalize();
        //console.log("distanceNormalize: " + dist);
        let zRotate = Math.atan2(dist.x, dist.y) * 180 / Math.PI;
        //console.log("zRotate: " + zRotate);

        //rotate tank
        //this.node.angle = -zRotate;
        tween(this.node).to(0.3, { angle: -zRotate }).start();

        //cacul time to move the locate
        let countTime = lengthVec / GameConfig.SPEED_TANK / 10;
        //console.log("count Time: " + countTime);

        //stop the old move of tank if not stop the tank will continue move if the count time not decrease to 0
        Tween.stopAllByTag(0);
        //move the tank
        tween(this.node).tag(0).to(countTime,
            { position: new Vec3(touchScreen.x - GameConfig.HALF_SCREEN_W, touchScreen.y - GameConfig.HALF_SCREEN_H, 0) },
            {
                onUpdate: () => {

                }
            }
        ).start();

        //gen bullet for tank
        this.genBullet(this.bulletTank, new Vec3(tankLocation.x, tankLocation.y - GameConfig.SHIP_H / 2, 0),
            new Vec3(dist.x, dist.y, 0), GameConfig.SPEED_TANK, 1)
    }

    getDistance(target, origin) {
        return target.subtract(origin);
    }

    genBullet(bulletPrefab: Prefab, position: Vec3, dir: Vec3, speed: number, damage: number) {
        let bullet = instantiate(bulletPrefab);
        bullet.position = position;
        bullet.getComponent(BulletController1).setUp(dir, speed, damage)
        this.UI.addChild(bullet);
    }
}


