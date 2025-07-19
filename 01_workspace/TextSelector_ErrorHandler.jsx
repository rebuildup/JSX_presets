//@target aftereffects

/**
 * TextSelector_ErrorHandler.jsx
 * Comprehensive error handling and debugging system for the Text Selector Modular System
 * Version: 2.0.1
 */

// Debug levels
var DEBUG_LEVELS = {
  NONE: 0, // No logging
  ERROR: 1, // Critical errors only
  WARNING: 2, // Warnings and errors
  INFO: 3, // Informational messages
  VERBOSE: 4, // Detailed execution logging
};

// Error types for classification
var ERROR_TYPES = {
  // Layer and effect errors
  LAYER_NOT_FOUND: "Layer not found",
  EFFECT_NOT_FOUND: "Effect not found",
  PROPERTY_NOT_FOUND: "Property not found",

  // Expression errors
  EXPRESSION_ERROR: "Expression error",
  EXPRESSION_SYNTAX_ERROR: "Expression syntax error",
  EXPRESSION_REFERENCE_ERROR: "Expression reference error",

  // Script errors
  SCRIPT_ERROR: "Script error",
  INITIALIZATION_ERROR: "Initialization error",
  VALIDATION_ERROR: "Validation error",
  PARAMETER_ERROR: "Parameter error",

  // System errors
  SYSTEM_ERROR: "System error",
  MEMORY_ERROR: "Memory error",
  PERMISSION_ERROR: "Permission error",

  // After Effects specific errors
  AE_VERSION_ERROR: "After Effects version error",
  COMP_NOT_FOUND: "Composition not found",
  TEXT_LAYER_ERROR: "Text layer error",
  ANIMATOR_ERROR: "Text animator error",
};

// Error severity levels
var ERROR_SEVERITY = {
  CRITICAL: 3, // Application may crash or be unusable
  HIGH: 2, // Feature completely broken
  MEDIUM: 1, // Feature partially broken but usable
  LOW: 0, // Minor issue, cosmetic or non-essential
};

/**
 * Creates an error handler object with logging and safe execution capabilities
 * @returns {Object} Error handler object
 */
function createErrorHandler() {
  return {
    /**
     * Log an error with context and level
     * @param {Error|String} error - The error object or message
     * @param {String} context - Context where the error occurred
     * @param {Number} level - Debug level (from DEBUG_LEVELS)
     * @param {Number} severity - Error severity (from ERROR_SEVERITY)
     */
    logError: function (error, context, level, severity) {
      try {
        var debugMode = getDebugMode();
        if (debugMode && level <= getCurrentDebugLevel()) {
          var timestamp = new Date().toISOString();
          var severityStr = getSeverityName(severity || ERROR_SEVERITY.MEDIUM);
          var message =
            "[" +
            timestamp +
            "] " +
            "[" +
            getLevelName(level) +
            "] " +
            "[" +
            severityStr +
            "] " +
            context +
            ": " +
            error.toString();

          // Log to ExtendScript console
          $.writeln(message);

          // Add stack trace for script errors if available
          if (error && error.stack) {
            $.writeln("Stack trace: " + error.stack);
          }

          // Show alert for critical errors
          if (level <= DEBUG_LEVELS.ERROR || severity >= ERROR_SEVERITY.HIGH) {
            alert("TextSelector Error: " + error.toString());
          }

          // Add to effect comment for persistent debugging info
          try {
            var comp = app.project.activeItem;
            if (comp && comp instanceof CompItem) {
              var controlLayer = findControlLayer(comp);
              if (controlLayer) {
                var debugEffect = controlLayer.effect("Debug Info");
                if (!debugEffect) {
                  debugEffect =
                    controlLayer.Effects.addProperty("ADBE Text Control");
                  debugEffect.name = "Debug Info";
                }
                var currentText =
                  debugEffect.property("ADBE Text Document").value;
                var newText = currentText.text + "\n" + message;
                // Limit log size to prevent performance issues
                if (newText.length > 5000) {
                  newText = "...\n" + newText.substring(newText.length - 5000);
                }
                debugEffect.property("ADBE Text Document").setValue(newText);
              }
            }
          } catch (e) {
            // Fail silently if we can't add to effect comment
          }
        }
      } catch (e) {
        // Fail silently to avoid infinite error loops
      }
    },

    /**
     * Log a message at INFO level
     * @param {String} message - The message to log
     * @param {String} context - Context where the message originated
     */
    logInfo: function (message, context) {
      this.logError(
        message,
        context || "Info",
        DEBUG_LEVELS.INFO,
        ERROR_SEVERITY.LOW
      );
    },

    /**
     * Log a message at WARNING level
     * @param {String} message - The message to log
     * @param {String} context - Context where the message originated
     */
    logWarning: function (message, context) {
      this.logError(
        message,
        context || "Warning",
        DEBUG_LEVELS.WARNING,
        ERROR_SEVERITY.MEDIUM
      );
    },

    /**
     * Log a message at VERBOSE level
     * @param {String} message - The message to log
     * @param {String} context - Context where the message originated
     */
    logVerbose: function (message, context) {
      this.logError(
        message,
        context || "Verbose",
        DEBUG_LEVELS.VERBOSE,
        ERROR_SEVERITY.LOW
      );
    },

    /**
     * Safely execute an operation with error handling
     * @param {Function} operation - Function to execute
     * @param {*} fallbackValue - Value to return if operation fails
     * @param {String} context - Context for error logging
     * @param {Number} level - Debug level for logging (default: ERROR)
     * @returns {*} Result of operation or fallback value
     */
    safeExecute: function (operation, fallbackValue, context, level) {
      try {
        // Measure execution time for performance tracking
        var startTime = new Date().getTime();
        var result = operation();
        var endTime = new Date().getTime();

        // Log execution time for verbose debugging
        if (getDebugMode() && getCurrentDebugLevel() >= DEBUG_LEVELS.VERBOSE) {
          this.logVerbose(
            "Operation completed in " + (endTime - startTime) + "ms",
            context || "Performance"
          );
        }

        return result;
      } catch (error) {
        this.logError(
          error,
          context || "Unknown operation",
          level || DEBUG_LEVELS.ERROR,
          ERROR_SEVERITY.MEDIUM
        );
        return fallbackValue;
      }
    },

    /**
     * Safely execute an operation with retry capability
     * @param {Function} operation - Function to execute
     * @param {*} fallbackValue - Value to return if all retries fail
     * @param {String} context - Context for error logging
     * @param {Number} maxRetries - Maximum number of retry attempts (default: 3)
     * @returns {*} Result of operation or fallback value
     */
    safeExecuteWithRetry: function (
      operation,
      fallbackValue,
      context,
      maxRetries
    ) {
      var retries = maxRetries || 3;
      var result = fallbackValue;
      var success = false;
      var lastError = null;

      for (var i = 0; i < retries && !success; i++) {
        try {
          result = operation();
          success = true;
        } catch (error) {
          lastError = error;
          // Wait briefly before retry (exponential backoff)
          $.sleep(100 * Math.pow(2, i));
        }
      }

      if (!success && lastError) {
        this.logError(
          lastError,
          context || "Retry failed after " + retries + " attempts",
          DEBUG_LEVELS.ERROR,
          ERROR_SEVERITY.HIGH
        );
      } else if (!success) {
        this.logError(
          "Operation failed with no specific error",
          context || "Retry failed after " + retries + " attempts",
          DEBUG_LEVELS.ERROR,
          ERROR_SEVERITY.HIGH
        );
      }

      return result;
    },

    /**
     * Validate that a layer exists
     * @param {Layer} layer - Layer to validate
     * @param {String} layerName - Optional name for error context
     * @throws {Error} If layer is null or undefined
     * @returns {Boolean} True if valid
     */
    validateLayer: function (layer, layerName) {
      if (!layer) {
        var errorMsg = ERROR_TYPES.LAYER_NOT_FOUND;
        if (layerName) {
          errorMsg += ": " + layerName;
        }
        throw new Error(errorMsg);
      }
      return true;
    },

    /**
     * Validate that an effect exists
     * @param {Effect} effect - Effect to validate
     * @param {String} effectName - Optional name for error context
     * @throws {Error} If effect is null or undefined
     * @returns {Boolean} True if valid
     */
    validateEffect: function (effect, effectName) {
      if (!effect) {
        var errorMsg = ERROR_TYPES.EFFECT_NOT_FOUND;
        if (effectName) {
          errorMsg += ": " + effectName;
        }
        throw new Error(errorMsg);
      }
      return true;
    },

    /**
     * Validate that a property exists
     * @param {Property} property - Property to validate
     * @param {String} propertyName - Optional name for error context
     * @throws {Error} If property is null or undefined
     * @returns {Boolean} True if valid
     */
    validateProperty: function (property, propertyName) {
      if (!property) {
        var errorMsg = ERROR_TYPES.PROPERTY_NOT_FOUND;
        if (propertyName) {
          errorMsg += ": " + propertyName;
        }
        throw new Error(errorMsg);
      }
      return true;
    },

    /**
     * Validate that a parameter value meets certain criteria
     * @param {*} value - Value to validate
     * @param {String} paramName - Parameter name for error message
     * @param {Function} validationFn - Function that returns true if valid
     * @throws {Error} If validation fails
     * @returns {Boolean} True if valid
     */
    validateParameter: function (value, paramName, validationFn) {
      if (!validationFn(value)) {
        throw new Error(ERROR_TYPES.PARAMETER_ERROR + ": Invalid " + paramName);
      }
      return true;
    },

    /**
     * Validate After Effects version compatibility
     * @param {String} minVersion - Minimum required version (e.g., "16.0" for CC 2019)
     * @throws {Error} If current version is less than minimum required
     * @returns {Boolean} True if valid
     */
    validateAEVersion: function (minVersion) {
      var currentVersion = app.version;
      if (compareVersions(currentVersion, minVersion) < 0) {
        throw new Error(
          ERROR_TYPES.AE_VERSION_ERROR +
            ": Requires After Effects " +
            minVersion +
            " or later. Current version: " +
            currentVersion
        );
      }
      return true;
    },

    /**
     * Validate that a composition exists and is active
     * @throws {Error} If no active composition exists
     * @returns {CompItem} The active composition
     */
    validateActiveComp: function () {
      var comp = app.project.activeItem;
      if (!comp || !(comp instanceof CompItem)) {
        throw new Error(ERROR_TYPES.COMP_NOT_FOUND + ": No active composition");
      }
      return comp;
    },

    /**
     * Validate that a layer is a text layer
     * @param {Layer} layer - Layer to validate
     * @throws {Error} If layer is not a text layer
     * @returns {Boolean} True if valid
     */
    validateTextLayer: function (layer) {
      this.validateLayer(layer);

      try {
        if (!layer.property("ADBE Text Properties")) {
          throw new Error(
            ERROR_TYPES.TEXT_LAYER_ERROR + ": Layer is not a text layer"
          );
        }
      } catch (e) {
        throw new Error(
          ERROR_TYPES.TEXT_LAYER_ERROR + ": Layer is not a text layer"
        );
      }

      return true;
    },

    /**
     * Create a detailed error report for troubleshooting
     * @param {Error|String} error - The error object or message
     * @param {String} context - Context where the error occurred
     * @returns {String} Formatted error report
     */
    createErrorReport: function (error, context) {
      var report = "TextSelector Error Report\n";
      report += "=======================\n\n";
      report += "Timestamp: " + new Date().toISOString() + "\n";
      report += "Context: " + (context || "Unknown") + "\n";
      report +=
        "Error: " + (error ? error.toString() : "Unknown error") + "\n\n";

      // Add stack trace if available
      if (error && error.stack) {
        report += "Stack Trace:\n" + error.stack + "\n\n";
      }

      // Add system information
      report += "System Information:\n";
      report += "After Effects Version: " + app.version + "\n";
      report += "Operating System: " + $.os + "\n";

      // Add project information
      try {
        report += "\nProject Information:\n";
        report += "Project Name: " + app.project.file.name + "\n";

        var comp = app.project.activeItem;
        if (comp && comp instanceof CompItem) {
          report += "Active Composition: " + comp.name + "\n";
          report +=
            "Composition Resolution: " + comp.width + "x" + comp.height + "\n";
          report += "Composition Frame Rate: " + comp.frameRate + "\n";
        }
      } catch (e) {
        report += "Could not retrieve project information\n";
      }

      return report;
    },
  };
}

/**
 * Check if debug mode is enabled in the control layer
 * @returns {Boolean} True if debug mode is enabled
 */
function getDebugMode() {
  try {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return false;

    var controlLayer = findControlLayer(comp);
    if (!controlLayer) return false;

    return controlLayer.effect("Debug Mode")("Checkbox").value;
  } catch (e) {
    return false;
  }
}

/**
 * Find the TextSelector control layer in a composition
 * @param {CompItem} comp - Composition to search in
 * @returns {Layer|null} Control layer or null if not found
 */
function findControlLayer(comp) {
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).name === "TextSelector_Controls") {
      return comp.layer(i);
    }
  }
  return null;
}

/**
 * Get the current debug level
 * @returns {Number} Debug level from DEBUG_LEVELS
 */
function getCurrentDebugLevel() {
  // Default to ERROR level
  // In a real implementation, this could be configurable
  return DEBUG_LEVELS.ERROR;
}

/**
 * Get the name of a debug level
 * @param {Number} level - Debug level from DEBUG_LEVELS
 * @returns {String} Name of the debug level
 */
function getLevelName(level) {
  switch (level) {
    case DEBUG_LEVELS.NONE:
      return "NONE";
    case DEBUG_LEVELS.ERROR:
      return "ERROR";
    case DEBUG_LEVELS.WARNING:
      return "WARNING";
    case DEBUG_LEVELS.INFO:
      return "INFO";
    case DEBUG_LEVELS.VERBOSE:
      return "VERBOSE";
    default:
      return "UNKNOWN";
  }
}

/**
 * Get the name of a severity level
 * @param {Number} severity - Severity level from ERROR_SEVERITY
 * @returns {String} Name of the severity level
 */
function getSeverityName(severity) {
  switch (severity) {
    case ERROR_SEVERITY.CRITICAL:
      return "CRITICAL";
    case ERROR_SEVERITY.HIGH:
      return "HIGH";
    case ERROR_SEVERITY.MEDIUM:
      return "MEDIUM";
    case ERROR_SEVERITY.LOW:
      return "LOW";
    default:
      return "MEDIUM";
  }
}

/**
 * Compare two version strings
 * @param {String} version1 - First version string (e.g., "16.0.1")
 * @param {String} version2 - Second version string (e.g., "17.1.0")
 * @returns {Number} -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
function compareVersions(version1, version2) {
  var v1parts = version1.split(".").map(function (item) {
    return parseInt(item, 10);
  });
  var v2parts = version2.split(".").map(function (item) {
    return parseInt(item, 10);
  });

  // Ensure both arrays have the same length
  while (v1parts.length < v2parts.length) v1parts.push(0);
  while (v2parts.length < v1parts.length) v2parts.push(0);

  // Compare each part
  for (var i = 0; i < v1parts.length; i++) {
    if (v1parts[i] > v2parts[i]) return 1;
    if (v1parts[i] < v2parts[i]) return -1;
  }

  return 0; // Versions are equal
}

/**
 * Generate a safe expression with error handling
 * @param {String} expressionCode - Expression code to wrap
 * @param {String} fallbackValue - Fallback value if expression fails
 * @returns {String} Expression with try-catch block
 */
function generateSafeExpression(expressionCode, fallbackValue) {
  return "try {" + expressionCode + "} catch (err) {" + fallbackValue + "};";
}

/**
 * Manage After Effects debugger preference for error handling
 * @returns {Number} Original debugger state
 */
function manageDebuggerPreference() {
  try {
    // Save current debugger state
    var debuggerState = app.preferences.getPrefAsLong(
      "Main Pref Section v2",
      "Pref_JAVASCRIPT_DEBUGGER"
    );

    // Temporarily disable debugger for error handling
    if (debuggerState == 1) {
      app.preferences.savePrefAsLong(
        "Main Pref Section v2",
        "Pref_JAVASCRIPT_DEBUGGER",
        0
      );
      app.preferences.saveToDisk();
      app.preferences.reload();
    }

    return debuggerState;
  } catch (e) {
    return 0;
  }
}

/**
 * Restore After Effects debugger preference
 * @param {Number} originalState - Original debugger state to restore
 */
function restoreDebuggerPreference(originalState) {
  try {
    if (originalState == 1) {
      app.preferences.savePrefAsLong(
        "Main Pref Section v2",
        "Pref_JAVASCRIPT_DEBUGGER",
        1
      );
      app.preferences.saveToDisk();
      app.preferences.reload();
    }
  } catch (e) {
    // Fail silently
  }
}

// Export error handling functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEBUG_LEVELS: DEBUG_LEVELS,
    ERROR_TYPES: ERROR_TYPES,
    createErrorHandler: createErrorHandler,
    getDebugMode: getDebugMode,
    getCurrentDebugLevel: getCurrentDebugLevel,
    getLevelName: getLevelName,
    generateSafeExpression: generateSafeExpression,
    manageDebuggerPreference: manageDebuggerPreference,
    restoreDebuggerPreference: restoreDebuggerPreference,
  };
}
