import { useEffect, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { PreparedPhotoSwipeOptions } from "photoswipe";

/**
 * Interface para representar uma imagem no Lightbox
 */
interface Image {
  src: string;
  alt: string;
  height: number;
  width: number;
  element?: HTMLElement; // Adicionado para associar o elemento DOM
}

/**
 * Props do componente Lightbox
 */
interface LightboxProps {
  images?: Image[];
  open: boolean;
  index: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Componente Lightbox para exibição de imagens em um slideshow.
 */
export const Lightbox = ({ images, open, index, setOpen }: LightboxProps) => {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      const options: any = {
        dataSource: images,
        bgOpacity: 0.95,
        indexIndicatorSep: " de ",
        closeTitle: "Fechar",
        zoomTitle: "Zoom",
        arrowPrevTitle: "Anterior",
        arrowNextTitle: "Próximo",
        errorMsg: "A imagem não foi carregada corretamente",
        initialZoomLevel: "fit",
        secondaryZoomLevel: 1.3,
        wheelToZoom: true,
        showHideAnimationType: "zoom",

        getThumbBoundsFn: (thumbIndex: number) => {
          if (images && images[thumbIndex]?.element) {
            const thumb = images[thumbIndex].element!.getBoundingClientRect();
            return {
              x: thumb.left,
              y: thumb.top,
              w: thumb.width,
            };
          }
          return { x: 0, y: 0, w: 0 };
        },
        pswpModule: () => import("photoswipe"),
      };

      lightboxRef.current = new PhotoSwipeLightbox(options);
      lightboxRef.current.on("close", () => {
        setOpen(false);
      });
      lightboxRef.current.on("destroy", () => {
        setOpen(false);
      });

      lightboxRef.current.init();

      if (open) {
        lightboxRef.current.loadAndOpen(index > 0 ? index : 0);
      }
    }

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [images, open, index, setOpen]);

  return null;
};