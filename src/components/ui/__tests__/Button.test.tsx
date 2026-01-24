import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
    describe('rendering', () => {
        it('should render with children text', () => {
            render(<Button>Click me</Button>);

            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });

        it('should render with custom className', () => {
            render(<Button className="custom-class">Button</Button>);

            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });
    });

    describe('variants', () => {
        it('should apply primary variant styles by default', () => {
            render(<Button>Primary</Button>);

            expect(screen.getByRole('button')).toHaveClass('btn-primary');
        });

        it('should apply secondary variant styles', () => {
            render(<Button variant="secondary">Secondary</Button>);

            expect(screen.getByRole('button')).toHaveClass('btn-secondary');
        });

        it('should apply ghost variant styles', () => {
            render(<Button variant="ghost">Ghost</Button>);

            expect(screen.getByRole('button')).toHaveClass('bg-transparent');
        });
    });

    describe('sizes', () => {
        it('should apply medium size by default', () => {
            render(<Button>Medium</Button>);

            expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2');
        });

        it('should apply small size', () => {
            render(<Button size="sm">Small</Button>);

            expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5');
        });

        it('should apply large size', () => {
            render(<Button size="lg">Large</Button>);

            expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3');
        });
    });

    describe('interactions', () => {
        it('should handle click events', async () => {
            const handleClick = jest.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            await user.click(screen.getByRole('button'));

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should be disabled when disabled prop is passed', () => {
            render(<Button disabled>Disabled</Button>);

            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('should pass through other HTML button attributes', () => {
            render(<Button type="submit" aria-label="Submit form">Submit</Button>);

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
            expect(button).toHaveAttribute('aria-label', 'Submit form');
        });
    });
});
