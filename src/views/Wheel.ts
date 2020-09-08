import { Expo, TimelineLite, TimelineMax } from 'gsap';
import { BitmapFonts, Images } from '../assets';
import { BLACK_SEGMENTS, RED_SEGMENTS } from '../constants/Constants';
import { normalizeAngle } from '../utils/utils';
import WheelExtended from './WheelExtended';

declare global {
  interface Window {
    wheel: Wheel | WheelExtended;
  }
}
export default class Wheel extends PIXI.Container {
  protected center: PIXI.Sprite;
  protected stopper: PIXI.Sprite;
  protected text: PIXI.BitmapText;
  protected loader: PIXI.Loader;
  protected rotation_tween: TimelineLite;

  constructor(protected game: PIXI.Application) {
    super();
    this.onResize();
    this.logOptions();
    this.preload();
    window.wheel = this;
  }

  public start(segment_number: number, duration_ms: number = 5500): void {
    if (!!this.rotation_tween && this.rotation_tween.isActive) {
      console.warn(
        "Wheel is in rotation animation, please wait until it'll over\nor call wheel.stop() to stop rotation immediately",
      );
      return;
    }
    const calculation_result: IWheelRotationValues = this.calculateWheelRotationValues(
      segment_number,
    );
    this.startWheelRotation(calculation_result.angle, duration_ms);
    this.text.tint = calculation_result.color;
    this.text.text = `${segment_number}`;
  }

  public stop(): void {
    this.rotation_tween.kill();
    this.rotation_tween = null;
    this.onRotationComplete();
  }

  protected calculateWheelRotationValues(
    segment_number: number,
  ): IWheelRotationValues {
    let color: number;
    let angle: number;
    let index: number;
    let start_value: number;
    if (BLACK_SEGMENTS.contains(segment_number)) {
      color = 0x000000;
      start_value = -10;
      index = BLACK_SEGMENTS.indexOf(segment_number);
    } else if (RED_SEGMENTS.contains(segment_number)) {
      color = 0xff0000;
      start_value = 0;
      index = RED_SEGMENTS.indexOf(segment_number);
    } else {
      console.warn(`there is no segment with index ${segment_number}`);
      return;
    }
    angle = start_value - index * 20 + 360;
    return {
      color,
      angle,
    };
  }

  protected startWheelRotation(
    target_angle: number,
    duration_ms: number,
  ): void {
    this.rotation_tween = new TimelineMax().to(
      this.center,
      duration_ms / 1000,
      {
        pixi: {
          angle: target_angle + Math.round(duration_ms / 1000) * 360,
          ease: Expo.easeInOut,
        },
      },
      0,
    );
    this.rotation_tween.eventCallback(
      'onComplete',
      this.onRotationComplete.bind(this),
    );
  }

  protected onRotationComplete(): void {
    this.center.angle = normalizeAngle(this.center.angle);
    this.rotation_tween = null;
  }

  protected addSprite(key: string, x: number = 0, y: number = 0): PIXI.Sprite {
    const sprite = new PIXI.Sprite(this.loader.resources[key].texture);
    sprite.x = x;
    sprite.y = y;
    return sprite;
  }

  protected loadAssets(): void {
    this.addToLoad(Images.Wheel.Name, Images.Wheel.FileURL);
    this.addToLoad(Images.Stopper.Name, Images.Stopper.FileURL);
    this.addToLoad(BitmapFonts.FontWheel.Name, BitmapFonts.FontWheel.XmlURL);
    this.loader.load();
  }

  protected create(): void {
    this.createCenter();
    this.createStopper();
    this.createText();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  protected createCenter(): void {
    this.center = this.addSprite(Images.Wheel.Name, 0, 0);
    this.center.anchor.set(0.5);
    this.addChild(this.center);
  }
  protected createStopper(): void {
    this.stopper = this.addSprite(
      Images.Stopper.Name,
      this.center.x,
      this.center.y - this.center.height / 2,
    );
    this.stopper.anchor.set(0.5, 1);
    this.addChild(this.stopper);
  }
  protected createText(): void {
    this.text = new PIXI.BitmapText('10', {
      fontName: BitmapFonts.FontWheel.Name,
      fontSize: 40,
      tint: 0xff0000,
    });
    this.text.x = this.center.x;
    this.text.y = this.center.y;
    this.text.anchor = 0.5;
    this.addChild(this.text);
  }

  protected preload(): void {
    this.loader = PIXI.Loader.shared;
    this.loader.onComplete.add(this.create.bind(this));
    this.loadAssets();
  }

  protected addToLoad(key: string, ...args: any[]): void {
    if (!!this.loader.resources[key]) {
      return;
    }
    this.loader.add(key, ...args);
  }

  protected logOptions(): void {
    console.warn(
      `Wheel rotation default duration is set to 5500ms, if you want to change that please add custom duration value, after segment index, when calling 'wheel.start' function.\n\nExample: wheel.start(30, 6000)`,
    );
  }

  protected onResize(): void {
    this.x = this.game.renderer.width / 2;
    this.y = this.game.renderer.height / 2;
  }
}

interface IWheelRotationValues {
  color: number;
  angle: number;
}
