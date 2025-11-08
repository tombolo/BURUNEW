"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GlobalLoading.module.scss';

// Import your logo - make sure the path is correct
import LOGO from './Logo/NILOTE.png';

export const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Unique color palette - modern and vibrant
    const colors = {
        primary: '#667EEA',    // Soft indigo
        secondary: '#764BA2',  // Deep purple
        accent: '#F093FB',     // Vibrant pink
        teal: '#4FD1C5',       // Fresh teal
        coral: '#FC8181',      // Warm coral
        dark: '#1A202C',       // Rich dark
        light: '#F7FAFC',      // Clean light
        surface: 'rgba(255, 255, 255, 0.1)', // Glass surface
        gradient1: '#FF6B6B',  // Coral red
        gradient2: '#4ECDC4',  // Mint teal
        gradient3: '#45B7D1'   // Sky blue
    };

    // Loading content remains the same
    const loadingContent = {
        partnership: { text: "In partnership with", company: "DERIV", type: "partnership" },
        powered: { text: "Powered by", company: "DERIV", type: "powered" },
        journey: { text: "Simplifying your", highlight: "trading journey", type: "journey" }
    };

    useEffect(() => {
        const duration = 10000;
        const startTime = Date.now();
        let animationFrame;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration * 100, 100);
            
            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
            const easedProgress = easeOutQuart(progress / 100) * 100;
            
            setProgress(Math.min(easedProgress, 100));
            
            if (progress < 100) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setTimeout(() => setIsComplete(true), 600);
            }
        };
        
        animationFrame = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // New animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
        },
        exit: { 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
        }
    };

    const logoVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: { 
            scale: 1,
            rotate: 0,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 1.2
            }
        }
    };

    const floatingOrbsVariants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div 
                    className={styles.globalLoading}
                    style={{
                        '--primary': colors.primary,
                        '--secondary': colors.secondary,
                        '--accent': colors.accent,
                        '--teal': colors.teal,
                        '--coral': colors.coral,
                        '--dark': colors.dark,
                        '--light': colors.light,
                        '--surface': colors.surface,
                        '--gradient1': colors.gradient1,
                        '--gradient2': colors.gradient2,
                        '--gradient3': colors.gradient3
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* New background elements */}
                    <div className={styles.orbBackground}>
                        <motion.div 
                            className={styles.orb1}
                            variants={floatingOrbsVariants}
                            animate="animate"
                        />
                        <motion.div 
                            className={styles.orb2}
                            variants={floatingOrbsVariants}
                            animate="animate"
                            transition={{ delay: 0.5 }}
                        />
                        <motion.div 
                            className={styles.orb3}
                            variants={floatingOrbsVariants}
                            animate="animate"
                            transition={{ delay: 1 }}
                        />
                    </div>

                    {/* New geometric pattern */}
                    <div className={styles.geometricGrid}>
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                    </div>

                    <div className={styles.loadingContainer}>
                        {/* New logo design with halo effect */}
                        <motion.div
                            className={styles.logoWrapper}
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <div className={styles.logoHalo} />
                            <div className={styles.logoRing} />
                            <img 
                                src={LOGO} 
                                alt="Logo" 
                                className={styles.logo}
                            />
                        </motion.div>
                        
                        {/* New content layout - vertical stack with icons */}
                        <div className={styles.contentStack}>
                            {/* Partnership with icon */}
                            <motion.div 
                                className={styles.contentItem}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className={styles.itemIcon}>🤝</div>
                                <div className={styles.itemContent}>
                                    <span className={styles.itemLabel}>{loadingContent.partnership.text}</span>
                                    <span className={styles.itemValue}>{loadingContent.partnership.company}</span>
                                </div>
                            </motion.div>

                            {/* Powered by with icon */}
                            <motion.div 
                                className={styles.contentItem}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className={styles.itemIcon}>⚡</div>
                                <div className={styles.itemContent}>
                                    <span className={styles.itemLabel}>{loadingContent.powered.text}</span>
                                    <span className={styles.itemValue}>{loadingContent.powered.company}</span>
                                </div>
                            </motion.div>

                            {/* Journey with icon */}
                            <motion.div 
                                className={styles.contentItem}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className={styles.itemIcon}>🚀</div>
                                <div className={styles.itemContent}>
                                    <span className={styles.itemLabel}>{loadingContent.journey.text}</span>
                                    <span className={styles.itemHighlight}>{loadingContent.journey.highlight}</span>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* New circular progress with percentage in center */}
                        <div className={styles.circularProgress}>
                            <svg className={styles.progressSvg} viewBox="0 0 100 100">
                                <circle className={styles.progressBg} cx="50" cy="50" r="45" />
                                <motion.circle 
                                    className={styles.progressFill}
                                    cx="50" 
                                    cy="50" 
                                    r="45"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </svg>
                            <div className={styles.progressText}>
                                {Math.round(progress)}%
                            </div>
                        </div>

                        {/* New loading text with dots animation */}
                        <motion.div 
                            className={styles.loadingDots}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <span>Loading</span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >.</motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            >.</motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                            >.</motion.span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoading;