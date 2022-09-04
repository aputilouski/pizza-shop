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
  const [open, setOpen] = React.useState(false);

  const timerID = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (open) return;
    timerID.current = setTimeout(setImages.bind(undefined, []), 1000);
  }, [open]);

  const preview = React.useCallback((images: string[]) => {
    clearTimeout(timerID.current);
    setImages(images);
    setOpen(true);
  }, []);

  return (
    <PreviewContext.Provider value={preview}>
      <Modal //
        centered
        size={1024}
        withCloseButton={false}
        opened={open}
        onClose={() => setOpen(false)}>
        <ImageSlider images={images} />
      </Modal>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => React.useContext(PreviewContext);
