import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  className?: string;
  icon?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ 
  children, 
  href, 
  onClick, 
  variant = 'primary', 
  className = "",
  icon = true,
  fullWidth = false,
  ariaLabel,
  target,
  rel,
}) => {
  const baseStyles = "type-button inline-flex items-center justify-center px-8 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden";
  
  const variants = {
    primary: "bg-idasan-blue text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl border border-transparent",
    secondary: "bg-white text-idasan-blue hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/10",
    gold: "bg-idasan-yellow text-idasan-blue hover:shadow-xl hover:scale-[1.02] shadow-lg border border-transparent"
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-idasan-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </>
  );

  const combinedClassName = `${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <motion.a 
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={combinedClassName}
        aria-label={ariaLabel}
        target={target ?? (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel ?? (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={ariaLabel}
      className={combinedClassName}
    >
      {content}
    </motion.button>
  );
};
