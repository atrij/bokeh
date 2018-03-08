/* XXX: partial */
import {XYGlyph, XYGlyphView, XYGlyphData} from "./xy_glyph"
import {LineMixinVector, FillMixinVector} from "core/property_mixins"
import {Line, Fill} from "core/visuals"
import {Context2d} from "core/util/canvas"

export interface PatchData extends XYGlyphData {
}

export interface PatchView extends PatchData {}

export class PatchView extends XYGlyphView {
  model: Patch
  visuals: Patch.Visuals

  protected _render(ctx: Context2d, indices: number[], {sx, sy}: PatchData): void {
    if (this.visuals.fill.doit) {
      this.visuals.fill.set_value(ctx);

      for (const i of indices) {
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(sx[i], sy[i]);
          continue;
        } else if (isNaN(sx[i] + sy[i])) {
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          continue;
        } else {
          ctx.lineTo(sx[i], sy[i]);
        }
      }

      ctx.closePath();
      ctx.fill();
    }

    if (this.visuals.line.doit) {
      this.visuals.line.set_value(ctx);

      for (const i of indices) {
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(sx[i], sy[i]);
          continue;
        } else if (isNaN(sx[i] + sy[i])) {
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          continue;
        } else {
          ctx.lineTo(sx[i], sy[i]);
        }
      }

      ctx.closePath();
      return ctx.stroke();
    }
  }

  draw_legend_for_index(ctx: Context2d, x0, x1, y0, y1, index) {
    return this._generic_area_legend(ctx, x0, x1, y0, y1, index);
  }
}

export namespace Patch {
  export interface Mixins extends LineMixinVector, FillMixinVector {}

  export interface Attrs extends XYGlyph.Attrs, Mixins {}

  export interface Visuals extends XYGlyph.Visuals {
    line: Line
    fill: Fill
  }
}

export interface Patch extends Patch.Attrs {}

export class Patch extends XYGlyph {

  constructor(attrs?: Partial<Patch.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = 'Patch';
    this.prototype.default_view = PatchView;

    this.mixins(['line', 'fill']);
  }
}
Patch.initClass();
