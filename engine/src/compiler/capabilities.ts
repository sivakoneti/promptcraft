/** Field support is expressed as scene semantics, not provider API guarantees. */
export const SCENE_CAPABILITIES = {
  modes: ['photo', 'anime', 'edit', 'video'],
  shared: ['subject', 'action', 'environment', 'optics.*', 'lighting.*', 'style.*', 'filters', 'spatial.foreground', 'spatial.midground', 'spatial.background', 'physics.materialProperties', 'physics.invariance', 'references', 'referenceOptions', 'aspectRatio', 'noText', 'negativePrompt', 'candidShot', 'showNewAnglePrompt'],
  videoOnly: ['motion.*', 'kinematics.*', 'anchoring.*', 'actionChoreography.*', 'spatial.trajectory', 'spatial.rackFocus', 'physics.forces', 'physics.massAndInertia', 'physics.causalChain', 'timelineOptions'],
  parameters: { seed: 'portable caller hint on every target; caller maps to its generation API', quality: 'Midjourney only', rawStylize: 'Midjourney only; defaults on for that target', tokenBudget: 'advisory limit on estimated emitted tokens; default 2048' },
  unsupportedPolicy: 'Warn with field path; do not silently discard supplied unsupported scene settings.',
  timelinePolicy: 'Continuous timelineBeats do not create cuts. directorShots create cuts, inherit scene fields and allow nested overrides. Arrays replace inherited arrays.',
  catalogPolicy: 'Exact ID, exact label, category alias, slug, then unique prefix. Ambiguous or unknown values remain custom text with a diagnostic.',
  outputContract: 'Prompt text and portable metadata; not a ready-to-submit provider API request. No provider version or generation quality guarantee is implied.',
} as const;
