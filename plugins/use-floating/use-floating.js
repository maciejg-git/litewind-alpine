import {computePosition, offset, inline, flip, autoPlacement, size, autoUpdate} from '@floating-ui/dom';

export let useFloating = (reference, floating, opts) => {
  let options = {
    placement: opts.placement ?? "bottom-start",
    offsetX: opts.offsetX ?? 0,
    offsetY: opts.offsetY ?? 0,
    flip: opts.flip ?? false,
    autoPlacement: opts.autoPlacement ?? false,
    inline: opts.inline ?? false,
    resize: opts.resize ?? false,
  };

  let defaultStyle = {
    position: "absolute",
    // width: "min-content",
    top: 0,
    left: 0,
  };

  let generateGetBoundingClientRect = ({ x, y }) => {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
    });
  };

  let virtualElement = {
    getBoundingClientRect: generateGetBoundingClientRect({ x: 0, y: 0 }),
  };

  let updateVirtualElement = (event) => {
    virtualElement.getBoundingClientRect = generateGetBoundingClientRect(event);
  };

  let localReference = reference || virtualElement

  Object.assign(floating.style, defaultStyle);

  let stopUpdate = null;

  let update = async () => {
    let { x, y, placement } = await computePosition(
      localReference,
      floating,
      {
        placement: options.placement,
        middleware: [
          offset({
            mainAxis: options.offsetY,
            crossAxis: options.offsetX,
          }),
          options.inline && inline(),
          options.flip && flip(),
          options.autoPlacement && autoPlacement(),
          options.resize &&
            size({
              apply({ rects }) {
                Object.assign(floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
        ],
      }
    );

    Object.assign(floating.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    floating.dataset.placement = placement.split("-")[0];
  };

  let destroy = () => {
    stopUpdate && stopUpdate();
  };

  let startAutoUpdate = () => {
    stopUpdate = autoUpdate(localReference, floating, () => update());
  };
  
  return {
    update,
    startAutoUpdate,
    destroy,
    updateVirtualElement,
  };
};
