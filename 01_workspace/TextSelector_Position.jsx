//@target aftereffects
//@include "TextSelector_Core.jsx"
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * TextSelector_Position.jsx
 * Position controller module for the Text Selector Modular System
 * Version: 2.0.1
 * 
 * このモジュールはテキストの位置とアンカーポイントを制御します。
 * シングルモードと2-wayモード（XYとYX）をサポートし、
 * 一貫した乱数生成のためのseedRandomを使用します。
 */

/**
 * Create the position controller with position and anchor point management
 * @param {Layer} controlLayer - Control layer to add effects to
 * @returns {Object|null} Object with created controls or null if failed
 */
function createPositionController(controlLayer) {
  // Begin undo group for the entire operation
  app.beginUndoGroup("Create Position Controller");

  try {
    var errorHandler = createErrorHandler();
    
    // Validate input parameter
    errorHandler.validateLayer(controlLayer);
    
    // Create effect group for organization
    var positionGroup = createEffectGroup(controlLayer, EFFECT_NAMES.POSITION);
    
    // Ani - Position (XY point control for manual positioning)
    var aniPosition = createPointControl(
      controlLayer,
      "Ani - Position",
      [0, 0]
    );
    if (aniPosition) {
      aniPosition.comment = "Manual position control for single mode";
    }

    // Text AnkerPoint (anchor point adjustment, default [0, -40])
    var textAnchor = createPointControl(
      controlLayer,
      "Text AnkerPoint",
      [0, -40]
    );
    if (textAnchor) {
      textAnchor.comment = "Anchor point adjustment for text characters";
    }

    return {
      position: aniPosition,
      anchor: textAnchor,
    };
  } catch (err) {
    var errorHandler = createErrorHandler();
    errorHandler.logError(err, "createPositionController", DEBUG_LEVELS.ERROR);
    return null;
  } finally {
    app.endUndoGroup();
  }
}

/**
 * Apply position expressions to a text layer
 * @param {Layer} textLayer - Text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Boolean} True if successful
 */
function applyPositionExpressions(textLayer, controlLayerName) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Validate text layer
      if (!isTextLayer(textLayer)) {
        throw new Error(ERROR_TYPES.VALIDATION_ERROR + ": Selected layer is not a text layer");
      }

      // Find existing position animator or create new one
      var textProp = textLayer.property("ADBE Text Properties");
      var animators = textProp.property("ADBE Text Animators");

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
      }

      // Add position property to animator if it doesn't exist
      var animatorProps = positionAnimator.property(
        "ADBE Text Animator Properties"
      );
      var positionProp = null;

      for (var i = 1; i <= animatorProps.numProperties; i++) {
        if (animatorProps.property(i).matchName === "ADBE Text Position 3D") {
          positionProp = animatorProps.property(i);
          break;
        }
      }

      if (!positionProp) {
        positionProp = animatorProps.addProperty("ADBE Text Position 3D");
      }

      // Add range selector to the position animator
      var selectors = positionAnimator.property("ADBE Text Selectors");
      var rangeSelector = null;
      
      // Check if range selector already exists
      for (var i = 1; i <= selectors.numProperties; i++) {
        if (selectors.property(i).matchName === "ADBE Text Selector") {
          rangeSelector = selectors.property(i);
          break;
        }
      }
      
      if (!rangeSelector) {
        rangeSelector = selectors.addProperty("ADBE Text Selector");
        rangeSelector.name = "TextSelector Range";
        
        // Configure range selector properties for optimal animation
        var selectorProps = rangeSelector.property("ADBE Text Selector Properties");
        
        // Set Start to 0% and End to 100% for full text coverage
        selectorProps.property("ADBE Text Range Start").setValue(0);
        selectorProps.property("ADBE Text Range End").setValue(100);
        
        // Set Offset to 0 as we'll control timing through expressions
        selectorProps.property("ADBE Text Range Offset").setValue(0);
        
        // Set Advanced properties for better control
        var advanced = selectorProps.property("ADBE Text Range Advanced");
        advanced.property("ADBE Text Range Shape").setValue(1); // Square shape for crisp transitions
        advanced.property("ADBE Text Range Smoothness").setValue(0); // No smoothing for precise control
      }

      // Apply position expression
      positionProp.expression = generatePositionExpression(controlLayerName);

      // Apply anchor point expression to the text layer
      var anchorPointProp = textLayer
        .property("ADBE Transform Group")
        .property("ADBE Anchor Point");
      anchorPointProp.expression = generateAnchorPointExpression(controlLayerName);

      return true;
    },
    false,
    "applyPositionExpressions"
  );
}

/**
 * Generate position expression with 2-way and single mode support
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generatePositionExpression(controlLayerName) {
  var expressionCode = `
// Position Expression for TextSelector v2.0
try {
    // Cache effect references for performance optimization
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var aniStyle = ctrlLayer.effect("Ani - Style")("Slider");
    var seed = ctrlLayer.effect("SeedRandom")("Slider");
    var manualPos = ctrlLayer.effect("Ani - Position")("Point");
    var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");
    
    // Early exit if system is disabled
    if (!globalEnable) return [0, 0];
    
    // Check if 2-way mode is active
    var is2Way = (aniStyle == 2 || aniStyle == 3);
    
    if (is2Way) {
        // Set random seed for consistent randomization across renders
        seedRandom(seed + textIndex, true);
        
        // Generate random position within composition bounds
        var maxX = thisComp.width / 4;
        var maxY = thisComp.height / 4;
        
        if (aniStyle == 2) {
            // 2-way XY mode - X varies more than Y
            var x = random(-maxX, maxX);
            var y = random(-maxY/2, maxY/2);
            [x, y];
        } else {
            // 2-way YX mode - Y varies more than X  
            var x = random(-maxX/2, maxX/2);
            var y = random(-maxY, maxY);
            [x, y];
        }
    } else {
        // Single mode - use manual position values from Ani-Position control
        manualPos;
    }
    
} catch (err) {
    // Fallback to safe default position
    [0, 0];
}`;

  return expressionCode;
}

/**
 * Generate anchor point expression
 * @param {String} controlLayerName - Name of the control layer
 * @returns {String} Optimized expression with error handling
 */
function generateAnchorPointExpression(controlLayerName) {
  var expressionCode = `
// Anchor Point Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    var globalEnable = ctrlLayer.effect("Global Enable")("Checkbox");
    
    // Early exit if system is disabled
    if (!globalEnable) return [0, -40];
    
    // Get anchor point adjustment
    var anchorAdjust = ctrlLayer.effect("Text AnkerPoint")("Point");
    
    // Apply adjustment to default anchor point [0,-40]
    [0, -40] + anchorAdjust;
    
} catch (err) {
    // Fallback to default anchor point
    [0, -40];
}`;

  return expressionCode;
}

/**
 * Initialize the position controller on a control layer
 * @param {CompItem} comp - Composition to work with
 * @returns {Object|null} Created position controller or null if failed
 */
function initializePositionController(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find or create control layer
      var controlLayer = findOrCreateControlLayer(comp);
      if (!controlLayer) {
        throw new Error(ERROR_TYPES.INITIALIZATION_ERROR + ": Failed to find or create control layer");
      }

      // Create position controller
      return createPositionController(controlLayer);
    },
    null,
    "initializePositionController"
  );
}

/**
 * Apply position control to selected text layers
 * @param {CompItem} comp - Composition to work with
 * @returns {Boolean} True if successful
 */
function applyPositionToSelectedLayers(comp) {
  var errorHandler = createErrorHandler();

  return errorHandler.safeExecute(
    function () {
      // Find control layer
      var controlLayer = findLayerByName(comp, "TextSelector_Controls");
      if (!controlLayer) {
        throw new Error(ERROR_TYPES.LAYER_NOT_FOUND + ": TextSelector_Controls layer not found. Please initialize the system first.");
      }

      // Get selected layers
      var selectedLayers = getSelectedLayers();
      if (selectedLayers.length === 0) {
        throw new Error(ERROR_TYPES.VALIDATION_ERROR + ": Please select at least one text layer");
      }

      // Filter for text layers only
      var textLayers = [];
      for (var i = 0; i < selectedLayers.length; i++) {
        if (isTextLayer(selectedLayers[i])) {
          textLayers.push(selectedLayers[i]);
        }
      }
      
      if (textLayers.length === 0) {
        throw new Error(ERROR_TYPES.VALIDATION_ERROR + ": No text layers selected");
      }

      // Apply expressions to selected layers
      app.beginUndoGroup("Apply TextSelector Position");

      var success = true;
      for (var i = 0; i < textLayers.length; i++) {
        if (!applyPositionExpressions(textLayers[i], controlLayer.name)) {
          success = false;
        }
      }

      app.endUndoGroup();

      if (success) {
        alert(
          "Position control applied to " +
            textLayers.length +
            " text layer(s)"
        );
      } else {
        alert("Some errors occurred while applying position control");
      }

      return success;
    },
    false,
    "applyPositionToSelectedLayers"
  );
}

/**
 * Test the position controller functionality
 * @returns {Boolean} True if tests pass
 */
function testPositionController() {
  var errorHandler = createErrorHandler();
  
  return errorHandler.safeExecute(
    function() {
      var comp = getActiveComp();
      if (!comp) {
        throw new Error("No active composition");
      }
      
      // Test 1: Create position controller
      var controlLayer = findOrCreateControlLayer(comp);
      var positionControls = createPositionController(controlLayer);
      
      if (!positionControls || !positionControls.position || !positionControls.anchor) {
        throw new Error("Failed to create position controls");
      }
      
      // Test 2: Generate expressions
      var posExpr = generatePositionExpression(controlLayer.name);
      var anchorExpr = generateAnchorPointExpression(controlLayer.name);
      
      if (!posExpr || !anchorExpr) {
        throw new Error("Failed to generate expressions");
      }
      
      alert("Position controller tests passed");
      return true;
    },
    false,
    "testPositionController"
  );
}

// Export position functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createPositionController: createPositionController,
    applyPositionExpressions: applyPositionExpressions,
    generatePositionExpression: generatePositionExpression,
    generateAnchorPointExpression: generateAnchorPointExpression,
    initializePositionController: initializePositionController,
    applyPositionToSelectedLayers: applyPositionToSelectedLayers,
    testPositionController: testPositionController
  };
}