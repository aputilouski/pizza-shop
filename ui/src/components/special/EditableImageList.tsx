import React from 'react';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Divider, CloseButton, ActionIcon, Image, ScrollArea, FileButton } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

const images = [
  'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80', //
  'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
];

type EditableListProps = {
  label?: string;
  id?: string;
  value?: string[];
  onUpdate?: (items: string[]) => void;
};

const EditableImageList = ({ label, value = images, id, onUpdate }: EditableListProps) => {
  const [state, { reorder, prepend, remove }] = useListState(value);

  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    if (!update || !onUpdate) return;
    onUpdate(state);
    setUpdate(false);
  }, [update, onUpdate, state]);

  const action = React.useCallback(<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>): ReturnType<F> => {
    const result = fn(...args);
    setUpdate(true);
    return result;
  }, []);

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
                <FileButton onChange={data => console.log(data)} accept="image/png,image/jpeg">
                  {props => (
                    <ActionIcon variant="default" className="w-60 h-auto self-stretch" {...props}>
                      <IconPlus />
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
                          <Image //
                            radius="sm"
                            src={item}
                            className="cursor-grab"
                          />
                          <CloseButton //
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
    </div>
  );
};

export default EditableImageList;
