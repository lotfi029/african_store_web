import { trustItems } from './trust-row';

describe('trust row (Option C §3 row 8, owner M-3)', () => {
  it('flags off (default): licensed + receipt + secure payment', () => {
    expect(trustItems({ showZakat: false, showUpdates: false }).map((i) => i.key)).toEqual([
      'licensed',
      'receipt',
      'payment',
    ]);
  });

  it('W-00: no placeholder licence number in any item', () => {
    for (const i of trustItems({ showZakat: true, showUpdates: true })) expect(i.text).not.toContain('[');
  });

  it('showcase mode: no "instant receipt by SMS after payment", no payment methods (nothing can be paid yet)', () => {
    expect(trustItems({ showZakat: false, showUpdates: false }, true).map((i) => i.key)).toEqual([
      'licensed',
    ]);
  });

  it('each flag adds its item, in the mockup order', () => {
    expect(trustItems({ showZakat: true, showUpdates: false }).map((i) => i.key)).toEqual([
      'licensed',
      'receipt',
      'payment',
      'zakat',
    ]);
    expect(trustItems({ showZakat: true, showUpdates: true }).map((i) => i.key)).toEqual([
      'licensed',
      'receipt',
      'payment',
      'zakat',
      'updates',
    ]);
  });
});
