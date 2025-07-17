//@target aftereffects

/**
 * TextSelector_Utils.jsx
 * Utility functions for the Text Selector Modular System
 * Version: 2.0.1
 */

/**
 * Safe property access functions to handle missing references gracefully
 */
function safeGetEffect(layer, effectName) {
  try {
    return layer.effect(effectName);
  } catch (e) {
    return null;
  }
}

function safeGetProperty(effect, propertyName) {
  try {
    return effect.property(propertyName);
  } catch (e) {
    return null;
  }
}

/**
 * Value validation and manipulation
 */
function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTextIndex() {
  try {
    return textIndex;
  } catch (e) {
    return 1;
  }
}

/**
 * Composition information retrieval
 */
function getCompInfo() {
  return {
    width: thisComp.width,
    height: thisComp.height,
    frameDuration: thisComp.frameDuration,
    time: time,
    inPoint: inPoint,
  };
}

/**
 * Layer type checking
 */
function isTextLayer(layer) {
  try {
    return layer.property("ADBE Text Properties") !== null;
  } catch (e) {
    return false;
  }
}

/**
 * String utilities
 */
function formatString(str, args) {
  return str.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
}

/**
 * Array utilities
 */
function arrayContains(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return true;
    }
  }
  return false;
}

/**
 * Object utilities
 */
function mergeObjects(obj1, obj2) {
  var result = {};

  // Copy properties from obj1
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      result[key] = obj1[key];
    }
  }

  // Copy and overwrite with properties from obj2
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      result[key] = obj2[key];
    }
  }

  return result;
}

/**
 * After Effects specific utilities
 */
function findLayerByName(comp, name) {
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).name === name) {
      return comp.layer(i);
    }
  }
  return null;
}

function getActiveComp() {
  var comp = app.project.activeItem;
  if (comp && comp instanceof CompItem) {
    return comp;
  }
  return null;
}

function getSelectedLayers() {
  var comp = getActiveComp();
  if (!comp) return [];

  var selectedLayers = [];
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).selected) {
      selectedLayers.push(comp.layer(i));
    }
  }
  return selectedLayers;
}

/**
 * Expression utilities
 */
function wrapExpressionWithTryCatch(expression, fallbackValue) {
  return (
    "try {\n" +
    expression +
    "\n" +
    "} catch (err) {\n" +
    "    " +
    (fallbackValue !== undefined ? fallbackValue : "value") +
    ";\n" +
    "}"
  );
}

// Export utilities
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    safeGetEffect: safeGetEffect,
    safeGetProperty: safeGetProperty,
    clampValue: clampValue,
    getTextIndex: getTextIndex,
    getCompInfo: getCompInfo,
    isTextLayer: isTextLayer,
    formatString: formatString,
    arrayContains: arrayContains,
    mergeObjects: mergeObjects,
    findLayerByName: findLayerByName,
    getActiveComp: getActiveComp,
    getSelectedLayers: getSelectedLayers,
    wrapExpressionWithTryCatch: wrapExpressionWithTryCatch,
  };
}
