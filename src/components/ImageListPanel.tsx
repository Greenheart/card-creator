import React, { useContext, useMemo } from 'react';
import { Identity, NamedIdentity } from '../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../Contexts';
import { ItemListPanel } from './ItemListPanel';

type Props = {
    selectedImage?: Identity;
    images: (NamedIdentity & {
        imageSrc: string;
    })[];
    onImageSelected: (card: Identity) => void;
    onAddImage?: () => void;
}

export const ImageListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {images, onImageSelected, onAddImage} = props;

    return (
        <ItemListPanel<{imageSrc: string}>
            title='Images'
            emptyInfo='No images added'
            renderPreview={(i) => (
                <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, width: 144}]} />
            )}
            items={images}
            onAddItem={onAddImage}
            onItemSelected={onImageSelected}
        />
    );
}

type ImageListPanelProps = {
    onImageSelected?: (card: Identity) => void;
    onAddImage?: () => void;
}

export const ImageListPanel: React.FunctionComponent<ImageListPanelProps> = (props) => {
    const images = useContext(ImagesContext);

    const onImageSelected = props.onImageSelected === undefined ? () => {} : props.onImageSelected;
    const onAddImage = props.onAddImage;

    const imageList = useMemo(() => images.items.map(item => ({
        id: item.id,
        name: item.name,
        imageSrc: item.src,
    })), [images]);

    return (
        <ImageListPanelCore
            images={imageList}
            onImageSelected={onImageSelected}
            onAddImage={onAddImage}
        />
    );
}