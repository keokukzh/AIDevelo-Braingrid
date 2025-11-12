export interface BaseEvent {
  type: 'gift' | 'like' | 'share' | 'chat';
  user: string;
  timestamp?: number;
}

export interface GiftEvent extends BaseEvent {
  type: 'gift';
  amount: number;
  gift: string;
}

export interface LikeEvent extends BaseEvent {
  type: 'like';
  count: number;
}

export interface ShareEvent extends BaseEvent {
  type: 'share';
}

export interface ChatEvent extends BaseEvent {
  type: 'chat';
  message: string;
}

export type LiveEvent = GiftEvent | LikeEvent | ShareEvent | ChatEvent;

export function isGiftEvent(event: any): event is GiftEvent {
  return event?.type === 'gift' && typeof event.amount === 'number' && typeof event.gift === 'string';
}

export function isLikeEvent(event: any): event is LikeEvent {
  return event?.type === 'like' && typeof event.count === 'number';
}

export function isShareEvent(event: any): event is ShareEvent {
  return event?.type === 'share';
}

export function isChatEvent(event: any): event is ChatEvent {
  return event?.type === 'chat' && typeof event.message === 'string';
}

export function isValidEvent(event: any): event is LiveEvent {
  return (
    isGiftEvent(event) ||
    isLikeEvent(event) ||
    isShareEvent(event) ||
    isChatEvent(event)
  );
}

