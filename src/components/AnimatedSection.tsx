"use client";

import { ReactNode, useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale';
    delay?: number;
    style?: React.CSSProperties;
    id?: string;
}

export function AnimatedSection({
    children,
    className = '',
    animation = 'fade-up',
    delay = 0,
    style,
    id
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(element);
        return () => observer.unobserve(element);
    }, [delay]);

    const animationClass = {
        'fade-up': 'animate-on-scroll',
        'slide-left': 'animate-slide-left',
        'slide-right': 'animate-slide-right',
        'scale': 'animate-scale'
    }[animation];

    return (
        <div
            ref={ref}
            id={id}
            className={`${animationClass} ${isVisible ? 'visible' : ''} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

// Animated grid with staggered children
interface AnimatedGridProps {
    children: ReactNode[];
    className?: string;
    style?: React.CSSProperties;
    staggerDelay?: number;
}

export function AnimatedGrid({
    children,
    className = '',
    style,
    staggerDelay = 100
}: AnimatedGridProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    children.forEach((_, i) => {
                        setTimeout(() => {
                            setVisibleItems(prev => {
                                const newState = [...prev];
                                newState[i] = true;
                                return newState;
                            });
                        }, i * staggerDelay);
                    });
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );

        observer.observe(element);
        return () => observer.unobserve(element);
    }, [children.length, staggerDelay]);

    return (
        <div ref={ref} className={className} style={style}>
            {children.map((child, i) => (
                <div
                    key={i}
                    className={`animate-on-scroll ${visibleItems[i] ? 'visible' : ''}`}
                    style={{ transitionDelay: `${i * 0.08}s` }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
