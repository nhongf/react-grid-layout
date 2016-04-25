/* */ 
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
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDraggable = require('react-draggable');
var _reactResizable = require('react-resizable');
var _utils = require('./utils');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }});
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var GridItem = function(_React$Component) {
  _inherits(GridItem, _React$Component);
  function GridItem() {
    var _temp,
        _this,
        _ret;
    _classCallCheck(this, GridItem);
    for (var _len = arguments.length,
        args = Array(_len),
        _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      resizing: null,
      dragging: null,
      className: ''
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  GridItem.prototype.calcColWidth = function calcColWidth() {
    var _props = this.props;
    var margin = _props.margin;
    var containerWidth = _props.containerWidth;
    var cols = _props.cols;
    return (containerWidth - margin[0] * (cols + 1)) / cols;
  };
  GridItem.prototype.calcPosition = function calcPosition(x, y, w, h, state) {
    var _props2 = this.props;
    var margin = _props2.margin;
    var rowHeight = _props2.rowHeight;
    var colWidth = this.calcColWidth();
    var out = {
      left: Math.round(colWidth * x + (x + 1) * margin[0]),
      top: Math.round(rowHeight * y + (y + 1) * margin[1]),
      width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * margin[0]),
      height: h === Infinity ? h : Math.round(rowHeight * h + Math.max(0, h - 1) * margin[1])
    };
    if (state && state.resizing) {
      out.width = Math.round(state.resizing.width);
      out.height = Math.round(state.resizing.height);
    }
    if (state && state.dragging) {
      out.top = Math.round(state.dragging.top);
      out.left = Math.round(state.dragging.left);
    }
    return out;
  };
  GridItem.prototype.calcXY = function calcXY(top, left) {
    var _props3 = this.props;
    var margin = _props3.margin;
    var cols = _props3.cols;
    var rowHeight = _props3.rowHeight;
    var w = _props3.w;
    var h = _props3.h;
    var maxRows = _props3.maxRows;
    var colWidth = this.calcColWidth();
    var x = Math.round((left - margin[0]) / (colWidth + margin[0]));
    var y = Math.round((top - margin[1]) / (rowHeight + margin[1]));
    x = Math.max(Math.min(x, cols - w), 0);
    y = Math.max(Math.min(y, maxRows - h), 0);
    return {
      x: x,
      y: y
    };
  };
  GridItem.prototype.calcWH = function calcWH(_ref) {
    var height = _ref.height;
    var width = _ref.width;
    var _props4 = this.props;
    var margin = _props4.margin;
    var maxRows = _props4.maxRows;
    var cols = _props4.cols;
    var rowHeight = _props4.rowHeight;
    var x = _props4.x;
    var y = _props4.y;
    var colWidth = this.calcColWidth();
    var w = Math.round((width + margin[0]) / (colWidth + margin[0]));
    var h = Math.round((height + margin[1]) / (rowHeight + margin[1]));
    w = Math.max(Math.min(w, cols - x), 0);
    h = Math.max(Math.min(h, maxRows - y), 0);
    return {
      w: w,
      h: h
    };
  };
  GridItem.prototype.createStyle = function createStyle(pos) {
    var _props5 = this.props;
    var usePercentages = _props5.usePercentages;
    var containerWidth = _props5.containerWidth;
    var useCSSTransforms = _props5.useCSSTransforms;
    var style = void 0;
    if (useCSSTransforms) {
      style = (0, _utils.setTransform)(pos);
    } else {
      style = (0, _utils.setTopLeft)(pos);
      if (usePercentages) {
        style.left = (0, _utils.perc)(pos.left / containerWidth);
        style.width = (0, _utils.perc)(pos.width / containerWidth);
      }
    }
    return style;
  };
  GridItem.prototype.mixinDraggable = function mixinDraggable(child) {
    return _react2.default.createElement(_reactDraggable.DraggableCore, {
      onStart: this.onDragHandler('onDragStart'),
      onDrag: this.onDragHandler('onDrag'),
      onStop: this.onDragHandler('onDragStop'),
      handle: this.props.handle,
      cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : "")
    }, child);
  };
  GridItem.prototype.mixinResizable = function mixinResizable(child, position) {
    var _props6 = this.props;
    var cols = _props6.cols;
    var x = _props6.x;
    var minW = _props6.minW;
    var minH = _props6.minH;
    var maxW = _props6.maxW;
    var maxH = _props6.maxH;
    var maxWidth = this.calcPosition(0, 0, cols - x, 0).width;
    var mins = this.calcPosition(0, 0, minW, minH);
    var maxes = this.calcPosition(0, 0, maxW, maxH);
    var minConstraints = [mins.width, mins.height];
    var maxConstraints = [Math.min(maxes.width, maxWidth), Math.min(maxes.height, Infinity)];
    return _react2.default.createElement(_reactResizable.Resizable, {
      width: position.width,
      height: position.height,
      minConstraints: minConstraints,
      maxConstraints: maxConstraints,
      onResizeStop: this.onResizeHandler('onResizeStop'),
      onResizeStart: this.onResizeHandler('onResizeStart'),
      onResize: this.onResizeHandler('onResize')
    }, child);
  };
  GridItem.prototype.onDragHandler = function onDragHandler(handlerName) {
    var _this2 = this;
    return function(e, _ref2) {
      var node = _ref2.node;
      var position = _ref2.position;
      if (!_this2.props[handlerName])
        return;
      var newPosition = {
        top: 0,
        left: 0
      };
      switch (handlerName) {
        case 'onDragStart':
          var parentRect = node.offsetParent.getBoundingClientRect();
          var clientRect = node.getBoundingClientRect();
          newPosition.top = clientRect.top - parentRect.top;
          newPosition.left = clientRect.left - parentRect.left;
          _this2.setState({dragging: newPosition});
          break;
        case 'onDrag':
          if (!_this2.state.dragging)
            throw new Error('onDrag called before onDragStart.');
          newPosition.left = _this2.state.dragging.left + position.deltaX;
          newPosition.top = _this2.state.dragging.top + position.deltaY;
          _this2.setState({dragging: newPosition});
          break;
        case 'onDragStop':
          if (!_this2.state.dragging)
            throw new Error('onDragEnd called before onDragStart.');
          newPosition.left = _this2.state.dragging.left;
          newPosition.top = _this2.state.dragging.top;
          _this2.setState({dragging: null});
          break;
        default:
          throw new Error('onDragHandler called with unrecognized handlerName: ' + handlerName);
      }
      var _calcXY = _this2.calcXY(newPosition.top, newPosition.left);
      var x = _calcXY.x;
      var y = _calcXY.y;
      _this2.props[handlerName](_this2.props.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      });
    };
  };
  GridItem.prototype.onResizeHandler = function onResizeHandler(handlerName) {
    var _this3 = this;
    return function(e, _ref3) {
      var element = _ref3.element;
      var size = _ref3.size;
      if (!_this3.props[handlerName])
        return;
      var _props7 = _this3.props;
      var cols = _props7.cols;
      var x = _props7.x;
      var i = _props7.i;
      var maxW = _props7.maxW;
      var minW = _props7.minW;
      var maxH = _props7.maxH;
      var minH = _props7.minH;
      var _calcWH = _this3.calcWH(size);
      var w = _calcWH.w;
      var h = _calcWH.h;
      w = Math.min(w, cols - x);
      w = Math.max(w, 1);
      w = Math.max(Math.min(w, maxW), minW);
      h = Math.max(Math.min(h, maxH), minH);
      _this3.setState({resizing: handlerName === 'onResizeStop' ? null : size});
      _this3.props[handlerName](i, w, h, {
        e: e,
        element: element,
        size: size
      });
    };
  };
  GridItem.prototype.render = function render() {
    var _props8 = this.props;
    var x = _props8.x;
    var y = _props8.y;
    var w = _props8.w;
    var h = _props8.h;
    var isDraggable = _props8.isDraggable;
    var isResizable = _props8.isResizable;
    var useCSSTransforms = _props8.useCSSTransforms;
    var pos = this.calcPosition(x, y, w, h, this.state);
    var child = _react2.default.Children.only(this.props.children);
    var newChild = _react2.default.cloneElement(child, {
      className: ['react-grid-item', child.props.className || '', this.props.className, this.props.static ? 'static' : '', this.state.resizing ? 'resizing' : '', this.state.dragging ? 'react-draggable-dragging' : '', useCSSTransforms ? 'cssTransforms' : ''].join(' '),
      style: _extends({}, this.props.style, child.props.style, this.createStyle(pos))
    });
    if (isResizable)
      newChild = this.mixinResizable(newChild, pos);
    if (isDraggable)
      newChild = this.mixinDraggable(newChild);
    return newChild;
  };
  return GridItem;
}(_react2.default.Component);
GridItem.propTypes = {
  children: _react.PropTypes.element,
  cols: _react.PropTypes.number.isRequired,
  containerWidth: _react.PropTypes.number.isRequired,
  rowHeight: _react.PropTypes.number.isRequired,
  margin: _react.PropTypes.array.isRequired,
  maxRows: _react.PropTypes.number.isRequired,
  x: _react.PropTypes.number.isRequired,
  y: _react.PropTypes.number.isRequired,
  w: _react.PropTypes.number.isRequired,
  h: _react.PropTypes.number.isRequired,
  minW: function minW(props, propName, componentName, location, propFullName) {
    _react.PropTypes.number(props, propName, componentName, location, propFullName);
    var value = props[propName];
    if (value > props.w || value > props.maxW)
      return new Error('minWidth bigger than item width/maxWidth');
  },
  maxW: function maxW(props, propName, componentName, location, propFullName) {
    _react.PropTypes.number(props, propName, componentName, location, propFullName);
    var value = props[propName];
    if (value < props.w || value < props.minW)
      return new Error('maxWidth smaller than item width/minWidth');
  },
  minH: function minH(props, propName, componentName, location, propFullName) {
    _react.PropTypes.number(props, propName, componentName, location, propFullName);
    var value = props[propName];
    if (value > props.h || value > props.maxH)
      return new Error('minHeight bigger than item height/maxHeight');
  },
  maxH: function maxH(props, propName, componentName, location, propFullName) {
    _react.PropTypes.number(props, propName, componentName, location, propFullName);
    var value = props[propName];
    if (value < props.h || value < props.minH)
      return new Error('maxHeight smaller than item height/minHeight');
  },
  i: _react.PropTypes.string.isRequired,
  onDragStop: _react.PropTypes.func,
  onDragStart: _react.PropTypes.func,
  onDrag: _react.PropTypes.func,
  onResizeStop: _react.PropTypes.func,
  onResizeStart: _react.PropTypes.func,
  onResize: _react.PropTypes.func,
  isDraggable: _react.PropTypes.bool.isRequired,
  isResizable: _react.PropTypes.bool.isRequired,
  static: _react.PropTypes.bool,
  useCSSTransforms: _react.PropTypes.bool.isRequired,
  className: _react.PropTypes.string,
  handle: _react.PropTypes.string,
  cancel: _react.PropTypes.string
};
GridItem.defaultProps = {
  className: '',
  cancel: '',
  minH: 1,
  minW: 1,
  maxH: Infinity,
  maxW: Infinity
};
exports.default = GridItem;
