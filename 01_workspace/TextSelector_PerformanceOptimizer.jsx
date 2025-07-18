//@target aftereffects

/**
 * TextSelector_PerformanceOptimizer.jsx
 * Performance optimization and memory management for the Text Selector Modular System
 * Provides optimizations for multi-frame rendering, memory usage, and expression evaluation
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

/**
 * Applies performance optimizations to expressions
 * @param {String} expression - The expression to optimize
 * @param {Object} options - Optimization options
 * @returns {String} The optimized expression
 */
function optimizeExpressionPerformance(expression, options) {
  options = options || {};

  // Apply multi-frame rendering compatibility
  if (options.multiFrameRendering !== false) {
    expression = makeMultiFrameRenderingCompatible(expression);
  }

  // Apply variable caching
  if (options.cacheVariables !== false) {
    expression = applyCachingOptimization(expression);
  }

  // Apply early exit optimization
  if (options.earlyExit !== false) {
    expression = applyEarlyExitOptimization(expression);
  }

  // Apply posterizeTime optimization
  if (options.posterizeTime !== false) {
    expression = applyPosterizeTimeOptimization(expression);
  }

  // Apply JavaScript engine optimizations
  if (options.jsEngineOptimize !== false) {
    expression = applyJSEngineOptimizations(expression);
  }

  return expression;
}

/**
 * Makes an expression compatible with multi-frame rendering
 * @param {String} expression - The expression to modify
 * @returns {String} The modified expression
 */
function makeMultiFrameRenderingCompatible(expression) {
  // Check if the expression already has MFR compatibility
  if (expression.indexOf("// MFR Compatible") !== -1) {
    return expression;
  }

  // Add MFR compatibility comment
  var mfrComment = "// MFR Compatible - Stateless expression\n";

  // Replace non-deterministic functions with deterministic alternatives
  var mfrCompatible = expression
    // Replace random() with seedRandom() if not already using seedRandom
    .replace(/random\(([^)]+)\)/g, function (match, args) {
      if (expression.indexOf("seedRandom") === -1) {
        return "seedRandom(seed, true); random(" + args + ")";
      }
      return match;
    })
    // Ensure time-based calculations are deterministic
    .replace(/time\s*\+\s*random\(/g, "time + seedRandom(seed, true); random(");

  return mfrComment + mfrCompatible;
}

/**
 * Applies variable caching optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyCachingOptimization(expression) {
  // This is a more comprehensive implementation than the one in ExpressionOptimizer

  // Check if the expression already has caching
  if (expression.indexOf("var ctrlLayer = thisComp.layer") !== -1) {
    return expression; // Already optimized
  }

  var optimized = expression;

  // Cache control layer reference
  var layerMatch = expression.match(/thisComp\.layer\(["']([^"']+)["']\)/);
  if (layerMatch && layerMatch[1]) {
    var layerName = layerMatch[1];
    var cachingCode = 'var ctrlLayer = thisComp.layer("' + layerName + '");\n';

    // Replace direct layer references with cached variable
    optimized = optimized.replace(
      new RegExp("thisComp\\.layer\\([\"']" + layerName + "[\"']\\)", "g"),
      "ctrlLayer"
    );

    // Add caching code at the beginning of the expression
    optimized = cachingCode + optimized;
  }

  // Cache frequently accessed effect properties
  var effectMatches = optimized.match(/ctrlLayer\.effect\(["']([^"']+)["']\)/g);
  if (effectMatches) {
    var uniqueEffects = {};

    // Find unique effect references
    for (var i = 0; i < effectMatches.length; i++) {
      var effectMatch = effectMatches[i].match(
        /ctrlLayer\.effect\(["']([^"']+)["']\)/
      );
      if (effectMatch && effectMatch[1]) {
        uniqueEffects[effectMatch[1]] = true;
      }
    }

    // Create caching code for each unique effect
    var effectCachingCode = "";
    for (var effectName in uniqueEffects) {
      if (uniqueEffects.hasOwnProperty(effectName)) {
        var varName =
          effectName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() + "Effect";
        effectCachingCode +=
          "var " + varName + ' = ctrlLayer.effect("' + effectName + '");\n';

        // Replace direct effect references with cached variable
        optimized = optimized.replace(
          new RegExp(
            "ctrlLayer\\.effect\\([\"']" + effectName + "[\"']\\)",
            "g"
          ),
          varName
        );
      }
    }

    // Add effect caching code after layer caching
    if (effectCachingCode) {
      var insertPoint = optimized.indexOf("\n") + 1;
      optimized =
        optimized.substring(0, insertPoint) +
        effectCachingCode +
        optimized.substring(insertPoint);
    }
  }

  // Cache composition properties
  if (optimized.indexOf("thisComp.") !== -1) {
    var compCachingCode = "";

    if (optimized.indexOf("thisComp.width") !== -1) {
      compCachingCode += "var compWidth = thisComp.width;\n";
      optimized = optimized.replace(/thisComp\.width/g, "compWidth");
    }

    if (optimized.indexOf("thisComp.height") !== -1) {
      compCachingCode += "var compHeight = thisComp.height;\n";
      optimized = optimized.replace(/thisComp\.height/g, "compHeight");
    }

    if (optimized.indexOf("thisComp.frameDuration") !== -1) {
      compCachingCode += "var frameDuration = thisComp.frameDuration;\n";
      optimized = optimized.replace(
        /thisComp\.frameDuration/g,
        "frameDuration"
      );
    }

    // Add comp caching code at an appropriate position
    if (compCachingCode) {
      var insertPoint =
        optimized.indexOf("\n", optimized.indexOf("var ctrlLayer")) + 1;
      optimized =
        optimized.substring(0, insertPoint) +
        compCachingCode +
        optimized.substring(insertPoint);
    }
  }

  return optimized;
}

/**
 * Applies early exit optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyEarlyExitOptimization(expression) {
  // This is a more comprehensive implementation than the one in ExpressionOptimizer

  // Check if the expression already has early exit
  if (expression.indexOf("if (!globalEnable)") !== -1) {
    return expression; // Already optimized
  }

  var optimized = expression;

  // Add global enable check if not present
  if (optimized.indexOf("globalEnable") !== -1) {
    // Determine the appropriate default value based on expression content
    var defaultValue = getDefaultValueForExpression(optimized);

    var earlyExitCode = `
// Early exit if disabled
if (!globalEnable) {
  ${defaultValue};
} else {
`;

    // Find a good insertion point after variable declarations
    var insertPoint = optimized.indexOf("var globalEnable");
    if (insertPoint !== -1) {
      insertPoint = optimized.indexOf("\n", insertPoint) + 1;

      // Find the end of variable declarations
      var nextVarPos = optimized.indexOf("var ", insertPoint);
      while (nextVarPos !== -1 && nextVarPos < insertPoint + 100) {
        insertPoint = optimized.indexOf("\n", nextVarPos) + 1;
        nextVarPos = optimized.indexOf("var ", insertPoint);
      }

      // Insert early exit code
      optimized =
        optimized.substring(0, insertPoint) +
        earlyExitCode +
        optimized.substring(insertPoint) +
        "\n}";
    }
  }

  // Add wiggle-specific early exit if applicable
  if (
    optimized.indexOf("wiggleEnabled") !== -1 &&
    optimized.indexOf("if (!wiggleEnabled)") === -1
  ) {
    var wiggleDefaultValue = getDefaultValueForExpression(optimized);

    var wiggleEarlyExitCode = `
// Early exit if wiggle disabled
if (!wiggleEnabled) {
  ${wiggleDefaultValue};
} else {
`;

    // Find a good insertion point after wiggleEnabled declaration
    var wiggleInsertPoint = optimized.indexOf("var wiggleEnabled");
    if (wiggleInsertPoint !== -1) {
      wiggleInsertPoint = optimized.indexOf("\n", wiggleInsertPoint) + 1;

      // Insert wiggle early exit code
      var wiggleOptimized =
        optimized.substring(0, wiggleInsertPoint) + wiggleEarlyExitCode;

      // Find where to close the wiggle conditional block
      if (optimized.indexOf("} else {") !== -1) {
        // If there's already an else block, insert before it
        var elsePos = optimized.lastIndexOf("} else {");
        wiggleOptimized +=
          optimized.substring(wiggleInsertPoint, elsePos) + "\n}";
        wiggleOptimized += optimized.substring(elsePos);
      } else {
        // Otherwise, close at the end
        wiggleOptimized += optimized.substring(wiggleInsertPoint) + "\n}";
      }

      optimized = wiggleOptimized;
    }
  }

  return optimized;
}

/**
 * Applies posterizeTime optimization to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyPosterizeTimeOptimization(expression) {
  // Check if the expression already has posterizeTime
  if (expression.indexOf("posterizeTime(") !== -1) {
    return expression; // Already has posterizeTime
  }

  var optimized = expression;

  // Add posterizeTime for time-based animations
  if (
    optimized.indexOf("valueAtTime") !== -1 ||
    optimized.indexOf("wiggle(") !== -1 ||
    optimized.indexOf("time") !== -1
  ) {
    // Create posterize code
    var posterizeCode = `
// Apply posterize time for performance
var posti = effect("Posterize(0=FPS)")("Slider");
posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
`;

    // Replace with cached version if applicable
    if (
      optimized.indexOf("var frameDuration = thisComp.frameDuration") !== -1
    ) {
      posterizeCode = posterizeCode.replace(
        "thisComp.frameDuration",
        "frameDuration"
      );
    }

    // Find a good insertion point after variable declarations
    var insertPoint = optimized.indexOf("var ");
    if (insertPoint !== -1) {
      // Find the end of variable declarations
      while (
        optimized.indexOf("var ", insertPoint + 4) !== -1 &&
        optimized.indexOf("var ", insertPoint + 4) < insertPoint + 200
      ) {
        insertPoint = optimized.indexOf("var ", insertPoint + 4);
      }
      insertPoint = optimized.indexOf("\n", insertPoint) + 1;

      // Insert posterize code
      optimized =
        optimized.substring(0, insertPoint) +
        posterizeCode +
        optimized.substring(insertPoint);
    }
  }

  return optimized;
}

/**
 * Applies JavaScript engine optimizations to an expression
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applyJSEngineOptimizations(expression) {
  var optimized = expression;

  // Use strict mode for better performance
  if (optimized.indexOf("'use strict';") === -1) {
    optimized = "'use strict';\n" + optimized;
  }

  // Optimize array creation
  optimized = optimized.replace(/new Array\(([^)]+)\)/g, "[]");

  // Optimize object creation
  optimized = optimized.replace(/new Object\(\)/g, "{}");

  // Optimize Math.floor for integer conversion
  optimized = optimized.replace(/Math\.floor\(([^)]+)\)/g, "~~($1)");

  // Use local variables instead of with statements
  if (optimized.indexOf("with(") !== -1) {
    optimized = optimized.replace(
      /with\s*\(([^)]+)\)\s*{([^}]+)}/g,
      function (match, obj, code) {
        return "var obj = " + obj + ";\n" + code.replace(/this\./g, "obj.");
      }
    );
  }

  // Optimize loops
  optimized = optimized.replace(
    /for\s*\(var i=0;\s*i<([^;]+);\s*i\+\+\)/g,
    "for (var i=0, len=$1; i<len; i++)"
  );

  return optimized;
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
  } else if (
    expression.indexOf("rotation") !== -1 ||
    expression.indexOf("Rotation") !== -1
  ) {
    return "0";
  } else if (
    expression.indexOf("scale") !== -1 ||
    expression.indexOf("Scale") !== -1
  ) {
    return "[100, 100]";
  } else if (
    expression.indexOf("position") !== -1 ||
    expression.indexOf("Position") !== -1
  ) {
    return "[0, 0, 0]";
  } else {
    return "0";
  }
}

/**
 * Optimizes memory usage in expressions
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function optimizeMemoryUsage(expression) {
  var optimized = expression;

  // Avoid large array creation
  if (optimized.indexOf("new Array(") !== -1) {
    optimized = optimized.replace(
      /new Array\(([^)]+)\)/g,
      function (match, size) {
        // If size is a large number, use a more memory-efficient approach
        if (!isNaN(size) && parseInt(size) > 1000) {
          return "[]";
        }
        return match;
      }
    );
  }

  // Avoid memory leaks from closures
  if (optimized.indexOf("function(") !== -1) {
    optimized = optimized.replace(
      /function\s*\(([^)]*)\)\s*{([^}]*)}/g,
      function (match, params, body) {
        // Add explicit variable declarations to avoid leaks
        var vars = [];
        var varRegex = /var\s+([a-zA-Z0-9_]+)/g;
        var varMatch;

        while ((varMatch = varRegex.exec(body)) !== null) {
          vars.push(varMatch[1]);
        }

        // Find variables used but not declared
        var usedVars = [];
        var bodyWithoutStrings = body
          .replace(/"[^"]*"/g, "")
          .replace(/'[^']*'/g, "");
        var identifierRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
        var idMatch;

        while ((idMatch = identifierRegex.exec(bodyWithoutStrings)) !== null) {
          var id = idMatch[0];
          if (
            vars.indexOf(id) === -1 &&
            usedVars.indexOf(id) === -1 &&
            params.indexOf(id) === -1 &&
            [
              "if",
              "else",
              "for",
              "while",
              "return",
              "var",
              "function",
              "true",
              "false",
              "null",
              "undefined",
            ].indexOf(id) === -1
          ) {
            usedVars.push(id);
          }
        }

        // Add declarations for used variables
        var newBody = body;
        if (usedVars.length > 0) {
          newBody = "var " + usedVars.join(", ") + ";\n" + body;
        }

        return "function(" + params + ") {" + newBody + "}";
      }
    );
  }

  return optimized;
}

/**
 * Creates render queue integration for batch processing optimization
 * @param {CompItem} comp - The composition to process
 * @returns {Boolean} Success status
 */
function optimizeForRenderQueue(comp) {
  try {
    // Create error handler
    var errorHandler = createErrorHandler();

    // Validate composition
    errorHandler.validateParameter(comp, "comp", function (val) {
      return val && val instanceof CompItem;
    });

    // Find all text layers in the composition
    var textLayers = [];
    for (var i = 1; i <= comp.numLayers; i++) {
      var layer = comp.layer(i);
      if (layer.property("ADBE Text Properties")) {
        textLayers.push(layer);
      }
    }

    // Find control layer
    var controlLayer = null;
    for (var i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "TextSelector_Controls") {
        controlLayer = comp.layer(i);
        break;
      }
    }

    if (!controlLayer) {
      errorHandler.logError(
        "Control layer not found",
        "optimizeForRenderQueue",
        DEBUG_LEVELS.ERROR
      );
      return false;
    }

    // Add render optimization effect to control layer
    var renderOptEffect = controlLayer.Effects.addProperty("ADBE Group");
    renderOptEffect.name = "Render Optimization";

    // Add optimization level dropdown
    var optimizationLevel = renderOptEffect.addProperty(
      "ADBE Dropdown Control"
    );
    optimizationLevel.name = "Optimization Level";
    optimizationLevel.property("ADBE Dropdown Control-0").setValue(2); // Default: Medium

    // Add optimization options
    var useMultiFrameRendering = renderOptEffect.addProperty(
      "ADBE Checkbox Control"
    );
    useMultiFrameRendering.name = "Use Multi-Frame Rendering";
    useMultiFrameRendering.property("ADBE Checkbox Control-0").setValue(1); // Default: On

    var usePosterizeTime = renderOptEffect.addProperty("ADBE Checkbox Control");
    usePosterizeTime.name = "Use PosterizeTime";
    usePosterizeTime.property("ADBE Checkbox Control-0").setValue(1); // Default: On

    var optimizeMemory = renderOptEffect.addProperty("ADBE Checkbox Control");
    optimizeMemory.name = "Optimize Memory Usage";
    optimizeMemory.property("ADBE Checkbox Control-0").setValue(1); // Default: On

    // Add render queue comment with optimization info
    var renderQueueItem = app.project.renderQueue.items.add(comp);
    renderQueueItem.comment =
      "TextSelector optimized for rendering. Optimization level: Medium";

    return true;
  } catch (error) {
    if (errorHandler) {
      errorHandler.logError(
        error,
        "optimizeForRenderQueue",
        DEBUG_LEVELS.ERROR
      );
    } else {
      alert("Error in optimizeForRenderQueue: " + error.toString());
    }
    return false;
  }
}

/**
 * Applies smart expression evaluation with conditional execution
 * @param {String} expression - The expression to optimize
 * @returns {String} The optimized expression
 */
function applySmartExpressionEvaluation(expression) {
  var optimized = expression;

  // Add conditional evaluation for expensive operations
  if (optimized.indexOf("wiggle(") !== -1) {
    // Optimize wiggle calls with conditional execution
    optimized = optimized.replace(
      /wiggle\s*\(([^)]+)\)/g,
      function (match, args) {
        return "shouldEvaluate ? wiggle(" + args + ") : [0, 0]";
      }
    );

    // Add shouldEvaluate variable if not present
    if (optimized.indexOf("var shouldEvaluate") === -1) {
      var insertPoint = optimized.indexOf("var ");
      if (insertPoint !== -1) {
        optimized =
          optimized.substring(0, insertPoint) +
          'var shouldEvaluate = effect("Global Enable")("Checkbox") && time >= inPoint;\n' +
          optimized.substring(insertPoint);
      }
    }
  }

  // Optimize valueAtTime calls
  if (optimized.indexOf("valueAtTime") !== -1) {
    // Cache time calculations for valueAtTime
    optimized = optimized.replace(
      /valueAtTime\s*\(\s*time\s*-\s*([^)]+)\)/g,
      function (match, timeOffset) {
        return "valueAtTime(cachedTime - (" + timeOffset + "))";
      }
    );

    // Add cachedTime variable if not present
    if (optimized.indexOf("var cachedTime") === -1) {
      var insertPoint = optimized.indexOf("var ");
      if (insertPoint !== -1) {
        optimized =
          optimized.substring(0, insertPoint) +
          "var cachedTime = time;\n" +
          optimized.substring(insertPoint);
      }
    }
  }

  return optimized;
}

/**
 * Applies all performance optimizations to an expression
 * @param {String} expression - The expression to optimize
 * @param {Object} options - Optimization options
 * @returns {String} The fully optimized expression
 */
function applyAllOptimizations(expression, options) {
  // Apply optimizations in sequence
  var optimized = expression;

  // Apply memory optimizations first
  optimized = optimizeMemoryUsage(optimized);

  // Apply performance optimizations
  optimized = optimizeExpressionPerformance(optimized, options);

  // Apply smart evaluation
  optimized = applySmartExpressionEvaluation(optimized);

  return optimized;
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    optimizeExpressionPerformance: optimizeExpressionPerformance,
    makeMultiFrameRenderingCompatible: makeMultiFrameRenderingCompatible,
    applyCachingOptimization: applyCachingOptimization,
    applyEarlyExitOptimization: applyEarlyExitOptimization,
    applyPosterizeTimeOptimization: applyPosterizeTimeOptimization,
    applyJSEngineOptimizations: applyJSEngineOptimizations,
    getDefaultValueForExpression: getDefaultValueForExpression,
    optimizeMemoryUsage: optimizeMemoryUsage,
    optimizeForRenderQueue: optimizeForRenderQueue,
    applySmartExpressionEvaluation: applySmartExpressionEvaluation,
    applyAllOptimizations: applyAllOptimizations,
  };
}
