import { _decorator, AudioSource, Component, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {

    @property(AudioSource)
    public _audioSource: AudioSource = null!

    private static instance: AudioController;

    public static get inst(): AudioController {
        console.log("init audio");
        if (this.instance == null) {
            this.instance = new AudioController();
        }
        return this.instance;
    }

    start() {

    }

    update(deltaTime: number) {

    }
    playSound() {
        this._audioSource.play();
        console.log("play sound");
    }

    pauseSound() {
        this._audioSource.pause();
    }
}


