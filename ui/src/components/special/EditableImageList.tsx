import React from 'react';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Divider, CloseButton, ActionIcon, Image, ScrollArea, FileButton, Loader, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { notify } from 'utils';
import { gql, useMutation } from '@apollo/client';

type EditableListProps = {
  label?: string;
  id?: string;
  value?: string[];
  onChange?: (items: string[]) => void;
  error?: string;
};

const SINGLE_UPLOAD = gql`
  mutation SingleUpload($file: Upload!) {
    SingleUpload(file: $file) {
      name
      link
    }
  }
`;

/**
 * @param id custom dnd id
 */

const EditableImageList = ({ label = 'Images', value: images = [], id, onChange: setImages, error }: EditableListProps) => {
  const [upload, { loading, error: uploadError, data, reset }] = useMutation<{ SingleUpload: { name: string; link: string } }>(SINGLE_UPLOAD);

  React.useEffect(() => {
    if (!uploadError) return;
    notify.error(uploadError.message);
  }, [uploadError]);

  const [state, { reorder, prepend, remove, setState }] = useListState(images);

  React.useEffect(() => {
    setState(images);
  }, [images, setState]);

  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    if (!update || !setImages) return;
    setImages(state);
    setUpdate(false);
  }, [update, setImages, state]);

  const action = React.useCallback(<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>): ReturnType<F> => {
    const result = fn(...args);
    setUpdate(true);
    return result;
  }, []);

  const prependRef = React.useRef(prepend);
  prependRef.current = prepend;

  React.useEffect(() => {
    if (!data) return;
    action(prependRef.current, data.SingleUpload.link);
    reset();
  }, [action, data, reset]);

  return (
    <div className="border border-solid p-2.5 rounded border-gray-300">
      {label && <Divider label={label} labelPosition="center" className="mb-2" />}

      <DragDropContext onDragEnd={({ destination, source }) => action(reorder, { from: source.index, to: destination?.index || 0 })}>
        <Droppable droppableId={id || 'dnd-list'} direction="horizontal">
          {(provided, snapshot) => (
            <ScrollArea>
              <div //
                className={clsx('flex gap-1.5 items-center transition ease delay-100', snapshot.isDraggingOver && 'bg-gray-100')}
                {...provided.droppableProps}
                ref={provided.innerRef}>
                <FileButton //
                  onChange={file => file && upload({ variables: { file } })}
                  accept="image/png,image/jpeg">
                  {props => (
                    <ActionIcon //
                      variant="default"
                      className={clsx('w-60 h-auto self-stretch h-48', loading && 'pointer-events-none')}
                      {...props}>
                      {loading ? <Loader /> : <IconPlus />}
                    </ActionIcon>
                  )}
                </FileButton>

                {state.map((item, index) => (
                  <Draggable key={index} index={index} draggableId={`${id || 'dnd-list'}-item-${index}`}>
                    {(provided, snapshot) => {
                      return (
                        <div //
                          className={clsx('flex-none relative w-60', snapshot.isDragging && 'bg-white opacity-70')}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}>
                          <div className="h-48 overflow-y-hidden flex items-center">
                            <Image //
                              radius="sm"
                              src={item}
                              className="cursor-grab"
                              fit="contain"
                            />
                          </div>

                          <CloseButton //
                            color="blue"
                            className="absolute top-0 right-0"
                            onClick={() => action(remove, index)}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </ScrollArea>
          )}
        </Droppable>
      </DragDropContext>
      {error && (
        <Text size="xs" color="red" className="mt-1.5">
          {error}
        </Text>
      )}
    </div>
  );
};

export default EditableImageList;
