'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallery() {
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [galleryImages, setGalleryImages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const openLightbox = (index: number) => {
		setSelectedImage(index);
		document.body.style.overflow = 'hidden';
	};

	const closeLightbox = () => {
		setSelectedImage(null);
		document.body.style.overflow = 'auto';
	};

	const goToPrevious = () => {
		if (selectedImage !== null) {
			setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
		}
	};

	const goToNext = () => {
		if (selectedImage !== null) {
			setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
		}
	};

	// Fetch images
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const res = await fetch('/api/gallery');
				const data = await res.json();
				setGalleryImages(data);
			} catch (error) {
				console.error('Failed to load images');
			} finally {
				setLoading(false);
			}
		};
		fetchImages();
	}, []);

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (selectedImage === null) return;
			if (e.key === 'Escape') closeLightbox();
			if (e.key === 'ArrowLeft') goToPrevious();
			if (e.key === 'ArrowRight') goToNext();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedImage]);

	// Loading state - AFTER all hooks
	if (loading) {
		return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div></div>;
	}

	// Distribute images into columns for masonry layout
	const columns: typeof galleryImages[] = [[], [], []];
	galleryImages.forEach((image, index) => {
		columns[index % 3].push(image);
	});

	return (
		<>
			<div className="relative flex w-full flex-col items-center justify-center py-10 px-4">
				<div className="mx-auto grid w-full max-w-5xl gap-4 grid-cols-3">
					{columns.map((columnImages, colIndex) => (
						<div key={colIndex} className="grid gap-4">
							{columnImages.map((image, imgIndex) => {
								const globalIndex = galleryImages.findIndex(img => img.src === image.src);
								return (
									<GalleryImage
										key={`${colIndex}-${imgIndex}`}
										alt={image.alt}
										src={image.src}
										onClick={() => openLightbox(globalIndex)}
									/>
								);
							})}
						</div>
					))}
				</div>
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedImage !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
						onClick={closeLightbox}
					>
						{/* Close Button */}
						<button
							onClick={closeLightbox}
							className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
						>
							<X className="w-6 h-6" />
						</button>

						{/* Previous Button */}
						<button
							onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
							className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
						>
							<ChevronLeft className="w-8 h-8" />
						</button>

						{/* Next Button */}
						<button
							onClick={(e) => { e.stopPropagation(); goToNext(); }}
							className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
						>
							<ChevronRight className="w-8 h-8" />
						</button>

						{/* Image */}
						<motion.img
							key={selectedImage}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring", damping: 25 }}
							src={galleryImages[selectedImage].src}
							alt={galleryImages[selectedImage].alt}
							className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						/>

						{/* Image Counter */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/30 px-4 py-2 rounded-full">
							{selectedImage + 1} / {galleryImages.length}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

interface GalleryImageProps {
	alt: string;
	src: string;
	onClick: () => void;
}

function GalleryImage({ alt, src, onClick }: GalleryImageProps) {
	const ref = React.useRef(null);
	const isInView = useInView(ref, { once: true });
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	// Hide completely if image failed to load
	if (hasError) return null;

	return (
		<div
			ref={ref}
			className="relative overflow-hidden rounded-xl cursor-pointer group"
			onClick={onClick}
		>
			<img
				alt={alt}
				src={src}
				className={cn(
					'w-full h-auto block opacity-0 transition-all duration-700 ease-out group-hover:scale-105',
					{
						'opacity-100': isInView && !isLoading,
					},
				)}
				onLoad={() => setIsLoading(false)}
				onError={() => setHasError(true)}
				loading="lazy"
			/>

			{/* Hover Overlay */}
			<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
				<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-neutral-900/90 px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200">
					Click to view
				</div>
			</div>
		</div>
	);
}
