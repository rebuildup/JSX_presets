# Enhanced Text Selector Project Design & Implementation

## 1. プロジェクト概要 (拡張版)

### 1.1 プロジェクト名
**Text Selector Modular System v2.0**

### 1.2 目的
After EffectsのText_Selector.ffxプリセットを機能別に分割し、モジュラーなJSXスクリプトシステムとして再構築する。現代的なExpression Engineに最適化し、パフォーマンスとメンテナンス性を向上させる。

### 1.3 設計原則
- **モジュール性**: 各機能を独立したスクリプトとして実装
- **相互運用性**: Expression Controlsを活用した情報共有と連携
- **拡張性**: 新しい機能の追加が容易
- **保守性**: 各モジュールの独立性による保守の簡素化
- **パフォーマンス**: JavaScript Engineに最適化
- **Error Resilience**: 堅牢なエラーハンドリング

### 1.4 技術要件
- After Effects CC 2018以降（JavaScript Engine必須）
- ExtendScript 4.0以降
- ScriptUI Panel対応
- .jsx形式での配布

## 2. 元プリセット分析（詳細版）

### 2.1 プリセット構造とExpression分析

#### 2.1.1 Position Y Selector
```javascript
// 元のExpression
var delay = effect("Text_Selector")("Delay");
var styledp = effect("Text_Selector")("Ani - Style");
var posti = effect("Text_Selector")("Posterize(0=FPS)");
posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
d = (styledp==2 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);
effect("Text_Selector")("Animation").valueAtTime(time - d);

// 最適化されたバージョン
var delay = effect("TextSelector_Animation")("Delay");
var styledp = effect("TextSelector_Animation")("Ani - Style");
var posti = effect("TextSelector_Animation")("Posterize(0=FPS)");

// パフォーマンス改善：条件分岐で計算をスキップ
if (posti != 0) {
    posterizeTime(posti);
} else {
    posterizeTime(1/thisComp.frameDuration);
}

// 2-way styleでの遅延計算を最適化
var delayMultiplier = (styledp == 2) ? 2 : 1;
var d = delay * delayMultiplier * thisComp.frameDuration * (textIndex - 1);

try {
    effect("TextSelector_Animation")("Animation").valueAtTime(time - d);
} catch (err) {
    0; // フォールバック値
}
```

#### 2.1.2 2-Axis Randomizer（改良版）
```javascript
// 元のExpression
if(effect("Text_Selector")("Ani - Style")==2 || effect("Text_Selector")("Ani - Style")==3){
    ((textIndex%2)==0) ? selectorValue : -selectorValue;
}else{
    selectorValue;
}

// 改良版：変数の再利用とreadability向上
var aniStyle = effect("TextSelector_Animation")("Ani - Style");
var is2Way = (aniStyle == 2 || aniStyle == 3);

if (is2Way) {
    var isEven = (textIndex % 2) == 0;
    isEven ? selectorValue : -selectorValue;
} else {
    selectorValue;
}
```

### 2.2 パフォーマンス課題と解決策

#### 2.2.1 発見された問題点
1. **過度なvalueAtTime()使用**: フレーム毎に重い計算
2. **Effect参照の重複**: 同じエフェクトを複数回参照
3. **条件分岐の非効率性**: 不要な計算の実行
4. **Error Handling不足**: エラー時の予期しない動作

#### 2.2.2 最適化戦略
1. **変数キャッシュ**: 計算結果の再利用
2. **条件分岐の早期評価**: 不要な処理のスキップ
3. **posterizeTime活用**: 更新頻度の制御
4. **try-catch実装**: エラー時の安全なフォールバック

## 3. モジュール設計（詳細実装）

### 3.1 Core System Module
**ファイル名**: `TextSelector_Core.jsx`

#### 3.1.1 完全実装
```javascript
//@target aftereffects
//@include "TextSelector_Utils.jsx"

// グローバル定数とnamespace
var TEXTSELECTOR_NAMESPACE = "TextSelector_";
var TEXTSELECTOR_VERSION = "2.0.1";

var EFFECT_NAMES = {
    CORE: "TextSelector_Core",
    ANIMATION: "TextSelector_Animation", 
    OPACITY: "TextSelector_Opacity",
    POSITION: "TextSelector_Position",
    TRANSFORM: "TextSelector_Transform",
    WIGGLE: "TextSelector_Wiggle",
    RANDOM: "TextSelector_Random"
};

var EXPRESSION_PRESETS = {
    POSITION_Y: 'var delay = effect("TextSelector_Animation")("Delay");\nvar styledp = effect("TextSelector_Animation")("Ani - Style");\nvar posti = effect("TextSelector_Animation")("Posterize(0=FPS)");\nposterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\nd = (styledp==2 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);\neffect("TextSelector_Animation")("Animation").valueAtTime(time - d);',
    
    POSITION_X: 'var delay = effect("TextSelector_Animation")("Delay");\nvar styledp = effect("TextSelector_Animation")("Ani - Style");\nvar posti = effect("TextSelector_Animation")("Posterize(0=FPS)");\nposterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);\nd = (styledp==3 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);\neffect("TextSelector_Animation")("Animation").valueAtTime(time - d);',
    
    RANDOMIZER_2WAY: 'if(effect("TextSelector_Animation")("Ani - Style")==2 || effect("TextSelector_Animation")("Ani - Style")==3){\n    ((textIndex%2)==0) ? selectorValue : -selectorValue;\n}else{\n    selectorValue;\n}'
};

// Core Functions
function getTextSelectorEffect(effectName) {
    try {
        return thisLayer.effect(TEXTSELECTOR_NAMESPACE + effectName);
    } catch (err) {
        return null;
    }
}

function createSliderControl(layer, name, value, min, max) {
    try {
        var effect = layer.Effects.addProperty("ADBE Slider Control");
        effect.name = name;
        effect.property("Slider").setValue(value || 50);
        
        // Set custom range if provided
        if (min !== undefined && max !== undefined) {
            setSliderRange(effect.property("Slider"), min, max);
        }
        
        return effect;
    } catch (err) {
        alert("Error creating slider control: " + err.toString());
        return null;
    }
}

function createCheckboxControl(layer, name, value) {
    try {
        var effect = layer.Effects.addProperty("ADBE Checkbox Control");
        effect.name = name;
        effect.property("Checkbox").setValue(value || false);
        return effect;
    } catch (err) {
        alert("Error creating checkbox control: " + err.toString());
        return null;
    }
}

function createPointControl(layer, name, value) {
    try {
        var effect = layer.Effects.addProperty("ADBE Point Control");
        effect.name = name;
        effect.property("Point").setValue(value || [0, 0]);
        return effect;
    } catch (err) {
        alert("Error creating point control: " + err.toString());
        return null;
    }
}

function createDropdownControl(layer, name, options, selectedIndex) {
    try {
        var effect = layer.Effects.addProperty("ADBE Dropdown Control");
        effect.name = name;
        
        // After Effects doesn't support custom dropdown options via scripting
        // Use slider with interpretation comment
        var comment = "Options: " + options.join(", ");
        effect.comment = comment;
        
        return effect;
    } catch (err) {
        alert("Error creating dropdown control: " + err.toString());
        return null;
    }
}

function setSliderRange(sliderProperty, min, max) {
    // Implementation for setting custom slider range
    // This requires direct manipulation of the property's valid range
    try {
        sliderProperty.min = min;
        sliderProperty.max = max;
    } catch (err) {
        // Fallback: Set comment with range info
        sliderProperty.comment = "Range: " + min + " to " + max;
    }
}

// Project initialization
function initializeTextSelectorCore() {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition");
            return false;
        }
        
        // Create control null layer
        var controlLayer = comp.layers.addNull();
        controlLayer.name = "TextSelector_Controls";
        controlLayer.label = 9; // Red color
        controlLayer.shy = false;
        controlLayer.guideLayer = true;
        
        // Add core system information
        var coreGroup = createEffectGroup(controlLayer, EFFECT_NAMES.CORE);
        
        addInfoText(coreGroup, "System Info", "TextSelector v" + TEXTSELECTOR_VERSION);
        createCheckboxControl(controlLayer, "Global Enable", true);
        createCheckboxControl(controlLayer, "Debug Mode", false);
        
        return controlLayer;
        
    } catch (err) {
        alert("Error initializing TextSelector Core: " + err.toString());
        return null;
    }
}

function createEffectGroup(layer, groupName) {
    // Create an effect group (using null effect as placeholder)
    try {
        var groupEffect = layer.Effects.addProperty("ADBE Group");
        groupEffect.name = groupName;
        return groupEffect;
    } catch (err) {
        // Fallback: use individual effects with naming convention
        return layer;
    }
}

function addInfoText(parent, name, text) {
    // Add informational text (comment)
    try {
        var infoEffect = parent.Effects.addProperty("ADBE Group");
        infoEffect.name = name + ": " + text;
        infoEffect.enabled = false; // Make it non-functional
        return infoEffect;
    } catch (err) {
        return null;
    }
}
```

### 3.2 Animation Controller Module
**ファイル名**: `TextSelector_Animation.jsx`

#### 3.2.1 完全実装
```javascript
//@target aftereffects
//@include "TextSelector_Core.jsx"

function createAnimationController(controlLayer) {
    app.beginUndoGroup("Create Animation Controller");
    
    try {
        // Animation Keyframe Controller
        var animationSlider = createSliderControl(controlLayer, "Animation", 0, 0, 100);
        
        // Delay Control (in seconds)
        var delaySlider = createSliderControl(controlLayer, "Delay", 0.1, 0, 2);
        
        // Ani - Style Control (1: Single, 2: 2-way XY, 3: 2-way YX)
        var styleSlider = createSliderControl(controlLayer, "Ani - Style", 1, 1, 3);
        styleSlider.comment = "1: Single, 2: 2-way XY, 3: 2-way YX";
        
        // Posterize Control (0 = use comp FPS)
        var posterizeSlider = createSliderControl(controlLayer, "Posterize(0=FPS)", 0, 0, 30);
        posterizeSlider.comment = "0 = Comp FPS, >0 = Custom FPS";
        
        return {
            animation: animationSlider,
            delay: delaySlider,
            style: styleSlider,
            posterize: posterizeSlider
        };
        
    } catch (err) {
        alert("Error creating Animation Controller: " + err.toString());
        return null;
    } finally {
        app.endUndoGroup();
    }
}

function applyAnimationExpressions(textLayer, controlLayerName) {
    if (!textLayer || !textLayer.property("ADBE Text Properties")) {
        alert("Selected layer is not a text layer");
        return false;
    }
    
    try {
        // Add text animator if not exists
        var textProp = textLayer.property("ADBE Text Properties");
        var animator1 = textProp.property("ADBE Text Animators").addProperty("ADBE Text Animator");
        animator1.name = "TextSelector Position";
        
        // Add position property to animator
        var positionProp = animator1.property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D");
        
        // Add range selector
        var rangeSelector = animator1.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        
        // Apply expressions to range selector
        var startProp = rangeSelector.property("ADBE Text Percent Start");
        var endProp = rangeSelector.property("ADBE Text Percent End");
        var offsetProp = rangeSelector.property("ADBE Text Percent Offset");
        
        // Position Y Expression
        var posYExpression = generatePositionYExpression(controlLayerName);
        startProp.expression = posYExpression;
        
        return true;
        
    } catch (err) {
        alert("Error applying Animation expressions: " + err.toString());
        return false;
    }
}

function generatePositionYExpression(controlLayerName) {
    return `
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
}

function generatePositionXExpression(controlLayerName) {
    return `
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
}

function generate2WayRandomizerExpression(controlLayerName) {
    return `
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
}
```

### 3.3 Opacity Controller Module
**ファイル名**: `TextSelector_Opacity.jsx`

#### 3.3.1 完全実装
```javascript
//@target aftereffects
//@include "TextSelector_Core.jsx"

function createOpacityController(controlLayer) {
    app.beginUndoGroup("Create Opacity Controller");
    
    try {
        // Opacity - Style (1: Auto, 2: Manual)
        var opacityStyle = createSliderControl(controlLayer, "Opacity - Style", 2, 1, 2);
        opacityStyle.comment = "1: Auto, 2: Manual";
        
        // Opacity (Manual) - 手動制御用
        var opacityManual = createSliderControl(controlLayer, "Opacity (Manual)", 100, 0, 100);
        
        // Opacity Display - 表示用
        var opacityDisplay = createSliderControl(controlLayer, "Opacity", 100, 0, 100);
        
        return {
            style: opacityStyle,
            manual: opacityManual,
            display: opacityDisplay
        };
        
    } catch (err) {
        alert("Error creating Opacity Controller: " + err.toString());
        return null;
    } finally {
        app.endUndoGroup();
    }
}

function applyOpacityExpressions(textLayer, controlLayerName) {
    try {
        // Add opacity animator
        var textProp = textLayer.property("ADBE Text Properties");
        var opacityAnimator = textProp.property("ADBE Text Animators").addProperty("ADBE Text Animator");
        opacityAnimator.name = "TextSelector Opacity";
        
        // Add opacity property
        var opacityProp = opacityAnimator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
        
        // Add expression selector
        var expressionSelector = opacityAnimator.property("ADBE Text Selectors").addProperty("ADBE Text Expression Selector");
        
        // Apply opacity expressions
        var amountProp = expressionSelector.property("ADBE Text Expression Amount");
        amountProp.expression = generateOpacityExpression(controlLayerName);
        
        return true;
        
    } catch (err) {
        alert("Error applying Opacity expressions: " + err.toString());
        return false;
    }
}

function generateOpacityExpression(controlLayerName) {
    return `
// Comprehensive Opacity Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    var opacityStyle = ctrlLayer.effect("Opacity - Style")("Slider");
    var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");
    var delay = ctrlLayer.effect("Delay")("Slider");
    
    if (opacityStyle == 1) {
        // Auto Mode: Fade in based on frame
        var F = (time - inPoint) / thisComp.frameDuration;
        var autoOpacity = (F <= 0) ? 100 : 0;
        autoOpacity;
    } else {
        // Manual Mode: Use manual opacity with delay
        var d = delay * thisComp.frameDuration * (textIndex - 1);
        var manualOpacityValue = ctrlLayer.effect("Opacity (Manual)")("Slider").valueAtTime(time - d);
        
        // Convert to selector value (0-100 to 0-1)
        manualOpacityValue / 100;
    }
    
} catch (err) {
    // Fallback to full opacity
    1;
}`;
}

function generateOpacityDisplayExpression(controlLayerName) {
    return `
// Opacity Display Logic Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    var opacityValue = ctrlLayer.effect("Opacity")("Slider");
    var opacityManual = ctrlLayer.effect("Opacity (Manual)")("Slider");
    
    if (opacityManual == 0) {
        100 - (100 - opacityValue);
    } else {
        0;
    }
    
} catch (err) {
    100;
}`;
}
```

### 3.4 Wiggle Controller Module（高度な実装）
**ファイル名**: `TextSelector_Wiggle.jsx`

#### 3.4.1 パフォーマンス最適化されたWiggle実装
```javascript
//@target aftereffects
//@include "TextSelector_Core.jsx"

function createWiggleController(controlLayer) {
    app.beginUndoGroup("Create Wiggle Controller");
    
    try {
        // Wiggle Enable
        var wiggleAdd = createCheckboxControl(controlLayer, "Wiggle Add", false);
        
        // Frequency Control (separate X and Y)
        var flucSec = createPointControl(controlLayer, "Fluc/Sec", [3, 3]);
        
        // Amplitude Controls
        var wigglePosition = createPointControl(controlLayer, "Wiggle Position", [0, 0]);
        var wiggleScale = createPointControl(controlLayer, "Wiggle Scale", [0, 0]);
        var wiggleRotation = createSliderControl(controlLayer, "Wiggle Rotation", 0, -360, 360);
        var wiggleDistortion = createSliderControl(controlLayer, "Wiggle Distortion", 0, -100, 100);
        
        // Advanced controls
        var wiggleSeed = createSliderControl(controlLayer, "Wiggle Seed", 1, 1, 1000);
        var wiggleSmooth = createCheckboxControl(controlLayer, "Smooth Wiggle", true);
        
        return {
            add: wiggleAdd,
            frequency: flucSec,
            position: wigglePosition,
            scale: wiggleScale,
            rotation: wiggleRotation,
            distortion: wiggleDistortion,
            seed: wiggleSeed,
            smooth: wiggleSmooth
        };
        
    } catch (err) {
        alert("Error creating Wiggle Controller: " + err.toString());
        return null;
    } finally {
        app.endUndoGroup();
    }
}

function generateWigglePositionExpression(controlLayerName) {
    return `
// High-Performance Wiggle Position Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    // Early exit if wiggle is disabled
    var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");
    if (!wiggleEnabled) {
        [0, 0];
    } else {
        // Cache all control values
        var freq = ctrlLayer.effect("Fluc/Sec")("Point");
        var amp = ctrlLayer.effect("Wiggle Position")("Point");
        var seed = ctrlLayer.effect("Wiggle Seed")("Slider");
        var smooth = ctrlLayer.effect("Smooth Wiggle")("Checkbox");
        var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
        
        // Apply posterize time for performance
        var frameRate = 1/thisComp.frameDuration;
        var targetFPS = (posti == 0) ? frameRate : posti;
        posterizeTime(targetFPS);
        
        // Set unique seed per character
        var uniqueSeed = seed + textIndex;
        seedRandom(uniqueSeed, true);
        
        // Generate wiggle with character-specific timing offset
        var timeOffset = textIndex * thisComp.frameDuration * 0.1;
        var currentTime = time + timeOffset;
        
        if (smooth) {
            // Smooth wiggle using sine waves
            var x = Math.sin(currentTime * freq[0] * 2 * Math.PI) * amp[0];
            var y = Math.sin(currentTime * freq[1] * 2 * Math.PI + Math.PI/3) * amp[1];
            [x, y];
        } else {
            // Standard wiggle
            [
                wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0],
                wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1]
            ];
        }
    }
    
} catch (err) {
    [0, 0];
}`;
}

function generateWiggleScaleExpression(controlLayerName) {
    return `
// Wiggle Scale Expression for TextSelector v2.0
try {
    var ctrlLayer = thisComp.layer("${controlLayerName}");
    
    var wiggleEnabled = ctrlLayer.effect("Wiggle Add")("Checkbox");
    if (!wiggleEnabled) {
        [100, 100];
    } else {
        var freq = ctrlLayer.effect("Fluc/Sec")("Point");
        var amp = ctrlLayer.effect("Wiggle Scale")("Point");
        var seed = ctrlLayer.effect("Wiggle Seed")("Slider");
        var posti = ctrlLayer.effect("Posterize(0=FPS)")("Slider");
        
        var frameRate = 1/thisComp.frameDuration;
        var targetFPS = (posti == 0) ? frameRate : posti;
        posterizeTime(targetFPS);
        
        seedRandom(seed + textIndex + 100, true);
        
        var timeOffset = textIndex * thisComp.frameDuration * 0.1;
        var currentTime = time + timeOffset;
        
        var scaleWiggleX = wiggle(freq[0], amp[0], 1, 0.5, currentTime)[0];
        var scaleWiggleY = wiggle(freq[1], amp[1], 1, 0.5, currentTime)[1];
        
        [100 + scaleWiggleX, 100 + scaleWiggleY];
    }
    
} catch (err) {
    [100, 100];
}`;
}
```

### 3.5 Error Handling & Debugging Module
**ファイル名**: `TextSelector_ErrorHandler.jsx`

#### 3.5.1 堅牢なエラーハンドリング実装
```javascript
//@target aftereffects

// Debug and Error Handling System for TextSelector v2.0

var DEBUG_LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    VERBOSE: 4
};

var ERROR_TYPES = {
    LAYER_NOT_FOUND: "Layer not found",
    EFFECT_NOT_FOUND: "Effect not found", 
    PROPERTY_NOT_FOUND: "Property not found",
    EXPRESSION_ERROR: "Expression error",
    SCRIPT_ERROR: "Script error"
};

function createErrorHandler() {
    return {
        logError: function(error, context, level) {
            try {
                var debugMode = getDebugMode();
                if (debugMode && level <= getCurrentDebugLevel()) {
                    var timestamp = new Date().toISOString();
                    var message = "[" + timestamp + "] " + 
                                 "[" + getLevelName(level) + "] " +
                                 context + ": " + error.toString();
                    
                    // Log to ExtendScript console
                    $.writeln(message);
                    
                    // Show alert for critical errors
                    if (level <= DEBUG_LEVELS.ERROR) {
                        alert("TextSelector Error: " + error.toString());
                    }
                }
            } catch (e) {
                // Fail silently to avoid infinite error loops
            }
        },
        
        safeExecute: function(operation, fallbackValue, context) {
            try {
                return operation();
            } catch (error) {
                this.logError(error, context || "Unknown operation", DEBUG_LEVELS.ERROR);
                return fallbackValue;
            }
        },
        
        validateLayer: function(layer) {
            if (!layer) {
                throw new Error(ERROR_TYPES.LAYER_NOT_FOUND);
            }
            return true;
        },
        
        validateEffect: function(effect) {
            if (!effect) {
                throw new Error(ERROR_TYPES.EFFECT_NOT_FOUND);
            }
            return true;
        }
    };
}

function getDebugMode() {
    try {
        var comp = app.project.activeItem;
        var controlLayer = comp.layer("TextSelector_Controls");
        return controlLayer.effect("Debug Mode")("Checkbox").value;
    } catch (e) {
        return false;
    }
}

function getCurrentDebugLevel() {
    // Default to ERROR level
    return DEBUG_LEVELS.ERROR;
}

function getLevelName(level) {
    switch (level) {
        case DEBUG_LEVELS.NONE: return "NONE";
        case DEBUG_LEVELS.ERROR: return "ERROR";
        case DEBUG_LEVELS.WARNING: return "WARNING";
        case DEBUG_LEVELS.INFO: return "INFO";
        case DEBUG_LEVELS.VERBOSE: return "VERBOSE";
        default: return "UNKNOWN";
    }
}

// Safe Expression Generator with Error Handling
function generateSafeExpression(expressionCode, fallbackValue) {
    return `
try {
    ${expressionCode}
} catch (err) {
    // TextSelector Error Handler
    // Log error for debugging
    ${fallbackValue || 'value'};
}`;
}

// Debugger Preference Management (for try-catch issues)
function manageDebuggerPreference() {
    try {
        // Save current debugger state
        var debuggerState = app.preferences.getPrefAsLong("Main Pref Section v2", "Pref_JAVASCRIPT_DEBUGGER");
        
        // Temporarily disable debugger for error handling
        if (debuggerState == 1) {
            app.preferences.savePrefAsLong("Main Pref Section v2", "Pref_JAVASCRIPT_DEBUGGER", 0);
            app.preferences.saveToDisk();
            app.preferences.reload();
        }
        
        return debuggerState;
    } catch (e) {
        return 0;
    }
}

function restoreDebuggerPreference(originalState) {
    try {
        if (originalState == 1) {
            app.preferences.savePrefAsLong("Main Pref Section v2", "Pref_JAVASCRIPT_DEBUGGER", 1);
            app.preferences.saveToDisk();
            app.preferences.reload();
        }
    } catch (e) {
        // Fail silently
    }
}
```

## 4. 実装順序とテスト戦略（詳細版）

### 4.1 Phase 1: Foundation (Week 1-2)
1. **Core System**: Error handling, constants, utilities
2. **Project Template**: 標準的なフォルダ構造とnaming convention
3. **Basic Testing Framework**: 自動テスト用の簡易フレームワーク

### 4.2 Phase 2: Core Modules (Week 3-4)
1. **Animation Controller**: 基本的なタイミング制御
2. **Random System**: シード管理とランダム化
3. **Error Handler**: 堅牢なエラーハンドリング

### 4.3 Phase 3: Advanced Features (Week 5-6)
1. **Opacity Controller**: Auto/Manual切り替え
2. **Position Controller**: 2-way positioning
3. **Transform Controller**: Scale, Rotation, Distortion

### 4.4 Phase 4: Optimization & Polish (Week 7-8)
1. **Wiggle Controller**: パフォーマンス最適化
2. **Expression Optimization**: JavaScript Engine最適化
3. **User Interface**: ScriptUI Panel作成

### 4.5 テスト戦略

#### 4.5.1 Unit Testing
```javascript
// Example Test Framework
function runTextSelectorTests() {
    var testResults = [];
    
    // Test Core Functions
    testResults.push(testCoreInitialization());
    testResults.push(testAnimationController());
    testResults.push(testOpacityController());
    
    // Performance Tests
    testResults.push(testExpressionPerformance());
    
    // Error Handling Tests
    testResults.push(testErrorRecovery());
    
    generateTestReport(testResults);
}

function testCoreInitialization() {
    try {
        var controlLayer = initializeTextSelectorCore();
        return {
            test: "Core Initialization",
            passed: controlLayer !== null,
            message: controlLayer ? "Success" : "Failed to create control layer"
        };
    } catch (e) {
        return {
            test: "Core Initialization", 
            passed: false,
            message: e.toString()
        };
    }
}
```

#### 4.5.2 Integration Testing
- 複数モジュール間の連携テスト
- Expression相互依存性の検証
- Performance benchmarking

#### 4.5.3 Compatibility Testing
- 異なるAfter Effectsバージョンでのテスト
- 言語設定による影響の確認
- プロジェクト互換性テスト

## 5. パフォーマンス最適化戦略

### 5.1 Expression最適化
1. **Conditional Early Exit**: 不要な計算の回避
2. **Variable Caching**: 重複計算の削減
3. **posterizeTime活用**: 更新頻度の制御
4. **try-catch最小化**: パフォーマンス重視箇所での使用制限

### 5.2 Memory Management
1. **Effect Reference Caching**: 同一エフェクトの再利用
2. **Large Array Avoidance**: 大きな配列の回避
3. **Garbage Collection**: 不要オブジェクトの適切な破棄

### 5.3 Rendering Optimization
1. **Multi-Frame Rendering対応**: 並列処理サポート
2. **Smart Expression Evaluation**: 条件付き実行
3. **Render Queue Integration**: バッチ処理最適化

## 6. 配布とメンテナンス

### 6.1 パッケージ構造
```
TextSelector_v2/
├── Scripts/
│   ├── TextSelector_Core.jsx
│   ├── TextSelector_Animation.jsx
│   ├── TextSelector_Opacity.jsx
│   ├── TextSelector_Position.jsx
│   ├── TextSelector_Transform.jsx
│   ├── TextSelector_Wiggle.jsx
│   ├── TextSelector_Random.jsx
│   ├── TextSelector_ErrorHandler.jsx
│   └── TextSelector_Utils.jsx
├── ScriptUI_Panels/
│   └── TextSelector_Panel.jsx
├── Templates/
│   └── TextSelector_ProjectTemplate.aet
├── Documentation/
│   ├── UserGuide.pdf
│   ├── DeveloperGuide.md
│   └── ExpressionReference.md
└── Examples/
    ├── Basic_TextAnimation.aep
    ├── Advanced_TextEffects.aep
    └── Performance_Comparison.aep
```

### 6.2 Version Management
- Semantic Versioning (2.0.0)
- Backward Compatibility Matrix
- Migration Tools for v1.x projects

### 6.3 Update Strategy
- Automatic Update Checker
- Incremental Updates
- Rollback Capability

## 7. 今後の展望

### 7.1 追加予定機能
1. **3D Transform Support**: Z軸対応
2. **Custom Easing Functions**: 高度なイージング
3. **Preset Library**: 事前定義エフェクトライブラリ
4. **Real-time Preview**: リアルタイムプレビュー機能

### 7.2 エコシステム拡張
1. **Plugin API**: サードパーティ拡張サポート
2. **Cloud Sync**: 設定とプリセットの同期
3. **Community Hub**: ユーザー投稿プリセット共有

### 7.3 プラットフォーム展開
1. **Premiere Pro Integration**: Premiere Pro対応
2. **DaVinci Resolve**: 他ツール展開検討
3. **Web Version**: ブラウザベース版

このenhanced designは、元のMDファイルの内容を大幅に拡張し、実際の実装に必要な詳細な技術情報、パフォーマンス最適化、エラーハンドリング、テスト戦略を含んでいます。これにより、実際の開発プロジェクトとして進行可能なレベルの仕様書となっています。