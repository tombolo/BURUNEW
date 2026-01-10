import React, { useState, useRef, useEffect } from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import './disclaimer.scss';

const Disclaimer = () => {
    const { isDesktop, isMobile } = useDevice();
    const [isExpanded, setIsExpanded] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [triggerPosition, setTriggerPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isTriggerDragging, setIsTriggerDragging] = useState(false);
    const [wasTriggerDragged, setWasTriggerDragged] = useState(false);
    const dragStartPositionRef = useRef({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [triggerDragOffset, setTriggerDragOffset] = useState({ x: 0, y: 0 });

    const toggleDisclaimer = (e?: React.MouseEvent | React.TouchEvent) => {
        // Don't toggle if we just finished dragging
        if (wasTriggerDragged) {
            setWasTriggerDragged(false);
            e?.stopPropagation();
            return;
        }
        e?.stopPropagation();
        
        const willExpand = !isExpanded;
        
        // Calculate centered position immediately before opening (based on viewport)
        if (willExpand) {
            // Use estimated dimensions based on screen size to avoid jump
            const estimatedWidth = isMobile ? Math.min(window.innerWidth * 0.9, 400) : 600;
            const estimatedHeight = Math.min(window.innerHeight * 0.85, 500);
            
            setPosition({
                x: (window.innerWidth - estimatedWidth) / 2,
                y: (window.innerHeight - estimatedHeight) / 2
            });
            setIsInitialized(false);
        } else {
            // Reset when closing
            setPosition(null);
            setIsInitialized(false);
        }
        
        setIsExpanded(willExpand);
    };

    // Trigger button drag handlers
    const handleTriggerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDesktop || !triggerRef.current) return;
        
        e.preventDefault();
        e.stopPropagation();
        const rect = triggerRef.current.getBoundingClientRect();
        setTriggerDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        dragStartPositionRef.current = { x: e.clientX, y: e.clientY };
        setIsTriggerDragging(true);
        setWasTriggerDragged(false);
    };

    const handleTriggerMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isTriggerDragging || !isDesktop || !triggerRef.current) return;

        const newX = e.clientX - triggerDragOffset.x;
        const newY = e.clientY - triggerDragOffset.y;

        const maxX = window.innerWidth - triggerRef.current.offsetWidth;
        const maxY = window.innerHeight - triggerRef.current.offsetHeight;

        // Calculate relative to viewport (0,0 is top-left)
        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        // Check if we actually moved more than a few pixels
        const deltaX = Math.abs(e.clientX - dragStartPositionRef.current.x);
        const deltaY = Math.abs(e.clientY - dragStartPositionRef.current.y);
        if (deltaX > 5 || deltaY > 5) {
            setWasTriggerDragged(true);
        }

        setTriggerPosition({
            x: clampedX,
            y: clampedY
        });
    }, [isTriggerDragging, isDesktop, triggerDragOffset]);

    const handleTriggerMouseUp = React.useCallback(() => {
        if (isTriggerDragging && wasTriggerDragged) {
            // Reset after a short delay to allow click handler to check
            setTimeout(() => setWasTriggerDragged(false), 200);
        }
        setIsTriggerDragging(false);
    }, [isTriggerDragging, wasTriggerDragged]);

    const handleTriggerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isMobile || !triggerRef.current) return;

        const touch = e.touches[0];
        e.preventDefault();
        e.stopPropagation();
        const rect = triggerRef.current.getBoundingClientRect();
        setTriggerDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        });
        dragStartPositionRef.current = { x: touch.clientX, y: touch.clientY };
        setIsTriggerDragging(true);
        setWasTriggerDragged(false);
    };

    const handleTriggerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isTriggerDragging || !isMobile || !triggerRef.current) return;

        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - triggerDragOffset.x;
        const newY = touch.clientY - triggerDragOffset.y;

        const maxX = window.innerWidth - triggerRef.current.offsetWidth;
        const maxY = window.innerHeight - triggerRef.current.offsetHeight;

        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        // Check if we actually moved more than a few pixels
        const deltaX = Math.abs(touch.clientX - dragStartPositionRef.current.x);
        const deltaY = Math.abs(touch.clientY - dragStartPositionRef.current.y);
        if (deltaX > 5 || deltaY > 5) {
            setWasTriggerDragged(true);
        }

        setTriggerPosition({
            x: clampedX,
            y: clampedY
        });
    };

    const handleTriggerTouchEnd = () => {
        if (isTriggerDragging && wasTriggerDragged) {
            // Reset after a short delay to allow click handler to check
            setTimeout(() => setWasTriggerDragged(false), 200);
        }
        setIsTriggerDragging(false);
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

    // Fine-tune modal position after render to ensure perfect centering (only adjust if significantly different)
    useEffect(() => {
        if (isExpanded && modalRef.current && position && !isInitialized) {
            // Use a small delay to ensure DOM is fully rendered and dimensions are accurate
            const updatePosition = () => {
                if (modalRef.current && position) {
                    const modalWidth = modalRef.current.offsetWidth;
                    const modalHeight = modalRef.current.offsetHeight;
                    const overlayRect = modalRef.current.closest('.disclaimer-modal-overlay')?.getBoundingClientRect();
                    const overlayWidth = overlayRect?.width || window.innerWidth;
                    const overlayHeight = overlayRect?.height || window.innerHeight;
                    
                    // Calculate precise centered position
                    const newX = (overlayWidth - modalWidth) / 2;
                    const newY = (overlayHeight - modalHeight) / 2;
                    
                    // Only update if significantly different (more than 5px) to avoid visible jump
                    if (Math.abs(position.x - newX) > 5 || Math.abs(position.y - newY) > 5) {
                        setPosition({ x: newX, y: newY });
                    }
                    setIsInitialized(true);
                }
            };
            
            // Use setTimeout with minimal delay to allow render to complete
            const timer = setTimeout(updatePosition, 0);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, position, isInitialized]);

    // Add/remove mouse event listeners for modal dragging
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

    // Add/remove mouse event listeners for trigger button dragging
    useEffect(() => {
        if (isDesktop && isTriggerDragging) {
            document.addEventListener('mousemove', handleTriggerMouseMove);
            document.addEventListener('mouseup', handleTriggerMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleTriggerMouseMove);
                document.removeEventListener('mouseup', handleTriggerMouseUp);
            };
        }
    }, [isDesktop, isTriggerDragging, handleTriggerMouseMove, handleTriggerMouseUp]);

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
            {/* Trigger button at the bottom (draggable) */}
            <div 
                ref={triggerRef}
                className={`disclaimer-trigger ${isTriggerDragging ? 'disclaimer-trigger--dragging' : ''}`}
                onMouseDown={handleTriggerMouseDown}
                onMouseUp={handleTriggerMouseUp}
                onClick={toggleDisclaimer}
                onTouchStart={handleTriggerTouchStart}
                onTouchMove={handleTriggerTouchMove}
                onTouchEnd={handleTriggerTouchEnd}
                style={{
                    left: triggerPosition ? `${triggerPosition.x}px` : '50%',
                    top: triggerPosition ? `${triggerPosition.y}px` : undefined,
                    bottom: triggerPosition ? 'auto' : (isMobile ? '1rem' : '2rem'),
                    transform: triggerPosition 
                        ? undefined 
                        : 'translateX(-50%)',
                    transition: isTriggerDragging ? 'none' : 'all 0.2s ease'
                }}
                data-testid='dt_disclaimer_header'
            >
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
                        className={`disclaimer-modal ${isMobile ? 'disclaimer-modal--mobile' : 'disclaimer-modal--desktop'} ${isDragging ? 'disclaimer-modal--dragging' : ''} ${!isInitialized ? 'disclaimer-modal--initial' : ''}`}
                        style={position ? {
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            transition: isDragging ? 'none' : (isInitialized ? 'transform 0.2s ease-out' : 'transform 0s'),
                            position: 'absolute',
                            top: 0,
                            left: 0
                        } : {
                            // CSS will center it initially (shouldn't happen, but fallback)
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'transform 0.3s ease-out'
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