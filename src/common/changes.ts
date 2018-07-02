import { sp, List } from '@pnp/sp';
import { initPnp } from './auth';

export class Changes {

  private list: List;
  private token: any;

  constructor(list: List | string) {
    this.list = typeof list === 'string' ? sp.web.getList(list) : list;
  }

  public initPnp(): Promise<void> {
    return initPnp().then(r => { return; });
  }

  public getCurrentToken(): Promise<any> {
    return this.list.select('CurrentChangeToken').get().then(({ CurrentChangeToken }) => {
      this.token = CurrentChangeToken;
      return CurrentChangeToken;
    });
  }

  public getChanges() {
    return this.list.getChanges({
      Item: true,
      Add: true,
      DeleteObject: true,
      Update: true,
      Restore: true,
      ChangeTokenStart: { ...this.token }
    });
  }

}
