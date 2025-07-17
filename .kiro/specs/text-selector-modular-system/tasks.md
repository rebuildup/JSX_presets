# Implementation Plan

- [x] 1. Set up foundation modules and core infrastructure

  - Create TextSelector_Utils.jsx with safe property access functions and common utilities
  - Implement TextSelector_ErrorHandler.jsx with debug levels, logging system, and safe execution wrappers
  - Create global constants, namespacing, and version management system
  - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3, 14.1, 14.2_

- [x] 2. Implement core system initialization

  - Create TextSelector_Core.jsx with system initialization functions
  - Implement control null layer creation with proper naming and organization
  - Add core system information display and global enable/disable controls
  - Create effect creation interfaces (createSliderControl, createCheckboxControl, createPointControl)
  - _Requirements: 1.1, 1.3, 1.4, 10.5, 18.2_

- [x] 3. Build animation controller module

  - Create TextSelector_Animation.jsx with timing and sequencing control
  - Implement Animation slider (0-100), Delay control (0-2 seconds), and Ani-Style dropdown (1-3)
  - Add Posterize control for frame rate management
  - Generate optimized position Y and X expressions with variable caching and conditional logic
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2, 15.1, 15.2_

- [x] 4. Create randomization system module

  - Implement TextSelector_Random.jsx with seed management and 2-way randomization
  - Add SeedRandom slider with random default value (0-1000 range)
  - Create 2-way randomizer expressions for position, scale, rotation, and distortion
  - Implement alternating positive/negative value logic based on textIndex
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 4.5_

- [x] 5. Implement opacity controller module

  - Create TextSelector_Opacity.jsx with auto and manual opacity modes
  - Add Opacity-Style control (1=Auto, 2=Manual) and opacity value controls
  - Generate auto opacity expressions with frame-based fade-in calculations
  - Implement manual opacity with character-based delay and valueAtTime calculations
  - Create opacity display logic with proper percentage to selector value conversion
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Build position controller module









  - Create TextSelector_Position.jsx with position and anchor point management
  - Implement Ani-Position point control and Text AnkerPoint control with default [0, -40]
  - Generate position expressions for single mode using manual values
  - Create 2-way positioning with random values within composition bounds using seedRandom
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Implement transform controller module







  - Create TextSelector_Transform.jsx with scale, rotation, and distortion controls
  - Add Add Scale point control, Add Rotation slider, and Add Distortion slider with respective ON/OFF toggles
  - Generate transform expressions for manual mode with additive values
  - Implement 2-way random mode with specified ranges: scale (-2000 to 2000), rotation (-359 to 359), distortion (-70 to 70)
  - Create conditional application logic respecting individual ON/OFF toggles
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 8. Create advanced wiggle controller module








  - Implement TextSelector_Wiggle.jsx with comprehensive wiggle effect generation
  - Add Wiggle Add checkbox, Fluc/Sec point control for separate X/Y frequencies
  - Create wiggle amplitude controls for Position, Scale, Rotation, and Distortion
  - Implement Wiggle Seed slider (1-1000) and Smooth Wiggle checkbox for sine wave calculations
  - Generate character-specific timing offsets (textIndex _ frameDuration _ 0.1) to prevent synchronized motion
  - Add performance optimization with early exit when disabled and posterizeTime integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 9. Integrate text animator system




  - Create functions to automatically add appropriate text animator properties for each effect type
  - Implement range selector and expression selector application for different animation types
  - Add Position 3D animators with proper expression binding for position effects
  - Create Opacity animators with expression selectors for opacity effects
  - Implement Scale, Rotation, and Skew animators for transform effects
  - Ensure multiple animators work together without conflicts or interference
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 10. Implement expression generation and optimization system




  - Create generateSafeExpression function with try-catch blocks and fallback values
  - Build expression template system with dynamic control layer name substitution
  - Implement optimized expression presets for Position Y, Position X, and 2-way randomizer
  - Add variable caching system to avoid redundant effect property lookups
  - Create conditional early exit strategies to skip unnecessary calculations
  - Optimize valueAtTime usage and implement result caching where possible
  - _Requirements: 8.1, 8.6, 9.1, 9.2, 9.4, 15.1, 15.2, 15.4, 16.1, 16.2, 16.3_

- [x] 11. Build comprehensive error handling and debugging system




  - Implement error classification system with descriptive error types (LAYER_NOT_FOUND, EFFECT_NOT_FOUND, etc.)
  - Create debug logging with ISO timestamps and context information to ExtendScript console
  - Add user-friendly alert messages for critical errors while maintaining operation
  - Implement debugger preference management for After Effects compatibility
  - Create layer and effect validation functions with proper error throwing
  - Add safe execution wrappers for all critical operations with fallback values
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 12. Create testing and validation framework


  - Implement unit test functions for core initialization, animation controller, and opacity controller
  - Build performance benchmarking tools for expression evaluation speed measurement
  - Create integration tests to verify module communication and cross-references
  - Add error recovery testing to validate graceful handling of missing layers and effects
  - Implement compatibility testing framework for different After Effects versions
  - Generate detailed test reporting with pass/fail status and performance metrics
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [x] 13. Implement performance optimization and memory management

  - Add multi-frame rendering compatibility with stateless expressions
  - Implement memory management with proper garbage collection and large array avoidance
  - Create render queue integration for batch processing optimization
  - Add smart expression evaluation with conditional execution
  - Optimize for JavaScript Engine with proper variable scoping and function optimization
  - Implement posterizeTime optimization based on composition frame rate settings
  - _Requirements: 9.3, 9.5, 15.3, 15.5, 15.6_

- [x] 14. Create master integration and distribution system

  - Build TextSelector_Master.jsx that includes all modules with proper dependency order
  - Create initializeTextSelector function that coordinates all module initialization
  - Implement applyAllExpressions function for comprehensive expression application
  - Add version management system with semantic versioning (2.0.0)
  - Create backward compatibility matrix and migration guidance
  - Build distribution package with organized folder structure and documentation
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 12.1, 12.2, 12.3, 12.4, 12.5, 18.1, 18.3, 18.4, 18.5_

- [x] 15. Implement advanced features and preset system

  - Create preset library with categorized animation patterns
  - Build custom expression template framework for user-defined patterns
  - Add project template system with standard folder structure and naming conventions
  - Implement automatic update checking mechanism
  - Create migration tools for transitioning from v1.x projects
  - Add installation system with clear instructions and dependency requirements
  - _Requirements: 16.4, 16.5, 18.1, 18.4, 18.5, 18.6_

- [x] 16. Final integration testing and validation
  - Perform comprehensive system testing with all modules integrated
  - Test complete animation workflows from initialization to final render
  - Validate cross-module communication and data flow integrity
  - Test error recovery scenarios with fault injection
  - Perform stress testing with maximum character counts and complex animations
  - Validate compatibility across different After Effects versions and project configurations
  - _Requirements: 12.1, 12.2, 12.3, 17.3, 17.4, 17.5_
