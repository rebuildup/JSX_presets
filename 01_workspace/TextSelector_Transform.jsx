//@target aftereffects

/**
 * TextSelector_Transform.jsx
 * Transform controller module for the Text Selector Modular System
 * Manages scale, rotation, and distortion transformations
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * Creates transform controls on the specified control layer
 * @param {Layer} controlLayer - The control layer to add effects to
 * @returns {Boolean} Success status
 */
function createTransformController(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Scale controls
    var scaleGroup = controlLayer.Effects.addProperty("ADBE Group");
    scaleGroup.name = "Scale Controls";

    var addScale = scaleGroup.addProperty("ADBE Point Control");
    addScale.name = "Add Scale";
    addScale.property("ADBE Point Control-0").setValue([0, 0]);

    var scaleOn = scaleGroup.addProperty("ADBE Checkbox Control");
    scaleOn.name = "Scale : ON";
    scaleOn.property("ADBE Checkbox Control-0").setValue(1);

    // Create Rotation controls
    var rotationGroup = controlLayer.Effects.addProperty("ADBE Group");
    rotationGroup.name = "Rotation Controls";

    var addRotation = rotationGroup.addProperty("ADBE Slider Control");
    addRotation.name = "Add Rotation";
    addRotation.property("ADBE Slider Control-0").setValue(0);
    addRotation
      .property("ADBE Slider Control-0")
      .setPropertyParameters([-360, 360]);

    var rotationOn = rotationGroup.addProperty("ADBE Checkbox Control");
    rotationOn.name = "Rotation : ON";
    rotationOn.property("ADBE Checkbox Control-0").setValue(1);

    // Create Distortion controls
    var distortionGroup = controlLayer.Effects.addProperty("ADBE Group");
    distortionGroup.name = "Distortion Controls";

    var addDistortion = distortionGroup.addProperty("ADBE Slider Control");
    addDistortion.name = "Add Distortion";
    addDistortion.property("ADBE Slider Control-0").setValue(0);
    addDistortion
      .property("ADBE Slider Control-0")
      .setPropertyParameters([-100, 100]);

    var addDisAxis = distortionGroup.addProperty("ADBE Slider Control");
    addDisAxis.name = "Add Dis-Axis";
    addDisAxis.property("ADBE Slider Control-0").setValue(0);
    addDisAxis
      .property("ADBE Slider Control-0")
      .setPropertyParameters([-100, 100]);

    var distortionOn = distortionGroup.addProperty("ADBE Checkbox Control");
    distortionOn.name = "Distortion : ON";
    distortionOn.property("ADBE Checkbox Control-0").setValue(1);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createTransformController",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createTransformController: " + error.toString());
    }
    return false;
  }
}

/**
 * Applies transform expressions to a text layer
 * @param {Layer} textLayer - The text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function applyTransformExpressions(textLayer, controlLayerName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate parameters
    errorHandler.validateLayer(textLayer);
    errorHandler.validateParameter(
      controlLayerName,
      "controlLayerName",
      function (val) {
        return val && typeof val === "string";
      }
    );

    // Apply scale expression
    var scaleExpression = generateScaleExpression(controlLayerName);
    // Apply to text animator scale property

    // Apply rotation expression
    var rotationExpression = generateRotationExpression(controlLayerName);
    // Apply to text animator rotation property

    // Apply distortion expression
    var distortionExpression = generateDistortionExpression(controlLayerName);
    var distortionAxisExpression =
      generateDistortionAxisExpression(controlLayerName);
    // Apply to text animator skew and skew axis properties

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "applyTransformExpressions",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in applyTransformExpressions: " + error.toString());
    }
    return false;
  }
}

/**
 * Generates scale expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Scale expression
 */
function generateScaleExpression(controlLayerName) {
  var expressionCode =
    "// Scale expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  [100, 100];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var scaleOn = ctrlLayer.effect(\"Scale : ON\")(\"Checkbox\");\n" +
    "  var addScale = ctrlLayer.effect(\"Add Scale\")(\"Point\");\n" +
    "  var aniStyle = ctrlLayer.effect(\"Ani - Style\")(\"Slider\");\n" +
    "  var seedRandom = ctrlLayer.effect(\"SeedRandom\")(\"Slider\");\n" +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    "  var selectorValue = effect(\"Selector\").value;\n" +
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

  return generateSafeExpression(expressionCode, "[100, 100]");
}

/**
 * Generates rotation expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Rotation expression
 */
function generateRotationExpression(controlLayerName) {
  var expressionCode =
    "// Rotation expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var rotationOn = ctrlLayer.effect(\"Rotation : ON\")(\"Checkbox\");\n" +
    "  var addRotation = ctrlLayer.effect(\"Add Rotation\")(\"Slider\");\n" +
    "  var aniStyle = ctrlLayer.effect(\"Ani - Style\")(\"Slider\");\n" +
    "  var seedRandom = ctrlLayer.effect(\"SeedRandom\")(\"Slider\");\n" +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    "  var selectorValue = effect(\"Selector\").value;\n" +
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

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Generates distortion (skew) expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Distortion expression
 */
function generateDistortionExpression(controlLayerName) {
  var expressionCode =
    "// Distortion expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var distortionOn = ctrlLayer.effect(\"Distortion : ON\")(\"Checkbox\");\n" +
    "  var addDistortion = ctrlLayer.effect(\"Add Distortion\")(\"Slider\");\n" +
    "  var aniStyle = ctrlLayer.effect(\"Ani - Style\")(\"Slider\");\n" +
    "  var seedRandom = ctrlLayer.effect(\"SeedRandom\")(\"Slider\");\n" +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    "  var selectorValue = effect(\"Selector\").value;\n" +
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

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Generates distortion axis expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Distortion axis expression
 */
function generateDistortionAxisExpression(controlLayerName) {
  var expressionCode =
    "// Distortion Axis expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var distortionOn = ctrlLayer.effect(\"Distortion : ON\")(\"Checkbox\");\n" +
    "  var addDisAxis = ctrlLayer.effect(\"Add Dis-Axis\")(\"Slider\");\n" +
    "  var aniStyle = ctrlLayer.effect(\"Ani - Style\")(\"Slider\");\n" +
    "  var seedRandom = ctrlLayer.effect(\"SeedRandom\")(\"Slider\");\n" +
    "  \n" +
    "  // Get text index and selector value\n" +
    "  var idx = textIndex;\n" +
    "  var selectorValue = effect(\"Selector\").value;\n" +
    "  \n" +
    "  // Initialize result\n" +
    "  var result = 0;\n" +
    "  \n" +
    "  // Apply distortion axis if enabled\n" +
    "  if (distortionOn) {\n" +
    "    if (aniStyle >= 2) {\n" +
    "      // 2-way random mode\n" +
    "      // Use seedRandom for consistent randomization\n" +
    "      seedRandom(seedRandom + idx);\n" +
    "      \n" +
    "      // Generate random distortion axis value within range -70 to 70\n" +
    "      var randomDisAxis = random(-70, 70);\n" +
    "      \n" +
    "      // Apply selector value for animation\n" +
    "      result = randomDisAxis * selectorValue;\n" +
    "    } else {\n" +
    "      // Single mode - use manual value\n" +
    "      result = addDisAxis * selectorValue;\n" +
    "    }\n" +
    "  }\n" +
    "  \n" +
    "  result;\n" +
    "}";

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Creates text animator with transform properties
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
    errorHandler.validateParameter(
      controlLayerName,
      "controlLayerName",
      function (val) {
        return val && typeof val === "string";
      }
    );

    // Check if layer is a text layer
    if (!isTextLayer(textLayer)) {
      throw new Error("Layer is not a text layer");
    }

    // Get text property
    var textProp = textLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document");

    // Create animator if it doesn't exist
    var animatorName = "TextSelector Transform";
    var animator = null;

    // Check if animator already exists
    var textAnimators = textLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Animators");
    for (var i = 1; i <= textAnimators.numProperties; i++) {
      if (textAnimators.property(i).name === animatorName) {
        animator = textAnimators.property(i);
        break;
      }
    }

    // Create new animator if it doesn't exist
    if (!animator) {
      animator = textAnimators.addProperty("ADBE Text Animator");
      animator.name = animatorName;
    }

    // Add properties to animator
    var animatorProps = animator.property("ADBE Text Animator Properties");

    // Add Scale property if it doesn't exist
    if (!animatorProps.property("ADBE Text Scale")) {
      var scaleProp = animatorProps.addProperty("ADBE Text Scale");
      scaleProp.expression = generateScaleExpression(controlLayerName);
    }

    // Add Rotation property if it doesn't exist
    if (!animatorProps.property("ADBE Text Rotation")) {
      var rotationProp = animatorProps.addProperty("ADBE Text Rotation");
      rotationProp.expression = generateRotationExpression(controlLayerName);
    }

    // Add Skew property if it doesn't exist
    if (!animatorProps.property("ADBE Text Skew")) {
      var skewProp = animatorProps.addProperty("ADBE Text Skew");
      skewProp.expression = generateDistortionExpression(controlLayerName);
    }

    // Add Skew Axis property if it doesn't exist
    if (!animatorProps.property("ADBE Text Skew Axis")) {
      var skewAxisProp = animatorProps.addProperty("ADBE Text Skew Axis");
      skewAxisProp.expression =
        generateDistortionAxisExpression(controlLayerName);
    }

    // Add selector if it doesn't exist
    var selectors = animator.property("ADBE Text Selectors");
    if (selectors.numProperties === 0) {
      var selector = selectors.addProperty("ADBE Text Selector");
      selector.name = "Selector";

      // Configure selector
      var selectorProps = selector.property("ADBE Text Selector Properties");
      var expressionSelector = selectorProps.property(
        "ADBE Text Percent Start"
      );
      expressionSelector.expression = "0";

      var endSelector = selectorProps.property("ADBE Text Percent End");
      endSelector.expression = "100";

      // Add expression selector
      var expressionSelector = selectors.addProperty(
        "ADBE Text Expressible Selector"
      );
      expressionSelector.name = "Expression Selector";
      expressionSelector.property("ADBE Text Expressible Amount").expression =
        "textIndex / textTotal";
    }

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createTransformAnimator",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createTransformAnimator: " + error.toString());
    }
    return false;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTransformController: createTransformController,
    applyTransformExpressions: applyTransformExpressions,
    generateScaleExpression: generateScaleExpression,
    generateRotationExpression: generateRotationExpression,
    generateDistortionExpression: generateDistortionExpression,
    generateDistortionAxisExpression: generateDistortionAxisExpression,
    createTransformAnimator: createTransformAnimator,
  };
}
