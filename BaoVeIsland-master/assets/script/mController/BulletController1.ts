import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletController1')
export class BulletController1 extends Component {
    bulletDir;
    isFire: boolean = false;
    bulletSpeed = 100;
    bulletDamage: number = 1;
    @property(Sprite)
    bulletSp: Sprite;
    @property(SpriteFrame)
    bulletSpList: SpriteFrame[] = [];
    start() {

    }
    public setUp(dir: Vec3, speed: number, damage: number) {
        this.bulletDamage = damage;
        this.bulletSp.spriteFrame = this.bulletSpList[this.bulletDamage];
        this.bulletSpeed = speed;
        this.bulletDir = dir.normalize().multiply(new Vec3(speed, speed, 0));
        this.isFire = true;
    }
    public getDamage() {
        return this.bulletDamage;
    }
    update(deltaTime: number) {
        if (this.isFire) {
            this.node.translate(this.bulletDir);
        }
        let lengthNode = this.node.position.subtract(Vec3.ZERO).length();
        if (lengthNode > 1000) {
            this.isFire = false;
            this.node.destroy();
        }
    }
}


