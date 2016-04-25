/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  exports.bottom = bottom;
  exports.cloneLayout = cloneLayout;
  exports.cloneLayoutItem = cloneLayoutItem;
  exports.collides = collides;
  exports.compact = compact;
  exports.compactItem = compactItem;
  exports.correctBounds = correctBounds;
  exports.getLayoutItem = getLayoutItem;
  exports.getFirstCollision = getFirstCollision;
  exports.getAllCollisions = getAllCollisions;
  exports.getStatics = getStatics;
  exports.moveElement = moveElement;
  exports.moveElementAwayFromCollision = moveElementAwayFromCollision;
  exports.perc = perc;
  exports.setTransform = setTransform;
  exports.setTopLeft = setTopLeft;
  exports.sortLayoutItemsByRowCol = sortLayoutItemsByRowCol;
  exports.synchronizeLayoutWithChildren = synchronizeLayoutWithChildren;
  exports.validateLayout = validateLayout;
  exports.autoBindHandlers = autoBindHandlers;
  var isProduction = process.env.NODE_ENV === 'production';
  function bottom(layout) {
    var max = 0,
        bottomY = void 0;
    for (var _i = 0,
        len = layout.length; _i < len; _i++) {
      bottomY = layout[_i].y + layout[_i].h;
      if (bottomY > max)
        max = bottomY;
    }
    return max;
  }
  function cloneLayout(layout) {
    var newLayout = Array(layout.length);
    for (var _i2 = 0,
        len = layout.length; _i2 < len; _i2++) {
      newLayout[_i2] = cloneLayoutItem(layout[_i2]);
    }
    return newLayout;
  }
  function cloneLayoutItem(layoutItem) {
    return {
      w: layoutItem.w,
      h: layoutItem.h,
      x: layoutItem.x,
      y: layoutItem.y,
      i: layoutItem.i,
      minW: layoutItem.minW,
      maxW: layoutItem.maxW,
      minH: layoutItem.minH,
      maxH: layoutItem.maxH,
      moved: Boolean(layoutItem.moved),
      static: Boolean(layoutItem.static),
      isDraggable: layoutItem.isDraggable,
      isResizable: layoutItem.isResizable
    };
  }
  function collides(l1, l2) {
    if (l1 === l2)
      return false;
    if (l1.x + l1.w <= l2.x)
      return false;
    if (l1.x >= l2.x + l2.w)
      return false;
    if (l1.y + l1.h <= l2.y)
      return false;
    if (l1.y >= l2.y + l2.h)
      return false;
    return true;
  }
  function compact(layout, verticalCompact) {
    var compareWith = getStatics(layout);
    var sorted = sortLayoutItemsByRowCol(layout);
    var out = Array(layout.length);
    for (var _i3 = 0,
        len = sorted.length; _i3 < len; _i3++) {
      var l = sorted[_i3];
      if (!l.static) {
        l = compactItem(compareWith, l, verticalCompact);
        compareWith.push(l);
      }
      out[layout.indexOf(l)] = l;
      l.moved = false;
    }
    return out;
  }
  function compactItem(compareWith, l, verticalCompact) {
    if (verticalCompact) {
      while (l.y > 0 && !getFirstCollision(compareWith, l)) {
        l.y--;
      }
    }
    var collides = void 0;
    while (collides = getFirstCollision(compareWith, l)) {
      l.y = collides.y + collides.h;
    }
    return l;
  }
  function correctBounds(layout, bounds) {
    var collidesWith = getStatics(layout);
    for (var _i4 = 0,
        len = layout.length; _i4 < len; _i4++) {
      var l = layout[_i4];
      if (l.x + l.w > bounds.cols)
        l.x = bounds.cols - l.w;
      if (l.x < 0) {
        l.x = 0;
        l.w = bounds.cols;
      }
      if (!l.static)
        collidesWith.push(l);
      else {
        while (getFirstCollision(collidesWith, l)) {
          l.y++;
        }
      }
    }
    return layout;
  }
  function getLayoutItem(layout, id) {
    for (var _i5 = 0,
        len = layout.length; _i5 < len; _i5++) {
      if (layout[_i5].i === id)
        return layout[_i5];
    }
  }
  function getFirstCollision(layout, layoutItem) {
    for (var _i6 = 0,
        len = layout.length; _i6 < len; _i6++) {
      if (collides(layout[_i6], layoutItem))
        return layout[_i6];
    }
  }
  function getAllCollisions(layout, layoutItem) {
    var out = [];
    for (var _i7 = 0,
        len = layout.length; _i7 < len; _i7++) {
      if (collides(layout[_i7], layoutItem))
        out.push(layout[_i7]);
    }
    return out;
  }
  function getStatics(layout) {
    var out = [];
    for (var _i8 = 0,
        len = layout.length; _i8 < len; _i8++) {
      if (layout[_i8].static)
        out.push(layout[_i8]);
    }
    return out;
  }
  function moveElement(layout, l, x, y, isUserAction) {
    if (l.static)
      return layout;
    if (l.y === y && l.x === x)
      return layout;
    var movingUp = y && l.y > y;
    if (typeof x === 'number')
      l.x = x;
    if (typeof y === 'number')
      l.y = y;
    l.moved = true;
    var sorted = sortLayoutItemsByRowCol(layout);
    if (movingUp)
      sorted = sorted.reverse();
    var collisions = getAllCollisions(sorted, l);
    for (var _i9 = 0,
        len = collisions.length; _i9 < len; _i9++) {
      var collision = collisions[_i9];
      if (collision.moved)
        continue;
      if (l.y > collision.y && l.y - collision.y > collision.h / 4)
        continue;
      if (collision.static) {
        layout = moveElementAwayFromCollision(layout, collision, l, isUserAction);
      } else {
        layout = moveElementAwayFromCollision(layout, l, collision, isUserAction);
      }
    }
    return layout;
  }
  function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction) {
    if (isUserAction) {
      var fakeItem = {
        x: itemToMove.x,
        y: itemToMove.y,
        w: itemToMove.w,
        h: itemToMove.h,
        i: '-1'
      };
      fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0);
      if (!getFirstCollision(layout, fakeItem)) {
        return moveElement(layout, itemToMove, undefined, fakeItem.y);
      }
    }
    return moveElement(layout, itemToMove, undefined, itemToMove.y + 1);
  }
  function perc(num) {
    return num * 100 + '%';
  }
  function setTransform(_ref) {
    var top = _ref.top;
    var left = _ref.left;
    var width = _ref.width;
    var height = _ref.height;
    var translate = 'translate(' + left + 'px,' + top + 'px)';
    return {
      transform: translate,
      WebkitTransform: translate,
      MozTransform: translate,
      msTransform: translate,
      OTransform: translate,
      width: width + 'px',
      height: height + 'px',
      position: 'absolute'
    };
  }
  function setTopLeft(_ref2) {
    var top = _ref2.top;
    var left = _ref2.left;
    var width = _ref2.width;
    var height = _ref2.height;
    return {
      top: top + 'px',
      left: left + 'px',
      width: width + 'px',
      height: height + 'px',
      position: 'absolute'
    };
  }
  function sortLayoutItemsByRowCol(layout) {
    return [].concat(layout).sort(function(a, b) {
      if (a.y > b.y || a.y === b.y && a.x > b.x) {
        return 1;
      }
      return -1;
    });
  }
  function synchronizeLayoutWithChildren(initialLayout, children, cols, verticalCompact) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    initialLayout = initialLayout || [];
    var layout = [];
    for (var _i10 = 0,
        len = children.length; _i10 < len; _i10++) {
      var newItem = void 0;
      var child = children[_i10];
      var exists = getLayoutItem(initialLayout, child.key || "1");
      if (exists) {
        newItem = exists;
      } else {
        var g = child.props._grid;
        if (g) {
          if (!isProduction) {
            validateLayout([g], 'ReactGridLayout.children');
          }
          if (verticalCompact) {
            newItem = cloneLayoutItem(_extends({}, g, {
              y: Math.min(bottom(layout), g.y),
              i: child.key
            }));
          } else {
            newItem = cloneLayoutItem(_extends({}, g, {
              y: g.y,
              i: child.key
            }));
          }
        } else {
          newItem = cloneLayoutItem({
            w: 1,
            h: 1,
            x: 0,
            y: bottom(layout),
            i: child.key || "1"
          });
        }
      }
      layout[_i10] = newItem;
    }
    layout = correctBounds(layout, {cols: cols});
    layout = compact(layout, verticalCompact);
    return layout;
  }
  function validateLayout(layout, contextName) {
    contextName = contextName || "Layout";
    var subProps = ['x', 'y', 'w', 'h'];
    if (!Array.isArray(layout))
      throw new Error(contextName + " must be an array!");
    for (var _i11 = 0,
        len = layout.length; _i11 < len; _i11++) {
      var item = layout[_i11];
      for (var j = 0; j < subProps.length; j++) {
        if (typeof item[subProps[j]] !== 'number') {
          throw new Error('ReactGridLayout: ' + contextName + '[' + _i11 + '].' + subProps[j] + ' must be a number!');
        }
      }
      if (item.i && typeof item.i !== 'string') {
        throw new Error('ReactGridLayout: ' + contextName + '[' + _i11 + '].i must be a string!');
      }
      if (item.static !== undefined && typeof item.static !== 'boolean') {
        throw new Error('ReactGridLayout: ' + contextName + '[' + _i11 + '].static must be a boolean!');
      }
    }
  }
  function autoBindHandlers(el, fns) {
    fns.forEach(function(key) {
      return el[key] = el[key].bind(el);
    });
  }
})(require('process'));
