import React, { useState, useRef, useEffect } from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import './disclaimer.scss';

const Disclaimer = () => {
    const { isDesktop, isMobile } = useDevice();
    const [isExpanded, setIsExpanded] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const toggleDisclaimer = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsExpanded(!isExpanded);
        
        // Center the modal when first opened
        if (!isExpanded && modalRef.current) {
            const modalWidth = modalRef.current.offsetWidth || 600;
            const modalHeight = modalRef.current.offsetHeight || 400;
            setPosition({
                x: (window.innerWidth - modalWidth) / 2,
                y: (window.innerHeight - modalHeight) / 2
            });
        }
    };

    const closeDisclaimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsExpanded(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDesktop || !modalRef.current) return;
        
        // Don't start dragging if clicking on close button
        if ((e.target as HTMLElement).closest('.disclaimer-close-button')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
        const overlayLeft = overlayRect?.left || 0;
        const overlayTop = overlayRect?.top || 0;
        const rect = modalRef.current.getBoundingClientRect();
        
        setDragOffset({
            x: (e.clientX - overlayLeft) - position.x,
            y: (e.clientY - overlayTop) - position.y
        });
        setIsDragging(true);
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isDragging || !isDesktop || !modalRef.current) return;

        const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
        const overlayLeft = overlayRect?.left || 0;
        const overlayTop = overlayRect?.top || 0;
        
        const newX = e.clientX - overlayLeft - dragOffset.x;
        const newY = e.clientY - overlayTop - dragOffset.y;

        const overlayWidth = overlayRect?.width || window.innerWidth;
        const overlayHeight = overlayRect?.height || window.innerHeight;
        const maxX = overlayWidth - modalRef.current.offsetWidth;
        const maxY = overlayHeight - modalRef.current.offsetHeight;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    }, [isDragging, isDesktop, dragOffset]);

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isMobile || !modalRef.current) return;

        const touch = e.touches[0];
        if ((touch.target as HTMLElement).closest('.disclaimer-close-button')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
        const overlayLeft = overlayRect?.left || 0;
        const overlayTop = overlayRect?.top || 0;
        
        setDragOffset({
            x: (touch.clientX - overlayLeft) - position.x,
            y: (touch.clientY - overlayTop) - position.y
        });
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !isMobile || !modalRef.current) return;

        e.preventDefault();
        const touch = e.touches[0];
        const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
        const overlayLeft = overlayRect?.left || 0;
        const overlayTop = overlayRect?.top || 0;
        
        const newX = touch.clientX - overlayLeft - dragOffset.x;
        const newY = touch.clientY - overlayTop - dragOffset.y;

        const overlayWidth = overlayRect?.width || window.innerWidth;
        const overlayHeight = overlayRect?.height || window.innerHeight;
        const maxX = overlayWidth - modalRef.current.offsetWidth;
        const maxY = overlayHeight - modalRef.current.offsetHeight;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Center modal when first opened
    useEffect(() => {
        if (isExpanded && modalRef.current) {
            // Use setTimeout to ensure DOM is rendered
            setTimeout(() => {
                if (modalRef.current) {
                    const modalWidth = modalRef.current.offsetWidth || 600;
                    const modalHeight = modalRef.current.offsetHeight || 400;
                    const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
                    const overlayWidth = overlayRect?.width || window.innerWidth;
                    const overlayHeight = overlayRect?.height || window.innerHeight;
                    
                    setPosition({
                        x: (overlayWidth - modalWidth) / 2,
                        y: (overlayHeight - modalHeight) / 2
                    });
                }
            }, 0);
        }
    }, [isExpanded]);

    // Add/remove mouse event listeners for desktop dragging
    useEffect(() => {
        if (isDesktop && isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDesktop, isDragging, handleMouseMove, handleMouseUp]);

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isExpanded) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    return (
        <>
            {/* Trigger button at the bottom */}
            <div className="disclaimer-trigger" onClick={toggleDisclaimer} data-testid='dt_disclaimer_header'>
                <div className={`disclaimer-header ${isMobile ? 'disclaimer-header--mobile' : 'disclaimer-header--desktop'}`}>
                    <Text size={isMobile ? 'xxxs' : 'xxs'} weight='bold'>
                        <Localize i18n_default_text='Risk Disclaimer' />
                    </Text>
                </div>
            </div>

            {/* Modal overlay and content */}
            {isExpanded && (
                <div className="disclaimer-modal-overlay" onClick={handleBackdropClick}>
                    <div
                        ref={modalRef}
                        data-testid='dt_traders_hub_disclaimer'
                        className={`disclaimer-modal ${isMobile ? 'disclaimer-modal--mobile' : 'disclaimer-modal--desktop'} ${isDragging ? 'disclaimer-modal--dragging' : ''}`}
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            transition: isDragging ? 'none' : 'transform 0.2s ease',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div 
                            className="disclaimer-modal-header" 
                            style={{ cursor: isDragging ? 'grabbing' : 'move' }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Text size={isMobile ? 'xs' : 's'} weight='bold'>
                                <Localize i18n_default_text='Risk Disclaimer' />
                            </Text>
                            <button
                                className="disclaimer-close-button"
                                onClick={closeDisclaimer}
                                aria-label="Close"
                                type="button"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className='disclaimer-text'>
                            <p>
                                <Localize i18n_default_text='Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk.' />
                            </p>
                            
                            <p>
                                <strong><Localize i18n_default_text='Please ensure you understand these risks:' /></strong>
                            </p>
                            
                            <ul>
                                <li>
                                    <Localize i18n_default_text='You may lose some or all of your invested capital' />
                                </li>
                                <li>
                                    <Localize i18n_default_text='Currency conversion affects your profit/loss' />
                                </li>
                                <li>
                                    <Localize i18n_default_text='Markets can be volatile and unpredictable' />
                                </li>
                            </ul>
                            
                            <div className='important-note'>
                                <Localize i18n_default_text='<strong>Important:</strong> Never trade with borrowed money or funds you cannot afford to lose.' />
                            </div>
                            
                            <p>
                                <Localize i18n_default_text='By continuing, you confirm that you understand these risks and that you are aware that Deriv does not provide investment advice.' />
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Disclaimer;