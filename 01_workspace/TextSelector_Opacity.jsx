//@target aftereffects
//@include "TextSelector_Core.jsx"
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * TextSelector_Opacity.jsx
 * Opacity controller module for the Text Selector Modular System
 * Version: 2.0.1
 */

/**
 * Create the opacity controller with auto and manual modes
 * @param {Layer} controlLayer - Control layer to add effects to
 * @returns {Object|null} Object with created controls or null if failed
 */
function createOpacityController(controlLayer) {
  // Begin undo group for the entire operation
  app.beginUndoGroup("Create Opacity Controller");

  var errorHandler = createErrorHandler();

  return errorHandler
    .safeExecute(
      function () {
        // Create effect group for organization
        var opacityGroup = createEffectGroup(
          controlLayer,
          EFFECT_NAMES.OPACITY
        );

        // Opacity - Style (1: Auto, 2: Manual)
        var opacityStyle = createSliderControl(
          controlLayer,
          "Opacity - Style",
          2,
          1,
          2
        );
        opacityStyle.comment = "1: Auto, 2: Manual";

        // Opacity (Manual) - Manual control (0-100 range)
        var opacityManual = createSliderControl(
          controlLayer,
          "Opacity (Manual)",
          100,
          0,
          100
        );
        opacityManual.comment = "Manual opacity control (0-100%)";

        // Opacity Display - Display value (0-100 range)
        var opacityDisplay = createSliderControl(
          controlLayer,
          "Opacity",
          100,
          0,
          100
        );
        opacityDisplay.comment = "Current opacity value (0-100%)";

        return {
          style: opacityStyle,
          manual: opacityManual,
          display: opacityDisplay,
        };
      },
      null,
      "createOpacityController"
    )
    .finally(function () {
      app.endUndoGroup();
    });
}

/**
 * Apply opacity expressions to a text layer
 * @param {Layer} textLayer - Text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} True if successful
 */
function applyOpacityExpressions(textLayer, controlLayerName) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Validate text layer
      if (!textLayer || !textLayer.property("ADBE Text Properties")) {
        alert("Selected layer is not a text layer");
        return false;
      }

      // Add text animator for opacity
      var textProp = textLayer.property("ADBE Text Properties");
      var opacityAnimator = textProp
        .property("ADBE Text Animators")
        .addProperty("ADBE Text Animator");
      opacityAnimator.name = "TextSelector Opacity";

      // Add opacity property to animator
      var opacityProp = opacityAnimator
        .property("ADBE Text Animator Properties")
        .addProperty("ADBE Text Opacity");

      // Add expression selector
      var expressionSelector = opacityAnimator
        .property("ADBE Text Selectors")
        .addProperty("ADBE Text Expression Selector");

      // Apply opacity expression to amount property
      var amountProp = expressionSelector.property(
        "ADBE Text Expression Amount"
      );
      amountProp.expression = generateOpacityExpression(controlLayerName);

      // Apply opacity display expression to the control layer
      var controlLayer = textLayer.containingComp.layer(controlLayerName);
      if (controlLayer) {
        var opacityDisplayEffect = controlLayer.effect("Opacity");
        if (opacityDisplayEffect) {
          var opacityDisplayProp = opacityDisplayEffect.property("Slider");
          opacityDisplayProp.expression =
            generateOpacityDisplayExpression(controlLayerName);
        }
      }

      return true;
    },
    false,
    "applyOpacityExpressions"
  );
}

/**
 * Generate comprehensive opacity expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateOpacityExpression(controlLayerName) {
  var expressionCode =
    "// Comprehensive Opacity Expression for TextSelector v2.0\n" +
    "try {\n" +
    '    var ctrlLayer = thisComp.layer("' +
    controlLayerName +
    '");\n' +
    "    \n" +
    '    var opacityStyle = ctrlLayer.effect("Opacity - Style")("Slider");\n' +
    '    var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");\n' +
    '    var delay = ctrlLayer.effect("Delay")("Slider");\n' +
    "    \n" +
    "    if (opacityStyle == 1) {\n" +
    "        // Auto Mode: Fade in based on frame\n" +
    "        var F = (time - inPoint) / thisComp.frameDuration;\n" +
    "        var autoOpacity = (F <= 0) ? 100 : 0;\n" +
    "        autoOpacity / 100; // Convert to 0-1 range for selector\n" +
    "    } else {\n" +
    "        // Manual Mode: Use manual opacity with delay\n" +
    "        var d = delay * thisComp.frameDuration * (textIndex - 1);\n" +
    '        var manualOpacityValue = ctrlLayer.effect("Opacity (Manual)")("Slider").valueAtTime(time - d);\n' +
    "        \n" +
    "        // Convert to selector value (0-100 to 0-1)\n" +
    "        manualOpacityValue / 100;\n" +
    "    }\n" +
    "    \n" +
    "} catch (err) {\n" +
    "    // Fallback to full opacity\n" +
    "    1;\n" +
    "}";
  return expressionCode;
}

/**
 * Generate opacity display logic expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateOpacityDisplayExpression(controlLayerName) {
  var expressionCode =
    "// Opacity Display Logic Expression for TextSelector v2.0\n" +
    "try {\n" +
    '    var ctrlLayer = thisComp.layer("' +
    controlLayerName +
    '");\n' +
    "    \n" +
    '    var opacityStyle = ctrlLayer.effect("Opacity - Style")("Slider");\n' +
    '    var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");\n' +
    "    \n" +
    "    if (opacityStyle == 1) {\n" +
    "        // Auto Mode: Show calculated opacity\n" +
    "        var F = (time - inPoint) / thisComp.frameDuration;\n" +
    "        var autoOpacity = (F <= 0) ? 100 : 0;\n" +
    "        autoOpacity;\n" +
    "    } else {\n" +
    "        // Manual Mode: Show manual opacity\n" +
    "        opacityManual;\n" +
    "    }\n" +
    "    \n" +
    "} catch (err) {\n" +
    "    // Fallback to 100%\n" +
    "    100;\n" +
    "}";

  return expressionCode;
}

/**
 * Initialize the opacity controller on a control layer
 * @param {CompItem} comp - Composition to work with
 * @returns {Object|null} Created opacity controller or null if failed
 */
function initializeOpacityController(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find or create control layer
      var controlLayer = findOrCreateControlLayer(comp);
      if (!controlLayer) {
        throw new Error("Failed to find or create control layer");
      }

      // Create opacity controller
      return createOpacityController(controlLayer);
    },
    null,
    "initializeOpacityController"
  );
}

/**
 * Apply opacity control to selected text layers
 * @param {CompItem} comp - Composition to work with
 * @returns {Boolean} True if successful
 */
function applyOpacityToSelectedLayers(comp) {
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
      app.beginUndoGroup("Apply TextSelector Opacity");

      var success = true;
      for (var i = 0; i < selectedLayers.length; i++) {
        if (!applyOpacityExpressions(selectedLayers[i], controlLayer.name)) {
          success = false;
        }
      }

      app.endUndoGroup();

      if (success) {
        alert(
          "Opacity control applied to " +
            selectedLayers.length +
            " text layer(s)"
        );
      } else {
        alert("Some errors occurred while applying opacity control");
      }

      return success;
    },
    false,
    "applyOpacityToSelectedLayers"
  );
}

// Export opacity functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createOpacityController: createOpacityController,
    applyOpacityExpressions: applyOpacityExpressions,
    generateOpacityExpression: generateOpacityExpression,
    generateOpacityDisplayExpression: generateOpacityDisplayExpression,
    initializeOpacityController: initializeOpacityController,
    applyOpacityToSelectedLayers: applyOpacityToSelectedLayers,
  };
}
