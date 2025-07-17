//@target aftereffects

/**
 * TextSelector_ExpressionOptimizer.jsx
 * Expression generation and optimization system for the Text Selector Modular System
 * Provides optimized expression templates and performance enhancements
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * Generates a safe expression with try-catch blocks and fallback values
 * @param {String} expressionCode - The expression code to wrap
 * @param {String|Number|Array} fallbackValue - The fallback value to use if the expression fails
 * @param {Boolean} includeDebugInfo - Whether to include debug information in the expression
 * @returns {String} The safe expression with error handling
 */
function generateSafeExpression(expressionCode, fallbackValue, includeDebugInfo) {
  // Convert fallback value to string representation
  var fallbackStr = "";
  
  if (fallbackValue === undefined || fallbackValue === null) {
    fallbackStr = "value";
  } else if (typeof fallbackValue === "string") {
    fallbackStr = '"' + fallbackValue + '"';
  } else if (Array.isArray(fallbackValue)) {
    fallbackStr = "[" + fallbackValue.join(", ") + "]";
  } else {
    fallbackStr = fallbackValue.toString();
  }
  
  // Create debug info section if requested
  var debugSection = "";
  if (includeDebugInfo) {
    debugSection = `
    // Log error for debugging
    try {
      var debugLayer = thisComp.layer("TextSelector_Controls");
      if (debugLayer.effect("Debug Mode")("Checkbox")) {
        $.writeln("TextSelector Error: " + err.toString() + " in property: " + thisProperty.name);
      }
    } catch(e) {}`;
  }
  
  // Build the safe expression
  return `
try {
    ${expressionCode}
} catch (err) {
    // TextSelector Error Handler${debugSection}
    ${fallbackStr};
}`;
}

/**
 * Creates an optimized expression template with dynamic control layer name substitution
 * @param {String} templateName - The name of the template to use
 * @param {String} controlLayerName - The name of the control layer to substitute
 * @param {Object} additionalParams - Additional parameters to substitute in the template
 * @returns {String} The generated expression
 */
function createExpressionFromTemplate(templateName, controlLayerName, additionalParams) {
  // Get the template
  var template = getExpressionTemplate(templateName);
  
  // Replace control layer name
  template = template.replace(/\$\{CONTROL_LAYER\}/g, controlLayerName);
  
  // Replace additional parameters
  if (additionalParams) {
    for (var key in additionalParams) {
      if (additionalParams.hasOwnProperty(key)) {
        var regex = new RegExp("\\$\\{" + key + "\\}", "g");
        template = template.replace(regex, additionalParams[key]);
      }
    }
  }
  
  return template;
}

/**
 * Gets an expression template by name
 * @param {String} templateName - The name of the template to get
 * @returns {String} The template expression
 */
function getExpressionTemplate(templateName) {
  switch (templateName) {
    case "POSITION_Y":
      return getPositionYTemplate();
    case "POSITION_X":
      return getPositionXTemplate();
    case "TWO_WAY_RANDOMIZER":
      return getTwoWayRandomizerTemplate();
    case "OPACITY":
      return getOpacityTemplate();
    case "SCALE":
      return getScaleTemplate();
    case "ROTATION":
      return getRotationTemplate();
    case "DISTORTION":
      return getDistortionTemplate();
    case "WIGGLE_POSITION":
      return getWigglePositionTemplate();
    case "WIGGLE_SCALE":
      return getWiggleScaleTemplate();
    case "WIGGLE_ROTATION":
      return getWiggleRotationTemplate();
    default:
      throw new Error("Unknown expression template: " + templateName);
  }
}

/**
 * Gets the optimized Position Y expression template
 * @returns {String} The template expression
 */
function getPositionYTemplate() {
  return `
// Position Y Selector expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
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
}

/**
 * Gets the optimized Position X expression template
 * @returns {String} The template expression
 */
function getPositionXTemplate() {
  return `
// Position X Selector expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
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
}

/**
 * Gets the optimized 2-way randomizer expression template
 * @returns {String} The template expression
 */
function getTwoWayRandomizerTemplate() {
  return `
// 2-way Randomizer expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  selectorValue;
} else {
  // Cache effect references
  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");
  
  // Apply 2-way randomization based on animation style
  if (aniStyle == 2 || aniStyle == 3) {
    // Alternate positive/negative based on textIndex
    ((textIndex % 2) == 0) ? selectorValue : -selectorValue;
  } else {
    // Single mode - use normal selector value
    selectorValue;
  }
}`;
}

/**
 * Gets the optimized opacity expression template
 * @returns {String} The template expression
 */
function getOpacityTemplate() {
  return `
// Opacity expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
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
}

/**
 * Gets the optimized scale expression template
 * @returns {String} The template expression
 */
function getScaleTemplate() {
  return `
// Scale expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  [100, 100];
} else {
  // Cache effect references
  var scaleOn = ctrlLayer.effect("Scale : ON")("Checkbox");
  var addScale = ctrlLayer.effect("Add Scale")("Point");
  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");
  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");
  
  // Get text index and selector value
  var idx = textIndex;
  var selectorValue = effect("Selector").value;
  
  // Initialize result
  var result = [100, 100];
  
  // Apply scale if enabled
  if (scaleOn) {
    if (aniStyle >= 2) {
      // 2-way random mode
      // Use seedRandom for consistent randomization
      seedRandom(seedRandom + idx);
      
      // Generate random scale values within range -2000 to 2000
      var randomX = random(-2000, 2000);
      var randomY = random(-2000, 2000);
      
      // Apply selector value for animation
      result = [
        100 + randomX * selectorValue,
        100 + randomY * selectorValue
      ];
    } else {
      // Single mode - use manual values
      result = [
        100 + addScale[0] * selectorValue,
        100 + addScale[1] * selectorValue
      ];
    }
  }
  
  result;
}`;
}

/**
 * Gets the optimized rotation expression template
 * @returns {String} The template expression
 */
function getRotationTemplate() {
  return `
// Rotation expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  0;
} else {
  // Cache effect references
  var rotationOn = ctrlLayer.effect("Rotation : ON")("Checkbox");
  var addRotation = ctrlLayer.effect("Add Rotation")("Slider");
  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");
  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");
  
  // Get text index and selector value
  var idx = textIndex;
  var selectorValue = effect("Selector").value;
  
  // Initialize result
  var result = 0;
  
  // Apply rotation if enabled
  if (rotationOn) {
    if (aniStyle >= 2) {
      // 2-way random mode
      // Use seedRandom for consistent randomization
      seedRandom(seedRandom + idx);
      
      // Generate random rotation value within range -359 to 359
      var randomRotation = random(-359, 359);
      
      // Apply selector value for animation
      result = randomRotation * selectorValue;
    } else {
      // Single mode - use manual value
      result = addRotation * selectorValue;
    }
  }
  
  result;
}`;
}

/**
 * Gets the optimized distortion expression template
 * @returns {String} The template expression
 */
function getDistortionTemplate() {
  return `
// Distortion expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");

// Early exit if disabled
if (!globalEnable) {
  0;
} else {
  // Cache effect references
  var distortionOn = ctrlLayer.effect("Distortion : ON")("Checkbox");
  var addDistortion = ctrlLayer.effect("Add Distortion")("Slider");
  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");
  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");
  
  // Get text index and selector value
  var idx = textIndex;
  var selectorValue = effect("Selector").value;
  
  // Initialize result
  var result = 0;
  
  // Apply distortion if enabled
  if (distortionOn) {
    if (aniStyle >= 2) {
      // 2-way random mode
      // Use seedRandom for consistent randomization
      seedRandom(seedRandom + idx);
      
      // Generate random distortion value within range -70 to 70
      var randomDistortion = random(-70, 70);
      
      // Apply selector value for animation
      result = randomDistortion * selectorValue;
    } else {
      // Single mode - use manual value
      result = addDistortion * selectorValue;
    }
  }
  
  result;
}`;
}

/**
 * Gets the optimized wiggle position expression template
 * @returns {String} The template expression
 */
function getWigglePositionTemplate() {
  return `
// Wiggle Position expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");
var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");

// Early exit if disabled
if (!globalEnable || !wiggleEnabled) {
  [0, 0];
} else {
  // Cache effect references
  var freq = ctrlLayer.effect("Fluc/Sec")("Point");
  var amp = ctrlLayer.effect("Wiggle Position")("Point");
  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");
  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");
  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
  
  // Apply posterize time for performance
  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
  
  // Get text index for character-specific timing
  var idx = textIndex;
  
  // Calculate character-specific time offset
  var timeOffset = idx * thisComp.frameDuration * 0.1;
  
  // Current time with offset
  var currentTime = time + timeOffset;
  
  // Character-specific seed
  var characterSeed = seed + idx;
  
  // Apply smooth wiggle or standard wiggle based on setting
  if (smooth) {
    // Smooth wiggle using sine waves for natural motion
    seedRandom(characterSeed);
    var randomPhase = random(0, Math.PI * 2);
    var x = Math.sin(currentTime * freq[0] * Math.PI * 2 + randomPhase) * amp[0];
    var y = Math.sin(currentTime * freq[1] * Math.PI * 2 + randomPhase + Math.PI/2) * amp[1];
    [x, y];
  } else {
    // Standard wiggle with character-specific timing and seed
    seedRandom(characterSeed);
    [
      wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],
      wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1]
    ];
  }
}`;
}

/**
 * Gets the optimized wiggle scale expression template
 * @returns {String} The template expression
 */
function getWiggleScaleTemplate() {
  return `
// Wiggle Scale expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");
var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");

// Early exit if disabled
if (!globalEnable || !wiggleEnabled) {
  [100, 100];
} else {
  // Cache effect references
  var freq = ctrlLayer.effect("Fluc/Sec")("Point");
  var amp = ctrlLayer.effect("Wiggle Scale")("Point");
  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");
  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");
  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
  
  // Apply posterize time for performance
  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
  
  // Get text index for character-specific timing
  var idx = textIndex;
  
  // Calculate character-specific time offset
  var timeOffset = idx * thisComp.frameDuration * 0.1;
  
  // Current time with offset
  var currentTime = time + timeOffset;
  
  // Character-specific seed
  var characterSeed = seed + idx;
  
  // Base scale value (100%)
  var baseScale = [100, 100];
  
  // Apply smooth wiggle or standard wiggle based on setting
  if (smooth) {
    // Smooth wiggle using sine waves for natural motion
    seedRandom(characterSeed);
    var randomPhase = random(0, Math.PI * 2);
    var x = Math.sin(currentTime * freq[0] * Math.PI * 2 + randomPhase) * amp[0];
    var y = Math.sin(currentTime * freq[1] * Math.PI * 2 + randomPhase + Math.PI/2) * amp[1];
    [baseScale[0] + x, baseScale[1] + y];
  } else {
    // Standard wiggle with character-specific timing and seed
    seedRandom(characterSeed);
    [
      baseScale[0] + wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],
      baseScale[1] + wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1]
    ];
  }
}`;
}

/**
 * Gets the optimized wiggle rotation expression template
 * @returns {String} The template expression
 */
function getWiggleRotationTemplate() {
  return `
// Wiggle Rotation expression for TextSelector
// Cache control layer reference
var ctrlLayer = thisComp.layer("\${CONTROL_LAYER}");
var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");
var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");

// Early exit if disabled
if (!globalEnable || !wiggleEnabled) {
  0;
} else {
  // Cache effect references
  var freq = ctrlLayer.effect("Fluc/Sec")("Point")[0]; // Use X frequency for rotation
  var amp = ctrlLayer.effect("Wiggle Rotation")("Slider");
  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");
  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");
  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
  
  // Apply posterize time for performance
  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
  
  // Get text index for character-specific timing
  var idx = textIndex;
  
  // Calculate character-specific time offset
  var timeOffset = idx * thisComp.frameDuration * 0.1;
  
  // Current time with offset
  var currentTime = time + timeOffset;
  
  // Character-specific seed
  var characterSeed = seed + idx;
  
  // Apply smooth wiggle or standard wiggle based on setting
  if (smooth) {
    // Smooth wiggle using sine waves for natural motion
    seedRandom(characterSeed);
    var randomPhase = random(0, Math.PI * 2);
    Math.sin(currentTime * freq * Math.PI * 2 + randomPhase) * amp;
  } else {
    // Standard wiggle with character-specific timing and seed
    seedRandom(characterSeed);
    wiggle(freq, amp, 1, 0.5, currentTime);
  }
}`;
}

/**
 * Optimizes an expression by applying performance enhancements
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function optimizeExpression(expression) {
  // Apply variable caching optimization
  expression = applyCachingOptimization(expression);
  
  // Apply early exit optimization
  expression = applyEarlyExitOptimization(expression);
  
  // Apply valueAtTime optimization
  expression = applyValueAtTimeOptimization(expression);
  
  return expression;
}

/**
 * Applies variable caching optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyCachingOptimization(expression) {
  // This is a simplified implementation
  // In a real implementation, this would analyze the expression and cache repeated lookups
  
  // Check if the expression already has caching
  if (expression.indexOf("var ctrlLayer = thisComp.layer") !== -1) {
    return expression; // Already optimized
  }
  
  // Add control layer caching if not present
  if (expression.indexOf("thisComp.layer(") !== -1) {
    var layerMatch = expression.match(/thisComp\.layer\(["']([^"']+)["']\)/);
    if (layerMatch && layerMatch[1]) {
      var layerName = layerMatch[1];
      var cachingCode = "var ctrlLayer = thisComp.layer(\"" + layerName + "\");\n";
      
      // Replace direct layer references with cached variable
      expression = expression.replace(
        new RegExp("thisComp\\.layer\\([\"']" + layerName + "[\"']\\)", "g"),
        "ctrlLayer"
      );
      
      // Add caching code at the beginning of the expression
      expression = cachingCode + expression;
    }
  }
  
  return expression;
}

/**
 * Applies early exit optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyEarlyExitOptimization(expression) {
  // This is a simplified implementation
  // In a real implementation, this would analyze the expression and add early exits
  
  // Check if the expression already has early exit
  if (expression.indexOf("if (!globalEnable)") !== -1) {
    return expression; // Already optimized
  }
  
  // Add global enable check if not present
  if (expression.indexOf("globalEnable") !== -1) {
    var earlyExitCode = `
// Early exit if disabled
if (!globalEnable) {
  ${getDefaultValueForExpression(expression)};
} else {
`;
    
    // Find a good insertion point
    var insertPoint = expression.indexOf("var globalEnable");
    if (insertPoint !== -1) {
      insertPoint = expression.indexOf("\n", insertPoint) + 1;
      
      // Insert early exit code
      expression = 
        expression.substring(0, insertPoint) + 
        earlyExitCode + 
        expression.substring(insertPoint) + 
        "\n}";
    }
  }
  
  return expression;
}

/**
 * Applies valueAtTime optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyValueAtTimeOptimization(expression) {
  // This is a simplified implementation
  // In a real implementation, this would analyze the expression and optimize valueAtTime calls
  
  // Check for valueAtTime calls
  if (expression.indexOf("valueAtTime") !== -1) {
    // Cache time calculations
    if (expression.indexOf("var d = ") === -1 && 
        expression.indexOf("delay * thisComp.frameDuration * (textIndex - 1)") !== -1) {
      
      expression = expression.replace(
        /delay \* thisComp\.frameDuration \* \(textIndex - 1\)/g,
        "d"
      );
      
      // Add time calculation caching
      var insertPoint = expression.indexOf("var delay");
      if (insertPoint !== -1) {
        insertPoint = expression.indexOf("\n", insertPoint) + 1;
        
        expression = 
          expression.substring(0, insertPoint) + 
          "var d = delay * thisComp.frameDuration * (textIndex - 1);\n" + 
          expression.substring(insertPoint);
      }
    }
  }
  
  return expression;
}

/**
 * Gets the default value for an expression based on its type
 * @param {String} expression - The expression to analyze
 * @returns {String} The default value as a string
 */
function getDefaultValueForExpression(expression) {
  if (expression.indexOf("[100, 100]") !== -1) {
    return "[100, 100]";
  } else if (expression.indexOf("[0, 0]") !== -1) {
    return "[0, 0]";
  } else if (expression.indexOf("[0, 0, 0]") !== -1) {
    return "[0, 0, 0]";
  } else if (expression.indexOf("opacity") !== -1 || expression.indexOf("Opacity") !== -1) {
    return "100";
  } else {
    return "0";
  }
}

/**
 * Creates an optimized expression for a specific property
 * @param {String} propertyType - The type of property (e.g., "POSITION_Y", "SCALE", etc.)
 * @param {String} controlLayerName - The name of the control layer
 * @param {Object} additionalParams - Additional parameters for the expression
 * @returns {String} The optimized expression
 */
function createOptimizedExpression(propertyType, controlLayerName, additionalParams) {
  // Get the expression template
  var template = createExpressionFromTemplate(propertyType, controlLayerName, additionalParams);
  
  // Optimize the expression
  var optimized = optimizeExpression(template);
  
  // Wrap in safe expression
  var fallbackValue = getDefaultValueForPropertyType(propertyType);
  return generateSafeExpression(optimized, fallbackValue, true);
}

/**
 * Gets the default value for a property type
 * @param {String} propertyType - The type of property
 * @returns {String|Number|Array} The default value
 */
function getDefaultValueForPropertyType(propertyType) {
  switch (propertyType) {
    case "POSITION_Y":
    case "POSITION_X":
      return 0;
    case "SCALE":
    case "WIGGLE_SCALE":
      return [100, 100];
    case "POSITION":
    case "WIGGLE_POSITION":
      return [0, 0];
    case "OPACITY":
      return 100;
    case "ROTATION":
    case "DISTORTION":
    case "WIGGLE_ROTATION":
      return 0;
    default:
      return 0;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateSafeExpression: generateSafeExpression,
    createExpressionFromTemplate: createExpressionFromTemplate,
    getExpressionTemplate: getExpressionTemplate,
    optimizeExpression: optimizeExpression,
    applyCachingOptimization: applyCachingOptimization,
    applyEarlyExitOptimization: applyEarlyExitOptimization,
    applyValueAtTimeOptimization: applyValueAtTimeOptimization,
    createOptimizedExpression: createOptimizedExpression,
    getDefaultValueForPropertyType: getDefaultValueForPropertyType
  };
}