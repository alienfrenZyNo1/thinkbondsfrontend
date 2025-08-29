// DOM interaction test helpers

import { vi } from 'vitest';

type Fn = (...args: unknown[]) => unknown;
type QueryFn = (selector: string) => MockElement | null;
type QueryAllFn = (selector: string) => MockElement[];

export type MockElement = {
  tagName: string;
  attributes: Record<string, string>;
  textContent: string;
  innerHTML: string;
  style: Record<string, unknown>;
  classList: {
    add: Fn;
    remove: Fn;
    contains: (c: string) => boolean;
    toggle: Fn;
  };
  addEventListener: Fn;
  removeEventListener: Fn;
  dispatchEvent: Fn;
  querySelector: QueryFn;
  querySelectorAll: QueryAllFn;
  getAttribute: (name: string) => string | null;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  [key: string]: unknown;
};

// Mock DOM element
export function mockElement(
  tagName: string,
  attributes: Record<string, string> = {},
  textContent: string = ''
): MockElement {
  const element: MockElement = {
    tagName: tagName.toUpperCase(),
    attributes,
    textContent,
    innerHTML: textContent,
    style: {},
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(false),
      toggle: vi.fn(),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    querySelector: vi.fn().mockReturnValue(null),
    querySelectorAll: vi.fn().mockReturnValue([]),
    getAttribute: (name: string) => attributes[name] || null,
    setAttribute: (name: string, value: string) => {
      attributes[name] = value;
    },
    removeAttribute: (name: string) => {
      delete attributes[name];
    },
  };

  return element;
}

// Mock HTMLInputElement
export function mockInputElement(
  value: string = '',
  type: string = 'text'
): MockElement & { value: string; type: string; checked?: boolean } {
  return {
    ...mockElement('input'),
    value,
    type,
    checked: type === 'checkbox' ? false : undefined,
    focus: vi.fn(),
    blur: vi.fn(),
    select: vi.fn(),
  };
}

// Mock HTMLButtonElement
export function mockButtonElement(
  textContent: string = 'Button',
  disabled: boolean = false
): MockElement & { disabled: boolean; click: Fn } {
  return {
    ...mockElement('button', {}, textContent),
    disabled,
    click: vi.fn(),
  };
}

// Mock HTMLFormElement
export function mockFormElement(): MockElement & {
  elements: unknown[];
  submit: Fn;
  reset: Fn;
} {
  return {
    ...mockElement('form'),
    elements: [],
    submit: vi.fn(),
    reset: vi.fn(),
  };
}

// Mock window.location
export function mockWindowLocation(url: string = 'http://localhost/') {
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
      origin: new URL(url).origin,
      pathname: new URL(url).pathname,
      search: new URL(url).search,
      hash: new URL(url).hash,
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
    },
    writable: true,
  });
}

// Mock window.localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      length: Object.keys(store).length,
    },
    writable: true,
  });

  return store;
}

// Mock window.sessionStorage
export function mockSessionStorage() {
  const store: Record<string, string> = {};

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      length: Object.keys(store).length,
    },
    writable: true,
  });

  return store;
}

// Mock document.cookie
export function mockDocumentCookie() {
  let cookie = '';

  Object.defineProperty(document, 'cookie', {
    get: () => cookie,
    set: value => {
      cookie = value;
    },
    configurable: true,
  });

  return cookie;
}

// Mock window.matchMedia
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock window.scrollTo
export function mockWindowScrollTo() {
  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
}

// Mock window.alert
export function mockWindowAlert() {
  Object.defineProperty(window, 'alert', {
    value: vi.fn(),
    writable: true,
  });
}

// Mock window.confirm
export function mockWindowConfirm(result: boolean = true) {
  Object.defineProperty(window, 'confirm', {
    value: vi.fn().mockReturnValue(result),
    writable: true,
  });
}
