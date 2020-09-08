import { BLACK_SEGMENTS, RED_SEGMENTS } from '../constants/Constants';
import { normalizeAngle } from '../utils/utils';
import Wheel from './Wheel';

export default class WheelExtended extends Wheel {
  protected dynamic_text_value: boolean;
  protected allAngles: number[];

  constructor(protected game: PIXI.Application) {
    super(game);
    this.enableDynamicTextDuringRotation();
  }

  public enableDynamicTextDuringRotation(enabled: boolean = true): void {
    this.dynamic_text_value = enabled;
    this.allAngles = [];
    for (let i: number = 0; i < 36; i++) {
      this.allAngles.push(i * 10);
    }
  }

  protected startWheelRotation(
    target_angle: number,
    duration_ms: number,
  ): void {
    super.startWheelRotation(target_angle, duration_ms);
    this.rotation_tween.eventCallback(
      'onUpdate',
      this.updateTextValueBasedOnAngle.bind(this),
    );
  }

  protected onRotationComplete(): void {
    super.onRotationComplete();
    this.updateTextValueBasedOnAngle();
  }

  protected updateTextValueBasedOnAngle(): void {
    if (!this.dynamic_text_value) {
      return;
    }
    const current_angle: number = Math.round(normalizeAngle(this.center.angle));
    for (const angle of this.allAngles) {
      if (Math.abs(Math.abs(current_angle) - Math.abs(angle)) < 5) {
        const is_angle_decimal_even: boolean = (angle / 10) % 2 === 0;
        const target_segments_array: number[] = is_angle_decimal_even
          ? RED_SEGMENTS
          : BLACK_SEGMENTS;
        const start_value: number = is_angle_decimal_even ? 0 : -10;
        const index: number = Math.abs(angle - start_value - 360) / 20;
        if (!!index) {
          this.text.text = `${target_segments_array[index]}`;
          this.text.tint = is_angle_decimal_even ? 0xff0000 : 0x000000;
        }
        break;
      }
    }
  }

  protected logOptions(): void {
    super.logOptions();
    console.warn(
      `Text in center can dynamically change during rotation, to enable that please call\n 'wheel.enableDynamicTextDuringRotation(enabled:bool)`,
    );
  }

  protected onResize(): void {
    this.x = this.game.renderer.width / 2;
    this.y = this.game.renderer.height / 2;
  }
}
