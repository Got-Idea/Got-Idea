import React, { FC } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };

const Button: FC<ButtonProps> = ({ children, className, variant = 'secondary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--gotidea-bg)]';
  const variantClasses = {
    primary: 'bg-[var(--gotidea-primary)] text-white hover:bg-[var(--gotidea-primary-hover)] focus:ring-[var(--gotidea-primary)] shadow-[var(--gotidea-shadow)] hover:-translate-y-0.5 hover:shadow-[var(--gotidea-shadow-lg)]',
    secondary: 'bg-[var(--gotidea-bg-alt)] text-[var(--gotidea-text)] border border-[var(--gotidea-border)] hover:bg-[var(--gotidea-bg)] focus:ring-[var(--gotidea-primary)] hover:border-[var(--gotidea-primary)]/50'
  };
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};

export default Button;
