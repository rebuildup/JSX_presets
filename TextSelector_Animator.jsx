//@target aftereffects

/**
 * TextSelector_Animator.jsx
 * Text animator integration module for the Text Selector Modular System
 * Manages the creation and configuration of text animators for all effect types
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * Creates and configures text animators for all effect types
 * @param {Layer} textLayer - The text layer to add animators to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function createTextAnimators(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Check if layer is a text layer
    if (!isTextLayer(textLayer)) {
      throw new Error("Layer is not a text layer");
    }
    
    // Create position animator
    createPositionAnimator(textLayer, controlLayerName);
    
    // Create opacity animator
    createOpacityAnimator(textLayer, controlLayerName);
    
    // Create transform animator
    createTransformAnimator(textLayer, controlLayerName);
    
    // Create wiggle animator
    createWiggleAnimator(textLayer, controlLayerName);
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createTextAnimators", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createTextAnimators: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates position animator with proper expression binding
 * @param {Layer} textLayer - Text layer to add animator to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function createPositionAnimator(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Create animator if it doesn't exist
    var animatorName = "TextSelector Position";
    var animator = getOrCreateAnimator(textLayer, animatorName);
    
    // Add properties to animator
    var animatorProps = animator.property("ADBE Text Animator Properties");
    
    // Add Position 3D property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Position 3D")) {
      var positionProp = animatorProps.addProperty("ADBE Text Position 3D");
      positionProp.expression = generatePositionExpression(controlLayerName);
    }
    
    // Add Anchor Point property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Anchor Point 3D")) {
      var anchorProp = animatorProps.addProperty("ADBE Text Anchor Point 3D");
      anchorProp.expression = generateAnchorPointExpression(controlLayerName);
    }
    
    // Add selectors
    addRangeSelector(animator, controlLayerName, "Y");
    addRangeSelector(animator, controlLayerName, "X");
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createPositionAnimator", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createPositionAnimator: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates opacity animator with expression selectors
 * @param {Layer} textLayer - Text layer to add animator to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function createOpacityAnimator(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Create animator if it doesn't exist
    var animatorName = "TextSelector Opacity";
    var animator = getOrCreateAnimator(textLayer, animatorName);
    
    // Add properties to animator
    var animatorProps = animator.property("ADBE Text Animator Properties");
    
    // Add Opacity property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Opacity")) {
      var opacityProp = animatorProps.addProperty("ADBE Text Opacity");
      opacityProp.expression = generateOpacityExpression(controlLayerName);
    }
    
    // Add expression selector
    var selectors = animator.property("ADBE Text Selectors");
    if (selectors.numProperties === 0) {
      var expressionSelector = selectors.addProperty("ADBE Text Expressible Selector");
      expressionSelector.name = "Opacity Selector";
      expressionSelector.property("ADBE Text Expressible Amount").expression = generateOpacitySelectorExpression(controlLayerName);
    }
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createOpacityAnimator", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createOpacityAnimator: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates transform animator with scale, rotation, and skew properties
 * @param {Layer} textLayer - Text layer to add animator to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function createTransformAnimator(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Create animator if it doesn't exist
    var animatorName = "TextSelector Transform";
    var animator = getOrCreateAnimator(textLayer, animatorName);
    
    // Add properties to animator
    var animatorProps = animator.property("ADBE Text Animator Properties");
    
    // Add Scale property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Scale")) {
      var scaleProp = animatorProps.addProperty("ADBE Text Scale");
      scaleProp.expression = generateScaleExpression(controlLayerName);
    }
    
    // Add Rotation property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Rotation")) {
      var rotationProp = animatorProps.addProperty("ADBE Text Rotation");
      rotationProp.expression = generateRotationExpression(controlLayerName);
    }
    
    // Add Skew property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Skew")) {
      var skewProp = animatorProps.addProperty("ADBE Text Skew");
      skewProp.expression = generateDistortionExpression(controlLayerName);
    }
    
    // Add Skew Axis property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Skew Axis")) {
      var skewAxisProp = animatorProps.addProperty("ADBE Text Skew Axis");
      skewAxisProp.expression = generateDistortionAxisExpression(controlLayerName);
    }
    
    // Add expression selector
    var selectors = animator.property("ADBE Text Selectors");
    if (selectors.numProperties === 0) {
      var expressionSelector = selectors.addProperty("ADBE Text Expressible Selector");
      expressionSelector.name = "Transform Selector";
      expressionSelector.property("ADBE Text Expressible Amount").expression = "textIndex / textTotal";
    }
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createTransformAnimator", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createTransformAnimator: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates wiggle animator with position, scale, rotation, and skew properties
 * @param {Layer} textLayer - Text layer to add animator to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function createWiggleAnimator(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Create animator if it doesn't exist
    var animatorName = "TextSelector Wiggle";
    var animator = getOrCreateAnimator(textLayer, animatorName);
    
    // Add properties to animator
    var animatorProps = animator.property("ADBE Text Animator Properties");
    
    // Add Position property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Position 3D")) {
      var positionProp = animatorProps.addProperty("ADBE Text Position 3D");
      positionProp.expression = generateWigglePositionExpression(controlLayerName);
    }
    
    // Add Scale property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Scale")) {
      var scaleProp = animatorProps.addProperty("ADBE Text Scale");
      scaleProp.expression = generateWiggleScaleExpression(controlLayerName);
    }
    
    // Add Rotation property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Rotation")) {
      var rotationProp = animatorProps.addProperty("ADBE Text Rotation");
      rotationProp.expression = generateWiggleRotationExpression(controlLayerName);
    }
    
    // Add Skew property if it doesn't exist
    if (!propertyExists(animatorProps, "ADBE Text Skew")) {
      var skewProp = animatorProps.addProperty("ADBE Text Skew");
      skewProp.expression = generateWiggleDistortionExpression(controlLayerName);
    }
    
    // Add expression selector
    var selectors = animator.property("ADBE Text Selectors");
    if (selectors.numProperties === 0) {
      var expressionSelector = selectors.addProperty("ADBE Text Expressible Selector");
      expressionSelector.name = "Wiggle Selector";
      expressionSelector.property("ADBE Text Expressible Amount").expression = "textIndex / textTotal";
    }
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createWiggleAnimator", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createWiggleAnimator: " + error.toString());
    }
    return false;
  }
}

/**
 * Gets an existing animator or creates a new one if it doesn't exist
 * @param {Layer} textLayer - Text layer to get/create animator on
 * @param {String} animatorName - Name of the animator
 * @returns {PropertyGroup} The animator property group
 */
function getOrCreateAnimator(textLayer, animatorName) {
  // Check if animator already exists
  var textAnimators = textLayer.property("ADBE Text Properties").property("ADBE Text Animators");
  for (var i = 1; i <= textAnimators.numProperties; i++) {
    if (textAnimators.property(i).name === animatorName) {
      return textAnimators.property(i);
    }
  }
  
  // Create new animator if it doesn't exist
  var animator = textAnimators.addProperty("ADBE Text Animator");
  animator.name = animatorName;
  return animator;
}

/**
 * Checks if a property exists in a property group
 * @param {PropertyGroup} propertyGroup - Property group to check
 * @param {String} matchName - Match name of the property to check
 * @returns {Boolean} True if property exists
 */
function propertyExists(propertyGroup, matchName) {
  try {
    var prop = propertyGroup.property(matchName);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Adds a range selector to an animator
 * @param {PropertyGroup} animator - Animator to add selector to
 * @param {String} controlLayerName - Name of the control layer
 * @param {String} axis - Axis ("X" or "Y") for position selector
 * @returns {PropertyGroup} The created selector
 */
function addRangeSelector(animator, controlLayerName, axis) {
  var selectors = animator.property("ADBE Text Selectors");
  
  // Create selector
  var selector = selectors.addProperty("ADBE Text Selector");
  selector.name = "Position " + axis + " Selector";
  
  // Configure selector
  var selectorProps = selector.property("ADBE Text Selector Properties");
  
  // Set start and end
  var startProp = selectorProps.property("ADBE Text Percent Start");
  startProp.setValue(0);
  
  var endProp = selectorProps.property("ADBE Text Percent End");
  endProp.setValue(100);
  
  // Set advanced properties
  var advancedProps = selector.property("ADBE Text Selector Advanced");
  
  // Set mode to Add
  var modeProp = advancedProps.property("ADBE Text Range Mode");
  modeProp.setValue(1); // 1 = Add
  
  // Set shape to Ramp Up
  var shapeProp = advancedProps.property("ADBE Text Selector Shape");
  shapeProp.setValue(1); // 1 = Ramp Up
  
  // Set axis-specific expression
  var amountProp = selectorProps.property("ADBE Text Selector Amount");
  if (axis === "X") {
    amountProp.expression = generatePositionXSelectorExpression(controlLayerName);
  } else {
    amountProp.expression = generatePositionYSelectorExpression(controlLayerName);
  }
  
  return selector;
}

/**
 * Generates position expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Position expression
 */
function generatePositionExpression(controlLayerName) {
  var expressionCode = `
// Position expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  [0, 0, 0];
} else {
  // Cache effect references
  var aniPosition = ctrlLayer.effect("Ani-Position")("Point");
  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");
  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");
  
  // Initialize result
  var result = [0, 0, 0];
  
  // Apply position based on animation style
  if (aniStyle >= 2) {
    // 2-way random mode
    seedRandom(seedRandom + textIndex);
    
    if (aniStyle == 2) {
      // 2-way XY mode
      result[0] = random(-thisComp.width/2, thisComp.width/2);
      result[1] = random(-thisComp.height/2, thisComp.height/2);
    } else {
      // 2-way YX mode
      result[0] = random(-thisComp.width/2, thisComp.width/2);
      result[1] = random(-thisComp.height/2, thisComp.height/2);
    }
  } else {
    // Single mode - use manual values
    result[0] = aniPosition[0];
    result[1] = aniPosition[1];
  }
  
  result;
}`;

  return generateSafeExpression(expressionCode, "[0, 0, 0]");
}

/**
 * Generates anchor point expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Anchor point expression
 */
function generateAnchorPointExpression(controlLayerName) {
  var expressionCode = `
// Anchor Point expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  [0, -40, 0];
} else {
  // Get Text AnkerPoint value
  var ankerPoint = ctrlLayer.effect("Text AnkerPoint")("Point");
  
  // Default anchor point + user adjustment
  [0 + ankerPoint[0], -40 + ankerPoint[1], 0];
}`;

  return generateSafeExpression(expressionCode, "[0, -40, 0]");
}

/**
 * Generates opacity expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Opacity expression
 */
function generateOpacityExpression(controlLayerName) {
  var expressionCode = `
// Opacity expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  100;
} else {
  // Cache effect references
  var opacityStyle = ctrlLayer.effect("Opacity-Style")("Slider");
  var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");
  var delay = ctrlLayer.effect("Delay")("Slider");
  
  // Initialize result
  var result = 100;
  
  // Apply opacity based on style
  if (opacityStyle == 1) {
    // Auto mode
    var framesSinceInPoint = (time - inPoint) / thisComp.frameDuration;
    result = framesSinceInPoint <= 0 ? 100 : 0;
  } else {
    // Manual mode
    var d = delay * thisComp.frameDuration * (textIndex - 1);
    result = opacityManual.valueAtTime(time - d);
  }
  
  result;
}`;

  return generateSafeExpression(expressionCode, "100");
}

/**
 * Generates position Y selector expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Position Y selector expression
 */
function generatePositionYSelectorExpression(controlLayerName) {
  var expressionCode = `
// Position Y Selector expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  0;
} else {
  // Cache effect references
  var delay = ctrlLayer.effect("Delay")("Slider");
  var styledp = ctrlLayer.effect("Ani-Style")("Slider");
  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
  
  // Apply posterize time for performance
  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
  
  // Calculate delay based on animation style
  var d = (styledp == 2 ? delay * 2 : delay) * thisComp.frameDuration * (textIndex - 1);
  
  // Get animation value at delayed time
  ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);
}`;

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Generates position X selector expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Position X selector expression
 */
function generatePositionXSelectorExpression(controlLayerName) {
  var expressionCode = `
// Position X Selector expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  0;
} else {
  // Cache effect references
  var delay = ctrlLayer.effect("Delay")("Slider");
  var styledp = ctrlLayer.effect("Ani-Style")("Slider");
  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
  
  // Apply posterize time for performance
  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
  
  // Calculate delay based on animation style
  var d = (styledp == 3 ? delay * 2 : delay) * thisComp.frameDuration * (textIndex - 1);
  
  // Get animation value at delayed time
  ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);
}`;

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Generates opacity selector expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Opacity selector expression
 */
function generateOpacitySelectorExpression(controlLayerName) {
  var expressionCode = `
// Opacity Selector expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("${controlLayerName}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  0;
} else {
  // Get text index
  var idx = textIndex;
  
  // Simple selector based on text index
  idx / textTotal;
}`;

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Applies all text animator expressions to a text layer
 * @param {Layer} textLayer - The text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function applyAllAnimatorExpressions(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(controlLayerName, "controlLayerName", function(val) {
      return val && typeof val === "string";
    });
    
    // Apply expressions to all animators
    createTextAnimators(textLayer, controlLayerName);
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "applyAllAnimatorExpressions", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in applyAllAnimatorExpressions: " + error.toString());
    }
    return false;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTextAnimators: createTextAnimators,
    createPositionAnimator: createPositionAnimator,
    createOpacityAnimator: createOpacityAnimator,
    createTransformAnimator: createTransformAnimator,
    createWiggleAnimator: createWiggleAnimator,
    getOrCreateAnimator: getOrCreateAnimator,
    propertyExists: propertyExists,
    addRangeSelector: addRangeSelector,
    generatePositionExpression: generatePositionExpression,
    generateAnchorPointExpression: generateAnchorPointExpression,
    generateOpacityExpression: generateOpacityExpression,
    generatePositionYSelectorExpression: generatePositionYSelectorExpression,
    generatePositionXSelectorExpression: generatePositionXSelectorExpression,
    generateOpacitySelectorExpression: generateOpacitySelectorExpression,
    applyAllAnimatorExpressions: applyAllAnimatorExpressions
  };
}