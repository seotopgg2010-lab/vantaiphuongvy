import React from 'react';
import { Button, ButtonProps } from '../ui';

export interface CTAButtonProps extends Omit<ButtonProps, 'variant'> {
  text?: string;
  href?: string;
}

export const CTAButton = ({ text = 'Gửi yêu cầu', href = '/lien-he', ...props }: CTAButtonProps) => {
  return (
    <Button variant="cta" href={href} {...props}>
      {text}
    </Button>
  );
};
