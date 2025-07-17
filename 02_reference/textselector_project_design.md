# Text Selector Project Design & Implementation

## 1. プロジェクト概要

### 1.1 プロジェクト名
**Text Selector Modular System**

### 1.2 目的
After EffectsのText_Selector.ffxプリセットを機能別に分割し、モジュラーなJSXスクリプトシステムとして再構築する。

### 1.3 設計原則
- **モジュール性**: 各機能を独立したスクリプトとして実装
- **相互運用性**: スクリプト間での情報共有と連携
- **拡張性**: 新しい機能の追加が容易
- **保守性**: 各モジュールの独立性による保守の簡素化

## 2. 元プリセット（Text_Selector.ffx）仕様分析

### 2.1 プリセット構造
```
Text_Selector Effect
├── Animation Properties
│   ├── Animation (Keyframe Controller)
│   ├── Delay (Timing Control)
│   ├── Opacity - Style (Auto/Manual)
│   ├── Opacity (Manual) (Manual Control)
│   ├── Ani - Style (Single/2-way XY/2-way YX)
│   └── Ani - Position (Position Values)
├── Property Details
│   ├── Add Scale (Scale Values)
│   ├── Add Distortion (Distortion Amount)
│   ├── Add Dis - Axis (Distortion Axis)
│   ├── Add Rotation (Rotation Amount)
│   ├── SeedRandom (Random Seed)
│   ├── Scale : ON (Boolean)
│   ├── Distortion : ON (Boolean)
│   └── Rotation : ON (Boolean)
├── Extra Properties
│   ├── Posterize(0=FPS) (Frame Rate Control)
│   ├── Text AnkerPoint (Anchor Point)
│   └── Text Wiggler (Wiggle Control)
└── Wiggle Properties
    ├── Add (Boolean)
    ├── Fluc/Sec (Frequency)
    ├── Position (Wiggle Position)
    ├── Scale (Wiggle Scale)
    ├── Distortion (Wiggle Distortion)
    ├── Dis - Axis (Wiggle Axis)
    └── Rotation (Wiggle Rotation)
```

### 2.2 主要エクスプレッション

#### 2.2.1 Position Y Selector
```javascript
var delay = effect("Text_Selector")("Delay");
var styledp = effect("Text_Selector")("Ani - Style");
var posti = effect("Text_Selector")("Posterize(0=FPS)");
posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
d = (styledp==2 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);
effect("Text_Selector")("Animation").valueAtTime(time - d);
```

#### 2.2.2 Position X Selector
```javascript
var delay = effect("Text_Selector")("Delay");
var styledp = effect("Text_Selector")("Ani - Style");
var posti = effect("Text_Selector")("Posterize(0=FPS)");
posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
d = (styledp==3 ? delay*2 : delay) * thisComp.frameDuration * (textIndex - 1);
effect("Text_Selector")("Animation").valueAtTime(time - d);
```

#### 2.2.3 2-Axis Randomizer
```javascript
if(effect("Text_Selector")("Ani - Style")==2 || effect("Text_Selector")("Ani - Style")==3){
    ((textIndex%2)==0) ? selectorValue : -selectorValue;
}else{
    selectorValue;
}
```

#### 2.2.4 Position Animation
```javascript
var way_style = effect("Text_Selector")("Ani - Style");
var seed = effect("Text_Selector")("SeedRandom");
var prop = effect("Text_Selector")("Ani - Position");
if(way_style==2 || way_style==3){
    seedRandom(seed,true);
    [0 , random(-thisComp.height/2,thisComp.height/2)];
}else{
    [0,prop[1]];
}
```

#### 2.2.5 Scale Animation
```javascript
var way_style = effect("Text_Selector")("Ani - Style");
var seed = effect("Text_Selector")("SeedRandom");
var prop = effect("Text_Selector")("Add Scale");
var c = effect("Text_Selector")("Scale : ON");
if(way_style==2 && c==true|| way_style==3 && c==true){
    seedRandom(seed,true);
    [random(-2000,2000) , random(-2000,2000)];
}else{
    [100,100]+[prop[0],prop[1]];
}
```

#### 2.2.6 Distortion Animation
```javascript
var way_style = effect("Text_Selector")("Ani - Style");
var seed = effect("Text_Selector")("SeedRandom");
var prop = effect("Text_Selector")("Add Distortion");
var c = effect("Text_Selector")("Distortion : ON");
if(way_style==2 &&  c==true|| way_style==3 &&  c==true){
    seedRandom(seed,true);
    random(-70,70);
}else{
    prop;
}
```

#### 2.2.7 Rotation Animation
```javascript
var way_style = effect("Text_Selector")("Ani - Style");
var seed = effect("Text_Selector")("SeedRandom");
var prop = effect("Text_Selector")("Add Rotation");
var c = effect("Text_Selector")("Rotation : ON");
if(way_style==2 &&  c==true|| way_style==3 &&  c==true){
    seedRandom(seed,true);
    random(-359,359);
}else{
    prop;
}
```

#### 2.2.8 Opacity Control
```javascript
var delay = effect("Text_Selector")("Delay");
d = delay * thisComp.frameDuration * (textIndex - 1);
effect("Text_Selector")("Opacity (Manual)").valueAtTime(time - d);
```

#### 2.2.9 Opacity Display Logic
```javascript
var m = effect("Text_Selector")("Opacity");
var op = effect("Text_Selector")("Opacity (Manual)");
if(op=0){
    100-(100-m);
}else{
    0;
}
```

#### 2.2.10 Wiggle Effect
```javascript
var Fluc = effect("Text_Selector")("Fluc/Sec")[0];
var posti = effect("Text_Selector")("Posterize(0=FPS)");
posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
effect("Text_Selector")("Add")==true ? wiggle(Fluc,effect("Text_Selector")("Position")[1],1,5,time+(textIndex+thisComp.frameDuration+2)) : [0,0,0];
```

#### 2.2.11 Auto Opacity
```javascript
var dp = effect("Text_Selector")("Opacity - Style");
F = ( time - inPoint )/thisComp.frameDuration ;
if(dp==1){[F<=0 ? 100 : 0]}else{value}
```

#### 2.2.12 Anchor Point Control
```javascript
3[0,-40]+effect("Text_Selector")("Text AnkerPoint");
```

## 3. モジュール設計

### 3.1 Core System Module
**ファイル名**: `TextSelector_Core.jsx`

#### 3.1.1 役割
- 基盤システムの初期化
- 共通定数とユーティリティ関数の定義
- 他のモジュールとの通信インターフェース

#### 3.1.2 実装内容
```javascript
// グローバル定数
var TEXTSELECTOR_NAMESPACE = "TextSelector_";
var EFFECT_NAMES = {
    CORE: "TextSelector_Core",
    ANIMATION: "TextSelector_Animation", 
    OPACITY: "TextSelector_Opacity",
    POSITION: "TextSelector_Position",
    TRANSFORM: "TextSelector_Transform",
    WIGGLE: "TextSelector_Wiggle",
    RANDOM: "TextSelector_Random"
};

// 共通関数
function getTextSelectorEffect(effectName) {
    return thisLayer.effect(TEXTSELECTOR_NAMESPACE + effectName);
}

function createSliderControl(name, value, min, max) {
    // スライダーコントロール作成
}

function createCheckboxControl(name, value) {
    // チェックボックスコントロール作成
}

function createPointControl(name, value) {
    // ポイントコントロール作成
}
```

#### 3.1.3 作成するプロパティ
- System Info (情報表示)
- Global Enable (全体の有効/無効)
- Debug Mode (デバッグモード)

### 3.2 Animation Controller Module
**ファイル名**: `TextSelector_Animation.jsx`

#### 3.2.1 役割
- 基本的なアニメーション制御
- タイミングとフレームレート制御
- アニメーションスタイルの管理

#### 3.2.2 実装内容
```javascript
// アニメーションコントローラーの作成
function createAnimationController() {
    var effect = thisLayer.effect.addProperty("ADBE Slider Control");
    effect.name = EFFECT_NAMES.ANIMATION;
    
    // Animation キーフレームコントロール
    var animationSlider = effect.property("Slider");
    animationSlider.name = "Animation";
    
    // Delay コントロール
    var delaySlider = thisLayer.effect.addProperty("ADBE Slider Control");
    delaySlider.name = "Delay";
    delaySlider.property("Slider").setValue(0.1);
    
    // Ani - Style コントロール (ドロップダウン)
    var styleSlider = thisLayer.effect.addProperty("ADBE Dropdown Control");
    styleSlider.name = "Ani - Style";
    // 1: Single, 2: 2-way (XY), 3: 2-way (YX)
    
    // Posterize コントロール
    var posterizeSlider = thisLayer.effect.addProperty("ADBE Slider Control");
    posterizeSlider.name = "Posterize(0=FPS)";
    posterizeSlider.property("Slider").setValue(0);
}

// エクスプレッション適用
function applyAnimationExpressions() {
    // Text Animator の Range Selector にエクスプレッション適用
}
```

#### 3.2.3 作成するプロパティ
- Animation (Slider) - アニメーションキーフレーム制御
- Delay (Slider) - 遅延時間
- Ani - Style (Dropdown) - アニメーションスタイル
- Posterize(0=FPS) (Slider) - フレームレート制御

### 3.3 Opacity Controller Module
**ファイル名**: `TextSelector_Opacity.jsx`

#### 3.3.1 役割
- 不透明度の制御
- 自動/手動モードの切り替え
- フェードイン/アウト効果

#### 3.3.2 実装内容
```javascript
function createOpacityController() {
    var effect = thisLayer.effect.addProperty("ADBE Group");
    effect.name = EFFECT_NAMES.OPACITY;
    
    // Opacity - Style (Auto/Manual)
    var opacityStyle = effect.property.addProperty("ADBE Dropdown Control");
    opacityStyle.name = "Opacity - Style";
    
    // Opacity (Manual) - 手動制御用
    var opacityManual = effect.property.addProperty("ADBE Slider Control");
    opacityManual.name = "Opacity (Manual)";
    opacityManual.property("Slider").setValue(100);
    
    // Opacity - 表示用
    var opacityDisplay = effect.property.addProperty("ADBE Slider Control");
    opacityDisplay.name = "Opacity";
    opacityDisplay.property("Slider").setValue(100);
}

function applyOpacityExpressions() {
    // Auto Opacity Expression
    var autoOpacityExp = `
        var dp = effect("${EFFECT_NAMES.OPACITY}")("Opacity - Style");
        F = ( time - inPoint )/thisComp.frameDuration ;
        if(dp==1){[F<=0 ? 100 : 0]}else{value}
    `;
    
    // Manual Opacity Expression
    var manualOpacityExp = `
        var delay = effect("${EFFECT_NAMES.ANIMATION}")("Delay");
        d = delay * thisComp.frameDuration * (textIndex - 1);
        effect("${EFFECT_NAMES.OPACITY}")("Opacity (Manual)").valueAtTime(time - d);
    `;
    
    // Display Logic Expression
    var displayExp = `
        var m = effect("${EFFECT_NAMES.OPACITY}")("Opacity");
        var op = effect("${EFFECT_NAMES.OPACITY}")("Opacity (Manual)");
        if(op=0){
            100-(100-m);
        }else{
            0;
        }
    `;
}
```

#### 3.3.3 作成するプロパティ
- Opacity - Style (Dropdown) - 自動/手動切り替え
- Opacity (Manual) (Slider) - 手動不透明度制御
- Opacity (Slider) - 表示用不透明度

### 3.4 Position Controller Module
**ファイル名**: `TextSelector_Position.jsx`

#### 3.4.1 役割
- テキストの位置制御
- アンカーポイント設定
- 2-way位置アニメーション

#### 3.4.2 実装内容
```javascript
function createPositionController() {
    var effect = thisLayer.effect.addProperty("ADBE Group");
    effect.name = EFFECT_NAMES.POSITION;
    
    // Ani - Position
    var aniPosition = effect.property.addProperty("ADBE Point Control");
    aniPosition.name = "Ani - Position";
    
    // Text AnkerPoint
    var textAnchor = effect.property.addProperty("ADBE Point Control");
    textAnchor.name = "Text AnkerPoint";
    textAnchor.property("Point").setValue([0, -40]);
}

function applyPositionExpressions() {
    // Position Y Expression
    var positionYExp = `
        var way_style = effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style");
        var seed = effect("${EFFECT_NAMES.RANDOM}")("SeedRandom");
        var prop = effect("${EFFECT_NAMES.POSITION}")("Ani - Position");
        if(way_style==2 || way_style==3){
            seedRandom(seed,true);
            [0 , random(-thisComp.height/2,thisComp.height/2)];
        }else{
            [0,prop[1]];
        }
    `;
    
    // Position X Expression
    var positionXExp = `
        var way_style = effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style");
        var seed = effect("${EFFECT_NAMES.RANDOM}")("SeedRandom");
        var prop = effect("${EFFECT_NAMES.POSITION}")("Ani - Position");
        if(way_style==2 || way_style==3){
            seedRandom(seed,true);
            [random(-thisComp.width/2,thisComp.width/2), 0];
        }else{
            [prop[0],0];
        }
    `;
    
    // Anchor Point Expression
    var anchorExp = `
        [0,-40]+effect("${EFFECT_NAMES.POSITION}")("Text AnkerPoint");
    `;
}
```

#### 3.4.3 作成するプロパティ
- Ani - Position (Point) - 位置制御値
- Text AnkerPoint (Point) - アンカーポイント調整

### 3.5 Transform Controller Module
**ファイル名**: `TextSelector_Transform.jsx`

#### 3.5.1 役割
- スケール、回転、歪みの制御
- 各変形の有効/無効切り替え
- ランダム変形の生成

#### 3.5.2 実装内容
```javascript
function createTransformController() {
    var effect = thisLayer.effect.addProperty("ADBE Group");
    effect.name = EFFECT_NAMES.TRANSFORM;
    
    // Scale Controls
    var addScale = effect.property.addProperty("ADBE Point Control");
    addScale.name = "Add Scale";
    
    var scaleOn = effect.property.addProperty("ADBE Checkbox Control");
    scaleOn.name = "Scale : ON";
    
    // Rotation Controls
    var addRotation = effect.property.addProperty("ADBE Slider Control");
    addRotation.name = "Add Rotation";
    
    var rotationOn = effect.property.addProperty("ADBE Checkbox Control");
    rotationOn.name = "Rotation : ON";
    
    // Distortion Controls
    var addDistortion = effect.property.addProperty("ADBE Slider Control");
    addDistortion.name = "Add Distortion";
    
    var addDisAxis = effect.property.addProperty("ADBE Slider Control");
    addDisAxis.name = "Add Dis - Axis";
    
    var distortionOn = effect.property.addProperty("ADBE Checkbox Control");
    distortionOn.name = "Distortion : ON";
}

function applyTransformExpressions() {
    // Scale Expression
    var scaleExp = `
        var way_style = effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style");
        var seed = effect("${EFFECT_NAMES.RANDOM}")("SeedRandom");
        var prop = effect("${EFFECT_NAMES.TRANSFORM}")("Add Scale");
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Scale : ON");
        if(way_style==2 && c==true|| way_style==3 && c==true){
            seedRandom(seed,true);
            [random(-2000,2000) , random(-2000,2000)];
        }else{
            [100,100]+[prop[0],prop[1]];
        }
    `;
    
    // Rotation Expression
    var rotationExp = `
        var way_style = effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style");
        var seed = effect("${EFFECT_NAMES.RANDOM}")("SeedRandom");
        var prop = effect("${EFFECT_NAMES.TRANSFORM}")("Add Rotation");
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Rotation : ON");
        if(way_style==2 &&  c==true|| way_style==3 &&  c==true){
            seedRandom(seed,true);
            random(-359,359);
        }else{
            prop;
        }
    `;
    
    // Distortion Expression
    var distortionExp = `
        var way_style = effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style");
        var seed = effect("${EFFECT_NAMES.RANDOM}")("SeedRandom");
        var prop = effect("${EFFECT_NAMES.TRANSFORM}")("Add Distortion");
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Distortion : ON");
        if(way_style==2 &&  c==true|| way_style==3 &&  c==true){
            seedRandom(seed,true);
            random(-70,70);
        }else{
            prop;
        }
    `;
}
```

#### 3.5.3 作成するプロパティ
- Add Scale (Point) - スケール調整値
- Scale : ON (Checkbox) - スケール有効/無効
- Add Rotation (Slider) - 回転調整値
- Rotation : ON (Checkbox) - 回転有効/無効
- Add Distortion (Slider) - 歪み調整値
- Add Dis - Axis (Slider) - 歪み軸調整値
- Distortion : ON (Checkbox) - 歪み有効/無効

### 3.6 Wiggle Controller Module
**ファイル名**: `TextSelector_Wiggle.jsx`

#### 3.6.1 役割
- ウィグル効果の制御
- 各プロパティのウィグル設定
- 周波数とアンプリチュードの調整

#### 3.6.2 実装内容
```javascript
function createWiggleController() {
    var effect = thisLayer.effect.addProperty("ADBE Group");
    effect.name = EFFECT_NAMES.WIGGLE;
    
    // Wiggle Enable
    var wiggleAdd = effect.property.addProperty("ADBE Checkbox Control");
    wiggleAdd.name = "Add";
    
    // Frequency Control
    var flucSec = effect.property.addProperty("ADBE Point Control");
    flucSec.name = "Fluc/Sec";
    
    // Wiggle Properties
    var wigglePosition = effect.property.addProperty("ADBE Point Control");
    wigglePosition.name = "Position";
    
    var wiggleScale = effect.property.addProperty("ADBE Point Control");
    wiggleScale.name = "Scale";
    
    var wiggleDistortion = effect.property.addProperty("ADBE Slider Control");
    wiggleDistortion.name = "Distortion";
    
    var wiggleDisAxis = effect.property.addProperty("ADBE Slider Control");
    wiggleDisAxis.name = "Dis - Axis";
    
    var wiggleRotation = effect.property.addProperty("ADBE Slider Control");
    wiggleRotation.name = "Rotation";
}

function applyWiggleExpressions() {
    // Wiggle Position Expression
    var wigglePositionExp = `
        var Fluc = effect("${EFFECT_NAMES.WIGGLE}")("Fluc/Sec")[0];
        var posti = effect("${EFFECT_NAMES.ANIMATION}")("Posterize(0=FPS)");
        posterizeTime(posti == 0 ? 1/thisComp.frameDuration : posti);
        effect("${EFFECT_NAMES.WIGGLE}")("Add")==true ? 
            wiggle(Fluc,effect("${EFFECT_NAMES.WIGGLE}")("Position")[1],1,5,time+(textIndex+thisComp.frameDuration+2)) : 
            [0,0,0];
    `;
    
    // Combined Property Expressions
    var combinedPositionExp = `
        [effect("${EFFECT_NAMES.WIGGLE}")("Position")[0],effect("${EFFECT_NAMES.WIGGLE}")("Position")[1]]
    `;
    
    var combinedScaleExp = `
        [100,100]+[effect("${EFFECT_NAMES.WIGGLE}")("Scale")[0],effect("${EFFECT_NAMES.WIGGLE}")("Scale")[1]]
    `;
    
    var combinedDistortionExp = `
        effect("${EFFECT_NAMES.WIGGLE}")("Distortion")
    `;
    
    var combinedDisAxisExp = `
        effect("${EFFECT_NAMES.WIGGLE}")("Dis - Axis")
    `;
    
    var combinedRotationExp = `
        effect("${EFFECT_NAMES.WIGGLE}")("Rotation")
    `;
}
```

#### 3.6.3 作成するプロパティ
- Add (Checkbox) - ウィグル有効/無効
- Fluc/Sec (Point) - 周波数制御
- Position (Point) - 位置ウィグル
- Scale (Point) - スケールウィグル
- Distortion (Slider) - 歪みウィグル
- Dis - Axis (Slider) - 歪み軸ウィグル
- Rotation (Slider) - 回転ウィグル

### 3.7 Randomization System Module
**ファイル名**: `TextSelector_Random.jsx`

#### 3.7.1 役割
- ランダム化システムの管理
- シード値の制御
- 2-way ランダム化機能

#### 3.7.2 実装内容
```javascript
function createRandomizationSystem() {
    var effect = thisLayer.effect.addProperty("ADBE Group");
    effect.name = EFFECT_NAMES.RANDOM;
    
    // Seed Random
    var seedRandom = effect.property.addProperty("ADBE Slider Control");
    seedRandom.name = "SeedRandom";
    seedRandom.property("Slider").setValue(Math.random() * 1000);
    
    // 2-way Randomize Info
    var randomizeInfo = effect.property.addProperty("ADBE Group");
    randomizeInfo.name = "[2 way - Randomize]";
}

function applyRandomExpressions() {
    // 2-axis Randomizer for Position Y
    var randomY = `
        if(effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==2 || effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==3){
            ((textIndex%2)==0) ? selectorValue : -selectorValue;
        }else{
            selectorValue;
        }
    `;
    
    // 2-axis Randomizer for Position X
    var randomX = `
        if(effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==2 || effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==3){
            ((textIndex%3)==0) ? selectorValue : -selectorValue;
        }else{
            selectorValue;
        }
    `;
    
    // Scale Randomizer
    var randomScale = `
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Scale : ON");
        if(c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==2 || c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==3){
            ((textIndex%2)==0) ? selectorValue : -selectorValue;
        }else{
            selectorValue;
        }
    `;
    
    // Distortion Randomizer
    var randomDistortion = `
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Distortion : ON");
        if(c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==2 || c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==3){
            ((textIndex%2)==0) ? selectorValue : -selectorValue;
        }else{
            selectorValue;
        }
    `;
    
    // Rotation Randomizer
    var randomRotation = `
        var c = effect("${EFFECT_NAMES.TRANSFORM}")("Rotation : ON");
        if(c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==2 || c==true && effect("${EFFECT_NAMES.ANIMATION}")("Ani - Style")==3){
            ((textIndex%2)==0) ? selectorValue : -selectorValue;
        }else{
            selectorValue;
        }
    `;
}
```

#### 3.7.3 作成するプロパティ
- SeedRandom (Slider) - ランダムシード値
- [2 way - Randomize] (Group) - 2-way ランダム化情報

### 3.8 Utility Functions Module
**ファイル名**: `TextSelector_Utils.jsx`

#### 3.8.1 役割
- 共通のユーティリティ関数
- エラーハンドリング
- デバッグ機能

#### 3.8.2 実装内容
```javascript
// 共通ユーティリティ関数
function safeGetEffect(effectName) {
    try {
        return thisLayer.effect(effectName);
    } catch (e) {
        return null;
    }
}

function safeGetProperty(effect, propertyName) {
    try {
        return effect.property(propertyName);
    } catch (e) {
        return null;
    }
}

function debugLog(message) {
    var debugMode = safeGetEffect(EFFECT_NAMES.CORE);
    if (debugMode && debugMode.property("Debug Mode") && debugMode.property("Debug Mode").value) {
        // デバッグログ出力
    }
}

// エラーハンドリング
function handleError(error, context) {
    debugLog("Error in " + context + ": " + error.toString());
    return null;
}

// 値の範囲チェック
function clampValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// テキストインデックスの取得
function getTextIndex() {
    try {
        return textIndex;
    } catch (e) {
        return 1;
    }
}

// コンポジション情報の取得
function getCompInfo() {
    return {
        width: thisComp.width,
        height: thisComp.height,
        frameDuration: thisComp.frameDuration,
        time: time,
        inPoint: inPoint
    };
}
```

## 4. 実装順序とテスト戦略

### 4.1 実装順序
1. **TextSelector_Core.jsx** - 基盤システム
2. **TextSelector_Utils.jsx** - ユーティリティ関数
3. **TextSelector_Animation.jsx** - 基本アニメーション
4. **TextSelector_Random.jsx** - ランダム化システム
5. **TextSelector_Opacity.jsx** - 不透明度制御
6. **TextSelector_Position.jsx** - 位置制御
7. **TextSelector_Transform.jsx** - 変形制御
8. **TextSelector_Wiggle.jsx** - ウィグル効果

### 4.2 テスト戦略
- 各モジュールの独立テスト
- モジュール間の統合テスト
- 元のプリセットとの機能比較テスト
- パフォーマンステスト

### 4.3 統合方法
```javascript
// Master Script - TextSelector_Master.jsx
#include "TextSelector_Core.jsx"
#include "TextSelector_Utils.jsx"
#include "TextSelector_Animation.jsx"
#include "TextSelector_Random.jsx"
#include "TextSelector_Opacity.jsx"
#include "TextSelector_Position.jsx"
#include "TextSelector_Transform.jsx"
#include "TextSelector_Wiggle.jsx"

// 全モジュールの初期化
function initializeTextSelector() {
    createCoreSystem();
    createAnimationController();
    createRandomizationSystem();
    createOpacityController();
    createPositionController();
    createTransformController();
    createWiggleController();
    
    // エクスプレッションの適用
    applyAllExpressions();
}

function applyAllExpressions() {
    applyAnimationExpressions();
    applyRandomExpressions();
    applyOpacityExpressions();
    applyPositionExpressions();
    applyTransformExpressions();
    applyWiggleExpressions();
}

// 実行
initializeTextSelector();
```

## 5. 拡張性と今後の展望

### 5.1 拡張可能な機能
- 新しいアニメーションパターン
- 追加的な変形効果
- カスタムランダム化パターン
- 高度なタイミング制御

### 5.2 保守性の向上
- モジュール別の独立更新
- バージョン管理
- エラーハンドリングの強化
- デバッグ機能の充実

### 5.3 パフォーマンス最適化
- 不要な計算の削除
- エクスプレッションの最適化
- キャッシュ機能の実装
- 条件分岐の最適化

この設計により、元のText_Selector.ffxプリセットの機能を完全に再現しながら、より保守性が高く拡張可能なシステムを構築することができます。