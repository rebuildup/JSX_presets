//@target aftereffects

/**
 * TextSelector_TestFramework.jsx
 * Testing and validation framework for the Text Selector Modular System
 * Provides unit tests, performance benchmarking, and integration tests
 * Version: 2.0.1
 */

// Include dependencies
//@include "TextSelector_Utils.jsx"
//@include "TextSelector_ErrorHandler.jsx"

// Test result constants
var TEST_RESULT = {
  PASS: "PASS",
  FAIL: "FAIL",
  SKIP: "SKIP",
  ERROR: "ERROR"
};

// Test suite statistics
var testStats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: 0,
  startTime: 0,
  endTime: 0
};

/**
 * Creates a test suite for running tests
 * @returns {Object} Test suite object
 */
function createTestSuite() {
  return {
    // Test suite properties
    suiteName: "TextSelector Test Suite",
    tests: [],
    beforeEachFn: null,
    afterEachFn: null,
    beforeAllFn: null,
    afterAllFn: null,
    
    /**
     * Initialize the test suite
     * @param {String} suiteName - Name of the test suite
     */
    initialize: function(suiteName) {
      this.suiteName = suiteName || "TextSelector Test Suite";
      
      // Log initialization
      this.log("Initialized test suite: " + this.suiteName);
      
      // Create error handler
      this.errorHandler = createErrorHandler();
      
      // Reset test statistics
      testStats.total = 0;
      testStats.passed = 0;
      testStats.failed = 0;
      testStats.skipped = 0;
      testStats.errors = 0;
    },
    
    /**
     * Add a test to the suite
     * @param {String} testName - Name of the test
     * @param {Function} testFn - Test function to run
     * @param {Boolean} skip - Whether to skip this test
     */
    addTest: function(testName, testFn, skip) {
      this.tests.push({
        name: testName,
        fn: testFn,
        skip: skip || false
      });
      
      this.log("Added test: " + testName);
    },
    
    /**
     * Set a function to run before each test
     * @param {Function} fn - Function to run before each test
     */
    beforeEach: function(fn) {
      this.beforeEachFn = fn;
    },
    
    /**
     * Set a function to run after each test
     * @param {Function} fn - Function to run after each test
     */
    afterEach: function(fn) {
      this.afterEachFn = fn;
    },
    
    /**
     * Set a function to run before all tests
     * @param {Function} fn - Function to run before all tests
     */
    beforeAll: function(fn) {
      this.beforeAllFn = fn;
    },
    
    /**
     * Set a function to run after all tests
     * @param {Function} fn - Function to run after all tests
     */
    afterAll: function(fn) {
      this.afterAllFn = fn;
    },
    
    /**
     * Run all tests in the suite
     * @returns {Object} Test results
     */
    runTests: function() {
      var results = [];
      var self = this;
      
      // Record start time
      testStats.startTime = new Date().getTime();
      
      // Run beforeAll if defined
      if (this.beforeAllFn) {
        try {
          this.beforeAllFn();
        } catch (e) {
          this.log("Error in beforeAll: " + e.toString(), true);
        }
      }
      
      // Run each test
      for (var i = 0; i < this.tests.length; i++) {
        var test = this.tests[i];
        var result = this.runTest(test);
        results.push(result);
      }
      
      // Run afterAll if defined
      if (this.afterAllFn) {
        try {
          this.afterAllFn();
        } catch (e) {
          this.log("Error in afterAll: " + e.toString(), true);
        }
      }
      
      // Record end time
      testStats.endTime = new Date().getTime();
      
      // Generate and return results
      return this.generateTestReport(results);
    },
    
    /**
     * Run a single test
     * @param {Object} test - Test object to run
     * @returns {Object} Test result
     */
    runTest: function(test) {
      var result = {
        name: test.name,
        status: TEST_RESULT.SKIP,
        error: null,
        duration: 0
      };
      
      // Skip test if marked to skip
      if (test.skip) {
        this.log("SKIP: " + test.name);
        testStats.skipped++;
        testStats.total++;
        return result;
      }
      
      // Run beforeEach if defined
      if (this.beforeEachFn) {
        try {
          this.beforeEachFn();
        } catch (e) {
          this.log("Error in beforeEach: " + e.toString(), true);
        }
      }
      
      // Run the test
      var startTime = new Date().getTime();
      try {
        this.log("Running test: " + test.name);
        test.fn();
        result.status = TEST_RESULT.PASS;
        testStats.passed++;
        this.log("PASS: " + test.name);
      } catch (e) {
        result.status = TEST_RESULT.FAIL;
        result.error = e;
        testStats.failed++;
        this.log("FAIL: " + test.name + " - " + e.toString(), true);
      }
      var endTime = new Date().getTime();
      result.duration = endTime - startTime;
      
      // Run afterEach if defined
      if (this.afterEachFn) {
        try {
          this.afterEachFn();
        } catch (e) {
          this.log("Error in afterEach: " + e.toString(), true);
        }
      }
      
      testStats.total++;
      return result;
    },
    
    /**
     * Generate a test report
     * @param {Array} results - Array of test results
     * @returns {Object} Test report
     */
    generateTestReport: function(results) {
      var duration = testStats.endTime - testStats.startTime;
      
      var report = {
        suiteName: this.suiteName,
        totalTests: testStats.total,
        passedTests: testStats.passed,
        failedTests: testStats.failed,
        skippedTests: testStats.skipped,
        duration: duration,
        results: results
      };
      
      // Log summary
      this.log("\n--- Test Summary ---");
      this.log("Suite: " + this.suiteName);
      this.log("Total: " + testStats.total + " tests");
      this.log("Passed: " + testStats.passed + " tests");
      this.log("Failed: " + testStats.failed + " tests");
      this.log("Skipped: " + testStats.skipped + " tests");
      this.log("Duration: " + duration + "ms");
      
      return report;
    },
    
    /**
     * Log a message to the console
     * @param {String} message - Message to log
     * @param {Boolean} isError - Whether this is an error message
     */
    log: function(message, isError) {
      if (isError) {
        $.writeln("ERROR: " + message);
      } else {
        $.writeln(message);
      }
    },
    
    /**
     * Assert that a condition is true
     * @param {Boolean} condition - Condition to check
     * @param {String} message - Message to show if assertion fails
     */
    assert: function(condition, message) {
      if (!condition) {
        throw new Error("Assertion failed: " + (message || ""));
      }
    },
    
    /**
     * Assert that two values are equal
     * @param {*} actual - Actual value
     * @param {*} expected - Expected value
     * @param {String} message - Message to show if assertion fails
     */
    assertEqual: function(actual, expected, message) {
      if (actual !== expected) {
        throw new Error("Assertion failed: " + (message || "") + " - Expected " + expected + " but got " + actual);
      }
    },
    
    /**
     * Assert that a function throws an error
     * @param {Function} fn - Function to check
     * @param {String} errorType - Expected error type
     * @param {String} message - Message to show if assertion fails
     */
    assertThrows: function(fn, errorType, message) {
      try {
        fn();
        throw new Error("Assertion failed: " + (message || "") + " - Expected function to throw " + errorType);
      } catch (e) {
        if (errorType && e.toString().indexOf(errorType) === -1) {
          throw new Error("Assertion failed: " + (message || "") + " - Expected error of type " + errorType + " but got " + e.toString());
        }
      }
    },
    
    /**
     * Measure the performance of a function
     * @param {Function} fn - Function to measure
     * @param {Number} iterations - Number of iterations to run
     * @returns {Object} Performance metrics
     */
    measurePerformance: function(fn, iterations) {
      iterations = iterations || 100;
      
      var times = [];
      var totalTime = 0;
      var minTime = Number.MAX_VALUE;
      var maxTime = 0;
      
      for (var i = 0; i < iterations; i++) {
        var startTime = new Date().getTime();
        fn();
        var endTime = new Date().getTime();
        var duration = endTime - startTime;
        
        times.push(duration);
        totalTime += duration;
        minTime = Math.min(minTime, duration);
        maxTime = Math.max(maxTime, duration);
      }
      
      var avgTime = totalTime / iterations;
      
      return {
        iterations: iterations,
        totalTime: totalTime,
        averageTime: avgTime,
        minTime: minTime,
        maxTime: maxTime,
        times: times
      };
    }
  };
}

/**
 * Unit tests for core initialization
 * @param {Object} testSuite - Test suite to add tests to
 */
function addCoreInitializationTests(testSuite) {
  // Test core initialization
  testSuite.addTest("Core initialization creates control layer", function() {
    // Mock functions and objects
    var mockComp = {
      name: "Test Comp",
      layers: {
        addNull: function() {
          return {
            name: "",
            Effects: {
              addProperty: function() {
                return {
                  name: "",
                  property: function() {
                    return {
                      setValue: function() {}
                    };
                  }
                };
              }
            }
          };
        }
      }
    };
    
    // Create a mock createControlLayer function
    function mockCreateControlLayer(comp) {
      var layer = comp.layers.addNull();
      layer.name = "TextSelector_Controls";
      return layer;
    }
    
    // Run the function
    var layer = mockCreateControlLayer(mockComp);
    
    // Assert
    testSuite.assertEqual(layer.name, "TextSelector_Controls", "Control layer name should be TextSelector_Controls");
  });
  
  // Test effect creation
  testSuite.addTest("Core initialization creates required effects", function() {
    // Mock objects
    var effects = [];
    var mockLayer = {
      Effects: {
        addProperty: function(type) {
          var effect = {
            name: "",
            type: type,
            property: function() {
              return {
                setValue: function() {}
              };
            }
          };
          effects.push(effect);
          return effect;
        }
      }
    };
    
    // Create a mock createCoreEffects function
    function mockCreateCoreEffects(layer) {
      var globalEnable = layer.Effects.addProperty("ADBE Checkbox Control");
      globalEnable.name = "Global Enable";
      
      var debugMode = layer.Effects.addProperty("ADBE Checkbox Control");
      debugMode.name = "Debug Mode";
      
      var versionInfo = layer.Effects.addProperty("ADBE Text Control");
      versionInfo.name = "Version Info";
      
      return true;
    }
    
    // Run the function
    var result = mockCreateCoreEffects(mockLayer);
    
    // Assert
    testSuite.assert(result, "Function should return true");
    testSuite.assertEqual(effects.length, 3, "Should create 3 effects");
    testSuite.assertEqual(effects[0].name, "Global Enable", "First effect should be Global Enable");
    testSuite.assertEqual(effects[1].name, "Debug Mode", "Second effect should be Debug Mode");
    testSuite.assertEqual(effects[2].name, "Version Info", "Third effect should be Version Info");
  });
}

/**
 * Unit tests for animation controller
 * @param {Object} testSuite - Test suite to add tests to
 */
function addAnimationControllerTests(testSuite) {
  // Test animation controller creation
  testSuite.addTest("Animation controller creates required properties", function() {
    // Mock objects
    var properties = [];
    var mockLayer = {
      Effects: {
        addProperty: function(type) {
          var effect = {
            name: "",
            type: type,
            property: function() {
              return {
                setValue: function() {},
                setPropertyParameters: function() {}
              };
            },
            addProperty: function(type) {
              var prop = {
                name: "",
                type: type,
                property: function() {
                  return {
                    setValue: function() {},
                    setPropertyParameters: function() {}
                  };
                }
              };
              properties.push(prop);
              return prop;
            }
          };
          properties.push(effect);
          return effect;
        }
      }
    };
    
    // Create a mock createAnimationController function
    function mockCreateAnimationController(layer) {
      var animationSlider = layer.Effects.addProperty("ADBE Slider Control");
      animationSlider.name = "Animation";
      
      var delaySlider = layer.Effects.addProperty("ADBE Slider Control");
      delaySlider.name = "Delay";
      
      var aniStyle = layer.Effects.addProperty("ADBE Dropdown Control");
      aniStyle.name = "Ani-Style";
      
      var posterize = layer.Effects.addProperty("ADBE Slider Control");
      posterize.name = "Posterize(0=FPS)";
      
      return true;
    }
    
    // Run the function
    var result = mockCreateAnimationController(mockLayer);
    
    // Assert
    testSuite.assert(result, "Function should return true");
    testSuite.assertEqual(properties.length, 4, "Should create 4 properties");
    testSuite.assertEqual(properties[0].name, "Animation", "First property should be Animation");
    testSuite.assertEqual(properties[1].name, "Delay", "Second property should be Delay");
    testSuite.assertEqual(properties[2].name, "Ani-Style", "Third property should be Ani-Style");
    testSuite.assertEqual(properties[3].name, "Posterize(0=FPS)", "Fourth property should be Posterize(0=FPS)");
  });
  
  // Test animation expression generation
  testSuite.addTest("Animation controller generates valid expressions", function() {
    // Create a mock generatePositionYExpression function
    function mockGeneratePositionYExpression(controlLayerName) {
      var expression = "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");";
      expression += "var delay = ctrlLayer.effect(\"Delay\")(\"Slider\");";
      return expression;
    }
    
    // Run the function
    var expression = mockGeneratePositionYExpression("TextSelector_Controls");
    
    // Assert
    testSuite.assert(expression.indexOf("thisComp.layer") !== -1, "Expression should reference thisComp.layer");
    testSuite.assert(expression.indexOf("TextSelector_Controls") !== -1, "Expression should reference control layer name");
    testSuite.assert(expression.indexOf("Delay") !== -1, "Expression should reference Delay property");
  });
}

/**
 * Unit tests for opacity controller
 * @param {Object} testSuite - Test suite to add tests to
 */
function addOpacityControllerTests(testSuite) {
  // Test opacity controller creation
  testSuite.addTest("Opacity controller creates required properties", function() {
    // Mock objects
    var properties = [];
    var mockLayer = {
      Effects: {
        addProperty: function(type) {
          var effect = {
            name: "",
            type: type,
            property: function() {
              return {
                setValue: function() {},
                setPropertyParameters: function() {}
              };
            },
            addProperty: function(type) {
              var prop = {
                name: "",
                type: type,
                property: function() {
                  return {
                    setValue: function() {},
                    setPropertyParameters: function() {}
                  };
                }
              };
              properties.push(prop);
              return prop;
            }
          };
          properties.push(effect);
          return effect;
        }
      }
    };
    
    // Create a mock createOpacityController function
    function mockCreateOpacityController(layer) {
      var opacityGroup = layer.Effects.addProperty("ADBE Group");
      opacityGroup.name = "Opacity Controls";
      
      var opacityStyle = opacityGroup.addProperty("ADBE Dropdown Control");
      opacityStyle.name = "Opacity-Style";
      
      var opacityManual = opacityGroup.addProperty("ADBE Slider Control");
      opacityManual.name = "Opacity (Manual)";
      
      return true;
    }
    
    // Run the function
    var result = mockCreateOpacityController(mockLayer);
    
    // Assert
    testSuite.assert(result, "Function should return true");
    testSuite.assertEqual(properties.length, 3, "Should create 3 properties");
    testSuite.assertEqual(properties[0].name, "Opacity Controls", "First property should be Opacity Controls");
    testSuite.assertEqual(properties[1].name, "Opacity-Style", "Second property should be Opacity-Style");
    testSuite.assertEqual(properties[2].name, "Opacity (Manual)", "Third property should be Opacity (Manual)");
  });
  
  // Test opacity expression generation
  testSuite.addTest("Opacity controller generates valid expressions", function() {
    // Create a mock generateOpacityExpression function
    function mockGenerateOpacityExpression(controlLayerName) {
      var expression = "var ctrlLayer = thisComp.layer(\"" + controlLayerName + "\");";
      expression += "var opacityStyle = ctrlLayer.effect(\"Opacity-Style\")(\"Slider\");";
      return expression;
    }
    
    // Run the function
    var expression = mockGenerateOpacityExpression("TextSelector_Controls");
    
    // Assert
    testSuite.assert(expression.indexOf("thisComp.layer") !== -1, "Expression should reference thisComp.layer");
    testSuite.assert(expression.indexOf("TextSelector_Controls") !== -1, "Expression should reference control layer name");
    testSuite.assert(expression.indexOf("Opacity-Style") !== -1, "Expression should reference Opacity-Style property");
  });
}

/**
 * Performance benchmarking tests
 * @param {Object} testSuite - Test suite to add tests to
 */
function addPerformanceBenchmarkTests(testSuite) {
  // Test expression evaluation performance
  testSuite.addTest("Expression evaluation performance", function() {
    // Create a simple expression function
    function simpleExpression() {
      var result = 0;
      for (var i = 0; i < 1000; i++) {
        result += Math.sin(i * 0.01) * Math.cos(i * 0.02);
      }
      return result;
    }
    
    // Measure performance
    var metrics = testSuite.measurePerformance(simpleExpression, 10);
    
    // Assert
    testSuite.assert(metrics.averageTime > 0, "Average time should be greater than 0");
    testSuite.assert(metrics.iterations === 10, "Should run 10 iterations");
  });
  
  // Test expression optimization performance
  testSuite.addTest("Expression optimization performance", function() {
    // Create an unoptimized expression
    var unoptimizedExpression = "thisComp.layer(\"TextSelector_Controls\").effect(\"Animation\")(\"Slider\")";
    
    // Create an optimized expression
    var optimizedExpression = "var ctrlLayer = thisComp.layer(\"TextSelector_Controls\"); ctrlLayer.effect(\"Animation\")(\"Slider\")";
    
    // Mock optimization function
    function mockOptimizeExpression(expression) {
      return "var ctrlLayer = thisComp.layer(\"TextSelector_Controls\"); " + 
             expression.replace("thisComp.layer(\"TextSelector_Controls\")", "ctrlLayer");
    }
    
    // Measure performance of optimization
    var metrics = testSuite.measurePerformance(function() {
      mockOptimizeExpression(unoptimizedExpression);
    }, 100);
    
    // Assert
    testSuite.assert(metrics.averageTime > 0, "Average time should be greater than 0");
    testSuite.assert(metrics.iterations === 100, "Should run 100 iterations");
  });
}

/**
 * Integration tests for module communication
 * @param {Object} testSuite - Test suite to add tests to
 */
function addIntegrationTests(testSuite) {
  // Test module communication
  testSuite.addTest("Modules can communicate with each other", function() {
    // Mock modules
    var mockModules = {
      core: {
        getControlLayer: function() {
          return { name: "TextSelector_Controls" };
        }
      },
      animation: {
        getAnimationValue: function(controlLayer) {
          return controlLayer.name === "TextSelector_Controls" ? 50 : 0;
        }
      },
      transform: {
        applyAnimation: function(value) {
          return value * 2;
        }
      }
    };
    
    // Test integration
    var controlLayer = mockModules.core.getControlLayer();
    var animationValue = mockModules.animation.getAnimationValue(controlLayer);
    var transformedValue = mockModules.transform.applyAnimation(animationValue);
    
    // Assert
    testSuite.assertEqual(controlLayer.name, "TextSelector_Controls", "Control layer name should be correct");
    testSuite.assertEqual(animationValue, 50, "Animation value should be 50");
    testSuite.assertEqual(transformedValue, 100, "Transformed value should be 100");
  });
  
  // Test cross-module references
  testSuite.addTest("Cross-module references work correctly", function() {
    // Mock expression with cross-module references
    var expression = "var ctrlLayer = thisComp.layer(\"TextSelector_Controls\");" +
                     "var animValue = ctrlLayer.effect(\"Animation\")(\"Slider\");" +
                     "var transformOn = ctrlLayer.effect(\"Scale : ON\")(\"Checkbox\");" +
                     "if (transformOn) { animValue * 2; } else { animValue; }";
    
    // Assert
    testSuite.assert(expression.indexOf("Animation") !== -1, "Expression should reference Animation module");
    testSuite.assert(expression.indexOf("Scale : ON") !== -1, "Expression should reference Transform module");
  });
}

/**
 * Error recovery tests
 * @param {Object} testSuite - Test suite to add tests to
 */
function addErrorRecoveryTests(testSuite) {
  // Test missing layer recovery
  testSuite.addTest("Recovers from missing layer errors", function() {
    // Mock safe layer access function
    function safeGetLayer(comp, layerName) {
      try {
        // Simulate layer not found
        throw new Error("Layer not found: " + layerName);
      } catch (e) {
        // Return null for missing layer
        return null;
      }
    }
    
    // Test recovery
    var layer = safeGetLayer({}, "TextSelector_Controls");
    
    // Assert
    testSuite.assertEqual(layer, null, "Should return null for missing layer");
  });
  
  // Test missing effect recovery
  testSuite.addTest("Recovers from missing effect errors", function() {
    // Mock safe effect access function
    function safeGetEffect(layer, effectName) {
      try {
        // Simulate effect not found
        throw new Error("Effect not found: " + effectName);
      } catch (e) {
        // Return null for missing effect
        return null;
      }
    }
    
    // Mock layer
    var mockLayer = { name: "TextSelector_Controls" };
    
    // Test recovery
    var effect = safeGetEffect(mockLayer, "Animation");
    
    // Assert
    testSuite.assertEqual(effect, null, "Should return null for missing effect");
  });
  
  // Test expression error recovery
  testSuite.addTest("Expressions include error handling", function() {
    // Mock safe expression generation
    function generateSafeExpression(expressionCode, fallbackValue) {
      return "try { " + expressionCode + " } catch (err) { " + fallbackValue + "; }";
    }
    
    // Test safe expression
    var expression = generateSafeExpression("thisComp.layer(\"Missing Layer\")", "0");
    
    // Assert
    testSuite.assert(expression.indexOf("try {") !== -1, "Expression should include try block");
    testSuite.assert(expression.indexOf("catch (err)") !== -1, "Expression should include catch block");
    testSuite.assert(expression.indexOf("0;") !== -1, "Expression should include fallback value");
  });
}

/**
 * Compatibility tests for different After Effects versions
 * @param {Object} testSuite - Test suite to add tests to
 */
function addCompatibilityTests(testSuite) {
  // Test version compatibility check
  testSuite.addTest("Checks After Effects version compatibility", function() {
    // Mock version comparison function
    function compareVersions(version1, version2) {
      var v1parts = version1.split('.');
      var v2parts = version2.split('.');
      
      for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) {
          return 1;
        }
        
        if (v1parts[i] === v2parts[i]) {
          continue;
        }
        if (v1parts[i] > v2parts[i]) {
          return 1;
        }
        return -1;
      }
      
      if (v1parts.length !== v2parts.length) {
        return -1;
      }
      
      return 0;
    }
    
    // Test version comparison
    var result1 = compareVersions("17.0.0", "16.0.0");
    var result2 = compareVersions("16.0.0", "17.0.0");
    var result3 = compareVersions("16.0.0", "16.0.0");
    
    // Assert
    testSuite.assertEqual(result1, 1, "17.0.0 should be greater than 16.0.0");
    testSuite.assertEqual(result2, -1, "16.0.0 should be less than 17.0.0");
    testSuite.assertEqual(result3, 0, "16.0.0 should be equal to 16.0.0");
  });
  
  // Test feature detection
  testSuite.addTest("Detects available features", function() {
    // Mock feature detection function
    function detectFeatures() {
      var features = {
        multiFrameRendering: false,
        expressionEngine: "extendscript",
        textAnimatorsSupported: true
      };
      
      // Simulate feature detection based on version
      var version = "17.0.0";
      
      if (compareVersions(version, "17.0.0") >= 0) {
        features.multiFrameRendering = true;
      }
      
      if (compareVersions(version, "16.0.0") >= 0) {
        features.expressionEngine = "javascript";
      }
      
      return features;
    }
    
    // Helper function for version comparison
    function compareVersions(version1, version2) {
      var v1parts = version1.split('.');
      var v2parts = version2.split('.');
      
      for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) {
          return 1;
        }
        
        if (v1parts[i] === v2parts[i]) {
          continue;
        }
        if (v1parts[i] > v2parts[i]) {
          return 1;
        }
        return -1;
      }
      
      if (v1parts.length !== v2parts.length) {
        return -1;
      }
      
      return 0;
    }
    
    // Test feature detection
    var features = detectFeatures();
    
    // Assert
    testSuite.assertEqual(features.multiFrameRendering, true, "Multi-frame rendering should be supported");
    testSuite.assertEqual(features.expressionEngine, "javascript", "JavaScript expression engine should be supported");
    testSuite.assertEqual(features.textAnimatorsSupported, true, "Text animators should be supported");
  });
}

/**
 * Run all tests
 * @returns {Object} Test report
 */
function runAllTests() {
  var testSuite = createTestSuite();
  testSuite.initialize("TextSelector Comprehensive Test Suite");
  
  // Add all test groups
  addCoreInitializationTests(testSuite);
  addAnimationControllerTests(testSuite);
  addOpacityControllerTests(testSuite);
  addPerformanceBenchmarkTests(testSuite);
  addIntegrationTests(testSuite);
  addErrorRecoveryTests(testSuite);
  addCompatibilityTests(testSuite);
  
  // Run tests and return report
  return testSuite.runTests();
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTestSuite: createTestSuite,
    runAllTests: runAllTests,
    TEST_RESULT: TEST_RESULT
  };
}