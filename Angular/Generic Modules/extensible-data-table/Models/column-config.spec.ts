import { ColumnConfig } from './column-config';

describe('ColumnConfig', () => {
  it('should create an instance', () => {
    expect(new ColumnConfig({ColumnName: ''})).toBeTruthy();
  });
});
