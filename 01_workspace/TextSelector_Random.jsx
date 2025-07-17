//@target aftereffects
//@include "TextSelector_Core.jsx"
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * TextSelector_Random.jsx
 * Randomization system module for the Text Selector Modular System
 * Version: 2.0.1
 */

/**
 * Create the randomization system with seed management
 * @param {Layer} controlLayer - Control layer to add effects to
 * @returns {Object|null} Object with created controls or null if failed
 */
function createRandomizationSystem(controlLayer) {
  // Begin undo group for the entire operation
  app.beginUndoGroup("Create Randomization System");

  var errorHandler = createErrorHandler();

  return errorHandler
    .safeExecute(
      function () {
        // Create effect group for organization
        var randomGroup = createEffectGroup(controlLayer, EFFECT_NAMES.RANDOM);

        // SeedRandom slider (0-1000 range)
        var seedRandom = createSliderControl(
          controlLayer,
          "SeedRandom",
          Math.floor(Math.random() * 1000),
          0,
          1000
        );
        seedRandom.comment = "Random seed value for consistent randomization";

        // 2-way Randomize Info
        var randomizeInfo = addInfoText(
          randomGroup,
          "2-way Randomize",
          "Alternates values based on character index"
        );

        return {
          seed: seedRandom,
          info: randomizeInfo,
        };
      },
      null,
      "createRandomizationSystem"
    )
    .finally(function () {
      app.endUndoGroup();
    });
}

/**
 * Apply randomization expressions to a text layer
 * @param {Layer} textLayer - Text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} True if successful
 */
function applyRandomExpressions(textLayer, controlLayerName) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Validate text layer
      if (!textLayer || !textLayer.property("ADBE Text Properties")) {
        alert("Selected layer is not a text layer");
        return false;
      }

      // Find existing animators or create new ones
      var textProp = textLayer.property("ADBE Text Properties");
      var animators = textProp.property("ADBE Text Animators");

      // Find position animator or create it
      var positionAnimator = null;
      for (var i = 1; i <= animators.numProperties; i++) {
        if (animators.property(i).name === "TextSelector Position") {
          positionAnimator = animators.property(i);
          break;
        }
      }

      if (!positionAnimator) {
        positionAnimator = animators.addProperty("ADBE Text Animator");
        positionAnimator.name = "TextSelector Position";
        positionAnimator
          .property("ADBE Text Animator Properties")
          .addProperty("ADBE Text Position 3D");
      }

      // Apply 2-way randomizer expression to range selector
      var rangeSelectors = positionAnimator.property("ADBE Text Selectors");
      var rangeSelector = null;

      // Find existing range selector or create new one
      for (var i = 1; i <= rangeSelectors.numProperties; i++) {
        if (rangeSelectors.property(i).matchName === "ADBE Text Selector") {
          rangeSelector = rangeSelectors.property(i);
          break;
        }
      }

      if (!rangeSelector) {
        rangeSelector = rangeSelectors.addProperty("ADBE Text Selector");
      }

      // Apply 2-way randomizer expression to advanced properties
      var advancedProp = rangeSelector.property("ADBE Text Selector Advanced");
      var offsetProp = advancedProp.property("ADBE Text Range Offset");

      // Generate and apply 2-way randomizer expression
      var randomizerExpression =
        generate2WayRandomizerExpression(controlLayerName);
      offsetProp.expression = randomizerExpression;

      return true;
    },
    false,
    "applyRandomExpressions"
  );
}

/**
 * Generate 2-way randomizer expression for position
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generate2WayRandomizerExpression(controlLayerName) {
  var expressionCode = `
// 2-Way Position Randomizer Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    
    // Check if 2-way mode is active
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way) {
        // Set random seed for consistency
        seedRandom(seed + textIndex, true);
        
        // Alternate based on character index
        var isEven = (textIndex % 2) == 0;
        isEven ? selectorValue : -selectorValue;
    } else {
        // Single mode - use normal value
        selectorValue;
    }
    
} catch (err) {
    // Fallback to normal value
    selectorValue;
}`;

  return expressionCode;
}

/**
 * Generate scale randomizer expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateScaleRandomizerExpression(controlLayerName) {
  var expressionCode = `
// Scale Randomizer Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    var scaleEnabled = ctrlLayer.effect("Scale : ON")("Checkbox");
    
    // Check if 2-way mode is active and scale is enabled
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way && scaleEnabled) {
        // Set random seed for consistency
        seedRandom(seed + textIndex + 100, true);
        
        // Alternate based on character index
        var isEven = (textIndex % 2) == 0;
        isEven ? selectorValue : -selectorValue;
    } else {
        // Single mode or disabled - use normal value
        selectorValue;
    }
    
} catch (err) {
    // Fallback to normal value
    selectorValue;
}`;

  return expressionCode;
}

/**
 * Generate rotation randomizer expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateRotationRandomizerExpression(controlLayerName) {
  var expressionCode = `
// Rotation Randomizer Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    var rotationEnabled = ctrlLayer.effect("Rotation : ON")("Checkbox");
    
    // Check if 2-way mode is active and rotation is enabled
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way && rotationEnabled) {
        // Set random seed for consistency
        seedRandom(seed + textIndex + 200, true);
        
        // Alternate based on character index
        var isEven = (textIndex % 2) == 0;
        isEven ? selectorValue : -selectorValue;
    } else {
        // Single mode or disabled - use normal value
        selectorValue;
    }
    
} catch (err) {
    // Fallback to normal value
    selectorValue;
}`;

  return expressionCode;
}

/**
 * Generate distortion randomizer expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateDistortionRandomizerExpression(controlLayerName) {
  var expressionCode = `
// Distortion Randomizer Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    var distortionEnabled = ctrlLayer.effect("Distortion : ON")("Checkbox");
    
    // Check if 2-way mode is active and distortion is enabled
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way && distortionEnabled) {
        // Set random seed for consistency
        seedRandom(seed + textIndex + 300, true);
        
        // Alternate based on character index
        var isEven = (textIndex % 2) == 0;
        isEven ? selectorValue : -selectorValue;
    } else {
        // Single mode or disabled - use normal value
        selectorValue;
    }
    
} catch (err) {
    // Fallback to normal value
    selectorValue;
}`;

  return expressionCode;
}

/**
 * Generate random position values within composition bounds
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateRandomPositionExpression(controlLayerName) {
  var expressionCode = `
// Random Position Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    var prop = ctrlLayer.effect("Ani - Position")("Point");
    
    // Check if 2-way mode is active
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way) {
        // Set random seed for consistency
        seedRandom(seed + textIndex, true);
        
        // Generate random position within composition bounds
        [random(-thisComp.width/2, thisComp.width/2), random(-thisComp.height/2, thisComp.height/2)];
    } else {
        // Single mode - use manual position
        prop;
    }
    
} catch (err) {
    // Fallback to [0,0]
    [0,0];
}`;

  return expressionCode;
}

/**
 * Initialize the randomization system on a control layer
 * @param {CompItem} comp - Composition to work with
 * @returns {Object|null} Created randomization system or null if failed
 */
function initializeRandomizationSystem(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find or create control layer
      var controlLayer = findOrCreateControlLayer(comp);
      if (!controlLayer) {
        throw new Error("Failed to find or create control layer");
      }

      // Create randomization system
      return createRandomizationSystem(controlLayer);
    },
    null,
    "initializeRandomizationSystem"
  );
}

/**
 * Apply randomization to selected text layers
 * @param {CompItem} comp - Composition to work with
 * @returns {Boolean} True if successful
 */
function applyRandomizationToSelectedLayers(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find control layer
      var controlLayer = null;
      for (var i = 1; i <= comp.numLayers; i++) {
        if (comp.layer(i).name === "TextSelector_Controls") {
          controlLayer = comp.layer(i);
          break;
        }
      }

      if (!controlLayer) {
        alert(
          "TextSelector_Controls layer not found. Please initialize the system first."
        );
        return false;
      }

      // Get selected layers
      var selectedLayers = [];
      for (var i = 1; i <= comp.numLayers; i++) {
        if (
          comp.layer(i).selected &&
          comp.layer(i).property("ADBE Text Properties")
        ) {
          selectedLayers.push(comp.layer(i));
        }
      }

      if (selectedLayers.length === 0) {
        alert("Please select at least one text layer");
        return false;
      }

      // Apply expressions to selected layers
      app.beginUndoGroup("Apply TextSelector Randomization");

      var success = true;
      for (var i = 0; i < selectedLayers.length; i++) {
        if (!applyRandomExpressions(selectedLayers[i], controlLayer.name)) {
          success = false;
        }
      }

      app.endUndoGroup();

      if (success) {
        alert(
          "Randomization applied to " + selectedLayers.length + " text layer(s)"
        );
      } else {
        alert("Some errors occurred while applying randomization");
      }

      return success;
    },
    false,
    "applyRandomizationToSelectedLayers"
  );
}

// Export randomization functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createRandomizationSystem: createRandomizationSystem,
    applyRandomExpressions: applyRandomExpressions,
    generate2WayRandomizerExpression: generate2WayRandomizerExpression,
    generateScaleRandomizerExpression: generateScaleRandomizerExpression,
    generateRotationRandomizerExpression: generateRotationRandomizerExpression,
    generateDistortionRandomizerExpression:
      generateDistortionRandomizerExpression,
    generateRandomPositionExpression: generateRandomPositionExpression,
    initializeRandomizationSystem: initializeRandomizationSystem,
    applyRandomizationToSelectedLayers: applyRandomizationToSelectedLayers,
  };
}
