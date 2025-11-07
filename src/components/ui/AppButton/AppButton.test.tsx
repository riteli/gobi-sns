import { render, screen } from '@testing-library/react';

import AppButton from './AppButton';

describe('AppButton Component', () => {
  test('propsで渡したchildren(テキスト)が正しく表示されること', () => {
    const buttonText = 'テストボタン';

    render(<AppButton>{buttonText}</AppButton>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeVisible();
  });

  test('disable propがtrueの場合、button要素がdisabled属性を持つこと', () => {
    const buttonText = '無効なボタン';

    render(<AppButton disabled>{buttonText}</AppButton>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeDisabled();
  });

  test('href propが渡された場合、link要素になること', () => {
    const linkText = 'テストリンク';
    const linkHref = 'https://example.com/';

    render(<AppButton href={linkHref}>{linkText}</AppButton>);

    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toBeVisible();
    expect(linkElement).toHaveAttribute('href', linkHref);
  });
});
