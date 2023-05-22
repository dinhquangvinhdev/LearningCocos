import { _decorator, Component, Node, ProgressBar, Sprite, Collider2D, Contact2DType, IPhysics2DContact, Vec3, CircleCollider2D } from 'cc';
import { BulletController } from './BulletController';
import { GameConfig } from './config/GameConfig';
import { ShipType } from './item/ShipType';
const { ccclass, property } = _decorator;

@ccclass('ShipController')
export class ShipController extends Component {
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
        let collider = this.node.getComponent(CircleCollider2D);
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
        console.log("on Begin Contact");
        if (this.node) {
            let hitObject: Node = otherCollider.node;
            console.log("hit object: " + hitObject);

            if (hitObject.name.includes("Bullet")) {
                let damageHealth = hitObject.getComponent(BulletController).getDamage();
                this.health -= damageHealth;
                //update progressbar
                this.healthProgress.progress = this.health / this.fullHealth;
                if (this.health <= 0) {
                    //destroy
                    //if(this.dieCallback)
                    //this.dieCallback(this.node);
                    this.node.destroy();
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


