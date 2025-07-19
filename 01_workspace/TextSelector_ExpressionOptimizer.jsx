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
function generateSafeExpression(
  expressionCode,
  fallbackValue,
  includeDebugInfo
) {
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
    debugSection =
      "\n    // Log error for debugging\n" +
      "    try {\n" +
      '      var debugLayer = thisComp.layer("TextSelector_Controls");\n' +
      '      if (debugLayer.effect("Debug Mode")("Checkbox")) {\n' +
      '        $.writeln("TextSelector Error: " + err.toString() + " in property: " + thisProperty.name);\n' +
      "      }\n" +
      "    } catch(e) {}";
  }

  // Build the safe expression - FIXED: Keep return statement on one line
  return (
    "\ntry {\n" +
    "    " +
    expressionCode +
    "\n" +
    "} catch (err) {\n" +
    "    // TextSelector Error Handler" +
    debugSection +
    "\n" +
    "    " +
    fallbackStr +
    ";\n" +
    "}"
  );
}

/**
 * Creates an optimized expression template with dynamic control layer name substitution
 * @param {String} templateName - The name of the template to use
 * @param {String} controlLayerName - The name of the control layer to substitute
 * @param {Object} additionalParams - Additional parameters to substitute in the template
 * @returns {String} The generated expression
 */
function createExpressionFromTemplate(
  templateName,
  controlLayerName,
  additionalParams
) {
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
  return (
    "\n" +
    "// Position Y Selector expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var delay = ctrlLayer.effect("Delay")("Slider");\n' +
    '  var styledp = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    '  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");\n' +
    "  \n" +
    "  // Apply posterize time for performance\n" +
    "  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\n" +
    "  \n" +
    "  // Calculate delay based on animation style\n" +
    "  var d = (styledp == 2 ? delay * 2 : delay) * thisComp.frameDuration * (textIndex - 1);\n" +
    "  \n" +
    "  // Get animation value at delayed time\n" +
    '  ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);\n' +
    "}"
  );
}

/**
 * Gets the optimized Position X expression template
 * @returns {String} The template expression
 */
function getPositionXTemplate() {
  return;
  "// Position X Selector expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var delay = ctrlLayer.effect("Delay")("Slider");\n' +
    '  var styledp = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    '  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");\n' +
    "  \n" +
    "  // Apply posterize time for performance\n" +
    "  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\n" +
    "  \n" +
    "  // Calculate delay based on animation style\n" +
    "  var d = (styledp == 3 ? delay * 2 : delay) * thisComp.frameDuration * (textIndex - 1);\n" +
    "  \n" +
    "  // Get animation value at delayed time\n" +
    '  ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);\n' +
    "}";
}

/**
 * Gets the optimized 2-way randomizer expression template
 * @returns {String} The template expression
 */
function getTwoWayRandomizerTemplate() {
  return;
  "// 2-way Randomizer expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  selectorValue;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    "  \n" +
    "  // Apply 2-way randomization based on animation style\n" +
    "  if (aniStyle == 2 || aniStyle == 3) {\n" +
    "    // Alternate positive/negative based on textIndex\n" +
    "    ((textIndex % 2) == 0) ? selectorValue : -selectorValue;\n" +
    "  } else {\n" +
    "    // Single mode - use normal selector value\n" +
    "    selectorValue;\n" +
    "  }\n" +
    "}";
}

/**
 * Gets the optimized opacity expression template
 * @returns {String} The template expression
 */
function getOpacityTemplate() {
  return;
  "// Opacity expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  100;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var opacityStyle = ctrlLayer.effect("Opacity-Style")("Slider");\n' +
    '  var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");\n' +
    '  var delay = ctrlLayer.effect("Delay")("Slider");\n' +
    "  \n" +
    "  // Initialize result\n" +
    "  var result = 100;\n" +
    "  \n" +
    "  // Apply opacity based on style\n" +
    "  if (opacityStyle == 1) {\n" +
    "    // Auto mode\n" +
    "    var framesSinceInPoint = (time - inPoint) / thisComp.frameDuration;\n" +
    "    result = framesSinceInPoint <= 0 ? 100 : 0;\n" +
    "  } else {\n" +
    "    // Manual mode\n" +
    "    var d = delay * thisComp.frameDuration * (textIndex - 1);\n" +
    "    result = opacityManual.valueAtTime(time - d);\n" +
    "  }\n" +
    "  \n" +
    "  result;\n" +
    "}";
}

/**
 * Gets the optimized scale expression template
 * @returns {String} The template expression
 */
function getScaleTemplate() {
  return;
  "// Scale expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  [100, 100];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var scaleOn = ctrlLayer.effect("Scale : ON")("Checkbox");\n' +
    '  var addScale = ctrlLayer.effect("Add Scale")("Point");\n' +
    '  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    '  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");\n' +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    '  var selectorValue = effect("Selector").value;\n' +
    "  \n" +
    "  // Initialize result\n" +
    "  var result = [100, 100];\n" +
    "  \n" +
    "  // Apply scale if enabled\n" +
    "  if (scaleOn) {\n" +
    "    if (aniStyle >= 2) {\n" +
    "      // 2-way random mode\n" +
    "      // Use seedRandom for consistent randomization\n" +
    "      seedRandom(seedRandom + idx);\n" +
    "      \n" +
    "      // Generate random scale values within range -2000 to 2000\n" +
    "      var randomX = random(-2000, 2000);\n" +
    "      var randomY = random(-2000, 2000);\n" +
    "      \n" +
    "      // Apply selector value for animation\n" +
    "      result = [\n" +
    "        100 + randomX * selectorValue,\n" +
    "        100 + randomY * selectorValue\n" +
    "      ];\n" +
    "    } else {\n" +
    "      // Single mode - use manual values\n" +
    "      result = [\n" +
    "        100 + addScale[0] * selectorValue,\n" +
    "        100 + addScale[1] * selectorValue\n" +
    "      ];\n" +
    "    }\n" +
    "  }\n" +
    "  \n" +
    "  result;\n" +
    "}";
}

/**
 * Gets the optimized rotation expression template
 * @returns {String} The template expression
 */
function getRotationTemplate() {
  return;
  "// Rotation expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var rotationOn = ctrlLayer.effect("Rotation : ON")("Checkbox");\n' +
    '  var addRotation = ctrlLayer.effect("Add Rotation")("Slider");\n' +
    '  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    '  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");\n' +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    '  var selectorValue = effect("Selector").value;\n' +
    "  \n" +
    "  // Initialize result\n" +
    "  var result = 0;\n" +
    "  \n" +
    "  // Apply rotation if enabled\n" +
    "  if (rotationOn) {\n" +
    "    if (aniStyle >= 2) {\n" +
    "      // 2-way random mode\n" +
    "      // Use seedRandom for consistent randomization\n" +
    "      seedRandom(seedRandom + idx);\n" +
    "      \n" +
    "      // Generate random rotation value within range -359 to 359\n" +
    "      var randomRotation = random(-359, 359);\n" +
    "      \n" +
    "      // Apply selector value for animation\n" +
    "      result = randomRotation * selectorValue;\n" +
    "    } else {\n" +
    "      // Single mode - use manual value\n" +
    "      result = addRotation * selectorValue;\n" +
    "    }\n" +
    "  }\n" +
    "  \n" +
    "  result;\n" +
    "}";
}

/**
 * Gets the optimized distortion expression template
 * @returns {String} The template expression
 */
function getDistortionTemplate() {
  return;
  "// Distortion expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var distortionOn = ctrlLayer.effect("Distortion : ON")("Checkbox");\n' +
    '  var addDistortion = ctrlLayer.effect("Add Distortion")("Slider");\n' +
    '  var aniStyle = ctrlLayer.effect("Ani-Style")("Slider");\n' +
    '  var seedRandom = ctrlLayer.effect("SeedRandom")("Slider");\n' +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    '  var selectorValue = effect("Selector").value;\n' +
    "  \n" +
    "  // Initialize result\n" +
    "  var result = 0;\n" +
    "  \n" +
    "  // Apply distortion if enabled\n" +
    "  if (distortionOn) {\n" +
    "    if (aniStyle >= 2) {\n" +
    "      // 2-way random mode\n" +
    "      // Use seedRandom for consistent randomization\n" +
    "      seedRandom(seedRandom + idx);\n" +
    "      \n" +
    "      // Generate random distortion value within range -70 to 70\n" +
    "      var randomDistortion = random(-70, 70);\n" +
    "      \n" +
    "      // Apply selector value for animation\n" +
    "      result = randomDistortion * selectorValue;\n" +
    "    } else {\n" +
    "      // Single mode - use manual value\n" +
    "      result = addDistortion * selectorValue;\n" +
    "    }\n" +
    "  }\n" +
    "  \n" +
    "  result;\n" +
    "}";
}

/**
 * Gets the optimized wiggle position expression template
 * @returns {String} The template expression
 */
function getWigglePositionTemplate() {
  return (
    "// Wiggle Position expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    'var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  [0, 0];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var freq = ctrlLayer.effect("Fluc/Sec")("Point");\n' +
    '  var amp = ctrlLayer.effect("Wiggle Position")("Point");\n' +
    '  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");\n' +
    '  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");\n' +
    '  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");\n' +
    "  \n" +
    "  // Apply posterize time for performance\n" +
    "  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\n" +
    "  \n" +
    "  // Get text index for character-specific timing\n" +
    "  var idx = textIndex;\n" +
    "  \n" +
    "  // Calculate character-specific time offset\n" +
    "  var timeOffset = idx * thisComp.frameDuration * 0.1;\n" +
    "  \n" +
    "  // Current time with offset\n" +
    "  var currentTime = time + timeOffset;\n" +
    "  \n" +
    "  // Character-specific seed\n" +
    "  var characterSeed = seed + idx;\n"
  );

  // Apply smooth wiggle or standard wiggle based on setting
  if (smooth) {
    // Smooth wiggle using sine waves for natural motion
    seedRandom(characterSeed);
    var randomPhase = random(0, Math.PI * 2);
    var x =
      Math.sin(currentTime * freq[0] * Math.PI * 2 + randomPhase) * amp[0];
    var y =
      Math.sin(
        currentTime * freq[1] * Math.PI * 2 + randomPhase + Math.PI / 2
      ) * amp[1];
    [x, y];
  } else {
    // Standard wiggle with character-specific timing and seed
    seedRandom(characterSeed);
    [
      wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],
      wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1],
    ];
  }
}

/**
 * Gets the optimized wiggle scale expression template
 * @returns {String} The template expression
 */
function getWiggleScaleTemplate() {
  return;
  "// Wiggle Scale expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    'var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  [100, 100];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var freq = ctrlLayer.effect("Fluc/Sec")("Point");\n' +
    '  var amp = ctrlLayer.effect("Wiggle Scale")("Point");\n' +
    '  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");\n' +
    '  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");\n' +
    '  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");\n' +
    "  \n" +
    "  // Apply posterize time for performance\n" +
    "  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\n" +
    "  \n" +
    "  // Get text index for character-specific timing\n" +
    "  var idx = textIndex;\n" +
    "  \n" +
    "  // Calculate character-specific time offset\n" +
    "  var timeOffset = idx * thisComp.frameDuration * 0.1;\n" +
    "  \n" +
    "  // Current time with offset\n" +
    "  var currentTime = time + timeOffset;\n" +
    "  \n" +
    "  // Character-specific seed\n" +
    "  var characterSeed = seed + idx;\n" +
    "  \n" +
    "  // Base scale value (100%)\n" +
    "  var baseScale = [100, 100];\n" +
    "  \n" +
    "  // Apply smooth wiggle or standard wiggle based on setting\n" +
    "  if (smooth) {\n" +
    "    // Smooth wiggle using sine waves for natural motion\n" +
    "    seedRandom(characterSeed);\n" +
    "    var randomPhase = random(0, Math.PI * 2);\n" +
    "    var x = Math.sin(currentTime * freq[0] * Math.PI * 2 + randomPhase) * amp[0];\n" +
    "    var y = Math.sin(currentTime * freq[1] * Math.PI * 2 + randomPhase + Math.PI/2) * amp[1];\n" +
    "    [baseScale[0] + x, baseScale[1] + y];\n" +
    "  } else {\n" +
    "    // Standard wiggle with character-specific timing and seed\n" +
    "    seedRandom(characterSeed);\n" +
    "    [\n" +
    "      baseScale[0] + wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],\n" +
    "      baseScale[1] + wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1]\n" +
    "    ];\n" +
    "  }\n" +
    "}";
}

/**
 * Gets the optimized wiggle rotation expression template
 * @returns {String} The template expression
 */
function getWiggleRotationTemplate() {
  return;
  "// Wiggle Rotation expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    'var ctrlLayer = thisComp.layer("${CONTROL_LAYER}");\n' +
    'var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");\n' +
    'var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");\n' +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    '  var freq = ctrlLayer.effect("Fluc/Sec")("Point")[0]; // Use X frequency for rotation\n' +
    '  var amp = ctrlLayer.effect("Wiggle Rotation")("Slider");\n' +
    '  var seed = ctrlLayer.effect("Wiggle Seed")("Slider");\n' +
    '  var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");\n' +
    '  var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");\n' +
    "  \n" +
    "  // Apply posterize time for performance\n" +
    "  posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\n" +
    "  \n" +
    "  // Get text index for character-specific timing\n" +
    "  var idx = textIndex;\n" +
    "  \n" +
    "  // Calculate character-specific time offset\n" +
    "  var timeOffset = idx * thisComp.frameDuration * 0.1;\n" +
    "  \n" +
    "  // Current time with offset\n" +
    "  var currentTime = time + timeOffset;\n" +
    "  \n" +
    "  // Character-specific seed\n" +
    "  var characterSeed = seed + idx;\n" +
    "  \n" +
    "  // Apply smooth wiggle or standard wiggle based on setting\n" +
    "  if (smooth) {\n" +
    "    // Smooth wiggle using sine waves for natural motion\n" +
    "    seedRandom(characterSeed);\n" +
    "    var randomPhase = random(0, Math.PI * 2);\n" +
    "    Math.sin(currentTime * freq * Math.PI * 2 + randomPhase) * amp;\n" +
    "  } else {\n" +
    "    // Standard wiggle with character-specific timing and seed\n" +
    "    seedRandom(characterSeed);\n" +
    "    wiggle(freq, amp, 1, 0.5, currentTime);\n" +
    "  }\n" +
    "}";
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
      var cachingCode =
        'var ctrlLayer = thisComp.layer("' + layerName + '");\n';

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
    var earlyExitCode =
      "\n// Early exit if disabled\n" +
      "if (!globalEnable) {\n" +
      "  " +
      getDefaultValueForExpression(expression) +
      ";\n" +
      "} else {\n";

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
    if (
      expression.indexOf("var d = ") === -1 &&
      expression.indexOf("delay * thisComp.frameDuration * (textIndex - 1)") !==
        -1
    ) {
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
  } else if (
    expression.indexOf("opacity") !== -1 ||
    expression.indexOf("Opacity") !== -1
  ) {
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
function createOptimizedExpression(
  propertyType,
  controlLayerName,
  additionalParams
) {
  // Get the expression template
  var template = createExpressionFromTemplate(
    propertyType,
    controlLayerName,
    additionalParams
  );

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
    getDefaultValueForPropertyType: getDefaultValueForPropertyType,
  };
}
