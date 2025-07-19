//@target aftereffects

/**
 * TextSelector_Wiggle.jsx
 * Advanced wiggle controller module for the Text Selector Modular System
 * Manages comprehensive wiggle effects with smooth motion capabilities
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * Creates wiggle controls on the specified control layer
 * @param {Layer} controlLayer - The control layer to add effects to
 * @returns {Boolean} Success status
 */
function createWiggleController(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Wiggle master group
    var wiggleGroup = controlLayer.Effects.addProperty("ADBE Group");
    wiggleGroup.name = "Wiggle Controls";

    // Create Wiggle Add checkbox (master toggle)
    var wiggleAdd = wiggleGroup.addProperty("ADBE Checkbox Control");
    wiggleAdd.name = "Wiggle Add";
    wiggleAdd.property("ADBE Checkbox Control-0").setValue(0); // Default off

    // Create Fluc/Sec point control for X/Y frequencies
    var flucSec = wiggleGroup.addProperty("ADBE Point Control");
    flucSec.name = "Fluc/Sec";
    flucSec.property("ADBE Point Control-0").setValue([2, 2]); // Default 2Hz for both X and Y

    // Create Wiggle Position amplitude control
    var wigglePosition = wiggleGroup.addProperty("ADBE Point Control");
    wigglePosition.name = "Wiggle Position";
    wigglePosition.property("ADBE Point Control-0").setValue([10, 10]); // Default 10px amplitude

    // Create Wiggle Scale amplitude control
    var wiggleScale = wiggleGroup.addProperty("ADBE Point Control");
    wiggleScale.name = "Wiggle Scale";
    wiggleScale.property("ADBE Point Control-0").setValue([5, 5]); // Default 5% scale wiggle

    // Create Wiggle Rotation amplitude control
    var wiggleRotation = wiggleGroup.addProperty("ADBE Slider Control");
    wiggleRotation.name = "Wiggle Rotation";
    wiggleRotation.property("ADBE Slider Control-0").setValue(15); // Default 15 degrees
    wiggleRotation
      .property("ADBE Slider Control-0")
      .setPropertyParameters([-360, 360]);

    // Create Wiggle Distortion amplitude control
    var wiggleDistortion = wiggleGroup.addProperty("ADBE Slider Control");
    wiggleDistortion.name = "Wiggle Distortion";
    wiggleDistortion.property("ADBE Slider Control-0").setValue(10); // Default 10 units
    wiggleDistortion
      .property("ADBE Slider Control-0")
      .setPropertyParameters([-100, 100]);

    // Create Wiggle Seed slider for consistent randomization
    var wiggleSeed = wiggleGroup.addProperty("ADBE Slider Control");
    wiggleSeed.name = "Wiggle Seed";
    wiggleSeed
      .property("ADBE Slider Control-0")
      .setValue(Math.floor(Math.random() * 1000) + 1); // Random default 1-1000
    wiggleSeed
      .property("ADBE Slider Control-0")
      .setPropertyParameters([1, 1000]);

    // Create Smooth Wiggle checkbox for sine wave calculations
    var smoothWiggle = wiggleGroup.addProperty("ADBE Checkbox Control");
    smoothWiggle.name = "Smooth Wiggle";
    smoothWiggle.property("ADBE Checkbox Control-0").setValue(0); // Default off

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createWiggleController",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createWiggleController: " + error.toString());
    }
    return false;
  }
}

/**
 * Applies wiggle expressions to a text layer
 * @param {Layer} textLayer - The text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} Success status
 */
function applyWiggleExpressions(textLayer, controlLayerName) {
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

    // Apply wiggle position expression
    var wigglePositionExpression =
      generateWigglePositionExpression(controlLayerName);
    // Apply to text animator position property

    // Apply wiggle scale expression
    var wiggleScaleExpression = generateWiggleScaleExpression(controlLayerName);
    // Apply to text animator scale property

    // Apply wiggle rotation expression
    var wiggleRotationExpression =
      generateWiggleRotationExpression(controlLayerName);
    // Apply to text animator rotation property

    // Apply wiggle distortion expression
    var wiggleDistortionExpression =
      generateWiggleDistortionExpression(controlLayerName);
    // Apply to text animator skew property

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "applyWiggleExpressions",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in applyWiggleExpressions: " + error.toString());
    }
    return false;
  }
}

/**
 * Generates wiggle position expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Wiggle position expression
 */
function generateWigglePositionExpression(controlLayerName) {
  var expressionCode =
    "// Wiggle Position expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "var wiggleEnabled = ctrlLayer.effect(\"Wiggle Add\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  [0, 0];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var freq = ctrlLayer.effect(\"Fluc/Sec\")(\"Point\");\n" +
    "  var amp = ctrlLayer.effect(\"Wiggle Position\")(\"Point\");\n" +
    "  var seed = ctrlLayer.effect(\"Wiggle Seed\")(\"Slider\");\n" +
    "  var smooth = ctrlLayer.effect(\"Smooth Wiggle\")(\"Checkbox\");\n" +
    "  var posti = ctrlLayer.effect(\"Posterize(0=FPS)\")(\"Slider\");\n" +
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
    "    var x = Math.sin(currentTime * freq[0] * Math.PI * 2 + randomPhase) * amp[0];\n" +
    "    var y = Math.sin(currentTime * freq[1] * Math.PI * 2 + randomPhase + Math.PI/2) * amp[1];\n" +
    "    [x, y];\n" +
    "  } else {\n" +
    "    // Standard wiggle with character-specific timing and seed\n" +
    "    seedRandom(characterSeed);\n" +
    "    wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],\n" +
    "    wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1]\n" +
    "  }\n" +
    "}";

  return generateSafeExpression(expressionCode, "[0, 0]");
}

/**
 * Generates wiggle scale expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Wiggle scale expression
 */
function generateWiggleScaleExpression(controlLayerName) {
  var expressionCode =
    "// Wiggle Scale expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "var wiggleEnabled = ctrlLayer.effect(\"Wiggle Add\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  [100, 100];\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var freq = ctrlLayer.effect(\"Fluc/Sec\")(\"Point\");\n" +
    "  var amp = ctrlLayer.effect(\"Wiggle Scale\")(\"Point\");\n" +
    "  var seed = ctrlLayer.effect(\"Wiggle Seed\")(\"Slider\");\n" +
    "  var smooth = ctrlLayer.effect(\"Smooth Wiggle\")(\"Checkbox\");\n" +
    "  var posti = ctrlLayer.effect(\"Posterize(0=FPS)\")(\"Slider\");\n" +
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

  return generateSafeExpression(expressionCode, "[100, 100]");
}

/**
 * Generates wiggle rotation expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Wiggle rotation expression
 */
function generateWiggleRotationExpression(controlLayerName) {
  var expressionCode =
    "// Wiggle Rotation expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "var wiggleEnabled = ctrlLayer.effect(\"Wiggle Add\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var freq = ctrlLayer.effect(\"Fluc/Sec\")(\"Point\")[0]; // Use X frequency for rotation\n" +
    "  var amp = ctrlLayer.effect(\"Wiggle Rotation\")(\"Slider\");\n" +
    "  var seed = ctrlLayer.effect(\"Wiggle Seed\")(\"Slider\");\n" +
    "  var smooth = ctrlLayer.effect(\"Smooth Wiggle\")(\"Checkbox\");\n" +
    "  var posti = ctrlLayer.effect(\"Posterize(0=FPS)\")(\"Slider\");\n" +
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

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Generates wiggle distortion expression for text animator
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Wiggle distortion expression
 */
function generateWiggleDistortionExpression(controlLayerName) {
  var expressionCode =
    "// Wiggle Distortion expression for TextSelector\n" +
    "// Cache control layer reference\n" +
    "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");\n" +
    "var globalEnable = ctrlLayer.effect(\"Global Enable\")(\"Checkbox\");\n" +
    "var wiggleEnabled = ctrlLayer.effect(\"Wiggle Add\")(\"Checkbox\");\n" +
    "\n" +
    "// Early exit if disabled\n" +
    "if (!globalEnable || !wiggleEnabled) {\n" +
    "  0;\n" +
    "} else {\n" +
    "  // Cache effect references\n" +
    "  var freq = ctrlLayer.effect(\"Fluc/Sec\")(\"Point\")[0]; // Use X frequency for distortion\n" +
    "  var amp = ctrlLayer.effect(\"Wiggle Distortion\")(\"Slider\");\n" +
    "  var seed = ctrlLayer.effect(\"Wiggle Seed\")(\"Slider\");\n" +
    "  var smooth = ctrlLayer.effect(\"Smooth Wiggle\")(\"Checkbox\");\n" +
    "  var posti = ctrlLayer.effect(\"Posterize(0=FPS)\")(\"Slider\");\n" +
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

  return generateSafeExpression(expressionCode, "0");
}

/**
 * Creates text animator with wiggle properties
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
    var animatorName = "TextSelector Wiggle";
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

    // Add Position property if it doesn't exist
    if (!animatorProps.property("ADBE Text Position 3D")) {
      var positionProp = animatorProps.addProperty("ADBE Text Position 3D");
      positionProp.expression =
        generateWigglePositionExpression(controlLayerName);
    }

    // Add Scale property if it doesn't exist
    if (!animatorProps.property("ADBE Text Scale")) {
      var scaleProp = animatorProps.addProperty("ADBE Text Scale");
      scaleProp.expression = generateWiggleScaleExpression(controlLayerName);
    }

    // Add Rotation property if it doesn't exist
    if (!animatorProps.property("ADBE Text Rotation")) {
      var rotationProp = animatorProps.addProperty("ADBE Text Rotation");
      rotationProp.expression =
        generateWiggleRotationExpression(controlLayerName);
    }

    // Add Skew property if it doesn't exist
    if (!animatorProps.property("ADBE Text Skew")) {
      var skewProp = animatorProps.addProperty("ADBE Text Skew");
      skewProp.expression =
        generateWiggleDistortionExpression(controlLayerName);
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
      errorHandler.logError(error, "createWiggleAnimator", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createWiggleAnimator: " + error.toString());
    }
    return false;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createWiggleController: createWiggleController,
    applyWiggleExpressions: applyWiggleExpressions,
    generateWigglePositionExpression: generateWigglePositionExpression,
    generateWiggleScaleExpression: generateWiggleScaleExpression,
    generateWiggleRotationExpression: generateWiggleRotationExpression,
    generateWiggleDistortionExpression: generateWiggleDistortionExpression,
    createWiggleAnimator: createWiggleAnimator,
  };
}
