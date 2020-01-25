import React, { useMemo, useContext } from 'react';
import { Dialog } from 'office-ui-fabric-react';

import { AddImageModal } from './AddImageModal';
import { AddCardModal } from './AddCardModal';
import { ExportGameWorldModal } from './ExportGameWorldModal';
import { exportGameWorld } from '../../io/export'
import { Navigation } from '../../Navigation';
import { ImagesContext, CardsContext } from '../../Contexts';
import { CardType } from '../../Types';

type Props = {
    nav: Navigation;
    setData<T>(id: string, data: T): void;
}

export const ModalControl: React.FunctionComponent<Props> = ({nav, setData}) => {
    const images = useContext(ImagesContext);
    const cards = useContext(CardsContext);
    const modalId = nav.modal;
    const modalContentMap = useMemo<{[x: string]: {title: string, content: JSX.Element}}>(() => ({
        add_image: {
            title: 'Add Image',
            content: <AddImageModal
                onAddImage={(name, src) => {
                    const id = 'image-' + Date.now();
                    images.create({
                        id: id,
                        name: name,
                        src: src,
                        tags: [],
                    });
                    nav.closeModal();
                }}
                onCancel={() => nav.closeModal()}
            />
        },
        add_card: {
            title: 'Add Card',
            content: <AddCardModal
                onAddCard={(name: string) => {
                    const id = 'image-' + Date.now();
                    cards.create({
                        id: id,
                        type: CardType.Action,
                        name: name,
                        text: '',
                        conditions: [],
                        location: '',
                        actions: [],
                    });
                    nav.closeModal();
                }}
                onCancel={() => nav.closeModal()}
            />
        },
        export_game_world: {
            title: 'Export Game World',
            content: <ExportGameWorldModal
                onExport={(id: string) => {
                    const gameWorldId = 'game_world:' + id;
                    const gameWorld = exportGameWorld({ cards, images });
                    setData(gameWorldId, gameWorld);
                    nav.closeModal();
                }}
                onCancel={() => nav.closeModal()}
            />
        }
    }), [nav, cards, images, setData]);
    const modalContent = modalId && modalContentMap[modalId];

    return (
        <Dialog
            hidden={!modalContent}
            modalProps={{isBlocking: true}}
            title={modalContent ? modalContent.title : ''}
        >
            {modalContent && modalContent.content}
        </Dialog>
    );
}