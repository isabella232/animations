/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Curve, curveToString} from '../bezier-curve-utils.js';
import {Size} from '../img-dimensions';

/**
 * Prepares a scale animation. This function sets up the animation by setting 
 * the appropriate style properties on the desired Element. The returned style
 * text needs to be inserted for the animation to run.
 * @param options
 * @param options.element The element to apply the scaling to.
 * @param options.largerImgDimensions The larger of the start/end image dimensions,
 * @param options.smallerImgDimensions The smaller of the start/end cropping rects.
 * @param options.curve The timing curve for the scaling.
 * @param options.style The styles to apply to `element`.
 * @param options.keyframesPrefix A prefix to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 * @param options.toLarger Whether or not `largerImgDimensions` are the
 *    dimensions are we are animating to.
 * @return CSS style text to perform the aniamtion.
 */
export function prepareScaleAnimation({
  element,
  largerDimensions,
  smallerDimensions,
  curve,
  styles,
  keyframesPrefix,
  toLarger,
} : {
  element: HTMLElement,
  largerDimensions: Size,
  smallerDimensions: Size,
  curve: Curve,
  styles: Object,
  keyframesPrefix: string,
  toLarger: boolean,
}): string {
  const keyframesName = `${keyframesPrefix}-scale`;

  const scaleImgDown = {
    x: smallerDimensions.width / largerDimensions.width,
    y: smallerDimensions.height / largerDimensions.height,
  };
  const neutralScale = {x: 1, y: 1};
  const startImgScale = toLarger ? scaleImgDown : neutralScale;
  const endImgScale = toLarger ? neutralScale : scaleImgDown;

  Object.assign(element.style, styles, {
    'willChange': 'transform',
    'animationName': keyframesName,
    'animationTimingFunction': curveToString(curve),
    'animationFillMode': 'forwards',
  });

  return `
    @keyframes ${keyframesName} {
      from {
        transform: scale(${startImgScale.x}, ${startImgScale.y});
      }

      to {
        transform: scale(${endImgScale.x}, ${endImgScale.y});
      }
    }
  `;
}
