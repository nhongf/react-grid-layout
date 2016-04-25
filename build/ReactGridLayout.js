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
  var _react = require('react');
  var _react2 = _interopRequireDefault(_react);
  var _lodash = require('lodash.isequal');
  var _lodash2 = _interopRequireDefault(_lodash);
  var _utils = require('./utils');
  var _GridItem = require('./GridItem');
  var _GridItem2 = _interopRequireDefault(_GridItem);
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
  var noop = function noop() {};
  var ReactGridLayout = function(_React$Component) {
    _inherits(ReactGridLayout, _React$Component);
    function ReactGridLayout(props, context) {
      _classCallCheck(this, ReactGridLayout);
      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));
      _initialiseProps.call(_this);
      (0, _utils.autoBindHandlers)(_this, ['onDragStart', 'onDrag', 'onDragStop', 'onResizeStart', 'onResize', 'onResizeStop']);
      return _this;
    }
    ReactGridLayout.prototype.componentDidMount = function componentDidMount() {
      this.props.onLayoutChange(this.state.layout);
    };
    ReactGridLayout.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var newLayoutBase = void 0;
      if (!(0, _lodash2.default)(nextProps.layout, this.props.layout)) {
        newLayoutBase = nextProps.layout;
      } else if (nextProps.children.length !== this.props.children.length) {
        newLayoutBase = this.state.layout;
      }
      if (newLayoutBase) {
        var newLayout = (0, _utils.synchronizeLayoutWithChildren)(newLayoutBase, nextProps.children, nextProps.cols, nextProps.verticalCompact);
        this.setState({layout: newLayout});
        this.props.onLayoutChange(newLayout);
      }
    };
    ReactGridLayout.prototype.containerHeight = function containerHeight() {
      if (!this.props.autoSize)
        return;
      return (0, _utils.bottom)(this.state.layout) * (this.props.rowHeight + this.props.margin[1]) + this.props.margin[1] + 'px';
    };
    ReactGridLayout.prototype.onDragStart = function onDragStart(i, x, y, _ref) {
      var e = _ref.e;
      var node = _ref.node;
      var layout = this.state.layout;
      var l = (0, _utils.getLayoutItem)(layout, i);
      if (!l)
        return;
      this.setState({oldDragItem: (0, _utils.cloneLayoutItem)(l)});
      this.props.onDragStart(layout, l, l, null, e, node);
    };
    ReactGridLayout.prototype.onDrag = function onDrag(i, x, y, _ref2) {
      var e = _ref2.e;
      var node = _ref2.node;
      var oldDragItem = this.state.oldDragItem;
      var layout = this.state.layout;
      var l = (0, _utils.getLayoutItem)(layout, i);
      if (!l)
        return;
      var placeholder = {
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        placeholder: true,
        i: i
      };
      layout = (0, _utils.moveElement)(layout, l, x, y, true);
      this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);
      this.setState({
        layout: (0, _utils.compact)(layout, this.props.verticalCompact),
        activeDrag: placeholder
      });
    };
    ReactGridLayout.prototype.onDragStop = function onDragStop(i, x, y, _ref3) {
      var e = _ref3.e;
      var node = _ref3.node;
      var oldDragItem = this.state.oldDragItem;
      var layout = this.state.layout;
      var l = (0, _utils.getLayoutItem)(layout, i);
      if (!l)
        return;
      layout = (0, _utils.moveElement)(layout, l, x, y, true);
      this.props.onDragStop(layout, oldDragItem, l, null, e, node);
      this.setState({
        activeDrag: null,
        layout: (0, _utils.compact)(layout, this.props.verticalCompact),
        oldDragItem: null
      });
      this.props.onLayoutChange(this.state.layout);
    };
    ReactGridLayout.prototype.onResizeStart = function onResizeStart(i, w, h, _ref4) {
      var e = _ref4.e;
      var node = _ref4.node;
      var layout = this.state.layout;
      var l = (0, _utils.getLayoutItem)(layout, i);
      if (!l)
        return;
      this.setState({oldResizeItem: (0, _utils.cloneLayoutItem)(l)});
      this.props.onResizeStart(layout, l, l, null, e, node);
    };
    ReactGridLayout.prototype.onResize = function onResize(i, w, h, _ref5) {
      var e = _ref5.e;
      var node = _ref5.node;
      var _state = this.state;
      var layout = _state.layout;
      var oldResizeItem = _state.oldResizeItem;
      var l = (0, _utils.getLayoutItem)(layout, i);
      if (!l)
        return;
      l.w = w;
      l.h = h;
      var placeholder = {
        w: w,
        h: h,
        x: l.x,
        y: l.y,
        static: true,
        i: i
      };
      this.props.onResize(layout, oldResizeItem, l, placeholder, e, node);
      this.setState({
        layout: (0, _utils.compact)(layout, this.props.verticalCompact),
        activeDrag: placeholder
      });
    };
    ReactGridLayout.prototype.onResizeStop = function onResizeStop(i, w, h, _ref6) {
      var e = _ref6.e;
      var node = _ref6.node;
      var _state2 = this.state;
      var layout = _state2.layout;
      var oldResizeItem = _state2.oldResizeItem;
      var l = (0, _utils.getLayoutItem)(layout, i);
      this.props.onResizeStop(layout, oldResizeItem, l, null, e, node);
      this.setState({
        activeDrag: null,
        layout: (0, _utils.compact)(layout, this.props.verticalCompact),
        oldResizeItem: null
      });
      this.props.onLayoutChange(this.state.layout);
    };
    ReactGridLayout.prototype.placeholder = function placeholder() {
      var activeDrag = this.state.activeDrag;
      if (!activeDrag)
        return null;
      var _props = this.props;
      var width = _props.width;
      var cols = _props.cols;
      var margin = _props.margin;
      var rowHeight = _props.rowHeight;
      var maxRows = _props.maxRows;
      var useCSSTransforms = _props.useCSSTransforms;
      return _react2.default.createElement(_GridItem2.default, {
        w: activeDrag.w,
        h: activeDrag.h,
        x: activeDrag.x,
        y: activeDrag.y,
        i: activeDrag.i,
        className: 'react-grid-placeholder',
        containerWidth: width,
        cols: cols,
        margin: margin,
        maxRows: maxRows,
        rowHeight: rowHeight,
        isDraggable: false,
        isResizable: false,
        useCSSTransforms: useCSSTransforms
      }, _react2.default.createElement('div', null));
    };
    ReactGridLayout.prototype.processGridItem = function processGridItem(child) {
      if (!child.key)
        return;
      var l = (0, _utils.getLayoutItem)(this.state.layout, child.key);
      if (!l)
        return null;
      var _props2 = this.props;
      var width = _props2.width;
      var cols = _props2.cols;
      var margin = _props2.margin;
      var rowHeight = _props2.rowHeight;
      var maxRows = _props2.maxRows;
      var isDraggable = _props2.isDraggable;
      var isResizable = _props2.isResizable;
      var useCSSTransforms = _props2.useCSSTransforms;
      var draggableCancel = _props2.draggableCancel;
      var draggableHandle = _props2.draggableHandle;
      var draggable = Boolean(!l.static && isDraggable && (l.isDraggable || l.isDraggable == null));
      var resizable = Boolean(!l.static && isResizable && (l.isResizable || l.isResizable == null));
      var isBrowser = process.browser;
      return _react2.default.createElement(_GridItem2.default, {
        containerWidth: width,
        cols: cols,
        margin: margin,
        maxRows: maxRows,
        rowHeight: rowHeight,
        cancel: draggableCancel,
        handle: draggableHandle,
        onDragStop: this.onDragStop,
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.onResizeStop,
        isDraggable: draggable,
        isResizable: resizable,
        useCSSTransforms: useCSSTransforms && isBrowser,
        usePercentages: !isBrowser,
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        i: l.i,
        minH: l.minH,
        minW: l.minW,
        maxH: l.maxH,
        maxW: l.maxW,
        'static': l.static
      }, child);
    };
    ReactGridLayout.prototype.render = function render() {
      var _this2 = this;
      var _props3 = this.props;
      var className = _props3.className;
      var style = _props3.style;
      var mergedClassName = 'react-grid-layout ' + className;
      var mergedStyle = _extends({height: this.containerHeight()}, style);
      return _react2.default.createElement('div', {
        className: mergedClassName,
        style: mergedStyle
      }, _react2.default.Children.map(this.props.children, function(child) {
        return _this2.processGridItem(child);
      }), this.placeholder());
    };
    return ReactGridLayout;
  }(_react2.default.Component);
  ReactGridLayout.displayName = "ReactGridLayout";
  ReactGridLayout.propTypes = {
    className: _react.PropTypes.string,
    style: _react.PropTypes.object,
    width: _react.PropTypes.number,
    autoSize: _react.PropTypes.bool,
    cols: _react.PropTypes.number,
    draggableCancel: _react.PropTypes.string,
    draggableHandle: _react.PropTypes.string,
    verticalCompact: _react.PropTypes.bool,
    layout: function layout(props) {
      var layout = props.layout;
      if (layout === undefined)
        return;
      (0, _utils.validateLayout)(layout, 'layout');
    },
    margin: _react.PropTypes.arrayOf(_react.PropTypes.number),
    rowHeight: _react.PropTypes.number,
    maxRows: _react.PropTypes.number,
    isDraggable: _react.PropTypes.bool,
    isResizable: _react.PropTypes.bool,
    useCSSTransforms: _react.PropTypes.bool,
    onLayoutChange: _react.PropTypes.func,
    onDragStart: _react.PropTypes.func,
    onDrag: _react.PropTypes.func,
    onDragStop: _react.PropTypes.func,
    onResizeStart: _react.PropTypes.func,
    onResize: _react.PropTypes.func,
    onResizeStop: _react.PropTypes.func,
    children: function children(props, propName, _componentName) {
      _react.PropTypes.node.apply(this, arguments);
      var children = props[propName];
      var keys = {};
      _react2.default.Children.forEach(children, function(child) {
        if (keys[child.key]) {
          throw new Error("Duplicate child key found! This will cause problems in ReactGridLayout.");
        }
        keys[child.key] = true;
      });
    }
  };
  ReactGridLayout.defaultProps = {
    autoSize: true,
    cols: 12,
    rowHeight: 150,
    maxRows: Infinity,
    layout: [],
    margin: [10, 10],
    isDraggable: true,
    isResizable: true,
    useCSSTransforms: true,
    verticalCompact: true,
    onLayoutChange: noop,
    onDragStart: noop,
    onDrag: noop,
    onDragStop: noop,
    onResizeStart: noop,
    onResize: noop,
    onResizeStop: noop
  };
  var _initialiseProps = function _initialiseProps() {
    this.state = {
      activeDrag: null,
      layout: (0, _utils.synchronizeLayoutWithChildren)(this.props.layout, this.props.children, this.props.cols, this.props.verticalCompact),
      oldDragItem: null,
      oldResizeItem: null
    };
  };
  exports.default = ReactGridLayout;
})(require('process'));
