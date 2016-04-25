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
var _lodash = require('lodash.isequal');
var _lodash2 = _interopRequireDefault(_lodash);
var _utils = require('./utils');
var _responsiveUtils = require('./responsiveUtils');
var _ReactGridLayout = require('./ReactGridLayout');
var _ReactGridLayout2 = _interopRequireDefault(_ReactGridLayout);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
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
var ResponsiveReactGridLayout = function(_React$Component) {
  _inherits(ResponsiveReactGridLayout, _React$Component);
  function ResponsiveReactGridLayout() {
    var _temp,
        _this,
        _ret;
    _classCallCheck(this, ResponsiveReactGridLayout);
    for (var _len = arguments.length,
        args = Array(_len),
        _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = _this.generateInitialState(), _this.onLayoutChange = function(layout) {
      var _extends2;
      _this.props.onLayoutChange(layout, _extends({}, _this.props.layouts, (_extends2 = {}, _extends2[_this.state.breakpoint] = layout, _extends2)));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  ResponsiveReactGridLayout.prototype.generateInitialState = function generateInitialState() {
    var _props = this.props;
    var width = _props.width;
    var breakpoints = _props.breakpoints;
    var layouts = _props.layouts;
    var verticalCompact = _props.verticalCompact;
    var cols = _props.cols;
    var breakpoint = (0, _responsiveUtils.getBreakpointFromWidth)(breakpoints, width);
    var colNo = (0, _responsiveUtils.getColsFromBreakpoint)(breakpoint, cols);
    var initialLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(layouts, breakpoints, breakpoint, breakpoint, colNo, verticalCompact);
    return {
      layout: initialLayout,
      breakpoint: breakpoint,
      cols: colNo
    };
  };
  ResponsiveReactGridLayout.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.width != this.props.width || nextProps.breakpoint !== this.props.breakpoint) {
      this.onWidthChange(nextProps);
    } else if (!(0, _lodash2.default)(nextProps.layouts, this.props.layouts)) {
      var _state = this.state;
      var _breakpoint = _state.breakpoint;
      var _cols = _state.cols;
      var newLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(nextProps.layouts, nextProps.breakpoints, _breakpoint, _breakpoint, _cols, nextProps.verticalLayout);
      this.setState({layout: newLayout});
    }
  };
  ResponsiveReactGridLayout.prototype.onWidthChange = function onWidthChange(nextProps) {
    var breakpoints = nextProps.breakpoints;
    var verticalLayout = nextProps.verticalLayout;
    var verticalCompact = nextProps.verticalCompact;
    var cols = nextProps.cols;
    var newBreakpoint = nextProps.breakpoint || (0, _responsiveUtils.getBreakpointFromWidth)(nextProps.breakpoints, nextProps.width);
    var lastBreakpoint = this.state.breakpoint;
    if (lastBreakpoint !== newBreakpoint) {
      var layouts = nextProps.layouts;
      layouts[lastBreakpoint] = (0, _utils.cloneLayout)(this.state.layout);
      var newCols = (0, _responsiveUtils.getColsFromBreakpoint)(newBreakpoint, cols);
      var _layout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(layouts, breakpoints, newBreakpoint, lastBreakpoint, newCols, verticalLayout);
      _layout = (0, _utils.synchronizeLayoutWithChildren)(_layout, nextProps.children, newCols, verticalCompact);
      layouts[newBreakpoint] = _layout;
      this.props.onLayoutChange(_layout, layouts);
      this.props.onBreakpointChange(newBreakpoint, newCols);
      this.props.onWidthChange(nextProps.width, nextProps.margin, newCols);
      this.setState({
        breakpoint: newBreakpoint,
        layout: _layout,
        cols: newCols
      });
    }
  };
  ResponsiveReactGridLayout.prototype.render = function render() {
    var _props2 = this.props;
    var breakpoint = _props2.breakpoint;
    var breakpoints = _props2.breakpoints;
    var cols = _props2.cols;
    var layouts = _props2.layouts;
    var onBreakpointChange = _props2.onBreakpointChange;
    var onLayoutChange = _props2.onLayoutChange;
    var onWidthChange = _props2.onWidthChange;
    var other = _objectWithoutProperties(_props2, ['breakpoint', 'breakpoints', 'cols', 'layouts', 'onBreakpointChange', 'onLayoutChange', 'onWidthChange']);
    return _react2.default.createElement(_ReactGridLayout2.default, _extends({}, other, {
      onLayoutChange: this.onLayoutChange,
      layout: this.state.layout,
      cols: this.state.cols
    }));
  };
  return ResponsiveReactGridLayout;
}(_react2.default.Component);
ResponsiveReactGridLayout.propTypes = {
  breakpoint: _react2.default.PropTypes.string,
  breakpoints: _react2.default.PropTypes.object,
  cols: _react2.default.PropTypes.object,
  layouts: function layouts(props) {
    _react2.default.PropTypes.object.isRequired.apply(this, arguments);
    Object.keys(props.layouts).forEach(function(key) {
      return (0, _utils.validateLayout)(props.layouts[key], 'layouts.' + key);
    });
  },
  width: _react2.default.PropTypes.number.isRequired,
  onBreakpointChange: _react2.default.PropTypes.func,
  onLayoutChange: _react2.default.PropTypes.func,
  onWidthChange: _react2.default.PropTypes.func
};
ResponsiveReactGridLayout.defaultProps = {
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  },
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  },
  layouts: {},
  onBreakpointChange: noop,
  onLayoutChange: noop,
  onWidthChange: noop
};
exports.default = ResponsiveReactGridLayout;
