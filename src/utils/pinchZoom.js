export class PinchZoom {

  static hammerIt(elmid) {
    const elm = document.getElementById(elmid);
    console.log('hammerIt begin elm', elm);
    const hammertime = new Hammer(elm, { touchAction: 'pan-x pan-y' });  // 兼容x轴和y轴方向的滚动
    hammertime.get('pinch').set({
      enable: true
    });
    console.log('hammertime', hammertime);
    let posX = 0,
      posY = 0,
      scale = 1,
      last_scale = 1,
      last_posX = 0,
      last_posY = 0,
      max_pos_x = 0,
      max_pos_y = 0,
      transform = '';
    const el = elm;
    hammertime.on('panleft panright panup pandown tap press pdoubletap pan pinch panend pinchend', function (ev) {
      console.log(ev.type + ' gesture detected.');
      if (ev.type === 'doubletap') {
        transform =
          'translate3d(0, 0, 0) ' +
          'scale3d(2, 2, 1) ';
        scale = 2;
        last_scale = 2;
        try {
          if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() !== 'matrix(1, 0, 0, 1, 0, 0)') {
            transform =
              'translate3d(0, 0, 0) ' +
              'scale3d(1, 1, 1) ';
            scale = 1;
            last_scale = 1;
          }
        } catch (err) { }
        // tslint:disable-next-line: deprecation
        el.style.webkitTransform = transform;
        transform = '';
      }
      // pan
      if (scale !== 1) {
        posX = last_posX + ev.deltaX;
        posY = last_posY + ev.deltaY;
        max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
        max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
        if (posX > max_pos_x) {
          posX = max_pos_x;
        }
        if (posX < -max_pos_x) {
          posX = -max_pos_x;
        }
        if (posY > max_pos_y) {
          posY = max_pos_y;
        }
        if (posY < -max_pos_y) {
          posY = -max_pos_y;
        }
      }
      // pinch
      if (ev.type === 'pinch') {
        scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
      }
      if (ev.type === 'pinchend') { last_scale = scale; }
      // panend
      if (ev.type === 'panend') {
        last_posX = posX < max_pos_x ? posX : max_pos_x;
        last_posY = posY < max_pos_y ? posY : max_pos_y;
      }
      if (scale !== 1) {
        transform =
          'translate3d(' + posX + 'px,' + posY + 'px, 0) ' +
          'scale3d(' + scale + ', ' + scale + ', 1)';
      }
      if (transform) {
        // tslint:disable-next-line: deprecation
        el.style.webkitTransform = transform;
      }
    });
  }
}
