//@target aftereffects
//@include "TextSelector_Core.jsx"
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * TextSelector_Animation.jsx
 * Animation controller module for the Text Selector Modular System
 * Version: 2.0.1
 */

/**
 * Create the animation controller with all necessary controls
 * @param {Layer} controlLayer - Control layer to add effects to
 * @returns {Object|null} Object with created controls or null if failed
 */
function createAnimationController(controlLayer) {
  // Begin undo group for the entire operation
  app.beginUndoGroup("Create Animation Controller");

  var errorHandler = createErrorHandler();

  return errorHandler
    .safeExecute(
      function () {
        // Animation Keyframe Controller (0-100 range)
        var animationSlider = createSliderControl(
          controlLayer,
          "Animation",
          0,
          0,
          100
        );

        // Delay Control (0-2 seconds range)
        var delaySlider = createSliderControl(controlLayer, "Delay", 0.1, 0, 2);

        // Ani - Style Control (1: Single, 2: 2-way XY, 3: 2-way YX)
        var styleSlider = createSliderControl(
          controlLayer,
          "Ani - Style",
          1,
          1,
          3
        );
        styleSlider.comment = "1: Single, 2: 2-way XY, 3: 2-way YX";

        // Posterize Control (0 = use comp FPS, >0 = custom FPS)
        var posterizeSlider = createSliderControl(
          controlLayer,
          "Posterize(0=FPS)",
          0,
          0,
          30
        );
        posterizeSlider.comment = "0 = Comp FPS, >0 = Custom FPS";

        return {
          animation: animationSlider,
          delay: delaySlider,
          style: styleSlider,
          posterize: posterizeSlider,
        };
      },
      null,
      "createAnimationController"
    )
    .finally(function () {
      app.endUndoGroup();
    });
}

/**
 * Apply animation expressions to a text layer
 * @param {Layer} textLayer - Text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} True if successful
 */
function applyAnimationExpressions(textLayer, controlLayerName) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Validate text layer
      if (!textLayer || !textLayer.property("ADBE Text Properties")) {
        alert("Selected layer is not a text layer");
        return false;
      }

      // Add text animator if not exists
      var textProp = textLayer.property("ADBE Text Properties");
      var animator1 = textProp
        .property("ADBE Text Animators")
        .addProperty("ADBE Text Animator");
      animator1.name = "TextSelector Position";

      // Add position property to animator
      var positionProp = animator1
        .property("ADBE Text Animator Properties")
        .addProperty("ADBE Text Position 3D");

      // Add range selector
      var rangeSelector = animator1
        .property("ADBE Text Selectors")
        .addProperty("ADBE Text Selector");

      // Apply expressions to range selector
      var startProp = rangeSelector.property("ADBE Text Percent Start");
      var endProp = rangeSelector.property("ADBE Text Percent End");
      var offsetProp = rangeSelector.property("ADBE Text Percent Offset");

      // Position Y Expression
      var posYExpression = generatePositionYExpression(controlLayerName);
      startProp.expression = posYExpression;

      // Set end to 100%
      endProp.setValue(100);

      return true;
    },
    false,
    "applyAnimationExpressions"
  );
}

/**
 * Generate optimized Position Y expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generatePositionYExpression(controlLayerName) {
  var expressionCode = `
// Optimized Position Y Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    // Cache effect references
    var delay = ctrlLayer.effect("Delay")("Slider");
    var styledp = ctrlLayer.effect("Ani - Style")("Slider");
    var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
    
    // Posterize time optimization
    var frameRate = 1/thisComp.frameDuration;
    var targetFPS = (posti == 0) ? frameRate : posti;
    posterizeTime(targetFPS);
    
    // Calculate delay with style consideration
    var delayMultiplier = (styledp == 2) ? 2 : 1;
    var d = delay * delayMultiplier * thisComp.frameDuration * (textIndex - 1);
    
    // Get animation value with error handling
    var animValue = ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);
    animValue;
    
} catch (err) {
    // Fallback value
    0;
}`;

  return expressionCode;
}

/**
 * Generate optimized Position X expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generatePositionXExpression(controlLayerName) {
  var expressionCode = `
// Optimized Position X Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    var delay = ctrlLayer.effect("Delay")("Slider");
    var styledp = ctrlLayer.effect("Ani - Style")("Slider");
    var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
    
    var frameRate = 1/thisComp.frameDuration;
    var targetFPS = (posti == 0) ? frameRate : posti;
    posterizeTime(targetFPS);
    
    // X position uses style 3 for 2-way
    var delayMultiplier = (styledp == 3) ? 2 : 1;
    var d = delay * delayMultiplier * thisComp.frameDuration * (textIndex - 1);
    
    var animValue = ctrlLayer.effect("Animation")("Slider").valueAtTime(time - d);
    animValue;
    
} catch (err) {
    0;
}`;

  return expressionCode;
}

/**
 * Generate optimized 2-Way Randomizer expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generate2WayRandomizerExpression(controlLayerName) {
  var expressionCode = `
// Optimized 2-Way Randomizer Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    
    // Check if 2-way mode is active
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way) {
        var isEven = (textIndex % 2) == 0;
        isEven ? selectorValue : -selectorValue;
    } else {
        selectorValue;
    }
    
} catch (err) {
    selectorValue;
}`;

  return expressionCode;
}

/**
 * Initialize the animation controller on a control layer
 * @param {CompItem} comp - Composition to work with
 * @returns {Object|null} Created animation controller or null if failed
 */
function initializeAnimationController(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find or create control layer
      var controlLayer = findOrCreateControlLayer(comp);
      if (!controlLayer) {
        throw new Error("Failed to find or create control layer");
      }

      // Create animation controller
      return createAnimationController(controlLayer);
    },
    null,
    "initializeAnimationController"
  );
}

/**
 * Apply animation to selected text layers
 * @param {CompItem} comp - Composition to work with
 * @returns {Boolean} True if successful
 */
function applyAnimationToSelectedLayers(comp) {
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
      app.beginUndoGroup("Apply TextSelector Animation");

      var success = true;
      for (var i = 0; i < selectedLayers.length; i++) {
        if (!applyAnimationExpressions(selectedLayers[i], controlLayer.name)) {
          success = false;
        }
      }

      app.endUndoGroup();

      if (success) {
        alert(
          "Animation applied to " + selectedLayers.length + " text layer(s)"
        );
      } else {
        alert("Some errors occurred while applying animation");
      }

      return success;
    },
    false,
    "applyAnimationToSelectedLayers"
  );
}

// Export animation functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createAnimationController: createAnimationController,
    applyAnimationExpressions: applyAnimationExpressions,
    generatePositionYExpression: generatePositionYExpression,
    generatePositionXExpression: generatePositionXExpression,
    generate2WayRandomizerExpression: generate2WayRandomizerExpression,
    initializeAnimationController: initializeAnimationController,
    applyAnimationToSelectedLayers: applyAnimationToSelectedLayers,
  };
}
