import { BusTimePipe } from './bus-time.pipe';

describe('BusTimePipe', () => {
  it('create an instance', () => {
    const pipe = new BusTimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform DLY', () => {
    const pipe = new BusTimePipe();
    const result = pipe.transform('DLY');
    expect(result).toBe('Delayed');
  });

  it('should transform DUE', () => {
    const pipe = new BusTimePipe();
    const result = pipe.transform('DUE');
    expect(result).toBe('Due');
  });
});
