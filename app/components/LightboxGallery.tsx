"use client";

import { useState } from "react";
import FsLightbox from "fslightbox-react";
import Image from "next/image";

interface Props {
  images: string[];
}

export default function LightboxGallery({ images }: Props) {
  const [toggler, setToggler] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);

  const openLightbox = (index: number) => {
    setSlideIndex(index + 1);
    setToggler(!toggler);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <Image
              src={src}
              alt={`Sản phẩm vàng bạc ${i + 1}`}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
              priority
            />
          </div>
        ))}
      </div>

      <FsLightbox
        toggler={toggler}
        sources={images}
        slide={slideIndex}
        type="image"
      />
    </>
  );
}
