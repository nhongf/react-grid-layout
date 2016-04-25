/* */ 
'use strict';
exports.__esModule = true;
exports.getBreakpointFromWidth = getBreakpointFromWidth;
exports.getColsFromBreakpoint = getColsFromBreakpoint;
exports.findOrGenerateResponsiveLayout = findOrGenerateResponsiveLayout;
exports.sortBreakpoints = sortBreakpoints;
var _utils = require('./utils');
function getBreakpointFromWidth(breakpoints, width) {
  var sorted = sortBreakpoints(breakpoints);
  var matching = sorted[0];
  for (var i = 1,
      len = sorted.length; i < len; i++) {
    var breakpointName = sorted[i];
    if (width > breakpoints[breakpointName])
      matching = breakpointName;
  }
  return matching;
}
function getColsFromBreakpoint(breakpoint, cols) {
  if (!cols[breakpoint]) {
    throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + breakpoint + " is missing!");
  }
  return cols[breakpoint];
}
function findOrGenerateResponsiveLayout(layouts, breakpoints, breakpoint, lastBreakpoint, cols, verticalCompact) {
  if (layouts[breakpoint])
    return (0, _utils.cloneLayout)(layouts[breakpoint]);
  var layout = layouts[lastBreakpoint];
  var breakpointsSorted = sortBreakpoints(breakpoints);
  var breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
  for (var i = 0,
      len = breakpointsAbove.length; i < len; i++) {
    var b = breakpointsAbove[i];
    if (layouts[b]) {
      layout = layouts[b];
      break;
    }
  }
  layout = (0, _utils.cloneLayout)(layout || []);
  return (0, _utils.compact)((0, _utils.correctBounds)(layout, {cols: cols}), verticalCompact);
}
function sortBreakpoints(breakpoints) {
  var keys = Object.keys(breakpoints);
  return keys.sort(function(a, b) {
    return breakpoints[a] - breakpoints[b];
  });
}
