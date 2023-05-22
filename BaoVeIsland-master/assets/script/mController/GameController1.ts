import { _decorator, assetManager, BoxCollider, BoxCollider2D, CCLoader, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, EventTouch, Input, instantiate, IPhysics2DContact, ITriggerEvent, Label, Node, PhysicsSystem2D, PolygonCollider2D, Prefab, resources, Sprite, Tween, tween, UITransform, Vec3 } from 'cc';
import { GameConfig } from '../config/GameConfig';
import { ShipType } from '../item/ShipType';
import { ShipController1 } from './ShipController1';
import { BulletController1 } from './BulletController1';
const { ccclass, property } = _decorator;

@ccclass('GameController1')
export class GameController1 extends Component {

    @property(Node)
    tank: Node;

    @property(Label)
    labelScore: Label;

    @property(Prefab)
    shipEnemy: Prefab

    @property(Prefab)
    bulletEnermy: Prefab

    @property(Node)
    gamePlay: Node

    @property(Label)
    labelEndGame: Label

    @property(Node)
    background: Node

    @property(ShipType)
    shipTypeList: ShipType[] = [];

    score = 0;

    start() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;

        this.createShip();

        this.labelEndGame.node.active = false;

        //play music
        //AudioController.inst.playSound();

        // set time to start game
        // setTimeout(() => {
        //     this.startGame();
        // }, 2000);

        // create check physic for node tank
        //this.tank.getComponent(BoxCollider2D).on('onTriggerEnter', this.onBeginContactTank, this);
    }

    startGame() {
        // spawn ship
        this.createShip();
    }

    createShip() {
        this.schedule(() => {
            let shipPositionX = this.randomNumber(-GameConfig.HALF_SCREEN_W + GameConfig.SHIP_W, GameConfig.HALF_SCREEN_W - GameConfig.SHIP_W);

            // gen ship
            let ship = instantiate(this.shipEnemy);
            let shipType = this.shipTypeList[this.randomNumber(0, 1)];
            ship.getComponent(ShipController1).setUp(shipType, new Vec3(shipPositionX, GameConfig.HALF_SCREEN_H - 20, 0), () => {
                ship.destroy();
                this.updateScore(100);
            })
            this.gamePlay.addChild(ship);

            //gen bullet for ship
            this.genBullet(this.bulletEnermy, new Vec3(ship.position.x, ship.position.y - GameConfig.SHIP_H / 2, 0),
                new Vec3(0, 1, 0), shipType.shipSpeed * 1.25, 1)
        }, 2, 50)
    }

    randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    checkIntersect(tank: Node, listEnermy: Node[]) {
        for (let i = 0; i < listEnermy.length; i++) {
            let enermy = listEnermy[i];
            if (tank.getComponent(UITransform).getBoundingBox().intersects(enermy.getComponent(UITransform).getBoundingBox())) {
                console.log("game over");
                return true;
            } else {
                console.log("not overlap enermy");
            }
        }
        return false;
    }

    updateScore(score: number) {
        if (!this.labelEndGame.node.active) {
            this.score += score;
            this.labelScore.string = "Score: " + this.score;
        }
    }

    genBullet(bulletPrefab: Prefab, position: Vec3, dir: Vec3, speed: number, damage: number) {
        let bullet = instantiate(bulletPrefab);
        bullet.position = position;
        bullet.getComponent(BulletController1).setUp(dir, speed, damage)
        this.gamePlay.addChild(bullet);
    }

    update(deltaTime: number) {
        let positionYbg = this.background.getPosition().y - GameConfig.SPEED_BACKGROUND * 0.01;
        if (positionYbg == -GameConfig.HALF_SCREEN_H) {
            this.background.setPosition(0, GameConfig.HALF_SCREEN_H);
        } else {
            this.background.setPosition(0, positionYbg);
        }
    }
}


