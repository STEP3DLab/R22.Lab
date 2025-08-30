import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Nav } from '../Step3DPrototype';

describe('Nav', () => {
  it('calls setOpen when toggle button is clicked', () => {
    const setOpen = jest.fn();
    const { getByRole } = render(<Nav open={false} setOpen={setOpen} />);
    fireEvent.click(getByRole('button', { name: /toggle menu/i }));
    expect(setOpen).toHaveBeenCalledWith(true);
  });
});
