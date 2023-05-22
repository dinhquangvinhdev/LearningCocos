import { _decorator, Component, Node, Prefab, instantiate, Vec3, Vec2, Touch, tween, Label, } from 'cc';
import { BulletController } from './BulletController';
import { GameConfig } from './config/GameConfig';
import { ShipType } from './item/ShipType';
import { PlayerCanon } from './PlayerCanon';
import { ShipController } from './ShipController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    gamePlay: Node;
    @property(Prefab)
    bulletPrefab: Prefab;
    @property(Node)
    playerCanon: Node;

    @property(Prefab)
    shipPrefab: Prefab;
    gameScore = 0;
    @property(Label)
    scoreLb: Label;

    //dinh nghia vi tri xuat phat cua ship
    @property(Vec3)
    shipStartPosionList: Vec3[] = [];
    shipOfTurn = 5;
    //dinh nghia ship
    @property(ShipType)
    shipTypeList: ShipType[] = [];
    start() {
        this.gamePlay.on(Node.EventType.TOUCH_START, this.onTouchCanon, this);
        //start turn
        setTimeout(() => {
            this.startTurn();
        }, 2000);

    }
    private startTurn() {
        let timeCount = 0;
        for (let i = 0; i < this.shipOfTurn; i++) {
            setTimeout(() => {
                this.createShip();
            }, i * 1000);
        }
    }
    private createShip() {
        let ship = instantiate(this.shipPrefab);
        let speed = -1;
        let health = 20;
        let rnd = Math.floor(Math.random() * this.shipStartPosionList.length);
        let rndShip = Math.floor(Math.random() * this.shipTypeList.length);
        ship.getComponent(ShipController).setUp(this.shipTypeList[rndShip], this.shipStartPosionList[rnd], () => {
            this.shipDie();
        });
        this.gamePlay.addChild(ship);
    }
    private shipDie() {
        this.gameScore += 10;
        //update score
        this.scoreLb.string = 'Score:' + this.gameScore;
    }
    private onTouchCanon(event: Touch) {
        //console.log(event.getUILocation());
        let touchLocation = event.getUILocation();
        let loc = new Vec3(touchLocation.x - GameConfig.HALF_SCREEN_W, touchLocation.y - GameConfig.HALF_SCREEN_H, 0);
        let dist = this.getDistance(this.playerCanon.position, loc);

        dist.normalize()
        const zAngle = Math.atan2(dist.x, dist.y) * 180 / Math.PI;
        //get rot
        //this.node.setRotationFromEuler(0,0,-z);
        let canonSprite = this.playerCanon.getComponent(PlayerCanon).getCanonSprite();
        const fire = () => {
            let bullet = instantiate(this.bulletPrefab);
            bullet.setPosition(this.playerCanon.position);
            bullet.getComponent(BulletController).setUp(dist, 5, 1);
            this.gamePlay.addChild(bullet);
        }
        tween(canonSprite.node).sequence(
            tween(canonSprite.node).to(0.2, { eulerAngles: new Vec3(0, 0, -zAngle) }),
            tween(canonSprite.node).call(fire)
        ).start();


    }
    private getDistance(origin: Vec3, target: Vec3) {
        return target.subtract(origin);
    }

}


