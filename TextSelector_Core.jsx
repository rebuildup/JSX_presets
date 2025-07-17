//@target aftereffects
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * TextSelector_Core.jsx
 * Core system module for the Text Selector Modular System
 * Version: 2.0.1
 */

// Global constants and namespace
var TEXTSELECTOR_NAMESPACE = "TextSelector_";
var TEXTSELECTOR_VERSION = "2.0.1";

// Effect names for consistent referencing across modules
var EFFECT_NAMES = {
  CORE: "TextSelector_Core",
  ANIMATION: "TextSelector_Animation",
  OPACITY: "TextSelector_Opacity",
  POSITION: "TextSelector_Position",
  TRANSFORM: "TextSelector_Transform",
  WIGGLE: "TextSelector_Wiggle",
  RANDOM: "TextSelector_Random",
};

// Expression presets for common animation patterns
var EXPRESSION_PRESETS = {
  POSITION_Y:
    'var delay = effect("TextSelector_Animation")("Delay");\nvar styledp = effect("TextSelector_Animation")("Ani - Style");\nvar posti = effect("TextSelector_Animation")("Posterize(0=FPS)");\nposterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\nd = (styledp==2 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);\neffect("TextSelector_Animation")("Animation").valueAtTime(time - d);',

  POSITION_X:
    'var delay = effect("TextSelector_Animation")("Delay");\nvar styledp = effect("TextSelector_Animation")("Ani - Style");\nvar posti = effect("TextSelector_Animation")("Posterize(0=FPS)");\nposterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\nd = (styledp==3 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);\neffect("TextSelector_Animation")("Animation").valueAtTime(time - d);',

  RANDOMIZER_2WAY:
    'if(effect("TextSelector_Animation")("Ani - Style")==2 || effect("TextSelector_Animation")("Ani - Style")==3){\n    ((textIndex%2)==0) ? selectorValue : -selectorValue;\n}else{\n    selectorValue;\n}',
};

// Create error handler
var errorHandler = createErrorHandler();

/**
 * Get a TextSelector effect by name
 * @param {Layer} layer - Layer to get effect from
 * @param {String} effectName - Effect name without namespace prefix
 * @returns {Effect|null} Effect object or null if not found
 */
function getTextSelectorEffect(layer, effectName) {
  return errorHandler.safeExecute(
    function () {
      return layer.effect(TEXTSELECTOR_NAMESPACE + effectName);
    },
    null,
    "getTextSelectorEffect"
  );
}

/**
 * Create a slider control effect
 * @param {Layer} layer - Layer to add effect to
 * @param {String} name - Effect name
 * @param {Number} value - Initial value
 * @param {Number} min - Minimum value (optional)
 * @param {Number} max - Maximum value (optional)
 * @returns {Effect|null} Created effect or null if failed
 */
function createSliderControl(layer, name, value, min, max) {
  return errorHandler.safeExecute(
    function () {
      var effect = layer.Effects.addProperty("ADBE Slider Control");
      effect.name = name;
      effect.property("Slider").setValue(value !== undefined ? value : 50);

      // Set custom range if provided
      if (min !== undefined && max !== undefined) {
        setSliderRange(effect.property("Slider"), min, max);
      }

      return effect;
    },
    null,
    "createSliderControl: " + name
  );
}

/**
 * Create a checkbox control effect
 * @param {Layer} layer - Layer to add effect to
 * @param {String} name - Effect name
 * @param {Boolean} value - Initial value
 * @returns {Effect|null} Created effect or null if failed
 */
function createCheckboxControl(layer, name, value) {
  return errorHandler.safeExecute(
    function () {
      var effect = layer.Effects.addProperty("ADBE Checkbox Control");
      effect.name = name;
      effect.property("Checkbox").setValue(value !== undefined ? value : false);
      return effect;
    },
    null,
    "createCheckboxControl: " + name
  );
}

/**
 * Create a point control effect
 * @param {Layer} layer - Layer to add effect to
 * @param {String} name - Effect name
 * @param {Array} value - Initial value [x, y]
 * @returns {Effect|null} Created effect or null if failed
 */
function createPointControl(layer, name, value) {
  return errorHandler.safeExecute(
    function () {
      var effect = layer.Effects.addProperty("ADBE Point Control");
      effect.name = name;
      effect.property("Point").setValue(value || [0, 0]);
      return effect;
    },
    null,
    "createPointControl: " + name
  );
}

/**
 * Create a dropdown control effect
 * @param {Layer} layer - Layer to add effect to
 * @param {String} name - Effect name
 * @param {Array} options - Array of option strings
 * @param {Number} selectedIndex - Initial selected index
 * @returns {Effect|null} Created effect or null if failed
 */
function createDropdownControl(layer, name, options, selectedIndex) {
  return errorHandler.safeExecute(
    function () {
      var effect = layer.Effects.addProperty("ADBE Dropdown Control");
      effect.name = name;

      // After Effects doesn't support custom dropdown options via scripting
      // Use slider with interpretation comment
      var comment = "Options: " + options.join(", ");
      effect.comment = comment;

      // Set initial value if provided
      if (selectedIndex !== undefined) {
        effect.property("Menu").setValue(selectedIndex);
      }

      return effect;
    },
    null,
    "createDropdownControl: " + name
  );
}

/**
 * Set the range of a slider property
 * @param {Property} sliderProperty - Slider property to set range for
 * @param {Number} min - Minimum value
 * @param {Number} max - Maximum value
 */
function setSliderRange(sliderProperty, min, max) {
  errorHandler.safeExecute(
    function () {
      try {
        sliderProperty.min = min;
        sliderProperty.max = max;
      } catch (err) {
        // Fallback: Set comment with range info
        sliderProperty.comment = "Range: " + min + " to " + max;
      }
    },
    null,
    "setSliderRange"
  );
}

/**
 * Initialize the TextSelector core system
 * @returns {Layer|null} Control layer or null if initialization failed
 */
function initializeTextSelectorCore() {
  return errorHandler.safeExecute(
    function () {
      var comp = app.project.activeItem;
      if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition");
        return null;
      }

      // Create control null layer
      var controlLayer = comp.layers.addNull();
      controlLayer.name = "TextSelector_Controls";
      controlLayer.label = 9; // Red color
      controlLayer.shy = false;
      controlLayer.guideLayer = true;

      // Add core system information
      var coreGroup = createEffectGroup(controlLayer, EFFECT_NAMES.CORE);

      addInfoText(
        coreGroup,
        "System Info",
        "TextSelector v" + TEXTSELECTOR_VERSION
      );
      createCheckboxControl(controlLayer, "Global Enable", true);
      createCheckboxControl(controlLayer, "Debug Mode", false);

      return controlLayer;
    },
    null,
    "initializeTextSelectorCore"
  );
}

/**
 * Create an effect group
 * @param {Layer} layer - Layer to add group to
 * @param {String} groupName - Group name
 * @returns {Effect|Layer} Group effect or layer if creation failed
 */
function createEffectGroup(layer, groupName) {
  return errorHandler.safeExecute(
    function () {
      try {
        var groupEffect = layer.Effects.addProperty("ADBE Group");
        groupEffect.name = groupName;
        return groupEffect;
      } catch (err) {
        // Fallback: use individual effects with naming convention
        return layer;
      }
    },
    layer,
    "createEffectGroup: " + groupName
  );
}

/**
 * Add informational text as an effect
 * @param {Effect|Layer} parent - Parent effect or layer
 * @param {String} name - Info name
 * @param {String} text - Info text
 * @returns {Effect|null} Created effect or null if failed
 */
function addInfoText(parent, name, text) {
  return errorHandler.safeExecute(
    function () {
      var infoEffect = parent.Effects.addProperty("ADBE Group");
      infoEffect.name = name + ": " + text;
      infoEffect.enabled = false; // Make it non-functional
      return infoEffect;
    },
    null,
    "addInfoText: " + name
  );
}

/**
 * Find or create the TextSelector control layer
 * @param {CompItem} comp - Composition to search in
 * @returns {Layer} Existing or new control layer
 */
function findOrCreateControlLayer(comp) {
  var controlLayer = null;

  // Try to find existing control layer
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).name === "TextSelector_Controls") {
      controlLayer = comp.layer(i);
      break;
    }
  }

  // Create new control layer if not found
  if (!controlLayer) {
    controlLayer = initializeTextSelectorCore();
  }

  return controlLayer;
}

/**
 * Check if the TextSelector system is enabled
 * @param {Layer} controlLayer - Control layer
 * @returns {Boolean} True if enabled
 */
function isSystemEnabled(controlLayer) {
  return errorHandler.safeExecute(
    function () {
      return controlLayer.effect("Global Enable")("Checkbox").value;
    },
    true,
    "isSystemEnabled"
  );
}

// Export core functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TEXTSELECTOR_NAMESPACE: TEXTSELECTOR_NAMESPACE,
    TEXTSELECTOR_VERSION: TEXTSELECTOR_VERSION,
    EFFECT_NAMES: EFFECT_NAMES,
    EXPRESSION_PRESETS: EXPRESSION_PRESETS,
    getTextSelectorEffect: getTextSelectorEffect,
    createSliderControl: createSliderControl,
    createCheckboxControl: createCheckboxControl,
    createPointControl: createPointControl,
    createDropdownControl: createDropdownControl,
    setSliderRange: setSliderRange,
    initializeTextSelectorCore: initializeTextSelectorCore,
    createEffectGroup: createEffectGroup,
    addInfoText: addInfoText,
    findOrCreateControlLayer: findOrCreateControlLayer,
    isSystemEnabled: isSystemEnabled,
  };
}
