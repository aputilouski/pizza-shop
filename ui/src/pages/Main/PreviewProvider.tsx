import React from 'react';
import { Modal, Image, Center } from '@mantine/core';
import { Carousel } from '@mantine/carousel';

const ImageSlider = ({ images }: { images: string[] }) => (
  <Carousel //
    withIndicators
    slideGap="md">
    {images.map((src, i) => (
      <Carousel.Slide key={i}>
        <div className="text-center">
          <Center inline>
            <Image radius="md" src={src} />
          </Center>
        </div>
      </Carousel.Slide>
    ))}
  </Carousel>
);

const PreviewContext = React.createContext<(images: string[]) => void>(() => {});

export const ProvidePreview = ({ children }: { children: React.ReactNode }) => {
  const [images, setImages] = React.useState<string[]>([]);
  return (
    <PreviewContext.Provider value={setImages}>
      <Modal //
        size={1024}
        withCloseButton={false}
        opened={Boolean(images.length)}
        onClose={() => setImages([])}>
        <ImageSlider images={images} />
      </Modal>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => React.useContext(PreviewContext);
