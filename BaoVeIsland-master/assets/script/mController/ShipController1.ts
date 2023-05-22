import { _decorator, Component, Node, ProgressBar, Sprite, Collider2D, Contact2DType, IPhysics2DContact, Vec3, log } from 'cc';
import { BulletController } from '../BulletController';
import { GameConfig } from '../config/GameConfig';
import { ShipType } from '../item/ShipType';
import { BulletController1 } from './BulletController1';
const { ccclass, property } = _decorator;

@ccclass('ShipController')
export class ShipController1 extends Component {
    @property(ProgressBar)
    healthProgress: ProgressBar;

    @property(Sprite)
    shipSprite: Sprite;

    //health
    health: number;
    fullHealth: number;
    //speed
    speed: number;
    dieCallback
    direction;
    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    setUp(shipType: ShipType, position: Vec3, dieCallback) {

        //set ship frame
        this.shipSprite.spriteFrame = shipType.shipSpriteFame;
        this.health = this.fullHealth = shipType.shipHealth;
        this.speed = shipType.shipSpeed;
        this.node.setPosition(position);
        this.dieCallback = dieCallback;
        this.direction = new Vec3(0, this.speed, 0);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.node) {
            let hitObject: Node = otherCollider.node;

            if (hitObject.name.includes(GameConfig.BULLET_TANK)) {
                let damageHealth = hitObject.getComponent(BulletController1).getDamage();
                this.health -= damageHealth;
                console.log("health: " + this.health + "| ship hit bullet tank");
                //update progressbar
                this.healthProgress.progress = this.health / this.fullHealth;
                if (this.health <= 0) {
                    //destroy
                    //if(this.dieCallback)
                    //this.dieCallback(this.node);
                    // this.node.destroy();
                    if (this.dieCallback) this.dieCallback();

                }
                hitObject.destroy();
            }
        }
    }
    update(deltaTime: number) {
        if (this.node) {
            this.node.translate(this.direction);
            if (this.node.position.y < -500) {
                this.node.destroy();
            }
        }
    }
}


