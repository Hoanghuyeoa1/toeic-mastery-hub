/**
 * TOEIC Mastery Hub — Multi-Tab Coordinator & Storage Ownership Lease (Phase 11)
 *
 * Implements browser-local mutual exclusion and multi-tab conflict resolution:
 * - Single writer lease model: exactly ONE tab has edit privileges for a session at any time.
 * - Secondary tabs transition to 'read_only_conflict' with takeover capability.
 * - Lease heartbeat and TTL: auto-expires if the active tab crashes or closes.
 * - BroadcastChannel communication with automatic fallback for isolated test environments.
 * - Stale tab overwrite protection: blocks storage mutations if tab lease was revoked.
 */

import {
  ExamTabLease,
  TabLeaseMessage,
  TabLeaseStatus,
} from '../types/mockExam';

export const ACTIVE_TAB_LEASE_KEY = 'toeic_exam_active_lease_v1';
export const EXAM_BROADCAST_CHANNEL = 'toeic_exam_session_bus';

export const DEFAULT_LEASE_TTL_MS = 5000;       // 5 seconds TTL
export const DEFAULT_HEARTBEAT_INTERVAL_MS = 1500; // 1.5 seconds heartbeat

/**
 * Safely resolves the storage instance across browser and test environments.
 */
function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (
      typeof globalThis !== 'undefined' &&
      (globalThis as unknown as { localStorage?: Storage }).localStorage
    ) {
      return (globalThis as unknown as { localStorage: Storage }).localStorage;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates a unique, collision-resistant identifier for a tab instance.
 */
export function generateTabId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `tab_${timestamp}_${randomPart}`;
}

// Global in-memory broadcast bus listeners for cross-tab or test mocking
type BusListener = (msg: TabLeaseMessage) => void;
const memoryBusListeners = new Set<BusListener>();

let nativeBroadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof nativeBroadcastChannel !== 'undefined' && nativeBroadcastChannel) {
    return nativeBroadcastChannel;
  }
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      nativeBroadcastChannel = new BroadcastChannel(EXAM_BROADCAST_CHANNEL);
      nativeBroadcastChannel.onmessage = (event) => {
        const msg = event.data as TabLeaseMessage;
        if (msg && msg.type) {
          memoryBusListeners.forEach((listener) => {
            try {
              listener(msg);
            } catch {
              // Ignore subscriber errors
            }
          });
        }
      };
      return nativeBroadcastChannel;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Broadcasts an event to all tabs participating on the session bus.
 */
export function broadcastTabMessage(msg: TabLeaseMessage): void {
  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(msg);
    } catch {
      // Fallback to memory
    }
  }

  // Deliver to in-process memory listeners (supports test runners and same-window components)
  memoryBusListeners.forEach((listener) => {
    try {
      listener(msg);
    } catch {
      // Ignore subscriber errors
    }
  });
}

/**
 * Subscribes to multi-tab coordination events.
 */
export function subscribeToTabBus(callback: BusListener): () => void {
  getBroadcastChannel(); // Ensure native channel is attached if available
  memoryBusListeners.add(callback);
  return () => {
    memoryBusListeners.delete(callback);
  };
}

/**
 * Retrieves the currently active lease record from storage.
 */
export function getCurrentTabLease(): ExamTabLease | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(ACTIVE_TAB_LEASE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExamTabLease;
  } catch {
    return null;
  }
}

export const getActiveTabLease = getCurrentTabLease;

/**
 * Attempts to acquire the single-writer ownership lease for a session.
 *
 * Rules:
 * - If no lease exists, or lease is for a different session, or lease expired: acquires cleanly.
 * - If lease belongs to the same tabId: refreshes lease (idempotent).
 * - If force is true: takes over lease immediately (user explicit takeover).
 * - If lease belongs to another tab and is active: rejects with conflict.
 */
export function acquireTabLease(
  sessionId: string,
  tabId: string,
  now = Date.now(),
  options?: { force?: boolean; ttlMs?: number }
): {
  acquired: boolean;
  lease: ExamTabLease;
  conflictTabId?: string;
  status: TabLeaseStatus;
} {
  const storage = getStorage();
  const ttl = options?.ttlMs ?? DEFAULT_LEASE_TTL_MS;
  const force = options?.force ?? false;

  const currentLease = getCurrentTabLease();

  // Condition 1: Can acquire if no active lease, or expired, or same tab, or force takeover
  const isAvailable =
    !currentLease ||
    currentLease.sessionId !== sessionId ||
    currentLease.expiresAt < now ||
    currentLease.tabId === tabId ||
    force;

  if (isAvailable) {
    const newLease: ExamTabLease = {
      sessionId,
      tabId,
      acquiredAt: currentLease?.tabId === tabId ? currentLease.acquiredAt : now,
      lastHeartbeatAt: now,
      expiresAt: now + ttl,
    };

    if (storage) {
      try {
        storage.setItem(ACTIVE_TAB_LEASE_KEY, JSON.stringify(newLease));
      } catch {
        // Storage write failure
      }
    }

    broadcastTabMessage({
      type: force ? 'TAKEOVER' : 'LEASE_ACQUIRED',
      sessionId,
      tabId,
      timestamp: now,
    });

    return {
      acquired: true,
      lease: newLease,
      status: 'active',
    };
  }

  // Condition 2: Active conflicting lease belongs to another tab
  return {
    acquired: false,
    lease: currentLease,
    conflictTabId: currentLease.tabId,
    status: 'read_only_conflict',
  };
}

/**
 * Renews the active lease heartbeat to prevent expiration.
 */
export function renewTabLease(
  sessionId: string,
  tabId: string,
  now = Date.now(),
  ttlMs = DEFAULT_LEASE_TTL_MS
): { renewed: boolean; lease?: ExamTabLease } {
  const storage = getStorage();
  const currentLease = getCurrentTabLease();

  if (
    currentLease &&
    currentLease.sessionId === sessionId &&
    currentLease.tabId === tabId
  ) {
    const renewedLease: ExamTabLease = {
      ...currentLease,
      lastHeartbeatAt: now,
      expiresAt: now + ttlMs,
    };

    if (storage) {
      try {
        storage.setItem(ACTIVE_TAB_LEASE_KEY, JSON.stringify(renewedLease));
      } catch {
        // Ignore write error
      }
    }

    broadcastTabMessage({
      type: 'HEARTBEAT',
      sessionId,
      tabId,
      timestamp: now,
    });

    return { renewed: true, lease: renewedLease };
  }

  return { renewed: false };
}

/**
 * Explicitly releases the lease (e.g. tab closing or candidate submitting).
 */
export function releaseTabLease(sessionId: string, tabId: string): void {
  const storage = getStorage();
  const currentLease = getCurrentTabLease();

  if (
    currentLease &&
    currentLease.sessionId === sessionId &&
    currentLease.tabId === tabId
  ) {
    if (storage) {
      storage.removeItem(ACTIVE_TAB_LEASE_KEY);
    }
    broadcastTabMessage({
      type: 'LEASE_REVOKED',
      sessionId,
      tabId,
      timestamp: Date.now(),
    });
  }
}

/**
 * Checks whether a specific tabId is currently authorized to write session mutations.
 *
 * Prevents stale background tabs from overwriting storage after a takeover.
 */
export function isTabAuthorizedToSave(
  sessionId: string,
  tabId: string,
  now = Date.now()
): boolean {
  const currentLease = getCurrentTabLease();
  if (!currentLease) {
    // If no lease exists in storage, allow graceful initialization
    return true;
  }

  if (currentLease.sessionId !== sessionId) {
    return true;
  }

  // Authorized ONLY if tabId matches and lease has not expired
  return currentLease.tabId === tabId && currentLease.expiresAt >= now;
}
