'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface Category {
	id: string;
	name: string;
	nameFa: string;
}

export function ImageGallery() {
	const t = useTranslations('gallery');
	const locale = useLocale();
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [galleryImages, setGalleryImages] = useState<any[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

	// Fetch data
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const categoriesRes = await fetch('/api/gallery/categories');
				const categoriesData = await categoriesRes.json();
				setCategories(categoriesData);

				const url = selectedCategory === 'all' 
					? '/api/gallery' 
					: `/api/gallery?categoryId=${selectedCategory}`;
				
				const imagesRes = await fetch(url);
				const imagesData = await imagesRes.json();
				setGalleryImages(imagesData);
			} catch (error) {
				console.error('Failed to load gallery data');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [selectedCategory]);

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
	}, [selectedImage, galleryImages]);

	// Distribute images into columns for masonry layout
	const getColumns = (images: any[]) => {
		const columns: any[][] = [[], [], []];
		images.forEach((image, index) => {
			columns[index % 3].push(image);
		});
		return columns;
	};

	return (
		<div className="w-full space-y-8">
			{/* Category Filter */}
			{!loading && categories.length > 0 && (
				<div className="flex flex-wrap justify-center gap-2 mb-8">
					<button
						onClick={() => setSelectedCategory('all')}
						className={cn(
							"px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
							selectedCategory === 'all'
								? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200"
								: "bg-white text-gray-600 border-gray-100 hover:border-red-200 hover:bg-red-50"
						)}
					>
						{t('all')}
					</button>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={cn(
								"px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
								selectedCategory === category.id
									? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200"
									: "bg-white text-gray-600 border-gray-100 hover:border-red-200 hover:bg-red-50"
							)}
						>
							{locale === 'fa' ? category.nameFa : category.name}
						</button>
					))}
				</div>
			)}

			<div className="relative min-h-[400px]">
				{loading ? (
					<div className="flex justify-center p-20">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
					</div>
				) : (
					<AnimatePresence mode="wait">
						{galleryImages.length === 0 ? (
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="text-center py-20 text-gray-400 font-medium"
							>
								No images found in this category.
							</motion.div>
						) : (
							<motion.div
								key={selectedCategory}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.4 }}
								className="mx-auto grid w-full max-w-6xl gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
							>
								{getColumns(galleryImages).map((columnImages, colIndex) => (
									<div key={colIndex} className="grid gap-4 content-start">
										{columnImages.map((image, imgIndex) => {
											const globalIndex = galleryImages.findIndex(img => img.src === image.src);
											return (
												<GalleryImage
													key={image.id}
													alt={image.alt}
													src={image.src}
													onClick={() => openLightbox(globalIndex)}
												/>
											);
										})}
									</div>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedImage !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
						onClick={closeLightbox}
					>
						{/* Close Button */}
						<button
							onClick={closeLightbox}
							className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white hover:rotate-90 duration-300"
						>
							<X className="w-8 h-8" />
						</button>

						{/* Navigation Buttons */}
						<div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
							<button
								onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
								className="p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all text-white pointer-events-auto group hidden md:block"
							>
								<ChevronLeft className="w-10 h-10 group-hover:-translate-x-1 transition-transform" />
							</button>

							<button
								onClick={(e) => { e.stopPropagation(); goToNext(); }}
								className="p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all text-white pointer-events-auto group hidden md:block"
							>
								<ChevronRight className="w-10 h-10 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>

						{/* Image */}
						<motion.div
							key={selectedImage}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center gap-4"
							onClick={(e) => e.stopPropagation()}
						>
							<img
								src={galleryImages[selectedImage].src}
								alt={galleryImages[selectedImage].alt}
								className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
							/>
							
							{/* Details / Counter */}
							<div className="flex flex-col items-center gap-2">
								<p className="text-white text-lg font-medium">
									{galleryImages[selectedImage].alt}
								</p>
								<div className="text-white/60 text-sm font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
									{selectedImage + 1} / {galleryImages.length}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

interface GalleryImageProps {
	alt: string;
	src: string;
	onClick: () => void;
}

function GalleryImage({ alt, src, onClick }: GalleryImageProps) {
	const ref = React.useRef(null);
	const isInView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	if (hasError) return null;

	return (
		<motion.div
			ref={ref}
			layout
			initial={{ opacity: 0, scale: 0.9 }}
			animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.4 }}
			className="relative overflow-hidden rounded-2xl cursor-pointer group bg-gray-100"
			onClick={onClick}
		>
			<img
				alt={alt}
				src={src}
				className={cn(
					'w-full h-auto block transition-all duration-700 ease-out group-hover:scale-110',
					isLoading ? 'opacity-0' : 'opacity-100',
				)}
				onLoad={() => setIsLoading(false)}
				onError={() => setHasError(true)}
				loading="lazy"
			/>

			{/* Hover Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
				<div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
					<p className="text-white font-medium text-lg drop-shadow-md">
						{alt}
					</p>
					<span className="text-white/80 text-sm">
						View Image
					</span>
				</div>
			</div>
			
			{/* Zoom Icon indicator */}
			<div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
				<ChevronRight className="w-5 h-5 text-white rotate-45" />
			</div>

			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
				</div>
			)}
		</motion.div>
	);
}
