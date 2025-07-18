//@target aftereffects

/**
 * TextSelector_PresetSystem.jsx
 * Advanced features and preset system for the Text Selector Modular System
 * Provides preset library, custom templates, and project management
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

// Preset categories
var PRESET_CATEGORIES = {
  BASIC: "Basic",
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional",
  CUSTOM: "Custom",
};

// Preset library
var PRESET_LIBRARY = {
  // Basic presets
  "Fade In": {
    category: PRESET_CATEGORIES.BASIC,
    settings: {
      animation: {
        delay: 0.1,
        aniStyle: 1, // Single
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: false,
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Simple fade in animation with character delay",
  },
  "Slide Up": {
    category: PRESET_CATEGORIES.BASIC,
    settings: {
      animation: {
        delay: 0.1,
        aniStyle: 1, // Single
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 40],
      },
      transform: {
        scaleOn: false,
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Characters slide up into position",
  },
  "Scale In": {
    category: PRESET_CATEGORIES.BASIC,
    settings: {
      animation: {
        delay: 0.1,
        aniStyle: 1, // Single
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: true,
        addScale: [-100, -100],
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Characters scale from zero to full size",
  },

  // Creative presets
  Typewriter: {
    category: PRESET_CATEGORIES.CREATIVE,
    settings: {
      animation: {
        delay: 0.05,
        aniStyle: 1, // Single
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: false,
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: true,
        flucSec: [10, 10],
        wigglePosition: [1, 1],
        wiggleScale: [0, 0],
        wiggleRotation: 0,
        wiggleDistortion: 0,
        wiggleSeed: 123,
        smoothWiggle: false,
      },
    },
    description: "Typewriter effect with slight position jitter",
  },
  "Spin In": {
    category: PRESET_CATEGORIES.CREATIVE,
    settings: {
      animation: {
        delay: 0.1,
        aniStyle: 1, // Single
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: true,
        addScale: [-50, -50],
        rotationOn: true,
        addRotation: 180,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Characters spin and scale into position",
  },
  Chaos: {
    category: PRESET_CATEGORIES.CREATIVE,
    settings: {
      animation: {
        delay: 0.1,
        aniStyle: 2, // 2-way XY
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: true,
        rotationOn: true,
        distortionOn: true,
      },
      wiggle: {
        wiggleAdd: true,
        flucSec: [2, 2],
        wigglePosition: [5, 5],
        wiggleScale: [5, 5],
        wiggleRotation: 15,
        wiggleDistortion: 10,
        wiggleSeed: 456,
        smoothWiggle: false,
      },
    },
    description: "Chaotic random animation with wiggle",
  },

  // Professional presets
  "Smooth Reveal": {
    category: PRESET_CATEGORIES.PROFESSIONAL,
    settings: {
      animation: {
        delay: 0.15,
        aniStyle: 1, // Single
        posterize: 12,
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 20],
      },
      transform: {
        scaleOn: true,
        addScale: [-20, -20],
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Professional smooth reveal with slight scale and position",
  },
  "Elegant Fade": {
    category: PRESET_CATEGORIES.PROFESSIONAL,
    settings: {
      animation: {
        delay: 0.2,
        aniStyle: 1, // Single
        posterize: 24,
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 10],
      },
      transform: {
        scaleOn: false,
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Elegant fade in with subtle position change",
  },
  Corporate: {
    category: PRESET_CATEGORIES.PROFESSIONAL,
    settings: {
      animation: {
        delay: 0.08,
        aniStyle: 1, // Single
        posterize: 24,
      },
      opacity: {
        opacityStyle: 2, // Manual
        opacityManual: 100,
      },
      position: {
        aniPosition: [0, 0],
      },
      transform: {
        scaleOn: true,
        addScale: [-10, -10],
        rotationOn: false,
        distortionOn: false,
      },
      wiggle: {
        wiggleAdd: false,
      },
    },
    description: "Clean corporate style animation",
  },
};

/**
 * Creates a preset library system on the control layer
 * @param {Layer} controlLayer - The control layer to add preset system to
 * @returns {Boolean} Success status
 */
function createPresetSystem(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Preset System group
    var presetGroup = controlLayer.Effects.addProperty("ADBE Group");
    presetGroup.name = "Preset System";

    // Add Preset Category dropdown
    var presetCategory = presetGroup.addProperty("ADBE Dropdown Control");
    presetCategory.name = "Preset Category";
    var categoryMenu = presetCategory.property("ADBE Dropdown Control-0");

    // Set category menu items
    var categoryItems = [];
    for (var category in PRESET_CATEGORIES) {
      if (PRESET_CATEGORIES.hasOwnProperty(category)) {
        categoryItems.push(PRESET_CATEGORIES[category]);
      }
    }
    categoryMenu.setPropertyParameters({
      items: categoryItems,
    });
    categoryMenu.setValue(1); // Default to Basic

    // Add Preset Selection dropdown
    var presetSelection = presetGroup.addProperty("ADBE Dropdown Control");
    presetSelection.name = "Preset Selection";

    // Add Apply Preset button
    var applyPreset = presetGroup.addProperty("ADBE Button Control");
    applyPreset.name = "Apply Preset";

    // Add Save Custom Preset button
    var saveCustomPreset = presetGroup.addProperty("ADBE Button Control");
    saveCustomPreset.name = "Save Custom Preset";

    // Add Preset Description text
    var presetDescription = presetGroup.addProperty("ADBE Text Control");
    presetDescription.name = "Preset Description";
    var textDocument = presetDescription.property("ADBE Text Document").value;
    textDocument.text =
      "Select a preset category and preset, then click Apply Preset";
    presetDescription.property("ADBE Text Document").setValue(textDocument);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createPresetSystem", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createPresetSystem: " + error.toString());
    }
    return false;
  }
}

/**
 * Applies a preset to the control layer
 * @param {Layer} controlLayer - The control layer to apply preset to
 * @param {String} presetName - Name of the preset to apply
 * @returns {Boolean} Success status
 */
function applyPreset(controlLayer, presetName) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Check if preset exists
    if (!PRESET_LIBRARY[presetName]) {
      throw new Error("Preset not found: " + presetName);
    }

    // Get preset settings
    var preset = PRESET_LIBRARY[presetName];
    var settings = preset.settings;

    app.beginUndoGroup("Apply TextSelector Preset: " + presetName);

    // Apply animation settings
    if (settings.animation) {
      if (settings.animation.delay !== undefined) {
        setEffectProperty(
          controlLayer,
          "Delay",
          "Slider",
          settings.animation.delay
        );
      }

      if (settings.animation.aniStyle !== undefined) {
        setEffectProperty(
          controlLayer,
          "Ani-Style",
          "Slider",
          settings.animation.aniStyle
        );
      }

      if (settings.animation.posterize !== undefined) {
        setEffectProperty(
          controlLayer,
          "Posterize(0=FPS)",
          "Slider",
          settings.animation.posterize
        );
      }
    }

    // Apply opacity settings
    if (settings.opacity) {
      if (settings.opacity.opacityStyle !== undefined) {
        setEffectProperty(
          controlLayer,
          "Opacity-Style",
          "Slider",
          settings.opacity.opacityStyle
        );
      }

      if (settings.opacity.opacityManual !== undefined) {
        setEffectProperty(
          controlLayer,
          "Opacity (Manual)",
          "Slider",
          settings.opacity.opacityManual
        );
      }
    }

    // Apply position settings
    if (settings.position && settings.position.aniPosition !== undefined) {
      setEffectProperty(
        controlLayer,
        "Ani-Position",
        "Point",
        settings.position.aniPosition
      );
    }

    // Apply transform settings
    if (settings.transform) {
      if (settings.transform.scaleOn !== undefined) {
        setEffectProperty(
          controlLayer,
          "Scale : ON",
          "Checkbox",
          settings.transform.scaleOn ? 1 : 0
        );
      }

      if (settings.transform.addScale !== undefined) {
        setEffectProperty(
          controlLayer,
          "Add Scale",
          "Point",
          settings.transform.addScale
        );
      }

      if (settings.transform.rotationOn !== undefined) {
        setEffectProperty(
          controlLayer,
          "Rotation : ON",
          "Checkbox",
          settings.transform.rotationOn ? 1 : 0
        );
      }

      if (settings.transform.addRotation !== undefined) {
        setEffectProperty(
          controlLayer,
          "Add Rotation",
          "Slider",
          settings.transform.addRotation
        );
      }

      if (settings.transform.distortionOn !== undefined) {
        setEffectProperty(
          controlLayer,
          "Distortion : ON",
          "Checkbox",
          settings.transform.distortionOn ? 1 : 0
        );
      }

      if (settings.transform.addDistortion !== undefined) {
        setEffectProperty(
          controlLayer,
          "Add Distortion",
          "Slider",
          settings.transform.addDistortion
        );
      }
    }

    // Apply wiggle settings
    if (settings.wiggle) {
      if (settings.wiggle.wiggleAdd !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Add",
          "Checkbox",
          settings.wiggle.wiggleAdd ? 1 : 0
        );
      }

      if (settings.wiggle.flucSec !== undefined) {
        setEffectProperty(
          controlLayer,
          "Fluc/Sec",
          "Point",
          settings.wiggle.flucSec
        );
      }

      if (settings.wiggle.wigglePosition !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Position",
          "Point",
          settings.wiggle.wigglePosition
        );
      }

      if (settings.wiggle.wiggleScale !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Scale",
          "Point",
          settings.wiggle.wiggleScale
        );
      }

      if (settings.wiggle.wiggleRotation !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Rotation",
          "Slider",
          settings.wiggle.wiggleRotation
        );
      }

      if (settings.wiggle.wiggleDistortion !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Distortion",
          "Slider",
          settings.wiggle.wiggleDistortion
        );
      }

      if (settings.wiggle.wiggleSeed !== undefined) {
        setEffectProperty(
          controlLayer,
          "Wiggle Seed",
          "Slider",
          settings.wiggle.wiggleSeed
        );
      }

      if (settings.wiggle.smoothWiggle !== undefined) {
        setEffectProperty(
          controlLayer,
          "Smooth Wiggle",
          "Checkbox",
          settings.wiggle.smoothWiggle ? 1 : 0
        );
      }
    }

    // Update preset description
    var presetDescription = findEffect(controlLayer, "Preset Description");
    if (presetDescription) {
      var textDocument = presetDescription.property("ADBE Text Document").value;
      textDocument.text = preset.description || "No description available";
      presetDescription.property("ADBE Text Document").setValue(textDocument);
    }

    app.endUndoGroup();

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "applyPreset", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in applyPreset: " + error.toString());
    }

    if (app.undoGroup) {
      app.endUndoGroup();
    }

    return false;
  }
}

/**
 * Sets a property value on an effect
 * @param {Layer} layer - The layer containing the effect
 * @param {String} effectName - Name of the effect
 * @param {String} propertyType - Type of property (Slider, Checkbox, Point)
 * @param {*} value - Value to set
 * @returns {Boolean} Success status
 */
function setEffectProperty(layer, effectName, propertyType, value) {
  try {
    var effect = findEffect(layer, effectName);
    if (!effect) {
      return false;
    }

    var property;
    switch (propertyType) {
      case "Slider":
        property = effect.property("ADBE Slider Control-0");
        break;
      case "Checkbox":
        property = effect.property("ADBE Checkbox Control-0");
        break;
      case "Point":
        property = effect.property("ADBE Point Control-0");
        break;
      default:
        return false;
    }

    if (!property) {
      return false;
    }

    property.setValue(value);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Finds an effect by name on a layer
 * @param {Layer} layer - The layer to search
 * @param {String} effectName - Name of the effect to find
 * @returns {PropertyGroup|null} The effect or null if not found
 */
function findEffect(layer, effectName) {
  try {
    for (var i = 1; i <= layer.Effects.numProperties; i++) {
      var effect = layer.Effects.property(i);

      // Check if this is the effect we're looking for
      if (effect.name === effectName) {
        return effect;
      }

      // Check if this is a group that might contain the effect
      if (effect.numProperties) {
        for (var j = 1; j <= effect.numProperties; j++) {
          var subEffect = effect.property(j);
          if (subEffect.name === effectName) {
            return subEffect;
          }
        }
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Saves current settings as a custom preset
 * @param {Layer} controlLayer - The control layer with settings
 * @param {String} presetName - Name for the new preset
 * @param {String} description - Description of the preset
 * @returns {Boolean} Success status
 */
function saveCustomPreset(controlLayer, presetName, description) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Validate preset name
    if (!presetName || presetName.trim() === "") {
      throw new Error("Preset name cannot be empty");
    }

    // Create settings object
    var settings = {
      animation: {},
      opacity: {},
      position: {},
      transform: {},
      wiggle: {},
    };

    // Collect animation settings
    var delayEffect = findEffect(controlLayer, "Delay");
    if (delayEffect) {
      settings.animation.delay = delayEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var aniStyleEffect = findEffect(controlLayer, "Ani-Style");
    if (aniStyleEffect) {
      settings.animation.aniStyle = aniStyleEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var posterizeEffect = findEffect(controlLayer, "Posterize(0=FPS)");
    if (posterizeEffect) {
      settings.animation.posterize = posterizeEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    // Collect opacity settings
    var opacityStyleEffect = findEffect(controlLayer, "Opacity-Style");
    if (opacityStyleEffect) {
      settings.opacity.opacityStyle = opacityStyleEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var opacityManualEffect = findEffect(controlLayer, "Opacity (Manual)");
    if (opacityManualEffect) {
      settings.opacity.opacityManual = opacityManualEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    // Collect position settings
    var aniPositionEffect = findEffect(controlLayer, "Ani-Position");
    if (aniPositionEffect) {
      var point = aniPositionEffect.property("ADBE Point Control-0").value;
      settings.position.aniPosition = [point[0], point[1]];
    }

    // Collect transform settings
    var scaleOnEffect = findEffect(controlLayer, "Scale : ON");
    if (scaleOnEffect) {
      settings.transform.scaleOn =
        scaleOnEffect.property("ADBE Checkbox Control-0").value === 1;
    }

    var addScaleEffect = findEffect(controlLayer, "Add Scale");
    if (addScaleEffect) {
      var point = addScaleEffect.property("ADBE Point Control-0").value;
      settings.transform.addScale = [point[0], point[1]];
    }

    var rotationOnEffect = findEffect(controlLayer, "Rotation : ON");
    if (rotationOnEffect) {
      settings.transform.rotationOn =
        rotationOnEffect.property("ADBE Checkbox Control-0").value === 1;
    }

    var addRotationEffect = findEffect(controlLayer, "Add Rotation");
    if (addRotationEffect) {
      settings.transform.addRotation = addRotationEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var distortionOnEffect = findEffect(controlLayer, "Distortion : ON");
    if (distortionOnEffect) {
      settings.transform.distortionOn =
        distortionOnEffect.property("ADBE Checkbox Control-0").value === 1;
    }

    var addDistortionEffect = findEffect(controlLayer, "Add Distortion");
    if (addDistortionEffect) {
      settings.transform.addDistortion = addDistortionEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    // Collect wiggle settings
    var wiggleAddEffect = findEffect(controlLayer, "Wiggle Add");
    if (wiggleAddEffect) {
      settings.wiggle.wiggleAdd =
        wiggleAddEffect.property("ADBE Checkbox Control-0").value === 1;
    }

    var flucSecEffect = findEffect(controlLayer, "Fluc/Sec");
    if (flucSecEffect) {
      var point = flucSecEffect.property("ADBE Point Control-0").value;
      settings.wiggle.flucSec = [point[0], point[1]];
    }

    var wigglePositionEffect = findEffect(controlLayer, "Wiggle Position");
    if (wigglePositionEffect) {
      var point = wigglePositionEffect.property("ADBE Point Control-0").value;
      settings.wiggle.wigglePosition = [point[0], point[1]];
    }

    var wiggleScaleEffect = findEffect(controlLayer, "Wiggle Scale");
    if (wiggleScaleEffect) {
      var point = wiggleScaleEffect.property("ADBE Point Control-0").value;
      settings.wiggle.wiggleScale = [point[0], point[1]];
    }

    var wiggleRotationEffect = findEffect(controlLayer, "Wiggle Rotation");
    if (wiggleRotationEffect) {
      settings.wiggle.wiggleRotation = wiggleRotationEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var wiggleDistortionEffect = findEffect(controlLayer, "Wiggle Distortion");
    if (wiggleDistortionEffect) {
      settings.wiggle.wiggleDistortion = wiggleDistortionEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var wiggleSeedEffect = findEffect(controlLayer, "Wiggle Seed");
    if (wiggleSeedEffect) {
      settings.wiggle.wiggleSeed = wiggleSeedEffect.property(
        "ADBE Slider Control-0"
      ).value;
    }

    var smoothWiggleEffect = findEffect(controlLayer, "Smooth Wiggle");
    if (smoothWiggleEffect) {
      settings.wiggle.smoothWiggle =
        smoothWiggleEffect.property("ADBE Checkbox Control-0").value === 1;
    }

    // Create new preset
    PRESET_LIBRARY[presetName] = {
      category: PRESET_CATEGORIES.CUSTOM,
      settings: settings,
      description: description || "Custom preset",
    };

    // Save preset to file if possible
    savePresetToFile(presetName, PRESET_LIBRARY[presetName]);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "saveCustomPreset", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in saveCustomPreset: " + error.toString());
    }
    return false;
  }
}

/**
 * Saves a preset to a file
 * @param {String} presetName - Name of the preset
 * @param {Object} preset - Preset data
 * @returns {Boolean} Success status
 */
function savePresetToFile(presetName, preset) {
  try {
    // Create presets folder if it doesn't exist
    var presetsFolder = new Folder(
      Folder.userData.fullName + "/TextSelector/Presets"
    );
    if (!presetsFolder.exists) {
      presetsFolder.create();
    }

    // Create preset file
    var presetFile = new File(
      presetsFolder.fullName +
        "/" +
        presetName.replace(/[^a-zA-Z0-9]/g, "_") +
        ".json"
    );
    presetFile.open("w");
    presetFile.write(JSON.stringify(preset, null, 2));
    presetFile.close();

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Loads presets from files
 * @returns {Boolean} Success status
 */
function loadPresetsFromFiles() {
  try {
    // Check if presets folder exists
    var presetsFolder = new Folder(
      Folder.userData.fullName + "/TextSelector/Presets"
    );
    if (!presetsFolder.exists) {
      return false;
    }

    // Get all JSON files
    var presetFiles = presetsFolder.getFiles("*.json");
    if (!presetFiles || presetFiles.length === 0) {
      return false;
    }

    // Load each preset
    for (var i = 0; i < presetFiles.length; i++) {
      try {
        var file = presetFiles[i];
        file.open("r");
        var content = file.read();
        file.close();

        var preset = JSON.parse(content);
        var presetName = file.name.replace(".json", "").replace(/_/g, " ");

        // Add to preset library
        PRESET_LIBRARY[presetName] = preset;
      } catch (e) {
        // Skip this file if there's an error
        continue;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Creates a custom expression template framework
 * @param {Layer} controlLayer - The control layer to add template framework to
 * @returns {Boolean} Success status
 */
function createExpressionTemplateFramework(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Expression Templates group
    var templatesGroup = controlLayer.Effects.addProperty("ADBE Group");
    templatesGroup.name = "Expression Templates";

    // Add Template Selection dropdown
    var templateSelection = templatesGroup.addProperty("ADBE Dropdown Control");
    templateSelection.name = "Template Selection";
    var templateMenu = templateSelection.property("ADBE Dropdown Control-0");

    // Set template menu items
    var templateItems = [
      "Custom Position",
      "Custom Scale",
      "Custom Rotation",
      "Custom Opacity",
      "Custom Wiggle",
    ];
    templateMenu.setPropertyParameters({
      items: templateItems,
    });
    templateMenu.setValue(1); // Default to Custom Position

    // Add Template Code text
    var templateCode = templatesGroup.addProperty("ADBE Text Control");
    templateCode.name = "Template Code";
    var textDocument = templateCode.property("ADBE Text Document").value;
    textDocument.text =
      "// Custom expression template\n// Edit this code and apply to selected property";
    templateCode.property("ADBE Text Document").setValue(textDocument);

    // Add Apply Template button
    var applyTemplate = templatesGroup.addProperty("ADBE Button Control");
    applyTemplate.name = "Apply Template";

    // Add Save Template button
    var saveTemplate = templatesGroup.addProperty("ADBE Button Control");
    saveTemplate.name = "Save Template";

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createExpressionTemplateFramework",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createExpressionTemplateFramework: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates a project template system
 * @param {Layer} controlLayer - The control layer to add project template system to
 * @returns {Boolean} Success status
 */
function createProjectTemplateSystem(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Project Templates group
    var projectTemplatesGroup = controlLayer.Effects.addProperty("ADBE Group");
    projectTemplatesGroup.name = "Project Templates";

    // Add Template Type dropdown
    var templateType = projectTemplatesGroup.addProperty(
      "ADBE Dropdown Control"
    );
    templateType.name = "Template Type";
    var typeMenu = templateType.property("ADBE Dropdown Control-0");

    // Set template type menu items
    var typeItems = ["Basic", "Corporate", "Creative", "Title Sequence"];
    typeMenu.setPropertyParameters({
      items: typeItems,
    });
    typeMenu.setValue(1); // Default to Basic

    // Add Create Project button
    var createProject = projectTemplatesGroup.addProperty(
      "ADBE Button Control"
    );
    createProject.name = "Create Project";

    // Add Template Description text
    var templateDescription =
      projectTemplatesGroup.addProperty("ADBE Text Control");
    templateDescription.name = "Template Description";
    var textDocument = templateDescription.property("ADBE Text Document").value;
    textDocument.text =
      "Select a template type and click Create Project to generate a new project with the selected template";
    templateDescription.property("ADBE Text Document").setValue(textDocument);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createProjectTemplateSystem",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createProjectTemplateSystem: " + error.toString());
    }
    return false;
  }
}

/**
 * Implements automatic update checking mechanism
 * @param {Layer} controlLayer - The control layer to add update checking to
 * @returns {Boolean} Success status
 */
function createUpdateCheckingSystem(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Update System group
    var updateGroup = controlLayer.Effects.addProperty("ADBE Group");
    updateGroup.name = "Update System";

    // Add Check for Updates button
    var checkUpdates = updateGroup.addProperty("ADBE Button Control");
    checkUpdates.name = "Check for Updates";

    // Add Auto Check checkbox
    var autoCheck = updateGroup.addProperty("ADBE Checkbox Control");
    autoCheck.name = "Auto Check on Startup";
    autoCheck.property("ADBE Checkbox Control-0").setValue(1); // Default to on

    // Add Update Status text
    var updateStatus = updateGroup.addProperty("ADBE Text Control");
    updateStatus.name = "Update Status";
    var textDocument = updateStatus.property("ADBE Text Document").value;
    textDocument.text =
      "Current version: " + TEXTSELECTOR_VERSION + "\nLast checked: Never";
    updateStatus.property("ADBE Text Document").setValue(textDocument);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createUpdateCheckingSystem",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createUpdateCheckingSystem: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates migration tools for transitioning from v1.x projects
 * @param {Layer} controlLayer - The control layer to add migration tools to
 * @returns {Boolean} Success status
 */
function createMigrationTools(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Migration Tools group
    var migrationGroup = controlLayer.Effects.addProperty("ADBE Group");
    migrationGroup.name = "Migration Tools";

    // Add Detect v1.x Presets button
    var detectPresets = migrationGroup.addProperty("ADBE Button Control");
    detectPresets.name = "Detect v1.x Presets";

    // Add Convert Selected Layer button
    var convertLayer = migrationGroup.addProperty("ADBE Button Control");
    convertLayer.name = "Convert Selected Layer";

    // Add Convert All Layers button
    var convertAllLayers = migrationGroup.addProperty("ADBE Button Control");
    convertAllLayers.name = "Convert All Layers";

    // Add Migration Status text
    var migrationStatus = migrationGroup.addProperty("ADBE Text Control");
    migrationStatus.name = "Migration Status";
    var textDocument = migrationStatus.property("ADBE Text Document").value;
    textDocument.text =
      "Use these tools to migrate from TextSelector v1.x to v2.x";
    migrationStatus.property("ADBE Text Document").setValue(textDocument);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(error, "createMigrationTools", DEBUG_LEVELS.ERROR);
    } else {
      alert("Error in createMigrationTools: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates installation system with clear instructions
 * @param {Layer} controlLayer - The control layer to add installation system to
 * @returns {Boolean} Success status
 */
function createInstallationSystem(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    // Create Installation System group
    var installationGroup = controlLayer.Effects.addProperty("ADBE Group");
    installationGroup.name = "Installation System";

    // Add Installation Instructions text
    var installationInstructions =
      installationGroup.addProperty("ADBE Text Control");
    installationInstructions.name = "Installation Instructions";
    var textDocument =
      installationInstructions.property("ADBE Text Document").value;
    textDocument.text =
      "TextSelector Installation Instructions:\n\n" +
      "1. Copy all .jsx files to your After Effects Scripts folder:\n" +
      "   - Windows: C:\\Program Files\\Adobe\\Adobe After Effects [version]\\Support Files\\Scripts\n" +
      "   - Mac: /Applications/Adobe After Effects [version]/Scripts\n\n" +
      "2. Restart After Effects\n\n" +
      "3. Go to File > Scripts > TextSelector_Main.jsx\n\n" +
      "System Requirements:\n" +
      "- After Effects CC 2019 (16.0) or later\n" +
      "- 4GB RAM minimum, 8GB recommended";
    installationInstructions
      .property("ADBE Text Document")
      .setValue(textDocument);

    // Add Check Dependencies button
    var checkDependencies = installationGroup.addProperty(
      "ADBE Button Control"
    );
    checkDependencies.name = "Check Dependencies";

    // Add Installation Status text
    var installationStatus = installationGroup.addProperty("ADBE Text Control");
    installationStatus.name = "Installation Status";
    var textDocument = installationStatus.property("ADBE Text Document").value;
    textDocument.text = "TextSelector is currently installed and running.";
    installationStatus.property("ADBE Text Document").setValue(textDocument);

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createInstallationSystem",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createInstallationSystem: " + error.toString());
    }
    return false;
  }
}

/**
 * Creates all advanced features and preset systems
 * @param {Layer} controlLayer - The control layer to add systems to
 * @returns {Boolean} Success status
 */
function createAdvancedFeatures(controlLayer) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate control layer
    errorHandler.validateLayer(controlLayer);

    app.beginUndoGroup("Create TextSelector Advanced Features");

    // Create preset system
    createPresetSystem(controlLayer);

    // Create expression template framework
    createExpressionTemplateFramework(controlLayer);

    // Create project template system
    createProjectTemplateSystem(controlLayer);

    // Create update checking system
    createUpdateCheckingSystem(controlLayer);

    // Create migration tools
    createMigrationTools(controlLayer);

    // Create installation system
    createInstallationSystem(controlLayer);

    // Load custom presets from files
    loadPresetsFromFiles();

    app.endUndoGroup();

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "createAdvancedFeatures",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in createAdvancedFeatures: " + error.toString());
    }

    if (app.undoGroup) {
      app.endUndoGroup();
    }

    return false;
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createPresetSystem: createPresetSystem,
    applyPreset: applyPreset,
    saveCustomPreset: saveCustomPreset,
    loadPresetsFromFiles: loadPresetsFromFiles,
    createExpressionTemplateFramework: createExpressionTemplateFramework,
    createProjectTemplateSystem: createProjectTemplateSystem,
    createUpdateCheckingSystem: createUpdateCheckingSystem,
    createMigrationTools: createMigrationTools,
    createInstallationSystem: createInstallationSystem,
    createAdvancedFeatures: createAdvancedFeatures,
    PRESET_LIBRARY: PRESET_LIBRARY,
    PRESET_CATEGORIES: PRESET_CATEGORIES,
  };
}
