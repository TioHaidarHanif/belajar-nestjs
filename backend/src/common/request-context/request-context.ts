import { AsyncLocalStorage } from 'node:async_hooks';

type Store = { requestId?: string } | undefined;

const als = new AsyncLocalStorage<Store>();

export const RequestContext = {
  run(store: Store, fn: (...args: any[]) => any) {
    return als.run(store, fn);
  },
  getRequestId(): string | undefined {
    return als.getStore()?.requestId;
  },
  setRequestId(requestId: string) {
    const store = als.getStore() ?? {};
    store.requestId = requestId;
  },
};

export default RequestContext;
