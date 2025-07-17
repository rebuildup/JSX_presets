//@target aftereffects

/**
 * TextSelector_Main.jsx
 * Master integration and distribution system for the Text Selector Modular System
 * Coordinates all modules and provides comprehensive initialization
 * Version: 2.0.1
 */

// Include all dependencies in proper order
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"
//@include "TextSelector_Core.jsx"
//@include "TextSelector_Animation.jsx"
//@include "TextSelector_Random.jsx"
//@include "TextSelector_Opacity.jsx"
//@include "TextSelector_Position.jsx"
//@include "TextSelector_Transform.jsx"
//@include "TextSelector_Wiggle.jsx"
//@include "TextSelector_Animator.jsx"
//@include "TextSelector_ExpressionOptimizer.jsx"
//@include "TextSelector_PerformanceOptimizer.jsx"
//@include "TextSelector_TestFramework.jsx"

// Global constants
var TEXTSELECTOR_VERSION = "2.0.1";
var TEXTSELECTOR_BUILD_DATE = "2025-07-17";
var TEXTSELECTOR_NAMESPACE = "TextSelector_";
var TEXTSELECTOR_CONTROL_LAYER_NAME = "TextSelector_Controls";

/**
 * Main function to initialize the Text Selector system
 */
function main() {
  // Create error handler
  var errorHandler = createErrorHandler();

  // Manage debugger preference
  var originalDebuggerState = manageDebuggerPreference();

  try {
    // Check for active composition
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      alert("Please select a composition");
      return;
    }

    // Initialize the entire Text Selector system
    var result = initializeTextSelector(comp);
    if (!result.success) {
      alert("Failed to initialize Text Selector system: " + result.error);
      return;
    }

    // Show success message with version info
    alert(
      "Text Selector Modular System v" + TEXTSELECTOR_VERSION + " initialized successfully!\n\n" +
      "Control layer: " + result.controlLayer.name + "\n" +
      "Modules loaded: " + result.modulesLoaded.join(", ")
    );
  } catch (error) {
    errorHandler.logError(error, "Main initialization", DEBUG_LEVELS.ERROR);
    alert("Error initializing Text Selector system: " + error.toString());
  } finally {
    // Restore debugger preference
    restoreDebuggerPreference(originalDebuggerState);
  }
}

/**
 * Comprehensive initialization of the Text Selector system
 * @param {CompItem} comp - The composition to initialize in
 * @returns {Object} Result object with success status, control layer, and modules loaded
 */
function initializeTextSelector(comp) {
  var result = {
    success: false,
    controlLayer: null,
    modulesLoaded: [],
    error: null
  };
  
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate composition
    errorHandler.validateParameter(comp, "comp", function(val) {
      return val && val instanceof CompItem;
    });
    
    // Step 1: Initialize core system
    app.beginUndoGroup("Initialize TextSelector Core");
    var controlLayer = initializeTextSelectorCore(comp);
    if (!controlLayer) {
      throw new Error("Failed to initialize core system");
    }
    result.controlLayer = controlLayer;
    result.modulesLoaded.push("Core");
    app.endUndoGroup();
    
    // Step 2: Initialize animation controller
    app.beginUndoGroup("Initialize TextSelector Animation");
    if (typeof createAnimationController === "function") {
      createAnimationController(controlLayer);
      result.modulesLoaded.push("Animation");
    }
    app.endUndoGroup();
    
    // Step 3: Initialize randomization system
    app.beginUndoGroup("Initialize TextSelector Random");
    if (typeof createRandomizationSystem === "function") {
      createRandomizationSystem(controlLayer);
      result.modulesLoaded.push("Random");
    }
    app.endUndoGroup();
    
    // Step 4: Initialize opacity controller
    app.beginUndoGroup("Initialize TextSelector Opacity");
    if (typeof createOpacityController === "function") {
      createOpacityController(controlLayer);
      result.modulesLoaded.push("Opacity");
    }
    app.endUndoGroup();
    
    // Step 5: Initialize position controller
    app.beginUndoGroup("Initialize TextSelector Position");
    if (typeof createPositionController === "function") {
      createPositionController(controlLayer);
      result.modulesLoaded.push("Position");
    }
    app.endUndoGroup();
    
    // Step 6: Initialize transform controller
    app.beginUndoGroup("Initialize TextSelector Transform");
    if (typeof createTransformController === "function") {
      createTransformController(controlLayer);
      result.modulesLoaded.push("Transform");
    }
    app.endUndoGroup();
    
    // Step 7: Initialize wiggle controller
    app.beginUndoGroup("Initialize TextSelector Wiggle");
    if (typeof createWiggleController === "function") {
      createWiggleController(controlLayer);
      result.modulesLoaded.push("Wiggle");
    }
    app.endUndoGroup();
    
    // Step 8: Set version information
    app.beginUndoGroup("Set TextSelector Version Info");
    setVersionInfo(controlLayer);
    app.endUndoGroup();
    
    // Success!
    result.success = true;
    return result;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "initializeTextSelector", DEBUG_LEVELS.ERROR);
    }
    result.error = error.toString();
    return result;
  }
}

/**
 * Applies all expressions to a text layer
 * @param {Layer} textLayer - The text layer to apply expressions to
 * @param {String} controlLayerName - Name of the control layer
 * @returns {Object} Result object with success status and modules applied
 */
function applyAllExpressions(textLayer, controlLayerName) {
  var result = {
    success: false,
    modulesApplied: [],
    error: null
  };
  
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
    
    // Apply text animator expressions
    app.beginUndoGroup("Apply TextSelector Expressions");
    
    // Create all text animators
    if (typeof createTextAnimators === "function") {
      createTextAnimators(textLayer, controlLayerName);
      result.modulesApplied.push("Animator");
    }
    
    // Apply specific expressions if individual functions exist
    if (typeof applyAnimationExpressions === "function") {
      applyAnimationExpressions(textLayer, controlLayerName);
      result.modulesApplied.push("Animation");
    }
    
    if (typeof applyOpacityExpressions === "function") {
      applyOpacityExpressions(textLayer, controlLayerName);
      result.modulesApplied.push("Opacity");
    }
    
    if (typeof applyPositionExpressions === "function") {
      applyPositionExpressions(textLayer, controlLayerName);
      result.modulesApplied.push("Position");
    }
    
    if (typeof applyTransformExpressions === "function") {
      applyTransformExpressions(textLayer, controlLayerName);
      result.modulesApplied.push("Transform");
    }
    
    if (typeof applyWiggleExpressions === "function") {
      applyWiggleExpressions(textLayer, controlLayerName);
      result.modulesApplied.push("Wiggle");
    }
    
    app.endUndoGroup();
    
    // Success!
    result.success = true;
    return result;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "applyAllExpressions", DEBUG_LEVELS.ERROR);
    }
    result.error = error.toString();
    return result;
  }
}

/**
 * Sets version information on the control layer
 * @param {Layer} controlLayer - The control layer to update
 * @returns {Boolean} Success status
 */
function setVersionInfo(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Validate control layer
    errorHandler.validateLayer(controlLayer);
    
    // Find or create version info effect
    var versionEffect = null;
    for (var i = 1; i <= controlLayer.Effects.numProperties; i++) {
      if (controlLayer.Effects.property(i).name === "Version Info") {
        versionEffect = controlLayer.Effects.property(i);
        break;
      }
    }
    
    if (!versionEffect) {
      versionEffect = controlLayer.Effects.addProperty("ADBE Text Control");
      versionEffect.name = "Version Info";
    }
    
    // Set version information
    var versionText = "TextSelector Modular System v" + TEXTSELECTOR_VERSION + "\n";
    versionText += "Build Date: " + TEXTSELECTOR_BUILD_DATE + "\n";
    versionText += "Modules: Core, Animation, Random, Opacity, Position, Transform, Wiggle\n";
    versionText += "© 2025 TextSelector Team";
    
    var textDocument = versionEffect.property("ADBE Text Document").value;
    textDocument.text = versionText;
    versionEffect.property("ADBE Text Document").setValue(textDocument);
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "setVersionInfo", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in setVersionInfo: " + error.toString());
    }
    return false;
  }
}

/**
 * Checks if the current After Effects version is compatible
 * @returns {Object} Compatibility information
 */
function checkVersionCompatibility() {
  var result = {
    compatible: false,
    version: app.version,
    minimumRequired: "16.0",
    features: {
      multiFrameRendering: false,
      javascriptEngine: false,
      expressionSelectors: false
    }
  };
  
  try {
    // Parse current version
    var versionParts = app.version.split(".");
    var majorVersion = parseInt(versionParts[0]);
    
    // Check minimum compatibility
    result.compatible = majorVersion >= 16;
    
    // Check feature support
    result.features.multiFrameRendering = majorVersion >= 17;
    result.features.javascriptEngine = majorVersion >= 16;
    result.features.expressionSelectors = majorVersion >= 15;
    
    return result;
  } catch (e) {
    return result;
  }
}

/**
 * Creates a backward compatibility matrix
 * @returns {Object} Compatibility matrix
 */
function createCompatibilityMatrix() {
  return {
    "After Effects CC 2019 (16.0)": {
      compatible: true,
      features: {
        core: true,
        animation: true,
        opacity: true,
        position: true,
        transform: true,
        wiggle: true,
        javascriptEngine: true,
        expressionSelectors: true,
        multiFrameRendering: false
      }
    },
    "After Effects CC 2020 (17.0)": {
      compatible: true,
      features: {
        core: true,
        animation: true,
        opacity: true,
        position: true,
        transform: true,
        wiggle: true,
        javascriptEngine: true,
        expressionSelectors: true,
        multiFrameRendering: true
      }
    },
    "After Effects CC 2021 (18.0)": {
      compatible: true,
      features: {
        core: true,
        animation: true,
        opacity: true,
        position: true,
        transform: true,
        wiggle: true,
        javascriptEngine: true,
        expressionSelectors: true,
        multiFrameRendering: true
      }
    },
    "After Effects CC 2022 (22.0)": {
      compatible: true,
      features: {
        core: true,
        animation: true,
        opacity: true,
        position: true,
        transform: true,
        wiggle: true,
        javascriptEngine: true,
        expressionSelectors: true,
        multiFrameRendering: true
      }
    },
    "After Effects CC 2023 (23.0)": {
      compatible: true,
      features: {
        core: true,
        animation: true,
        opacity: true,
        position: true,
        transform: true,
        wiggle: true,
        javascriptEngine: true,
        expressionSelectors: true,
        multiFrameRendering: true
      }
    }
  };
}

/**
 * Provides migration guidance for upgrading from v1.x
 * @returns {String} Migration guidance text
 */
function getMigrationGuidance() {
  return "Migration Guide from TextSelector v1.x to v2.x\n\n" +
         "1. Remove any existing Text_Selector.ffx presets from your project\n" +
         "2. Apply the new TextSelector_Main.jsx script to your composition\n" +
         "3. For each text layer that had the old preset:\n" +
         "   a. Select the layer\n" +
         "   b. Run the 'Apply TextSelector to Selected Layers' command\n" +
         "   c. Adjust settings as needed\n\n" +
         "Note: The new system uses separate controls for each feature,\n" +
         "organized in a more logical way. Your existing animations may\n" +
         "need adjustment to match the previous look exactly.";
}

/**
 * Applies TextSelector to selected text layers
 * @returns {Object} Result with success count and errors
 */
function applyToSelectedLayers() {
  var result = {
    success: true,
    layersProcessed: 0,
    errors: []
  };
  
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Check for active composition
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
      result.success = false;
      result.errors.push("No active composition");
      return result;
    }
    
    // Find control layer
    var controlLayer = null;
    for (var i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === TEXTSELECTOR_CONTROL_LAYER_NAME) {
        controlLayer = comp.layer(i);
        break;
      }
    }
    
    if (!controlLayer) {
      // Initialize system if control layer doesn't exist
      var initResult = initializeTextSelector(comp);
      if (!initResult.success) {
        result.success = false;
        result.errors.push("Failed to initialize TextSelector: " + initResult.error);
        return result;
      }
      controlLayer = initResult.controlLayer;
    }
    
    // Process selected layers
    app.beginUndoGroup("Apply TextSelector to Selected Layers");
    
    var selectedLayers = comp.selectedLayers;
    for (var i = 0; i < selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      
      // Check if layer is a text layer
      if (isTextLayer(layer)) {
        try {
          var applyResult = applyAllExpressions(layer, controlLayer.name);
          if (applyResult.success) {
            result.layersProcessed++;
          } else {
            result.errors.push("Layer '" + layer.name + "': " + applyResult.error);
          }
        } catch (layerError) {
          result.errors.push("Layer '" + layer.name + "': " + layerError.toString());
        }
      }
    }
    
    app.endUndoGroup();
    
    // Update overall success status
    if (result.layersProcessed === 0) {
      result.success = false;
      if (result.errors.length === 0) {
        result.errors.push("No text layers selected");
      }
    }
    
    return result;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "applyToSelectedLayers", DEBUG_LEVELS.ERROR);
    }
    result.success = false;
    result.errors.push(error.toString());
    return result;
  }
}

/**
 * Creates a distribution package with organized folder structure
 * @param {String} outputPath - Path to create the distribution package
 * @returns {Boolean} Success status
 */
function createDistributionPackage(outputPath) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();
    
    // Create folder structure
    var folder = new Folder(outputPath);
    if (!folder.exists) {
      folder.create();
    }
    
    // Create subfolders
    var srcFolder = new Folder(outputPath + "/src");
    if (!srcFolder.exists) {
      srcFolder.create();
    }
    
    var docsFolder = new Folder(outputPath + "/docs");
    if (!docsFolder.exists) {
      docsFolder.create();
    }
    
    var examplesFolder = new Folder(outputPath + "/examples");
    if (!examplesFolder.exists) {
      examplesFolder.create();
    }
    
    // Copy source files
    var sourceFiles = [
      "TextSelector_Main.jsx",
      "TextSelector_Core.jsx",
      "TextSelector_Utils.jsx",
      "TextSelector_ErrorHandler.jsx",
      "TextSelector_Animation.jsx",
      "TextSelector_Random.jsx",
      "TextSelector_Opacity.jsx",
      "TextSelector_Position.jsx",
      "TextSelector_Transform.jsx",
      "TextSelector_Wiggle.jsx",
      "TextSelector_Animator.jsx",
      "TextSelector_ExpressionOptimizer.jsx",
      "TextSelector_PerformanceOptimizer.jsx"
    ];
    
    for (var i = 0; i < sourceFiles.length; i++) {
      var sourceFile = new File(sourceFiles[i]);
      if (sourceFile.exists) {
        sourceFile.copy(outputPath + "/src/" + sourceFiles[i]);
      }
    }
    
    // Create documentation files
    var readmeFile = new File(outputPath + "/README.md");
    readmeFile.open("w");
    readmeFile.write("# TextSelector Modular System v" + TEXTSELECTOR_VERSION + "\n\n" +
                    "A modular system for text animation in After Effects.\n\n" +
                    "## Installation\n\n" +
                    "1. Copy all files from the `src` folder to your After Effects Scripts folder\n" +
                    "2. In After Effects, run File > Scripts > TextSelector_Main.jsx\n\n" +
                    "## Documentation\n\n" +
                    "See the `docs` folder for detailed documentation.\n\n" +
                    "## Examples\n\n" +
                    "See the `examples` folder for example projects.\n\n" +
                    "© 2025 TextSelector Team");
    readmeFile.close();
    
    var installFile = new File(outputPath + "/INSTALL.md");
    installFile.open("w");
    installFile.write("# Installation Instructions\n\n" +
                     "## System Requirements\n\n" +
                     "- After Effects CC 2019 (16.0) or later\n" +
                     "- 4GB RAM minimum, 8GB recommended\n\n" +
                     "## Installation Steps\n\n" +
                     "1. Close After Effects if it's running\n" +
                     "2. Copy all files from the `src` folder to your After Effects Scripts folder:\n" +
                     "   - Windows: `C:\\Program Files\\Adobe\\Adobe After Effects [version]\\Support Files\\Scripts`\n" +
                     "   - Mac: `/Applications/Adobe After Effects [version]/Scripts`\n" +
                     "3. Start After Effects\n" +
                     "4. Go to File > Scripts > TextSelector_Main.jsx\n\n" +
                     "## Troubleshooting\n\n" +
                     "If the script doesn't appear in the Scripts menu, make sure:\n" +
                     "- You have permission to write to the Scripts folder\n" +
                     "- You've enabled 'Allow Scripts to Write Files and Access Network' in Preferences > General\n\n" +
                     "For further assistance, see the documentation in the `docs` folder.");
    installFile.close();
    
    // Create documentation files
    var userGuideFile = new File(outputPath + "/docs/UserGuide.md");
    userGuideFile.open("w");
    userGuideFile.write("# TextSelector User Guide\n\n" +
                       "## Introduction\n\n" +
                       "TextSelector is a modular system for text animation in After Effects.\n\n" +
                       "## Getting Started\n\n" +
                       "1. Run TextSelector_Main.jsx from the Scripts menu\n" +
                       "2. Select text layers you want to animate\n" +
                       "3. Run 'Apply TextSelector to Selected Layers'\n\n" +
                       "## Modules\n\n" +
                       "- **Core**: Basic system functionality\n" +
                       "- **Animation**: Timing and sequencing control\n" +
                       "- **Random**: Seed management and randomization\n" +
                       "- **Opacity**: Opacity control and fading\n" +
                       "- **Position**: Position and anchor point management\n" +
                       "- **Transform**: Scale, rotation, and distortion\n" +
                       "- **Wiggle**: Advanced wiggle effects\n\n" +
                       "## Controls\n\n" +
                       "See each module's documentation for detailed control descriptions.");
    userGuideFile.close();
    
    // Create example project
    var exampleFile = new File(outputPath + "/examples/README.md");
    exampleFile.open("w");
    exampleFile.write("# TextSelector Examples\n\n" +
                     "This folder contains example projects demonstrating TextSelector features.\n\n" +
                     "## Basic Animation\n\n" +
                     "Shows basic text animation with default settings.\n\n" +
                     "## Advanced Effects\n\n" +
                     "Demonstrates advanced wiggle and transform effects.\n\n" +
                     "## Performance Optimization\n\n" +
                     "Shows how to optimize TextSelector for better performance.");
    exampleFile.close();
    
    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createDistributionPackage", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createDistributionPackage: " + error.toString());
    }
    return false;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeTextSelector: initializeTextSelector,
    applyAllExpressions: applyAllExpressions,
    setVersionInfo: setVersionInfo,
    checkVersionCompatibility: checkVersionCompatibility,
    createCompatibilityMatrix: createCompatibilityMatrix,
    getMigrationGuidance: getMigrationGuidance,
    applyToSelectedLayers: applyToSelectedLayers,
    createDistributionPackage: createDistributionPackage,
    TEXTSELECTOR_VERSION: TEXTSELECTOR_VERSION,
    TEXTSELECTOR_BUILD_DATE: TEXTSELECTOR_BUILD_DATE
  };
}

// Run the main function when script is executed directly
if (typeof module === "undefined") {
  main();
}
