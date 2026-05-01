'use client';

// Re-export initialization logic from dedicated impl file (avoids circular deps)
export { initializeFirebase, getSdks } from '@/firebase/index-impl';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
